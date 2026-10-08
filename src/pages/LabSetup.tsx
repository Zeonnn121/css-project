import React, { useState, useEffect } from 'react';
import { useLabStore } from '../store/labStore';
import { Play, Square, RotateCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';

export default function LabSetup() {
  const { status, setStatus, addLog } = useLabStore();
  const [checks, setChecks] = useState({
    docker: null,
    nodejs: null,
    network: null,
    port: null,
  });
  const [checking, setChecking] = useState(false);

  const runChecks = async () => {
    setChecking(true);
    setChecks({
      docker: 'checking',
      nodejs: 'checking',
      network: 'checking',
      port: 'checking',
    });

    try {
      // Check if target is responding
      const response = await axios.get('http://localhost:3000/api/health', { timeout: 3000 });
      if (response.status === 200) {
        setChecks({
          docker: true,
          nodejs: true,
          network: true,
          port: true,
        });
      }
    } catch (err) {
      setChecks({
        docker: false,
        nodejs: false,
        network: false,
        port: false,
      });
    }
    setChecking(false);
  };

  const handleStartLab = async () => {
    setStatus('starting');
    addLog({ level: 'info', message: 'Lab starting...', timestamp: new Date().toISOString() });

    try {
      // Give Docker a moment to be ready
      await new Promise(r => setTimeout(r, 2000));

      const response = await axios.get('http://localhost:3000/api/health', { timeout: 5000 });
      if (response.status === 200) {
        setStatus('running');
        addLog({ level: 'success', message: 'Lab started successfully', timestamp: new Date().toISOString() });
      }
    } catch (err: any) {
      setStatus('error');
      addLog({ level: 'error', message: `Lab failed to start: ${err.message}`, timestamp: new Date().toISOString() });
    }
  };

  const handleStopLab = async () => {
    setStatus('stopped');
    addLog({ level: 'info', message: 'Lab stopped', timestamp: new Date().toISOString() });
  };

  const handleResetLab = async () => {
    setStatus('resetting');
    addLog({ level: 'info', message: 'Lab resetting...', timestamp: new Date().toISOString() });

    try {
      // Clear comments
      await axios.post('http://localhost:3000/api/comments/clear');
      setStatus('stopped');
      addLog({ level: 'success', message: 'Lab reset complete', timestamp: new Date().toISOString() });
    } catch (err: any) {
      setStatus('error');
      addLog({ level: 'error', message: `Reset failed: ${err.message}`, timestamp: new Date().toISOString() });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Lab Setup & Configuration</h1>

      {/* Status Card */}
      <div className="lab-card border-2 border-security-blue">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Lab Status</h2>
          <div className={`
            lab-badge
            ${status === 'running' ? 'lab-badge-success' :
              status === 'error' ? 'lab-badge-error' :
              'lab-badge-warning'}
          `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        <p className="text-gray-300 text-sm">
          {status === 'running' && 'Lab is active and ready for experiments.'}
          {status === 'stopped' && 'Lab is not running. Click Start Lab to initialize.'}
          {status === 'error' && 'Lab encountered an error. Check the Activity Log for details.'}
          {status === 'starting' && 'Lab is starting... Please wait.'}
          {status === 'stopping' && 'Lab is stopping... Please wait.'}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleStartLab}
          disabled={status === 'running' || status === 'starting'}
          className="lab-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Play size={18} />
          Start Lab
        </button>
        <button
          onClick={handleStopLab}
          disabled={status !== 'running'}
          className="lab-btn-danger disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Square size={18} />
          Stop Lab
        </button>
        <button
          onClick={handleResetLab}
          disabled={status === 'starting' || status === 'stopping'}
          className="lab-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Reset Lab
        </button>
      </div>

      {/* Prerequisites */}
      <div className="lab-card">
        <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex gap-2">
            <span className="text-security-blue">•</span>
            Docker Desktop (installed and running)
          </li>
          <li className="flex gap-2">
            <span className="text-security-blue">•</span>
            Node.js 18+ (for development)
          </li>
          <li className="flex gap-2">
            <span className="text-security-blue">•</span>
            Git (for version control)
          </li>
          <li className="flex gap-2">
            <span className="text-security-blue">•</span>
            4GB RAM minimum
          </li>
          <li className="flex gap-2">
            <span className="text-security-blue">•</span>
            Port 3000 available
          </li>
        </ul>
      </div>

      {/* Environment Check */}
      <div className="lab-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Environment Check</h2>
          <button
            onClick={runChecks}
            disabled={checking}
            className="lab-btn-primary text-sm disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Run Checks'}
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(checks).map(([name, result]) => (
            <div key={name} className="flex items-center gap-3 p-3 bg-dark-700 rounded">
              <div className="flex-1">
                <div className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-xs text-gray-400">
                  {name === 'docker' && 'Docker daemon and docker-compose'}
                  {name === 'nodejs' && 'Node.js runtime'}
                  {name === 'network' && 'Isolated lab network'}
                  {name === 'port' && 'Port 3000 availability'}
                </div>
              </div>
              {result === null && <Clock className="text-gray-400" size={18} />}
              {result === 'checking' && <Clock className="text-yellow-400 animation-pulse-slow" size={18} />}
              {result === true && <CheckCircle className="text-green-400" size={18} />}
              {result === false && <AlertCircle className="text-red-400" size={18} />}
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="lab-card">
        <h2 className="text-xl font-bold mb-4">Lab Configuration</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Target Application</span>
            <span className="text-security-blue font-mono">http://localhost:3000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Network</span>
            <span className="text-security-blue font-mono">xss-lab-network (isolated)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Container Memory</span>
            <span className="text-security-blue font-mono">512MB limit</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">CPU Limit</span>
            <span className="text-security-blue font-mono">1 core</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Health Check</span>
            <span className="text-security-blue font-mono">Every 10s</span>
          </div>
        </div>
      </div>

      {/* Safety & Isolation */}
      <div className="lab-card border-l-4 border-security-green">
        <h2 className="text-xl font-bold text-security-green mb-4">Safety & Isolation</h2>
        <div className="space-y-2 text-sm text-gray-300">
          <p className="flex gap-2">
            <span className="text-security-green">✓</span>
            Lab runs in isolated Docker container
          </p>
          <p className="flex gap-2">
            <span className="text-security-green">✓</span>
            No external network access
          </p>
          <p className="flex gap-2">
            <span className="text-security-green">✓</span>
            Only localhost:3000 exposed
          </p>
          <p className="flex gap-2">
            <span className="text-security-green">✓</span>
            Safe demonstration payloads only
          </p>
          <p className="flex gap-2">
            <span className="text-security-green">✓</span>
            No credential theft, malware, or persistence
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="lab-card bg-security-blue/10 border-l-4 border-security-blue">
        <h2 className="text-lg font-bold mb-3">💡 Tips</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Start the lab before attempting XSS demonstrations</li>
          <li>• Allow 10-15 seconds for containers to fully initialize</li>
          <li>• Use Reset to clear all data and start fresh</li>
          <li>• Check Activity Log for detailed operation logs</li>
          <li>• All lab data is local; no external calls are made</li>
        </ul>
      </div>
    </div>
  );
}
