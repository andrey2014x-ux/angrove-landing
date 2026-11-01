import fs from 'fs';
import path from 'path';
import { SOLUTIONS_RAW } from '../src/data/solutionsRaw.js';

const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtml, 'utf8');

// Clean up any privacy directory in dist (site does not collect or store personal data)
const privacyDir = path.join(distDir, 'privacy');
if (fs.existsSync(privacyDir)) {
  fs.rmSync(privacyDir, { recursive: true, force: true });
  console.log('✓ Cleaned up dist/privacy directory');
}

// 1. Create dist/404.html for GitHub Pages SPA fallback
fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));
console.log('✓ Created dist/404.html for SPA fallback routing');

// 2. Generate SSG pages for each solution in dist/solutions/[slug]/index.html
const solutionsBaseDir = path.join(distDir, 'solutions');
if (!fs.existsSync(solutionsBaseDir)) {
  fs.mkdirSync(solutionsBaseDir, { recursive: true });
}

for (const [slug, item] of Object.entries(SOLUTIONS_RAW)) {
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
          'price': item.priceFrom.replace(/\D/g, '') || '30000',
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

  const noscriptHtml = `
    <noscript>
      <header>
        <p><a href="/">← На главную</a></p>
        <h1>${item.title} ${item.titleHighlight}</h1>
        <p>${item.description}</p>
        <p><strong>Стоимость:</strong> ${item.priceFrom} · <strong>Срок:</strong> ${item.deliveryDays}</p>
      </header>
      <main>
        <section>
          <h2>Что входит в решение</h2>
          <ol>
            ${item.deliverables.map((d) => `<li><strong>${d.title}:</strong> ${d.desc}</li>`).join('\n            ')}
          </ol>
        </section>
        <section>
          <h2>Результаты внедрения</h2>
          <ul>
            ${item.metrics.map((m) => `<li><strong>${m.value}</strong> — ${m.label}</li>`).join('\n            ')}
          </ul>
        </section>
        <section>
          <h2>Часто задаваемые вопросы</h2>
          <dl>
            ${item.faq.map((f) => `<dt><strong>${f.q}</strong></dt>\n            <dd>${f.a}</dd>`).join('\n            ')}
          </dl>
        </section>
        <section>
          <h2>Контакты для заказа</h2>
          <p>Telegram: <a href="https://t.me/ANGROVE">@ANGROVE</a></p>
          <p>Канал: <a href="https://t.me/angrove_ai">@angrove_ai</a></p>
        </section>
      </main>
    </noscript>
  `;

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

  // Replace default noscript with Solution noscript
  const noscriptRegex = /<noscript>[\s\S]*?<\/noscript>/;
  if (noscriptRegex.test(pageHtml)) {
    pageHtml = pageHtml.replace(noscriptRegex, noscriptHtml);
  }

  fs.writeFileSync(path.join(itemDir, 'index.html'), pageHtml, 'utf8');
  console.log(`✓ SSG generated: dist/solutions/${slug}/index.html`);
}

// 3. Update sitemap.xml with main page + all solution pages
const today = new Date().toISOString().split('T')[0];
const sitemapUrls = [
  { loc: 'https://angrove.ru/', priority: '1.0', changefreq: 'weekly' },
  ...Object.keys(SOLUTIONS_RAW).map((slug) => ({
    loc: `https://angrove.ru/solutions/${slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  }))
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

// 4. IndexNow Auto-Ping
try {
  const { execSync } = await import('child_process');
  console.log('→ Triggering IndexNow submission...');
  execSync('node scripts/ping_indexnow.mjs', { stdio: 'inherit' });
} catch (e) {
  console.warn('IndexNow ping notice:', e.message);
}
