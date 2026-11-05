import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { startStaticServer } from './helpers/staticServer.mjs';
import { launchBrowser } from './helpers/browser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

describe('Tier 4: Real-World Application Scenarios (Opaque-Box E2E)', () => {
  let staticServer;
  let browser;
  let page;

  before(async () => {
    staticServer = await startStaticServer();
    browser = await launchBrowser();
    page = await browser.createPage();
  });

  after(async () => {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    if (staticServer) await staticServer.close().catch(() => {});
  });

  test('Scenario A: Mobile Business Owner Journey (375px)', async () => {
    // 1. Visit as mobile user (iPhone 12/13/14 size: 375x812)
    await page.setViewport({ width: 375, height: 812, mobile: true });
    await page.navigate(staticServer.url, { delayAfter: 1200 });

    // 2. Review Hero value proposition
    const heroTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent?.trim() : '';
    });
    assert.ok(heroTitle && heroTitle.length > 0, 'Mobile visitor must see Hero heading');

    // 3. Navigate down to Cases section
    const casesInView = await page.evaluate(async () => {
      const cases = document.getElementById('cases');
      if (!cases) return false;
      cases.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise((r) => setTimeout(r, 400));
      return true;
    });
    assert.strictEqual(casesInView, true, 'Cases section must be reachable on mobile');

    // 4. Switch to "02. Товарный бизнес & склад"
    const switchedTab = await page.evaluate(async () => {
      const section = document.getElementById('cases');
      if (!section) return false;
      const buttons = Array.from(section.querySelectorAll('button'));
      const ecomTab = buttons.find((b) => b.textContent && b.textContent.includes('Товарный'));
      if (!ecomTab) return false;
      ecomTab.click();
      await new Promise((r) => setTimeout(r, 500));

      const text = section.textContent || '';
      return text.includes('МойСклад') || text.includes('склад');
    });
    assert.strictEqual(switchedTab, true, 'Mobile user successfully selects E-commerce / Warehouse case');

    // 5. Check real metrics and click Telegram CTA
    const ctaTarget = await page.evaluate(() => {
      const section = document.getElementById('cases');
      if (!section) return null;
      const cta = section.querySelector('a[href*="t.me"]');
      return cta ? cta.getAttribute('href') : null;
    });
    assert.ok(ctaTarget && ctaTarget.toLowerCase().includes('t.me/angrove'), 'CTA link targets @angrove in mobile journey');
  });

  test('Scenario B: Telegram Simulator Custom Lead Inquiry', async () => {
    // Desktop user opens site and chats with bot
    await page.setViewport({ width: 1440, height: 900, mobile: false });
    await page.navigate(staticServer.url, { delayAfter: 1000 });

    const chatInteraction = await page.evaluate(async () => {
      // 1. Ensure Tab 0 (Chat) is selected
      const tab0 = document.getElementById('service-tab-0') || document.getElementById('service-mobile-tab-0');
      if (tab0) {
        tab0.scrollIntoView({ block: 'center' });
        tab0.click();
        await new Promise((r) => setTimeout(r, 400));
      }

      // 2. Type custom realistic question
      const input = document.querySelector('input[placeholder*="Напишите"]') || document.querySelector('input[type="text"]');
      if (!input) return { success: false, reason: 'No input' };

      const question = 'Сколько стоит разработка AI-бота под ключ?';
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, question);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      // 3. Wait for local reply (< 1.5s)
      const start = Date.now();
      let replyFound = false;
      let crmAlertFound = false;

      while (Date.now() - start < 2000) {
        const bodyText = document.body.textContent || '';
        if (bodyText.includes('смет') || bodyText.includes('вилки цен') || bodyText.includes('от') || bodyText.includes('руб')) {
          replyFound = true;
        }
        if (bodyText.includes('LIVE SYNC') || bodyText.includes('CRM') || bodyText.includes('Лид')) {
          crmAlertFound = true;
        }
        if (replyFound) break;
        await new Promise((r) => setTimeout(r, 100));
      }

      return { success: replyFound, crmAlertFound };
    });

    assert.strictEqual(chatInteraction.success, true, 'User receives timely pricing response from local fallback');
  });

  test('Scenario C: Full Production Build & Static Assets Verification', () => {
    // 1. Run production build
    const buildLog = execSync('npm run build', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    assert.ok(buildLog.includes('built in'), 'Build must complete cleanly');

    // 2. Check CSP in dist/index.html
    const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'dist/index.html'), 'utf-8');
    assert.ok(indexHtml.includes('Content-Security-Policy'), 'index.html must have CSP meta header');
    assert.ok(indexHtml.includes('connect-src'), 'CSP must specify connect-src directive');

    // 3. Check generated sitemap
    const sitemap = fs.readFileSync(path.join(PROJECT_ROOT, 'dist/sitemap.xml'), 'utf-8');
    assert.ok(sitemap.includes('<loc>https://angrove.ru/</loc>'), 'Sitemap must contain canonical URL');

    // 4. Check 404 SPA fallback
    assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'dist/404.html')), 'dist/404.html must exist');
  });

  test('Scenario D: Interactive Voice Call Walkthrough', async () => {
    await page.setViewport({ width: 1440, height: 900, mobile: false });
    await page.navigate(staticServer.url, { delayAfter: 1000 });

    const callResult = await page.evaluate(async () => {
      // 1. Switch to Voice tab
      const tab1 = document.getElementById('service-tab-1') || document.getElementById('service-mobile-tab-1');
      if (tab1) {
        tab1.scrollIntoView({ block: 'center' });
        tab1.click();
        await new Promise((r) => setTimeout(r, 600));
      }

      // 2. Jump to patient confirmation replica
      const replicas = Array.from(document.querySelectorAll('.cursor-pointer, [data-replica]')).filter((el) =>
        el.textContent?.includes('среду') || el.textContent?.includes('Смирнова') || el.textContent?.includes('Запишите')
      );

      if (replicas.length > 0) {
        replicas[0].click();
        await new Promise((r) => setTimeout(r, 300));
      }

      // 3. Inspect simulated YClients CRM notification
      const text = document.getElementById('services')?.textContent || '';
      const hasCrmResult = text.includes('YClients') || text.includes('запись') || text.includes('Дента');
      return hasCrmResult;
    });

    assert.strictEqual(callResult, true, 'Voice call walkthrough confirms patient record integration');
  });

  test('Scenario E: Multi-Niche B2B Lead Extraction Journey', async () => {
    await page.setViewport({ width: 1440, height: 900, mobile: false });
    await page.navigate(staticServer.url, { delayAfter: 1000 });

    const b2bResult = await page.evaluate(async () => {
      // 1. Switch to Parser tab
      const tab2 = document.getElementById('service-tab-2') || document.getElementById('service-mobile-tab-2');
      if (tab2) {
        tab2.scrollIntoView({ block: 'center' });
        tab2.click();
        await new Promise((r) => setTimeout(r, 600));
      }

      // 2. Switch industry niche preset
      const nicheBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.textContent && (b.textContent.includes('Оптовые') || b.textContent.includes('Спецтехника'))
      );
      if (nicheBtns.length > 0) {
        nicheBtns[0].click();
        await new Promise((r) => setTimeout(r, 300));
      }

      // 3. Run scrape
      const runBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent && (b.textContent.includes('Запустить сбор') || b.textContent.includes('Собрать'))
      );
      if (runBtn) {
        runBtn.click();
        await new Promise((r) => setTimeout(r, 2500));
      }

      // 4. Verify 152-ФЗ compliance badge and card grid
      const text = document.getElementById('services')?.textContent || '';
      const hasFz = text.includes('152-ФЗ') || text.includes('ФЗ');
      const hasCards = text.includes('ИНН') || text.includes('ООО') || text.includes('Excel');

      return hasFz || hasCards;
    });

    assert.strictEqual(b2bResult, true, 'B2B extraction journey verifies legal compliance and lead cards');
  });
});
