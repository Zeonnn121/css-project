import React from 'react';

export default function Comparison() {
  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-white">Vulnerable vs Secure Implementation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerable Side */}
        <div className="lab-card border-l-4 border-security-red">
          <h2 className="text-2xl font-bold text-security-red mb-4">❌ Vulnerable Code</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-red-400 mb-2">Server-Side (Express.js)</h3>
              <div className="lab-code text-xs">
{`// VULNERABLE: No output encoding
export function vulnerableRoute(req, res) {
  const { username, comment } = req.body;

  const entry = {
    htmlContent: \`<div class="comment">
      <strong>\${username}</strong>:
      \${comment}
    </div>\`
  };

  res.json(entry);
}`}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-red-400 mb-2">Client-Side (React)</h3>
              <div className="lab-code text-xs">
{`// VULNERABLE: Using dangerouslySetInnerHTML
function Comment({ comment }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: comment.htmlContent
      }}
    />
  );
}`}
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded p-3">
              <h3 className="font-bold text-red-400 mb-2">Problems</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✗ No HTML entity encoding</li>
                <li>✗ User input treated as trusted HTML</li>
                <li>✗ Browser executes injected scripts</li>
                <li>✗ XSS payload is fully functional</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded p-3">
              <h3 className="font-bold text-red-400 mb-2">Attack Scenario</h3>
              <p className="text-sm text-gray-300">
                User submits: <code className="text-red-400">&lt;script&gt;stealCookies()&lt;/script&gt;</code>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Result: Script executes in victim's browser, attacker gains access to session.
              </p>
            </div>
          </div>
        </div>

        {/* Secure Side */}
        <div className="lab-card border-l-4 border-security-green">
          <h2 className="text-2xl font-bold text-security-green mb-4">✓ Secure Code</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-green-400 mb-2">Server-Side (Express.js)</h3>
              <div className="lab-code text-xs">
{`// SECURE: HTML entities escaped
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function secureRoute(req, res) {
  const { username, comment } = req.body;

  const entry = {
    htmlContent: \`<div class="comment">
      <strong>\${escapeHtml(username)}</strong>:
      \${escapeHtml(comment)}
    </div>\`
  };

  res.json(entry);
}`}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-green-400 mb-2">Client-Side (React)</h3>
              <div className="lab-code text-xs">
{`// SECURE: Using textContent (no HTML parsing)
function Comment({ comment }) {
  return (
    <div className="comment">
      <strong>{comment.username}</strong>:
      <span>{comment.comment}</span>
    </div>
  );
}`}
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-700 rounded p-3">
              <h3 className="font-bold text-green-400 mb-2">Security Measures</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ HTML entities are escaped</li>
                <li>✓ User input treated as untrusted data</li>
                <li>✓ Browser renders as plain text</li>
                <li>✓ XSS payload is displayed, not executed</li>
              </ul>
            </div>

            <div className="bg-green-900/20 border border-green-700 rounded p-3">
              <h3 className="font-bold text-green-400 mb-2">Attack Scenario</h3>
              <p className="text-sm text-gray-300">
                User submits: <code className="text-green-400">&lt;script&gt;stealCookies()&lt;/script&gt;</code>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Result: Rendered as text. No script execution. User sees the literal payload.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="lab-card">
        <h2 className="text-xl font-bold mb-4">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-gray-300">Aspect</th>
                <th className="text-left py-3 px-4 text-red-400">Vulnerable</th>
                <th className="text-left py-3 px-4 text-green-400">Secure</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: 'Output Encoding', vuln: '❌ None', secure: '✓ HTML entities' },
                { aspect: 'Input Validation', vuln: '❌ None', secure: '✓ Implicit (rendered as text)' },
                { aspect: 'XSS Prevention', vuln: '❌ None', secure: '✓ Content Security Policy' },
                { aspect: 'Script Execution', vuln: '❌ Allows', secure: '✓ Prevented' },
                { aspect: 'User Data Trust', vuln: '❌ Treated as code', secure: '✓ Treated as data' },
                { aspect: 'OWASP Rating', vuln: '❌ Critical', secure: '✓ Compliant' },
              ].map(row => (
                <tr key={row.aspect} className="border-b border-dark-700 hover:bg-dark-700/50">
                  <td className="py-3 px-4 text-gray-300">{row.aspect}</td>
                  <td className="py-3 px-4">{row.vuln}</td>
                  <td className="py-3 px-4">{row.secure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Differences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="lab-card">
          <h3 className="font-bold text-security-blue mb-2">🔍 Root Cause</h3>
          <p className="text-sm text-gray-300">
            <strong className="text-red-400">Vulnerable:</strong> Treats user input as trusted code
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <strong className="text-green-400">Secure:</strong> Treats user input as untrusted data
          </p>
        </div>

        <div className="lab-card">
          <h3 className="font-bold text-security-blue mb-2">🛡️ Defense</h3>
          <p className="text-sm text-gray-300">
            <strong className="text-red-400">Vulnerable:</strong> No output encoding applied
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <strong className="text-green-400">Secure:</strong> Output encoded; context-aware rendering
          </p>
        </div>

        <div className="lab-card">
          <h3 className="font-bold text-security-blue mb-2">📊 Impact</h3>
          <p className="text-sm text-gray-300">
            <strong className="text-red-400">Vulnerable:</strong> Full script execution possible
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <strong className="text-green-400">Secure:</strong> XSS attack prevented entirely
          </p>
        </div>
      </div>

      {/* Best Practices */}
      <div className="lab-card bg-security-blue/10 border-l-4 border-security-blue">
        <h2 className="text-lg font-bold mb-4 text-security-blue">Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-200 mb-2">Input Validation</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Whitelist acceptable characters</li>
              <li>• Reject unexpected patterns</li>
              <li>• Validate length and format</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-200 mb-2">Output Encoding</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Encode for context (HTML, JS, URL)</li>
              <li>• Use framework defaults (React, Vue)</li>
              <li>• Never use dangerouslySetInnerHTML</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-200 mb-2">Defense in Depth</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Implement Content Security Policy</li>
              <li>• Use HTTP-only cookies</li>
              <li>• Set X-Frame-Options header</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-200 mb-2">Testing & Review</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Security code review</li>
              <li>• Automated vulnerability scanning</li>
              <li>• Penetration testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
