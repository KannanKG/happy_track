// Global type declarations for Electron API
declare global {
  interface Window {
    electronAPI: {
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
      };
      onMenuAction: (callback: (action: string) => void) => void;
    };
  }
}

export {};