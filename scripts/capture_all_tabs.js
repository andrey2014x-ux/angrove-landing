import { spawn } from 'child_process';
import fs from 'fs';

async function captureAllTabs() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9334',
    '--user-data-dir=/tmp/chrome_test_profile_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const verRes = await fetch('http://127.0.0.1:9334/json/version');
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
  const pageWs = new WebSocket(`ws://127.0.0.1:9334/devtools/page/${targetId}`);
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
  await pSend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false });
  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  // Services Tab 0
  await pSend('Runtime.evaluate', { expression: "document.getElementById('services')?.scrollIntoView({ behavior: 'instant' });" });
  await new Promise(r => setTimeout(r, 600));
  let shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/services_tab0.png', Buffer.from(shot.data, 'base64'));

  // Services Tab 1 (Voice)
  await pSend('Runtime.evaluate', { expression: "document.querySelectorAll('#services button')[1]?.click();" });
  await new Promise(r => setTimeout(r, 600));
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/services_tab1_voice.png', Buffer.from(shot.data, 'base64'));

  // Services Tab 2 (Parsers)
  await pSend('Runtime.evaluate', { expression: "document.querySelectorAll('#services button')[2]?.click();" });
  await new Promise(r => setTimeout(r, 600));
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/services_tab2_parsers.png', Buffer.from(shot.data, 'base64'));

  // Services Tab 3 (Integrations)
  await pSend('Runtime.evaluate', { expression: "document.querySelectorAll('#services button')[3]?.click();" });
  await new Promise(r => setTimeout(r, 600));
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/services_tab3_integrations.png', Buffer.from(shot.data, 'base64'));

  // Cases Tab 0
  await pSend('Runtime.evaluate', { expression: "document.getElementById('cases')?.scrollIntoView({ behavior: 'instant' });" });
  await new Promise(r => setTimeout(r, 600));
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/cases_tab0.png', Buffer.from(shot.data, 'base64'));

  // Cases Tab 1 (Assistant)
  await pSend('Runtime.evaluate', { expression: "document.querySelectorAll('#cases button')[1]?.click();" });
  await new Promise(r => setTimeout(r, 600));
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/cases_tab1_assistant.png', Buffer.from(shot.data, 'base64'));

  // Cases Tab 2 (Digest)
  await pSend('Runtime.evaluate', { expression: "document.querySelectorAll('#cases button')[2]?.click();" });
  await new Promise(r => setTimeout(r, 600));
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/cases_tab2_digest.png', Buffer.from(shot.data, 'base64'));

  console.log('All tabs captured!');
  pageWs.close();
  ws.close();
  chrome.kill();
}

captureAllTabs().catch(console.error);
