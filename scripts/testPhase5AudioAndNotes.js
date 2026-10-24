import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase5_validation';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPhase5Validation() {
  console.log('=== STARTING PHASE 5 AUDIO & KEEPSAKES VALIDATION ===');
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
    audioPlayer: {},
    cassettePlayer: {},
    audioSync: {},
    loveNotes: {},
    loveNoteModal: {},
    mobileCassette: {},
    mobileLoveNotes: {},
    regressionChecks: {},
    consoleErrors: [],
    pageErrors: [],
  };

  try {
    // ---------------------------------------------------------
    // TEST 1: Desktop Viewport (1440x900) - Audio Player Pill & Drawer
    // ---------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    console.log('Navigating to http://127.0.0.1:4173 ...');
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Expand floating audio player drawer
    console.log('Testing Floating Audio Player...');
    const expandBtn = await page.$('aside[aria-label="Cinematic Sound Player"] button[aria-label*="player"]');
    if (expandBtn) {
      await expandBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    // Capture expanded audio drawer
    const audioDrawerPath = path.join(ARTIFACT_DIR, '01_desktop_audio_player_expanded.png');
    await page.screenshot({ path: audioDrawerPath, fullPage: false });
    console.log('✓ Captured 01_desktop_audio_player_expanded.png');

    const audioPlayerEval = await page.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Cinematic Sound Player"]');
      const drawer = aside ? aside.querySelector('div.bg-\\[\\#171717\\]\\/98') : null;
      const trackTitle = aside ? aside.querySelector('h4') : null;
      const playBtn = aside ? aside.querySelector('button[aria-label*="music"]') : null;

      return {
        asideFound: !!aside,
        drawerExpanded: !!drawer,
        trackTitle: trackTitle ? trackTitle.textContent?.trim() : null,
        hasPlayBtn: !!playBtn,
      };
    });
    report.audioPlayer = audioPlayerEval;
    console.log('Audio Player Eval:', audioPlayerEval);

    // Toggle Play from the Audio Player
    console.log('Clicking Play in Audio Player...');
    const playBtn = await page.$('aside[aria-label="Cinematic Sound Player"] button[aria-label="Play music"]');
    if (playBtn) {
      await playBtn.click();
      await new Promise((r) => setTimeout(r, 800));
    }

    // ---------------------------------------------------------
    // TEST 2: Cassette Player & Shared State Synchronization
    // ---------------------------------------------------------
    console.log('Scrolling to #mixtape-section (Cassette Player)...');
    await page.evaluate(() => {
      const el = document.getElementById('mixtape-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture Cassette Player
    const cassettePath = path.join(ARTIFACT_DIR, '02_desktop_cassette_player_playing.png');
    await page.screenshot({ path: cassettePath, fullPage: false });
    console.log('✓ Captured 02_desktop_cassette_player_playing.png');

    const cassetteEval = await page.evaluate(() => {
      const cassetteSec = document.getElementById('mixtape-section');
      const title = cassetteSec ? cassetteSec.querySelector('h3.font-serif') : null;
      const reels = cassetteSec ? cassetteSec.querySelectorAll('.animate-\\[spin_4s_linear_infinite\\]') : [];
      const pauseBtn = cassetteSec ? cassetteSec.querySelector('button[aria-label="Pause tape"]') : null;

      return {
        sectionFound: !!cassetteSec,
        cassetteTitle: title ? title.textContent?.trim() : null,
        reelsSpinning: reels.length > 0,
        isPlayingSynced: !!pauseBtn,
      };
    });
    report.cassettePlayer = cassetteEval;
    console.log('Cassette Player Eval:', cassetteEval);

    // Test Next Track on Cassette
    console.log('Clicking Next Track on Cassette...');
    const nextTrackBtn = await page.$('#mixtape-section button[aria-label="Next track"]');
    if (nextTrackBtn) {
      await nextTrackBtn.click();
      await new Promise((r) => setTimeout(r, 600));
    }

    const syncCheck = await page.evaluate(() => {
      const cassetteTitle = document.querySelector('#mixtape-section h3.font-serif')?.textContent?.trim();
      const asideTitle = document.querySelector('aside[aria-label="Cinematic Sound Player"] h4')?.textContent?.trim();

      return {
        cassetteTitle,
        asideTitle,
        inSync: cassetteTitle === asideTitle,
      };
    });
    report.audioSync = syncCheck;
    console.log('Audio State Sync Check:', syncCheck);

    // ---------------------------------------------------------
    // TEST 3: Love Notes Grid & Opening Experience
    // ---------------------------------------------------------
    console.log('Scrolling to #notes-section (Love Notes)...');
    await page.evaluate(() => {
      const el = document.getElementById('notes-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 1000));

    const notesGridEval = await page.evaluate(() => {
      const sec = document.getElementById('notes-section');
      const cards = sec ? sec.querySelectorAll('[aria-label^="Unfold letter"]') : [];
      const tracker = sec ? sec.querySelector('.text-\\[10px\\].font-sans.uppercase') : null;

      return {
        notesCount: cards.length,
        trackerText: tracker ? tracker.textContent?.trim() : null,
      };
    });
    report.loveNotes = notesGridEval;
    console.log('Love Notes Grid Eval:', notesGridEval);

    // Open Letter 01
    console.log('Opening Letter 01...');
    const firstLetter = await page.$('[aria-label^="Unfold letter 01"]');
    if (firstLetter) {
      await firstLetter.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise((r) => setTimeout(r, 400));
      await firstLetter.click();
      await new Promise((r) => setTimeout(r, 800));
    }

    const noteModalOpenPath = path.join(ARTIFACT_DIR, '03_desktop_love_note_modal_open.png');
    await page.screenshot({ path: noteModalOpenPath, fullPage: false });
    console.log('✓ Captured 03_desktop_love_note_modal_open.png');

    const modalEval = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const bodyOverflow = document.body.style.overflow;
      const noteTitle = dialog ? dialog.querySelector('h3.font-serif') : null;
      const noteContent = dialog ? dialog.querySelector('p.font-serif') : null;
      const prevBtn = dialog ? dialog.querySelector('button[aria-label*="Previous"]') : null;
      const nextBtn = dialog ? dialog.querySelector('button[aria-label*="Next"]') : null;

      return {
        dialogOpen: !!dialog,
        bodyOverflow,
        scrollLocked: bodyOverflow === 'hidden',
        noteTitle: noteTitle ? noteTitle.textContent?.trim() : null,
        noteContentSnippet: noteContent ? noteContent.textContent?.slice(0, 50) : null,
        hasPrevBtn: !!prevBtn,
        hasNextBtn: !!nextBtn,
      };
    });
    report.loveNoteModal = modalEval;
    console.log('Note Modal Eval:', modalEval);

    // Test In-Modal Pagination (Next Letter)
    console.log('Testing In-Modal Next Letter Navigation...');
    const modalNextBtn = await page.$('[role="dialog"] button[aria-label*="Next letter"]');
    if (modalNextBtn) {
      await modalNextBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    const noteModalNavPath = path.join(ARTIFACT_DIR, '04_desktop_love_note_modal_navigated.png');
    await page.screenshot({ path: noteModalNavPath, fullPage: false });
    console.log('✓ Captured 04_desktop_love_note_modal_navigated.png');

    // Close Note Modal via Escape key
    console.log('Closing Note Modal via Escape...');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));

    const notesAfterOpenPath = path.join(ARTIFACT_DIR, '05_desktop_love_notes_after_open.png');
    await page.screenshot({ path: notesAfterOpenPath, fullPage: false });
    console.log('✓ Captured 05_desktop_love_notes_after_open.png');

    // ---------------------------------------------------------
    // TEST 4: Mobile Viewport Validation (390x844)
    // ---------------------------------------------------------
    console.log('Testing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Scroll to Cassette on mobile
    await page.evaluate(() => {
      const el = document.getElementById('mixtape-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 800));

    const mobileCassettePath = path.join(ARTIFACT_DIR, '06_mobile_cassette_player.png');
    await page.screenshot({ path: mobileCassettePath, fullPage: false });
    console.log('✓ Captured 06_mobile_cassette_player.png');

    const mobileCassetteEval = await page.evaluate(() => {
      const cassette = document.querySelector('#mixtape-section > div.relative');
      const rect = cassette ? cassette.getBoundingClientRect() : null;
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        cassetteWidth: rect ? rect.width : 0,
        fitsInViewport: rect ? rect.width <= window.innerWidth : false,
        horizontalOverflow,
      };
    });
    report.mobileCassette = mobileCassetteEval;
    console.log('Mobile Cassette Eval:', mobileCassetteEval);

    // Scroll to Love Notes on mobile
    await page.evaluate(() => {
      const el = document.getElementById('notes-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 800));

    const mobileNotesPath = path.join(ARTIFACT_DIR, '07_mobile_love_notes.png');
    await page.screenshot({ path: mobileNotesPath, fullPage: false });
    console.log('✓ Captured 07_mobile_love_notes.png');

    // Open Letter on mobile
    const mobileLetter = await page.$('[aria-label^="Unfold letter 01"]');
    if (mobileLetter) {
      await mobileLetter.click();
      await new Promise((r) => setTimeout(r, 600));

      const mobileNoteModalPath = path.join(ARTIFACT_DIR, '08_mobile_love_note_modal.png');
      await page.screenshot({ path: mobileNoteModalPath, fullPage: false });
      console.log('✓ Captured 08_mobile_love_note_modal.png');

      const mobileModalEval = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const modalBox = dialog ? dialog.querySelector('div.bg-\\[\\#F9F8F5\\]') : null;
        const rect = modalBox ? modalBox.getBoundingClientRect() : null;
        const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

        return {
          dialogOpen: !!dialog,
          modalWidth: rect ? rect.width : 0,
          modalHeight: rect ? rect.height : 0,
          fitsViewport: rect ? rect.width <= window.innerWidth && rect.height <= window.innerHeight : false,
          horizontalOverflow,
        };
      });
      report.mobileLoveNotes = mobileModalEval;
      console.log('Mobile Modal Eval:', mobileModalEval);

      // Close modal on mobile
      const closeBtn = await page.$('[role="dialog"] button[aria-label*="Close"]');
      if (closeBtn) await closeBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    // ---------------------------------------------------------
    // TEST 5: Regression Checks (Envelope & Gallery)
    // ---------------------------------------------------------
    console.log('Running regression check on Envelope and Gallery...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 600));

    const regressionEval = await page.evaluate(() => {
      const envelope = document.querySelector('.envelope-desk-shadow');
      const waxSeal = document.querySelector('[aria-label*="Break wax seal"]');
      const galleryPlates = document.querySelectorAll('[aria-label^="Open archival plate"]');

      return {
        envelopePresent: !!envelope,
        waxSealPresent: !!waxSeal,
        galleryPlatesCount: galleryPlates.length,
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
      path.join(ARTIFACT_DIR, 'phase5_report.json'),
      JSON.stringify(report, null, 2)
    );
    await browser.close();
    console.log('=== PHASE 5 VALIDATION COMPLETE ===');
  }
}

runPhase5Validation();
