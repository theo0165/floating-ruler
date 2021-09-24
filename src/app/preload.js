const { contextBridge, ipcRenderer } = require('electron');
const store = require("../store")

ipcRenderer.on("render-update-settings", (event, data) => {
    settings = data;
    document.body.classList = data.theme;
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
        ipcRenderer.on("send-settings", async (e, args) => {
            this.settings = args;
            callback(args)
        })
        
        ipcRenderer.send("get-settings")
    },
    getSetting: (key, callback) => {
        ipcRenderer.on("send-setting", (e, args) => {
            callback(args)
        })

        ipcRenderer.send("get-setting", key)
    },
    saveSettings: (data) => {
        ipcRenderer.send("save-setting", data);
    },
    settings: null
})