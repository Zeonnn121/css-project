import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { BrowserWindow } from 'electron';

const execAsync = promisify(exec);

export class LabController {
  constructor() {
    this.status = 'stopped';
    this.logs = [];
    this.targetUrl = 'http://localhost:3000';
    this.healthCheckInterval = null;
  }

  async initialize() {
    this.log('info', 'Lab controller initializing');
  }

  async startLab() {
    try {
      this.status = 'starting';
      this.broadcastStatus();
      this.log('info', 'Starting Docker containers...');

      // Build and start containers
      await execAsync('docker-compose up -d', { cwd: process.cwd() });

      // Wait for health check
      await this.waitForHealth(30000);

      this.status = 'running';
      this.log('success', 'Lab started successfully');
      this.broadcastStatus();

      // Start periodic health checks
      this.startHealthChecks();

      return { success: true, message: 'Lab started' };
    } catch (err) {
      this.status = 'error';
      this.log('error', `Failed to start lab: ${err.message}`);
      this.broadcastStatus();
      return { success: false, error: err.message };
    }
  }

  async stopLab() {
    try {
      this.status = 'stopping';
      this.broadcastStatus();
      this.log('info', 'Stopping Docker containers...');

      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }

      await execAsync('docker-compose down', { cwd: process.cwd() });

      this.status = 'stopped';
      this.log('success', 'Lab stopped');
      this.broadcastStatus();

      return { success: true, message: 'Lab stopped' };
    } catch (err) {
      this.status = 'error';
      this.log('error', `Failed to stop lab: ${err.message}`);
      this.broadcastStatus();
      return { success: false, error: err.message };
    }
  }

  async resetLab() {
    try {
      this.status = 'resetting';
      this.broadcastStatus();
      this.log('info', 'Resetting lab...');

      // Stop
      await this.stopLab();

      // Remove volumes/data
      await execAsync('docker-compose down -v', { cwd: process.cwd() });

      // Clear logs
      this.logs = [];

      this.log('info', 'Lab reset complete');

      return { success: true, message: 'Lab reset' };
    } catch (err) {
      this.status = 'error';
      this.log('error', `Failed to reset lab: ${err.message}`);
      this.broadcastStatus();
      return { success: false, error: err.message };
    }
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.targetUrl}/api/health`, {
        timeout: 3000
      });
      return { healthy: true, status: response.data };
    } catch (err) {
      return { healthy: false, error: err.message };
    }
  }

  async waitForHealth(timeout) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const health = await this.checkHealth();
      if (health.healthy) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error('Health check timeout');
  }

  startHealthChecks() {
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.checkHealth();
      if (!health.healthy && this.status === 'running') {
        this.status = 'error';
        this.log('error', 'Lab health check failed');
        this.broadcastStatus();
      }
    }, 5000);
  }

  getStatus() {
    return {
      status: this.status,
      targetUrl: this.targetUrl,
      timestamp: new Date().toISOString()
    };
  }

  async getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    this.log('info', 'Activity logs cleared');
    return { success: true };
  }

  log(level, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    this.logs.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`);

    // Broadcast to renderer
    this.broadcastLog(entry);
  }

  broadcastStatus() {
    const windows = require('electron').BrowserWindow.getAllWindows();
    windows.forEach(window => {
      window.webContents.send('lab:statusChanged', this.getStatus());
    });
  }

  broadcastLog(entry) {
    const windows = require('electron').BrowserWindow.getAllWindows();
    windows.forEach(window => {
      window.webContents.send('lab:logUpdated', entry);
    });
  }

  async shutdown() {
    if (this.status === 'running') {
      await this.stopLab();
    }
  }
}
