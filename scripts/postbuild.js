import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtml, 'utf8');

// 1. Create dist/privacy/index.html
const privacyDir = path.join(distDir, 'privacy');
if (!fs.existsSync(privacyDir)) {
  fs.mkdirSync(privacyDir, { recursive: true });
}
let privacyHtml = baseHtml
  .replace(
    /<title>.*?<\/title>/,
    '<title>Политика конфиденциальности | _angrove_</title>'
  )
  .replace(
    /<meta name="description" content=".*?" \/>/,
    '<meta name="description" content="Политика обработки персональных данных сайта angrove.ru (_angrove_)." />'
  )
  .replace(
    /<link rel="canonical" href=".*?" \/>/,
    '<link rel="canonical" href="https://angrove.ru/privacy" />'
  );
fs.writeFileSync(path.join(privacyDir, 'index.html'), privacyHtml, 'utf8');
console.log('✓ Created dist/privacy/index.html with custom metadata');

// 2. Create dist/404.html for GitHub Pages SPA fallback
fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));
console.log('✓ Created dist/404.html for SPA fallback routing');

// Clean up any old solutions directory in dist
const solutionsDir = path.join(distDir, 'solutions');
if (fs.existsSync(solutionsDir)) {
  fs.rmSync(solutionsDir, { recursive: true, force: true });
  console.log('✓ Cleaned up dist/solutions directory');
}

// 3. Update sitemap.xml with main pages only
const today = new Date().toISOString().split('T')[0];
const sitemapUrls = [
  { loc: 'https://angrove.ru/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://angrove.ru/privacy', priority: '0.3', changefreq: 'monthly' }
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf8');
fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemapContent, 'utf8');
console.log(`✓ Updated sitemap.xml with ${sitemapUrls.length} indexed URLs`);

// 4. IndexNow Auto-Ping
try {
  const { execSync } = await import('child_process');
  console.log('→ Triggering IndexNow submission...');
  execSync('node scripts/ping_indexnow.mjs', { stdio: 'inherit' });
} catch (e) {
  console.warn('IndexNow ping notice:', e.message);
}
