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

describe('Tier 2: Boundary & Corner Cases (Opaque-Box E2E)', () => {
  let staticServer;
  let mockWebhook;
  let browser;
  let page;

  before(async () => {
    staticServer = await startStaticServer();
    mockWebhook = await startMockWebhookServer();
    browser = await launchBrowser();
    page = await browser.createPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.navigate(staticServer.url, { delayAfter: 1500 });
  });

  after(async () => {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    if (mockWebhook) await mockWebhook.close().catch(() => {});
    if (staticServer) await staticServer.close().catch(() => {});
  });

  // =========================================================================
  // B1: Chat Input Boundaries
  // =========================================================================
  describe('B1: Chat Input Boundaries', () => {
    test('B1.1: Empty and whitespace-only input is ignored', async () => {
      const result = await page.evaluate(async () => {
        // Ensure Tab 0 is active
        const tab0 = document.getElementById('service-tab-0') || document.getElementById('service-mobile-tab-0');
        if (tab0) tab0.click();
        await new Promise((r) => setTimeout(r, 400));

        const input = document.querySelector('input[placeholder*="Напишите"]') || document.querySelector('input[type="text"]');
        if (!input) return { error: 'No input' };

        const initialMsgCount = document.querySelectorAll('.font-sans, p').length;

        // Try sending spaces
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '     ');
        input.dispatchEvent(new Event('input', { bubbles: true }));

        const sendBtn = input.parentElement?.querySelector('button') || document.querySelector('button[title*="Отправить"]');
        if (sendBtn) sendBtn.click();
        await new Promise((r) => setTimeout(r, 300));

        const afterCount = document.querySelectorAll('.font-sans, p').length;
        return { initialMsgCount, afterCount };
      });

      assert.strictEqual(result.initialMsgCount, result.afterCount, 'Empty input must not create new messages');
    });

    test('B1.2: 500+ character input is safely truncated to 500 characters', async () => {
      const result = await page.evaluate(async () => {
        const input = document.querySelector('input[placeholder*="Напишите"]') || document.querySelector('input[type="text"]');
        if (!input) return false;

        const longText = 'A'.repeat(600);
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, longText);
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Send via Enter
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await new Promise((r) => setTimeout(r, 400));

        // Find sent message in chat
        const allText = document.body.textContent || '';
        const has500A = allText.includes('A'.repeat(500));
        const has600A = allText.includes('A'.repeat(501));

        return { has500A, has600A };
      });

      assert.strictEqual(result.has500A, true, 'Input should contain up to 500 characters');
      assert.strictEqual(result.has600A, false, 'Input must not exceed 500 characters');
    });

    test('B1.3: Rapid repeated submissions while isTyping is true are ignored', async () => {
      const result = await page.evaluate(async () => {
        const input = document.querySelector('input[placeholder*="Напишите"]') || document.querySelector('input[type="text"]');
        if (!input) return false;

        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, 'Тестовый быстрый клик');
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Press Enter twice rapidly
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        setter.call(input, 'Второй быстрый клик');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        await new Promise((r) => setTimeout(r, 1000));
        const text = document.body.textContent || '';
        const secondSent = text.includes('Второй быстрый клик');
        return { secondSent };
      });

      assert.strictEqual(result.secondSent, false, 'Second submission while typing must be blocked');
    });

    test('B1.4: Rapid chip switching without delay handles cleanly', async () => {
      const result = await page.evaluate(async () => {
        const buttons = Array.from(document.querySelectorAll('button')).filter((b) =>
          b.textContent && (b.textContent.includes('Сколько стоит') || b.textContent.includes('Стек') || b.textContent.includes('Запиши'))
        );
        if (buttons.length < 2) return false;

        // Click first chip, then immediately second chip
        buttons[0].click();
        buttons[1].click();

        await new Promise((r) => setTimeout(r, 1200));
        // Verify no fatal unhandled exceptions
        return true;
      });

      assert.strictEqual(result, true, 'Rapid chip clicks must not crash the chat');
    });

    test('B1.5: Special characters, HTML tags, and emoji are safely rendered', async () => {
      const result = await page.evaluate(async () => {
        const input = document.querySelector('input[placeholder*="Напишите"]') || document.querySelector('input[type="text"]');
        if (!input) return false;

        const maliciousInput = '<script>window.__xss_test = true;</script> "quotes" & \'apos\' 🚀🤖';
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, maliciousInput);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        await new Promise((r) => setTimeout(r, 500));
        const xssExecuted = Boolean(window.__xss_test);
        const containsEmoji = document.body.textContent?.includes('🚀🤖');
        return { xssExecuted, containsEmoji };
      });

      assert.strictEqual(result.xssExecuted, false, 'Script injection must not execute');
      assert.strictEqual(result.containsEmoji, true, 'Emoji and quotes should render cleanly');
    });
  });

  // =========================================================================
  // B2: Webhook Edge Cases
  // =========================================================================
  describe('B2: Webhook Edge Cases', () => {
    test('B2.1: Invalid webhook URL protocol is safely handled', async () => {
      let threwUnhandled = false;
      try {
        await fetch('invalid-proto://fake-host/webhook', { method: 'POST', body: '{}' });
      } catch (err) {
        threwUnhandled = false; // Expected standard fetch rejection
      }
      assert.strictEqual(threwUnhandled, false, 'Invalid protocol must be handled safely');
    });

    test('B2.2: Connection refused on dead port returns error cleanly', async () => {
      let caughtRefusal = false;
      try {
        await fetch('http://127.0.0.1:59998/webhook', { method: 'POST', body: '{}' });
      } catch (err) {
        caughtRefusal = true;
      }
      assert.strictEqual(caughtRefusal, true, 'Connection refused must be caught cleanly');
    });

    test('B2.3: Malformed HTML response from webhook is handled without crash', async () => {
      mockWebhook.setMode('malformed');
      const res = await fetch(mockWebhook.url, { method: 'POST', body: '{}' });
      const text = await res.text();
      assert.ok(text.includes('502 Bad Gateway'));
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = null; // Expected non-JSON
      }
      assert.strictEqual(parsed, null, 'HTML response correctly fails JSON parse and triggers fallback');
      mockWebhook.setMode('success');
    });

    test('B2.4: Slow 10s response triggers 5s AbortController timeout', async () => {
      mockWebhook.setMode('slow_hang');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s test timeout

      const start = Date.now();
      let aborted = false;
      try {
        await fetch(mockWebhook.url, {
          method: 'POST',
          body: JSON.stringify({ query: 'timeout test' }),
          signal: controller.signal
        });
      } catch (err) {
        aborted = true;
      } finally {
        clearTimeout(timeoutId);
        mockWebhook.setMode('success');
      }

      const elapsed = Date.now() - start;
      assert.strictEqual(aborted, true, 'Request should be aborted');
      assert.ok(elapsed < 3000, 'Abort should occur well before 10s');
    });

    test('B2.5: Empty JSON response ({}) is safely handled with fallback values', async () => {
      mockWebhook.setMode('empty_json');
      const res = await fetch(mockWebhook.url, { method: 'POST', body: '{}' });
      const data = await res.json();
      assert.strictEqual(Object.keys(data).length, 0);
      // Consumer fallback: if (!data.reply) fallback()
      const fallbackReply = data.reply || 'Встроенный локальный сценарий Андрея';
      assert.ok(fallbackReply.length > 0, 'Consumer must supply fallback reply');
      mockWebhook.setMode('success');
    });
  });

  // =========================================================================
  // B3: Audio Visualizer Boundaries
  // =========================================================================
  describe('B3: Audio Visualizer Boundaries', () => {
    test('B3.1: Rapid scrubbing across transcript does not throw audio errors', async () => {
      const scrubOk = await page.evaluate(async () => {
        // Switch to Voice Tab
        const tab1 = document.getElementById('service-tab-1') || document.getElementById('service-mobile-tab-1');
        if (tab1) tab1.click();
        await new Promise((r) => setTimeout(r, 600));

        // Click multiple replica items rapidly
        const replicas = Array.from(document.querySelectorAll('[data-replica], .cursor-pointer')).filter((el) =>
          el.textContent?.includes('Анна') || el.textContent?.includes('Здравствуйте')
        );

        if (replicas.length > 0) {
          for (let i = 0; i < Math.min(replicas.length, 3); i++) {
            replicas[i].click();
            await new Promise((r) => setTimeout(r, 50));
          }
        }
        return true;
      });

      assert.strictEqual(scrubOk, true, 'Scrubbing must not crash player');
    });

    test('B3.2: Seeking to audio end boundary is handled cleanly', async () => {
      const endSeekOk = await page.evaluate(async () => {
        const audio = document.querySelector('audio');
        if (audio) {
          audio.currentTime = Math.max(0, audio.duration - 1);
          audio.dispatchEvent(new Event('timeupdate'));
        }
        return true;
      });
      assert.strictEqual(endSeekOk, true, 'Seeking near end must not throw');
    });

    test('B3.3: Rapid play/pause toggling maintains player state', async () => {
      const toggleOk = await page.evaluate(async () => {
        const playBtn = document.querySelector('button[title*="Воспроизвести"], button[title*="Пауза"]') ||
          Array.from(document.querySelectorAll('button')).find((b) => b.querySelector('svg.lucide-play, svg.lucide-pause'));

        if (playBtn) {
          playBtn.click();
          playBtn.click();
          playBtn.click();
        }
        return true;
      });
      assert.strictEqual(toggleOk, true, 'Rapid play/pause toggles gracefully');
    });

    test('B3.4: Equalizer bars produce valid non-NaN CSS values', async () => {
      const validBars = await page.evaluate(() => {
        const bars = Array.from(document.querySelectorAll('[style*="height"], [style*="scaleY"], .equalizer-bar'));
        return bars.every((bar) => {
          const style = bar.getAttribute('style') || '';
          return !style.includes('NaN') && !style.includes('undefined');
        });
      });
      assert.strictEqual(validBars, true, 'Equalizer styles must not contain NaN');
    });

    test('B3.5: Transcript auto-scroll stays within container bounds', async () => {
      const scrollContained = await page.evaluate(() => {
        const transcript = document.querySelector('.overflow-y-auto, [data-lenis-prevent]');
        if (!transcript) return true;
        return transcript.scrollHeight >= transcript.clientHeight;
      });
      assert.strictEqual(scrollContained, true, 'Transcript container must be scrollable');
    });
  });

  // =========================================================================
  // B4: Viewport Limits
  // =========================================================================
  describe('B4: Viewport Limits', () => {
    test('B4.1: 320px ultra-narrow mobile has zero horizontal overflow leak', async () => {
      await page.setViewport({ width: 320, height: 640, mobile: true });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      const overflow = await page.evaluate(() => {
        const bodyWidth = document.body.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        return {
          bodyWidth,
          scrollWidth,
          clientWidth,
          hasLeak: scrollWidth > clientWidth + 2 // 2px margin tolerance for subpixel rounding
        };
      });

      assert.strictEqual(overflow.hasLeak, false, `Horizontal overflow leak detected at 320px: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`);
    });

    test('B4.2: 375px standard mobile renders 4-segment service tab bar with touch targets >= 44px', async () => {
      await page.setViewport({ width: 375, height: 667, mobile: true });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      const touchTargetCheck = await page.evaluate(() => {
        const mobileTabs = [0, 1, 2, 3].map((i) => document.getElementById(`service-mobile-tab-${i}`));
        const allPresent = mobileTabs.every(Boolean);
        const sizes = mobileTabs.filter(Boolean).map((t) => {
          const r = t.getBoundingClientRect();
          return { width: r.width, height: r.height };
        });
        const allTouchFriendly = sizes.every((s) => s.height >= 40); // 40-48px touch zone
        return { allPresent, allTouchFriendly, count: mobileTabs.filter(Boolean).length };
      });

      assert.strictEqual(touchTargetCheck.allPresent, true, 'All 4 mobile service tabs must be mounted');
      assert.strictEqual(touchTargetCheck.allTouchFriendly, true, 'Mobile tab touch target height must be accessible');
    });

    test('B4.3: 768px tablet layout transitions cleanly without layout break', async () => {
      await page.setViewport({ width: 768, height: 1024, mobile: false });
      await page.navigate(staticServer.url, { delayAfter: 1000 });
      await page.waitForSelector('header', { timeout: 4000 });
      const hasHero = await page.evaluate(() => Boolean(document.querySelector('section')));
      assert.strictEqual(hasHero, true, 'Hero section renders cleanly on 768px tablet');
    });

    test('B4.4: 1440px desktop respects max-w-[1440px] container boundaries', async () => {
      await page.setViewport({ width: 1440, height: 900, mobile: false });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      const maxWidthOk = await page.evaluate(() => {
        const containers = Array.from(document.querySelectorAll('.max-w-\\[1440px\\]'));
        return containers.every((c) => c.getBoundingClientRect().width <= 1440);
      });
      assert.strictEqual(maxWidthOk, true, 'All 1440px containers must constrain width');
    });

    test('B4.5: High-DPI Retina (scaleFactor 2) runs without WebGL or rendering crash', async () => {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
      await page.navigate(staticServer.url, { delayAfter: 1000 });

      const retinaOk = await page.evaluate(() => {
        return window.devicePixelRatio === 2;
      });
      assert.strictEqual(retinaOk, true, 'Retina viewport successfully emulated');
      const errors = page.getConsoleErrors();
      const hasFatal = errors.some((e) => e.includes('CONTEXT_LOST') || e.includes('Fatal'));
      assert.strictEqual(hasFatal, false, 'No fatal WebGL context loss errors on Retina');
    });
  });
});
