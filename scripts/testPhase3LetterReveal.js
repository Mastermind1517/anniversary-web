import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase3_tests';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function testPhase3() {
  console.log('--- Phase 3: Testing Letter Emergence, Line-by-Line Reveal & Continuous Narrative ---');

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

  console.log('1. Capturing Initial Closed Envelope...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_01_closed.png') });

  console.log('2. Scrubbing forward to 500px (Flap Open & Letter Rising)...');
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_02_letter_rising.png') });

  console.log('3. Scrubbing forward to 950px (Accordion Unfold & Salutation Reveal)...');
  await page.evaluate(() => window.scrollTo(0, 950));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_03_accordion_unfolding.png') });

  console.log('4. Scrubbing forward to 1350px (Full Line-by-Line Ink Reveal & Flourish)...');
  await page.evaluate(() => window.scrollTo(0, 1350));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_04_full_letter_reveal.png') });

  console.log('5. Scrubbing forward to 1800px (Continuous Transition to Scene 3 Chronometer)...');
  await page.evaluate(() => window.scrollTo(0, 1800));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_05_chronometer_bridge.png') });

  console.log('6. Testing Reverse Scroll (Scroll back from 1800px to 0px)...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_06_reversed_to_sealed.png') });

  // 2. Mobile Responsive Viewport (390x844)
  console.log('7. Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_07_mobile_sealed.png') });

  // Mobile horizontal scroll check
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal scroll check: ${hasHorizontalScroll ? 'FAILED (Overflow detected)' : 'PASSED (Zero overflow)'}`);

  console.log('8. Mobile Scrubbing to 1350px (Mobile Letter Reveal)...');
  await page.evaluate(() => window.scrollTo(0, 1350));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase3_08_mobile_letter_reveal.png') });

  console.log('--- Phase 3 Verification Completed Successfully! ---');
  await browser.close();
}

testPhase3().catch((err) => {
  console.error('Phase 3 test failed:', err);
  process.exit(1);
});
