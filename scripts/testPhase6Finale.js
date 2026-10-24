import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase6_tests';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function testPhase6() {
  console.log('=== Phase 6: Testing Grand Finale, Final Vow Letter Reveal, Secret Vault & Replay ===');

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

  console.log('1. Starting Audio Player & Beginning Journey...');
  await page.evaluate(() => {
    const playBtn = document.querySelector('aside button[aria-label*="Play"]');
    if (playBtn) playBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  console.log('2. Scrolling to Scene 8: The Grand Climax & Eternal Vow Letter...');
  await page.evaluate(() => {
    const el = document.getElementById('vow-section');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_01_final_letter_unfolded.png') });

  console.log('3. Scrolling down slightly to view letter paragraphs, sign-off and wax seal...');
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_02_letter_paragraphs_and_seal.png') });

  console.log('4. Testing Wax Seal Impression Click...');
  const sealClicked = await page.evaluate(() => {
    const sealBtn = document.querySelector('#vow-section button[aria-label*="Click to impress"], #vow-section button[aria-label*="wax stamp"]');
    if (sealBtn) {
      sealBtn.click();
      return true;
    }
    return false;
  });
  console.log('Seal clicked status:', sealClicked);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_03_vow_sealed_forever.png') });

  console.log('5. Testing "Open Secret Vault" Button Click...');
  await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('#vow-section button'));
    const vaultBtn = allBtns.find((b) => b.textContent && b.textContent.includes('Open Secret Vault'));
    if (vaultBtn) vaultBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_04_vault_passcode_prompt.png') });

  console.log('6. Entering 4-digit Passcode ("1024") and Submitting...');
  await page.type('input[type="password"]', '1024');
  await new Promise((r) => setTimeout(r, 300));
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_05_vault_unlocked_surprise.png') });

  console.log('7. Pressing Escape Key to Close Vault Modal & Verify Scroll Restoration...');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_06_vault_closed.png') });

  console.log('8. Testing "Replay Our Journey" Tasteful Action...');
  await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('#vow-section button'));
    const replayBtn = allBtns.find((b) => b.textContent && b.textContent.includes('Replay Our Journey'));
    if (replayBtn) replayBtn.click();
  });
  // Wait for Lenis smooth scroll to top (duration: 1.8s)
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_07_replayed_to_beginning.png') });

  // 9. Mobile Responsive Viewport (390x844)
  console.log('9. Testing Mobile Viewport (390x844) for Final Vow Letter & Readability...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const el = document.getElementById('vow-section');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected?:', mobileOverflow);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_08_mobile_final_vow_top.png') });

  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase6_09_mobile_final_vow_seal.png') });

  await browser.close();
  console.log('=== Phase 6 Puppeteer Validation Complete! All screenshots captured in brain/phase6_tests. ===');
}

testPhase6().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
