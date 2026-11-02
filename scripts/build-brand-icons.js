/* global __dirname */
// Genera los iconos de la app a partir de assets/brand/logo-content.svg.txt.
// Uso: node scripts/build-brand-icons.js (requiere Playwright con Chromium).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const assets = path.join(__dirname, '..', 'assets');
const content = fs.readFileSync(path.join(assets, 'brand', 'logo-content.svg.txt'), 'utf8');
const INK = '#12140F';

const svg = (bg, scale, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${size}" height="${size}">` +
  (bg ? `<rect width="1024" height="1024" fill="${bg}"/>` : '') +
  `<g transform="translate(512 512) scale(${scale}) translate(-512 -615)">${content}</g></svg>`;

const outputs = [
  ['icon.png', INK, 1.08, 1024],
  ['android-icon-foreground.png', null, 0.72, 1024],
  ['splash-icon.png', null, 1, 1024],
  ['favicon.png', INK, 1.15, 48],
];

(async () => {
  fs.writeFileSync(path.join(assets, 'brand', 'logo.svg'), svg(null, 1, 1024));
  const browser = await chromium.launch();
  for (const [name, bg, scale, size] of outputs) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<html><body style="margin:0">${svg(bg, scale, size)}</body></html>`);
    await page.screenshot({ path: path.join(assets, name), omitBackground: true });
    await page.close();
  }
  await browser.close();
})();
