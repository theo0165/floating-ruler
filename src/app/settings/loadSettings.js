window.api.getSettings((data) => {
    document.querySelector("body").classList = data.theme;
})