let canva;
let player;
let obstacles = [];
let hardObstacles = [];
let gameState = "play";

function setup() {
  canva = createCanvas(1000, 1000);
  centerCanvas();
  startGame();
}

function draw() {
  background(30);

  if (gameState === "play") {
    drawGame();
  }
}

function startGame() {
  player = new Player(500, 950);
  obstacles = [];
  hardObstacles = [];

  for (let i = 0; i < 3; i++) {
    let y = 700 - i * 60;
    for (let j = 0; j < 4; j++) {
      let x = j * 300;
      let speed = (i % 2 === 0) ? 2 : -2;
      obstacles.push(new Obstacle(x, y, speed));
    }
  }

  for (let i = 0; i < 2; i++) {
    let y = 300 - i * 60;
    for (let j = 0; j < 5; j++) {
      let x = j * 200;
      let speed = (i % 2 === 0) ? 4 : -4;
      hardObstacles.push(new Obstacle(x, y, speed, true));
    }
  }

  gameState = "play";
}

function drawGame() {
  fill(0, 100, 0);
  rect(0, 0, width, 100);
  rect(0, 900, width, 100);

  for (let obs of obstacles) {
    obs.update();
    obs.show();
    if (obs.hits(player)) {
      gameState = "lose";
    }
  }

  for (let obs of hardObstacles) {
    obs.update();
    obs.show();
    if (obs.hits(player)) {
      gameState = "lose";
    }
  }

  player.update();
  player.show();
}

function keyPressed() {
  if (gameState === "play") {
    if (keyCode === LEFT_ARROW) player.move(-50, 0);
    if (keyCode === RIGHT_ARROW) player.move(50, 0);
    if (keyCode === UP_ARROW) player.move(0, -50);
    if (keyCode === DOWN_ARROW) player.move(0, 50);
  }
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canva.position(x, y);
}

function windowResized() {
  centerCanvas();
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  update() {}

  show() {
    fill(255);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Obstacle {
  constructor(x, y, speed, isHard = false) {
    this.x = x;
    this.y = y;
    this.w = isHard ? 50 : 80;
    this.h = isHard ? 30 : 40;
    this.speed = speed;
    this.isHard = isHard;
  }

  update() {
    this.x += this.speed;
    if (this.x > width) this.x = -this.w;
    if (this.x < -this.w) this.x = width;

    if (this.isHard) {
      this.y += sin(frameCount * 0.1) * 0.5;
    }
  }

  show() {
    if (this.isHard) {
      fill(0, 0, 255); 
    } else {
      fill(255, 165, 0); 
    }
    rect(this.x, this.y, this.w, this.h);
  }

  hits(player) {
    return (
      player.x < this.x + this.w &&
      player.x + player.size > this.x &&
      player.y < this.y + this.h &&
      player.y + player.size > this.y
    );
  }
}
