const {app, BrowserWindow, ipcMain, Tray, Menu} = require("electron");
const path = require('path');
const store = require('./src/store');

let rulerWindows = [];
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

    rulerWindow.loadURL("file://" + path.join(__dirname, 'src/app/ruler/ruler.html'));

    console.log(process.env)
    if(process.env.DEVELOPMENT == 'true'){
        rulerWindow.webContents.openDevTools();
    }

    rulerWindows.push(rulerWindow);
}

function createSettings(){
    settingsWindow = new BrowserWindow({
        width: 200,
        height: 150,
        resizable: false,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'src/app/preload.js')
        }
    })

    if(process.env.DEVELOPMENT == 'true'){
        settingsWindow.webContents.openDevTools({
            mode: "detach"
        });
    }
    settingsWindow.loadURL("file://" + path.join(__dirname, 'src/app/settings/settings.html'));
}

function toggleTheme(){
    if(store.getData("theme") == "dark"){
        store.setData("theme", "light");
    }else{
        store.setData("theme", "dark");
    }

    updateSettings();
}

async function updateSettings(){
    let newSettings = {
        autostart: await store.getData("autostart"),
        theme: await store.getData("theme"),
        units: await store.getData("units")
    }

    for(i=0; i<rulerWindows.length; i++){
        rulerWindows[i].webContents.send("render-update-settings", newSettings)
    }
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
    trayIcon.setContextMenu(menu);
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

ipcMain.on("getVersion", (event, arg) => {
    event.reply("sendVersion", app.getVersion());
})

ipcMain.on("save-setting", (event, arg) => {
    store.setData(arg);
    updateSettings();
})

ipcMain.on("get-settings", async (event) => {
    let settings = {
        autostart: await store.getData("autostart"),
        theme: await store.getData("theme")
    }

    event.reply("send-settings", settings)
})

ipcMain.on("get-setting", async (event, key) => {
    event.reply('send-setting', await store.getData(key));
})

app.dock.hide();