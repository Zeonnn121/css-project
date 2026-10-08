import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('labAPI', {
  // Lab control
  startLab: () => ipcRenderer.invoke('lab:start'),
  stopLab: () => ipcRenderer.invoke('lab:stop'),
  resetLab: () => ipcRenderer.invoke('lab:reset'),

  // Lab state
  getStatus: () => ipcRenderer.invoke('lab:status'),
  checkHealth: () => ipcRenderer.invoke('lab:health'),

  // Activity logs
  getLogs: () => ipcRenderer.invoke('lab:getLogs'),
  clearLogs: () => ipcRenderer.invoke('lab:clearLogs'),

  // Subscribe to status updates
  onStatusChange: (callback) =>
    ipcRenderer.on('lab:statusChanged', (event, status) => callback(status)),

  onLogUpdate: (callback) =>
    ipcRenderer.on('lab:logUpdated', (event, log) => callback(log))
});
