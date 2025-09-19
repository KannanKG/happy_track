/**
 * Happy Track - Main Electron Process
 * 
 * This file serves as the entry point for the Electron main process, which is responsible for:
 * - Application lifecycle management (startup, shutdown, window management)
 * - Native OS integration (menus, notifications, file system access)
 * - Security boundary between the web content and Node.js APIs
 * - IPC (Inter-Process Communication) handling between main and renderer processes
 * - Persistent configuration storage using electron-store
 * 
 * Architecture:
 * Main Process (Node.js) ←→ IPC ←→ Renderer Process (Chromium/React)
 *                          ↑
 *                    Preload Script (Security Bridge)
 * 
 * @author Happy Track Contributors
 * @since 1.0.0
 */

import { app, BrowserWindow, Menu, ipcMain, shell } from 'electron';
import * as path from 'path';
import Store from 'electron-store';

// Webpack constants injected by electron-forge during development
// These are undefined in production builds
declare const MAIN_WINDOW_WEBPACK_ENTRY: string | undefined;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string | undefined;

/**
 * Initialize electron-store for persistent configuration storage
 * Data is stored in OS-specific user data directory:
 * - macOS: ~/Library/Application Support/Happy Track/config.json
 * - Windows: %APPDATA%/Happy Track/config.json
 * - Linux: ~/.config/Happy Track/config.json
 */
const store = new Store();

/**
 * Global reference to the main window
 * Prevents garbage collection and enables window management across the app
 */
let mainWindow: BrowserWindow | null = null;

/**
 * Determines if the application is running in development mode
 * Used to conditionally load development resources and enable debugging
 */
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

/**
 * Creates and configures the main application window
 * 
 * This function:
 * - Determines correct file paths for development vs production
 * - Configures window properties and security settings
 * - Sets up the preload script for secure IPC communication
 * - Handles window events and lifecycle
 * 
 * Security considerations:
 * - nodeIntegration: false - Prevents Node.js access from renderer
 * - contextIsolation: true - Isolates the main world from isolated world
 * - preload script - Provides controlled API access to renderer
 */
function createMainWindow(): void {
  // Determine file paths based on build environment
  let preloadPath: string;
  let rendererPath: string;
  
  if (isDev && typeof MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY !== 'undefined' && typeof MAIN_WINDOW_WEBPACK_ENTRY !== 'undefined') {
    // Development mode: Use webpack-served files with hot reload
    preloadPath = MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY;
    rendererPath = MAIN_WINDOW_WEBPACK_ENTRY;
  } else {
    // Production mode: Use compiled files from build output
    preloadPath = path.join(__dirname, 'preload.js');
    rendererPath = path.join(__dirname, 'renderer', 'index.html');
  }

  // Create the main browser window with security-first configuration
  mainWindow = new BrowserWindow({
    // Window dimensions and constraints
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    
    // Security configuration
    webPreferences: {
      nodeIntegration: false,        // Disable Node.js in renderer for security
      contextIsolation: true,        // Enable context isolation for security
      preload: preloadPath,          // Load preload script for secure IPC bridge
    },
    
    // Window styling and behavior
    titleBarStyle: process.platform === 'darwin' ? 'default' : 'default',
    show: false,                     // Hide until ready to prevent flash of unstyled content
    frame: true,                     // Show native window frame
    title: 'Happy Track',            // Default window title
    
    // Application icon (platform-specific paths)
    icon: isDev 
      ? path.join(__dirname, '../assets/icon.png')          // Development: relative to src
      : path.join(process.resourcesPath, 'assets/icon.png'), // Production: in app bundle
    
    // Window behavior configuration
    resizable: true,                 // Allow window resizing
    maximizable: true,               // Allow window maximization
    minimizable: true,               // Allow window minimization
    closable: true,                  // Allow window closing
  });

  // Load the renderer content based on environment
  if (isDev && rendererPath.startsWith('http')) {
    // Development: Load from webpack dev server (supports hot reload)
    mainWindow.loadURL(rendererPath);
  } else {
    // Production: Load from file system
    mainWindow.loadFile(rendererPath);
  }

  /**
   * Show window only when fully loaded to prevent FOUC (Flash of Unstyled Content)
   * This ensures a smooth user experience during app startup
   */
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    
    // Optional: Focus the window on startup
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.focus();
    }
  });

  /**
   * Window lifecycle event handlers
   * These handlers manage window state and cleanup resources when needed
   */
  
  // Clean up window reference when closed to prevent memory leaks
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  /**
   * Security: Handle external link clicks
   * Prevents the app from navigating to external URLs within the Electron window
   * Instead, opens links in the user's default browser
   */
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };  // Deny opening in the Electron window
  });

  // Optional: Open DevTools in development mode
  if (isDev) {
    // mainWindow.webContents.openDevTools();
  }
}

/**
 * Application Lifecycle Event Handlers
 * These events handle the overall application state and multi-window behavior
 */

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createMainWindow();
  
  // Set up the native application menu
  createApplicationMenu();

  /**
   * macOS specific behavior: Re-create window when dock icon is clicked
   * On macOS, apps typically stay open even when all windows are closed
   */
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

/**
 * Cross-platform window management
 * On Windows/Linux: Quit app when all windows are closed
 * On macOS: Keep app running (standard macOS behavior)
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * IPC (Inter-Process Communication) Handlers
 * These handlers provide secure communication between main and renderer processes
 * All data storage operations go through these handlers for security
 */

