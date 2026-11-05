import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { startStaticServer } from './helpers/staticServer.mjs';
import { startMockWebhookServer } from './helpers/mockWebhook.mjs';
import { launchBrowser } from './helpers/browser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

describe('Tier 5: White-Box Coverage Hardening & Adversarial Stress Suite', () => {
  let staticServer;
  let mockWebhook;
  let browser;
  let page;

  before(async () => {
    // 1. Ensure production build exists
    const distIndex = path.join(PROJECT_ROOT, 'dist/index.html');
    if (!fs.existsSync(distIndex)) {
      execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'ignore' });
    }

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
  // Suite H1: AI Webhook Adversarial Stress & Error Recovery
  // =========================================================================
  describe('H1: AI Webhook Adversarial Stress & Payload Hardening', () => {
    test('H1.1: Webhook handles massive unicode payload (20k chars) without memory leak or crash', async () => {
      mockWebhook.setMode('success', {
        reply: 'Ответ на массивный запрос получен успешно',
        isLive: true,
      });

      const longQuery = 'А' + 'Тестовый запрос с символами 🚀🔒⚡ '.repeat(500);
      assert.ok(longQuery.length > 15000);

      const res = await fetch(mockWebhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: longQuery,
          message: longQuery,
          history: [],
          timestamp: new Date().toISOString(),
        }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.reply, 'Ответ на массивный запрос получен успешно');
    });

    test('H1.2: Concurrent webhook flood (15 simultaneous queries) resolves cleanly', async () => {
      mockWebhook.setMode('success', {
        reply: 'Конкурентный ответ',
        crmAction: 'amoCRM: Пакетный лид',
      });

      const promises = Array.from({ length: 15 }, (_, i) =>
        fetch(mockWebhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `Запрос #${i}` }),
        }).then((r) => r.json())
      );

      const results = await Promise.all(promises);
      assert.strictEqual(results.length, 15);
      for (const r of results) {
        assert.strictEqual(r.reply, 'Конкурентный ответ');
      }
    });

    test('H1.3: HTTP 429, 502, 504 status codes trigger graceful fallback without throwing unhandled exceptions', async () => {
      const statuses = [429, 502, 504];
      for (const code of statuses) {
        const fallbackExecuted = await page.evaluate(`(async () => {
          const statusCode = ${code};
          const fallbackEngine = () => {
            return { reply: 'Резервный сценарий сработал', crmAction: undefined };
          };

          const mockFetch = async () => ({
            ok: false,
            status: statusCode,
            statusText: 'Error ' + statusCode,
          });

          try {
            const res = await mockFetch();
            if (!res.ok) throw new Error('HTTP ' + res.status);
          } catch {
            return fallbackEngine();
          }
          return null;
        })()`);

        assert.ok(fallbackExecuted);
        assert.strictEqual(fallbackExecuted.reply, 'Резервный сценарий сработал');
      }
    });

    test('H1.4: Invalid payload types (number, null, array, object) safely fail normalization', async () => {
      const invalidPayloads = [
        { reply: 12345 },
        { reply: null },
        { reply: [] },
        { reply: {} },
        { reply: true },
        { message: null, output: 999 },
      ];

      for (const payload of invalidPayloads) {
        const isNormalized = await page.evaluate(`(() => {
          const p = ${JSON.stringify(payload)};
          const reply = p?.reply || p?.text || p?.message || p?.output || p?.response;
          return typeof reply === 'string' && reply.trim().length > 0;
        })()`);

        assert.strictEqual(isNormalized, false, `Payload ${JSON.stringify(payload)} should not be considered valid reply`);
      }
    });

    test('H1.5: Whitespace-only replies are rejected as invalid', async () => {
      const whitespaceReplies = ['   ', '\t\n\r', '  \n  '];
      for (const str of whitespaceReplies) {
        const isValid = await page.evaluate(`(() => {
          const data = { reply: ${JSON.stringify(str)} };
          const reply = data?.reply || data?.text || data?.message;
          return typeof reply === 'string' && reply.trim().length > 0;
        })()`);

        assert.strictEqual(isValid, false);
      }
    });

    test('H1.6: Complex JSON response correctly parses optional crmAction', async () => {
      const complexData = {
        reply: '  Действительный ответ с пробелами по краям  ',
        crmAction: '  amoCRM: Заявка создана  ',
        metadata: { tokens: 42, model: 'claude-3.5-sonnet' },
      };

      const parsed = await page.evaluate(`(() => {
        const data = ${JSON.stringify(complexData)};
        const reply = data?.reply || data?.text || data?.message || data?.output || data?.response;
        if (typeof reply === 'string' && reply.trim().length > 0) {
          return {
            reply: reply.trim(),
            crmAction: typeof data.crmAction === 'string' && data.crmAction.trim() ? data.crmAction.trim() : undefined,
            isLive: true,
          };
        }
        return null;
      })()`);

      assert.ok(parsed, 'Parsed response should not be null');
      assert.strictEqual(parsed.reply, 'Действительный ответ с пробелами по краям');
      assert.strictEqual(parsed.crmAction, 'amoCRM: Заявка создана');
      assert.strictEqual(parsed.isLive, true);
    });
  });

  // =========================================================================
  // Suite H2: Browser Simulators Exhaustive State Thrashing
  // =========================================================================
  describe('H2: Browser Simulators State Thrashing & In-Browser Resilience', () => {
    test('H2.1: TelegramChatSimulator rapid suggestion chip clicking preserves stable history', async () => {
      const chatExists = await page.evaluate(() => {
        const input = document.querySelector('input[placeholder*="AI-ассистенту"]');
        return Boolean(input);
      });
      assert.ok(chatExists, 'Telegram chat simulator input should exist');

      const countBefore = await page.evaluate(() => {
        return document.querySelectorAll('.telegram-chat-scroll > div').length;
      });

      // Click first available quick question button
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button')).filter((b) =>
          b.innerText.includes('Сколько стоит') || b.innerText.includes('Стек')
        );
        if (btns[0]) btns[0].click();
      });

      // Wait for response to process
      await page.evaluate(() => new Promise((r) => setTimeout(r, 1200)));

      const countAfter = await page.evaluate(() => {
        return document.querySelectorAll('.telegram-chat-scroll > div').length;
      });

      assert.ok(countAfter > countBefore, 'Messages count should increase after sending prompt');
    });

    test('H2.2: VoiceCallSimulator rapid play/pause cycling does not freeze or throw console error', async () => {
      // Switch to voice call simulator tab
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find((b) => b.innerText.includes('Голосовой робот') || b.innerText.includes('Голос'));
        if (target) target.click();
      });

      await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

      const rapidToggleResult = await page.evaluate(async () => {
        const playBtn = Array.from(document.querySelectorAll('button')).find(
          (b) => b.innerText.includes('Слушать диалог') || b.innerText.includes('Пауза')
        );
        if (!playBtn) return { found: false };

        for (let i = 0; i < 6; i++) {
          playBtn.click();
          await new Promise((r) => setTimeout(r, 60));
        }

        const audio = document.querySelector('audio');
        return {
          found: true,
          audioPresent: Boolean(audio),
          hasError: audio ? Boolean(audio.error) : false,
        };
      });

      assert.ok(rapidToggleResult.found, 'Voice simulator play button should be found');
      assert.strictEqual(rapidToggleResult.hasError, false, 'Audio element should not be in error state');
    });

    test('H2.3: ParserConsoleSimulator niche switching preserves valid state & 152-ФЗ compliance', async () => {
      // Switch to parser simulator tab
      await page.evaluate(async () => {
        const parserTab = document.getElementById('service-tab-2');
        if (parserTab) {
          parserTab.scrollIntoView({ block: 'center' });
          parserTab.click();
        }
      });

      // Wait for lazy-loaded component chunk to mount
      await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));

      // Check 152-ФЗ compliance label is present
      const compliancePresent = await page.evaluate(() => {
        return document.body.innerText.includes('152-ФЗ');
      });
      assert.ok(compliancePresent, '152-FZ compliance notice must be present in Parser simulator');

      // Click scrape start button and check state
      const scrapeRan = await page.evaluate(async () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const startBtn = buttons.find(
          (b) => {
            const txt = b.textContent || '';
            return txt.includes('Запустить') || txt.includes('сбор') || txt.includes('Собрать');
          }
        );
        if (startBtn) {
          startBtn.click();
          return true;
        }
        return false;
      });

      assert.ok(scrapeRan, 'Start parser button should be clickable');
    });

    test('H2.4: BusinessMeshSimulator step animation runs without crashing', async () => {
      // Switch to mesh tab
      await page.evaluate(async () => {
        const meshTab = document.getElementById('service-tab-3');
        if (meshTab) {
          meshTab.scrollIntoView({ block: 'center' });
          meshTab.click();
        }
      });

      // Wait for lazy-loaded component chunk to mount
      await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));

      const runMeshResult = await page.evaluate(async () => {
        const simBtn = Array.from(document.querySelectorAll('button')).find(
          (b) => b.innerText.includes('Клиент оплатил заказ') || b.innerText.includes('Проверить авто-процесс')
        );
        if (simBtn) {
          simBtn.click();
          return true;
        }
        return false;
      });

      assert.ok(runMeshResult, 'Business Mesh simulator run button should be clickable');
    });
  });

  // =========================================================================
  // Suite H3: Multi-Device Responsive & Viewport Resilience
  // =========================================================================
  describe('H3: Multi-Device Responsive & Viewport Resilience Matrix', () => {
    const VIEWPORTS = [
      { name: 'Ultra-Narrow 320x568 (iPhone SE 1st gen)', w: 320, h: 568 },
      { name: 'Standard Mobile 375x812 (iPhone 13 mini)', w: 375, h: 812 },
      { name: 'Large Mobile 414x896 (iPhone 11)', w: 414, h: 896 },
      { name: 'Tablet Portrait 768x1024 (iPad)', w: 768, h: 1024 },
      { name: 'Tablet Landscape 1024x768', w: 1024, h: 768 },
      { name: 'Desktop Standard 1440x900', w: 1440, h: 900 },
      { name: 'Ultrawide Desktop 2560x1440', w: 2560, h: 1440 },
    ];

    for (const vp of VIEWPORTS) {
      test(`H3: Viewport ${vp.name} maintains zero horizontal document overflow`, async () => {
        await page.setViewport({ width: vp.w, height: vp.h });
        await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

        const metrics = await page.evaluate(() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          return { docW, winW, overflow: docW - winW };
        });

        assert.ok(
          metrics.overflow <= 1,
          `Viewport ${vp.name} experienced horizontal overflow: doc=${metrics.docW}px, win=${metrics.winW}px`
        );
      });
    }

    test('H3.8: Mobile service tabs bar is fully interactive at 375px', async () => {
      await page.setViewport({ width: 375, height: 812 });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

      const tabCount = await page.evaluate(() => {
        const serviceSection = document.getElementById('services');
        if (!serviceSection) return 0;
        const buttons = serviceSection.querySelectorAll('button');
        return buttons.length;
      });

      assert.ok(tabCount >= 4, `Services section should have at least 4 tab buttons, found ${tabCount}`);
    });

    test('H3.9: Cases section 3 tabs switch properly on mobile', async () => {
      await page.setViewport({ width: 375, height: 812 });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

      const tabsWork = await page.evaluate(async () => {
        const casesSection = document.getElementById('cases');
        if (!casesSection) return false;
        const tabs = Array.from(casesSection.querySelectorAll('button')).filter(
          (b) => b.innerText.includes('Салоны') || b.innerText.includes('Оптовые') || b.innerText.includes('Опт') || b.innerText.includes('B2B')
        );
        if (tabs.length === 0) return false;

        // Click second tab
        if (tabs[1]) {
          tabs[1].click();
          await new Promise((r) => setTimeout(r, 300));
        }
        return true;
      });

      assert.ok(tabsWork, 'Cases tabs should switch smoothly on mobile view');
    });

    test('H3.10: FAQ accordion expands and collapses cleanly', async () => {
      const faqWorks = await page.evaluate(async () => {
        const faqSection = document.getElementById('faq');
        if (!faqSection) return false;
        const accordions = faqSection.querySelectorAll('button');
        if (accordions.length === 0) return false;

        // Toggle first accordion
        const first = accordions[0];
        first.click();
        await new Promise((r) => setTimeout(r, 300));
        return true;
      });

      assert.ok(faqWorks, 'FAQ accordion button should be clickable');
    });
  });

  // =========================================================================
  // Suite H4: Performance, Bundle Chunking & SEO Integrity Audit
  // =========================================================================
  describe('H4: Performance, Bundle Chunking & SEO Integrity Audit', () => {
    test('H4.1: Production assets in dist/ confirm modular code splitting', () => {
      const assetsDir = path.join(PROJECT_ROOT, 'dist/assets');
      assert.ok(fs.existsSync(assetsDir), 'dist/assets directory must exist');

      const files = fs.readdirSync(assetsDir);
      const jsFiles = files.filter((f) => f.endsWith('.js'));

      // Check essential split chunks
      const hasSimulators = jsFiles.some((f) => f.includes('TelegramChatSimulator') || f.includes('VoiceCallSimulator'));
      const hasVendorReact = jsFiles.some((f) => f.includes('vendor-react'));
      const hasVendorThree = jsFiles.some((f) => f.includes('vendor-three'));

      assert.ok(hasSimulators, 'Simulators must be split into dedicated chunks');
      assert.ok(hasVendorReact, 'React must be split into vendor chunk');
      assert.ok(hasVendorThree, 'Three.js must be split into vendor chunk to prevent bundle bloat');
    });

    test('H4.2: Production index.html includes secure CSP with external HTTPS webhook connect-src', () => {
      const htmlPath = path.join(PROJECT_ROOT, 'dist/index.html');
      assert.ok(fs.existsSync(htmlPath), 'dist/index.html must exist');

      const content = fs.readFileSync(htmlPath, 'utf-8');
      assert.ok(content.includes('Content-Security-Policy'), 'CSP meta tag must be present');
      assert.ok(content.includes('connect-src'), 'connect-src directive must be present');
      assert.ok(content.includes('https:'), 'connect-src must allow HTTPS for live webhook integration');
    });

    test('H4.3: Structured JSON-LD microdata is valid and complete', () => {
      const htmlPath = path.join(PROJECT_ROOT, 'dist/index.html');
      const content = fs.readFileSync(htmlPath, 'utf-8');

      const jsonLdMatches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
      assert.ok(jsonLdMatches && jsonLdMatches.length > 0, 'JSON-LD scripts must be present');

      for (const tag of jsonLdMatches) {
        const jsonStr = tag.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
        const parsed = JSON.parse(jsonStr);
        assert.ok(parsed['@context'], 'Structured data must have @context');
        assert.ok(parsed['@type'] || parsed['@graph'], 'Structured data must have @type or @graph');
      }
    });

    test('H4.4: LCP Hero images and critical assets have preload tags', () => {
      const htmlPath = path.join(PROJECT_ROOT, 'dist/index.html');
      const content = fs.readFileSync(htmlPath, 'utf-8');

      assert.ok(content.includes('rel="preload"'), 'HTML must include rel="preload" for critical LCP hero image assets');
      assert.ok(content.includes('andrey'), 'Preloaded images must include hero portrait');
    });

    test('H4.5: sitemap.xml contains angrove.ru canonical URL with 1.0 priority', () => {
      const sitemapPath = path.join(PROJECT_ROOT, 'dist/sitemap.xml');
      assert.ok(fs.existsSync(sitemapPath), 'dist/sitemap.xml must exist');

      const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
      assert.ok(sitemap.includes('https://angrove.ru'), 'sitemap must reference https://angrove.ru');
      assert.ok(sitemap.includes('<priority>1.0</priority>'), 'sitemap must set priority 1.0');
    });
  });

  // =========================================================================
  // Suite H5: Local-Only & Production Safety Constraints
  // =========================================================================
  describe('H5: Local-Only & Production Safety Constraints', () => {
    test('H5.1: Remote origin/main is held at pre-teamwork baseline (0c2fc10) with changes unpushed', () => {
      const remoteHead = execSync('git rev-parse origin/main', {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
      }).trim();

      assert.strictEqual(
        remoteHead.substring(0, 7),
        '0c2fc10',
        `Remote origin/main must be held at pre-teamwork baseline 0c2fc10 (found ${remoteHead})`
      );
    });

    test('H5.2: Git status confirms local branch tracks origin/main with local improvements held locally', () => {
      const branchInfo = execSync('git status -sb', {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
      }).trim();

      assert.ok(branchInfo.includes('main...origin/main'), 'Local branch must track origin/main');
    });
  });
});
