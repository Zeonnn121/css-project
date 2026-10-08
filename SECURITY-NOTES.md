# SECURITY-NOTES.md

> ⚠️ **This document describes intentional, educational vulnerabilities.**
> All demos are isolated to `localhost` and must **never** be exposed to the internet.

---

## Overview

This project contains two distinct classes of Cross-Site Scripting (XSS) vulnerability,
each isolated under its own demo route. Both exist solely for security education.

| Demo | Route | Type |
|------|-------|------|
| Reflected XSS | `GET /demo/reflected-xss?q=<payload>` | Reflected (non-persistent) |
| Stored XSS | `GET /demo/stored-xss` + `POST /demo/stored-xss/submit` | Stored (persistent) |

The React UI exposes both under the **⚠ Demos** section in the sidebar.

---

## 1. Reflected XSS

### What it is

Reflected XSS occurs when user-supplied input is immediately returned in an HTTP response
**without encoding**, so the browser interprets it as markup or JavaScript.

The payload is **not stored** — it must be delivered to each victim individually (typically
via a crafted URL in a phishing email, QR code, or shortened link).

### Where the vulnerability lives

**File:** `target/src/demos.js`

```js
// VULNERABLE: user input reflected into HTML with no output encoding — classic reflected XSS.
// Do not do this in production.
// Fix: HTML-encode output or use a templating engine with auto-escaping.
const html = `... Search Results for: ${q} ...`;
res.send(html);
```

### How to trigger it

1. Start the Docker lab (`docker-compose up -d` or use the Lab Setup page).
2. Navigate to the **Reflected XSS** demo in the sidebar.
3. In the search box, enter one of the payloads below and click **Run Demo**:

```
<script>alert(1)</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('svg-xss')>
```

4. Observe the `alert()` executing inside the embedded iframe.

Alternatively, open the raw URL directly in a browser tab:

```
http://localhost:3000/demo/reflected-xss?q=<script>alert(1)</script>
```

### Root cause

- Template interpolation with no output encoding: `${q}` is dropped raw into the HTML string.
- No `Content-Security-Policy` header is set (another deliberate omission).

### What the fix looks like (not applied — "before" state)

**Option A — HTML-encode the output:**
```js
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
const html = `... Search Results for: ${escapeHtml(q)} ...`;
```

**Option B — Use a templating engine with auto-escaping:**
```js
// Nunjucks, Pug, Handlebars, EJS all escape by default
// e.g., Nunjucks:  {{ q }}  →  auto-escaped
//                 {{ q | safe }}  →  raw (dangerous)
```

**Option C — Content-Security-Policy:**
```
Content-Security-Policy: default-src 'self'; script-src 'self'
```
CSP won't fix the vulnerability but substantially limits exploitability.

---

## 2. Stored XSS

### What it is

Stored XSS (also called persistent XSS) occurs when user-supplied input is saved to
a data store **without sanitization** and later retrieved and rendered **without encoding**.

The payload fires for **every user** who views the page — no crafted link needed.
This makes it significantly more dangerous than reflected XSS.

### Where the vulnerability lives

**File:** `target/src/demos.js` — storage side:

```js
// VULNERABLE: Input stored as-is — no sanitization, no escaping,
// no validation of HTML/JS content.
blogComments.push({
  name,
  comment,   // ← raw payload stored here
  ...
});
```

**File:** `target/src/demos.js` — render side:

```js
// VULNERABLE: stored user input rendered without encoding — classic stored XSS.
// Fix: sanitize on input or encode on output (e.g., DOMPurify server-side,
// or escape HTML entities before rendering).
<div class="comment-body">${c.comment}</div>
```

**File:** `src/pages/StoredXSSDemo.tsx` — React render side:

```tsx
{/* VULNERABLE: raw HTML rendered — payload executes here */}
<div dangerouslySetInnerHTML={{ __html: c.comment }} />
```

### How to trigger it

1. Start the lab via Lab Setup.
2. Navigate to **Stored XSS** in the sidebar.
3. Fill in the comment form with any name, and use one of these payloads as the comment body:

```
<script>alert('Stored XSS')</script>
<img src=x onerror="alert('img XSS')">
<svg onload="alert('svg XSS')">
<script>document.body.style.border='4px solid red'</script>
```

4. Click **Post Comment**.
5. The payload fires immediately as the comment list re-renders.
6. Reload the page — the payload fires again (it is now persistent in memory).
7. Open the server-rendered page in a new tab (`http://localhost:3000/demo/stored-xss`)
   to observe the same attack from raw HTML.

### Root cause

- User input accepted and stored with no validation, stripping, or escaping.
- Stored data emitted back into HTML/JSX without output encoding.

### What the fix looks like (not applied — "before" state)

**Option A — Encode on output (server-side):**
```js
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
// Then in the template:
`<div class="comment-body">${escapeHtml(c.comment)}</div>`
```

**Option B — Sanitize on input with a library:**
```js
import sanitizeHtml from 'sanitize-html';
const safe = sanitizeHtml(comment, { allowedTags: [], allowedAttributes: {} });
blogComments.push({ ..., comment: safe });
```

**Option C — React safe rendering:**
```tsx
// Instead of dangerouslySetInnerHTML:
<div>{c.comment}</div>  // React auto-escapes text content
```

**Option D — DOMPurify (client-side):**
```tsx
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.comment) }} />
```

---

## General Defences Summary

| Defence | Stops Reflected XSS | Stops Stored XSS |
|---------|-------------------|-----------------|
| Output encoding (HTML entities) | ✅ | ✅ |
| Input sanitization (strip tags) | Partial | ✅ |
| Content-Security-Policy header | Limits | Limits |
| `HttpOnly` cookies | Doesn't stop, limits impact | Limits impact |
| Trusted Types API | ✅ (modern browsers) | ✅ |
| Template auto-escaping | ✅ | ✅ |

---

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Top 10 — A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)
- [MDN: Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [sanitize-html (npm)](https://www.npmjs.com/package/sanitize-html)
- [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)

---

## Scope Restrictions

These demos operate under the same restrictions as the rest of the lab:

- **No external network access** — all requests stay on `localhost`
- **No credential theft** — payloads are limited to `alert()` / DOM manipulation
- **No persistence** — in-memory only; data is lost on container restart
- **No data exfiltration** — no outbound HTTP calls from payloads
