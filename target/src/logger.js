const logs = [];

export const logger = {
  log(level, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    logs.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`);
  },

  getLogs() {
    return logs;
  },

  clear() {
    logs.length = 0;
  }
};