/**
 * Retrieves a value from the persistent store
 * @param key - The configuration key to retrieve
 * @returns The stored value or undefined if key doesn't exist
 */
ipcMain.handle('store-get', async (event, key: string) => {
  try {
    return store.get(key);
  } catch (error) {
    console.error('Failed to get store value:', error);
    return undefined;
  }
});

/**
 * Stores a value in the persistent store
 * @param key - The configuration key to set
 * @param value - The value to store (will be serialized to JSON)
 * @returns Success status
 */
ipcMain.handle('store-set', async (event, key: string, value: any) => {
  try {
    store.set(key, value);
    return true;
  } catch (error) {
    console.error('Failed to set store value:', error);
    return false;
  }
});

/**
 * Deletes a key from the persistent store
 * @param key - The configuration key to delete
 * @returns Success status
 */
ipcMain.handle('store-delete', async (event, key: string) => {
  try {
    store.delete(key);
    return true;
  } catch (error) {
    console.error('Failed to delete store value:', error);
    return false;
  }
});

/**
 * Clears all data from the persistent store
 * Use with caution - this will remove all user configuration
 * @returns Success status
 */
ipcMain.handle('store-clear', async () => {
  try {
    store.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear store:', error);
    return false;
  }
});

/**
 * Native Application Menu Configuration
 * Creates platform-appropriate menu structure with keyboard shortcuts
 * and common application actions
 */
function createApplicationMenu(): void {
  /**
   * Define menu template with platform-specific conventions
   * This creates a native menu that integrates with the OS menu system
   */
  const template: Electron.MenuItemConstructorOptions[] = [
    // File Menu - Document and application actions
    {
      label: 'File',
      submenu: [
        {
          label: 'New Report',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // Send IPC message to renderer to navigate to reports page
            mainWindow?.webContents.send('menu-new-report');
          },
        },
        {
          label: 'Export Report',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            // Trigger export functionality in renderer
            mainWindow?.webContents.send('menu-export-report');
          },
        },
        { type: 'separator' },
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',  // Standard preferences shortcut
          click: () => {
            // Navigate to configuration page
            mainWindow?.webContents.send('menu-preferences');
          },
        },
        { type: 'separator' },
        {
          role: 'quit',  // Standard quit functionality
        },
      ],
    },
    
    // Edit Menu - Standard editing actions
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },         // Ctrl/Cmd+Z
        { role: 'redo' },         // Ctrl/Cmd+Y
        { type: 'separator' },
        { role: 'cut' },          // Ctrl/Cmd+X
        { role: 'copy' },         // Ctrl/Cmd+C
        { role: 'paste' },        // Ctrl/Cmd+V
        { role: 'selectAll' },    // Ctrl/Cmd+A
      ],
    },
    
    // View Menu - Display and developer options
    {
      label: 'View',
      submenu: [
        { role: 'reload' },         // Ctrl/Cmd+R - Reload page
        { role: 'forceReload' },    // Ctrl/Cmd+Shift+R - Force reload
        { role: 'toggleDevTools' }, // F12 - Developer tools
        { type: 'separator' },
        { role: 'resetZoom' },      // Ctrl/Cmd+0 - Reset zoom
        { role: 'zoomIn' },         // Ctrl/Cmd++ - Zoom in
        { role: 'zoomOut' },        // Ctrl/Cmd+- - Zoom out
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'TestRail Settings',
          click: () => {
            mainWindow?.webContents.send('menu-testrail-settings');
          },
        },
        {
          label: 'Jira Settings',
          click: () => {
            mainWindow?.webContents.send('menu-jira-settings');
          },
        },
        { role: 'togglefullscreen' },  // F11 - Toggle fullscreen
      ],
    },
    
    // Window Menu - Window management (automatically handled by Electron on macOS)
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },        // Minimize window
        { role: 'close' },          // Close window
      ],
    },
    
    // Tools Menu - Application-specific functionality
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Test TestRail Connection',
          click: () => {
            mainWindow?.webContents.send('menu-test-testrail');
          },
        },
        {
          label: 'Test Jira Connection',
          click: () => {
            mainWindow?.webContents.send('menu-test-jira');
          },
        },
        { type: 'separator' },
        {
          label: 'Email Settings',
          click: () => {
            mainWindow?.webContents.send('menu-email-settings');
          },
        },
      ],
    },
    
    // Help Menu - Documentation and support
    {
      role: 'help',
      submenu: [
        {
          label: 'About Happy Track',
          click: () => {
            mainWindow?.webContents.send('menu-about');
          },
        },
        {
          label: 'Documentation',
          click: () => {
            // Open documentation in external browser
            shell.openExternal('https://github.com/KannanKG/happy_track#readme');
          },
        },
        {
          label: 'Report Issue',
          click: () => {
            // Open GitHub issues page
            shell.openExternal('https://github.com/KannanKG/happy_track/issues');
          },
        },
      ],
    },
  ];

  // Build and set the native menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Protocol Registration and Security Configuration
 * These settings enhance security and enable deep linking capabilities
 */

// Register custom protocol for deep linking (e.g., happy-track://report/123)
app.setAsDefaultProtocolClient('happy-track');

/**
 * Global security enforcement
 * Prevents any web content from opening new windows within the Electron app
 * All external links are opened in the user's default browser
 */
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Always open external URLs in the default browser
    shell.openExternal(url);
    return { action: 'deny' };  // Deny opening within Electron
  });
});