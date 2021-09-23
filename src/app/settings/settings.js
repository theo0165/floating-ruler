let versionSpan = document.querySelector("#version");

window.api.getVersion((version) => {
    versionSpan.innerHTML = "Version: " + version;
});