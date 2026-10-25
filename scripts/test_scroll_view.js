import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9533',
    '--user-data-dir=/tmp/c_scroll_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch('http://127.0.0.1:9533/json/version');
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
  const pws = new WebSocket(`ws://127.0.0.1:9533/devtools/page/${targetId}`);
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
    height: 950,
    deviceScaleFactor: 2,
    mobile: false
  });

  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  await pSend('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('#services');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // Helper to send message in chat simulator input
  async function sendMessage(text) {
    await pSend('Runtime.evaluate', {
      expression: `
        (() => {
          const input = document.querySelector('input[placeholder*="Написать сообщение"]');
          if (input) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, ${JSON.stringify(text)});
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `
    });
    await new Promise(r => setTimeout(r, 200));
    await pSend('Runtime.evaluate', {
      expression: `
        (() => {
          const sendBtn = document.querySelector('button[title*="Отправить"]');
          if (sendBtn) sendBtn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1400));
  }

  // Send 3 messages so scroll height exceeds container
  await sendMessage('Привет, я стилист. Чем бот поможет?');
  await sendMessage('А если бот ошибется или клиент напишет ночью?');
  await sendMessage('Сколько стоит внедрение?');

  // Scroll to middle of chat container so scrollbar thumb is centered and visible
  await pSend('Runtime.evaluate', {
    expression: `
      (() => {
        const scrollEl = document.querySelector('.telegram-chat-scroll');
        if (scrollEl) {
          scrollEl.scrollTop = scrollEl.scrollHeight / 3;
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'chat_sim_scrolled.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved chat_sim_scrolled.png');

  chrome.kill();
}

main().catch(console.error);
