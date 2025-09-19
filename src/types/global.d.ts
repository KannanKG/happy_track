// Global type declarations for Electron API
declare global {
  interface Window {
    electronAPI: {
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: unknown) => Promise<void>;
        delete: (key: string) => Promise<void>;
        clear: () => Promise<void>;
      };
      onMenuAction?: (callback: (action: string) => void) => void;
    };
  }
}

export {};