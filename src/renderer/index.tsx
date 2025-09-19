import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/output.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<App />);

// Enable Hot Module Replacement for development
declare const module: any;
if (module.hot) {
  module.hot.accept('./App', () => {
    // Re-render the app when App component changes
    const NextApp = require('./App').default;
    root.render(<NextApp />);
  });
  
  // Accept CSS changes for hot reload
  module.hot.accept('./styles/output.css', () => {
    // CSS changes will be handled automatically by style-loader
    console.log('CSS updated via HMR');
  });
}