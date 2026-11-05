import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-first-run',
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const resp = await fetch('http://127.0.0.1:9222/json');
  const tabs = await resp.json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const wsUrl = pageTab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let idCounter = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = idCounter++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  // Set accurate iPhone 14 / modern smartphone viewport
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Emulation.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  console.log('Navigating to https://angrove.ru/...');
  await send('Page.navigate', { url: 'https://angrove.ru/' });
  await new Promise(r => setTimeout(r, 3500));

  // Run DOM layout audit on elements
  const auditRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const issues = [];
      const innerW = window.innerWidth;
      
      // 1. Check for horizontal overflow
      const docW = document.documentElement.scrollWidth;
      const bodyW = document.body.scrollWidth;
      
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.right > innerW + 1) {
          issues.push({
            type: 'overflow_right',
            tag: el.tagName,
            class: (el.className || '').toString().slice(0, 60),
            rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) },
            text: (el.innerText || '').slice(0, 40)
          });
        }
      }

      // 2. Check font sizes that might be tiny (< 11px) or huge (> 40px)
      const tinyTexts = [];
      for (const el of all) {
        if (el.children.length === 0 && el.innerText && el.innerText.trim().length > 3) {
          const fs = parseFloat(window.getComputedStyle(el).fontSize);
          if (fs < 11) {
            tinyTexts.push({ text: el.innerText.slice(0, 30), fs, tag: el.tagName });
          }
        }
      }

      return {
        viewportWidth: innerW,
        viewportHeight: window.innerHeight,
        docScrollWidth: docW,
        bodyScrollWidth: bodyW,
        overflowIssuesCount: issues.length,
        overflowIssues: issues.slice(0, 15),
        tinyTexts: tinyTexts.slice(0, 5)
      };
    })()`,
    returnByValue: true
  });

  console.log('AUDIT RESULT:', JSON.stringify(auditRes.result.value, null, 2));

  const artifactDir = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119';

  // Helper to take screenshot
  const capture = async (name) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.result.data, 'base64');
    await writeFile(`${artifactDir}/${name}.png`, buf);
    console.log(`Saved ${name}.png`);
  };

  // 1. Hero
  await capture('audit_mobile_1_hero');

  // 2. Services
  await send('Runtime.evaluate', { expression: `document.getElementById('services')?.scrollIntoView({ behavior: 'instant' })` });
  await new Promise(r => setTimeout(r, 600));
  await capture('audit_mobile_2_services');

  // 3. Process
  await send('Runtime.evaluate', { expression: `document.getElementById('process')?.scrollIntoView({ behavior: 'instant' })` });
  await new Promise(r => setTimeout(r, 600));
  await capture('audit_mobile_3_process');

  // 4. Guide
  await send('Runtime.evaluate', { expression: `document.getElementById('guide')?.scrollIntoView({ behavior: 'instant' })` });
  await new Promise(r => setTimeout(r, 600));
  await capture('audit_mobile_4_guide');

  // 5. About
  await send('Runtime.evaluate', { expression: `document.getElementById('about')?.scrollIntoView({ behavior: 'instant' })` });
  await new Promise(r => setTimeout(r, 600));
  await capture('audit_mobile_5_about');

  // 6. FAQ
  await send('Runtime.evaluate', { expression: `document.getElementById('faq')?.scrollIntoView({ behavior: 'instant' })` });
  await new Promise(r => setTimeout(r, 600));
  await capture('audit_mobile_6_faq');

  // 7. Footer
  await send('Runtime.evaluate', { expression: `document.getElementById('footer')?.scrollIntoView({ behavior: 'instant' })` });
  await new Promise(r => setTimeout(r, 600));
  await capture('audit_mobile_7_footer');

  ws.close();
} finally {
  chrome.kill();
}
