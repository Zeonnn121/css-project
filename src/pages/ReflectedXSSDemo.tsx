/**
 * ReflectedXSSDemo.tsx
 * ====================
 * React UI wrapper for the Reflected XSS educational demo.
 *
 * The actual vulnerable behaviour lives on the backend at:
 *   GET http://localhost:3000/demo/reflected-xss?q=<query>
 *
 * This page embeds that endpoint in an <iframe> so the raw server
 * response (including any injected scripts) executes naturally in
 * the browser, making the demonstration as realistic as possible.
 *
 * NOTE: This is an EDUCATIONAL tool. Do not replicate the backend
 * pattern in any production application.
 */

import React, { useState } from 'react';
import { useLabStore } from '../store/labStore';
import { AlertCircle, Play, ExternalLink, Code2, Info } from 'lucide-react';

const TARGET_URL = 'http://localhost:3000';

export default function ReflectedXSSDemo() {
  const { status, addLog } = useLabStore();
  const [query, setQuery] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const SAMPLE_PAYLOADS = [
    { label: 'Normal text', value: 'hello world' },
    { label: '<script> tag', value: "<script>alert(1)</script>" },
    { label: 'img onerror', value: "<img src=x onerror=alert('XSS')>" },
    { label: 'SVG onload', value: "<svg onload=alert('svg-xss')>" },
  ];

  const runDemo = (q?: string) => {
    if (status !== 'running') {
      alert('Lab is not running. Please start it in Lab Setup first.');
      return;
    }
    const searchTerm = q ?? query;
    if (!searchTerm.trim()) return;

    const url = `${TARGET_URL}/demo/reflected-xss?q=${encodeURIComponent(searchTerm)}`;
    setIframeSrc(url);
    setHasSearched(true);

    addLog({
      level: 'demo',
      message: `[Reflected XSS] Search submitted: ${searchTerm.substring(0, 50)}`,
      timestamp: new Date().toISOString(),
    });
  };

  const loadPayload = (value: string) => {
    setQuery(value);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-mono bg-red-900/40 text-red-400 border border-red-700 px-2 py-0.5 rounded">
            DEMO / reflected-xss
          </span>
          <span className="text-xs text-gray-500">Intentionally Vulnerable — Educational Only</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Reflected XSS Demo</h1>
        <p className="text-gray-400 mt-1">
          A search endpoint that reflects the <code className="text-yellow-400 text-sm bg-dark-700 px-1 rounded">?q=</code> parameter
          directly into the HTML response without any output encoding.
        </p>
      </div>

      {/* Lab not running warning */}
      {status !== 'running' && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-yellow-400 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-yellow-400">Lab Not Running</h3>
            <p className="text-sm text-yellow-300">
              Start the lab in <strong>Lab Setup</strong> before running this demo. The iframe
              below points to the Docker backend at localhost:3000.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left panel: controls ── */}
        <div className="space-y-4">

          {/* Vulnerability callout */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-400" size={16} />
              <span className="text-red-400 font-bold text-sm">Vulnerability</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              <span className="font-mono text-yellow-400">?q=</span> is interpolated
              into the HTML response with <strong className="text-red-400">no encoding</strong>.
              Any HTML or JavaScript in the query executes in the browser.
            </p>
            <div className="mt-3 bg-dark-900 rounded p-2 font-mono text-xs text-gray-400">
              <span className="text-gray-500">// server-side (Node.js)</span><br />
              res.send(<span className="text-red-400">`…${'{'}q{'}'} …`</span>);<br />
              <span className="text-gray-500">// ↑ VULNERABLE — raw interpolation</span>
            </div>
          </div>

          {/* Search input */}
          <div className="lab-card">
            <h2 className="text-sm font-bold text-security-blue mb-3">Search Input</h2>
            <label className="text-xs text-gray-400 block mb-1">Query (sent as ?q=)</label>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runDemo()}
              placeholder="Type anything or pick a payload →"
              className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 text-sm border border-dark-600 focus:border-security-blue outline-none font-mono"
            />
            <button
              onClick={() => runDemo()}
              disabled={!query.trim() || status !== 'running'}
              className="mt-2 w-full lab-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <Play size={14} /> Run Demo
            </button>
          </div>

          {/* Sample payloads */}
          <div className="lab-card">
            <h2 className="text-sm font-bold mb-3 text-gray-300">Sample Payloads</h2>
            <div className="space-y-2">
              {SAMPLE_PAYLOADS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { loadPayload(p.value); runDemo(p.value); }}
                  disabled={status !== 'running'}
                  className="w-full text-left px-3 py-2 rounded bg-dark-700 hover:bg-dark-600
                             disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="text-xs text-gray-400">{p.label}</div>
                  <div className="font-mono text-xs text-yellow-400 truncate">{p.value}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct link */}
          {hasSearched && (
            <a
              href={iframeSrc}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-security-blue hover:underline"
            >
              <ExternalLink size={12} /> Open in new tab (raw response)
            </a>
          )}
        </div>

        {/* ── Right panel: iframe result ── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="lab-card p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-700 border-b border-dark-600">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-gray-400 font-mono truncate flex-1">
                {iframeSrc || `${TARGET_URL}/demo/reflected-xss?q=…`}
              </span>
            </div>

            {hasSearched ? (
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                title="Reflected XSS Demo Response"
                className="w-full border-0"
                style={{ height: '460px', background: '#0f0f0f' }}
                /* sandbox intentionally omitted — allows scripts for the demo */
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[460px] text-gray-500">
                <Code2 size={40} className="mb-3 opacity-30" />
                <p className="text-sm">Enter a query and click <strong>Run Demo</strong></p>
                <p className="text-xs mt-1 opacity-60">The backend response will render here</p>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="lab-card border-l-4 border-security-blue">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-security-blue" />
              <h3 className="font-bold text-sm">How Reflected XSS Works</h3>
            </div>
            <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside">
              <li>Attacker crafts a URL containing a malicious <code className="text-yellow-400">?q=</code> value (e.g. a <code className="text-yellow-400">&lt;script&gt;</code> tag).</li>
              <li>Victim clicks the link (often delivered via phishing, email, or QR code).</li>
              <li>Server returns the query verbatim in the HTML response — the browser executes it.</li>
              <li>The script runs in the victim's browser session, with access to cookies, DOM, etc.</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-dark-600">
              <p className="text-xs text-green-400 font-bold mb-1">Fix (not applied here — this is the "before" state):</p>
              <code className="text-xs text-gray-400 block font-mono">
                const safe = q.replace(/&amp;/g,'&amp;amp;').replace(/&lt;/g,'&amp;lt;')…<br/>
                res.send(`…$&#123;safe&#125;…`); &nbsp;<span className="text-green-400">// encoded output</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
