let versionSpan = document.querySelector("#version");

window.api.getVersion((version) => {
    versionSpan.innerHTML = "Version: " + version;
});

//window.api.saveSetting({autostart: true, theme: "light", units: "mm"})

let settings = {
    autostart: true,
    theme: "dark",
    units: "px"
}

let settingsElements = {
    autostart: document.querySelector("#autostart"),
    theme: document.querySelector("#theme"),
    units: document.querySelector("#units")
}

window.api.getSettings((data) => {
    console.log("Settings", data)
    settings = data;
    console.log(data.units)

    settingsElements.autostart.checked = data.autostart;
    settingsElements.theme.value = data.theme;
    settingsElements.units.value = data.units;
});

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