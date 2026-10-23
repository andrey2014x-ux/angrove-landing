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

    // Test Mobile 390x844
    console.log('Testing Mobile 390x844...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 1500));

    // Check DOM widths & scrollWidth
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 1) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || '').toString().slice(0, 50),
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
          }
        });
        return { docWidth, scrollWidth, winWidth, overflowing: overflowing.slice(0, 10) };
      })()`,
      returnByValue: true
    });

    console.log('Mobile DOM check:', JSON.stringify(evalRes.result.value, null, 2));

    // Screenshot Mobile Viewport
    const mobileScreen = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 390, height: 844, scale: 1 }
    });
    fs.writeFileSync('screenshots/mobile_hero_390.png', Buffer.from(mobileScreen.data, 'base64'));
    console.log('Saved mobile_hero_390.png');

    // Screenshot Mobile Full Page
    const mobileFull = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    fs.writeFileSync('screenshots/mobile_full_390.png', Buffer.from(mobileFull.data, 'base64'));
    console.log('Saved mobile_full_390.png');

    // Screenshot Mobile FAQ / About
    await send('Runtime.evaluate', {
      expression: `document.getElementById('about')?.scrollIntoView();`
    });
    await new Promise(r => setTimeout(r, 600));
    const mobileAbout = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 390, height: 844, scale: 1 }
    });
    fs.writeFileSync('screenshots/mobile_about_390.png', Buffer.from(mobileAbout.data, 'base64'));
    console.log('Saved mobile_about_390.png');

    // Test Privacy Page
    console.log('Testing Privacy page...');
    await send('Page.navigate', { url: 'http://localhost:4173/privacy' });
    await new Promise(r => setTimeout(r, 1000));
    const privacyScreen = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 390, height: 844, scale: 1 }
    });
    fs.writeFileSync('screenshots/mobile_privacy_390.png', Buffer.from(privacyScreen.data, 'base64'));
    console.log('Saved mobile_privacy_390.png');

    // Return to main page and test Desktop 1440x900
    console.log('Testing Desktop 1440x900...');
    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 1800));

    const deskScreen = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 }
    });
    fs.writeFileSync('screenshots/desktop_hero_1440.png', Buffer.from(deskScreen.data, 'base64'));
    console.log('Saved desktop_hero_1440.png');

    const deskFull = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    fs.writeFileSync('screenshots/desktop_full_1440.png', Buffer.from(deskFull.data, 'base64'));
    console.log('Saved desktop_full_1440.png');

    browserWs.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
