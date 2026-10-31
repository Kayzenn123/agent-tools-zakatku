import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('http://localhost:8931/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);
await page.locator('.hero').screenshot({ path: 'public/og-image.png' });
await browser.close();
console.log('og OK');
