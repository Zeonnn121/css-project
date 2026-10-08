/**
 * ============================================================
 *   XSS DEMO ROUTES  —  EDUCATIONAL PURPOSES ONLY
 * ============================================================
 *
 *  WARNING: This file contains INTENTIONAL security
 *  vulnerabilities. It exists solely to demonstrate how XSS
 *  attacks work in a fully isolated, local lab environment.
 *
 *  DO NOT deploy this code to any internet-facing server.
 *  DO NOT use these patterns in production applications.
 *
 *  Routes:
 *    GET  /demo/reflected-xss            — Reflected XSS demo page
 *    GET  /demo/stored-xss               — Stored XSS blog page
 *    POST /demo/stored-xss/submit        — Store comment (no sanitization)
 *    GET  /demo/stored-xss/comments      — Fetch raw stored comments (JSON)
 *    POST /demo/stored-xss/clear         — Wipe stored comments
 * ============================================================
 */

import express from 'express';
import { logger } from './logger.js';

export const demoRouter = express.Router();

// ─────────────────────────────────────────────────────────────
//  IN-MEMORY STORAGE  (demo only — resets on server restart)
// ─────────────────────────────────────────────────────────────

/**
 * DELIBERATELY UNSANITIZED comment store.
 * Each entry: { name, email, website, comment, timestamp }
 * Nothing is escaped, encoded, or validated before storage.
 */
let blogComments = [];


// ─────────────────────────────────────────────────────────────
//  DEMO 1 — REFLECTED XSS
//  Route: GET /demo/reflected-xss?q=<user-controlled-input>
// ─────────────────────────────────────────────────────────────

