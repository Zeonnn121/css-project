import React, { useState } from 'react';
import { useLabStore } from '../store/labStore';
import { Play, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function XSSSimulation() {
  const { status, addLog, setDemonstrationResult } = useLabStore();
  const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [username, setUsername] = useState('Student');
  const [inputType, setInputType] = useState('normal');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  const targetUrl = 'http://localhost:3000';

  const payloads = {
    normal: 'Hello, this is my first message!',
    xss: '<script>alert("XSS Demonstration")</script>',
  };

  const runDemonstration = async () => {
    if (status !== 'running') {
      alert('Lab is not running. Please start it first.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload = payloads[inputType as keyof typeof payloads];
      const endpoint =
        mode === 'vulnerable'
          ? `${targetUrl}/api/vulnerable/submit`
          : `${targetUrl}/api/secure/submit`;

      const response = await axios.post(endpoint, {
        username,
        comment: payload,
      });

      const demonstrationResult = {
        mode,
        inputType,
        payload,
        response: response.data,
        timestamp: new Date().toISOString(),
        status: 'success',
      };

      setResult(demonstrationResult);
      setDemonstrationResult(demonstrationResult);

      addLog({
        level: 'success',
        message: `${mode.toUpperCase()} demonstration: ${inputType.toUpperCase()} input`,
        timestamp: new Date().toISOString(),
      });

      // Fetch updated comments
      await fetchComments();
    } catch (err: any) {
      const errorResult = {
        mode,
        inputType,
        status: 'error',
        error: err.message,
        timestamp: new Date().toISOString(),
      };

      setResult(errorResult);
      addLog({
        level: 'error',
        message: `Demonstration failed: ${err.message}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const endpoint =
        mode === 'vulnerable'
          ? `${targetUrl}/api/comments/vulnerable`
          : `${targetUrl}/api/comments/secure`;

      const response = await axios.get(endpoint);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const clearComments = async () => {
    try {
      await axios.post(`${targetUrl}/api/comments/clear`);
      setComments([]);
      setResult(null);
      addLog({
        level: 'info',
        message: 'Comments cleared',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      addLog({
        level: 'error',
        message: `Failed to clear comments: ${err.message}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const renderComment = (comment: any, index: number) => {
    if (mode === 'vulnerable') {
      // VULNERABLE: Render as HTML (allows XSS)
      return (
        <div
          key={index}
          className="bg-dark-700 rounded p-4 mb-2 border border-dark-600"
          dangerouslySetInnerHTML={{ __html: comment.htmlContent }}
        />
      );
    } else {
      // SECURE: Render as text only
      return (
        <div key={index} className="bg-dark-700 rounded p-4 mb-2 border border-dark-600">
          <strong className="text-gray-200">{comment.username}</strong>:
          <span className="text-gray-300 ml-2">{comment.comment}</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-white">XSS Simulation</h1>

      {status !== 'running' && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-yellow-400 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-yellow-400">Lab Not Running</h3>
            <p className="text-sm text-yellow-300">
              Please start the lab in the Lab Setup section to run demonstrations.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="lab-card">
            <h2 className="text-lg font-bold mb-4 text-security-blue">Controls</h2>

            {/* Mode Toggle */}
            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-2">Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('vulnerable')}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                    mode === 'vulnerable'
                      ? 'bg-security-red text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  Vulnerable
                </button>
                <button
                  onClick={() => setMode('secure')}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                    mode === 'secure'
                      ? 'bg-security-green text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  Secure
                </button>
              </div>
            </div>

            {/* Input Type */}
            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-2">Input Type</label>
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 text-sm border border-dark-600 focus:border-security-blue outline-none"
              >
                <option value="normal">Normal Input</option>
                <option value="xss">XSS Demonstration</option>
              </select>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark-700 text-gray-200 rounded px-3 py-2 text-sm border border-dark-600 focus:border-security-blue outline-none"
                placeholder="Your name"
              />
            </div>

            {/* Payload Preview */}
            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-2">Payload</label>
              <div className="lab-code text-xs">
                {payloads[inputType as keyof typeof payloads]}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={runDemonstration}
                disabled={loading || status !== 'running'}
                className="w-full lab-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Run Demonstration
              </button>
              <button
                onClick={clearComments}
                className="w-full lab-btn-primary bg-dark-700 hover:bg-dark-600 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Clear Comments
              </button>
            </div>
          </div>

          {/* Attack Analysis */}
          {result && (
            <div className={`lab-card border-l-4 ${
              result.status === 'success' ? 'border-security-blue' : 'border-security-red'
            }`}>
              <h3 className="font-bold mb-3">Analysis</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400">Mode:</span>
                  <span className={`ml-2 font-mono ${
                    mode === 'vulnerable' ? 'text-security-red' : 'text-security-green'
                  }`}>
                    {mode.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Input:</span>
                  <span className="ml-2 font-mono text-gray-300">{inputType}</span>
                </div>
                {result.status === 'success' && (
                  <div className="mt-3 p-2 bg-dark-700 rounded">
                    {mode === 'vulnerable' && inputType === 'xss' ? (
                      <p className="text-security-red font-bold">⚠️ XSS Executed</p>
                    ) : (
                      <p className="text-security-green font-bold">✓ Safe Rendering</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center: Comments Display */}
        <div className="lg:col-span-2">
          <div className="lab-card h-full">
            <h2 className="text-lg font-bold mb-4 text-security-blue">
              Comments ({comments.length})
            </h2>

            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No comments yet. Run a demonstration to see results.</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {comments.map((comment, index) => renderComment(comment, index))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="lab-card">
        <h2 className="text-lg font-bold mb-4">How This Works</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong className="text-security-blue">Vulnerable Mode:</strong>
            <p className="text-gray-400">
              Uses `dangerouslySetInnerHTML` to render the comment. If you submit XSS payload,
              the browser will execute the JavaScript (in this case, a safe alert).
            </p>
          </div>
          <div>
            <strong className="text-security-green">Secure Mode:</strong>
            <p className="text-gray-400">
              Renders comments as plain text. The XSS payload is displayed as literal characters,
              not executed. This is the correct approach for user-generated content.
            </p>
          </div>
          <div className="bg-security-yellow/10 border border-security-yellow/30 rounded p-3 mt-3">
            <strong className="text-security-yellow">Safe Payload:</strong>
            <p className="text-gray-400 font-mono text-xs mt-1">
              &lt;script&gt;alert('XSS Demonstration')&lt;/script&gt;
            </p>
            <p className="text-gray-400 text-xs mt-2">
              This is intentionally harmless for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
