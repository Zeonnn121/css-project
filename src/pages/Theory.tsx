import React from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';

export default function Theory() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">XSS Theory & Background</h1>

      {/* Definition */}
      <div className="lab-card">
        <h2 className="text-2xl font-bold text-security-blue mb-4 flex gap-2 items-center">
          <BookOpen size={24} />
          What is Cross-Site Scripting (XSS)?
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts
          into web pages viewed by other users. When the browser renders the page, it interprets the injected code
          as legitimate JavaScript and executes it in the user's security context.
        </p>
      </div>

      {/* Why XSS Occurs */}
      <div className="lab-card">
        <h2 className="text-xl font-bold text-security-yellow mb-4">Why Does XSS Occur?</h2>
        <p className="text-gray-300 mb-4">
          XSS vulnerabilities occur when:
        </p>
        <ul className="space-y-3">
          {[
            { title: 'Untrusted Input', desc: 'User-supplied data (form input, URL parameters, cookies) is not validated' },
            { title: 'Unsafe Output', desc: 'The application renders user data directly into HTML without encoding' },
            { title: 'Browser Interpretation', desc: 'The browser interprets HTML/JavaScript tags and executes scripts' },
            { title: 'Missing Sanitization', desc: 'No removal or escaping of potentially dangerous content' },
          ].map(item => (
            <li key={item.title} className="border-l-4 border-security-blue pl-4">
              <strong className="text-security-blue">{item.title}:</strong>
              <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Trusted vs Untrusted */}
      <div className="lab-card">
        <h2 className="text-xl font-bold text-security-green mb-4">Trusted vs Untrusted Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-700 rounded p-4">
            <h3 className="font-bold text-red-400 mb-2">❌ Untrusted Sources</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• User form input</li>
              <li>• URL query parameters</li>
              <li>• HTTP headers</li>
              <li>• External APIs</li>
              <li>• File uploads</li>
              <li>• Database (if previously compromised)</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-700 rounded p-4">
            <h3 className="font-bold text-green-400 mb-2">✓ Trusted Sources</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Hardcoded application text</li>
              <li>• Developer configuration</li>
              <li>• Internal system data</li>
              <li>• Known safe templates</li>
              <li>• Validated/sanitized output</li>
            </ul>
          </div>
        </div>
      </div>

      {/* XSS Types */}
      <div className="lab-card">
        <h2 className="text-xl font-bold text-security-blue mb-4">Types of XSS</h2>
        <div className="space-y-4">
          {[
            {
              name: 'Reflected XSS',
              desc: 'Malicious code is reflected in the immediate response from the server',
              example: 'User clicks: example.com?name=<script>alert(1)</script>',
              risk: 'Medium - Requires user to click malicious link'
            },
            {
              name: 'Stored XSS',
              desc: 'Malicious code is stored in the database and executed for all users',
              example: 'Attacker submits: <script>steal()</script> as comment; displayed to all viewers',
              risk: 'High - Affects all users; persistent'
            },
            {
              name: 'DOM-based XSS',
              desc: 'Malicious code executes due to unsafe JavaScript manipulation of the DOM',
              example: 'JS code: element.innerHTML = userInput without sanitization',
              risk: 'High - Often client-side only; hard to detect'
            },
          ].map(xss => (
            <div key={xss.name} className="border-l-4 border-security-yellow pl-4 py-2">
              <h3 className="font-bold text-security-yellow">{xss.name}</h3>
              <p className="text-gray-300 text-sm mt-1">{xss.desc}</p>
              <div className="bg-dark-900 rounded p-2 mt-2 text-xs text-gray-400 font-mono">
                <strong>Example:</strong> {xss.example}
              </div>
              <p className="text-sm text-gray-400 mt-2"><strong>Risk Level:</strong> {xss.risk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Flow */}
      <div className="lab-card">
        <h2 className="text-xl font-bold text-security-red mb-4">XSS Attack Flow</h2>
        <div className="space-y-2">
          {[
            { step: '1', label: 'User Input', desc: 'Attacker enters malicious code' },
            { step: '2', label: 'Server Processing', desc: 'Application receives data; no validation' },
            { step: '3', label: 'Response Generation', desc: 'Server renders input directly into HTML' },
            { step: '4', label: 'Browser Parsing', desc: 'Browser receives HTML and parses it' },
            { step: '5', label: 'Script Execution', desc: 'Browser executes embedded JavaScript' },
            { step: '6', label: 'Impact', desc: 'Attacker gains control in user\'s browser context' },
          ].map(flow => (
            <div key={flow.step} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-security-blue flex items-center justify-center text-white font-bold flex-shrink-0">
                {flow.step}
              </div>
              <div className="flex-1 pt-1">
                <strong className="text-gray-200">{flow.label}</strong>
                <p className="text-sm text-gray-400">{flow.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention */}
      <div className="lab-card">
        <h2 className="text-xl font-bold text-security-green mb-4">XSS Prevention Techniques</h2>
        <div className="space-y-3">
          {[
            { tech: 'Output Encoding', desc: 'Convert special characters to HTML entities (&lt;, &gt;, &quot;, etc.)' },
            { tech: 'Input Validation', desc: 'Whitelist acceptable characters; reject unknown patterns' },
            { tech: 'Content Security Policy (CSP)', desc: 'HTTP header restricting script sources and execution' },
            { tech: 'DOM Methods', desc: 'Use textContent instead of innerHTML for user data' },
            { tech: 'Templating Engines', desc: 'Auto-escape output by default (React, Vue, Angular)' },
            { tech: 'Security Libraries', desc: 'Use DOMPurify, sanitize-html for HTML sanitization' },
          ].map(prev => (
            <div key={prev.tech} className="bg-dark-700 rounded p-3">
              <strong className="text-security-green">{prev.tech}</strong>
              <p className="text-sm text-gray-400 mt-1">{prev.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-World Impact */}
      <div className="lab-card border-l-4 border-security-red">
        <div className="flex gap-3">
          <AlertTriangle className="text-security-red flex-shrink-0" size={24} />
          <div>
            <h2 className="text-xl font-bold text-security-red mb-2">Real-World Security Impact</h2>
            <p className="text-gray-300 mb-3">
              XSS vulnerabilities can enable attackers to:
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Steal session cookies and authentication tokens</li>
              <li>• Redirect users to malicious websites</li>
              <li>• Capture keystrokes and form data</li>
              <li>• Deface web pages</li>
              <li>• Perform actions on behalf of legitimate users</li>
              <li>• Distribute malware</li>
              <li>• Perform phishing attacks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="lab-card">
        <h2 className="text-xl font-bold text-security-blue mb-4">Quick Reference: Output Encoding</h2>
        <div className="lab-code">
          <div className="text-red-400 mb-2">❌ VULNERABLE:</div>
          <div className="text-gray-300 font-mono text-sm mb-4">
            response.send(`&lt;div&gt;$&#123;userInput&#125;&lt;/div&gt;`)
          </div>

          <div className="text-green-400 mb-2">✓ SECURE:</div>
          <div className="text-gray-300 font-mono text-sm">
            response.send(`&lt;div&gt;$&#123;htmlEncode(userInput)&#125;&lt;/div&gt;`)
          </div>
        </div>
      </div>
    </div>
  );
}
