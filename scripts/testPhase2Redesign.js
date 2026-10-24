import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\dilip\\.gemini\\antigravity\\brain\\d0413ef7-2f6d-41f7-82a1-f8c712673224\\phase2_validation';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPhase2Validation() {
  console.log('--- STARTING PHASE 2 REDESIGN BROWSER VALIDATION ---');
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

  // 1. Desktop Validation
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  console.log('Navigating to http://127.0.0.1:4173 ...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  // Capture Scene 1: Opening Envelope Stage
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_desktop_envelope_closed.png'), fullPage: false });
  console.log('✓ Captured 01_desktop_envelope_closed.png');

  // Verify Body & Canvas Foundations
  const foundationCheck = await page.evaluate(() => {
    const body = document.body;
    const bodyStyle = window.getComputedStyle(body);
    const htmlStyle = window.getComputedStyle(document.documentElement);

    // Font loading check
    const fontsLoaded = document.fonts ? document.fonts.check('16px "Cormorant Garamond"') : false;
    const sansLoaded = document.fonts ? document.fonts.check('16px "Plus Jakarta Sans"') : false;
    const caveatLoaded = document.fonts ? document.fonts.check('16px "Caveat"') : false;

    // Check overflow
    const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

    return {
      bodyBg: bodyStyle.backgroundColor,
      bodyColor: bodyStyle.color,
      htmlBg: htmlStyle.backgroundColor,
      fontFamily: bodyStyle.fontFamily,
      fontsLoaded,
      sansLoaded,
      caveatLoaded,
      hasHorizontalOverflow,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
  console.log('Foundation Check:', foundationCheck);

  // Click Wax Seal to unfold
  const waxSeal = await page.$('[aria-label="Break wax seal to open anniversary letter"]');
  if (waxSeal) {
    console.log('Breaking wax seal...');
    await waxSeal.click();
    await new Promise((r) => setTimeout(r, 2600));
  }

  // Capture Unfolded Letter
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_desktop_letter_unfolded.png'), fullPage: false });
  console.log('✓ Captured 02_desktop_letter_unfolded.png');

  // Scroll to Chronometer
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_desktop_chronometer.png'), fullPage: false });
  console.log('✓ Captured 03_desktop_chronometer.png');

  // Scroll to Memories Gallery
  await page.evaluate(() => {
    const el = document.getElementById('memories-section');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_desktop_memories_gallery.png'), fullPage: false });
  console.log('✓ Captured 04_desktop_memories_gallery.png');

  // Click first Polaroid to open Lightbox
  const polaroids = await page.$$('[role="button"][aria-label*="Open memory:"]');
  if (polaroids.length > 0) {
    console.log('Opening Polaroid lightbox...');
    await polaroids[0].click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_desktop_lightbox_front.png'), fullPage: false });
    console.log('✓ Captured 05_desktop_lightbox_front.png');

    // Flip polaroid
    const flipBtn = await page.$('button ::-p-text(Flip to read note)');
    if (flipBtn) {
      await flipBtn.click();
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_desktop_lightbox_back.png'), fullPage: false });
      console.log('✓ Captured 06_desktop_lightbox_back.png');
    }

    // Close lightbox
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));
  }

  // Scroll to Mixtape
  await page.evaluate(() => {
    const el = document.getElementById('mixtape-section');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_desktop_mixtape.png'), fullPage: false });
  console.log('✓ Captured 07_desktop_mixtape.png');

  // Scroll to Love Notes
  await page.evaluate(() => {
    const el = document.getElementById('notes-section');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_desktop_love_notes.png'), fullPage: false });
  console.log('✓ Captured 08_desktop_love_notes.png');

  // Scroll to Constellation
  await page.evaluate(() => {
    const el = document.getElementById('constellation-section');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_desktop_constellation.png'), fullPage: false });
  console.log('✓ Captured 09_desktop_constellation.png');

  // Scroll to Final Vow
  await page.evaluate(() => {
    const el = document.getElementById('vow-section');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_desktop_final_vow.png'), fullPage: false });
  console.log('✓ Captured 10_desktop_final_vow.png');

  // 2. Mobile Viewport Validation (390 x 844)
  console.log('--- TESTING MOBILE VIEWPORT (390x844) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await mobilePage.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const mobileCheck = await mobilePage.evaluate(() => {
    const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
    return {
      hasHorizontalOverflow,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
  console.log('Mobile Overflow Check:', mobileCheck);

  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, '11_mobile_envelope.png'), fullPage: false });
  console.log('✓ Captured 11_mobile_envelope.png');

  // Unfold on mobile
  const mobileWaxSeal = await mobilePage.$('[aria-label="Break wax seal to open anniversary letter"]');
  if (mobileWaxSeal) {
    await mobileWaxSeal.click();
    await new Promise((r) => setTimeout(r, 2600));
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, '12_mobile_letter_unfolded.png'), fullPage: false });
    console.log('✓ Captured 12_mobile_letter_unfolded.png');
  }

  // Scroll down on mobile
  await mobilePage.evaluate(() => {
    const el = document.getElementById('memories-section');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, '13_mobile_memories.png'), fullPage: false });
  console.log('✓ Captured 13_mobile_memories.png');

  // Comprehensive DOM Color Audit (checks if any computed RGB corresponds to gold/purple)
  const colorAudit = await page.evaluate(() => {
    const allElements = Array.from(document.querySelectorAll('*'));
    let goldFound = 0;
    let purpleFound = 0;

    for (const el of allElements) {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;
      const border = style.borderColor;

      // Gold: rgb(212, 175, 55) or close
      if (bg.includes('212, 175, 55') || color.includes('212, 175, 55') || border.includes('212, 175, 55')) {
        goldFound++;
      }
      // Purple: rgb(13, 11, 15), rgb(10, 8, 13), rgb(20, 14, 24)
      if (bg.includes('13, 11, 15') || bg.includes('10, 8, 13') || bg.includes('20, 14, 24')) {
        purpleFound++;
      }
    }

    return { totalElements: allElements.length, goldFound, purpleFound };
  });
  console.log('DOM Computed Color Audit:', colorAudit);

  await browser.close();

  const summary = {
    timestamp: new Date().toISOString(),
    foundationCheck,
    mobileCheck,
    colorAudit,
    consoleErrors,
    pageErrors,
    screenshots: [
      '01_desktop_envelope_closed.png',
      '02_desktop_letter_unfolded.png',
      '03_desktop_chronometer.png',
      '04_desktop_memories_gallery.png',
      '05_desktop_lightbox_front.png',
      '06_desktop_lightbox_back.png',
      '07_desktop_mixtape.png',
      '08_desktop_love_notes.png',
      '09_desktop_constellation.png',
      '10_desktop_final_vow.png',
      '11_mobile_envelope.png',
      '12_mobile_letter_unfolded.png',
      '13_mobile_memories.png',
    ],
  };

  fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase2_summary.json'), JSON.stringify(summary, null, 2));
  console.log('--- PHASE 2 VALIDATION COMPLETED SUCCESSFULLY ---');
}

runPhase2Validation().catch((err) => {
  console.error('Validation failed with error:', err);
  process.exit(1);
});
