/**
 * Tailorr Browser QA Test
 *
 * Runs a full Playwright browser QA sweep against a running Phoenix server.
 * Outputs structured JSON at the end so the QA agent can parse results.
 *
 * Usage:
 *   BASE_URL=http://localhost:4000 node services/browser/qa_test.js
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || '/tmp/tailorr_qa_screenshots';
const TIMEOUT = parseInt(process.env.TIMEOUT_MS || '10000', 10);
const HEADED = process.env.HEADED === '1';
const API_KEY = process.env.TAILORR_API_KEY || '';

if (HEADED) {
  process.stderr.write('Running in headed mode — browser window will be visible\n');
}

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Result tracking
// ---------------------------------------------------------------------------

const checks = [];

function pass(suite, name, detail = '') {
  checks.push({ status: 'PASS', suite, name, detail });
  process.stderr.write(`  ✓ [${suite}] ${name}${detail ? ' — ' + detail : ''}\n`);
}

function fail(suite, name, detail = '') {
  checks.push({ status: 'FAIL', suite, name, detail });
  process.stderr.write(`  ✗ [${suite}] ${name}${detail ? ' — ' + detail : ''}\n`);
}

function skip(suite, name, reason = '') {
  checks.push({ status: 'SKIP', suite, name, detail: reason });
  process.stderr.write(`  - [${suite}] ${name} (skipped: ${reason})\n`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function screenshot(page, name) {
  try {
    ensureDir(SCREENSHOT_DIR);
    const file = path.join(SCREENSHOT_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    return file;
  } catch (_) {
    return null;
  }
}

function noStacktrace(html) {
  const patterns = [
    'ArgumentError',
    'FunctionClauseError',
    'UndefinedFunctionError',
    'KeyError',
    'RuntimeError',
    '** (',
    'Phoenix.Router.NoRouteError',
    'debug_errors',
  ];
  return !patterns.some(p => html.includes(p));
}

async function navigateTo(page, url, waitFor = 'networkidle') {
  const response = await page.goto(url, { waitUntil: waitFor, timeout: TIMEOUT });
  return response;
}

// ---------------------------------------------------------------------------
// Suite: HTTP smoke tests (via fetch, no browser overhead)
// ---------------------------------------------------------------------------

async function suiteHttpSmoke() {
  process.stderr.write('\n[HTTP Smoke Tests]\n');

  const routes = [
    { path: '/', label: 'Root redirect', expectStatus: 200 },
    { path: '/ui/test', label: 'Test UI', expectStatus: 200 },
    { path: '/ui/builder', label: 'Builder UI', expectStatus: 200 },
    { path: '/ui/settings/telegram', label: 'Telegram Settings UI', expectStatus: 200 },
    { path: '/ui/builder/some_tracker', label: 'Builder edit mode', expectStatus: 200 },
    { path: '/api/?t=caps', label: 'Torznab caps (no auth)', expectStatus: 200 },
    { path: '/api/?t=search&q=test&apikey=bad_key', label: 'Torznab bad API key → not 500', expectStatus: [401, 403, 400] },
    { path: '/nonexistent-route-xyz', label: '404 for unknown routes', expectStatus: 404 },
    { path: '/ui/captcha-review', label: 'Captcha review UI', expectStatus: 200 },
  ];

  for (const route of routes) {
    try {
      const r = await fetch(`${BASE_URL}${route.path}`, { redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT) });
      const expected = Array.isArray(route.expectStatus) ? route.expectStatus : [route.expectStatus];
      if (expected.includes(r.status)) {
        pass('HTTP', route.label, `HTTP ${r.status}`);
      } else {
        fail('HTTP', route.label, `Expected ${expected.join('/')} got HTTP ${r.status}`);
      }
    } catch (err) {
      fail('HTTP', route.label, `Request failed: ${err.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Suite: Torznab XML validation
// ---------------------------------------------------------------------------

async function suiteTorznabXml() {
  process.stderr.write('\n[Torznab XML]\n');

  try {
    const r = await fetch(`${BASE_URL}/api/?t=caps`, { signal: AbortSignal.timeout(TIMEOUT) });
    const body = await r.text();

    if (body.startsWith('<?xml')) {
      pass('Torznab', 'Response starts with XML declaration');
    } else {
      fail('Torznab', 'Response starts with XML declaration', `Got: ${body.slice(0, 80)}`);
    }

    if (body.includes('<caps>')) {
      pass('Torznab', '<caps> element present');
    } else {
      fail('Torznab', '<caps> element present', 'Not found in response');
    }

    if (body.includes('<server')) {
      pass('Torznab', '<server> element present');
    } else {
      fail('Torznab', '<server> element present', 'Not found in response');
    }

    if (body.includes('<categories>')) {
      pass('Torznab', '<categories> element present');
    } else {
      fail('Torznab', '<categories> element present', 'Not found in response');
    }
  } catch (err) {
    fail('Torznab', 'XML fetch', err.message);
  }
}

// ---------------------------------------------------------------------------
// Suite: Test UI — LiveView render + search form
// ---------------------------------------------------------------------------

async function suiteTestUI(browser) {
  process.stderr.write('\n[Test UI — /ui/test]\n');
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  try {
    await navigateTo(page, `${BASE_URL}/ui/test`);
    await screenshot(page, 'test_ui_initial');

    // Check page title
    const title = await page.title();
    if (title && title.length > 0) {
      pass('TestUI', 'Page has a title', title);
    } else {
      fail('TestUI', 'Page has a title', 'Empty title');
    }

    // No stacktrace in HTML
    const html = await page.content();
    if (noStacktrace(html)) {
      pass('TestUI', 'No Elixir stacktrace in page HTML');
    } else {
      fail('TestUI', 'No Elixir stacktrace in page HTML', 'Stacktrace detected');
    }

    // LiveView socket connected (phx-connected class on body or root element)
    try {
      await page.waitForFunction(
        () => document.querySelector('[data-phx-main]') !== null,
        { timeout: TIMEOUT }
      );
      pass('TestUI', 'LiveView root element mounted');
    } catch (_) {
      fail('TestUI', 'LiveView root element mounted', 'phx-main element not found after timeout');
    }

    // Tracker dropdown/select present
    const trackerSelect = await page.$('select, [phx-click*="tracker"], [phx-value-tracker]');
    if (trackerSelect) {
      pass('TestUI', 'Tracker selector element present');
    } else {
      fail('TestUI', 'Tracker selector element present', 'No select or phx tracker element found');
    }

    // Search input present
    const searchInput = await page.$('input[type="text"], input[name="q"], input[name="query"], input[placeholder*="earch"]');
    if (searchInput) {
      pass('TestUI', 'Search input present');

      // Type into the search input and submit
      try {
        await searchInput.fill('ubuntu');
        await screenshot(page, 'test_ui_search_filled');

        const submitBtn = await page.$('button[type="submit"], input[type="submit"], button[phx-click*="search"]');
        if (submitBtn) {
          await submitBtn.click();
          // Wait for LiveView to respond (either results or "no results" state)
          await page.waitForTimeout(2000);
          await screenshot(page, 'test_ui_search_result');
          const htmlAfter = await page.content();
          if (noStacktrace(htmlAfter)) {
            pass('TestUI', 'Search submit does not crash the page');
          } else {
            fail('TestUI', 'Search submit does not crash the page', 'Stacktrace appeared after submit');
          }
        } else {
          skip('TestUI', 'Search submit interaction', 'No submit button found');
        }
      } catch (err) {
        fail('TestUI', 'Search input interaction', err.message);
      }
    } else {
      fail('TestUI', 'Search input present', 'No search input element found');
    }

    // Console errors check
    if (consoleErrors.length === 0) {
      pass('TestUI', 'No browser console errors');
    } else {
      fail('TestUI', 'No browser console errors', consoleErrors.slice(0, 3).join(' | '));
    }

    if (pageErrors.length === 0) {
      pass('TestUI', 'No uncaught JavaScript errors');
    } else {
      fail('TestUI', 'No uncaught JavaScript errors', pageErrors.slice(0, 3).join(' | '));
    }
  } catch (err) {
    fail('TestUI', 'Page load', err.message);
    await screenshot(page, 'test_ui_error');
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Suite: Builder UI — LiveView render + URL input
// ---------------------------------------------------------------------------

async function suiteBuilderUI(browser) {
  process.stderr.write('\n[Builder UI — /ui/builder]\n');
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  try {
    await navigateTo(page, `${BASE_URL}/ui/builder`);
    await screenshot(page, 'builder_ui_initial');

    const title = await page.title();
    if (title && title.length > 0) {
      pass('BuilderUI', 'Page has a title', title);
    } else {
      fail('BuilderUI', 'Page has a title', 'Empty title');
    }

    const html = await page.content();
    if (noStacktrace(html)) {
      pass('BuilderUI', 'No Elixir stacktrace in page HTML');
    } else {
      fail('BuilderUI', 'No Elixir stacktrace in page HTML', 'Stacktrace detected');
    }

    // LiveView mounted
    try {
      await page.waitForFunction(
        () => document.querySelector('[data-phx-main]') !== null,
        { timeout: TIMEOUT }
      );
      pass('BuilderUI', 'LiveView root element mounted');
    } catch (_) {
      fail('BuilderUI', 'LiveView root element mounted', 'phx-main element not found after timeout');
    }

    // URL input present
    const urlInput = await page.$('input[type="url"], input[type="text"][placeholder*="rl"], input[name="url"], input[phx-debounce]');
    if (urlInput) {
      pass('BuilderUI', 'URL input present');

      try {
        await urlInput.fill('https://example.com');
        await screenshot(page, 'builder_ui_url_filled');
        pass('BuilderUI', 'URL input accepts text');
      } catch (err) {
        fail('BuilderUI', 'URL input accepts text', err.message);
      }
    } else {
      fail('BuilderUI', 'URL input present', 'No URL input field found');
    }

    if (consoleErrors.length === 0) {
      pass('BuilderUI', 'No browser console errors');
    } else {
      fail('BuilderUI', 'No browser console errors', consoleErrors.slice(0, 3).join(' | '));
    }

    if (pageErrors.length === 0) {
      pass('BuilderUI', 'No uncaught JavaScript errors');
    } else {
      fail('BuilderUI', 'No uncaught JavaScript errors', pageErrors.slice(0, 3).join(' | '));
    }
  } catch (err) {
    fail('BuilderUI', 'Page load', err.message);
    await screenshot(page, 'builder_ui_error');
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Suite: Telegram Settings UI
// ---------------------------------------------------------------------------

async function suiteTelegramUI(browser) {
  process.stderr.write('\n[Telegram Settings — /ui/settings/telegram]\n');
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    await navigateTo(page, `${BASE_URL}/ui/settings/telegram`);
    await screenshot(page, 'telegram_settings_initial');

    const html = await page.content();
    if (noStacktrace(html)) {
      pass('TelegramUI', 'No Elixir stacktrace in page HTML');
    } else {
      fail('TelegramUI', 'No Elixir stacktrace in page HTML', 'Stacktrace detected');
    }

    if (consoleErrors.length === 0) {
      pass('TelegramUI', 'No browser console errors');
    } else {
      fail('TelegramUI', 'No browser console errors', consoleErrors.slice(0, 3).join(' | '));
    }
  } catch (err) {
    fail('TelegramUI', 'Page load', err.message);
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Suite: LiveView WebSocket connectivity
// ---------------------------------------------------------------------------

async function suiteLiveViewWS(browser) {
  process.stderr.write('\n[LiveView WebSocket]\n');
  const page = await browser.newPage();

  const wsMessages = [];
  page.on('websocket', ws => {
    ws.on('framesent', frame => wsMessages.push({ dir: 'sent', data: frame.payload }));
    ws.on('framereceived', frame => wsMessages.push({ dir: 'recv', data: frame.payload }));
  });

  try {
    await navigateTo(page, `${BASE_URL}/ui/test`);
    // Give LiveView time to mount and exchange join messages
    await page.waitForTimeout(2000);

    if (wsMessages.length > 0) {
      pass('LiveViewWS', 'WebSocket messages exchanged', `${wsMessages.length} frames`);
    } else {
      fail('LiveViewWS', 'WebSocket messages exchanged', 'No WebSocket activity detected');
    }

    // Check for phx_reply (heartbeat or mount ack) in received frames
    const hasPhxReply = wsMessages.some(m => m.dir === 'recv' && String(m.data).includes('phx_reply'));
    if (hasPhxReply) {
      pass('LiveViewWS', 'Server sent phx_reply (LiveView mounted)');
    } else {
      fail('LiveViewWS', 'Server sent phx_reply (LiveView mounted)', 'No phx_reply frame seen');
    }
  } catch (err) {
    fail('LiveViewWS', 'WebSocket test', err.message);
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Suite: Captcha Review UI
// ---------------------------------------------------------------------------

async function suiteCaptchaReview(browser) {
  process.stderr.write('\n[Captcha Review — /ui/captcha-review]\n');
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  try {
    await navigateTo(page, `${BASE_URL}/ui/captcha-review`);
    await screenshot(page, 'captcha_review_initial');

    const html = await page.content();
    if (noStacktrace(html)) {
      pass('CaptchaReview', 'No Elixir stacktrace in page HTML');
    } else {
      fail('CaptchaReview', 'No Elixir stacktrace in page HTML', 'Stacktrace detected');
    }

    try {
      await page.waitForFunction(
        () => document.querySelector('[data-phx-main]') !== null,
        { timeout: TIMEOUT }
      );
      pass('CaptchaReview', 'LiveView root element mounted');
    } catch (_) {
      fail('CaptchaReview', 'LiveView root element mounted', 'phx-main element not found after timeout');
    }

    // Stats panel should render (even with empty data)
    const statsPanel = await page.$('.grid');
    if (statsPanel) {
      pass('CaptchaReview', 'Stats panel rendered');
    } else {
      fail('CaptchaReview', 'Stats panel rendered', 'No .grid element found');
    }

    // Tab buttons should be present (Failed / Success / Classified)
    const tabBtn = await page.$('button[phx-click="change_tab"]');
    if (tabBtn) {
      pass('CaptchaReview', 'Tab buttons present');
      // Click the Success tab
      try {
        await tabBtn.click();
        await page.waitForTimeout(500);
        await screenshot(page, 'captcha_review_tab_clicked');
        pass('CaptchaReview', 'Tab click does not crash');
      } catch (err) {
        fail('CaptchaReview', 'Tab click does not crash', err.message);
      }
    } else {
      fail('CaptchaReview', 'Tab buttons present', 'No phx-click=change_tab button found');
    }

    if (consoleErrors.length === 0) {
      pass('CaptchaReview', 'No browser console errors');
    } else {
      fail('CaptchaReview', 'No browser console errors', consoleErrors.slice(0, 3).join(' | '));
    }

    if (pageErrors.length === 0) {
      pass('CaptchaReview', 'No uncaught JavaScript errors');
    } else {
      fail('CaptchaReview', 'No uncaught JavaScript errors', pageErrors.slice(0, 3).join(' | '));
    }
  } catch (err) {
    fail('CaptchaReview', 'Page load', err.message);
    await screenshot(page, 'captcha_review_error');
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Suite: Torznab search with valid API key
// ---------------------------------------------------------------------------

async function suiteTorznabSearch() {
  process.stderr.write('\n[Torznab Search]\n');

  if (!API_KEY) {
    skip('TorznabSearch', 'All checks', 'TAILORR_API_KEY not set — set it to enable search tests');
    return;
  }

  // t=search
  try {
    const r = await fetch(
      `${BASE_URL}/api/?t=search&q=ubuntu&apikey=${encodeURIComponent(API_KEY)}`,
      { signal: AbortSignal.timeout(TIMEOUT) }
    );

    if (r.status === 200) {
      pass('TorznabSearch', 'search returns HTTP 200 with valid key');
    } else {
      fail('TorznabSearch', 'search returns HTTP 200 with valid key', `Got HTTP ${r.status}`);
      return;
    }

    const body = await r.text();

    if (body.startsWith('<?xml')) {
      pass('TorznabSearch', 'Search response is XML');
    } else {
      fail('TorznabSearch', 'Search response is XML', `Got: ${body.slice(0, 100)}`);
    }

    if (body.includes('<channel>')) {
      pass('TorznabSearch', '<channel> element present in search response');
    } else {
      fail('TorznabSearch', '<channel> element present in search response');
    }
  } catch (err) {
    fail('TorznabSearch', 'search fetch', err.message);
  }

  // t=tvsearch (category-specific)
  try {
    const r = await fetch(
      `${BASE_URL}/api/?t=tvsearch&q=breaking+bad&apikey=${encodeURIComponent(API_KEY)}`,
      { signal: AbortSignal.timeout(TIMEOUT) }
    );
    if (r.status === 200) {
      pass('TorznabSearch', 'tvsearch returns HTTP 200');
    } else {
      fail('TorznabSearch', 'tvsearch returns HTTP 200', `Got HTTP ${r.status}`);
    }
  } catch (err) {
    fail('TorznabSearch', 'tvsearch fetch', err.message);
  }
}

// ---------------------------------------------------------------------------
// Suite: Mobile viewports (375×812 — iPhone 14)
// ---------------------------------------------------------------------------

async function suiteMobileViewports(browser) {
  process.stderr.write('\n[Mobile Viewports — 375×812]\n');

  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  const pages = [
    { path: '/ui/test', name: 'test_ui', label: 'Test UI' },
    { path: '/ui/builder', name: 'builder_ui', label: 'Builder UI' },
    { path: '/ui/captcha-review', name: 'captcha_review', label: 'Captcha Review' },
  ];

  for (const p of pages) {
    const page = await mobileContext.newPage();
    const mobileErrors = [];
    page.on('pageerror', err => mobileErrors.push(err.message));

    try {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle', timeout: TIMEOUT });
      await screenshot(page, `mobile_${p.name}`);

      const html = await page.content();
      if (noStacktrace(html)) {
        pass('Mobile', `${p.label} — no stacktrace at 375px`);
      } else {
        fail('Mobile', `${p.label} — no stacktrace at 375px`, 'Stacktrace detected');
      }

      // Check that main content is not zero-height (layout collapse)
      const mainHeight = await page.evaluate(() => {
        const main = document.querySelector('main, [role="main"], .min-h-screen, body > div');
        return main ? main.getBoundingClientRect().height : 0;
      });
      if (mainHeight > 50) {
        pass('Mobile', `${p.label} — main content visible (${Math.round(mainHeight)}px)`);
      } else {
        fail('Mobile', `${p.label} — main content visible`, `Height only ${Math.round(mainHeight)}px — possible layout collapse`);
      }

      if (mobileErrors.length === 0) {
        pass('Mobile', `${p.label} — no JS errors`);
      } else {
        fail('Mobile', `${p.label} — no JS errors`, mobileErrors.slice(0, 2).join(' | '));
      }
    } catch (err) {
      fail('Mobile', `${p.label} — page load`, err.message);
    } finally {
      await page.close();
    }
  }

  await mobileContext.close();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  process.stderr.write(`Tailorr Browser QA — ${BASE_URL}\n`);
  process.stderr.write(`Screenshots → ${SCREENSHOT_DIR}\n`);

  let browser;
  try {
    browser = await chromium.launch({
      headless: !HEADED,
      slowMo: HEADED ? 300 : 0,
    });

    await suiteHttpSmoke();
    await suiteTorznabXml();
    await suiteTorznabSearch();
    await suiteTestUI(browser);
    await suiteBuilderUI(browser);
    await suiteTelegramUI(browser);
    await suiteCaptchaReview(browser);
    await suiteLiveViewWS(browser);
    await suiteMobileViewports(browser);
  } finally {
    if (browser) await browser.close();
  }

  // Summary to stderr
  const passed = checks.filter(c => c.status === 'PASS').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;
  const skipped = checks.filter(c => c.status === 'SKIP').length;

  process.stderr.write(`\n--- SUMMARY: ${passed} passed, ${failed} failed, ${skipped} skipped ---\n`);

  // Structured JSON to stdout (for machine parsing)
  process.stdout.write(JSON.stringify({ passed, failed, skipped, checks }, null, 2) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  process.stderr.write(`Fatal error: ${err.message}\n${err.stack}\n`);
  process.exit(2);
});
