import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9599',
    '--user-data-dir=/tmp/c_tab3_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch('http://127.0.0.1:9599/json/version');
      verJson = await res.json();
      break;
    } catch (e) {}
  }
  if (!verJson) return;

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
  const pws = new WebSocket(`ws://127.0.0.1:9599/devtools/page/${targetId}`);
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
  const pSend = (m, p = {}) => new Promise(res => {
    const mid = pid++;
    pPending.set(mid, { resolve: res });
    pws.send(JSON.stringify({ id: mid, method: m, params: p }));
  });

  await pSend('Page.enable');
  await pSend('Runtime.enable');
  await pSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 2,
    mobile: false
  });

  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  // Click on Tab 3 (Автоматизация всех программ)
  await pSend('Runtime.evaluate', {
    expression: `
      const tab3 = document.querySelector('#service-tab-3');
      if (tab3) tab3.click();
      const el = document.querySelector('#services');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot idle
  const shotIdle = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'tab3_flow_idle.png'), Buffer.from(shotIdle.data, 'base64'));
  console.log('Saved tab3_flow_idle.png');

  // Click trigger button
  await pSend('Runtime.evaluate', {
    expression: `
      const btn = document.querySelector('button:has(svg.lucide-play)');
      if (btn) btn.click();
    `
  });

  // Wait 2500ms for full chain to complete and show Telegram modal
  await new Promise(r => setTimeout(r, 2600));

  // Screenshot completed
  const shotCompleted = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'tab3_flow_completed.png'), Buffer.from(shotCompleted.data, 'base64'));
  console.log('Saved tab3_flow_completed.png');

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
