import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { startStaticServer } from './e2e/helpers/staticServer.mjs';
import { launchBrowser } from './e2e/helpers/browser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

describe('Empirical Challenger: Milestone M1 (Cases Before/After Section)', () => {
  let staticServer;
  let browser;
  let page;

  before(async () => {
    // 1. Verify build
    const distIndex = path.join(PROJECT_ROOT, 'dist/index.html');
    if (!fs.existsSync(distIndex)) {
      execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'ignore' });
    }

    // 2. Start static server
    staticServer = await startStaticServer();

    // 3. Launch Chrome CDP
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

  // =========================================================================
  // 1. Static Contract & Layout Assertions
  // =========================================================================
  describe('1. Static Architecture & Layout Contracts', () => {
    test('1.1: App.tsx imports Cases and mounts it strictly between Services and Process', () => {
      const appSource = fs.readFileSync(path.join(PROJECT_ROOT, 'src/App.tsx'), 'utf-8');
      
      // Check import
      assert.match(appSource, /import\s+\{\s*Cases\s*\}\s+from\s+['"]\.\/components\/sections\/Cases['"]/, 'Cases must be imported from ./components/sections/Cases');

      // Check mount sequence: <Services /> -> <Cases /> -> <Process />
      const servicesIdx = appSource.indexOf('<Services');
      const casesIdx = appSource.indexOf('<Cases');
      const processIdx = appSource.indexOf('<Process');

      assert.ok(servicesIdx !== -1, '<Services /> must be in App.tsx');
      assert.ok(casesIdx !== -1, '<Cases /> must be in App.tsx');
      assert.ok(processIdx !== -1, '<Process /> must be in App.tsx');

      assert.ok(servicesIdx < casesIdx, '<Services /> must precede <Cases />');
      assert.ok(casesIdx < processIdx, '<Cases /> must precede <Process />');
    });

    test('1.2: Cases.tsx provides section element with id="cases" and data-reveal markers', () => {
      const casesSource = fs.readFileSync(path.join(PROJECT_ROOT, 'src/components/sections/Cases.tsx'), 'utf-8');
      assert.match(casesSource, /id="cases"/, 'Section must have id="cases"');
      assert.match(casesSource, /data-reveal="badge"/, 'Must contain data-reveal="badge"');
      assert.match(casesSource, /data-reveal="desc"/, 'Must contain data-reveal="desc"');
      assert.match(casesSource, /data-reveal="stage"/, 'Must contain data-reveal="stage"');
      assert.match(casesSource, /useSectionReveal\(sectionRef/, 'Must call useSectionReveal(sectionRef)');
    });

    test('1.3: DOM order in rendered page verifies #cases is positioned between #services and #process', async () => {
      const domOrder = await page.evaluate(() => {
        const services = document.getElementById('services');
        const cases = document.getElementById('cases');
        const process = document.getElementById('process');
        if (!services || !cases || !process) {
          return { found: false, sBeforeC: false, cBeforeP: false };
        }
        const sCompC = services.compareDocumentPosition(cases);
        const cCompP = cases.compareDocumentPosition(process);
        return {
          found: true,
          sBeforeC: (sCompC & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
          cBeforeP: (cCompP & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        };
      });

      assert.strictEqual(domOrder.found, true, 'All three sections (#services, #cases, #process) must exist in DOM');
      assert.strictEqual(domOrder.sBeforeC, true, '#cases must follow #services in DOM order');
      assert.strictEqual(domOrder.cBeforeP, true, '#process must follow #cases in DOM order');
    });
  });

  // =========================================================================
  // 2. Data Completeness & Metric Sanity (Oracle)
  // =========================================================================
  describe('2. Data Completeness & Metric Sanity Across All 3 Cases', () => {
    test('2.1: Exactly 3 case studies are defined with complete data fields', async () => {
      const casesData = await page.evaluate(() => {
        const section = document.getElementById('cases');
        if (!section) return null;
        const buttons = Array.from(section.querySelectorAll('[id^="case-tab-"]'));
        return {
          tabCount: buttons.length,
          tabIds: buttons.map(b => b.id),
          tabLabels: buttons.map(b => b.textContent?.trim() || ''),
        };
      });

      assert.ok(casesData, '#cases element not found');
      assert.strictEqual(casesData.tabCount, 3, 'Must have exactly 3 tab buttons');
      assert.deepStrictEqual(casesData.tabIds, ['case-tab-0', 'case-tab-1', 'case-tab-2']);
      assert.ok(casesData.tabLabels[0].includes('01. Салоны красоты'), 'Tab 0 must be Salons');
      assert.ok(casesData.tabLabels[1].includes('02. Товарный бизнес'), 'Tab 1 must be E-com');
      assert.ok(casesData.tabLabels[2].includes('03. B2B-услуги'), 'Tab 2 must be B2B');
    });

    test('2.2: Tab 0 (Salons) displays all hard metrics, payback, quote, and loss details', async () => {
      // Ensure tab 0 is active
      await page.click('#case-tab-0');
      await new Promise(r => setTimeout(r, 350));

      const tab0Details = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return null;
        const text = s.textContent || '';
        const ctaLinks = Array.from(s.querySelectorAll('a[href*="t.me"]')).map(a => a.getAttribute('href'));
        return {
          hasNicheBadge: text.includes('Салоны красоты & косметология'),
          hasClientTitle: text.includes('Сеть студий лазерной эпиляции'),
          hasPayback: text.includes('14 дней'),
          hasLossMetric: text.includes('210 000 ₽ / мес'),
          hasMetric1: text.includes('–68%'),
          hasMetric2: text.includes('+240 000 ₽'),
          hasMetric3: text.includes('3 сек'),
          hasQuoteAuthor: text.includes('Елена В.'),
          hasQuoteRole: text.includes('Управляющая сетью студий эпиляции'),
          hasInitials: text.includes('ЕВ'),
          hasYclientsTech: text.includes('YClients API'),
          hasClaudeTech: text.includes('Claude 3.5 Sonnet'),
          ctaLinks,
        };
      });

      assert.ok(tab0Details, 'Tab 0 evaluation failed');
      assert.strictEqual(tab0Details.hasNicheBadge, true, 'Tab 0 must display niche badge');
      assert.strictEqual(tab0Details.hasClientTitle, true, 'Tab 0 must display client title');
      assert.strictEqual(tab0Details.hasPayback, true, 'Tab 0 must display 14 дней payback');
      assert.strictEqual(tab0Details.hasLossMetric, true, 'Tab 0 must display loss metric');
      assert.strictEqual(tab0Details.hasMetric1, true, 'Tab 0 must display –68% metric');
      assert.strictEqual(tab0Details.hasMetric2, true, 'Tab 0 must display +240 000 ₽ metric');
      assert.strictEqual(tab0Details.hasMetric3, true, 'Tab 0 must display 3 сек metric');
      assert.strictEqual(tab0Details.hasQuoteAuthor, true, 'Tab 0 must display author Elena V.');
      assert.strictEqual(tab0Details.hasInitials, true, 'Tab 0 must display initials ЕВ');
      assert.strictEqual(tab0Details.hasYclientsTech, true, 'Tab 0 must show YClients stack');
      assert.strictEqual(tab0Details.hasClaudeTech, true, 'Tab 0 must show Claude 3.5 stack');
      assert.ok(tab0Details.ctaLinks.length >= 2, 'Must have at least 2 CTA links in Cases section');
      assert.ok(tab0Details.ctaLinks[0].includes('YClients') || tab0Details.ctaLinks[0].includes('%D1%81%D0%B0%D0%BB%D0%BE%D0%BD'), 'CTA must encode salons case');
    });

    test('2.3: Tab 1 (E-commerce) displays MoySklad sync metrics, 18-day payback, and quote', async () => {
      await page.click('#case-tab-1');
      await new Promise(r => setTimeout(r, 350));

      const tab1Details = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return null;
        const text = s.textContent || '';
        const ctaLinks = Array.from(s.querySelectorAll('a[href*="t.me"]')).map(a => a.getAttribute('href'));
        return {
          hasNicheBadge: text.includes('Товарный бизнес & E-commerce'),
          hasClientTitle: text.includes('Производство и опт аксессуаров'),
          hasPayback: text.includes('18 дней'),
          hasLossMetric: text.includes('15 срывов отгрузок'),
          hasMetric1: text.includes('0 ошибок'),
          hasMetric2: text.includes('120 ч'),
          hasMetric3: text.includes('< 2 мин'),
          hasQuoteAuthor: text.includes('Максим Т.'),
          hasInitials: text.includes('МТ'),
          hasMoySkladTech: text.includes('МойСклад API'),
          hasCdekTech: text.includes('СДЭК API'),
          ctaLinks,
        };
      });

      assert.ok(tab1Details, 'Tab 1 evaluation failed');
      assert.strictEqual(tab1Details.hasNicheBadge, true, 'Tab 1 must display e-com badge');
      assert.strictEqual(tab1Details.hasPayback, true, 'Tab 1 must display 18 дней payback');
      assert.strictEqual(tab1Details.hasLossMetric, true, 'Tab 1 must display 15 срывов');
      assert.strictEqual(tab1Details.hasMetric1, true, 'Tab 1 must display 0 ошибок');
      assert.strictEqual(tab1Details.hasMetric2, true, 'Tab 1 must display 120 ч');
      assert.strictEqual(tab1Details.hasMetric3, true, 'Tab 1 must display < 2 мин');
      assert.strictEqual(tab1Details.hasQuoteAuthor, true, 'Tab 1 must display Maxim T.');
      assert.strictEqual(tab1Details.hasInitials, true, 'Tab 1 must display МТ');
      assert.strictEqual(tab1Details.hasMoySkladTech, true, 'Tab 1 must show MoySklad stack');
      assert.strictEqual(tab1Details.hasCdekTech, true, 'Tab 1 must show CDEK stack');
      assert.ok(tab1Details.ctaLinks[0].includes('%D0%9C%D0%BE%D0%B9%D0%A1%D0%BA%D0%BB%D0%B0%D0%B4') || decodeURIComponent(tab1Details.ctaLinks[0]).includes('МойСклад'), 'CTA must encode MoySklad message');
    });

    test('2.4: Tab 2 (B2B Supply) displays Playwright parser, 21-day payback, and 60x metric', async () => {
      await page.click('#case-tab-2');
      await new Promise(r => setTimeout(r, 600));

      const tab2Details = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return null;
        const text = s.textContent || '';
        console.log('--- TEST 2.4 TEXT SNIPPET ---', text.slice(0, 300));
        const ctaLinks = Array.from(s.querySelectorAll('a[href*="t.me"]')).map(a => a.getAttribute('href'));
        return {
          hasNicheBadge: text.includes('B2B-услуги & Снабжение'),
          hasClientTitle: text.includes('Поставщик крепежа и металлоконструкций'),
          hasPayback: text.includes('21 день'),
          hasMetric1: text.includes('60x быстрее'),
          hasMetric2: text.includes('98.4%'),
          hasMetric3: text.includes('+38%'),
          hasQuoteAuthor: text.includes('Дмитрий К.'),
          hasInitials: text.includes('ДК'),
          hasPlaywrightTech: text.includes('Python Playwright'),
          hasAmoCrmTech: text.includes('amoCRM API'),
          hasHlrTech: text.includes('HLR Lookup'),
          ctaLinks,
        };
      });

      assert.ok(tab2Details, 'Tab 2 evaluation failed');
      assert.strictEqual(tab2Details.hasNicheBadge, true, 'Tab 2 must display B2B badge');
      assert.strictEqual(tab2Details.hasPayback, true, 'Tab 2 must display 21 день payback');
      assert.strictEqual(tab2Details.hasMetric1, true, 'Tab 2 must display 60x быстрее');
      assert.strictEqual(tab2Details.hasMetric2, true, 'Tab 2 must display 98.4%');
      assert.strictEqual(tab2Details.hasMetric3, true, 'Tab 2 must display +38%');
      assert.strictEqual(tab2Details.hasQuoteAuthor, true, 'Tab 2 must display Dmitry K.');
      assert.strictEqual(tab2Details.hasInitials, true, 'Tab 2 must display ДК');
      assert.strictEqual(tab2Details.hasPlaywrightTech, true, 'Tab 2 must show Playwright stack');
      assert.strictEqual(tab2Details.hasAmoCrmTech, true, 'Tab 2 must show amoCRM stack');
      assert.ok(decodeURIComponent(tab2Details.ctaLinks[0]).includes('B2B') || tab2Details.ctaLinks[0].includes('B2B'), 'CTA must encode B2B message');
    });
  });

  // =========================================================================
  // 3. Adversarial Stress Testing
  // =========================================================================
  describe('3. Adversarial Stress Testing & Edge Cases', () => {
    test('3.1: Rapid Tab Thrashing Stress Test does not crash or corrupt UI state', async () => {
      // Rapid clicks across tabs in 25ms intervals
      await page.evaluate(async () => {
        const s = document.getElementById('cases');
        if (!s) return;
        const b0 = s.querySelector('#case-tab-0');
        const b1 = s.querySelector('#case-tab-1');
        const b2 = s.querySelector('#case-tab-2');

        const sequence = [b0, b1, b2, b0, b2, b1, b0, b1, b2];
        for (const btn of sequence) {
          if (btn) btn.click();
          await new Promise(r => setTimeout(r, 25));
        }
      });

      // Wait 500ms for Framer Motion exit/enter to completely settle
      await new Promise(r => setTimeout(r, 500));

      const finalState = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return { ok: false, error: 'No #cases' };
        
        // Final clicked button was b2 (case-tab-2)
        const activeBtn = s.querySelector('#case-tab-2');
        const isB2Active = activeBtn && activeBtn.className.includes('#0A0C16');
        
        const text = s.textContent || '';
        const matchesB2Content = text.includes('B2B') && text.includes('Playwright');
        
        // Check for any duplicate cards or broken stage
        const stages = s.querySelectorAll('[data-reveal="stage"]');
        return {
          ok: true,
          isB2Active,
          matchesB2Content,
          stageCount: stages.length,
        };
      });

      assert.strictEqual(finalState.ok, true);
      assert.strictEqual(finalState.isB2Active, true, 'Tab 2 button must be active after sequence');
      assert.strictEqual(finalState.matchesB2Content, true, 'DOM content must match Tab 2 after sequence');
      assert.strictEqual(finalState.stageCount, 1, 'Exactly 1 stage container must exist');

      // Check console errors
      const errors = page.getConsoleErrors();
      assert.strictEqual(errors.length, 0, `No console errors allowed during rapid tab thrashing, got: ${errors.join('; ')}`);
    });

    test('3.2: Telegram Deep Links URL Encoding & Strict Validation', async () => {
      // Switch through all tabs and inspect every link
      for (const tabIndex of [0, 1, 2]) {
        await page.click(`#case-tab-${tabIndex}`);
        await new Promise(r => setTimeout(r, 300));

        const links = await page.evaluate(() => {
          const s = document.getElementById('cases');
          if (!s) return [];
          const anchors = Array.from(s.querySelectorAll('a[href*="t.me"]'));
          return anchors.map(a => ({
            href: a.getAttribute('href') || '',
            target: a.getAttribute('target'),
            rel: a.getAttribute('rel'),
            text: a.textContent?.trim() || '',
          }));
        });

        assert.ok(links.length >= 2, `Tab ${tabIndex} must have at least 2 Telegram CTAs`);

        for (const link of links) {
          assert.strictEqual(link.target, '_blank', 'Telegram link must have target="_blank"');
          assert.ok(link.rel && link.rel.includes('noopener') && link.rel.includes('noreferrer'), 'Must have rel="noopener noreferrer"');

          const parsed = new URL(link.href);
          assert.strictEqual(parsed.protocol, 'https:', 'Must use HTTPS');
          assert.strictEqual(parsed.hostname, 't.me', 'Hostname must be t.me');
          assert.strictEqual(parsed.pathname.toUpperCase(), '/ANGROVE', 'Target username must be @ANGROVE');

          const textParam = parsed.searchParams.get('text');
          assert.ok(textParam, 'Must contain non-empty ?text query param');
          assert.ok(textParam.startsWith('Добрый день, Андрей!'), 'Message must start with standard polite greeting');
          assert.ok(textParam.includes('кейс'), 'Message must reference the case');
          
          // Ensure no double URI encoding like %2520
          assert.ok(!link.href.includes('%25'), 'URL must NOT contain double-encoded %25 entities');
        }
      }
    });

    test('3.3: Analytics Goals Dispatch Verification', async () => {
      // Mock window.ym in page context to track events
      await page.evaluate(() => {
        window.__ymCalls = [];
        window.ym = function(id, action, target) {
          window.__ymCalls.push({ id, action, target });
        };
      });

      // Click the top "Обсудить мою задачу" CTA button
      await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return;
        const topCta = s.querySelector('a[href*="t.me"]');
        if (topCta) topCta.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      });

      const ymCalls = await page.evaluate(() => window.__ymCalls || []);
      const discussGoal = ymCalls.find(c => c.action === 'reachGoal' && c.target === 'click_case_discuss');
      const telegramGoal = ymCalls.find(c => c.action === 'reachGoal' && c.target === 'click_telegram');

      assert.ok(discussGoal, 'Clicking CTA must fire click_case_discuss goal');
      assert.ok(telegramGoal, 'Clicking CTA must fire click_telegram goal');
    });

    test('3.4: Mobile Viewport (375x667) Resilience & Zero Horizontal Overflow', async () => {
      await page.setViewport({ width: 375, height: 667, mobile: true });
      await new Promise(r => setTimeout(r, 400));

      const mobileMetrics = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return null;
        
        const docScrollWidth = document.documentElement.scrollWidth;
        const sectionScrollWidth = s.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;

        // Check tab buttons visibility & bounding rects
        const tabs = Array.from(s.querySelectorAll('[id^="case-tab-"]')).map(btn => {
          const rect = btn.getBoundingClientRect();
          return {
            id: btn.id,
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
          };
        });

        return {
          clientWidth,
          docScrollWidth,
          sectionScrollWidth,
          hasHorizontalOverflow: docScrollWidth > clientWidth,
          tabs,
        };
      });

      assert.ok(mobileMetrics, 'Mobile evaluation failed');
      assert.strictEqual(mobileMetrics.hasHorizontalOverflow, false, `Page must not overflow horizontally on mobile 375px (scrollWidth: ${mobileMetrics.docScrollWidth}, clientWidth: ${mobileMetrics.clientWidth})`);
      assert.strictEqual(mobileMetrics.tabs.length, 3, 'All 3 tabs must exist on mobile');
      assert.ok(mobileMetrics.tabs.every(t => t.visible), 'All 3 tabs must have non-zero dimensions on mobile');

      // Click tab 1 on mobile
      await page.click('#case-tab-1');
      await new Promise(r => setTimeout(r, 350));

      const mobileSwitched = await page.evaluate(() => {
        const s = document.getElementById('cases');
        return s ? s.textContent.includes('МойСклад') : false;
      });
      assert.strictEqual(mobileSwitched, true, 'Mobile tab switching must work seamlessly');

      // Restore desktop viewport
      await page.setViewport({ width: 1440, height: 900, mobile: false });
      await new Promise(r => setTimeout(r, 400));
    });

    test('3.5: Ultra-Narrow Viewport (320x568 - iPhone SE 1st gen) Zero Horizontal Spill', async () => {
      await page.setViewport({ width: 320, height: 568, mobile: true });
      await new Promise(r => setTimeout(r, 400));

      const spill = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return true;
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      assert.strictEqual(spill, false, 'No horizontal overflow allowed even at 320px width');

      // Restore desktop viewport
      await page.setViewport({ width: 1440, height: 900, mobile: false });
    });

    test('3.6: Keyboard Accessibility & Element Semantics', async () => {
      const a11yCheck = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return null;

        const buttons = Array.from(s.querySelectorAll('button'));
        const buttonsHaveType = buttons.every(b => b.getAttribute('type') === 'button');

        const links = Array.from(s.querySelectorAll('a'));
        const linksHaveHref = links.every(a => Boolean(a.getAttribute('href')));

        return {
          buttonsCount: buttons.length,
          buttonsHaveType,
          linksCount: links.length,
          linksHaveHref,
        };
      });

      assert.ok(a11yCheck, 'A11y check failed');
      assert.ok(a11yCheck.buttonsCount >= 3, 'Must have at least 3 buttons');
      assert.strictEqual(a11yCheck.buttonsHaveType, true, 'All button elements must have explicit type="button" attribute');
      assert.ok(a11yCheck.linksCount >= 2, 'Must have at least 2 links');
      assert.strictEqual(a11yCheck.linksHaveHref, true, 'All links must have non-empty href');
    });

    test('3.7: Hit Testing & Unobstructed Click Targets for Conversion CTAs', async () => {
      const hitTest = await page.evaluate(async () => {
        const s = document.getElementById('cases');
        if (!s) return null;

        const ctas = Array.from(s.querySelectorAll('a[href*="t.me"]'));
        const results = [];
        for (let idx = 0; idx < ctas.length; idx++) {
          const cta = ctas[idx];
          if (window.lenis) {
            window.lenis.scrollTo(cta, { immediate: true, offset: -250 });
          } else {
            cta.scrollIntoView({ block: 'center', behavior: 'instant' });
          }
          await new Promise(r => setTimeout(r, 200));

          const rect = cta.getBoundingClientRect();
          const cx = Math.floor(rect.left + rect.width / 2);
          const cy = Math.floor(rect.top + rect.height / 2);
          const inBounds = cy >= 0 && cy <= window.innerHeight && cx >= 0 && cx <= window.innerWidth;
          const target = inBounds ? document.elementFromPoint(cx, cy) : null;
          const isDirectOrChild = Boolean(target && (target === cta || cta.contains(target)));
          results.push({
            idx,
            inBounds,
            isDirectOrChild,
            rect: { top: rect.top, cy, height: window.innerHeight },
            targetTag: target?.tagName,
            targetClass: target?.className,
          });
        }
        return results;
      });

      assert.ok(hitTest, 'Hit test failed to evaluate');
      assert.ok(hitTest.length >= 2, 'Must have tested at least 2 CTAs');
      for (const res of hitTest) {
        assert.strictEqual(res.inBounds, true, `CTA #${res.idx} must be within viewport bounds (cy: ${res.rect.cy}, h: ${res.rect.height})`);
        assert.strictEqual(res.isDirectOrChild, true, `CTA #${res.idx} must not be obstructed by overlay (hit: ${res.targetTag}.${res.targetClass}, pos: ${JSON.stringify(res.rect)})`);
      }
    });

    test('3.8: Numerical Metrics Feature Tabular-Nums for Layout Stability', async () => {
      const tabularCheck = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return false;
        // Search for numbers like –68%, +240 000, 3 сек
        const metricValueEls = Array.from(s.querySelectorAll('.tabular-nums'));
        return metricValueEls.length >= 3;
      });

      assert.strictEqual(tabularCheck, true, 'Hard metrics must include tabular-nums styling to prevent layout shift');
    });

    test('3.9: Reduced Motion Emulation Leaves Cases Section 100% Legible', async () => {
      // Emulate prefers-reduced-motion: reduce
      await page.pSend('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
      });

      const visibilityCheck = await page.evaluate(() => {
        const s = document.getElementById('cases');
        if (!s) return null;
        const style = window.getComputedStyle(s);
        const stage = s.querySelector('[data-reveal="stage"]');
        const stageStyle = stage ? window.getComputedStyle(stage) : null;

        return {
          sectionOpacity: style.opacity,
          sectionDisplay: style.display,
          stageOpacity: stageStyle?.opacity,
        };
      });

      assert.ok(visibilityCheck, 'Visibility check failed');
      assert.strictEqual(visibilityCheck.sectionDisplay !== 'none', true, 'Section must be displayed');
      assert.strictEqual(parseFloat(visibilityCheck.sectionOpacity) > 0, true, 'Section opacity must be > 0');
      assert.strictEqual(parseFloat(visibilityCheck.stageOpacity || '1') > 0, true, 'Stage opacity must be > 0');

      // Clear emulation
      await page.pSend('Emulation.setEmulatedMedia', { features: [] });
    });
  });
});
