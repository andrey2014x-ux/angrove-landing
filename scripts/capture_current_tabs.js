import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9495',
    '--user-data-dir=/tmp/c_cur_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch('http://127.0.0.1:9495/json/version');
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
  const pws = new WebSocket(`ws://127.0.0.1:9495/devtools/page/${targetId}`);
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

  // Scroll to services
  await psend('Runtime.evaluate', { expression: "document.getElementById('services')?.scrollIntoView({ behavior: 'instant' });" });
  await new Promise(r => setTimeout(r, 400));

  const tabsInfo = [
    { idx: 0, file: 'human_services_tab0.png', name: 'Telegram AI-Bot' },
    { idx: 1, file: 'human_services_tab1.png', name: 'Voice AI Helper' },
    { idx: 2, file: 'human_services_tab2.png', name: 'Client DB Collector' },
    { idx: 3, file: 'human_services_tab3.png', name: 'Business Automation' },
  ];

  for (const t of tabsInfo) {
    const evalRes = await psend('Runtime.evaluate', { expression: `
      (() => {
        const btn = document.getElementById('service-tab-${t.idx}');
        if (!btn) return 'BUTTON NOT FOUND';
        btn.click();
        return btn.innerText;
      })()
    ` });
    console.log(`Clicked tab ${t.idx}:`, evalRes.result?.value);
    await new Promise(r => setTimeout(r, 600));

    const h3Res = await psend('Runtime.evaluate', { expression: "document.querySelector('#services h3')?.innerText" });
    console.log(`Active H3 for tab ${t.idx}:`, h3Res.result?.value);

    const shot = await psend('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, t.file), Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${t.file}`);
  }

  // FAQ
  await psend('Runtime.evaluate', { expression: `
    document.getElementById('faq')?.scrollIntoView({ behavior: 'instant' });
    const b0 = document.getElementById('faq-btn-0');
    if (b0 && b0.getAttribute('aria-expanded') !== 'true') b0.click();
  ` });
  await new Promise(r => setTimeout(r, 600));
  const faqShot = await psend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'human_faq_opened.png'), Buffer.from(faqShot.data, 'base64'));
  console.log('Saved screenshot: human_faq_opened.png');

  pws.close();
  ws.close();
  chrome.kill();
  console.log('Done all captures!');
}

main().catch(console.error);
