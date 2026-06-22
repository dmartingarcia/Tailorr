const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory session storage
const sessions = new Map();

/**
 * Create a new browser session
 * POST /session/create
 * Response: { session_id: string }
 */
app.post('/session/create', async (req, res) => {
  try {
    const browser = await chromium.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    const sessionId = generateSessionId();
    sessions.set(sessionId, { browser, context, page });

    res.json({ session_id: sessionId });
  } catch (error) {
    console.error('Failed to create session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Navigate to URL and return screenshot
 * POST /session/:id/navigate
 * Body: { url: string }
 * Response: { screenshot: string (base64), title: string, status: number }
 */
app.post('/session/:id/navigate', async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    const response = await session.page.goto(url, { waitUntil: 'networkidle' });
    const screenshot = await session.page.screenshot({ type: 'png' });
    const title = await session.page.title();

    res.json({
      screenshot: `data:image/png;base64,${screenshot.toString('base64')}`,
      title,
      status: response.status()
    });
  } catch (error) {
    console.error('Navigation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Click at coordinates and extract CSS selector
 * POST /session/:id/click
 * Body: { x: number, y: number }
 * Response: { selector: string, text: string }
 */
app.post('/session/:id/click', async (req, res) => {
  const { id } = req.params;
  const { x, y } = req.body;

  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    // Get element at coordinates
    const element = await session.page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;

      // Generate CSS selector
      const generateSelector = (elem) => {
        if (elem.id) return `#${elem.id}`;

        const classes = Array.from(elem.classList).filter(c => c && !c.startsWith('_'));
        if (classes.length) {
          return `${elem.tagName.toLowerCase()}.${classes.join('.')}`;
        }

        return elem.tagName.toLowerCase();
      };

      return {
        selector: generateSelector(el),
        text: el.textContent?.trim() || '',
        tagName: el.tagName
      };
    }, { x, y });

    if (!element) {
      return res.status(404).json({ error: 'No element found at coordinates' });
    }

    res.json(element);
  } catch (error) {
    console.error('Click extraction failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Close browser session
 * DELETE /session/:id
 * Response: { ok: true }
 */
app.delete('/session/:id', async (req, res) => {
  const { id } = req.params;

  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    await session.browser.close();
    sessions.delete(id);
    res.json({ ok: true });
  } catch (error) {
    console.error('Failed to close session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    sessions: sessions.size,
    uptime: process.uptime()
  });
});

// Cleanup on shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  for (const [id, session] of sessions.entries()) {
    await session.browser.close();
  }
  process.exit(0);
});

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

app.listen(PORT, () => {
  console.log(`🌐 Browser service running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
