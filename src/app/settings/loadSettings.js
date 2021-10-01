/**
 * Load settings before document is loaded and apply current theme
 */
window.api.getSettings((data) => {
    document.querySelector("body").classList = data.theme;
})