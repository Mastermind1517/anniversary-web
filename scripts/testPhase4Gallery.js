import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase4_tests';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function testPhase4() {
  console.log('=== Phase 4: Testing Cinematic Memory Gallery, Lightbox & Responsive Flow ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Desktop Tests (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('1. Scrolling into Memory Gallery Section Header & Act 1...');
  await page.evaluate(() => {
    const el = document.getElementById('memories-section');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_01_gallery_act1.png') });

  console.log('2. Scrolling into Act 2 (Domestic Rhythms & Archive)...');
  await page.evaluate(() => window.scrollBy({ top: 750, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_02_gallery_act2.png') });

  console.log('3. Scrolling into Act 3 & 4 (Sanctuary & Climax Hero Today & All Our Tomorrows)...');
  await page.evaluate(() => window.scrollBy({ top: 1000, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_03_gallery_act3_act4.png') });

  console.log('4. Testing Card Click -> Opening Lightbox Modal...');
  // Find first polaroid card and click it
  const cardClicked = await page.evaluate(() => {
    const cards = document.querySelectorAll('#memories-section [role="button"]');
    if (cards.length > 0) {
      cards[0].click();
      return true;
    }
    return false;
  });
  console.log('Card clicked status:', cardClicked);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_04_lightbox_front.png') });

  console.log('5. Testing 3D Card Flip to Secret Handwritten Note on the Back...');
  const cardFlipped = await page.evaluate(() => {
    const flipArea = document.querySelector('[role="region"][aria-label*="Polaroid"]');
    if (flipArea) {
      flipArea.click();
      return true;
    }
    return false;
  });
  console.log('Card flipped status:', cardFlipped);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_05_lightbox_back_note.png') });

  console.log('6. Testing Next Navigation Arrow in Lightbox...');
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_06_lightbox_next_photo.png') });

  console.log('7. Testing Escape Key to Close Lightbox & Restore Scroll...');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_07_lightbox_closed.png') });

  console.log('8. Testing Reverse Scroll (Scroll Back Up to Gallery Start)...');
  await page.evaluate(() => {
    const el = document.getElementById('memories-section');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_08_reverse_scroll.png') });

  // Mobile Viewport (390x844)
  console.log('9. Testing Mobile Viewport (390x844) for Responsiveness and Overflow...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const el = document.getElementById('memories-section');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));

  // Check horizontal overflow
  const horizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected?:', horizontalOverflow);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_09_mobile_gallery.png') });

  console.log('10. Testing Mobile Lightbox...');
  await page.evaluate(() => {
    const cards = document.querySelectorAll('#memories-section [role="button"]');
    if (cards.length > 0) {
      cards[0].click();
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase4_10_mobile_lightbox.png') });

  await browser.close();
  console.log('=== Phase 4 Puppeteer Validation Complete! All screenshots captured in brain/phase4_tests. ===');
}

testPhase4().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
