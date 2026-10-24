import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase2_tests';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function testPhase2() {
  console.log('--- Phase 2: Testing Envelope & Scroll-Driven Choreography ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Desktop Tests (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  console.log('1. Capturing desktop initial closed envelope (Scroll: 0px)...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase2_01_closed.png') });

  console.log('2. Scrubbing forward to Scroll: 350px (Flap Opening)...');
  await page.evaluate(() => window.scrollTo(0, 350));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase2_02_flap_opening.png') });

  console.log('3. Scrubbing forward to Scroll: 750px (Letter Extracting)...');
  await page.evaluate(() => window.scrollTo(0, 750));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase2_03_letter_extracting.png') });

  console.log('4. Scrubbing forward to Scroll: 1200px (Letter Accordion Unfolded)...');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase2_04_letter_unfolded.png') });

  console.log('5. Testing Reverse Scroll (Scroll back to 0px)...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase2_05_reversed_to_closed.png') });

  // 2. Mobile Responsive Tests (390x844)
  console.log('6. Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase2_06_mobile_closed.png') });

  // Check horizontal overflow
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal scroll check: ${hasHorizontalScroll ? 'FAILED (Overflow detected)' : 'PASSED (Zero overflow)'}`);

  console.log('7. Mobile Scrubbing forward to 1200px (Unfolded)...');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase2_07_mobile_unfolded.png') });

  console.log('--- Phase 2 Verification Completed Successfully! ---');
  await browser.close();
}

testPhase2().catch((err) => {
  console.error('Phase 2 test failed:', err);
  process.exit(1);
});
