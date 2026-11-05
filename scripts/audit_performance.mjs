import { launchBrowser } from '../tests/e2e/helpers/browser.mjs';
import { startStaticServer } from '../tests/e2e/helpers/staticServer.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function measure() {
  const server = await startStaticServer();
  const browser = await launchBrowser();
  const page = await browser.createPage();

  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, mobile: true });

  await page.pSend('Performance.enable');
  await page.navigate(server.url, { delayAfter: 2000 });

  const perfMetrics = await page.pSend('Performance.getMetrics');
  const metricsMap = Object.fromEntries(perfMetrics.metrics.map((m) => [m.name, m.value]));

  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0;
    return {
      fcp: Math.round(fcp),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
      loadComplete: Math.round(nav.loadEventEnd - nav.startTime),
      transferSize: nav.transferSize || 0,
      encodedBodySize: nav.encodedBodySize || 0,
    };
  });

  const assetsDir = path.join(PROJECT_ROOT, 'dist/assets');
  const files = fs.readdirSync(assetsDir);
  let totalJsSize = 0;
  let totalCssSize = 0;
  let totalFontSize = 0;

  for (const f of files) {
    const s = fs.statSync(path.join(assetsDir, f)).size;
    if (f.endsWith('.js')) totalJsSize += s;
    else if (f.endsWith('.css')) totalCssSize += s;
    else if (f.endsWith('.woff2') || f.endsWith('.woff')) totalFontSize += s;
  }

  const results = {
    timing,
    metricsMap: {
      JSHeapUsedSize: Math.round(metricsMap.JSHeapUsedSize / 1024 / 1024 * 100) / 100 + ' MB',
      JSHeapTotalSize: Math.round(metricsMap.JSHeapTotalSize / 1024 / 1024 * 100) / 100 + ' MB',
      LayoutCount: metricsMap.LayoutCount,
      RecalcStyleCount: metricsMap.RecalcStyleCount,
    },
    bundleSizes: {
      totalJsKB: (totalJsSize / 1024).toFixed(1) + ' KB',
      totalCssKB: (totalCssSize / 1024).toFixed(1) + ' KB',
      totalFontsKB: (totalFontSize / 1024).toFixed(1) + ' KB',
    },
  };

  console.log('--- EMPIRICAL PERFORMANCE AUDIT METRICS ---');
  console.log(JSON.stringify(results, null, 2));

  await page.close().catch(() => {});
  await browser.close().catch(() => {});
  await server.close().catch(() => {});
}

measure().catch(console.error);
