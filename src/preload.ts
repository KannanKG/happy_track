import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Store operations
  store: {
    get: (key: string) => ipcRenderer.invoke('store-get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear'),
  },

  // Menu events
  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-new-report', () => callback('new-report'));
    ipcRenderer.on('menu-export-report', () => callback('export-report'));
    ipcRenderer.on('menu-preferences', () => callback('preferences'));
    ipcRenderer.on('menu-testrail-settings', () => callback('testrail-settings'));
    ipcRenderer.on('menu-jira-settings', () => callback('jira-settings'));
    ipcRenderer.on('menu-email-settings', () => callback('email-settings'));
    ipcRenderer.on('menu-about', () => callback('about'));
  },

  // Remove menu listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // Platform info
  platform: process.platform,
});