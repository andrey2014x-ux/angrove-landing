import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  let verJson = null;
  for (let i = 0; i < 15; i++) {
    try {
      const verRes = await fetch('http://127.0.0.1:9222/json/version');
      verJson = await verRes.json();
      break;
    } catch {
      await new Promise(r => setTimeout(r, 400));
    }
  }

  if (!verJson) {
    throw new Error('Could not connect to Chrome debugging port');
  }

  try {
    const browserWs = new WebSocket(verJson.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();

    browserWs.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    const bSend = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        pending.set(msgId, { resolve, reject });
        browserWs.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await new Promise(r => browserWs.onopen = r);

    const { targetId } = await bSend('Target.createTarget', { url: 'http://localhost:4173/' });
    const { sessionId } = await bSend('Target.attachToTarget', { targetId, flatten: true });

    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        pending.set(msgId, { resolve, reject });
        browserWs.send(JSON.stringify({ id: msgId, sessionId, method, params }));
      });
    };

    await send('Page.enable');
    await send('DOM.enable');

    fs.mkdirSync('screenshots', { recursive: true });

    const captureElement = async (selector, filename) => {
      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${selector}');
          if (!el) return null;
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.scrollBy(0, -90);
          const rect = el.getBoundingClientRect();
          return {
            x: Math.max(0, rect.left + window.scrollX),
            y: Math.max(0, rect.top + window.scrollY),
            width: rect.width,
            height: rect.height
          };
        })()`,
        returnByValue: true
      });

      const clip = evalRes.result?.value;
      if (!clip || clip.width === 0 || clip.height === 0) {
        console.warn('Could not clip selector:', selector);
        return;
      }

      await new Promise(r => setTimeout(r, 600));

      const screen = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: clip.x,
          y: clip.y,
          width: clip.width,
          height: Math.min(clip.height, 4000),
          scale: 1
        },
        captureBeyondViewport: true
      });
      fs.writeFileSync(`screenshots/${filename}`, Buffer.from(screen.data, 'base64'));
      console.log(`Saved screenshots/${filename}`);
    };

    // ==========================================
    // 1. DESKTOP 1440
    // ==========================================
    console.log('Capturing Desktop 1440...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 2000));

    // Hero
    await captureElement('#hero', 'desktop_01_hero.png');

    // Problems (uncheck/checked state)
    await captureElement('#problems', 'desktop_02_problems.png');
    
    // Click 2 items in checklist to demonstrate checked state + banner
    await send('Runtime.evaluate', {
      expression: `(() => {
        const rows = document.querySelectorAll('.pain-row');
        if (rows[0]) rows[0].click();
        if (rows[1]) rows[1].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    await captureElement('#problems', 'desktop_02_problems_checked.png');

    // Services - Scene 0: Telegram Chat with active chip clicked
    await send('Runtime.evaluate', {
      expression: `(() => {
        const chips = document.querySelectorAll('#services button');
        // click chip 'Сроки запуска?' or first available chip
        if (chips.length > 2) chips[1].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));
    await captureElement('#services', 'desktop_03_services_01_telegram.png');

    // Scene 1: AI-обзвон tab
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = document.querySelectorAll('#services .cursor-pointer');
        if (tabs[1]) tabs[1].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    await captureElement('#services', 'desktop_03_services_02_voice.png');

    // Scene 2: Парсеры
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = document.querySelectorAll('#services .cursor-pointer');
        if (tabs[2]) tabs[2].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    await captureElement('#services', 'desktop_03_services_03_parser.png');

    // Scene 3: Автоматизации
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = document.querySelectorAll('#services .cursor-pointer');
        if (tabs[3]) tabs[3].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    await captureElement('#services', 'desktop_03_services_04_automation.png');

    // Switch back to Telegram for general screenshot
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = document.querySelectorAll('#services .cursor-pointer');
        if (tabs[0]) tabs[0].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    await captureElement('#services', 'desktop_03_services.png');

    // Capture Scheme Mode
    await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('#services button'));
        const schemeBtn = buttons.find(b => b.textContent.includes('Схема работы'));
        if (schemeBtn) schemeBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2200));
    await captureElement('#services', 'desktop_03_services_scheme.png');

    // Switch back to Chat mode
    await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('#services button'));
        const chatBtn = buttons.find(b => b.textContent.includes('Диалог с AI'));
        if (chatBtn) chatBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Practice n8n flow
    await captureElement('#how-it-works', 'desktop_04_n8n_flow.png');

    // Trigger n8n pipeline and wait for completion
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#how-it-works button');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 3400));
    await captureElement('#how-it-works', 'desktop_04_n8n_completed.png');

    // Cases (new block)
    await captureElement('#cases', 'desktop_05_cases.png');

    // Comparison race
    await captureElement('#comparison', 'desktop_06_race.png');

    // Guide Form (1-click card)
    await captureElement('#guide', 'desktop_07_guide.png');

    // About Me
    await captureElement('#about', 'desktop_08_about.png');

    // FAQ
    await captureElement('#faq', 'desktop_09_faq.png');

    // Final CTA
    await captureElement('#final-cta', 'desktop_10_final_cta.png');

    // Footer
    await captureElement('#footer', 'desktop_11_footer.png');

    // Desktop Full Page
    const deskFull = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    fs.writeFileSync('screenshots/desktop_full_1440.png', Buffer.from(deskFull.data, 'base64'));
    console.log('Saved desktop_full_1440.png');

    // ==========================================
    // 2. MOBILE 390
    // ==========================================
    console.log('Capturing Mobile 390...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 2000));

    // Mobile Hero
    const mobHero = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 390, height: 844, scale: 1 }
    });
    fs.writeFileSync('screenshots/mobile_01_hero.png', Buffer.from(mobHero.data, 'base64'));
    console.log('Saved mobile_01_hero.png');

    // Mobile Problems
    await captureElement('#problems', 'mobile_02_problems.png');

    // Click 2 items in checklist on mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const rows = document.querySelectorAll('.pain-row');
        if (rows[0]) rows[0].click();
        if (rows[2]) rows[2].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));
    await captureElement('#problems', 'mobile_02_problems_checked.png');

    // Mobile Services (open second accordion item to verify)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const items = document.querySelectorAll('#services .lg\\\\:hidden .cursor-pointer');
        if (items[1]) items[1].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));
    await captureElement('#services', 'mobile_03_services.png');

    // Mobile n8n flow
    await captureElement('#how-it-works', 'mobile_04_n8n_flow.png');

    // Mobile Cases
    await captureElement('#cases', 'mobile_05_cases.png');

    // Mobile Guide
    await captureElement('#guide', 'mobile_06_guide.png');

    // Mobile About
    await captureElement('#about', 'mobile_07_about.png');

    // Mobile FAQ
    await captureElement('#faq', 'mobile_08_faq.png');

    // Mobile Final CTA
    await captureElement('#final-cta', 'mobile_09_final_cta.png');

    // Mobile Footer
    await captureElement('#footer', 'mobile_10_footer.png');

    // Mobile Full Page
    const mobFull = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    fs.writeFileSync('screenshots/mobile_full_390.png', Buffer.from(mobFull.data, 'base64'));
    console.log('Saved mobile_full_390.png');

    browserWs.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
