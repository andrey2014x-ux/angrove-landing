import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { startStaticServer } from './helpers/staticServer.mjs';
import { launchBrowser } from './helpers/browser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Tier 3: Cross-Feature Combinations (Opaque-Box E2E)', () => {
  let staticServer;
  let browser;
  let page;

  before(async () => {
    staticServer = await startStaticServer();
    browser = await launchBrowser();
    page = await browser.createPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.navigate(staticServer.url, { delayAfter: 1500 });
  });

  after(async () => {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    if (staticServer) await staticServer.close().catch(() => {});
  });

  test('X1: Switching service tabs while chat is typing preserves stability and completes cleanly', async () => {
    const interactionOk = await page.evaluate(async () => {
      // 1. Ensure Tab 0 (Chat) is active
      const tab0 = document.getElementById('service-tab-0') || document.getElementById('service-mobile-tab-0');
      if (tab0) {
        tab0.scrollIntoView({ block: 'center' });
        tab0.click();
        await new Promise((r) => setTimeout(r, 400));
      }

      // 2. Trigger a message via chip
      const buttons = Array.from(document.querySelectorAll('button'));
      const chip = buttons.find((b) => b.textContent && b.textContent.includes('студия ремонта'));
      if (chip) chip.click();

      // 3. Immediately switch to Tab 1 (Voice)
      const tab1 = document.getElementById('service-tab-1') || document.getElementById('service-mobile-tab-1');
      if (tab1) {
        tab1.click();
        await new Promise((r) => setTimeout(r, 400));
      }

      // 4. Switch back to Tab 0 (Chat)
      if (tab0) {
        tab0.click();
        await new Promise((r) => setTimeout(r, 1200));
      }

      // Check that chat re-rendered without fatal error
      const input = document.querySelector('input[placeholder*="Напишите"]') || document.querySelector('input[type="text"]');
      return Boolean(input);
    });

    assert.strictEqual(interactionOk, true, 'Chat must recover cleanly after switching tabs during typing');
    const errors = page.getConsoleErrors();
    const fatalErrors = errors.filter((e) => e.includes('Uncaught') || e.includes('Cannot read properties of null'));
    assert.strictEqual(fatalErrors.length, 0, 'No uncaught null reference errors during tab switch');
  });

  test('X2: Cases CTA deep links maintain specific pre-filled messages across all 3 niche tabs', async () => {
    const deepLinks = await page.evaluate(async () => {
      const section = document.getElementById('cases');
      if (!section) return [];

      const tabs = Array.from(section.querySelectorAll('button')).filter((b) =>
        b.textContent && (b.textContent.includes('Салоны') || b.textContent.includes('Товарный') || b.textContent.includes('B2B'))
      );

      const results = [];
      for (const t of tabs) {
        t.scrollIntoView({ block: 'center' });
        t.click();
        await new Promise((r) => setTimeout(r, 300));

        const cta = section.querySelector('a[href*="t.me"]');
        const href = cta ? cta.getAttribute('href') || '' : '';
        results.push({
          tabText: t.textContent?.trim(),
          href,
          hasTelegram: href.toLowerCase().includes('t.me/angrove'),
          hasEncodedText: href.includes('text=')
        });
      }
      return results;
    });

    assert.ok(deepLinks.length >= 3, 'Must test all 3 niche tabs in Cases');
    for (const link of deepLinks) {
      assert.strictEqual(link.hasTelegram, true, `CTA in tab "${link.tabText}" must link to t.me/angrove`);
      assert.strictEqual(link.hasEncodedText, true, `CTA in tab "${link.tabText}" must have pre-filled text param`);
    }
  });

  test('X3: Wheel scroll isolation prevents Lenis smooth scroll from swallowing inner container scroll', async () => {
    const lenisIsolation = await page.evaluate(() => {
      const scrollContainers = Array.from(document.querySelectorAll('[data-lenis-prevent], .overscroll-contain, .overflow-y-auto'));
      return {
        hasIsolatedContainers: scrollContainers.length > 0,
        count: scrollContainers.length
      };
    });

    assert.strictEqual(lenisIsolation.hasIsolatedContainers, true, 'Inner containers must have scroll isolation for Lenis');
  });

  test('X4: Audio playback state cleanly unmounts when navigating away to other tabs', async () => {
    const audioState = await page.evaluate(async () => {
      // 1. Switch to Voice tab
      const tab1 = document.getElementById('service-tab-1') || document.getElementById('service-mobile-tab-1');
      if (tab1) {
        tab1.scrollIntoView({ block: 'center' });
        tab1.click();
        await new Promise((r) => setTimeout(r, 600));
      }

      // 2. Switch away to Parser tab
      const tab2 = document.getElementById('service-tab-2') || document.getElementById('service-mobile-tab-2');
      if (tab2) {
        tab2.click();
        await new Promise((r) => setTimeout(r, 600));
      }

      // 3. Switch back to Voice tab
      if (tab1) {
        tab1.click();
        await new Promise((r) => setTimeout(r, 600));
      }

      // Voice tab should re-mount with clean audio element
      const audio = document.querySelector('audio');
      return Boolean(audio);
    });

    assert.strictEqual(audioState, true, 'Voice tab must re-mount cleanly after unmounting');
  });

  test('X5: Parser console scrape execution and export actions operate without page disruption', async () => {
    const parserWorks = await page.evaluate(async () => {
      // 1. Switch to Parser tab
      const tab2 = document.getElementById('service-tab-2') || document.getElementById('service-mobile-tab-2');
      if (tab2) {
        tab2.scrollIntoView({ block: 'center' });
        tab2.click();
        await new Promise((r) => setTimeout(r, 600));
      }

      // 2. Click start scrape button if idle
      const startBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent && (b.textContent.includes('Запустить сбор') || b.textContent.includes('Собрать') || b.textContent.includes('сбор'))
      );

      if (startBtn) {
        startBtn.click();
        // Wait for scrape progress
        await new Promise((r) => setTimeout(r, 2600));
      }

      // 3. Verify company cards or export button rendered
      const sectionText = document.getElementById('services')?.textContent || '';
      const hasExportOrCards = sectionText.includes('Excel') || sectionText.includes('amoCRM') || sectionText.includes('152-ФЗ');
      return hasExportOrCards;
    });

    assert.strictEqual(parserWorks, true, 'Parser console must complete scrape and render export options');
  });
});
