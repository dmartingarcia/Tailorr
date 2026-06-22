const express = require('express');
const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

chromium.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

/**
 * FlareSolverr-compatible v1 API.
 * Supports: cmd=request.get
 *
 * Uses playwright-extra + stealth plugin to bypass Cloudflare managed challenges
 * (Turnstile) that FlareSolverr v3 cannot solve.
 */
app.post('/v1', async (req, res) => {
  const { cmd, url, maxTimeout = 60000 } = req.body;

  if (cmd !== 'request.get') {
    return res.status(400).json({ status: 'error', message: `Unsupported command: ${cmd}` });
  }

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'url is required' });
  }

  const startTimestamp = Date.now();
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'es-ES',
      timezoneId: 'Europe/Madrid'
    });

    const page = await context.newPage();

    console.log(`[stealth] Fetching: ${url}`);

    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: maxTimeout
    });

    // Check if Cloudflare managed challenge is active
    const title = await page.title();
    const isCfChallenge = title.includes('Just a moment') || title.includes('Attention Required');

    if (isCfChallenge) {
      console.log(`[stealth] CF challenge detected, waiting for auto-resolve...`);
      const remaining = maxTimeout - (Date.now() - startTimestamp);

      try {
        // CF managed challenge usually auto-resolves in 3–10 s if fingerprint passes
        await page.waitForFunction(
          () => !document.title.includes('Just a moment') && !document.title.includes('Attention Required'),
          { timeout: remaining }
        );
        // Wait for the post-challenge redirect to settle
        await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
        console.log(`[stealth] Challenge resolved: ${await page.title()}`);
      } catch (_) {
        await browser.close();
        return res.status(500).json({
          status: 'error',
          message: `Cloudflare challenge did not auto-resolve within timeout (${maxTimeout}ms). Title: ${title}`
        });
      }
    }

    const html = await page.content();
    const finalUrl = page.url();
    const status = response?.status() ?? 200;
    const cookies = await context.cookies();
    const userAgent = await page.evaluate(() => navigator.userAgent);

    await browser.close();
    browser = null;

    console.log(`[stealth] Done (${Date.now() - startTimestamp}ms): ${finalUrl}`);

    res.json({
      status: 'ok',
      message: 'Challenge solved!',
      startTimestamp,
      endTimestamp: Date.now(),
      version: '1.0.0-stealth',
      solution: {
        url: finalUrl,
        status,
        headers: {},
        response: html,
        cookies: cookies.map(c => ({
          name: c.name,
          value: c.value,
          domain: c.domain,
          path: c.path,
          expires: c.expires,
          httpOnly: c.httpOnly,
          secure: c.secure
        })),
        userAgent
      }
    });
  } catch (error) {
    if (browser) await browser.close().catch(() => {});
    console.error(`[stealth] Error: ${error.message}`);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Stealth solver running on port ${PORT}`);
});
