let bottomLine = document.querySelector("#width");
let rightLine = document.querySelector("#height");

let heightInfo = document.querySelector("#height_info");
let widthInfo = document.querySelector("#width_info");

let quitBtn = document.querySelector("#quit");

// Current height and width of window
let height, width;

/**
 * Display current width and height on page
 */
function setSizeInfo(){
    height = rightLine.offsetHeight - 82;
    width = bottomLine.offsetWidth - 82;

    heightInfo.innerText = height + "px";
    widthInfo.innerText = width + "px";
}

// Update size info when window is rezised
window.addEventListener("resize", setSizeInfo)

document.addEventListener("DOMContentLoaded", setSizeInfo);

quitBtn.addEventListener('click', function() {
    window.api.quit();
})