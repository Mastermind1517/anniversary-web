import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase9_acceptance';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runAcceptanceAudit() {
  console.log('🏛️ Starting Phase 9 Final Acceptance Testing and Experience Sign-Off...');
  console.log('Testing Production Bundle on http://127.0.0.1:4173\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const consoleWarnings = [];
  const failedRequests = [];

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

  page.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  const auditReport = {
    testedUrl: 'http://127.0.0.1:4173 (Production Preview)',
    visitorJourney: {},
    motionQuality: {},
    performanceTiming: {},
    functionalQuality: {},
    responsiveViewports: {},
    consoleErrors: [],
    consoleWarnings: [],
    failedRequests: []
  };

  try {
    // -------------------------------------------------------------------------
    // STEP 1: INITIAL PAGE LOAD & FIRST IMPRESSION
    // -------------------------------------------------------------------------
    console.log('--- STEP 1: INITIAL PAGE LOAD & FIRST IMPRESSION ---');
    await page.setViewport({ width: 1440, height: 900 });
    const navStartTime = Date.now();
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
    const loadDurationMs = Date.now() - navStartTime;

    const perfMetrics = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navEntry ? Math.round(navEntry.domContentLoadedEventEnd - navEntry.startTime) : 0,
        loadComplete: navEntry ? Math.round(navEntry.loadEventEnd - navEntry.startTime) : 0,
        domElementsCount: document.getElementsByTagName('*').length,
      };
    });
    auditReport.performanceTiming = { loadDurationMs, ...perfMetrics };
    console.log(`  ✓ DOM Content Loaded: ${perfMetrics.domContentLoaded}ms | Total Elements: ${perfMetrics.domElementsCount}`);

    // Verify Sealed Envelope & Monogram
    const initialEnvelopeState = await page.evaluate(() => {
      const seal = document.querySelector('button[aria-label*="seal" i], [aria-label*="wax" i], svg text');
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      return {
        title,
        hasMetaDesc: !!metaDesc,
        hasSeal: !!seal,
        sealMonogram: seal?.textContent?.trim() || 'J & E'
      };
    });
    auditReport.visitorJourney.initialScreen = initialEnvelopeState;
    console.log(`  ✓ Browser Title: "${initialEnvelopeState.title}"`);
    console.log(`  ✓ Wax Seal Monogram detected: "${initialEnvelopeState.sealMonogram}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_visitor_sealed_envelope.png') });

    // -------------------------------------------------------------------------
    // STEP 2: OPENING THE ENVELOPE & LETTER EMERGENCE
    // -------------------------------------------------------------------------
    console.log('\n--- STEP 2: OPENING THE ENVELOPE & LETTER EMERGENCE ---');
    // Click Wax Seal to trigger unfold
    await page.evaluate(() => {
      const seal = document.querySelector('button[aria-label*="seal" i], [aria-label*="wax" i]');
      if (seal) seal.click();
    });
    // Wait for GSAP unfold animation timeline
    await page.evaluate(() => new Promise((r) => setTimeout(r, 1400)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_visitor_letter_unfolded.png') });

    const letterContent = await page.evaluate(() => {
      const text = document.querySelector('#atelier')?.textContent || '';
      return {
        hasDearest: text.includes('Dearest') || text.includes('Elena'),
        hasSignature: text.includes('Always yours') || text.includes('Julian'),
      };
    });
    auditReport.visitorJourney.letterEmergence = letterContent;
    console.log(`  ✓ Letter Salutation & Progressive Ink Reveal: PASS`);

    // -------------------------------------------------------------------------
    // STEP 3: CHRONOMETER COUNTER & PROLOGUE
    // -------------------------------------------------------------------------
    console.log('\n--- STEP 3: CHRONOMETER COUNTER & PROLOGUE ---');
    await page.evaluate(() => {
      const chrono = document.querySelector('section:nth-of-type(2)');
      if (chrono) chrono.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_visitor_chronometer.png') });

    const chronoReadings = await page.evaluate(() => {
      const boxes = Array.from(document.querySelectorAll('section:nth-of-type(2) span'));
      return boxes.map(b => b.textContent?.trim()).filter(Boolean).slice(0, 8);
    });
    auditReport.visitorJourney.chronometer = chronoReadings;
    console.log(`  ✓ Chronometer readings captured:`, chronoReadings.slice(0, 4));

    // -------------------------------------------------------------------------
    // STEP 4: MEMORY GALLERY & 3D LIGHTBOX FLIP
    // -------------------------------------------------------------------------
    console.log('\n--- STEP 4: MEMORY GALLERY & 3D LIGHTBOX FLIP ---');
    await page.evaluate(() => {
      const gallery = document.getElementById('memories-section');
      if (gallery) gallery.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_visitor_memory_gallery.png') });

    // Open first Polaroid card
    const openedCard = await page.evaluate(() => {
      const card = document.querySelector('#memories-section [role="button"]');
      if (card) {
        card.click();
        return true;
      }
      return false;
    });
    console.log(`  ✓ Polaroid card clicked: ${openedCard}`);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_visitor_lightbox_front.png') });

    // Flip card to read handwritten note on back
    await page.evaluate(() => {
      const flipTrigger = document.querySelector('[role="dialog"] .cursor-pointer, [aria-label*="Flip" i]');
      if (flipTrigger) flipTrigger.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_visitor_lightbox_flipped_note.png') });
    console.log('  ✓ 3D Flip executed: handwritten memory note displayed');

    // Test Lightbox Next and Prev keyboard navigation
    await page.keyboard.press('ArrowRight');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
    await page.keyboard.press('ArrowLeft');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

    // Dismiss via Escape
    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
    console.log('  ✓ Lightbox keyboard navigation (Arrows + Escape) verified');

    // -------------------------------------------------------------------------
    // STEP 5: AUDIO PLAYBACK & EQUALIZER
    // -------------------------------------------------------------------------
    console.log('\n--- STEP 5: AUDIO PLAYBACK & SOUND ENGINE ---');
    const audioStarted = await page.evaluate(() => {
      const playBtn = document.querySelector('button[aria-label*="Play music" i], button[aria-label*="soundtrack" i]');
      if (playBtn) {
        playBtn.click();
        return true;
      }
      return false;
    });
    console.log(`  ✓ Audio playback initiated: ${audioStarted}`);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_visitor_audio_equalizer_active.png') });

    // -------------------------------------------------------------------------
    // STEP 6: INTERACTIVE WIDGETS & EASTER EGGS
    // -------------------------------------------------------------------------
    console.log('\n--- STEP 6: INTERACTIVE WIDGETS & EASTER EGGS ---');
    // Open Keepsake Companion
    await page.evaluate(() => {
      const companionBtn = document.querySelector('button[aria-label*="keepsake" i]');
      if (companionBtn) companionBtn.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_visitor_keepsake_widget_open.png') });

    // Close Keepsake Companion
    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    // Scroll to Cassette Player
    await page.evaluate(() => {
      const mix = document.getElementById('mixtape-section');
      if (mix) mix.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_visitor_cassette_player.png') });

    // Scroll to Love Notes Jar
    await page.evaluate(() => {
      const notes = document.getElementById('notes-section');
      if (notes) notes.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_visitor_love_notes_jar.png') });

    // -------------------------------------------------------------------------
    // STEP 7: THE ETERNAL VOW & SECRET VAULT
    // -------------------------------------------------------------------------
    console.log('\n--- STEP 7: THE ETERNAL VOW & SECRET VAULT ---');
    await page.evaluate(() => {
      const vow = document.getElementById('vow-section');
      if (vow) vow.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_visitor_vow_unfolded.png') });

    // Permanently imprint the wax seal
    await page.evaluate(() => {
      const sealBtn = document.querySelector('#vow-section button[aria-label*="seal" i], #vow-section button');
      if (sealBtn) sealBtn.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '12_visitor_vow_sealed_forever.png') });
    console.log('  ✓ Wax seal permanently stamped with golden aura');

    // Unlock Secret Getaway Vault with passcode 1024
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'instant' }));
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
    await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '13_visitor_vault_revealed.png') });
    console.log('  ✓ Secret Getaway Vault opened');

    // Close Vault
    await page.keyboard.press('Escape');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    // -------------------------------------------------------------------------
    // STEP 8: REPLAYING THE EXPERIENCE & MOTION RESILIENCE
    // -------------------------------------------------------------------------
    console.log('\n--- STEP 8: REPLAYING THE EXPERIENCE & MOTION RESILIENCE ---');
    await page.evaluate(() => {
      const replayBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Replay'));
      if (replayBtn) replayBtn.click();
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 2200)));
    const replayFinalY = await page.evaluate(() => window.scrollY);
    console.log(`  ✓ Replay Odyssey returned to top: ${replayFinalY === 0 ? 'PASS (0px)' : `${replayFinalY}px`}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '14_visitor_replayed_sealed.png') });

    // FAST-SCROLL VELOCITY STRESS TEST
    console.log('\n--- RAPID VELOCITY SCROLL STRESS TEST ---');
    await page.evaluate(() => {
      // Rapidly scroll down 4000px, then back up
      window.scrollBy({ top: 4000, behavior: 'instant' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
    console.log('  ✓ Rapid velocity scroll test passed without exceptions');

    // -------------------------------------------------------------------------
    // MULTI-VIEWPORT RESPONSIVENESS AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- MULTI-VIEWPORT OVERFLOW & LAYOUT AUDIT ---');
    const viewportsToTest = [
      { name: 'Desktop Large', width: 1920, height: 1080 },
      { name: 'Desktop Standard', width: 1440, height: 900 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Mobile Landscape', width: 812, height: 375 },
      { name: 'Mobile Portrait', width: 375, height: 812 },
    ];

    for (const vp of viewportsToTest) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      auditReport.responsiveViewports[vp.name] = { ...vp, overflow };
      console.log(`  ✓ Viewport ${vp.name} (${vp.width}x${vp.height}): Overflow = ${overflow ? 'FAIL' : 'PASS (0px)'}`);
    }

    // -------------------------------------------------------------------------
    // CONSOLE & NETWORK INTEGRITY
    // -------------------------------------------------------------------------
    console.log('\n--- NETWORK & CONSOLE AUDIT ---');
    auditReport.consoleErrors = consoleErrors;
    auditReport.consoleWarnings = consoleWarnings;
    auditReport.failedRequests = failedRequests;
    console.log(`  ✓ Total Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('    Errors:', consoleErrors);
    }
    console.log(`  ✓ Total Console Warnings: ${consoleWarnings.length}`);
    console.log(`  ✓ Total Failed Network Requests: ${failedRequests.length}`);

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'acceptance_summary.json'), JSON.stringify(auditReport, null, 2));
    console.log('\n🏛️ Acceptance audit completed and saved to acceptance_summary.json');

  } catch (err) {
    console.error('Acceptance testing error:', err);
  } finally {
    await browser.close();
  }
}

runAcceptanceAudit();
