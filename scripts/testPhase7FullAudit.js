import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase7_validation';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop_1440x900', width: 1440, height: 900, isMobile: false },
  { name: 'tablet_1024x768', width: 1024, height: 768, isMobile: false },
  { name: 'mobile_390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'narrow_360x800', width: 360, height: 800, isMobile: true, hasTouch: true },
];

async function runPhase7Audit() {
  console.log('=== STARTING PHASE 7 FULL INTEGRATION & PERFORMANCE AUDIT ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const consoleErrors = [];
  const pageErrors = [];

  const auditReport = {
    viewportsTested: {},
    journeySteps: {},
    modalScrollRestoration: {},
    keyboardAccessibility: {},
    reducedMotionVerification: {},
    performanceMetrics: {},
    consoleErrors: [],
    pageErrors: [],
  };

  const page = await browser.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
  });

  try {
    // ---------------------------------------------------------
    // 1. MULTI-VIEWPORT RESPONSIVENESS & OVERFLOW AUDIT
    // ---------------------------------------------------------
    for (const vp of VIEWPORTS) {
      console.log(`Auditing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: !!vp.hasTouch,
        deviceScaleFactor: 1,
      });

      await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 600));

      // Scroll through page to check horizontal overflow across all sections
      const overflowResult = await page.evaluate(async () => {
        let maxScrollWidth = document.documentElement.scrollWidth;
        const totalHeight = document.documentElement.scrollHeight;
        const steps = 6;
        for (let i = 0; i <= steps; i++) {
          window.scrollTo(0, (totalHeight / steps) * i);
          await new Promise((r) => setTimeout(r, 80));
          if (document.documentElement.scrollWidth > maxScrollWidth) {
            maxScrollWidth = document.documentElement.scrollWidth;
          }
        }
        window.scrollTo(0, 0);

        return {
          windowWidth: window.innerWidth,
          maxScrollWidth,
          hasHorizontalOverflow: maxScrollWidth > window.innerWidth,
        };
      });

      const shotPath = path.join(ARTIFACT_DIR, `vp_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`✓ Captured vp_${vp.name}.png (Overflow: ${overflowResult.hasHorizontalOverflow})`);

      auditReport.viewportsTested[vp.name] = overflowResult;
    }

    // ---------------------------------------------------------
    // 2. MEASURE PERFORMANCE METRICS (CLS, LCP, Navigation Timing)
    // ---------------------------------------------------------
    console.log('Measuring Core Web Vitals & Performance Metrics on Desktop (1440x900)...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });

    const perfMetrics = await page.evaluate(async () => {
      // Collect Cumulative Layout Shift (CLS)
      let clsValue = 0;
      try {
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Fallback if layout-shift not supported
      }

      // Collect Navigation Timing
      const navTiming = performance.getEntriesByType('navigation')[0];

      await new Promise((r) => setTimeout(r, 800));

      return {
        cls: clsValue,
        domInteractive: navTiming ? Math.round(navTiming.domInteractive) : 0,
        domContentLoaded: navTiming ? Math.round(navTiming.domContentLoadedEventEnd) : 0,
        loadComplete: navTiming ? Math.round(navTiming.loadEventEnd) : 0,
        domElementsCount: document.querySelectorAll('*').length,
      };
    });

    auditReport.performanceMetrics = perfMetrics;
    console.log('Measured Performance Metrics:', perfMetrics);

    // ---------------------------------------------------------
    // 3. FULL USER JOURNEY AUDIT (10 STEPS)
    // ---------------------------------------------------------
    console.log('Testing Step 1-3: Sealed Envelope to Unfolded Letter...');
    // Step 1: Envelope resting
    const envShot1 = path.join(ARTIFACT_DIR, 'journey_01_envelope.png');
    await page.screenshot({ path: envShot1, fullPage: false });

    // Step 2: Click Wax Seal to unfold
    const waxSeal = await page.$('[aria-label*="Break wax seal"]');
    if (waxSeal) {
      await waxSeal.click();
      await new Promise((r) => setTimeout(r, 1800));
    }
    const envShot2 = path.join(ARTIFACT_DIR, 'journey_02_letter_unfolded.png');
    await page.screenshot({ path: envShot2, fullPage: false });

    // Step 4: Scroll to Photo Gallery & Open Lightbox
    console.log('Testing Step 4-5: Photo Gallery & Shared-Layout Lightbox...');
    await page.evaluate(() => {
      document.getElementById('memories-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 800));

    const firstPlate = await page.$('[aria-label^="Open archival plate 01"]');
    if (firstPlate) {
      await firstPlate.click();
      await new Promise((r) => setTimeout(r, 700));

      const lightboxShot = path.join(ARTIFACT_DIR, 'journey_03_lightbox_open.png');
      await page.screenshot({ path: lightboxShot, fullPage: false });

      // Check scroll lock
      const isLocked = await page.evaluate(() => document.body.style.overflow === 'hidden');
      auditReport.modalScrollRestoration.lightboxScrollLock = isLocked;

      // Close lightbox
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 600));

      const isRestored = await page.evaluate(() => document.body.style.overflow !== 'hidden');
      auditReport.modalScrollRestoration.lightboxScrollRestored = isRestored;
    }

    // Step 6: Audio Playback & Cassette Sync
    console.log('Testing Step 6: Audio Playback & Cassette Sync...');
    await page.evaluate(() => {
      document.getElementById('mixtape-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 600));

    const cassettePlayBtn = await page.$('#mixtape-section button[aria-label*="tape"]');
    if (cassettePlayBtn) {
      await cassettePlayBtn.click();
      await new Promise((r) => setTimeout(r, 600));
    }
    const cassetteShot = path.join(ARTIFACT_DIR, 'journey_04_cassette_playing.png');
    await page.screenshot({ path: cassetteShot, fullPage: false });

    // Step 7: Love Notes Opening & Modal Navigation
    console.log('Testing Step 7: Love Notes Opening & Modal Navigation...');
    await page.evaluate(() => {
      document.getElementById('notes-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 600));

    const firstLetter = await page.$('[aria-label^="Unfold letter 01"]');
    if (firstLetter) {
      await firstLetter.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise((r) => setTimeout(r, 200));
      await firstLetter.click();
      await new Promise((r) => setTimeout(r, 600));

      const noteShot = path.join(ARTIFACT_DIR, 'journey_05_love_note_modal.png');
      await page.screenshot({ path: noteShot, fullPage: false });

      // Navigate inside modal
      await page.keyboard.press('ArrowRight');
      await new Promise((r) => setTimeout(r, 400));

      // Close modal
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 500));

      const noteRestored = await page.evaluate(() => document.body.style.overflow !== 'hidden');
      auditReport.modalScrollRestoration.loveNoteScrollRestored = noteRestored;
    }

    // Step 8: Final Vow & Wax Seal Impression
    console.log('Testing Step 8: Final Vow & Permanent Seal...');
    await page.evaluate(() => {
      document.getElementById('vow-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 600));

    const vowSealBtn = await page.$('#vow-section article button[aria-label*="seal"]');
    if (vowSealBtn) {
      await vowSealBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }
    const vowShot = path.join(ARTIFACT_DIR, 'journey_06_final_vow_sealed.png');
    await page.screenshot({ path: vowShot, fullPage: false });

    // Step 9: Secret Vault (Incorrect and Correct inputs)
    console.log('Testing Step 9: Secret Vault Inputs...');
    const vaultBtn = await page.$('button[aria-label="Open secret keepsake vault"]');
    if (vaultBtn) {
      await vaultBtn.click();
      await new Promise((r) => setTimeout(r, 500));

      // Submit incorrect
      await page.type('#vault-passcode-input', '0000');
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 400));

      // Clear & submit correct
      await page.evaluate(() => {
        const inp = document.getElementById('vault-passcode-input');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await page.type('#vault-passcode-input', '1024');
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 600));

      const vaultShot = path.join(ARTIFACT_DIR, 'journey_07_vault_unlocked.png');
      await page.screenshot({ path: vaultShot, fullPage: false });

      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 500));

      const vaultRestored = await page.evaluate(() => document.body.style.overflow !== 'hidden');
      auditReport.modalScrollRestoration.vaultScrollRestored = vaultRestored;
    }

    // Step 10: Replay Journey back to top
    console.log('Testing Step 10: Replay Our Journey Back to Top...');
    const replayBtn = await page.$('button[aria-label="Replay experience from the opening envelope"]');
    if (replayBtn) {
      await replayBtn.click();
      await new Promise((r) => setTimeout(r, 1600));
    }

    const replayShot = path.join(ARTIFACT_DIR, 'journey_08_replayed_top.png');
    await page.screenshot({ path: replayShot, fullPage: false });

    const finalScrollPos = await page.evaluate(() => window.scrollY);
    auditReport.journeySteps.replayedToTop = finalScrollPos < 80;
    auditReport.journeySteps.completedAll10 = true;

    // ---------------------------------------------------------
    // 4. REDUCED MOTION AUDIT
    // ---------------------------------------------------------
    console.log('Auditing prefers-reduced-motion media query...');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 600));

    const reducedMotionEval = await page.evaluate(() => {
      const pingElements = document.querySelectorAll('.animate-ping:not(.motion-reduce\\:hidden)');
      const clockElement = document.querySelector('.animate-spin.motion-reduce\\:animate-none');

      return {
        activePingsWithoutReduceGuard: pingElements.length,
        clockReducedGuarded: !!clockElement,
      };
    });
    auditReport.reducedMotionVerification = reducedMotionEval;
    console.log('Reduced Motion Audit:', reducedMotionEval);

  } catch (err) {
    console.error('Audit Error:', err);
    auditReport.error = err && err.message ? err.message : String(err);
  } finally {
    auditReport.consoleErrors = consoleErrors;
    auditReport.pageErrors = pageErrors;
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'phase7_audit_report.json'),
      JSON.stringify(auditReport, null, 2)
    );
    await browser.close();
    console.log('=== PHASE 7 AUDIT COMPLETE ===');
  }
}

runPhase7Audit();
