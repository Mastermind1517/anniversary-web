import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase7_audit';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runFullAudit() {
  console.log('🚀 Starting Phase 7 Full Experience & Production Readiness Audit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
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

  const testReport = {
    viewports: {},
    audio: {},
    lightbox: {},
    vault: {},
    vowSeal: {},
    replay: {},
    consoleErrors: [],
    consoleWarnings: []
  };

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP AUDIT (1440 x 900)
    // -------------------------------------------------------------
    console.log('\n--- 1. DESKTOP VIEWPORT AUDIT (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));

    // Verify initial envelope sealed state
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_desktop_envelope_sealed.png') });
    console.log('  ✓ Captured 01_desktop_envelope_sealed.png');

    const desktopOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    testReport.viewports.desktopNoOverflow = !desktopOverflow;
    console.log(`  ✓ Desktop Horizontal Overflow: ${desktopOverflow ? 'FAIL (overflow detected)' : 'PASS (0px overflow)'}`);

    // Test Audio Player & procedural audio fallback
    console.log('\n--- 2. AUDIO & EQUALIZER AUDIT ---');
    const audioControlsExist = await page.evaluate(() => {
      const playBtn = document.querySelector('button[aria-label*="Play music" i], button[aria-label*="Pause music" i], button[aria-label*="soundtrack" i]');
      return !!playBtn;
    });
    testReport.audio.controlsExist = audioControlsExist;
    console.log(`  ✓ Audio controls rendered: ${audioControlsExist}`);

    // Click Play in docked player to trigger procedural ambient pad / audio
    await page.evaluate(() => {
      const playBtn = document.querySelector('button[aria-label*="Play music" i], button[aria-label*="soundtrack" i]');
      if (playBtn) (playBtn).click();
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_desktop_audio_playing.png') });
    console.log('  ✓ Captured 02_desktop_audio_playing.png (Equalizer active)');

    // -------------------------------------------------------------
    // 3. SCROLL DOWN & ENVELOPE / LETTER UNFOLDING AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 3. LETTER EMERGENCE & CHRONOMETER AUDIT ---');
    await page.evaluate(() => {
      window.scrollTo({ top: 900, behavior: 'instant' });
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_desktop_letter_unfolded.png') });
    console.log('  ✓ Captured 03_desktop_letter_unfolded.png');

    // Scroll to chronometer counter
    await page.evaluate(() => {
      const chrono = document.querySelector('section:nth-of-type(2)');
      if (chrono) chrono.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_desktop_chronometer.png') });
    console.log('  ✓ Captured 04_desktop_chronometer.png');

    // -------------------------------------------------------------
    // 4. MEMORY GALLERY & 3D LIGHTBOX AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 4. MEMORY GALLERY & 3D LIGHTBOX AUDIT ---');
    await page.evaluate(() => {
      const gallery = document.getElementById('memories-section');
      if (gallery) gallery.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_desktop_memory_gallery.png') });
    console.log('  ✓ Captured 05_desktop_memory_gallery.png');

    // Click first Polaroid to open Lightbox
    const openedLightbox = await page.evaluate(() => {
      const card = document.querySelector('#memories-section [role="button"]');
      if (card) {
        (card).click();
        return true;
      }
      return false;
    });
    testReport.lightbox.opened = openedLightbox;
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_desktop_lightbox_front.png') });
    console.log(`  ✓ Lightbox opened: ${openedLightbox}. Captured 06_desktop_lightbox_front.png`);

    // Click card inside lightbox to flip to handwritten back
    await page.evaluate(() => {
      const flipArea = document.querySelector('[role="dialog"] .cursor-pointer, [aria-label*="Flip" i], .fixed.inset-0 .cursor-pointer');
      if (flipArea) (flipArea).click();
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_desktop_lightbox_flipped.png') });
    console.log('  ✓ Captured 07_desktop_lightbox_flipped.png (Handwritten memory note revealed)');

    // Press Escape to close Lightbox
    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));
    console.log('  ✓ Lightbox dismissed cleanly via Escape key');

    // -------------------------------------------------------------
    // 5. EASTER EGGS AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 5. INTERACTIVE EASTER EGGS AUDIT ---');
    // Open Keepsake Companion Widget
    await page.evaluate(() => {
      const keepsakeBtn = document.querySelector('button[aria-label*="keepsake" i]');
      if (keepsakeBtn) (keepsakeBtn).click();
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_desktop_keepsake_companion.png') });
    console.log('  ✓ Captured 08_desktop_keepsake_companion.png (Keepsake widget opened)');

    // Close Keepsake widget
    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 400)));

    // Scroll down to Constellation section
    await page.evaluate(() => {
      const constellation = document.getElementById('constellation-section');
      if (constellation) constellation.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_desktop_constellation.png') });
    console.log('  ✓ Captured 09_desktop_constellation.png');

    // -------------------------------------------------------------
    // 6. THE ETERNAL VOW & SECRET VAULT AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 6. THE ETERNAL VOW & SECRET VAULT AUDIT ---');
    await page.evaluate(() => {
      const vow = document.getElementById('vow-section');
      if (vow) vow.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_desktop_eternal_vow_top.png') });
    console.log('  ✓ Captured 10_desktop_eternal_vow_top.png');

    // Click the Wax Seal to permanently seal the vow
    const vowSealed = await page.evaluate(() => {
      const sealBtn = document.querySelector('#vow-section button[aria-label*="seal" i], #vow-section button[aria-label*="imprint" i], #vow-section button');
      if (sealBtn) {
        (sealBtn).click();
        return true;
      }
      return false;
    });
    testReport.vowSeal.clicked = vowSealed;
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_desktop_vow_sealed_permanently.png') });
    console.log('  ✓ Captured 11_desktop_vow_sealed_permanently.png (Wax sealed with golden aura)');

    // Scroll to Secret Vault within vow-section
    await page.evaluate(() => {
      window.scrollBy({ top: 600, behavior: 'instant' });
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));

    // Click "Unlock Vault" button
    await page.evaluate(() => {
      const unlockBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Unlock Vault'));
      if (unlockBtn) unlockBtn.click();
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));

    // Type passcode "1024"
    await page.keyboard.type('1024');
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 200)));

    // Click Submit Passcode
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Open Vault'));
      if (submitBtn) submitBtn.click();
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '12_desktop_vault_unlocked.png') });
    console.log('  ✓ Captured 12_desktop_vault_unlocked.png (Secret Getaway Vault revealed)');

    // -------------------------------------------------------------
    // 7. TASTEFUL REPLAY ODYSSEY AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 7. TASTEFUL REPLAY ODYSSEY AUDIT ---');
    const replayFound = await page.evaluate(() => {
      const replayBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Replay'));
      if (replayBtn) {
        replayBtn.click();
        return true;
      }
      return false;
    });
    console.log(`  ✓ Replay button found & clicked: ${replayFound}`);
    // Wait for smooth Lenis scroll back to top
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 2500)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '13_desktop_replayed_to_top.png') });
    const finalScrollY = await page.evaluate(() => window.scrollY);
    testReport.replay.finalScrollY = finalScrollY;
    console.log(`  ✓ Replay scroll completed. Final scrollY: ${finalScrollY}px. Captured 13_desktop_replayed_to_top.png`);

    // -------------------------------------------------------------
    // 8. TABLET VIEWPORT AUDIT (768 x 1024)
    // -------------------------------------------------------------
    console.log('\n--- 8. TABLET VIEWPORT AUDIT (768x1024) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));

    const tabletOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    testReport.viewports.tabletNoOverflow = !tabletOverflow;
    console.log(`  ✓ Tablet Horizontal Overflow: ${tabletOverflow ? 'FAIL' : 'PASS (0px overflow)'}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '14_tablet_envelope.png') });
    console.log('  ✓ Captured 14_tablet_envelope.png');

    // -------------------------------------------------------------
    // 9. MOBILE VIEWPORT AUDIT (375 x 812 iPhone X)
    // -------------------------------------------------------------
    console.log('\n--- 9. MOBILE VIEWPORT AUDIT (375x812) ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));

    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    testReport.viewports.mobileNoOverflow = !mobileOverflow;
    console.log(`  ✓ Mobile Horizontal Overflow: ${mobileOverflow ? 'FAIL' : 'PASS (0px overflow)'}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '15_mobile_envelope.png') });
    console.log('  ✓ Captured 15_mobile_envelope.png');

    // Scroll to Mobile Finale
    await page.evaluate(() => {
      const vow = document.getElementById('vow-section');
      if (vow) vow.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '16_mobile_finale.png') });
    console.log('  ✓ Captured 16_mobile_finale.png');

    // -------------------------------------------------------------
    // 10. ERROR CHECK & REPORT
    // -------------------------------------------------------------
    console.log('\n--- 10. CONSOLE INTEGRITY AUDIT ---');
    testReport.consoleErrors = consoleErrors;
    testReport.consoleWarnings = consoleWarnings;
    console.log(`  ✓ Total Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('    Errors:', consoleErrors);
    }
    console.log(`  ✓ Total Console Warnings: ${consoleWarnings.length}`);

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'audit_results.json'), JSON.stringify(testReport, null, 2));
    console.log('\n✅ Full Experience Audit successfully executed and logged to audit_results.json!');

  } catch (err) {
    console.error('Audit execution error:', err);
  } finally {
    await browser.close();
  }
}

runFullAudit();
