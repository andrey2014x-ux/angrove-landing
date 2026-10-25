import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9515',
    '--user-data-dir=/tmp/c_proc_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch('http://127.0.0.1:9515/json/version');
      verJson = await res.json();
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
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id).resolve(d.result);
      pending.delete(d.id);
    }
  };
  const send = (m, p = {}) => new Promise(res => {
    const mid = id++;
    pending.set(mid, { resolve: res });
    ws.send(JSON.stringify({ id: mid, method: m, params: p }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const pws = new WebSocket(`ws://127.0.0.1:9515/devtools/page/${targetId}`);
  await new Promise(r => pws.onopen = r);

  let pid = 1;
  const pPending = new Map();
  pws.onmessage = e => {
    const d = JSON.parse(e.data);
    if (d.id && pPending.has(d.id)) {
      pPending.get(d.id).resolve(d.result);
      pPending.delete(d.id);
    }
  };
  const psend = (m, p = {}) => new Promise(res => {
    const mid = pid++;
    pPending.set(mid, { resolve: res });
    pws.send(JSON.stringify({ id: mid, method: m, params: p }));
  });

  await psend('Page.enable');
  await psend('Runtime.enable');
  await psend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false });
  await psend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Process Section screenshot
  await psend('Runtime.evaluate', { expression: "document.getElementById('process')?.scrollIntoView({ behavior: 'instant' });" });
  await new Promise(r => setTimeout(r, 800));
  let shot = await psend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'clean_flow_process.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved: clean_flow_process.png');

  // 2. Top Header without Cases
  await psend('Runtime.evaluate', { expression: "window.scrollTo(0, 0);" });
  await new Promise(r => setTimeout(r, 500));
  shot = await psend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'clean_flow_header.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved: clean_flow_header.png');

  pws.close();
  ws.close();
  chrome.kill();
  console.log('Done flow captures!');
}

main().catch(console.error);
