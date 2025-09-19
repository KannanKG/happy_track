const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => process.env.npm_package_version || '1.0.0',
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development'
});