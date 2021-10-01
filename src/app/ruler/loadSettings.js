/**
 * Load settings before document is loaded and apply current theme
 */

let settings;

window.api.getSettings((data) => {
    settings = data;

    document.querySelector("body").classList = data.theme;
})