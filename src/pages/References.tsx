import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

export default function References() {
  const references = [
    {
      category: 'OWASP',
      items: [
        {
          title: 'OWASP Cross Site Scripting (XSS)',
          url: 'https://owasp.org/www-community/attacks/xss/',
          description: 'Comprehensive documentation of XSS vulnerabilities, types, and prevention'
        },
        {
          title: 'OWASP XSS Prevention Cheat Sheet',
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
          description: 'Practical prevention techniques organized by context'
        },
        {
          title: 'OWASP Top 10 2021',
          url: 'https://owasp.org/Top10/',
          description: 'XSS is part of #3: Injection vulnerabilities'
        }
      ]
    },
    {
      category: 'MDN Web Docs',
      items: [
        {
          title: 'Cross-site Scripting (XSS)',
          url: 'https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting_XSS',
          description: 'Mozilla documentation on XSS fundamentals'
        },
        {
          title: 'HTML/CSS/JavaScript Security',
          url: 'https://developer.mozilla.org/en-US/docs/Web/Security',
          description: 'Comprehensive web security reference'
        }
      ]
    },
    {
      category: 'Security Libraries',
      items: [
        {
          title: 'DOMPurify',
          url: 'https://github.com/cure53/DOMPurify',
          description: 'XSS sanitizer for HTML, MathML and SVG'
        },
        {
          title: 'sanitize-html',
          url: 'https://www.npmjs.com/package/sanitize-html',
          description: 'Clean HTML content for safe rendering'
        },
        {
          title: 'OWASP HTML Sanitizer',
          url: 'https://github.com/owasp/java-html-sanitizer',
          description: 'Server-side HTML sanitization'
        }
      ]
    },
    {
      category: 'Educational Resources',
      items: [
        {
          title: 'PortSwigger XSS Labs',
          url: 'https://portswigger.net/web-security/cross-site-scripting',
          description: 'Interactive labs demonstrating XSS vulnerabilities'
        },
        {
          title: 'OWASP WebGoat',
          url: 'https://github.com/WebGoat/WebGoat',
          description: 'Open-source intentionally insecure application for learning'
        },
        {
          title: 'HackTheBox',
          url: 'https://www.hackthebox.com/',
          description: 'Penetration testing practice platform'
        }
      ]
    },
    {
      category: 'Browser Security',
      items: [
        {
          title: 'Content Security Policy (CSP)',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
          description: 'HTTP header for restricting resource loading'
        },
        {
          title: 'Same-Origin Policy',
          url: 'https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy',
          description: 'Browser security model preventing XSS attacks'
        },
        {
          title: 'CORS Security',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
          description: 'Cross-Origin Resource Sharing security model'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">References & Resources</h1>

      <div className="lab-card">
        <p className="text-gray-300">
          Comprehensive list of authoritative resources for learning about Cross-Site Scripting (XSS)
          vulnerabilities, prevention techniques, and security best practices.
        </p>
      </div>

      {references.map((category) => (
        <div key={category.category} className="space-y-3">
          <h2 className="text-2xl font-bold text-security-blue flex items-center gap-2">
            <BookOpen size={24} />
            {category.category}
          </h2>

          <div className="space-y-3">
            {category.items.map((item, idx) => (
              <div key={idx} className="lab-card hover:border-security-blue transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-100 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-security-blue hover:text-blue-400 text-xs font-mono flex items-center gap-1 w-fit"
                    >
                      {item.url}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Reference Card */}
      <div className="lab-card bg-security-blue/10 border-l-4 border-security-blue">
        <h2 className="text-xl font-bold mb-4">Quick Reference: XSS Prevention Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-security-green mb-2">✓ DO:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Treat all user input as untrusted</li>
              <li>• Use output encoding contextually</li>
              <li>• Use framework defaults (React, Vue)</li>
              <li>• Implement Content Security Policy</li>
              <li>• Validate input on server-side</li>
              <li>• Use HTTP-only cookies</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-security-red mb-2">✗ DON'T:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Use eval() on user input</li>
              <li>• Use dangerouslySetInnerHTML</li>
              <li>• Trust client-side validation</li>
              <li>• Store sensitive data in DOM</li>
              <li>• Disable security features</li>
              <li>• Expose sensitive endpoints</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Context-Specific Encoding */}
      <div className="lab-card">
        <h2 className="text-xl font-bold mb-4">Context-Specific Output Encoding</h2>
        <div className="space-y-3">
          {[
            { context: 'HTML Body', encode: '<, >, &, ", \' → HTML entities' },
            { context: 'HTML Attributes', encode: '"\'<>& → HTML entities' },
            { context: 'JavaScript', encode: 'Use JSON encoding, avoid inline JS' },
            { context: 'URL', encode: 'URL encode special characters' },
            { context: 'CSS', encode: 'CSS encode color/URL values' },
          ].map(item => (
            <div key={item.context} className="flex gap-4 p-3 bg-dark-700 rounded">
              <div className="font-bold text-security-blue w-32 flex-shrink-0">{item.context}</div>
              <div className="text-gray-300 text-sm">{item.encode}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testing Tools */}
      <div className="lab-card">
        <h2 className="text-xl font-bold mb-4">Useful Security Testing Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Burp Suite', type: 'Web Vulnerability Scanner' },
            { name: 'OWASP ZAP', type: 'Automated Security Scanner' },
            { name: 'npm audit', type: 'Dependency Vulnerability Checker' },
            { name: 'Snyk', type: 'Container & Dependency Security' },
            { name: 'ESLint Security Plugin', type: 'Code Quality & Security' },
            { name: 'SonarQube', type: 'Code Quality Analysis' },
          ].map(tool => (
            <div key={tool.name} className="bg-dark-700 rounded p-3">
              <div className="font-bold text-gray-200">{tool.name}</div>
              <div className="text-xs text-gray-400">{tool.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="lab-card border-l-4 border-security-yellow">
        <h2 className="text-xl font-bold mb-4">Why XSS Matters</h2>
        <div className="space-y-2 text-gray-300">
          <p>• XSS is in the OWASP Top 10 2021 (#3: Injection)</p>
          <p>• Affects millions of web applications worldwide</p>
          <p>• Can lead to credential theft, malware distribution, and data breach</p>
          <p>• Often overlooked in development but critical in production</p>
          <p>• Prevention requires defense-in-depth strategies</p>
        </div>
      </div>

      {/* Footer */}
      <div className="lab-card bg-dark-700">
        <p className="text-xs text-gray-400">
          Last updated: October 2024 | All external links verified at time of creation
        </p>
      </div>
    </div>
  );
}
