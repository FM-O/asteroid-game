import utils from "./utils";
import missileSound from "./space_missile.wav";
import missileSoundAlt from "./voices-game.wav";
import missileSoundAlt1 from "./voices-game-2.wav";
import missileSoundAlt2 from "./voices-game-3.wav";
import missileSoundAlt3 from "./voices-game-4.wav";
import explosionSound from "./explosion.wav";
import winSound from "./winsound.wav";
import annyeongSound from "./annyeong.mp3";
import asteroidSprite from "./asteroid.png";
import explosionSprite from "./boom3_0.png";
import patrickImage from "./pat.png";
import expl from "./expl.png";

let ratio = window.devicePixelRatio;

// Load the sprite image
const sprite = new Image();
sprite.src = asteroidSprite;

const patrick = new Image();
patrick.src = patrickImage;

const spriteExplosion = new Image();
spriteExplosion.src = explosionSprite;

const explosion = new Image();
explosion.src = expl;

const loadSoundMissile = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = missileSound;
  source.type = "audio/wav";

  a.appendChild(source);

  return a;
};

const loadSoundMissileAlt = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = missileSoundAlt;
  source.type = "audio/wav";

  a.appendChild(source);

  return a;
};

const loadSoundMissileAlt1 = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = missileSoundAlt1;
  source.type = "audio/wav";

  a.appendChild(source);

  return a;
};

const loadSoundMissileAlt2 = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = missileSoundAlt2;
  source.type = "audio/wav";

  a.appendChild(source);

  return a;
};

const loadSoundMissileAlt3 = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = missileSoundAlt3;
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

const loadWinSound = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = winSound;
  source.type = "audio/wav";

  a.appendChild(source);

  return a;
};
const loadAnnYeongSound = () => {
  const a = document.createElement("audio");
  const source = document.createElement("source");

  source.src = annyeongSound;
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
const winMusic = loadWinSound();
const annyeong = loadAnnYeongSound();

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
const missileSounds = [
  loadSoundMissileAlt(),
  loadSoundMissileAlt1(),
  loadSoundMissileAlt2(),
  loadSoundMissileAlt3(),
];
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
    const soundMissileSelected = utils.randomColor(missileSounds);
    soundMissile.currentTime = 0;
    soundMissileSelected.play();
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
  constructor(
    index,
    image,
    x,
    y,
    frameWidth,
    frameHeight,
    alpha = 1,
    dx = undefined,
    dy = undefined,
    animated = false
  ) {
    this.index = index;
    this.image = image;
    this.x = x;
    this.y = y;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.numFramesX = 8;
    this.numFramesY = 8;
    this.frameIndexX = 0;
    this.frameIndexY = 0;
    this.alpha = alpha;
    this.dx = dx;
    this.dy = dy;
    this.xSpeed = 10;
    this.YSpeed = 10;
    this.animated = animated;
    this.destroyed = false;
  }

  draw() {
    if (this.destroyed) {
      return;
    }

    if (!this.animated) {
      c.drawImage(
        this.image,
        this.x,
        this.y,
        this.frameWidth,
        this.frameHeight
      );
    } else {
      c.drawImage(
        this.image,
        this.frameIndexX * this.frameWidth,
        this.frameIndexY * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.frameWidth * 3.375,
        this.frameHeight * 1.18
      );
    }
  }

  update() {
    c.save();
    c.globalAlpha = this.alpha;
    this.draw();
    c.restore();
    if (this.animated) {
      this.frameIndexX = (this.frameIndex + 1) % this.numFramesX;
      if (this.frameIndexX === 0) {
        this.frameIndexY = (this.frameIndexY + 1) % this.numFramesY;
      }

      this.x += this.xSpeed;
      this.y += this.YSpeed;

      if (this.x + this.frameWidth * 3.375 > innerWidth || this.x < 0) {
        this.xSpeed = -this.xSpeed;
      }
      if (this.y + this.frameHeight * 1.18 > innerHeight || this.y < 0) {
        this.ySpeed = -this.ySpeed;
      }
    }
  }
}

class Missile extends Rectangle {
  constructor(x, y, color) {
    super(x, y, color);

    this.y = y;
    this.color = color;
    this.launched = false;

    addEventListener("missileLaunched", () => {
      this.x = userPosition.x + 47 - 5;
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
let explosions;
let score;
let win = false;
let stopAnimation = false;

function init() {
  asteroids = [];
  explosions = [];
  score = 0;
  launcher = new Sprite(null, patrick, 0, 0, 90.5, 119.5);
  missile = new Missile(0, innerHeight - 10, "red");

  c.font = "24px Arial";
  c.fillStyle = "white";
  c.textAlign = "center";
  c.textBaseline = "middle";

  let coordX = 370;

  for (let j = 0; j < 7; j++) {
    if (j > 0) {
      coordX += 150;
    }
    asteroids.push(new Sprite(j, sprite, coordX, innerHeight / 2 - 50, 80, 80));
    explosions.push(
      new Sprite(j, explosion, coordX, innerHeight / 2 - 50, 80, 80, 0)
    );
    // explosions.push(new Sprite(spriteExplosion, 100, 100, 32, 32, true));
  }
}

// Animation Loop
function animate() {
  if (stopAnimation) {
    return;
  }

  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height, "red");

  drawStars();

  launcher.x = userPosition.x;
  launcher.y = userPosition.y - 110;

  if (!missile.launched) {
    missile.x = launcher.x + 47 - 5; // plus half of launcher less half of missile
  }

  missile.update();
  launcher.update();

  asteroids.forEach((asteroid) => {
    const blueRectanglesX = asteroid.x;
    const blueRectanglesY = asteroid.y;

    if (
      missile.x + 10 >= blueRectanglesX &&
      missile.x <= blueRectanglesX + 80 &&
      missile.y + 10 >= blueRectanglesY &&
      missile.y <= blueRectanglesY + 80
    ) {
      missile.launched = false;
      missile.y = innerHeight - 10;
      soundExplosion.currentTime = 0;
      soundExplosion.play();
      explosions[asteroid.index].alpha = 1;

      setTimeout(() => {
        asteroid.alpha = 0;
        asteroid.x = -asteroid.x;
        asteroid.y = -asteroid.y;
        asteroid.destroyed = true;
      }, 950);

      setTimeout(() => {
        explosions[asteroid.index].alpha = 0;
        explosions[asteroid.index].destroyed = true;
      }, 1000);

      score++;

      if (score === asteroids.length) {
        win = true;
        setTimeout(() => {
          winMusic.play();
        }, 600);
      }
    }
    asteroid.update();

    if (win) {
      c.fillStyle = "greenyellow";
      c.font = "60px Arial";
      c.fillText(`Bravo c'est gagné !`, innerWidth / 2, innerHeight / 2);

      setTimeout(() => {
        document.getElementById("win-table").classList.add("translate-right");
        annyeong.play();
        stopAnimation = true;
      }, 5000);
    } else {
      c.fillStyle = "white";
      c.fillText(`score: ${score}/${asteroids.length}`, 70, 20);
    }
  });

  explosions.forEach((explosion) => {
    explosion.update();
  });
}

init();
createStars();
animate();
