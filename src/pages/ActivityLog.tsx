import React, { useState } from 'react';
import { useLabStore } from '../store/labStore';
import { RotateCcw, Download } from 'lucide-react';

export default function ActivityLog() {
  const { logs, clearLogs } = useLabStore();
  const [filter, setFilter] = useState('All');

  const filteredLogs = logs.filter(log => {
    if (filter === 'All') return true;
    return log.level.toLowerCase() === filter.toLowerCase();
  });

  const downloadLogs = () => {
    const csv = logs.map(log =>
      `"${log.timestamp}","${log.level}","${log.message}"`
    ).join('\n');

    const blob = new Blob(['timestamp,level,message\n' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xss-lab-logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-white">Activity Log</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {['All', 'Info', 'Success', 'Warning', 'Error'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === f
                  ? 'bg-security-blue text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={downloadLogs}
            className="lab-btn-primary flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={() => clearLogs()}
            className="lab-btn-danger flex items-center gap-2 text-sm"
          >
            <RotateCcw size={16} />
            Clear Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: logs.length },
          { label: 'Info', value: logs.filter(l => l.level === 'info').length },
          { label: 'Success', value: logs.filter(l => l.level === 'success').length },
          { label: 'Warning', value: logs.filter(l => l.level === 'warning').length },
          { label: 'Error', value: logs.filter(l => l.level === 'error').length },
        ].map(stat => (
          <div key={stat.label} className="lab-card text-center">
            <div className="text-2xl font-bold text-security-blue">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Log Entries */}
      <div className="lab-card">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No logs to display</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex gap-3 p-3 rounded text-sm border-l-4 ${
                  log.level === 'success'
                    ? 'bg-green-900/10 border-green-700 text-green-300'
                    : log.level === 'error'
                    ? 'bg-red-900/10 border-red-700 text-red-300'
                    : log.level === 'warning'
                    ? 'bg-yellow-900/10 border-yellow-700 text-yellow-300'
                    : 'bg-blue-900/10 border-blue-700 text-blue-300'
                }`}
              >
                <div className="text-xs text-gray-500 font-mono w-20 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex-1">
                  <span className="font-bold uppercase text-xs mr-2">
                    [{log.level}]
                  </span>
                  <span>{log.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="lab-card">
        <h3 className="font-bold mb-2">About Logs</h3>
        <p className="text-sm text-gray-300">
          All lab activities are logged for educational reference. Logs include lab startup/shutdown,
          demonstrations run, and system events. No personal data is collected or stored externally.
        </p>
      </div>
    </div>
  );
}
