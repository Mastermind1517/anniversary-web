import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase6_validation';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPhase6Validation() {
  console.log('=== STARTING PHASE 6 FINAL VOW & SECRET VAULT VALIDATION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const consoleErrors = [];
  const pageErrors = [];

  const page = await browser.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
  });

  const report = {
    desktopVow: {},
    waxSealImpression: {},
    vaultLocked: {},
    vaultIncorrectInput: {},
    vaultUnlocked: {},
    replayJourney: {},
    mobileVow: {},
    mobileVault: {},
    regressionChecks: {},
    consoleErrors: [],
    pageErrors: [],
  };

  try {
    // ---------------------------------------------------------
    // TEST 1: Desktop Viewport (1440x900) - Final Vow Stage
    // ---------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    console.log('Navigating to http://127.0.0.1:4173 ...');
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Scroll to #vow-section
    console.log('Scrolling to #vow-section...');
    await page.evaluate(() => {
      const el = document.getElementById('vow-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture Desktop Final Vow Letter
    const vowLetterPath = path.join(ARTIFACT_DIR, '01_desktop_final_vow_letter.png');
    await page.screenshot({ path: vowLetterPath, fullPage: false });
    console.log('✓ Captured 01_desktop_final_vow_letter.png');

    const vowEval = await page.evaluate(() => {
      const sec = document.getElementById('vow-section');
      const letter = sec ? sec.querySelector('article') : null;
      const greeting = letter ? letter.querySelector('.font-handwriting') : null;
      const paragraphs = letter ? letter.querySelectorAll('p') : [];
      const sealBtn = letter ? letter.querySelector('button[aria-label*="seal"]') : null;

      return {
        sectionFound: !!sec,
        letterFound: !!letter,
        greetingText: greeting ? greeting.textContent?.trim() : null,
        paragraphCount: paragraphs.length,
        hasSealBtn: !!sealBtn,
      };
    });
    report.desktopVow = vowEval;
    console.log('Desktop Vow Eval:', vowEval);

    // ---------------------------------------------------------
    // TEST 2: Interactive Wax Seal Impression
    // ---------------------------------------------------------
    console.log('Clicking to impress the permanent wax seal...');
    const sealBtn = await page.$('#vow-section article button[aria-label*="seal"]');
    if (sealBtn) {
      await sealBtn.click();
      await new Promise((r) => setTimeout(r, 600));
    }

    const vowSealedPath = path.join(ARTIFACT_DIR, '02_desktop_vow_sealed.png');
    await page.screenshot({ path: vowSealedPath, fullPage: false });
    console.log('✓ Captured 02_desktop_vow_sealed.png');

    const sealEval = await page.evaluate(() => {
      const sec = document.getElementById('vow-section');
      const sealBtn = sec ? sec.querySelector('button[aria-label*="sealed forever"]') : null;
      const checkIcon = sec ? sec.querySelector('button svg.lucide-check') : null;

      return {
        isSealedState: !!sealBtn,
        hasCheckBadge: !!checkIcon,
      };
    });
    report.waxSealImpression = sealEval;
    console.log('Wax Seal Impression Eval:', sealEval);

    // ---------------------------------------------------------
    // TEST 3: Secret Vault Modal & Incorrect Passcode Feedback
    // ---------------------------------------------------------
    console.log('Opening Secret Vault Modal...');
    const openVaultBtn = await page.$('button[aria-label="Open secret keepsake vault"]');
    if (openVaultBtn) {
      await openVaultBtn.click();
      await new Promise((r) => setTimeout(r, 600));
    }

    const vaultLockedPath = path.join(ARTIFACT_DIR, '03_desktop_vault_locked.png');
    await page.screenshot({ path: vaultLockedPath, fullPage: false });
    console.log('✓ Captured 03_desktop_vault_locked.png');

    const vaultLockedEval = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const input = dialog ? dialog.querySelector('input[type="password"]') : null;
      const submitBtn = dialog ? dialog.querySelector('button[type="submit"]') : null;

      return {
        dialogOpen: !!dialog,
        hasInput: !!input,
        hasSubmitBtn: !!submitBtn,
      };
    });
    report.vaultLocked = vaultLockedEval;
    console.log('Vault Locked Eval:', vaultLockedEval);

    // Enter incorrect passcode
    console.log('Submitting incorrect passcode "9999"...');
    await page.type('#vault-passcode-input', '9999');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 400));

    const vaultIncorrectPath = path.join(ARTIFACT_DIR, '04_desktop_vault_incorrect_passcode.png');
    await page.screenshot({ path: vaultIncorrectPath, fullPage: false });
    console.log('✓ Captured 04_desktop_vault_incorrect_passcode.png');

    const incorrectEval = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const errorMsg = dialog ? dialog.querySelector('[aria-live="polite"] span') : null;
      const isShaking = dialog ? dialog.querySelector('.animate-shake') : null;

      return {
        errorAnnounced: !!errorMsg,
        errorMessage: errorMsg ? errorMsg.textContent?.trim() : null,
        shakeActive: !!isShaking,
      };
    });
    report.vaultIncorrectInput = incorrectEval;
    console.log('Incorrect Input Eval:', incorrectEval);

    // ---------------------------------------------------------
    // TEST 4: Correct Passcode & Secret Keepsake Reveal
    // ---------------------------------------------------------
    console.log('Entering correct passcode "1024"...');
    // Clear input
    await page.evaluate(() => {
      const inp = document.getElementById('vault-passcode-input');
      if (inp) {
        inp.value = '';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 200));

    await page.type('#vault-passcode-input', '1024');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 700));

    const vaultUnlockedPath = path.join(ARTIFACT_DIR, '05_desktop_vault_unlocked.png');
    await page.screenshot({ path: vaultUnlockedPath, fullPage: false });
    console.log('✓ Captured 05_desktop_vault_unlocked.png');

    const unlockedEval = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const destination = dialog ? dialog.querySelector('.lucide-map-pin')?.parentElement?.textContent?.trim() : null;
      const date = dialog ? dialog.querySelector('.lucide-calendar')?.parentElement?.textContent?.trim() : null;
      const message = dialog ? dialog.querySelector('p.font-editorial') : null;

      return {
        isUnlocked: !!destination,
        destination,
        date,
        messageSnippet: message ? message.textContent?.slice(0, 50) : null,
      };
    });
    report.vaultUnlocked = unlockedEval;
    console.log('Vault Unlocked Eval:', unlockedEval);

    // Close vault modal via Escape
    console.log('Closing vault modal via Escape...');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));

    // ---------------------------------------------------------
    // TEST 5: Replay Journey
    // ---------------------------------------------------------
    console.log('Clicking "Replay Our Journey" button...');
    const replayBtn = await page.$('button[aria-label="Replay experience from the opening envelope"]');
    if (replayBtn) {
      await replayBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
    }

    const replayedPath = path.join(ARTIFACT_DIR, '06_desktop_replayed_to_top.png');
    await page.screenshot({ path: replayedPath, fullPage: false });
    console.log('✓ Captured 06_desktop_replayed_to_top.png');

    const scrollYAfterReplay = await page.evaluate(() => window.scrollY);
    report.replayJourney = {
      replayedToTop: scrollYAfterReplay < 100,
      finalScrollY: scrollYAfterReplay,
    };
    console.log('Replay Journey Eval:', report.replayJourney);

    // ---------------------------------------------------------
    // TEST 6: Mobile Viewport Validation (390x844)
    // ---------------------------------------------------------
    console.log('Testing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Scroll to #vow-section on mobile
    await page.evaluate(() => {
      const el = document.getElementById('vow-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 800));

    const mobileVowPath = path.join(ARTIFACT_DIR, '07_mobile_final_vow.png');
    await page.screenshot({ path: mobileVowPath, fullPage: false });
    console.log('✓ Captured 07_mobile_final_vow.png');

    const mobileVowEval = await page.evaluate(() => {
      const letter = document.querySelector('#vow-section article');
      const rect = letter ? letter.getBoundingClientRect() : null;
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        letterWidth: rect ? rect.width : 0,
        fitsInViewport: rect ? rect.width <= window.innerWidth : false,
        horizontalOverflow,
      };
    });
    report.mobileVow = mobileVowEval;
    console.log('Mobile Vow Eval:', mobileVowEval);

    // Open vault on mobile
    const mobileOpenVaultBtn = await page.$('button[aria-label="Open secret keepsake vault"]');
    if (mobileOpenVaultBtn) {
      await mobileOpenVaultBtn.click();
      await new Promise((r) => setTimeout(r, 600));

      const mobileVaultLockedPath = path.join(ARTIFACT_DIR, '08_mobile_vault_locked.png');
      await page.screenshot({ path: mobileVaultLockedPath, fullPage: false });
      console.log('✓ Captured 08_mobile_vault_locked.png');

      // Enter 1024 on mobile
      await page.type('#vault-passcode-input', '1024');
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 700));

      const mobileVaultUnlockedPath = path.join(ARTIFACT_DIR, '09_mobile_vault_unlocked.png');
      await page.screenshot({ path: mobileVaultUnlockedPath, fullPage: false });
      console.log('✓ Captured 09_mobile_vault_unlocked.png');

      const mobileVaultEval = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const modalBox = dialog ? dialog.querySelector('div.bg-\\[\\#F9F8F5\\]') : null;
        const rect = modalBox ? modalBox.getBoundingClientRect() : null;
        const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

        return {
          dialogOpen: !!dialog,
          modalWidth: rect ? rect.width : 0,
          fitsViewport: rect ? rect.width <= window.innerWidth && rect.height <= window.innerHeight : false,
          horizontalOverflow,
        };
      });
      report.mobileVault = mobileVaultEval;
      console.log('Mobile Vault Eval:', mobileVaultEval);

      // Close modal
      const closeBtn = await page.$('[role="dialog"] button[aria-label*="Close"]');
      if (closeBtn) await closeBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    // ---------------------------------------------------------
    // TEST 7: Regression Checks across Full Application
    // ---------------------------------------------------------
    console.log('Running comprehensive regression checks across entire application...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 600));

    const regressionEval = await page.evaluate(() => {
      const envelope = document.querySelector('.envelope-desk-shadow');
      const waxSeal = document.querySelector('[aria-label*="Break wax seal"]');
      const galleryPlates = document.querySelectorAll('[aria-label^="Open archival plate"]');
      const cassette = document.getElementById('mixtape-section');
      const loveNotes = document.getElementById('notes-section');
      const audioPlayer = document.querySelector('aside[aria-label="Cinematic Sound Player"]');

      return {
        envelopePresent: !!envelope,
        waxSealPresent: !!waxSeal,
        galleryPlatesCount: galleryPlates.length,
        cassettePresent: !!cassette,
        loveNotesPresent: !!loveNotes,
        audioPlayerPresent: !!audioPlayer,
      };
    });
    report.regressionChecks = regressionEval;
    console.log('Regression Checks Eval:', regressionEval);

  } catch (err) {
    console.error('Validation Error:', err);
    report.error = err.message;
  } finally {
    report.consoleErrors = consoleErrors;
    report.pageErrors = pageErrors;
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'phase6_report.json'),
      JSON.stringify(report, null, 2)
    );
    await browser.close();
    console.log('=== PHASE 6 VALIDATION COMPLETE ===');
  }
}

runPhase6Validation();
