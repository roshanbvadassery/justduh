const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let clickCount = 0;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Create a window that's always on top
  mainWindow = new BrowserWindow({
    width: 220,
    height: 200,
    frame: false,  // Remove window frame
    transparent: true,  // Make window transparent
    alwaysOnTop: true,  // Keep window on top
    skipTaskbar: true,  // Don't show in taskbar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    // Extreme z-index for Windows
    type: 'toolbar',  // Use toolbar type which has high z-index
  });

  // Load the HTML file
  mainWindow.loadFile('index.html');
  
  // Remove the menu bar
  mainWindow.setMenuBarVisibility(false);
  
  // Allow the window to be dragged
  mainWindow.setMovable(true);
  
  // Most aggressive settings for staying on top
  if (process.platform === 'darwin') {
    // For macOS, try the floating level which is very high
    mainWindow.setAlwaysOnTop(true, 'floating', 1);
  } else {
    // For Windows, try pop-up-menu which is very high in z-order
    mainWindow.setAlwaysOnTop(true, 'pop-up-menu');
  }
  
  // Force the window to the foreground
  mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
  mainWindow.moveTop();
  
  // Make sure it stays on top even after focus changes
  mainWindow.on('blur', () => {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.moveTop();
  });
  
  // Add a recurring check to ensure it stays on top
  setInterval(() => {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.moveTop();
  }, 1000); // Check every second
}

app.whenReady().then(() => {
  createWindow();
  
  // Handle the duh button click
  ipcMain.handle('duh-clicked', () => {
    clickCount++;
    console.log(`Duh button clicked! Count: ${clickCount}`);
    return clickCount;
  });
  
  // Handle the reset counter request
  ipcMain.handle('reset-counter', () => {
    clickCount = 0;
    console.log('Counter reset to 0');
    return clickCount;
  });
  
  // Handle the close app request (ESC + duh)
  ipcMain.handle('close-app', () => {
    console.log('Close app requested - quitting');
    app.quit();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 