import React, { useEffect } from 'react';
import { useLabStore } from './store/labStore';
import Navigation from './components/Navigation';
import Overview from './pages/Overview';
import Theory from './pages/Theory';
import LabSetup from './pages/LabSetup';
import XSSSimulation from './pages/XSSSimulation';
import Comparison from './pages/Comparison';
import ActivityLog from './pages/ActivityLog';
import Assessment from './pages/Assessment';
import References from './pages/References';
import Feedback from './pages/Feedback';
import ReflectedXSSDemo from './pages/ReflectedXSSDemo';
import StoredXSSDemo from './pages/StoredXSSDemo';
import TopBar from './components/TopBar';

export default function App() {
  const { currentTab } = useLabStore();

  useEffect(() => {
    // Initialize IPC listeners if in Electron
    if (window.labAPI) {
      window.labAPI.onStatusChange((status: any) => {
        useLabStore.setState({ status: status.status });
      });

      window.labAPI.onLogUpdate((log: any) => {
        useLabStore.getState().addLog(log);
      });
    }
  }, []);

  const renderPage = () => {
    switch (currentTab) {
      case 'overview':
        return <Overview />;
      case 'theory':
        return <Theory />;
      case 'setup':
        return <LabSetup />;
      case 'simulation':
        return <XSSSimulation />;
      case 'comparison':
        return <Comparison />;
      case 'logs':
        return <ActivityLog />;
      case 'assessment':
        return <Assessment />;
      case 'references':
        return <References />;
      case 'feedback':
        return <Feedback />;
      case 'demo-reflected':
        return <ReflectedXSSDemo />;
      case 'demo-stored':
        return <StoredXSSDemo />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <TopBar />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
