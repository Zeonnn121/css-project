import React from 'react';
import { useLabStore } from '../store/labStore';
import { BookOpen, Zap, Clock, Shield, Code } from 'lucide-react';

export default function Overview() {
  const { setTab } = useLabStore();

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-bold text-red-400">Intentionally Vulnerable Lab</h3>
          <p className="text-sm text-red-300">
            This application contains intentional security vulnerabilities for educational purposes ONLY.
            It is designed to run locally and isolated. Do NOT expose this to the internet or external networks.
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Cross-Site Scripting (XSS)</h1>
        <p className="text-xl text-gray-300">Interactive Web Security Virtual Laboratory</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Experiment', value: 'XSS-01' },
          { label: 'Difficulty', value: 'Intermediate' },
          { label: 'Duration', value: '45 min' },
          { label: 'Environment', value: 'Isolated' },
        ].map(stat => (
          <div key={stat.label} className="lab-card text-center">
            <div className="text-2xl font-bold text-security-blue">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Aim */}
      <div className="lab-card">
        <div className="flex gap-3 mb-3">
          <BookOpen className="text-security-blue flex-shrink-0" size={24} />
          <h2 className="text-xl font-bold">Aim</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">
          To demonstrate how Cross-Site Scripting occurs when untrusted user input is rendered by a web application
          without appropriate output encoding or sanitization, and to demonstrate effective mitigation strategies.
        </p>
      </div>

      {/* Objectives */}
      <div className="lab-card">
        <div className="flex gap-3 mb-4">
          <Zap className="text-security-yellow flex-shrink-0" size={24} />
          <h2 className="text-xl font-bold">Learning Objectives</h2>
        </div>
        <ul className="space-y-2">
          {[
            'Understand the fundamentals of XSS vulnerabilities',
            'Identify how unsafe input handling leads to script injection',
            'Perform a controlled, safe XSS demonstration in an isolated environment',
            'Observe browser-side impact in both vulnerable and secure implementations',
            'Understand the root cause of XSS vulnerabilities',
            'Apply and verify mitigation techniques',
            'Compare vulnerable vs. secure code implementations',
          ].map((obj, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-security-green flex-shrink-0">✓</span>
              <span className="text-gray-300">{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Start */}
      <div className="bg-security-blue/10 border border-security-blue rounded-lg p-6">
        <div className="flex gap-3 mb-4">
          <Shield className="text-security-blue flex-shrink-0" size={24} />
          <h2 className="text-xl font-bold">Quick Start</h2>
        </div>
        <ol className="space-y-3 text-gray-300">
          <li className="flex gap-3">
            <span className="font-bold text-security-blue flex-shrink-0">1.</span>
            <span>Go to <button onClick={() => setTab('setup')} className="text-security-blue hover:underline">Lab Setup</button> and start the lab</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-security-blue flex-shrink-0">2.</span>
            <span>Read the <button onClick={() => setTab('theory')} className="text-security-blue hover:underline">Theory</button> to understand XSS</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-security-blue flex-shrink-0">3.</span>
            <span>Go to <button onClick={() => setTab('simulation')} className="text-security-blue hover:underline">XSS Simulation</button> for the interactive demonstration</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-security-blue flex-shrink-0">4.</span>
            <span>Compare implementations in <button onClick={() => setTab('comparison')} className="text-security-blue hover:underline">Vulnerable vs Secure</button></span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-security-blue flex-shrink-0">5.</span>
            <span>Complete the <button onClick={() => setTab('assessment')} className="text-security-blue hover:underline">Assessment</button> quiz</span>
          </li>
        </ol>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="lab-card">
          <h3 className="font-bold text-security-green mb-2">What You'll Learn</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• XSS vulnerability types</li>
            <li>• Input validation limitations</li>
            <li>• Output encoding techniques</li>
            <li>• Content Security Policy</li>
          </ul>
        </div>
        <div className="lab-card">
          <h3 className="font-bold text-security-blue mb-2">Lab Features</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Isolated Docker environment</li>
            <li>• Safe demonstration payloads</li>
            <li>• Real-time activity logging</li>
            <li>• Comprehensive assessment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import { AlertCircle } from 'lucide-react';
