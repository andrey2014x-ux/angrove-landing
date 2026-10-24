import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/angrove/.gemini/antigravity/scratch/angrove-landing/screenshots';

async function test() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9362',
    '--user-data-dir=/tmp/chrome_3d_' + Date.now(),
    '--use-gl=angle',
    '--use-angle=metal',
    '--enable-webgl',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9362/json/version');
      verJson = await res.json();
      break;
    } catch(e) {}
  }
  if (!verJson) { chrome.kill(); return; }

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
  const pageWs = new WebSocket(`ws://127.0.0.1:9362/devtools/page/${targetId}`);
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
  await pSend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to services
  await pSend('Runtime.evaluate', { expression: 'window.scrollTo({ top: 920, behavior: "instant" }); window.dispatchEvent(new Event("scroll"));' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Initial Telegram interface
  let shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'telegram_chat_initial.png'), Buffer.from(shot.data, 'base64'));

  // 2. Click a quick suggestion chip: "У меня студия ремонта, как поможет?"
  await pSend('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chip = buttons.find(b => b.textContent && b.textContent.includes('студия ремонта'));
      if (chip) chip.click();
    })()`
  });
  // Wait for typing indicator & AI answer
  await new Promise(r => setTimeout(r, 1500));

  shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'telegram_chat_ai_reply.png'), Buffer.from(shot.data, 'base64'));

  console.log('Screenshots saved: telegram_chat_initial.png and telegram_chat_ai_reply.png');
  pageWs.close();
  ws.close();
  chrome.kill();
}

test().catch(console.error);
