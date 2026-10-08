/**
 * StoredXSSDemo.tsx
 * =================
 * React UI for the Stored XSS educational demo.
 *
 * Comment data is persisted (in-memory) by the backend at:
 *   POST /demo/stored-xss/submit       — stores raw input, no sanitization
 *   GET  /demo/stored-xss/comments     — returns raw stored comments as JSON
 *   POST /demo/stored-xss/clear        — wipes all comments
 *
 * This component renders comments with dangerouslySetInnerHTML,
 * mirroring what the backend's /demo/stored-xss HTML page does.
 * Any <script> or event-handler payload in a stored comment
 * will execute when the comment list is rendered.
 *
 * NOTE: This is an EDUCATIONAL tool. Do not replicate these
 * patterns in any production application.
 */

import React, { useState, useEffect } from 'react';
import { useLabStore } from '../store/labStore';
import { AlertCircle, Send, RotateCcw, ExternalLink, Info, MessageSquare } from 'lucide-react';
import axios from 'axios';

const TARGET_URL = 'http://localhost:3000';

interface Comment {
  name: string;
  email: string;
  website: string;
  comment: string;
  timestamp: string;
}

export default function StoredXSSDemo() {
  const { status, addLog } = useLabStore();

  const [form, setForm] = useState({ name: '', email: '', website: '', comment: '' });
  const [comments, setComments] = useState<Comment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const SAMPLE_PAYLOADS = [
    { label: '<script> tag', value: "<script>alert('Stored XSS')</script>" },
    { label: 'img onerror', value: "<img src=x onerror=\"alert('img XSS')\">" },
    { label: 'SVG onload', value: "<svg onload=\"alert('svg XSS')\">" },
    { label: 'DOM manipulation', value: "<script>document.body.style.border='4px solid red'</script>" },
  ];

  useEffect(() => {
    if (status === 'running') fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${TARGET_URL}/demo/stored-xss/comments`);
      setComments(res.data.comments || []);
    } catch {
      // backend not running — silently ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.comment.trim()) {
      alert('Name and Comment are required.');
      return;
    }
    if (status !== 'running') {
      alert('Lab is not running. Please start it in Lab Setup first.');
      return;
    }

    setSubmitting(true);
    try {
      // ──────────────────────────────────────────────────────────────
      // VULNERABLE: posting form data as-is — the backend stores it
      // without any sanitization (see target/src/demos.js).
      // The payload will be injected into the page on next render.
      // ──────────────────────────────────────────────────────────────
      await axios.post(`${TARGET_URL}/demo/stored-xss/submit`, form);

      addLog({
        level: 'demo',
        message: `[Stored XSS] Comment stored from "${form.name}" — no sanitization`,
        timestamp: new Date().toISOString(),
      });

      setForm({ name: '', email: '', website: '', comment: '' });
      await fetchComments();
    } catch (err: any) {
      addLog({
        level: 'error',
        message: `Stored XSS submit failed: ${err.message}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = async () => {
    try {
      await axios.post(`${TARGET_URL}/demo/stored-xss/clear`);
      setComments([]);
      addLog({ level: 'info', message: '[Stored XSS] All demo comments cleared', timestamp: new Date().toISOString() });
    } catch (err: any) {
      addLog({ level: 'error', message: `Clear failed: ${err.message}`, timestamp: new Date().toISOString() });
    }
  };

  const applyPayload = (value: string) => {
    setForm(f => ({ ...f, comment: value }));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-mono bg-red-900/40 text-red-400 border border-red-700 px-2 py-0.5 rounded">
            DEMO / stored-xss
          </span>
          <span className="text-xs text-gray-500">Intentionally Vulnerable — Educational Only</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Stored XSS Demo</h1>
        <p className="text-gray-400 mt-1">
          A blog-style comment feature that stores and renders user input with{' '}
          <span className="text-red-400 font-bold">no sanitization or encoding</span>. Payloads
          execute for every subsequent visitor.
        </p>
      </div>

      {/* Lab not running warning */}
      {status !== 'running' && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-yellow-400 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-yellow-400">Lab Not Running</h3>
            <p className="text-sm text-yellow-300">
              Start the lab in <strong>Lab Setup</strong> to enable comment submission and rendering.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left panel: form + payloads ── */}
        <div className="space-y-4">

          {/* Vulnerability callout */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-400" size={16} />
              <span className="text-red-400 font-bold text-sm">Vulnerability</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Comments are stored raw and rendered with{' '}
              <code className="text-yellow-400">dangerouslySetInnerHTML</code>. A malicious
              payload stored here fires for <strong className="text-red-400">every user</strong>{' '}
              who views this page.
            </p>
            <div className="mt-3 bg-dark-900 rounded p-2 font-mono text-xs text-gray-400">
              <span className="text-gray-500">// React render (vulnerable)</span><br />
              <span className="text-red-400">dangerouslySetInnerHTML=</span><br />
              <span className="text-red-400">{'  {{ __html: c.comment }}'}</span><br />
              <span className="text-gray-500">// ↑ raw stored payload executes</span>
            </div>
          </div>

          {/* Comment form */}
          <div className="lab-card">
            <h2 className="text-sm font-bold text-security-blue mb-3">Post a Comment</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 text-sm border border-dark-600 focus:border-security-blue outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 text-sm border border-dark-600 focus:border-security-blue outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 text-sm border border-dark-600 focus:border-security-blue outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Comment *</label>
                <textarea
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Write your comment…"
                  rows={4}
                  className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 text-sm border border-dark-600 focus:border-security-blue outline-none resize-none font-mono"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || status !== 'running'}
                  className="flex-1 lab-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={14} /> {submitting ? 'Posting…' : 'Post Comment'}
                </button>
                <button
                  onClick={handleClear}
                  disabled={status !== 'running'}
                  className="lab-btn-primary bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm px-3"
                  title="Clear all comments"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Sample payloads */}
          <div className="lab-card">
            <h2 className="text-sm font-bold mb-3 text-gray-300">Quick Payloads</h2>
            <div className="space-y-2">
              {SAMPLE_PAYLOADS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPayload(p.value)}
                  className="w-full text-left px-3 py-2 rounded bg-dark-700 hover:bg-dark-600 transition-colors"
                >
                  <div className="text-xs text-gray-400">{p.label}</div>
                  <div className="font-mono text-xs text-yellow-400 truncate">{p.value}</div>
                </button>
              ))}
            </div>
          </div>

          <a
            href={`${TARGET_URL}/demo/stored-xss`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-security-blue hover:underline"
          >
            <ExternalLink size={12} /> Open server-rendered page (raw HTML)
          </a>
        </div>

        {/* ── Right panel: comments display ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="lab-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-security-blue" size={18} />
                <h2 className="font-bold text-security-blue">
                  Comments ({comments.length})
                </h2>
              </div>
              <button
                onClick={fetchComments}
                disabled={status !== 'running'}
                className="text-xs text-gray-400 hover:text-white disabled:opacity-40"
              >
                ↻ Refresh
              </button>
            </div>

            {loading && (
              <p className="text-sm text-gray-400 text-center py-6">Loading…</p>
            )}

            {!loading && comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No comments yet. Post one — try an XSS payload.</p>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────────
                VULNERABLE: stored user input rendered without encoding
                — classic stored XSS.
                Fix: sanitize on input or encode on output
                (e.g., DOMPurify server-side, or escape HTML entities
                 before rendering).
                ────────────────────────────────────────────────────────── */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i} className="bg-dark-700 border border-dark-600 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-300">{c.name}</span>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noreferrer"
                         className="text-xs text-security-blue hover:underline truncate">
                        {c.website}
                      </a>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">{c.timestamp}</span>
                  </div>
                  {/* VULNERABLE: raw HTML rendered — payload executes here */}
                  <div
                    className="text-sm text-gray-300"
                    dangerouslySetInnerHTML={{ __html: c.comment }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="lab-card border-l-4 border-security-blue">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-security-blue" />
              <h3 className="font-bold text-sm">How Stored XSS Works</h3>
            </div>
            <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside">
              <li>Attacker submits a comment containing a <code className="text-yellow-400">&lt;script&gt;</code> tag or event handler.</li>
              <li>Server stores the raw payload in its data store <em>without sanitization</em>.</li>
              <li>Every time any user loads the page, the payload is retrieved and injected into the DOM.</li>
              <li>The script executes in <strong className="text-red-400">every viewer's</strong> session — unlike reflected XSS, no crafted link is needed.</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-dark-600">
              <p className="text-xs text-green-400 font-bold mb-1">Fix (not applied here — this is the "before" state):</p>
              <p className="text-xs text-gray-400 font-mono">
                {'// Option A: encode on output'}<br />
                {'comment.replace(/</g, "&lt;").replace(/>/g, "&gt;")'}<br />
                {'// Option B: sanitize library'}<br />
                {'DOMPurify.sanitize(comment)  // strips dangerous tags'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
