let versionSpan = document.querySelector("#version");
let settings;

window.api.getVersion((version) => {
    versionSpan.innerHTML = "Version: " + version;
});

//window.api.saveSetting({autostart: true, theme: "light", units: "mm"})

let settingsElements = {
    autostart: document.querySelector("#autostart"),
    theme: document.querySelector("#theme")
}

window.api.getSettings((data) => {
    settings = data;

    settingsElements.autostart.checked = data.autostart;
    settingsElements.theme.value = data.theme;
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

function updateSettings(){
    console.log("UPDATE SETTINGS");
}