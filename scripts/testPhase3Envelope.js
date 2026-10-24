import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase3_validation';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPhase3Validation() {
  console.log('=== STARTING PHASE 3 LUXURY ENVELOPE VALIDATION ===');
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
    desktopSealed: {},
    waxSealAttributes: {},
    clickInteraction: {},
    scrollChoreography: {},
    mobileSealed: {},
    mobileUnfolded: {},
    consoleErrors: [],
    pageErrors: [],
  };

  try {
    // ---------------------------------------------------------
    // TEST 1: Desktop Sealed Envelope (1440x900)
    // ---------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    console.log('Navigating to http://127.0.0.1:4173 ...');
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture sealed envelope
    const sealedImgPath = path.join(ARTIFACT_DIR, '01_desktop_envelope_sealed.png');
    await page.screenshot({ path: sealedImgPath, fullPage: false });
    console.log('✓ Captured 01_desktop_envelope_sealed.png');

    const sealedEvaluation = await page.evaluate(() => {
      // Check affordance
      const affordanceText = document.querySelector('[aria-label*="Scroll to unfold"]');
      const hasBouncingPill = !!document.querySelector('.animate-bounce');

      // Check envelope dimensions & styling
      const envelopeShell = document.querySelector('.envelope-desk-shadow');
      const envelopeStyle = envelopeShell ? window.getComputedStyle(envelopeShell) : null;

      // Check wax seal
      const waxSeal = document.querySelector('[aria-label*="Break wax seal"]');
      const waxSealSvg = waxSeal ? waxSeal.querySelector('svg') : null;
      const debossedText = waxSealSvg ? waxSealSvg.querySelector('text') : null;

      // Check horizontal overflow
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        hasAffordance: !!affordanceText,
        affordanceContent: affordanceText ? affordanceText.innerText.replace(/\n+/g, ' ') : null,
        hasBouncingPill,
        envelopeFound: !!envelopeShell,
        envelopeBorder: envelopeStyle ? envelopeStyle.borderColor : null,
        envelopeBg: envelopeStyle ? envelopeStyle.backgroundColor : null,
        waxSealFound: !!waxSeal,
        debossedMonogram: debossedText ? debossedText.textContent : null,
        horizontalOverflow,
      };
    });

    report.desktopSealed = sealedEvaluation;
    console.log('Desktop Sealed Evaluation:', sealedEvaluation);

    // ---------------------------------------------------------
    // TEST 2: Flap Opening Sequence Scrub
    // ---------------------------------------------------------
    console.log('Testing Scroll-Driven Opening Choreography...');

    // Scroll to ~25% of stage track height (anticipation + wax release + flap hinge open)
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo({ top: scrollHeight * 0.12, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 600));

    const flapOpeningImgPath = path.join(ARTIFACT_DIR, '02_desktop_flap_opening.png');
    await page.screenshot({ path: flapOpeningImgPath, fullPage: false });
    console.log('✓ Captured 02_desktop_flap_opening.png');

    // Scroll to ~45% of stage track height (letter emerging out of pocket)
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo({ top: scrollHeight * 0.20, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 600));

    const letterEmergingImgPath = path.join(ARTIFACT_DIR, '03_desktop_letter_emerging.png');
    await page.screenshot({ path: letterEmergingImgPath, fullPage: false });
    console.log('✓ Captured 03_desktop_letter_emerging.png');

    // Scroll to ~75% of stage track height (letter fully emerged & unfolded)
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo({ top: scrollHeight * 0.28, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 800));

    const letterUnfoldedImgPath = path.join(ARTIFACT_DIR, '04_desktop_letter_unfolded.png');
    await page.screenshot({ path: letterUnfoldedImgPath, fullPage: false });
    console.log('✓ Captured 04_desktop_letter_unfolded.png');

    const unfoldedEvaluation = await page.evaluate(() => {
      const salutation = document.querySelector('.font-handwriting');
      const letterP = document.querySelectorAll('p.font-editorial');
      const svgFlourish = document.querySelector('svg path[d*="M 10,12"]');
      const unfoldedHint = document.querySelector('[class*="unfoldedHint"]');

      return {
        salutationVisible: salutation ? window.getComputedStyle(salutation).opacity : null,
        salutationText: salutation ? salutation.textContent : null,
        paragraphCount: letterP.length,
        svgFlourishFound: !!svgFlourish,
      };
    });

    report.scrollChoreography = unfoldedEvaluation;
    console.log('Unfolded Evaluation:', unfoldedEvaluation);

    // ---------------------------------------------------------
    // TEST 3: Wax Seal Click Interaction Test
    // ---------------------------------------------------------
    console.log('Testing Wax Seal Click Trigger...');
    // Reset to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 600));

    // Click the wax seal
    const sealElement = await page.$('[aria-label*="Break wax seal"]');
    if (sealElement) {
      await sealElement.click();
      console.log('Wax seal clicked, waiting for smooth scroll...');
      await new Promise((r) => setTimeout(r, 1800));

      const clickUnfoldedImgPath = path.join(ARTIFACT_DIR, '05_desktop_click_unfolded.png');
      await page.screenshot({ path: clickUnfoldedImgPath, fullPage: false });
      console.log('✓ Captured 05_desktop_click_unfolded.png');
      report.clickInteraction = { success: true };
    } else {
      report.clickInteraction = { success: false, reason: 'Wax seal button not found' };
    }

    // ---------------------------------------------------------
    // TEST 4: Mobile Viewport Validation (390x844)
    // ---------------------------------------------------------
    console.log('Testing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture mobile sealed
    const mobileSealedImgPath = path.join(ARTIFACT_DIR, '06_mobile_envelope_sealed.png');
    await page.screenshot({ path: mobileSealedImgPath, fullPage: false });
    console.log('✓ Captured 06_mobile_envelope_sealed.png');

    const mobileSealedEval = await page.evaluate(() => {
      const envelope = document.querySelector('.envelope-desk-shadow');
      const rect = envelope ? envelope.getBoundingClientRect() : null;
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        envelopeWidth: rect ? rect.width : 0,
        envelopeHeight: rect ? rect.height : 0,
        fitsInViewport: rect ? rect.width <= window.innerWidth : false,
        horizontalOverflow,
      };
    });
    report.mobileSealed = mobileSealedEval;
    console.log('Mobile Sealed Eval:', mobileSealedEval);

    // Scroll to unfold on mobile
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo({ top: scrollHeight * 0.28, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 800));

    const mobileUnfoldedImgPath = path.join(ARTIFACT_DIR, '07_mobile_letter_unfolded.png');
    await page.screenshot({ path: mobileUnfoldedImgPath, fullPage: false });
    console.log('✓ Captured 07_mobile_letter_unfolded.png');

    const mobileUnfoldedEval = await page.evaluate(() => {
      const letter = document.querySelector('.paper-shadow.bg-\\[\\#F9F8F5\\]');
      const rect = letter ? letter.getBoundingClientRect() : null;
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        letterFound: !!letter,
        letterWidth: rect ? rect.width : 0,
        letterHeight: rect ? rect.height : 0,
        horizontalOverflow,
      };
    });
    report.mobileUnfolded = mobileUnfoldedEval;
    console.log('Mobile Unfolded Eval:', mobileUnfoldedEval);

  } catch (err) {
    console.error('Test execution error:', err);
    report.executionError = err.message;
  } finally {
    report.consoleErrors = consoleErrors;
    report.pageErrors = pageErrors;
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'phase3_report.json'),
      JSON.stringify(report, null, 2)
    );
    await browser.close();
    console.log('=== PHASE 3 VALIDATION COMPLETE ===');
  }
}

runPhase3Validation();
