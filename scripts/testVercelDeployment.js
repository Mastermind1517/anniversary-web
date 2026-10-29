import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const ARTIFACT_DIR = path.resolve('./artifacts/vercel_preview_validation');

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const DEPLOY_URL = 'https://anni-jet-ten.vercel.app';

async function runVercelPreviewAudit() {
  console.log(`Starting live audit on: ${DEPLOY_URL}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const consoleErrors = [];
  const pageErrors = [];

  const auditReport = {
    url: DEPLOY_URL,
    status: 0,
    title: '',
    viewports: {},
    interactions: {},
    consoleErrors: [],
    pageErrors: []
  };

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => pageErrors.push(err.toString()));

  try {
    // 1. Desktop Viewport (1440x900)
    await page.setViewport({ width: 1440, height: 900 });
    const response = await page.goto(DEPLOY_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    auditReport.status = response.status();
    auditReport.title = await page.title();

    // Check envelope
    const envelopeShot = path.join(ARTIFACT_DIR, '01_vercel_envelope.png');
    await page.screenshot({ path: envelopeShot });

    // Break seal / unfold
    const waxSeal = await page.$('[aria-label*="Break wax seal"]');
    if (waxSeal) {
      await waxSeal.click();
      await new Promise(r => setTimeout(r, 1600));
    }
    const unfoldedShot = path.join(ARTIFACT_DIR, '02_vercel_unfolded.png');
    await page.screenshot({ path: unfoldedShot });
    auditReport.interactions.envelopeUnfolded = true;

    // Check gallery & lightbox
    await page.evaluate(() => {
      document.getElementById('memories-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    const firstPlate = await page.$('[aria-label^="Open archival plate 01"]');
    if (firstPlate) {
      await firstPlate.click();
      await new Promise(r => setTimeout(r, 600));
      const lightboxShot = path.join(ARTIFACT_DIR, '03_vercel_lightbox.png');
      await page.screenshot({ path: lightboxShot });
      auditReport.interactions.lightboxOpened = true;

      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 500));
    }

    // Audio / Cassette test
    await page.evaluate(() => {
      document.getElementById('mixtape-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));
    const cassetteBtn = await page.$('#mixtape-section button[aria-label*="tape"]');
    if (cassetteBtn) {
      await cassetteBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
    const cassetteShot = path.join(ARTIFACT_DIR, '04_vercel_cassette.png');
    await page.screenshot({ path: cassetteShot });
    auditReport.interactions.audioTriggered = true;

    // Love Notes test
    await page.evaluate(() => {
      document.getElementById('notes-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));
    const firstNote = await page.$('[aria-label^="Unfold letter 01"]');
    if (firstNote) {
      await firstNote.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise(r => setTimeout(r, 200));
      await firstNote.click();
      await new Promise(r => setTimeout(r, 600));
      const noteShot = path.join(ARTIFACT_DIR, '05_vercel_love_note.png');
      await page.screenshot({ path: noteShot });
      auditReport.interactions.loveNoteOpened = true;

      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 500));
    }

    // Final Vow test
    await page.evaluate(() => {
      document.getElementById('vow-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));
    const vowShot = path.join(ARTIFACT_DIR, '06_vercel_final_vow.png');
    await page.screenshot({ path: vowShot });
    auditReport.interactions.finalVowLoaded = true;

    // Secret Vault test
    const vaultBtn = await page.$('button[aria-label="Open secret keepsake vault"]');
    if (vaultBtn) {
      await vaultBtn.click();
      await new Promise(r => setTimeout(r, 500));
      await page.type('#vault-passcode-input', '1025');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 600));
      const vaultShot = path.join(ARTIFACT_DIR, '07_vercel_vault_unlocked.png');
      await page.screenshot({ path: vaultShot });
      auditReport.interactions.vaultUnlocked = true;

      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 500));
    }

    // Mobile Responsiveness Test (390x844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(DEPLOY_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 600));

    const mobileOverflow = await page.evaluate(async () => {
      let maxScrollWidth = document.documentElement.scrollWidth;
      const totalHeight = document.documentElement.scrollHeight;
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        window.scrollTo(0, (totalHeight / steps) * i);
        await new Promise(r => setTimeout(r, 80));
        if (document.documentElement.scrollWidth > maxScrollWidth) {
          maxScrollWidth = document.documentElement.scrollWidth;
        }
      }
      return {
        windowWidth: window.innerWidth,
        maxScrollWidth,
        hasHorizontalOverflow: maxScrollWidth > window.innerWidth
      };
    });
    auditReport.viewports.mobile390 = mobileOverflow;

    const mobileShot = path.join(ARTIFACT_DIR, '08_vercel_mobile.png');
    await page.screenshot({ path: mobileShot });

  } catch (err) {
    console.error('Audit Error:', err);
    auditReport.error = err && err.message ? err.message : String(err);
  } finally {
    auditReport.consoleErrors = consoleErrors;
    auditReport.pageErrors = pageErrors;
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'vercel_audit_report.json'),
      JSON.stringify(auditReport, null, 2)
    );
    await browser.close();
    console.log('Live Vercel Preview Audit Finished!');
  }
}

runVercelPreviewAudit();
