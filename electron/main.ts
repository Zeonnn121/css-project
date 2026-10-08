import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { LabController } from './ipc/labController.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let labController;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    icon: join(__dirname, '../assets/icon.png')
  });

  const url = isDev
    ? 'http://localhost:5173'
    : `file://${join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(url);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  labController = new LabController();
  await labController.initialize();
  createWindow();
  setupMenu();
});

app.on('window-all-closed', async () => {
  if (labController) {
    await labController.shutdown();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function setupMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Lab',
      submenu: [
        {
          label: 'Start Lab',
          click: () => ipcMain.emit('lab:start')
        },
        {
          label: 'Stop Lab',
          click: () => ipcMain.emit('lab:stop')
        },
        {
          label: 'Reset Lab',
          click: () => ipcMain.emit('lab:reset')
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// IPC Handlers
ipcMain.handle('lab:start', async () => {
  return labController.startLab();
});

ipcMain.handle('lab:stop', async () => {
  return labController.stopLab();
});

ipcMain.handle('lab:reset', async () => {
  return labController.resetLab();
});

ipcMain.handle('lab:status', async () => {
  return labController.getStatus();
});

ipcMain.handle('lab:health', async () => {
  return labController.checkHealth();
});

ipcMain.handle('lab:getLogs', async () => {
  return labController.getLogs();
});

ipcMain.handle('lab:clearLogs', async () => {
  return labController.clearLogs();
});
