const { app, BrowserWindow, screen, ipcMain, systemPreferences, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const dotenv = require('dotenv');
dotenv.config();

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Create a window that's always on top
  mainWindow = new BrowserWindow({
    width: 100,
    height: 70, // Increased height to accommodate status message
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

// Request screen capture permissions on macOS
app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    // Request screen recording permission
    systemPreferences.getMediaAccessStatus('screen');
  }
  createWindow();
  
  // Add IPC handlers
  ipcMain.on('resize-window', (event, width, height) => {
    if (mainWindow) {
      mainWindow.setSize(width, height);
    }
  });
  
  // Handle taking a screenshot
  ipcMain.handle('take-screenshot', async () => {
    try {
      // Remember window position so we can restore it
      const windowBounds = mainWindow.getBounds();
      const wasVisible = mainWindow.isVisible();
      
      // First, move window off-screen before hiding it
      // This ensures it won't appear in the screenshot even if 
      // the hide operation takes time to complete
      mainWindow.setBounds({ x: -10000, y: -10000, width: 1, height: 1 });
      
      // Then hide the window 
      mainWindow.hide();
      
      // Wait longer for the window to completely hide and screen to refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the screen
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });
      
      // Restore the window to its original size and position
      if (wasVisible) {
        mainWindow.setBounds(windowBounds);
        mainWindow.show();
        mainWindow.moveTop();
      }
      
      if (!sources || sources.length === 0) {
        throw new Error('No screen source found');
      }
      
      // Get the first screen
      const mainSource = sources[0];
      const screenshot = mainSource.thumbnail.toDataURL();
      
      // Get base64 data
      const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Create file path in user's pictures directory
      const userHome = os.homedir();
      const picturesDir = path.join(userHome, 'Pictures', 'ScreenshotApp');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(picturesDir)) {
        fs.mkdirSync(picturesDir, { recursive: true });
      }
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
      const filePath = path.join(picturesDir, `screenshot-${timestamp}.png`);
      
      // Save the file
      fs.writeFileSync(filePath, buffer);
      
      return { 
        success: true, 
        filePath,
        base64Data // Add base64 data to the response
      };
    } catch (error) {
      console.error('Error taking screenshot:', error);
      return { success: false, error: error.message };
    }
  });

  // Add this new IPC handler
  ipcMain.handle('analyze-image', async (event, base64Image) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "What is in this image? Provide a brief analysis."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing image:', error);
      return 'Error analyzing image: ' + error.message;
    }
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