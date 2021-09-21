const {app, BrowserWindow} = require("electron");

const path = require('path');

let rulerWindow;
let settingsWindow;

console.log(path.join(__dirname, 'src/app/ruler/index.html'))

function createRuler(){
    rulerWindow = new BrowserWindow({
        width: 500,
        height: 300,
        transparent: true,
        frame: false,
        resizable: true,
        hasShadow: false,
        maximizable: false,
        minimizable: false,
        alwaysOnTop: true
    })

    rulerWindow.loadURL("file://" + path.join(__dirname, 'src/app/ruler/index.html'));
}

function createSettings(){

}

app.whenReady().then(() => {  
    createRuler();
    
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})