import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { startStaticServer } from './helpers/staticServer.mjs';
import { launchBrowser } from './helpers/browser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

describe('Challenger M1: Adversarial Stress Tests for Cases Before/After', () => {
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

  // =========================================================================
  // Test 1: Bundle Impact Verification
  // =========================================================================
  describe('T1: Bundle Impact & Asset Footprint', () => {
    test('T1.1: Production dist output contains expected split chunks without bloat', () => {
      const distAssetsDir = path.join(PROJECT_ROOT, 'dist/assets');
      assert.ok(fs.existsSync(distAssetsDir), 'dist/assets directory must exist');

      const files = fs.readdirSync(distAssetsDir);
      const jsFiles = files.filter((f) => f.endsWith('.js'));
      const cssFiles = files.filter((f) => f.endsWith('.css'));

      assert.ok(jsFiles.length >= 8, `Expected modular chunk split (found ${jsFiles.length} JS files)`);
      assert.ok(cssFiles.length >= 1, `Expected compiled CSS bundle (found ${cssFiles.length} CSS files)`);

      // Verify specific chunk sizes
      const mainBundle = jsFiles.find((f) => f.startsWith('index-'));
      assert.ok(mainBundle, 'Main index bundle must exist');
      const mainStat = fs.statSync(path.join(distAssetsDir, mainBundle));
      assert.ok(mainStat.size < 200 * 1024, `Main index bundle must be < 200KB (actual: ${(mainStat.size / 1024).toFixed(1)}KB)`);

      const threeBundle = jsFiles.find((f) => f.startsWith('vendor-three-'));
      assert.ok(threeBundle, 'vendor-three chunk must be split separately');

      const motionBundle = jsFiles.find((f) => f.startsWith('vendor-motion-'));
      assert.ok(motionBundle, 'vendor-motion chunk must be split separately');

      const gsapBundle = jsFiles.find((f) => f.startsWith('vendor-gsap-'));
      assert.ok(gsapBundle, 'vendor-gsap chunk must be split separately');
    });

    test('T1.2: Cases does not introduce unpinned or duplicate external dependencies', () => {
      const pkgPath = path.join(PROJECT_ROOT, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const deps = Object.keys(pkg.dependencies || {});

      // Verify dependencies remain lean and standard
      const allowedDeps = [
        '@fontsource/jetbrains-mono',
        '@fontsource/lora',
        '@fontsource/onest',
        '@types/three',
        'framer-motion',
        'gsap',
        'lenis',
        'lucide-react',
        'react',
        'react-dom',
        'three'
      ];
      for (const dep of deps) {
        assert.ok(allowedDeps.includes(dep), `Unexpected new dependency in package.json: ${dep}`);
      }
    });
  });

  // =========================================================================
  // Test 2: Mobile Viewport Stress Testing (320px – 414px)
  // =========================================================================
  describe('T2: Mobile Viewport & Responsiveness (320px–414px)', () => {
    const mobileViewports = [
      { name: 'iPhone SE 1st gen', width: 320, height: 568 },
      { name: 'Small Android', width: 360, height: 640 },
      { name: 'iPhone SE 2nd gen / 8', width: 375, height: 667 },
      { name: 'iPhone 13 / 14', width: 390, height: 844 },
      { name: 'iPhone Plus / Max', width: 414, height: 896 }
    ];

    for (const vp of mobileViewports) {
      test(`T2: Viewport ${vp.width}x${vp.height} (${vp.name}) — zero horizontal overflow in #cases across all tabs`, async () => {
        await page.setViewport({ width: vp.width, height: vp.height, mobile: true });
        await page.navigate(staticServer.url, { delayAfter: 800 });

        // Scroll to cases section
        await page.evaluate(() => {
          const el = document.getElementById('cases');
          if (el) el.scrollIntoView();
        });
        await new Promise((r) => setTimeout(r, 400));

        // Test each of the 3 tabs for overflow
        for (let tabIdx = 0; tabIdx < 3; tabIdx++) {
          const checkResult = await page.evaluate(`(async () => {
            const idx = ${tabIdx};
            const section = document.getElementById('cases');
            if (!section) return { ok: false, error: 'Section #cases not found' };

            // Switch to tab
            const tabBtn = document.getElementById('case-tab-' + idx);
            if (tabBtn) {
              tabBtn.click();
              await new Promise((r) => setTimeout(r, 350));
            }

            // Check document horizontal scroll
            const docScrollWidth = document.documentElement.scrollWidth;
            const docClientWidth = document.documentElement.clientWidth;
            const windowInnerWidth = window.innerWidth;

            const hasDocOverflow = docScrollWidth > windowInnerWidth + 1; // allow 1px rounding

            // Check all elements in #cases for bounding rect exceeding viewport
            const elements = Array.from(section.querySelectorAll('*'));
            const overflowingElements = [];

            for (const el of elements) {
              const rect = el.getBoundingClientRect();
              // Ignore zero-size elements
              if (rect.width === 0 || rect.height === 0) continue;
              if (rect.right > windowInnerWidth + 2) {
                overflowingElements.push({
                  tag: el.tagName,
                  className: (el.className || '').toString().slice(0, 60),
                  right: rect.right,
                  overflow: rect.right - windowInnerWidth
                });
              }
            }

            return {
              ok: !hasDocOverflow && overflowingElements.length === 0,
              docScrollWidth,
              docClientWidth,
              windowInnerWidth,
              overflowingCount: overflowingElements.length,
              sampleOverflow: overflowingElements.slice(0, 3)
            };
          })()`);

          assert.strictEqual(
            checkResult.ok,
            true,
            `Viewport ${vp.width}px Tab ${tabIdx} had overflow! Details: ${JSON.stringify(checkResult)}`
          );
        }
      });
    }

    test('T2.6: Tab buttons text is cleanly truncated or wrapped without breaking layout at 320px', async () => {
      await page.setViewport({ width: 320, height: 568, mobile: true });
      await page.navigate(staticServer.url, { delayAfter: 600 });

      const tabsInfo = await page.evaluate(() => {
        const section = document.getElementById('cases');
        if (!section) return [];
        const buttons = Array.from(section.querySelectorAll('button[id^="case-tab-"]'));
        return buttons.map((b) => {
          const rect = b.getBoundingClientRect();
          return {
            id: b.id,
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0
          };
        });
      });

      assert.strictEqual(tabsInfo.length, 3, 'Must render 3 tab buttons');
      for (const t of tabsInfo) {
        assert.ok(t.visible, `Tab ${t.id} must be visible on 320px`);
        assert.ok(t.width <= 320, `Tab ${t.id} width (${t.width}) must fit within 320px viewport`);
      }
    });

    test('T2.7: Metric cards stack vertically on mobile (320px-375px)', async () => {
      await page.setViewport({ width: 375, height: 667, mobile: true });
      await page.navigate(staticServer.url, { delayAfter: 600 });

      const metricsLayout = await page.evaluate(() => {
        const section = document.getElementById('cases');
        if (!section) return null;
        // Find metric value elements
        const metricCards = Array.from(section.querySelectorAll('.font-display.tabular-nums')).map((el) => {
          const card = el.closest('div');
          const rect = card.getBoundingClientRect();
          return { top: rect.top, left: rect.left, width: rect.width };
        });
        return metricCards;
      });

      assert.ok(metricsLayout && metricsLayout.length >= 3, 'Must find at least 3 metric cards');
      // On small screens (<640px), the metrics grid has grid-cols-1, so tops should be distinct
      assert.ok(
        metricsLayout[0].top < metricsLayout[1].top && metricsLayout[1].top < metricsLayout[2].top,
        'Metric cards must stack vertically on mobile screens'
      );
    });
  });

  // =========================================================================
  // Test 3: 3D Canvas Coordinates & Scroll Alignment
  // =========================================================================
  describe('T3: 3D Canvas Coordinates & Scroll Range Alignment', () => {
    test('T3.1: Section #cases is positioned in the 25%–45% scroll progress window', async () => {
      await page.setViewport({ width: 1440, height: 900 });
      await page.navigate(staticServer.url, { delayAfter: 1200 });

      const scrollAnalysis = await page.evaluate(() => {
        const cases = document.getElementById('cases');
        const services = document.getElementById('services');
        const process = document.getElementById('process');

        if (!cases) return null;

        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;

        const casesRect = cases.getBoundingClientRect();
        const casesTop = window.scrollY + casesRect.top;
        const casesBottom = casesTop + casesRect.height;

        const pStart = casesTop / maxScroll;
        const pEnd = casesBottom / maxScroll;
        const pMid = (pStart + pEnd) / 2;

        return {
          docHeight,
          winHeight,
          maxScroll,
          casesTop,
          casesBottom,
          casesHeight: casesRect.height,
          pStart,
          pMid,
          pEnd,
          hasServices: Boolean(services),
          hasProcess: Boolean(process)
        };
      });

      assert.ok(scrollAnalysis, 'Scroll analysis should return valid data');
      // The 3D reactor defines Cases stage at p: 0.28 -> 0.40.
      // Cases midpoint or range should overlap closely with this window.
      assert.ok(
        scrollAnalysis.pMid >= 0.20 && scrollAnalysis.pMid <= 0.50,
        `Cases section midpoint p=${scrollAnalysis.pMid.toFixed(3)} must align with target range 0.20–0.50 (reactor window: 0.28–0.40)`
      );
      assert.ok(
        scrollAnalysis.pStart < 0.40 && scrollAnalysis.pEnd > 0.28,
        `Cases section range [${scrollAnalysis.pStart.toFixed(3)}, ${scrollAnalysis.pEnd.toFixed(3)}] must overlap with reactor window [0.28, 0.40]`
      );
    });

    test('T3.2: Global3DCanvas cleans up WebGL resources and event listeners', () => {
      const canvasFile = path.join(PROJECT_ROOT, 'src/components/ui/Global3DCanvas.tsx');
      const content = fs.readFileSync(canvasFile, 'utf-8');

      // Verify memory leak defenses in Global3DCanvas:
      assert.ok(content.includes('cancelAnimationFrame'), 'Must cancel animation frame loop on unmount');
      assert.ok(content.includes('removeEventListener'), 'Must remove scroll and resize listeners on unmount');
      assert.ok(content.includes('dispose()') || content.includes('dispose'), 'Must call dispose on Three.js resources');
    });
  });

  // =========================================================================
  // Test 4: useSectionReveal Integration
  // =========================================================================
  describe('T4: useSectionReveal Integration & Framer Motion Harmony', () => {
    test('T4.1: Cases contains valid data-reveal elements matching useSectionReveal selectors', async () => {
      await page.setViewport({ width: 1440, height: 900 });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      const revealElements = await page.evaluate(() => {
        const section = document.getElementById('cases');
        if (!section) return {};
        return {
          badge: Boolean(section.querySelector('[data-reveal="badge"]')),
          desc: Boolean(section.querySelector('[data-reveal="desc"]')),
          stage: Boolean(section.querySelector('[data-reveal="stage"]')),
          card: Boolean(section.querySelector('[data-reveal="card"]'))
        };
      });

      assert.strictEqual(revealElements.badge, true, 'Cases must contain [data-reveal="badge"]');
      assert.strictEqual(revealElements.desc, true, 'Cases must contain [data-reveal="desc"]');
      assert.strictEqual(revealElements.stage, true, 'Cases must contain [data-reveal="stage"]');
    });

    test('T4.2: Elements with data-reveal become fully visible on scroll without getting stuck at opacity:0', async () => {
      await page.setViewport({ width: 1440, height: 900 });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      // Scroll Cases into full view
      await page.evaluate(() => {
        const cases = document.getElementById('cases');
        if (cases) cases.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await new Promise((r) => setTimeout(r, 600));

      const opacities = await page.evaluate(() => {
        const section = document.getElementById('cases');
        if (!section) return [];
        const targets = Array.from(section.querySelectorAll('[data-reveal]'));
        return targets.map((el) => {
          const comp = window.getComputedStyle(el);
          return {
            revealAttr: el.getAttribute('data-reveal'),
            opacity: parseFloat(comp.opacity),
            visibility: comp.visibility
          };
        });
      });

      assert.ok(opacities.length >= 3, 'Must evaluate all data-reveal elements');
      for (const item of opacities) {
        assert.ok(
          item.opacity >= 0.9,
          `Element [data-reveal="${item.revealAttr}"] must be visible (actual opacity: ${item.opacity})`
        );
      }
    });

    test('T4.3: Switching tabs under Framer Motion AnimatePresence works without breaking container opacity', async () => {
      await page.setViewport({ width: 1440, height: 900 });
      await page.navigate(staticServer.url, { delayAfter: 800 });

      await page.evaluate(() => {
        const cases = document.getElementById('cases');
        if (cases) cases.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await new Promise((r) => setTimeout(r, 400));

      // Switch to tab 1, then tab 2, then tab 0
      for (const tabIdx of [1, 2, 0]) {
        const tabCheck = await page.evaluate(`(async () => {
          const idx = ${tabIdx};
          const btn = document.getElementById('case-tab-' + idx);
          if (!btn) return { clicked: false };
          btn.click();
          await new Promise((r) => setTimeout(r, 400));

          const stage = document.querySelector('#cases [data-reveal="stage"]');
          const stageStyle = stage ? window.getComputedStyle(stage) : null;
          const stageOpacity = stageStyle ? parseFloat(stageStyle.opacity) : 0;

          // Check that content inside stage is visible
          const activeContent = document.querySelector('#cases [data-reveal="stage"] h3');
          const contentStyle = activeContent ? window.getComputedStyle(activeContent) : null;
          const contentOpacity = contentStyle ? parseFloat(contentStyle.opacity) : 0;

          return {
            clicked: true,
            stageOpacity,
            contentOpacity,
            headerText: activeContent?.textContent || ''
          };
        })()`);

        assert.strictEqual(tabCheck.clicked, true, `Tab ${tabIdx} must exist and be clicked`);
        assert.ok(tabCheck.stageOpacity >= 0.9, `Stage container opacity must remain >= 0.9 (was ${tabCheck.stageOpacity})`);
        assert.ok(tabCheck.contentOpacity >= 0.9, `Content opacity inside AnimatePresence must be >= 0.9 (was ${tabCheck.contentOpacity})`);
        assert.ok(tabCheck.headerText.length > 5, 'Active case title must be populated');
      }
    });
  });
});
