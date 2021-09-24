let settings;

window.api.getSettings((data) => {
    settings = data;

    document.querySelector("body").classList = data.theme;
})