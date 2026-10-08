import { create } from 'zustand';

interface LabState {
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'resetting' | 'error';
  targetUrl: string;
  logs: Array<{ timestamp: string; level: string; message: string }>;
  currentTab: string;
  mode: 'vulnerable' | 'secure';
  demonstrationResult: any | null;
  quizScore: number | null;

  setStatus: (status: string) => void;
  addLog: (log: any) => void;
  clearLogs: () => void;
  setTab: (tab: string) => void;
  setMode: (mode: 'vulnerable' | 'secure') => void;
  setDemonstrationResult: (result: any) => void;
  setQuizScore: (score: number) => void;
}

export const useLabStore = create<LabState>((set) => ({
  status: 'stopped',
  targetUrl: 'http://localhost:3000',
  logs: [],
  currentTab: 'overview',
  mode: 'vulnerable',
  demonstrationResult: null,
  quizScore: null,

  setStatus: (status) => set({ status: status as any }),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
  clearLogs: () => set({ logs: [] }),
  setTab: (tab) => set({ currentTab: tab }),
  setMode: (mode) => set({ mode }),
  setDemonstrationResult: (result) => set({ demonstrationResult: result }),
  setQuizScore: (score) => set({ quizScore: score }),
}));
