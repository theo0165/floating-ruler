let versionSpan = document.querySelector("#version");
let settings;

window.api.getVersion((version) => {
    versionSpan.innerHTML = "Version: " + version;
});

//window.api.saveSetting({autostart: true, theme: "light", units: "mm"})

let settingsElements = {
    autostart: document.querySelector("#autostart"),
    theme: document.querySelector("#theme"),
    units: document.querySelector("#units"),
    defaultPx: document.querySelector("#defaultPx")
}

window.api.getSettings((data) => {
    settings = data;

    settingsElements.autostart.checked = data.autostart;
    settingsElements.theme.value = data.theme;
    settingsElements.units.value = data.units;
    settingsElements.defaultPx.value = data.defaultPx
});

console.log(window.api.settings)

function saveSettings(){
    window.api.saveSettings(settings);
}

settingsElements.autostart.addEventListener("change", () => {
    settings.autostart = settingsElements.autostart.checked;
    saveSettings();
})

settingsElements.theme.addEventListener("change", () => {
    settings.theme = settingsElements.theme.value;
    saveSettings();
})

settingsElements.units.addEventListener("change", () => {
    settings.units = settingsElements.units.value;
    saveSettings();
})

settingsElements.defaultPx.addEventListener("change", () => {
    settings.defaultPx = settingsElements.defaultPx.value;
    saveSettings();
})

function updateSettings(){
    console.log("UPDATE SETTINGS");
}