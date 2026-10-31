import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:8931/', { waitUntil: 'networkidle' });
const els = await page.evaluate(() => [...document.querySelectorAll('a,button,input,select,textarea,[role=button]')]
  .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44); })
  .map(e => `${e.tagName}.${(e.className.baseVal ?? e.className).toString().split(' ').slice(0,2).join('.')}#${e.id} "${e.textContent.trim().slice(0,24)}" ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));
console.log(els.join('\n'));
await browser.close();
