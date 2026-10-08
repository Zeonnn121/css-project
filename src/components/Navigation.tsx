import React from 'react';
import { useLabStore } from '../store/labStore';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const { currentTab, setTab } = useLabStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'theory', label: 'Theory' },
    { id: 'setup', label: 'Lab Setup' },
    { id: 'simulation', label: 'XSS Simulation' },
    { id: 'comparison', label: 'Vulnerable vs Secure' },
    { id: 'logs', label: 'Activity Log' },
    { id: 'assessment', label: 'Assessment' },
    { id: 'references', label: 'References' },
    { id: 'feedback', label: 'Feedback' },
  ];

  // Clearly separated intentional-vulnerability educational demos
  const demoTabs = [
    { id: 'demo-reflected', label: 'Reflected XSS' },
    { id: 'demo-stored', label: 'Stored XSS' },
  ];

  return (
    <>
      <button
        className="md:hidden p-4 text-gray-400 hover:text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`
        fixed md:static left-0 top-0 h-screen md:h-auto w-64 md:w-48
        bg-dark-800 border-r border-dark-700 p-4 overflow-y-auto
        ${mobileOpen ? 'block' : 'hidden md:block'}
        z-50 md:z-0
      `}>
        <h2 className="text-lg font-bold text-security-blue mb-6">XSS Lab</h2>
        <div className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setTab(tab.id);
                setMobileOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 rounded-lg transition-colors text-sm
                ${currentTab === tab.id
                  ? 'bg-security-blue text-white'
                  : 'text-gray-300 hover:bg-dark-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Intentionally Vulnerable Demos ── */}
        <div className="mt-6">
          <div className="flex items-center gap-1 mb-2 px-1">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wide">⚠ Demos</span>
          </div>
          <div className="bg-red-900/10 border border-red-900/40 rounded-lg p-1 space-y-1">
            {demoTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setTab(tab.id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 rounded transition-colors text-sm
                  ${currentTab === tab.id
                    ? 'bg-red-700 text-white'
                    : 'text-red-300 hover:bg-red-900/30'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
