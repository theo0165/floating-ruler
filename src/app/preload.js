const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('preload_complete', true);
contextBridge.exposeInMainWorld('api', {
    quit: () => {
        ipcRenderer.send("quit");
    }
})