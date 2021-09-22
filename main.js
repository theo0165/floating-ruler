const {app, BrowserWindow, ipcMain, Tray, Menu} = require("electron");

const path = require('path');

let rulerWindow;
let settingsWindow;

let trayIcon;

console.log(path.join(__dirname, 'src/app/ruler/index.html'))

function createRuler(){
    rulerWindow = new BrowserWindow({
        width: 482,
        height: 282,
        transparent: true,
        frame: false,
        resizable: true,
        hasShadow: false,
        maximizable: false,
        minimizable: false,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'src/app/preload.js')
        }
    })

    rulerWindow.loadURL("file://" + path.join(__dirname, 'src/app/ruler/index.html'));
}

function createSettings(){

}

function toggleTheme(){
    
}

function setup(){
    trayIcon = new Tray(path.join(__dirname, "src/static/img/icon_test.png"));

    const trayTemplate = [
        {
            label: "New ruler",
            click: createRuler
        },
        {
            label: "Toggle theme",
            click: toggleTheme
        },
        {
            label: "Settings",
            click: createSettings
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            accelerator: "Command+Q",
            click: () => app.quit()
        }
    ];

    const menu = Menu.buildFromTemplate(trayTemplate);
    trayIcon.setContextMenu(menu)
}

app.whenReady().then(() => {  
    setup();
    //createRuler();
    
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})

ipcMain.on("quit", () => {
    BrowserWindow.getFocusedWindow().close();
})

app.dock.hide();