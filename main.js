const {app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, nativeTheme} = require("electron");
const path = require("path");
const store = require("./src/store");

let rulerWindows = [];
let settingsWindow;

let trayIcon;

const instanceLock = app.requestSingleInstanceLock();

if(!instanceLock) {
    app.quit();
} else {
    // NOTE(patrik): If we are the main process with the instance lock
    // then we can get notifyed when other instances trys to open
    // app.on('second-instance', (event, cmdLine, cwd) => {});
}

// console.log(path.join(__dirname, "src/app/ruler/index.html"));

/**
 * Create new ruler window and add to list of open ruler windows
 *
 * @requires electron/BrowserWindow
 * @requires path
 */
function createRuler() {
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
      preload: path.join(__dirname, "src/app/preload.js"),
      nativeWindowOpen: true,
    },
  });

  rulerWindow.loadURL(
    "file://" + path.join(__dirname, "src/app/ruler/ruler.html")
  );

  // Open devtool if debug script is run or environment variable DEVELOPMENT is true
  if (process.env.DEVELOPMENT == "true") {
    rulerWindow.webContents.openDevTools();
  }

  // Add newly created ruler window to list of windows to be able to push events to all instances
  rulerWindows.push(rulerWindow);
}

/**
 * Create settings window
 *
 * @requires electron/BrowserWindow
 * @requires path
 */
function createSettings() {
  settingsWindow = new BrowserWindow({
    width: 200,
    height: 150,
    resizable: false, // Kepp settings window specified size to avoid sizing issues.
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, "src/app/preload.js"),
      nativeWindowOpen: true,
    },
  });

  // Open devtool if debug script is run or environment variable DEVELOPMENT is true
  // Opens as detatched by default becuase of small window size
  if (process.env.DEVELOPMENT == "true") {
    settingsWindow.webContents.openDevTools({
      mode: "detach",
    });
  }

  settingsWindow.loadURL(
    "file://" + path.join(__dirname, "src/app/settings/settings.html")
  );
}

/**
 * Toggle theme in settings. Calls to update settings on all open ruler windows
 */
function toggleTheme() {
    const oppositeTheme = store.getData("theme") == "dark"
                                                    ? 'light'
                                                    : 'dark';
    store.setData('theme', oppositeTheme);
    updateSettings();
}

/**
 * Update settings for all open ruler windows
 *
 * @async
 * @requires store
 */
async function updateSettings() {
    let newSettings = {
        autostart: await store.getData("autostart"),
        theme: await store.getData("theme"),
        units: await store.getData("units"),
    };

    for (i = 0; i < rulerWindows.length; i++) {
        // NOTE(patrik): Using reload here to force the windows to apply
        // the new theme
        rulerWindows[i].reload();
    }

    app.setLoginItemSettings({
        openAtLogin: newSettings.autostart,
    });
}

/**
 * Check current system theme and return correct tray icon
 *
 * @returns nativeImage
 */
function getTrayIcon(){
    // Check if current system theme is dark
    if(nativeTheme.shouldUseDarkColors){
        const image = nativeImage.createFromPath(
            path.join(__dirname, "buildResources/icons/tray/tray_icon_darkmode.png"));

        // Set icon to 32x32px
        icon = image.resize({ width: 32, height: 32 });

        return icon
    }else{
        const image = nativeImage.createFromPath(
            path.join(__dirname, "buildResources/icons/tray/tray_icon.png"));
        icon = image.resize({ width: 32, height: 32 });

        return icon;
    }
}

// Update tray icon when system theme is updated
nativeTheme.on('updated', () => {
    trayIcon.setImage(getTrayIcon());
})

/**
 * Setup tray icon and menu
 * @see https://www.electronjs.org/docs/latest/api/tray/
 * @see https://www.electronjs.org/docs/latest/api/menu/
 */
function setup() {
    trayIcon = new Tray(getTrayIcon())

    const trayTemplate = [
    {
        label: "New ruler",
        click: createRuler,
    },
    {
        label: "Toggle theme",
        click: toggleTheme,
    },
    {
        label: "Settings",
        click: createSettings,
    },
    {
        type: "separator",
    },
    {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => app.quit(),
    },
    ];

    const menu = Menu.buildFromTemplate(trayTemplate);
    trayIcon.setContextMenu(menu);
}

// Check when app is ready and setup tray menu
app.whenReady().then(setup);

// Quit program if not on mac
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Quit last focused window when quit event is emitted from renderer
ipcMain.on("quit", () => {
  const quitWindow = BrowserWindow.getFocusedWindow();
  quitWindow.close();
  rulerWindows = rulerWindows.filter(w => w !== quitWindow);
});

// Send version number from package.json to renderer
ipcMain.on("getVersion", (event, arg) => {
  event.reply("sendVersion", app.getVersion());
});

// Save and update settings from settings pahe
ipcMain.on("save-setting", (event, arg) => {
  store.setData(arg);
  updateSettings();
});

// Send all settings to ruler window that sent the event emit
ipcMain.on("get-settings", async (event) => {
  let settings = {
    autostart: await store.getData("autostart"),
    theme: await store.getData("theme"),
  };

  event.reply("send-settings", settings);
});

// Send one settings item to ruler window that sent the event emit
ipcMain.on("get-setting", async (event, key) => {
  event.reply("send-setting", await store.getData(key));
});

// Hide app from dock on MacOS
app.dock.hide();
