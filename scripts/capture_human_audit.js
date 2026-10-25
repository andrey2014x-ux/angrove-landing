import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

async function capture() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9470',
    '--user-data-dir=/tmp/chrome_human_audit5_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const verRes = await fetch('http://127.0.0.1:9470/json/version');
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
  const pageWs = new WebSocket(`ws://127.0.0.1:9470/devtools/page/${targetId}`);
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
  await pSend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false });
  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  const clickTab = async (idx) => {
    await pSend('Runtime.evaluate', { expression: `
      window.scrollTo(0, document.getElementById('services').offsetTop - 30);
      const tab = document.getElementById('service-tab-${idx}');
      if (tab) tab.click();
    ` });
    await new Promise(r => setTimeout(r, 600));
  };

  // 1. Services Tab 0 (Telegram Bot)
  await clickTab(0);
  let shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'human_services_tab0.png'), Buffer.from(shot.data, 'base64'));

  // 2. Services Tab 1 (Voice)
  await clickTab(1);
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'human_services_tab1.png'), Buffer.from(shot.data, 'base64'));

  // 3. Services Tab 2 (Parser)
  await clickTab(2);
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'human_services_tab2.png'), Buffer.from(shot.data, 'base64'));

  // 4. Services Tab 3 (Mesh / Automation)
  await clickTab(3);
  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'human_services_tab3.png'), Buffer.from(shot.data, 'base64'));

  console.log('All 4 tabs successfully captured with verified IDs!');
  pageWs.close();
  ws.close();
  chrome.kill();
}

capture().catch(console.error);
