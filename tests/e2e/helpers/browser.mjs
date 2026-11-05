import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CHROME_PATH = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function launchBrowser({ headless = true, port } = {}) {
  const cdpPort = port || (await getFreePort());
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_e2e_'));

  const args = [
    headless ? '--headless=new' : '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-sync',
    '--disable-translate',
    '--metrics-recording-only',
    '--safebrowsing-disable-auto-update',
    '--mute-audio',
    '--hide-scrollbars'
  ];

  const chromeProc = spawn(CHROME_PATH, args, { stdio: 'ignore' });

  let verJson = null;
  for (let i = 0; i < 40; i++) {
    await delay(150);
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
      if (res.ok) {
        verJson = await res.json();
        break;
      }
    } catch {}
  }

  if (!verJson) {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
    throw new Error(`Failed to connect to Chrome on port ${cdpPort}`);
  }

  const browserWs = new WebSocket(verJson.webSocketDebuggerUrl);
  await new Promise((r) => (browserWs.onopen = r));

  let reqId = 1;
  const browserPending = new Map();
  browserWs.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && browserPending.has(d.id)) {
      const { resolve, reject } = browserPending.get(d.id);
      browserPending.delete(d.id);
      if (d.error) reject(new Error(d.error.message || JSON.stringify(d.error)));
      else resolve(d.result);
    }
  };

  const browserSend = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = reqId++;
      browserPending.set(id, { resolve, reject });
      browserWs.send(JSON.stringify({ id, method, params }));
    });

  const pages = [];

  const createPage = async () => {
    const { targetId } = await browserSend('Target.createTarget', { url: 'about:blank' });
    const pageWs = new WebSocket(`ws://127.0.0.1:${cdpPort}/devtools/page/${targetId}`);
    await new Promise((r) => (pageWs.onopen = r));

    let pId = 1;
    const pagePending = new Map();
    const consoleLogs = [];
    const consoleErrors = [];

    pageWs.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && pagePending.has(msg.id)) {
        const { resolve, reject } = pagePending.get(msg.id);
        pagePending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
        return;
      }

      // Collect console events
      if (msg.method === 'Runtime.consoleAPICalled') {
        const type = msg.params.type;
        const text = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
        consoleLogs.push({ type, text });
        if (type === 'error') {
          consoleErrors.push(text);
        }
      }

      if (msg.method === 'Runtime.exceptionThrown') {
        const text = msg.params.exceptionDetails?.text || 'Uncaught exception';
        consoleErrors.push(text);
      }
    };

    const pSend = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = pId++;
        pagePending.set(id, { resolve, reject });
        pageWs.send(JSON.stringify({ id, method, params }));
      });

    await pSend('Page.enable');
    await pSend('Runtime.enable');

    const page = {
      targetId,
      pSend,
      getConsoleErrors: () => [...consoleErrors],
      getConsoleLogs: () => [...consoleLogs],

      async setViewport({ width = 1440, height = 900, deviceScaleFactor = 1, mobile = false }) {
        await pSend('Emulation.setDeviceMetricsOverride', {
          width,
          height,
          deviceScaleFactor,
          mobile
        });
      },

      async navigate(url, { waitUntil = 'load', delayAfter = 500 } = {}) {
        await pSend('Page.navigate', { url });
        await delay(delayAfter);
      },

      async evaluate(expression) {
        const expr = typeof expression === 'function' ? `(${expression.toString()})()` : expression;
        const res = await pSend('Runtime.evaluate', {
          expression: expr,
          returnByValue: true,
          awaitPromise: true
        });
        if (res.exceptionDetails) {
          throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
        }
        return res.result?.value;
      },

      async waitForSelector(selector, { timeout = 5000, interval = 100 } = {}) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
          const exists = await page.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`);
          if (exists) return true;
          await delay(interval);
        }
        throw new Error(`Timeout ${timeout}ms waiting for selector: ${selector}`);
      },

      async waitForFunction(fnString, { timeout = 5000, interval = 100 } = {}) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
          const res = await page.evaluate(fnString);
          if (res) return res;
          await delay(interval);
        }
        throw new Error(`Timeout ${timeout}ms waiting for function: ${fnString}`);
      },

      async click(selector) {
        await page.evaluate(`(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) throw new Error('Element not found for click: ' + ${JSON.stringify(selector)});
          el.scrollIntoView({ block: 'center' });
          el.click();
        })()`);
        await delay(200);
      },

      async type(selector, text) {
        await page.evaluate(`(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) throw new Error('Element not found for type: ' + ${JSON.stringify(selector)});
          el.focus();
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeInputValueSetter.call(el, ${JSON.stringify(text)});
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        })()`);
        await delay(100);
      },

      async screenshot({ path: savePath, format = 'png' } = {}) {
        const shot = await pSend('Page.captureScreenshot', { format });
        const buf = Buffer.from(shot.data, 'base64');
        if (savePath) {
          fs.writeFileSync(savePath, buf);
        }
        return buf;
      },

      async close() {
        try {
          await browserSend('Target.closeTarget', { targetId });
        } catch {}
        try {
          pageWs.close();
        } catch {}
      }
    };

    pages.push(page);
    return page;
  };

  const close = async () => {
    for (const p of pages) {
      await p.close().catch(() => {});
    }
    try {
      browserWs.close();
    } catch {}
    chromeProc.kill('SIGTERM');
    await delay(300);
    try {
      chromeProc.kill('SIGKILL');
    } catch {}
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  };

  return {
    cdpPort,
    createPage,
    close
  };
}