demoRouter.get('/reflected-xss', (req, res) => {
  const q = req.query.q ?? '';

  logger.log('demo', `[Reflected XSS] Search query received: ${String(q).substring(0, 60)}`);

  // ╔══════════════════════════════════════════════════════════╗
  // ║  VULNERABLE: user input reflected into HTML with no     ║
  // ║  output encoding — classic reflected XSS.               ║
  // ║  Do not do this in production.                          ║
  // ║  Fix: HTML-encode output or use a templating engine     ║
  // ║  with auto-escaping (e.g., Nunjucks, Pug, Handlebars). ║
  // ║                                                         ║
  // ║  Sample attack payloads to test with:                   ║
  // ║    ?q=<script>alert(1)</script>                         ║
  // ║    ?q=<img src=x onerror=alert('XSS')>                  ║
  // ╚══════════════════════════════════════════════════════════╝
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Search Results — XSS Lab Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f0f0f; color: #e5e5e5; padding: 24px; }
    .banner { background: #7f1d1d; border: 1px solid #dc2626; border-radius: 8px;
              padding: 14px 18px; margin-bottom: 24px; font-size: 13px; }
    .banner strong { color: #fca5a5; }
    .results-header { font-size: 22px; font-weight: 700; margin-bottom: 8px; color: #f3f4f6; }
    .results-sub { font-size: 13px; color: #9ca3af; margin-bottom: 20px; }
    .search-box { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;
                  padding: 16px; margin-top: 20px; }
    .search-box label { font-size: 13px; color: #9ca3af; display: block; margin-bottom: 8px; }
    .search-box input { width: 100%; background: #0f0f0f; border: 1px solid #3a3a3a;
                        border-radius: 6px; color: #e5e5e5; padding: 8px 12px; font-size: 14px; }
    .search-box button { margin-top: 10px; background: #3b82f6; color: white; border: none;
                         border-radius: 6px; padding: 8px 18px; cursor: pointer; font-size: 14px; }
    code { background: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #f59e0b; }
    .payload-hint { background: #1c1917; border: 1px solid #f59e0b55; border-radius: 6px;
                    padding: 10px 14px; font-size: 12px; color: #d1d5db; margin-top: 14px; }
  </style>
</head>
<body>
  <div class="banner">
    <strong>WARNING: INTENTIONALLY VULNERABLE — EDUCATIONAL DEMO ONLY</strong><br>
    This page reflects the <code>?q=</code> parameter directly into the HTML response without any
    output encoding. This is a textbook <strong>Reflected XSS</strong> vulnerability.
  </div>

  <div class="results-header">
    Search Results for:
    <!--
      VULNERABLE: The value of 'q' is interpolated directly into this HTML string
      with zero encoding. If 'q' contains <script> tags or event-handler attributes,
      the browser will execute them — that is reflected XSS in action.

      Fix: escape 'q' before inserting it here, e.g.:
        q.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    -->
    ${q}
  </div>
  <div class="results-sub">No results found for the above query.</div>

  <div class="search-box">
    <label>Search again:</label>
    <input id="q" type="text" placeholder="Try: &lt;script&gt;alert(1)&lt;/script&gt;" />
    <button onclick="window.location.href='/demo/reflected-xss?q='+encodeURIComponent(document.getElementById('q').value)">
      Search
    </button>
    <div class="payload-hint">
      Demo payloads:<br>
      <code>&lt;script&gt;alert(1)&lt;/script&gt;</code><br>
      <code>&lt;img src=x onerror=alert('XSS')&gt;</code>
    </div>
  </div>
</body>
</html>`;

  // Note: No Content-Security-Policy header — also a deliberate omission for demo purposes
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});


// ─────────────────────────────────────────────────────────────
//  DEMO 2 — STORED XSS
//  Route: GET /demo/stored-xss
//  Renders a blog page with all stored comments injected raw.
// ─────────────────────────────────────────────────────────────

demoRouter.get('/stored-xss', (req, res) => {
  logger.log('demo', `[Stored XSS] Blog page loaded, rendering ${blogComments.length} comment(s)`);

  // ╔══════════════════════════════════════════════════════════╗
  // ║ VULNERABLE: stored user input rendered without encoding  ║
  // ║ — classic stored XSS.                                   ║
  // ║ Fix: sanitize on input or encode on output              ║
  // ║ (e.g., DOMPurify server-side, or escape HTML entities   ║
  // ║  before rendering).                                      ║
  // ╚══════════════════════════════════════════════════════════╝
  const commentsHtml = blogComments.length === 0
    ? '<p style="color:#6b7280;font-style:italic">No comments yet. Submit the form below.</p>'
    : blogComments.map(c => `
        <div class="comment-card">
          <div class="comment-meta">
            <span class="comment-author">${c.name}</span>
            ${c.website ? ` &middot; <a class="comment-site" href="${c.website}" target="_blank">${c.website}</a>` : ''}
            <span class="comment-time">${c.timestamp}</span>
          </div>
          <div class="comment-body">${c.comment}</div>
        </div>`
    ).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blog Post — XSS Lab Demo (Stored XSS)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f0f0f; color: #e5e5e5;
           padding: 24px; max-width: 820px; margin: 0 auto; }
    .banner { background: #7f1d1d; border: 1px solid #dc2626; border-radius: 8px;
              padding: 14px 18px; margin-bottom: 24px; font-size: 13px; }
    .banner strong { color: #fca5a5; }
    h1 { font-size: 28px; margin-bottom: 6px; }
    .post-meta { font-size: 13px; color: #9ca3af; margin-bottom: 18px; }
    .post-body { font-size: 15px; color: #d1d5db; line-height: 1.7; margin-bottom: 32px; }
    hr { border: none; border-top: 1px solid #2a2a2a; margin: 28px 0; }
    h2 { font-size: 20px; margin-bottom: 16px; color: #f3f4f6; }
    .comment-card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;
                    padding: 14px 16px; margin-bottom: 14px; }
    .comment-meta { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
    .comment-author { font-weight: 700; color: #9ca3af; }
    .comment-site { color: #3b82f6; text-decoration: none; }
    .comment-time { margin-left: 8px; }
    .comment-body { font-size: 14px; color: #d1d5db; line-height: 1.6; }
    .form-card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;
                 padding: 20px; margin-top: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    label { font-size: 12px; color: #9ca3af; display: block; margin-bottom: 4px; }
    input, textarea { width: 100%; background: #0f0f0f; border: 1px solid #3a3a3a; border-radius: 6px;
                      color: #e5e5e5; padding: 8px 12px; font-size: 14px; font-family: inherit; }
    textarea { resize: vertical; min-height: 90px; }
    .form-actions { display: flex; gap: 10px; margin-top: 14px; }
    .btn-submit { background: #dc2626; color: white; border: none; border-radius: 6px;
                  padding: 9px 22px; cursor: pointer; font-size: 14px; font-weight: 600; }
    .btn-clear { background: #2a2a2a; color: #9ca3af; border: 1px solid #3a3a3a;
                 border-radius: 6px; padding: 9px 22px; cursor: pointer; font-size: 14px; }
    code { background: #0f0f0f; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #f59e0b; }
    .payload-hint { background: #1c1917; border: 1px solid #f59e0b55; border-radius: 6px;
                    padding: 10px 14px; font-size: 12px; color: #d1d5db; margin-top: 14px; }
  </style>
</head>
<body>
  <div class="banner">
    <strong>WARNING: INTENTIONALLY VULNERABLE — EDUCATIONAL DEMO ONLY</strong><br>
    Comments are stored and rendered <em>without any sanitization or encoding</em>.
    Any JavaScript in a submitted comment will execute when this page loads — that is
    <strong>Stored XSS</strong>.
  </div>

  <h1>Understanding Web Security: A Lab Post</h1>
  <p class="post-meta">Posted by Lab Admin &middot; XSS Virtual Lab</p>
  <div class="post-body">
    This is a placeholder blog post used in the Stored XSS demonstration.
    The comment form below accepts raw HTML and JavaScript. Whatever you submit is stored
    and rendered back to every visitor of this page without any encoding, simulating a real
    stored XSS vulnerability.
  </div>

  <hr>

  <h2>Comments (${blogComments.length})</h2>
  <div id="comments-container">
    ${commentsHtml}
  </div>

  <hr>

  <h2>Leave a Comment</h2>
  <div class="form-card">
    <div class="form-grid">
      <div>
        <label>Name *</label>
        <input id="name" type="text" placeholder="Your name" />
      </div>
      <div>
        <label>Email</label>
        <input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div>
        <label>Website</label>
        <input id="website" type="text" placeholder="https://example.com" />
      </div>
    </div>
    <div>
      <label>Comment *</label>
      <textarea id="comment" placeholder="Write your comment…"></textarea>
    </div>
    <div class="form-actions">
      <button class="btn-submit" onclick="submitComment()">Post Comment</button>
      <button class="btn-clear" onclick="clearComments()">Clear All Comments</button>
    </div>
    <div class="payload-hint">
      Demo payloads to try in the comment body:<br>
      <code>&lt;script&gt;alert('Stored XSS')&lt;/script&gt;</code><br>
      <code>&lt;img src=x onerror="alert('img XSS')"&gt;</code><br>
      <code>&lt;svg onload="alert('svg XSS')"&gt;</code>
    </div>
  </div>

  <script>
    async function submitComment() {
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const website = document.getElementById('website').value.trim();
      const comment = document.getElementById('comment').value.trim();
      if (!name || !comment) { alert('Name and Comment are required.'); return; }
      const res = await fetch('/demo/stored-xss/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, website, comment })
      });
      if (res.ok) { window.location.reload(); } else { alert('Submission failed.'); }
    }
    async function clearComments() {
      await fetch('/demo/stored-xss/clear', { method: 'POST' });
      window.location.reload();
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});


// ─────────────────────────────────────────────────────────────
//  POST /demo/stored-xss/submit
// ─────────────────────────────────────────────────────────────

demoRouter.post('/stored-xss/submit', (req, res) => {
  const { name, email, website, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({ error: 'name and comment are required' });
  }

  // ╔══════════════════════════════════════════════════════════╗
  // ║ VULNERABLE: Input stored as-is — no sanitization,       ║
  // ║ no escaping, no validation of HTML/JS content.          ║
  // ║ The raw payload will be re-emitted into the page HTML   ║
  // ║ on every subsequent GET /demo/stored-xss request.       ║
  // ║                                                          ║
  // ║ Fix: sanitize on input (e.g., strip tags with           ║
  // ║ DOMPurify / sanitize-html) OR encode on output          ║
  // ║ (escape HTML entities before template interpolation).   ║
  // ╚══════════════════════════════════════════════════════════╝
  blogComments.push({
    name,
    email:     email    || '',
    website:   website  || '',
    comment,                    // stored raw — intentionally no sanitization
    timestamp: new Date().toISOString(),
  });

  logger.log('demo', `[Stored XSS] Comment stored from "${name}" — no sanitization applied`);

  res.json({ success: true, total: blogComments.length });
});


// ─────────────────────────────────────────────────────────────
//  GET /demo/stored-xss/comments  — returns raw JSON for React UI
// ─────────────────────────────────────────────────────────────

demoRouter.get('/stored-xss/comments', (req, res) => {
  res.json({ comments: blogComments });
});


// ─────────────────────────────────────────────────────────────
//  POST /demo/stored-xss/clear  — wipes all demo comments
// ─────────────────────────────────────────────────────────────

demoRouter.post('/stored-xss/clear', (req, res) => {
  blogComments = [];
  logger.log('demo', '[Stored XSS] All demo comments cleared');
  res.json({ success: true });
});
