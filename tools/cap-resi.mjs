import { chromium } from 'playwright';
const browser = await chromium.launch();
// mobile: resi state
let page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:8931/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screenshots/mobile-390.png' });
await page.click('[data-contoh="mal"]');
await page.click('form[data-form="mal"] button[type="submit"]');
await page.waitForSelector('#resi-mal .resi');
await page.waitForTimeout(1800);
await page.locator('#resi-mal').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/resi-390.png' });
await page.click('#resi-mal button:has-text("Sobek resi")');
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/resi-sobek-390.png' });
await page.close();
// desktop full
page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://localhost:8931/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/desktop-1280.png' });
await page.close();
await browser.close();
console.log('capture OK');
