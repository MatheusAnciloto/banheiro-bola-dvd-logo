let speed = 20;
let scale = 0.17; // Image scale
let canvas;
let ctx;
let logoColor;

document.getElementById("fullscreen-btn").addEventListener("click", toggleFullscreen);

function toggleFullscreen() {
    let elem = document.documentElement;

    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
}

// Listen for fullscreen change events to update canvas size
document.addEventListener("fullscreenchange", () => {
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    if (document.fullscreenElement) {
        fullscreenBtn.classList.add("fullscreen-hidden");
    } else {
        fullscreenBtn.classList.remove("fullscreen-hidden");
    }
    resizeCanvas(); // Adjust canvas size when entering/exiting fullscreen
});

// Listen for window resize events to keep canvas updated
window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let dvd = {
    x: 200,
    y: 300,
    xspeed: 4,
    yspeed: 4,
    img: new Image()
};


(function main(){
    canvas = document.getElementById("tv-screen");
    ctx = canvas.getContext("2d");
    dvd.img.src = 'banheirobola.png';

    // Draw the "tv screen"
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    dvd.img.onload = () => {
        pickColor(); // Set initial color after the image loads
        update();
    };
})();

function tintImage(img, color) {
    // Create an offscreen canvas
    let offCanvas = document.createElement('canvas');
    let offCtx = offCanvas.getContext('2d');
    offCanvas.width = img.width;
    offCanvas.height = img.height;

    // Draw the original image
    offCtx.drawImage(img, 0, 0);

    // Set tint color
    offCtx.globalCompositeOperation = 'source-atop';
    offCtx.fillStyle = color;
    offCtx.fillRect(0, 0, img.width, img.height);
    offCtx.globalCompositeOperation = 'source-over'; // Reset for next use

    return offCanvas;
}

function update() {
    setTimeout(() => {
        // Draw the canvas background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw tinted DVD logo
        ctx.drawImage(dvd.img, dvd.x, dvd.y, dvd.img.width * scale, dvd.img.height * scale);

        // Move the logo
        dvd.x += dvd.xspeed;
        dvd.y += dvd.yspeed;

        // Check for collision 
        checkHitBox();
        update();   
    }, speed);
}

// Check for border collision
function checkHitBox() {
    if (dvd.x + dvd.img.width * scale >= canvas.width || dvd.x <= 0) {
        dvd.xspeed *= -1;
        pickColor();
    }
        
    if (dvd.y + dvd.img.height * scale >= canvas.height || dvd.y <= 0) {
        dvd.yspeed *= -1;
        pickColor();
    }    
}

// Pick a random color in RGB format and apply it to the logo
function pickColor() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    logoColor = 'rgb(' + r + ',' + g + ', ' + b + ')';

    // Re-tint the image with the new color
    dvd.img = tintImage(dvd.img, logoColor);
}
