import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase5_tests';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function testPhase5() {
  console.log('=== Phase 5: Testing Immersive Audio, Floating Keepsake Widget, Easter Eggs & Popups ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Desktop Initial View (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('1. Capturing Initial Screen with Docked Audio Player & Floating Keepsake Widget...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_01_initial_docked_widgets.png') });

  console.log('2. Testing Play Button in CinematicAudioPlayer...');
  const playClicked = await page.evaluate(() => {
    const playBtn = document.querySelector('aside button[aria-label*="Play"]');
    if (playBtn) {
      playBtn.click();
      return true;
    }
    return false;
  });
  console.log('Play button clicked status:', playClicked);
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_02_audio_playing_pill.png') });

  console.log('3. Expanding CinematicAudioPlayer Drawer...');
  const expandClicked = await page.evaluate(() => {
    const expandBtn = document.querySelector('aside button[aria-label*="Expand"]');
    if (expandBtn) {
      expandBtn.click();
      return true;
    }
    return false;
  });
  console.log('Expand drawer button clicked status:', expandClicked);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_03_audio_expanded_drawer.png') });

  console.log('4. Testing Next Track in Audio Player Drawer...');
  await page.evaluate(() => {
    const nextBtn = document.querySelector('aside button[aria-label*="Next soundtrack"]');
    if (nextBtn) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_04_audio_next_track.png') });

  // Collapse player drawer
  await page.evaluate(() => {
    const collapseBtn = document.querySelector('aside button[aria-label*="Collapse"]');
    if (collapseBtn) collapseBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  console.log('5. Testing Floating Keepsake Companion Talisman Click...');
  const keepsakeClicked = await page.evaluate(() => {
    const talisman = document.querySelector('button[aria-label*="keepsake companion"]');
    if (talisman) {
      talisman.click();
      return true;
    }
    return false;
  });
  console.log('Keepsake talisman clicked status:', keepsakeClicked);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_05_keepsake_companion_panel.png') });

  console.log('6. Opening Archival Secret Note from Keepsake Companion...');
  await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button'));
    const btn = allBtns.find((b) => b.textContent && b.textContent.includes('Read complete archival note'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_06_archival_secret_modal.png') });

  console.log('7. Testing Escape Key to Close ElegantModal & Restore Scroll...');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_07_modal_closed.png') });

  console.log('8. Testing Monogram Header Easter Egg (Clicking "J & E")...');
  await page.evaluate(() => {
    const monogramBtn = document.querySelector('header button[aria-label*="Anniversary Monogram"]');
    if (monogramBtn) monogramBtn.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_08_monogram_seal_modal.png') });
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 600));

  console.log('9. Scrolling to Constellation & Clicking Secret Polaris Star Easter Egg...');
  await page.evaluate(() => {
    const constEl = document.getElementById('constellation-section');
    if (constEl) constEl.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));

  await page.evaluate(() => {
    const allGroups = Array.from(document.querySelectorAll('svg g'));
    const polaris = allGroups.find((g) => g.textContent && g.textContent.includes('Polaris'));
    if (polaris) polaris.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_09_polaris_star_modal.png') });
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 600));

  // 10. Mobile Responsive Viewport (390x844)
  console.log('10. Testing Mobile Viewport (390x844) for Audio Player & Keepsake Layout...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 800));

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected?:', mobileOverflow);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_10_mobile_widgets_closed.png') });

  // Open player drawer on mobile
  await page.evaluate(() => {
    const expandBtn = document.querySelector('aside button[aria-label*="Toggle player drawer"], aside button[aria-label*="Expand player"]');
    if (expandBtn) expandBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'phase5_11_mobile_audio_drawer.png') });

  await browser.close();
  console.log('=== Phase 5 Puppeteer Validation Complete! All screenshots captured in brain/phase5_tests. ===');
}

testPhase5().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
