import fs from 'fs';
import path from 'path';
import { SOLUTIONS } from '../src/data/solutionsData.ts';

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

// 3. Generate SSG pages for each pSEO solution in dist/solutions/[slug]/index.html
const solutionsBaseDir = path.join(distDir, 'solutions');
if (!fs.existsSync(solutionsBaseDir)) {
  fs.mkdirSync(solutionsBaseDir, { recursive: true });
}

for (const [slug, item] of Object.entries(SOLUTIONS)) {
  const itemDir = path.join(solutionsBaseDir, slug);
  if (!fs.existsSync(itemDir)) {
    fs.mkdirSync(itemDir, { recursive: true });
  }

  const itemUrl = `https://angrove.ru/solutions/${slug}`;

  // Build JSON-LD structured data graph for the solution
  const solutionJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Главная',
            'item': 'https://angrove.ru/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Решения',
            'item': 'https://angrove.ru/#services'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': item.badge,
            'item': itemUrl
          }
        ]
      },
      {
        '@type': 'Service',
        'name': `${item.title} ${item.titleHighlight}`,
        'description': item.description,
        'provider': {
          '@type': 'Person',
          'name': 'Андрей (_angrove_)',
          'url': 'https://angrove.ru/'
        },
        'areaServed': 'RU',
        'offers': {
          '@type': 'Offer',
          'price': item.priceFrom.replace(/\D/g, '') || '35000',
          'priceCurrency': 'RUB',
          'availability': 'https://schema.org/InStock',
          'url': itemUrl
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': item.faq.map((f) => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.a
          }
        }))
      }
    ]
  };

  let pageHtml = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${item.metaTitle}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${item.metaDescription}" />`
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${itemUrl}" />`
    )
    .replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${item.metaTitle}" />`
    )
    .replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${item.metaDescription}" />`
    )
    .replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${itemUrl}" />`
    )
    .replace(
      /<meta property="twitter:title" content=".*?" \/>/,
      `<meta property="twitter:title" content="${item.metaTitle}" />`
    )
    .replace(
      /<meta property="twitter:description" content=".*?" \/>/,
      `<meta property="twitter:description" content="${item.metaDescription}" />`
    );

  // Replace default JSON-LD with specialized Solution + FAQ schema
  const jsonLdRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
  const newJsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(
    solutionJsonLd,
    null,
    2
  )}\n    </script>`;

  if (jsonLdRegex.test(pageHtml)) {
    pageHtml = pageHtml.replace(jsonLdRegex, newJsonLdScript);
  }

  fs.writeFileSync(path.join(itemDir, 'index.html'), pageHtml, 'utf8');
  console.log(`✓ SSG generated: dist/solutions/${slug}/index.html`);
}

// 4. Update sitemap.xml with today's date and all solution pages
const today = new Date().toISOString().split('T')[0];
const sitemapUrls = [
  { loc: 'https://angrove.ru/', priority: '1.0', changefreq: 'daily' },
  ...Object.keys(SOLUTIONS).map((slug) => ({
    loc: `https://angrove.ru/solutions/${slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  })),
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
console.log(`✓ Updated sitemap.xml with ${sitemapUrls.length} indexed URLs (priority 1.0 / 0.8)`);

// 5. IndexNow Auto-Ping
try {
  const { execSync } = await import('child_process');
  console.log('→ Triggering IndexNow submission...');
  execSync('node scripts/ping_indexnow.mjs', { stdio: 'inherit' });
} catch (e) {
  console.warn('IndexNow ping notice:', e.message);
}

