import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase4_validation';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPhase4Validation() {
  console.log('=== STARTING PHASE 4 CINEMATIC GALLERY VALIDATION ===');
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
    desktopGallery: {},
    lightboxOpening: {},
    cardFlip: {},
    navigation: {},
    closingAndScrollRestore: {},
    mobileGallery: {},
    mobileLightbox: {},
    regressionEnvelope: {},
    consoleErrors: [],
    pageErrors: [],
  };

  try {
    // ---------------------------------------------------------
    // TEST 1: Desktop Gallery Exhibition (1440x900)
    // ---------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    console.log('Navigating to http://127.0.0.1:4173 ...');
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Scroll to #memories-section
    console.log('Scrolling to #memories-section...');
    await page.evaluate(() => {
      const el = document.getElementById('memories-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Capture Desktop Gallery
    const galleryImgPath = path.join(ARTIFACT_DIR, '01_desktop_gallery_exhibition.png');
    await page.screenshot({ path: galleryImgPath, fullPage: false });
    console.log('✓ Captured 01_desktop_gallery_exhibition.png');

    const galleryEval = await page.evaluate(() => {
      const section = document.getElementById('memories-section');
      const title = section ? section.querySelector('h2') : null;
      const subtitle = section ? section.querySelector('p.font-editorial') : null;
      const cards = section ? section.querySelectorAll('[aria-label^="Open archival plate"]') : [];

      // Check for removed cartoon polaroid elements
      const hasWashiTape = !!section?.querySelector('[class*="bg-white/70"]');
      const hasSpinningCompass = !!section?.querySelector('.animate-\\[spin_120s_linear_infinite\\]');

      // Check horizontal overflow
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        sectionFound: !!section,
        titleText: title ? title.textContent?.trim() : null,
        subtitleText: subtitle ? subtitle.textContent?.trim() : null,
        plateCount: cards.length,
        hasWashiTape,
        hasSpinningCompass,
        horizontalOverflow,
      };
    });

    report.desktopGallery = galleryEval;
    console.log('Desktop Gallery Evaluation:', galleryEval);

    // ---------------------------------------------------------
    // TEST 2: Shared-Layout Lightbox Opening (Plate 01)
    // ---------------------------------------------------------
    console.log('Clicking Plate 01 to trigger shared-layout lightbox...');
    const firstPlate = await page.$('[aria-label^="Open archival plate 01"]');
    if (firstPlate) {
      await firstPlate.click();
      // Allow FLIP entrance animation to play (500ms)
      await new Promise((r) => setTimeout(r, 700));

      const lightboxFrontPath = path.join(ARTIFACT_DIR, '02_desktop_lightbox_front.png');
      await page.screenshot({ path: lightboxFrontPath, fullPage: false });
      console.log('✓ Captured 02_desktop_lightbox_front.png');

      const openEval = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const bodyOverflow = document.body.style.overflow;
        const plateIndicator = dialog ? dialog.querySelector('header span') : null;
        const closeBtn = dialog ? dialog.querySelector('[aria-label*="Close"]') : null;
        const prevBtn = dialog ? dialog.querySelector('[aria-label*="Previous"]') : null;
        const nextBtn = dialog ? dialog.querySelector('[aria-label*="Next"]') : null;

        return {
          dialogOpen: !!dialog,
          bodyOverflow,
          scrollLocked: bodyOverflow === 'hidden',
          plateIndicator: plateIndicator ? plateIndicator.textContent?.trim() : null,
          hasCloseBtn: !!closeBtn,
          hasNextBtn: !!nextBtn,
          hasPrevBtn: !!prevBtn,
        };
      });

      report.lightboxOpening = openEval;
      console.log('Lightbox Opening Evaluation:', openEval);

      // -------------------------------------------------------
      // TEST 3: Card Flip to Read Secret Handwritten Note
      // -------------------------------------------------------
      console.log('Clicking card stage to reveal handwritten note...');
      const cardStage = await page.$('[role="region"][aria-label*="Archival exhibition plate"]');
      if (cardStage) {
        await cardStage.click();
      }
      await new Promise((r) => setTimeout(r, 800));

      const lightboxReversePath = path.join(ARTIFACT_DIR, '03_desktop_lightbox_reverse_note.png');
      await page.screenshot({ path: lightboxReversePath, fullPage: false });
      console.log('✓ Captured 03_desktop_lightbox_reverse_note.png');

      const flipEval = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const noteText = dialog ? dialog.querySelector('.font-handwriting') : null;
        const returnBtn = dialog ? Array.from(dialog.querySelectorAll('button')).find((b) => b.textContent?.includes('Return to Photograph')) : null;

        return {
          noteFound: !!noteText,
          noteSnippet: noteText ? noteText.textContent?.slice(0, 50) : null,
          hasReturnBtn: !!returnBtn,
        };
      });
      report.cardFlip = flipEval;
      console.log('Card Flip Evaluation:', flipEval);

      // -------------------------------------------------------
      // TEST 4: Navigation (Next Plate)
      // -------------------------------------------------------
      console.log('Clicking Next button to navigate to Plate 02...');
      const nextBtn = await page.$('[aria-label*="Next photograph"]');
      if (nextBtn) {
        await nextBtn.click();
        await new Promise((r) => setTimeout(r, 600));

        const lightboxNavPath = path.join(ARTIFACT_DIR, '04_desktop_lightbox_navigated.png');
        await page.screenshot({ path: lightboxNavPath, fullPage: false });
        console.log('✓ Captured 04_desktop_lightbox_navigated.png');

        const navEval = await page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"]');
          const plateLabel = dialog ? dialog.querySelector('header span') : null;
          const photoTitle = dialog ? dialog.querySelector('h3.font-serif') : null;

          return {
            plateLabel: plateLabel ? plateLabel.textContent?.trim() : null,
            photoTitle: photoTitle ? photoTitle.textContent?.trim() : null,
          };
        });
        report.navigation = navEval;
        console.log('Navigation Evaluation:', navEval);
      }

      // -------------------------------------------------------
      // TEST 5: Closing Lightbox & Scroll Restoration
      // -------------------------------------------------------
      console.log('Pressing Escape to test reverse closing transition...');
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 600));

      const afterClosePath = path.join(ARTIFACT_DIR, '05_desktop_gallery_after_close.png');
      await page.screenshot({ path: afterClosePath, fullPage: false });
      console.log('✓ Captured 05_desktop_gallery_after_close.png');

      const closeEval = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const bodyOverflow = document.body.style.overflow;

        return {
          dialogClosed: !dialog,
          bodyOverflowRestored: bodyOverflow !== 'hidden',
        };
      });
      report.closingAndScrollRestore = closeEval;
      console.log('Close Evaluation:', closeEval);
    }

    // ---------------------------------------------------------
    // TEST 6: Mobile Gallery & Lightbox (390x844)
    // ---------------------------------------------------------
    console.log('Testing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    await page.evaluate(() => {
      const el = document.getElementById('memories-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 1000));

    const mobileGalleryPath = path.join(ARTIFACT_DIR, '06_mobile_gallery_exhibition.png');
    await page.screenshot({ path: mobileGalleryPath, fullPage: false });
    console.log('✓ Captured 06_mobile_gallery_exhibition.png');

    const mobileGalleryEval = await page.evaluate(() => {
      const section = document.getElementById('memories-section');
      const cards = section ? section.querySelectorAll('[aria-label^="Open archival plate"]') : [];
      const firstCardRect = cards[0] ? cards[0].getBoundingClientRect() : null;
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        plateCount: cards.length,
        firstCardWidth: firstCardRect ? firstCardRect.width : 0,
        fitsInViewport: firstCardRect ? firstCardRect.width <= window.innerWidth : false,
        horizontalOverflow,
      };
    });
    report.mobileGallery = mobileGalleryEval;
    console.log('Mobile Gallery Evaluation:', mobileGalleryEval);

    // Open lightbox on mobile
    console.log('Opening lightbox on mobile...');
    const mobileFirstPlate = await page.$('[aria-label^="Open archival plate 01"]');
    if (mobileFirstPlate) {
      await mobileFirstPlate.click();
      await new Promise((r) => setTimeout(r, 700));

      const mobileLightboxPath = path.join(ARTIFACT_DIR, '07_mobile_lightbox_open.png');
      await page.screenshot({ path: mobileLightboxPath, fullPage: false });
      console.log('✓ Captured 07_mobile_lightbox_open.png');

      const mobileLightboxEval = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const card = dialog ? dialog.querySelector('[role="region"]') : null;
        const rect = card ? card.getBoundingClientRect() : null;
        const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

        return {
          dialogOpen: !!dialog,
          cardWidth: rect ? rect.width : 0,
          cardHeight: rect ? rect.height : 0,
          fitsViewport: rect ? rect.width <= window.innerWidth && rect.height <= window.innerHeight : false,
          horizontalOverflow,
        };
      });
      report.mobileLightbox = mobileLightboxEval;
      console.log('Mobile Lightbox Evaluation:', mobileLightboxEval);

      // Flip card on mobile
      console.log('Flipping note on mobile...');
      const cardRegion = await page.$('[role="region"]');
      if (cardRegion) await cardRegion.click();
      await new Promise((r) => setTimeout(r, 700));

      const mobileNotePath = path.join(ARTIFACT_DIR, '08_mobile_lightbox_note.png');
      await page.screenshot({ path: mobileNotePath, fullPage: false });
      console.log('✓ Captured 08_mobile_lightbox_note.png');

      // Close on mobile
      const closeBtn = await page.$('[aria-label*="Close"]');
      if (closeBtn) await closeBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    // ---------------------------------------------------------
    // TEST 7: Regression Check on Envelope Stage
    // ---------------------------------------------------------
    console.log('Verifying Opening Envelope Stage has zero regression...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 600));

    const envelopeEval = await page.evaluate(() => {
      const envelope = document.querySelector('.envelope-desk-shadow');
      const waxSeal = document.querySelector('[aria-label*="Break wax seal"]');
      const affordance = document.querySelector('[aria-label*="Scroll to unfold"]');

      return {
        envelopePresent: !!envelope,
        waxSealPresent: !!waxSeal,
        affordancePresent: !!affordance,
      };
    });
    report.regressionEnvelope = envelopeEval;
    console.log('Regression Check Envelope:', envelopeEval);

  } catch (err) {
    console.error('Validation Error:', err);
    report.error = err.message;
  } finally {
    report.consoleErrors = consoleErrors;
    report.pageErrors = pageErrors;
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'phase4_report.json'),
      JSON.stringify(report, null, 2)
    );
    await browser.close();
    console.log('=== PHASE 4 VALIDATION COMPLETE ===');
  }
}

runPhase4Validation();
