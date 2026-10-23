import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtml)) {
  // Ensure dist/privacy/index.html exists for static hosting direct access
  const privacyDir = path.join(distDir, 'privacy');
  if (!fs.existsSync(privacyDir)) {
    fs.mkdirSync(privacyDir, { recursive: true });
  }
  fs.copyFileSync(indexHtml, path.join(privacyDir, 'index.html'));
  console.log('✓ Created dist/privacy/index.html for static hosting direct routing');

  // Copy to 404.html for GitHub Pages / SPA fallback
  fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));
  console.log('✓ Created dist/404.html for SPA fallback routing');
}
