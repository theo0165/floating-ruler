const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('preload_complete', true);
contextBridge.exposeInMainWorld('api', {
    quit: () => {
        ipcRenderer.send("quit");
    },
    getVersion: (callback) => {
        ipcRenderer.on("sendVersion", (e, args) => {
            callback(args);
        })
        ipcRenderer.send("getVersion");
    }
})