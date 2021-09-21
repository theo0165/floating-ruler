let bottomLine = document.querySelector("#width");
let rightLine = document.querySelector("#height");

let heightInfo = document.querySelector("#height_info");
let widthInfo = document.querySelector("#width_info");

let quitBtn = document.querySelector("#quit");

console.log(window.preload_complete);

function setSizeInfo(){
    let height = rightLine.offsetHeight - 82;
    let width = bottomLine.offsetWidth - 82;

    heightInfo.innerText = height + "px";
    widthInfo.innerText = width + "px";
}

window.addEventListener("resize", function() {
    setSizeInfo();
})

document.addEventListener("DOMContentLoaded", function(event) {
    setSizeInfo();
});

quitBtn.addEventListener('click', function() {
    console.log("Quit!");
})