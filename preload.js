const { contextBridge, ipcRenderer } = require('electron');

// Expose limited methods to the renderer process
contextBridge.exposeInMainWorld(
  'electron', {
    ipcRenderer: {
      send: (channel, ...args) => {
        ipcRenderer.send(channel, ...args);
      },
      on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      },
      invoke: (channel, ...args) => {
        return ipcRenderer.invoke(channel, ...args);
      }
    }
  }
); 