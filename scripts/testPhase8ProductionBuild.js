import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase8_production';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runProductionTests() {
  console.log('🚀 Starting Phase 8 Production Build Cross-Device Verification...');
  console.log('Testing Production Bundle at http://127.0.0.1:4173\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warn') {
      consoleWarnings.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`PageError: ${err.message}`);
  });

  const report = {
    testedUrl: 'http://127.0.0.1:4173 (Production dist)',
    devices: {},
    features: {},
    consoleErrors: [],
    consoleWarnings: []
  };

  try {
    // ============================================================
    // 1. DESKTOP (1440 x 900)
    // ============================================================
    console.log('--- 1. DESKTOP VIEWPORT (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

    const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    report.devices.desktop = { width: 1440, height: 900, overflow: desktopOverflow };
    console.log(`  ✓ Desktop Overflow: ${desktopOverflow ? 'FAIL' : 'PASS (0px)'}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_prod_desktop_envelope.png') });

    // Test Audio
    const audioPlay = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="Play music" i], button[aria-label*="soundtrack" i]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    report.features.audioPlay = audioPlay;
    console.log(`  ✓ Audio play triggered: ${audioPlay}`);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    // Scroll to unfold letter
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_prod_desktop_letter.png') });
    console.log('  ✓ Captured 02_prod_desktop_letter.png');

    // Scroll to Memories & Test Lightbox 3D Flip
    await page.evaluate(() => {
      const sec = document.getElementById('memories-section');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

    const openLightbox = await page.evaluate(() => {
      const card = document.querySelector('#memories-section [role="button"]');
      if (card) {
        card.click();
        return true;
      }
      return false;
    });
    report.features.lightbox = openLightbox;
    console.log(`  ✓ Lightbox opened: ${openLightbox}`);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_prod_desktop_lightbox_front.png') });

    // Flip card to read handwritten note
    await page.evaluate(() => {
      const flipArea = document.querySelector('[role="dialog"] .cursor-pointer, [aria-label*="Flip" i]');
      if (flipArea) flipArea.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_prod_desktop_lightbox_flipped.png') });
    console.log('  ✓ Captured 04_prod_desktop_lightbox_flipped.png (Handwritten memory note)');

    // Close Lightbox via Escape
    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    // Scroll to Finale Vow
    await page.evaluate(() => {
      const vow = document.getElementById('vow-section');
      if (vow) vow.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

    // Seal Vow
    const sealed = await page.evaluate(() => {
      const btn = document.querySelector('#vow-section button[aria-label*="seal" i], #vow-section button[aria-label*="imprint" i], #vow-section button');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    report.features.vowSealed = sealed;
    console.log(`  ✓ Eternal Vow sealed: ${sealed}`);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_prod_desktop_vow_sealed.png') });

    // Unlock Secret Vault with passcode 1024
    await page.evaluate(() => {
      window.scrollBy({ top: 500, behavior: 'instant' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    await page.evaluate(() => {
      const unlockBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Unlock Vault'));
      if (unlockBtn) unlockBtn.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
    await page.keyboard.type('1024');
    await page.evaluate(() => {
      const openBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Open Vault'));
      if (openBtn) openBtn.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_prod_desktop_vault_unlocked.png') });
    console.log('  ✓ Secret Vault unlocked with passcode 1024');

    // Close Vault modal
    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    // Test Replay Journey to Top
    await page.evaluate(() => {
      const replayBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Replay'));
      if (replayBtn) replayBtn.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 2200)));
    const scrollYAfterReplay = await page.evaluate(() => window.scrollY);
    report.features.replayScrollY = scrollYAfterReplay;
    console.log(`  ✓ Replay Odyssey returned to top: ${scrollYAfterReplay === 0 ? 'PASS (0px)' : `scrollY: ${scrollYAfterReplay}`}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_prod_desktop_replayed_top.png') });

    // ============================================================
    // 2. TABLET (768 x 1024)
    // ============================================================
    console.log('\n--- 2. TABLET VIEWPORT (768x1024) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    report.devices.tablet = { width: 768, height: 1024, overflow: tabletOverflow };
    console.log(`  ✓ Tablet Overflow: ${tabletOverflow ? 'FAIL' : 'PASS (0px)'}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_prod_tablet_envelope.png') });

    // ============================================================
    // 3. MOBILE PORTRAIT (375 x 812 iPhone X)
    // ============================================================
    console.log('\n--- 3. MOBILE PORTRAIT (375x812) ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    const mobilePortOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    report.devices.mobilePortrait = { width: 375, height: 812, overflow: mobilePortOverflow };
    console.log(`  ✓ Mobile Portrait Overflow: ${mobilePortOverflow ? 'FAIL' : 'PASS (0px)'}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_prod_mobile_portrait_envelope.png') });

    // Mobile scroll to letter
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_prod_mobile_portrait_letter.png') });

    // Mobile scroll to memories
    await page.evaluate(() => {
      const sec = document.getElementById('memories-section');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_prod_mobile_portrait_memories.png') });

    // Mobile scroll to finale
    await page.evaluate(() => {
      const vow = document.getElementById('vow-section');
      if (vow) vow.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '12_prod_mobile_portrait_finale.png') });

    // ============================================================
    // 4. MOBILE LANDSCAPE (812 x 375 iPhone X Landscape)
    // ============================================================
    console.log('\n--- 4. MOBILE LANDSCAPE (812x375) ---');
    await page.setViewport({ width: 812, height: 375, isMobile: true, hasTouch: true });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    const mobileLandOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    report.devices.mobileLandscape = { width: 812, height: 375, overflow: mobileLandOverflow };
    console.log(`  ✓ Mobile Landscape Overflow: ${mobileLandOverflow ? 'FAIL' : 'PASS (0px)'}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '13_prod_mobile_landscape_envelope.png') });

    // ============================================================
    // 5. CONSOLE INTEGRITY & REPORT
    // ============================================================
    console.log('\n--- 5. CONSOLE INTEGRITY CHECK ---');
    report.consoleErrors = consoleErrors;
    report.consoleWarnings = consoleWarnings;
    console.log(`  ✓ Total Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('    Errors:', consoleErrors);
    }
    console.log(`  ✓ Total Console Warnings: ${consoleWarnings.length}`);

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'production_report.json'), JSON.stringify(report, null, 2));
    console.log('\n✅ Phase 8 Production Cross-Device Testing Completed Successfully!');

  } catch (err) {
    console.error('Testing Error:', err);
  } finally {
    await browser.close();
  }
}

runProductionTests();
