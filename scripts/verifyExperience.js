import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\screenshots';

async function runVerification() {
  console.log('Starting automated browser verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // 1. Initial Sealed Envelope
  console.log('Capturing 1_sealed_envelope.png...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '1_sealed_envelope.png'),
  });

  // 2. Click Wax Seal directly via exact aria-label or text
  console.log('Clicking Wax Seal...');
  const waxSeal = await page.$('[aria-label="Break wax seal to open anniversary letter"]');
  if (waxSeal) {
    await waxSeal.click();
  } else {
    const breakBtn = await page.$('button ::-p-text(Break the Wax Seal)');
    if (breakBtn) await breakBtn.click();
  }

  // Wait for 3D unfold animation to complete
  await new Promise((r) => setTimeout(r, 2800));

  console.log('Capturing 2_unfolded_letter.png...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '2_unfolded_letter.png'),
  });

  // 3. Scroll to Vow Section and perform 2-second hold to seal
  console.log('Scrolling to Vow button...');
  await page.evaluate(() => {
    document.getElementById('vow-section')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const vowBtn = await page.$('[aria-label="Press and hold for 2 seconds to seal vow"]');
  if (vowBtn) {
    console.log('Pressing and holding vow button for 2.2 seconds...');
    const box = await vowBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await new Promise((r) => setTimeout(r, 2300));
      await page.mouse.up();
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  console.log('Capturing 9b_vow_sealed.png...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '9b_vow_sealed.png'),
  });

  console.log('Verification completed successfully!');
  await browser.close();
}

runVerification().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
