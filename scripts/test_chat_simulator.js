import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9522',
    '--user-data-dir=/tmp/c_chat_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch('http://127.0.0.1:9522/json/version');
      verJson = await res.json();
      break;
    } catch (e) {}
  }
  if (!verJson) {
    console.error('Failed to connect to Chrome');
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
  const pws = new WebSocket(`ws://127.0.0.1:9522/devtools/page/${targetId}`);
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
  await pSend('DOM.enable');
  await pSend('Runtime.enable');

  await pSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  console.log('Navigating to http://localhost:4174...');
  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2500));

  // Scroll to services / chat simulator
  await pSend('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('#services');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot initial chat simulator
  const shot1 = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'chat_sim_initial.png'), Buffer.from(shot1.data, 'base64'));
  console.log('Saved chat_sim_initial.png');

  // Helper to send message in chat simulator input
  async function sendMessage(text) {
    await pSend('Runtime.evaluate', {
      expression: `
        (() => {
          const input = document.querySelector('input[placeholder*="Написать сообщение"]');
          if (input) {
            // Set input value using React prototype setter
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, ${JSON.stringify(text)});
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `
    });
    await new Promise(r => setTimeout(r, 300));
    // Click send button
    await pSend('Runtime.evaluate', {
      expression: `
        (() => {
          const sendBtn = document.querySelector('button[title*="Отправить"]');
          if (sendBtn) sendBtn.click();
        })()
      `
    });
    // Wait for typing indicator and bot answer (750ms + margin)
    await new Promise(r => setTimeout(r, 1600));
  }

  // 1. Send question about stylist / beauty
  console.log('Sending message: "я стилист, как мне поможет бот?"...');
  await sendMessage('я стилист, как мне поможет бот?');

  // 2. Send question about AI errors / hallucinations
  console.log('Sending message: "а если бот ошибется или соврет клиенту?"...');
  await sendMessage('а если бот ошибется или соврет клиенту?');

  // Capture screenshot after interactions
  const shot2 = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'chat_sim_tested.png'), Buffer.from(shot2.data, 'base64'));
  console.log('Saved chat_sim_tested.png');

  // Also take a focused clip of just the chat container
  const boxRes = await pSend('Runtime.evaluate', {
    expression: `
      (() => {
        const chat = document.querySelector('.telegram-chat-scroll')?.closest('.shadow-\\\\[0_25px_60px_rgba\\\\(0\\\\,0\\\\,0\\\\,0\\\\.4\\\\)\\\\]') 
          || document.querySelector('.telegram-chat-scroll')?.parentElement;
        if (!chat) return null;
        const rect = chat.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      })()
    `,
    returnByValue: true
  });

  if (boxRes?.result?.value) {
    const box = boxRes.result.value;
    const shotClip = await pSend('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, box.x - 20),
        y: Math.max(0, box.y - 20),
        width: box.width + 40,
        height: box.height + 40,
        scale: 2
      }
    });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'chat_sim_focused.png'), Buffer.from(shotClip.data, 'base64'));
    console.log('Saved chat_sim_focused.png');
  }

  chrome.kill();
  console.log('Done testing chat simulator!');
}

main().catch(console.error);
