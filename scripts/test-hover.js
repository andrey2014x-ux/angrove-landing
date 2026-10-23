import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  let verJson = null;
  for (let i = 0; i < 10; i++) {
    try {
      const verRes = await fetch('http://127.0.0.1:9222/json/version');
      verJson = await verRes.json();
      break;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!verJson) {
    throw new Error('Could not connect to Chrome debugging port');
  }

  try {
    const browserWs = new WebSocket(verJson.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();

    browserWs.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    const bSend = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        pending.set(msgId, { resolve, reject });
        browserWs.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await new Promise(r => browserWs.onopen = r);

    const { targetId } = await bSend('Target.createTarget', { url: 'http://localhost:4173/' });
    const { sessionId } = await bSend('Target.attachToTarget', { targetId, flatten: true });

    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        pending.set(msgId, { resolve, reject });
        browserWs.send(JSON.stringify({ id: msgId, sessionId, method, params }));
      });
    };

    await send('Page.enable');
    await send('DOM.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 1800));

    // Get position of _angrove_ brand monogram
    const boxRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('header a[href="/"]');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
      })()`,
      returnByValue: true
    });

    console.log('Logo coordinates:', boxRes.result.value);
    const coords = boxRes.result.value;

    if (coords) {
      // Move mouse over logo
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: coords.x,
        y: coords.y
      });
      console.log('Mouse hovered over _angrove_');
      await new Promise(r => setTimeout(r, 500));

      // Capture screenshot of Header while hovered
      const hoverScreen = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: 450, height: 160, scale: 2 }
      });
      fs.writeFileSync('screenshots/header_logo_hover_leopard.png', Buffer.from(hoverScreen.data, 'base64'));
      console.log('Saved screenshots/header_logo_hover_leopard.png');
    }

    browserWs.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
