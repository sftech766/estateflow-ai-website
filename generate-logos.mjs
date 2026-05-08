import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, 'brand_assets/assets/lb_t.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/bhavya/.cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function renderLogo(outputPath, width, height, logoPaddingPct = 0.12) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${width}px;
    height: ${height}px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .logo {
    width: ${Math.round(width * (1 - logoPaddingPct * 2))}px;
    height: ${Math.round(height * (1 - logoPaddingPct * 2))}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
</head>
<body>
<div class="logo">${svgContent}</div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outputPath, clip: { x: 0, y: 0, width, height } });
  await page.close();
  console.log(`Saved: ${outputPath}`);
}

await renderLogo(path.join(__dirname, 'brand_assets/assets/logo.png'), 1200, 630, 0.10);
await renderLogo(path.join(__dirname, 'brand_assets/assets/fb_pp.png'), 600, 600, 0.08);

await browser.close();
