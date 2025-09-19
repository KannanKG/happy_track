import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import Configuration from './components/pages/Configuration';
import Reports from './components/pages/Reports';
import { AppConfig } from '../types';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationContainer } from './components/NotificationToast';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load configuration from electron store
    const loadConfig = async () => {
      try {
        const savedConfig = await window.electronAPI.store.get('app-config');
        if (savedConfig) {
          setConfig(savedConfig);
        } else {
          // Set default configuration
          const defaultConfig: AppConfig = {
            users: [],
            testrail: {
              url: '',
              username: '',
              apiKey: '',
            },
            jira: {
              url: '',
              username: '',
              apiToken: '',
            },
            email: {
              smtpHost: '',
              smtpPort: 587,
              smtpSecure: false,
              smtpUser: '',
              smtpPassword: '',
              username: '',
              password: '',
              fromEmail: '',
              toEmails: [],
              ccEmails: [],
              subject: 'Happy Track Report - {{dateRange}}',
              bodyTemplate: 'Please find the attached activity report for the period {{dateRange}}.',
              body: '',
            },
            theme: 'light',
          };
          setConfig(defaultConfig);
          await window.electronAPI.store.set('app-config', defaultConfig);
        }
      } catch (error) {
        console.error('Failed to load configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    // Handle menu actions from main process
    const handleMenuAction = (action: string) => {
      switch (action) {
        case 'preferences':
          // Navigate to configuration
          window.location.hash = '/configuration';
          break;
        case 'new-report':
          // Navigate to reports
          window.location.hash = '/reports';
          break;
        default:
          break;
      }
    };

    window.electronAPI.onMenuAction(handleMenuAction);

    return () => {
      // Cleanup listeners if needed
    };
  }, []);

  if (loading) {
    return (
      <div className="alexa-loading-screen">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="alexa-body alexa-loading-text">Loading Happy Track...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="alexa-loading-screen">
        <div className="text-center">
          <p className="alexa-body alexa-error-text">Failed to load configuration</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <ConfigProvider initialConfig={config}>
        <NotificationProvider>
          <Router>
            <div className="alexa-main-layout">
              <Sidebar />
              <div className="alexa-content">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/configuration" element={<Configuration />} />
                  <Route path="/reports" element={<Reports />} />
                  {/* Catch all route to redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </Router>
          <NotificationContainer />
        </NotificationProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;