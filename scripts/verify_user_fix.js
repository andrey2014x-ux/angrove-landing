import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9544',
    '--user-data-dir=/tmp/c_user_fix_' + Date.now(),
    '--disable-gpu',
    '--no-first-run'
  ]);

  let verJson;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch('http://127.0.0.1:9544/json/version');
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
  const pws = new WebSocket(`ws://127.0.0.1:9544/devtools/page/${targetId}`);
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
  await pSend('Input.enable');
  await pSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 2,
    mobile: false
  });

  console.log('Navigating...');
  await pSend('Page.navigate', { url: 'http://localhost:4174' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to services
  await pSend('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('#services');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 600));

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
    await new Promise(r => setTimeout(r, 1500));
  }

  // 1. Exact user query that failed previously
  console.log('Testing: "Запиши меня к андрею"...');
  await sendMessage('Запиши меня к андрею');

  // 2. Follow-up with day/time
  console.log('Testing follow-up: "завтра в 16:00"...');
  await sendMessage('завтра в 16:00');

  // Test Wheel Event on Chat Container
  console.log('Testing wheel scrolling on chat container...');
  const scrollTestResult = await pSend('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.telegram-chat-scroll');
        if (!el) return { error: 'no element' };
        
        const initialScrollTop = el.scrollTop;
        const initialScrollHeight = el.scrollHeight;
        const initialClientHeight = el.clientHeight;

        // Dispatch a synthetic WheelEvent with deltaY = -120 (scroll up)
        const wheelEv = new WheelEvent('wheel', {
          deltaY: -120,
          bubbles: true,
          cancelable: true
        });
        el.dispatchEvent(wheelEv);

        return {
          initialScrollTop,
          initialScrollHeight,
          initialClientHeight,
          afterScrollTop: el.scrollTop,
          canScroll: initialScrollHeight > initialClientHeight
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Scroll test details:', scrollTestResult.result.value);

  // Take screenshot
  const shot = await pSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'chat_sim_user_fixed.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved chat_sim_user_fixed.png');

  chrome.kill();
}

main().catch(console.error);
