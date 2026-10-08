import React, { useEffect, useState } from 'react';
import { useLabStore } from '../store/labStore';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function TopBar() {
  const { status, targetUrl } = useLabStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusConfig = {
    running: { color: 'bg-green-900/30 text-green-400', icon: CheckCircle, label: 'Running' },
    stopped: { color: 'bg-gray-900/30 text-gray-400', icon: Clock, label: 'Stopped' },
    error: { color: 'bg-red-900/30 text-red-400', icon: AlertCircle, label: 'Error' },
    starting: { color: 'bg-yellow-900/30 text-yellow-400', icon: Clock, label: 'Starting' },
    stopping: { color: 'bg-yellow-900/30 text-yellow-400', icon: Clock, label: 'Stopping' },
    resetting: { color: 'bg-yellow-900/30 text-yellow-400', icon: Clock, label: 'Resetting' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.stopped;
  const StatusIcon = config.icon;

  return (
    <div className="bg-dark-800 border-b border-dark-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">XSS Virtual Lab</h1>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>

          <div className={`status-indicator ${config.color} border border-current`}>
            <StatusIcon size={16} />
            <span>{config.label}</span>
          </div>

          {status === 'running' && (
            <div className="text-xs text-gray-400">
              Target: <span className="text-gray-300 font-mono">{targetUrl}</span>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-400">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
