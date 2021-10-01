let versionSpan = document.querySelector("#version");
let settings;

/**
 * Get current version and apply to page
 */
window.api.getVersion((version) => {
    versionSpan.innerHTML = "Version: " + version;
});

//window.api.saveSetting({autostart: true, theme: "light", units: "mm"})

/**
 * Form elements for settings that can be changed
 */
let settingsElements = {
    autostart: document.querySelector("#autostart"),
    theme: document.querySelector("#theme")
}

/**
 * Get current settings and set form elements to match those settings.
 */
window.api.getSettings((data) => {
    settings = data;

    settingsElements.autostart.checked = data.autostart;
    settingsElements.theme.value = data.theme;
});

/**
 * Save settings using preloaded api.
 */
function saveSettings(){
    window.api.saveSettings(settings);
}

// Check when autostart checkbox is updated and save new value
settingsElements.autostart.addEventListener("change", () => {
    settings.autostart = settingsElements.autostart.checked;
    saveSettings();
})

// Check when theme checkbox is updated and save new value
settingsElements.theme.addEventListener("change", () => {
    settings.theme = settingsElements.theme.value;
    saveSettings();
})

/**
 * @deprecated
 */
function updateSettings(){
    console.log("UPDATE SETTINGS");
}