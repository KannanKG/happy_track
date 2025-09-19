import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig } from '../../types';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;
  saveConfig: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  initialConfig: AppConfig;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  initialConfig,
}) => {
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    try {
      setError(null);
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
      throw err;
    }
  };

  const saveConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      await window.electronAPI.store.set('app-config', config);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save configuration when it changes
  useEffect(() => {
    const autoSave = async () => {
      try {
        await window.electronAPI.store.set('app-config', config);
      } catch (err) {
        console.error('Failed to auto-save configuration:', err);
      }
    };

    // Debounce auto-save to avoid excessive writes
    const timeoutId = setTimeout(autoSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [config]);

  const value: ConfigContextType = {
    config,
    updateConfig,
    saveConfig,
    loading,
    error,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};