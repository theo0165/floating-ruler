const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('preload_complete', true);