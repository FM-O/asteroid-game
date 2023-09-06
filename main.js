import utils from "./utils";
import missileSound from "./space_missile.wav";
import explosionSound from "./explosion.wav";
import asteroidSprite from "./asteroid.png";

let ratio = window.devicePixelRatio;

// Load the sprite image
const sprite = new Image();
sprite.src = asteroidSprite;

const loadSoundMissile = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = missileSound;
  source.type = "audio/wav";

  a.appendChild(source);

  return a;
};

const loadSoundExplosion = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = explosionSound;
  source.type = "audio/wav";

  a.appendChild(source);

  return a;
};

function createHiPPICanvas(w, h, ratio) {
  let cv = document.createElement("canvas");
  cv.width = w * ratio;
  cv.height = h * ratio;
  cv.style.width = w + "px";
  cv.style.height = h + "px";
  cv.getContext("2d").scale(ratio, ratio);
  return cv;
}

const canvas = createHiPPICanvas(innerWidth, innerHeight, ratio);
const soundMissile = loadSoundMissile();
const soundExplosion = loadSoundExplosion();

document.getElementById("app").appendChild(canvas);
document.getElementById("app").appendChild(soundMissile);
document.getElementById("app").appendChild(soundExplosion);
const c = canvas.getContext("2d");

const mouse = {
  x: 0,
  y: 0,
};

const userPosition = {
  x: innerWidth / 2 - 100,
  y: innerHeight - 10,
};

const velocity = 30;

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
const stars = [];

// Function to generate random stars
function createStars() {
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2;
    const brightness = Math.random() * 0.8 + 0.2; // Vary brightness for a realistic look
    stars.push({ x, y, radius, brightness });
  }
}

function drawStars() {
  stars.forEach((star) => {
    c.beginPath();
    c.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    c.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    c.fill();
    c.closePath();
  });
}

// Event Listeners
const missileLaunched = new CustomEvent("missileLaunched");

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    userPosition.x -= 1 * velocity;
  } else if (event.key === "ArrowRight") {
    userPosition.x += 1 * velocity;
  } else if (event.code === "Space") {
    soundMissile.currentTime = 0;
    soundMissile.play();
    window.dispatchEvent(missileLaunched);
  }
});

addEventListener("resize", () => {
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  canvas.getContext("2d").scale(ratio, ratio);

  init();
});

// Objects
class Rectangle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, 100, 100);
    c.closePath();
  }

  update() {
    this.draw();
  }
}

class Sprite {
  constructor(image, x, y, frameWidth, frameHeight, numFrames, frameIndex) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.numFrames = numFrames;
    this.frameIndex = frameIndex;
  }

  draw() {
    c.drawImage(this.image, this.x, this.y, this.frameWidth, this.frameHeight);
  }

  update() {
    this.draw();
  }
}

class Launcher extends Rectangle {
  constructor(color) {
    super();
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, 200, 10);
    c.closePath();
  }

  update() {
    this.draw();
  }
}

class Missile extends Rectangle {
  constructor(x, y, color) {
    super(x, y, color);

    this.y = y;
    this.color = color;
    this.launched = false;

    addEventListener("missileLaunched", () => {
      this.x = userPosition.x + 100 - 5;
      this.y = innerHeight - 10;
      this.launched = true;
    });
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, 10, 10);
    c.closePath();
  }

  update() {
    this.draw();

    if (this.y <= 0) {
      this.launched = false;
      this.y = innerHeight - 10;
    }

    if (this.launched) {
      this.y -= 1 * (velocity / 5);
    }
  }
}

// Implementation
let launcher;
let missile;
let asteroids;

function init() {
  asteroids = [];
  launcher = new Launcher("purple");
  missile = new Missile(0, innerHeight - 10, "red");

  let coordX = 500;

  for (let j = 0; j < 5; j++) {
    if (j > 0) {
      coordX += 150;
    }
    asteroids.push(new Sprite(sprite, coordX, innerHeight / 2 - 50, 100, 100));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height, "red");

  drawStars();

  launcher.x = userPosition.x;
  launcher.y = userPosition.y;

  if (!missile.launched) {
    missile.x = launcher.x + 100 - 5; // plus half of launcher less half of missile
  }

  launcher.update();
  missile.update();

  asteroids.forEach((asteroid) => {
    const blueRectanglesX = asteroid.x;
    const blueRectanglesY = asteroid.y;

    if (
      missile.x + 10 >= blueRectanglesX &&
      missile.x <= blueRectanglesX + 100 &&
      missile.y + 10 >= blueRectanglesY &&
      missile.y <= blueRectanglesY + 100
    ) {
      missile.launched = false;
      missile.y = innerHeight - 10;
      soundExplosion.currentTime = 0;
      soundExplosion.play();
    }
    asteroid.update();
  });
}

init();
createStars();
animate();
