/**
 * This file is a preloaded into renderer's (ruler window and settings window).
 * Exposes ipc api to renderer without exposing node js.
 * 
 * @see https://stackoverflow.com/questions/57807459/how-to-use-preload-js-properly-in-electron
 */

const { contextBridge, ipcRenderer } = require('electron');
const store = require("../store")

// Update settings object and current theme in renderer.
// Event sent from main.js
ipcRenderer.on("render-update-settings", (event, data) => {
    settings = data;
    document.body.classList = data.theme;
})

// Expose two objects to renderer.
// Preload complete for debugging.
// 'API' for ipc api to send events between app and renderer
contextBridge.exposeInMainWorld('preload_complete', true);
contextBridge.exposeInMainWorld('api', {
    /**
     * Send event to main to quit current window.
     */
    quit: () => {
        ipcRenderer.send("quit");
    },

    /**
     * Get current app version declared in package.json
     * @param {function} callback Callback function to use version gathered from app
     */
    getVersion: (callback) => {
        ipcRenderer.on("sendVersion", (e, args) => {
            callback(args);
        })
        ipcRenderer.send("getVersion");
    },

    /**
     * Get all settings from store
     * @param {function} callback Callback function to use gathered data
     */
    getSettings: (callback) => {
        ipcRenderer.on("send-settings", async (e, args) => {
            this.settings = args;
            callback(args)
        })
        
        ipcRenderer.send("get-settings")
    },

    /**
     * Get one settings item from store
     * @param {string} key What setting to get
     * @param {function} callback Callback funtion to use settings data
     */
    getSetting: (key, callback) => {
        ipcRenderer.on("send-setting", (e, args) => {
            callback(args)
        })

        ipcRenderer.send("get-setting", key)
    },

    /**
     * Save settings to store
     * @param {object} data Settings to save
     */
    saveSettings: (data) => {
        ipcRenderer.send("save-setting", data);
    },

    // Settings set later in renderer
    settings: null
})