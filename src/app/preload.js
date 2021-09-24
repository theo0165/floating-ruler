const { contextBridge, ipcRenderer } = require('electron');
const store = require("../store")

ipcRenderer.on("render-update-settings", (event, data) => {
    settings = data;
})

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
    },
    getSettings: (callback) => {
        console.log("Getting setting")
        ipcRenderer.on("send-settings", async (e, args) => {
            console.log("Sending settings to document")
            callback(args)
        })
        
        ipcRenderer.send("get-settings")
    },
    saveSettings: (data) => {
        console.log("IPC RENDER SAVE SETTING", data)
        ipcRenderer.send("save-setting", data);
    }
})