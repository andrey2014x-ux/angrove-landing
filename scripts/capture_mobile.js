import { spawn } from 'child_process';
import fs from 'fs';

async function captureMobile() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9335',
    '--user-data-dir=/tmp/chrome_test_profile_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const verRes = await fetch('http://127.0.0.1:9335/json/version');
      verJson = await verRes.json();
      break;
    } catch (e) {}
  }
  if (!verJson) {
    chrome.kill();
    return;
  }

  const ws = new WebSocket(verJson.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id).resolve(msg.result);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    pending.set(msgId, { resolve: res });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const pageWs = new WebSocket(`ws://127.0.0.1:9335/devtools/page/${targetId}`);
  await new Promise(r => pageWs.onopen = r);

  let pId = 1;
  const pPending = new Map();
  pageWs.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pPending.has(msg.id)) {
      pPending.get(msg.id).resolve(msg.result);
      pPending.delete(msg.id);
    }
  };
  const pSend = (method, params = {}) => new Promise(res => {
    const msgId = pId++;
    pPending.set(msgId, { resolve: res });
    pageWs.send(JSON.stringify({ id: msgId, method, params }));
  });

  await pSend('Page.enable');
  await pSend('Runtime.enable');
  await pSend('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  // Services Mobile
  await pSend('Runtime.evaluate', { expression: "document.getElementById('services')?.scrollIntoView({ behavior: 'instant' });" });
  await new Promise(r => setTimeout(r, 600));
  let shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/mobile_services.png', Buffer.from(shot.data, 'base64'));

  // Cases Mobile
  await pSend('Runtime.evaluate', { expression: "document.getElementById('cases')?.scrollIntoView({ behavior: 'instant' });" });
  await new Promise(r => setTimeout(r, 600));
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/mobile_cases.png', Buffer.from(shot.data, 'base64'));

  console.log('Mobile screenshots captured!');
  pageWs.close();
  ws.close();
  chrome.kill();
}

captureMobile().catch(console.error);
