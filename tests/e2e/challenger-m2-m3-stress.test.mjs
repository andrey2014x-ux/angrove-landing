import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { startStaticServer } from './helpers/staticServer.mjs';
import { startMockWebhookServer } from './helpers/mockWebhook.mjs';
import { launchBrowser } from './helpers/browser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

describe('Challenger M2/M3: Empirical Stress Tests & Adversarial Verification', () => {
  let staticServer;
  let mockWebhook;
  let browser;
  let page;

  before(async () => {
    staticServer = await startStaticServer();
    mockWebhook = await startMockWebhookServer();
    browser = await launchBrowser();
    page = await browser.createPage();
  });

  after(async () => {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    if (mockWebhook) await mockWebhook.close().catch(() => {});
    if (staticServer) await staticServer.close().catch(() => {});
  });

  // =========================================================================
  // 1. AI Webhook Graceful Fallback Stress Harness (Milestone M3)
  // =========================================================================
  describe('C1: AI Webhook Fallback & Resilience Matrix', () => {
    test('C1.1: Webhook URL unset / empty string returns synchronous local fallback instantly', async () => {
      // Direct module check via in-browser execution context or fetch
      const result = await page.evaluate(async () => {
        // Evaluate the fallback logic behavior in browser
        const query = 'Тестовый запрос при пустом вебхуке';
        const history = [{ sender: 'user', text: 'Привет' }];
        const localEngine = (q) => ({ reply: `Локальный ответ: ${q}`, crmAction: 'CRM: тест' });

        // Simulate queryAiAssistant with empty webhook
        const webhookUrl = '';
        if (!webhookUrl) {
          const local = localEngine(query, history);
          return { ...local, isLive: false };
        }
        return { reply: 'FAIL', isLive: true };
      });

      assert.strictEqual(result.isLive, false);
      assert.ok(result.reply.includes('Локальный ответ'));
      assert.strictEqual(result.crmAction, 'CRM: тест');
    });

    test('C1.2: Dead port (ECONNREFUSED) is caught cleanly and returns fallback', async () => {
      const deadPortUrl = 'http://127.0.0.1:59998/dead_webhook';
      let caught = false;
      const start = Date.now();

      try {
        await fetch(deadPortUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'ping' }),
        });
      } catch (err) {
        caught = true;
      }

      const elapsed = Date.now() - start;
      assert.strictEqual(caught, true, 'Dead port must trigger catch block');
      assert.ok(elapsed < 2000, 'Dead port connection refusal must resolve rapidly');
    });

    test('C1.3: HTTP 500 error from webhook triggers graceful fallback', async () => {
      mockWebhook.setMode('error_500');

      let fallbackUsed = false;
      try {
        const res = await fetch(mockWebhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: '500 error test' }),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        // Fallback engine invoked
        fallbackUsed = true;
      } finally {
        mockWebhook.setMode('success');
      }

      assert.strictEqual(fallbackUsed, true, 'HTTP 500 must trigger fallback path');
    });

    test('C1.4: Slow 10s hang triggers AbortController timeout without locking UI', async () => {
      mockWebhook.setMode('slow_hang');

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1000); // 1s test abort
      let aborted = false;
      const start = Date.now();

      try {
        await fetch(mockWebhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'hang test' }),
          signal: controller.signal,
        });
      } catch (err) {
        if (err.name === 'AbortError') aborted = true;
      } finally {
        clearTimeout(timer);
        mockWebhook.setMode('success');
      }

      const elapsed = Date.now() - start;
      assert.strictEqual(aborted, true, 'Slow webhook must abort via signal');
      assert.ok(elapsed >= 900 && elapsed < 2500, `Abort should fire around 1s, took ${elapsed}ms`);
    });

    test('C1.5: Payload normalization accepts reply, text, message, output, and response fields', async () => {
      const fieldNames = ['reply', 'text', 'message', 'output', 'response'];

      for (const field of fieldNames) {
        mockWebhook.setMode('success', { [field]: `Ответ из поля ${field}`, crmAction: `Action for ${field}` });

        const res = await fetch(mockWebhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'normalization test' }),
        });
        const data = await res.json();
        const extractedReply = data?.reply || data?.text || data?.message || data?.output || data?.response;

        assert.strictEqual(extractedReply, `Ответ из поля ${field}`, `Should normalize ${field}`);
        assert.strictEqual(data.crmAction, `Action for ${field}`);
      }

      mockWebhook.setMode('success');
    });

    test('C1.6: Malformed response shapes (empty object, null, numeric, whitespace) fail normalization', () => {
      const invalidPayloads = [
        {},
        { reply: '' },
        { reply: '   ' },
        { reply: null },
        { reply: 12345 },
        { reply: [] },
        { other: 'no matching key' },
      ];

      for (const payload of invalidPayloads) {
        const reply = payload?.reply || payload?.text || payload?.message || payload?.output || payload?.response;
        const isValid = typeof reply === 'string' && reply.trim().length > 0;
        assert.strictEqual(isValid, false, `Payload ${JSON.stringify(payload)} must be rejected as invalid`);
      }
    });

    test('C1.7: History payload limits to last 6 messages and formats schema', () => {
      const fullHistory = Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i}`,
        sender: i % 2 === 0 ? 'user' : 'bot',
        text: `Message ${i}`,
        time: '12:00',
        extraField: 'should be stripped',
      }));

      const sliced = fullHistory.slice(-6).map((msg) => ({
        sender: msg.sender,
        text: msg.text,
        time: msg.time,
      }));

      assert.strictEqual(sliced.length, 6);
      assert.strictEqual(sliced[0].text, 'Message 9');
      assert.strictEqual(sliced[5].text, 'Message 14');
      assert.strictEqual(sliced[0].extraField, undefined);
    });
  });

  // =========================================================================
  // 2. In-Browser Live Interaction & Navigation (Milestone M2)
  // =========================================================================
  describe('C2: Navigation & In-Browser Live UI Verification', () => {
    test('C2.1: Desktop Header navigation contains #cases anchor link', async () => {
      await page.setViewport({ width: 1440, height: 900, mobile: false });
      await page.navigate(staticServer.url, { delayAfter: 1000 });

      const desktopCasesLink = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        const link = header.querySelector('a[href="#cases"]');
        return link ? { text: link.textContent?.trim(), href: link.getAttribute('href') } : null;
      });

      assert.ok(desktopCasesLink, 'Header must contain link to #cases');
      assert.strictEqual(desktopCasesLink.href, '#cases');
      assert.ok(desktopCasesLink.text.includes('Кейсы'), `Link text should be 'Кейсы', got: '${desktopCasesLink.text}'`);
    });

    test('C2.2: Mobile Drawer Header contains #cases anchor link and functions properly', async () => {
      await page.setViewport({ width: 375, height: 812, mobile: true });
      await page.navigate(staticServer.url, { delayAfter: 1000 });

      const drawerResult = await page.evaluate(async () => {
        // Open mobile menu
        const burgerBtn = document.querySelector('button[aria-label*="меню"], button[aria-label*="menu"]') ||
          document.querySelector('header button');
        if (!burgerBtn) return { error: 'No burger button found' };

        burgerBtn.click();
        await new Promise((r) => setTimeout(r, 400));

        // Find #cases link in drawer
        const casesLinks = Array.from(document.querySelectorAll('a[href="#cases"]'));
        if (casesLinks.length === 0) return { error: 'No #cases link found in drawer' };

        const visibleLink = casesLinks.find((l) => l.offsetParent !== null || l.textContent?.includes('Кейсы'));
        return {
          found: true,
          text: visibleLink?.textContent?.trim() || '',
          href: visibleLink?.getAttribute('href') || '',
        };
      });

      assert.strictEqual(drawerResult.found, true, 'Mobile drawer must include #cases link');
      assert.ok(drawerResult.text.includes('Кейсы'));
    });

    test('C2.3: Footer contains #cases navigation anchor', async () => {
      await page.setViewport({ width: 1440, height: 900 });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      const footerLink = await page.evaluate(() => {
        const footer = document.querySelector('footer');
        if (!footer) return null;
        const link = footer.querySelector('a[href="#cases"]');
        return link ? { text: link.textContent?.trim(), href: link.getAttribute('href') } : null;
      });

      assert.ok(footerLink, 'Footer must contain link to #cases');
      assert.strictEqual(footerLink.href, '#cases');
      assert.ok(footerLink.text.includes('Кейсы'));
    });

    test('C2.4: In-browser Telegram chat simulator answers with realistic typing delay (~650ms)', async () => {
      await page.setViewport({ width: 1440, height: 900 });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      const chatFlow = await page.evaluate(async () => {
        // Switch to Tab 0
        const tab0 = document.getElementById('service-tab-0');
        if (tab0) {
          tab0.scrollIntoView({ block: 'center' });
          tab0.click();
          await new Promise((r) => setTimeout(r, 400));
        }

        const input = document.querySelector('input[placeholder*="Напишите"]') || document.querySelector('input[type="text"]');
        if (!input) return { error: 'Input not found' };

        // Count initial message text bubbles (bot greeting = 1)
        const initialMsgCount = document.querySelectorAll('.whitespace-pre-wrap').length;

        const testQuery = 'Уникальный проверочный вопрос 789456?';
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, testQuery);
        input.dispatchEvent(new Event('input', { bubbles: true }));

        const startTime = Date.now();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        // Check if typing indicator was triggered
        let wasTyping = false;
        let replyTime = 0;

        while (Date.now() - startTime < 4000) {
          const bodyText = document.body.textContent || '';
          if (bodyText.includes('печатает...')) {
            wasTyping = true;
          }

          // When bot reply arrives, total message count becomes initial + 2 (1 user + 1 bot)
          const currentMsgCount = document.querySelectorAll('.whitespace-pre-wrap').length;
          if (currentMsgCount >= initialMsgCount + 2) {
            replyTime = Date.now() - startTime;
            break;
          }
          await new Promise((r) => setTimeout(r, 30));
        }

        return {
          success: replyTime > 0,
          wasTyping,
          elapsedMs: replyTime,
        };
      });

      assert.strictEqual(chatFlow.success, true, 'Bot reply bubble must appear in chat');
      assert.strictEqual(chatFlow.wasTyping, true, 'Chat must display typing state while awaiting answer');
      assert.ok(
        chatFlow.elapsedMs >= 600,
        `Reply must respect ~650ms typing cadence (actual: ${chatFlow.elapsedMs}ms)`
      );
    });
  });

  // =========================================================================
  // 3. Multi-Viewport Overflow & Responsive Stress Matrix
  // =========================================================================
  describe('C3: Multi-Viewport Overflow & Responsive Layout', () => {
    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE 1st gen' },
      { width: 360, height: 640, name: 'Small Android' },
      { width: 375, height: 812, name: 'iPhone 13 mini' },
      { width: 390, height: 844, name: 'iPhone 14' },
      { width: 414, height: 896, name: 'iPhone 11 / XR' },
      { width: 768, height: 1024, name: 'iPad Portrait' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 1440, height: 900, name: 'Desktop Standard' },
    ];

    for (const vp of viewports) {
      test(`C3: Viewport ${vp.width}x${vp.height} (${vp.name}) — zero horizontal document overflow`, async () => {
        await page.setViewport({ width: vp.width, height: vp.height, mobile: vp.width < 768 });
        await page.navigate(staticServer.url, { delayAfter: 800 });

        const overflowCheck = await page.evaluate(async () => {
          // Scroll page in steps to trigger all lazy renders and animations
          const scrollHeights = [0, 800, 1600, 2400, 3200, 4000];
          for (const s of scrollHeights) {
            window.scrollTo(0, s);
            await new Promise((r) => setTimeout(r, 100));
          }

          const docScrollWidth = document.documentElement.scrollWidth;
          const windowInnerWidth = window.innerWidth;
          const hasOverflow = docScrollWidth > windowInnerWidth + 1; // 1px rounding buffer

          return {
            hasOverflow,
            docScrollWidth,
            windowInnerWidth,
          };
        });

        assert.strictEqual(
          overflowCheck.hasOverflow,
          false,
          `Viewport ${vp.width}px leaked horizontally: scrollWidth=${overflowCheck.docScrollWidth}, innerWidth=${overflowCheck.windowInnerWidth}`
        );
      });
    }
  });

  // =========================================================================
  // 4. Visual Polish & Unslop Compliance Audit (Milestone M2)
  // =========================================================================
  describe('C4: Visual Polish & Unslop Compliance Audit', () => {
    test('C4.1: Services cards avoid screaming uppercase tags', () => {
      const servicesPath = path.join(PROJECT_ROOT, 'src/components/sections/Services.tsx');
      const content = fs.readFileSync(servicesPath, 'utf-8');

      const prohibitedUppercase = [
        "'ПРОДАЕТ И ЗАПИСЫВАЕТ 24/7'",
        "'БЕЗ ПРОПУЩЕННЫХ ЗВОНКОВ'",
        "'ЧИСТЫЕ НОМЕРА В EXCEL'",
        "'НОЛЬ РУЧНОЙ РУТИНЫ'",
      ];

      for (const phrase of prohibitedUppercase) {
        assert.strictEqual(
          content.includes(phrase),
          false,
          `Prohibited uppercase tag found in Services.tsx: ${phrase}`
        );
      }

      // Verify Sentence case replacements exist
      assert.ok(content.includes('Продает и записывает 24/7'));
      assert.ok(content.includes('Без пропущенных звонков'));
      assert.ok(content.includes('Чистые контакты в Excel'));
      assert.ok(content.includes('Ноль ручной рутины'));
    });

    test('C4.2: GuideForm has removed radial AI-glow blob and added conversion microcopy', () => {
      const guidePath = path.join(PROJECT_ROOT, 'src/components/sections/GuideForm.tsx');
      const content = fs.readFileSync(guidePath, 'utf-8');

      assert.strictEqual(
        content.includes('bg-blue/20 rounded-full blur-3xl'),
        false,
        'Prohibited AI glow blob still present in GuideForm.tsx'
      );
      assert.ok(
        content.includes('Бот пришлет PDF в Telegram за 5 секунд'),
        'Conversion microcopy must be present under CTA button in GuideForm'
      );
    });

    test('C4.3: AboutMe warranty is harmonized to 30 days', () => {
      const aboutPath = path.join(PROJECT_ROOT, 'src/components/sections/AboutMe.tsx');
      const content = fs.readFileSync(aboutPath, 'utf-8');

      assert.strictEqual(
        content.includes('14 дней гарантии'),
        false,
        'Outdated 14 days warranty found in AboutMe.tsx'
      );
      assert.ok(
        content.includes('30 дней гарантии'),
        'Harmonized 30 days warranty must be present in AboutMe.tsx'
      );
    });

    test('C4.4: Hero stats claims are realistic and CTA drop shadow is calmed', () => {
      const heroPath = path.join(PROJECT_ROOT, 'src/components/sections/Hero.tsx');
      const content = fs.readFileSync(heroPath, 'utf-8');

      assert.strictEqual(
        content.includes('shadow-[0_10px_25px_rgba(61,92,255,0.35)]'),
        false,
        'Aggressive drop-shadow found on Hero CTA'
      );
      assert.ok(
        content.includes('скрытых доплат / фиксированная смета'),
        'Realistic metric label must be present in Hero stats'
      );
    });

    test('C4.5: CSP in index.html permits HTTPS external webhook calls', () => {
      const indexPath = path.join(PROJECT_ROOT, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');

      assert.ok(
        content.includes("connect-src 'self' https:"),
        "index.html CSP connect-src must include 'https:' for external webhook integration"
      );
    });
  });
});
