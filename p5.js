let canva;
let player;
let obstacles = [];
let lilys = [];
let gameState = "play";

let riverY = 300; 
let lives = 3;
let score = 0;

function setup() {
  canva = createCanvas(1000, 1000);
  centerCanvas();
  startGame();
}

function draw() {
  background(30);

  if (gameState === "play") {
    drawGame();
  } else if (gameState === "lose") {
    loseScreen();
  } else if (gameState === "win") {
    winScreen();
  }
}

function startGame() {
  player = new Player(500, 950);
  obstacles = [];
  lilys = [];

  for (let i = 0; i < 3; i++) {
    let y = 700 - i * 60;
    for (let j = 0; j < 4; j++) {
      let x = j * 300;
      let speed = (i % 2 === 0) ? 2 : -2;
      obstacles.push(new Obstacle(x, y, speed));
    }
  }

  for (let i = 0; i < 3; i++) {
    let y = riverY + 120 - i * 60;
    for (let j = 0; j < 3; j++) {
      let x = j * 350;
      let speed = (i % 2 === 0) ? 2 : -2;
      lilys.push(new Lilys(x, y, speed));
    }
  }

  gameState = "play";
}

function drawGame() {
  // Safe zones
  fill(0, 100, 0);
  rect(0, 0, width, 100);
  rect(0, 900, width, 100);

  // River background
  fill(0, 0, 150);
  rect(0, riverY, width, 180);

  // Draw lilys (lilypads)
  let onLily = false;
  for (let lily of lilys) {
    lily.update();
    lily.show();
    if (lily.carries(player)) {
      onLily = true;
      player.x += lily.speed;
    }
  }

  // Draw obstacles
  for (let obs of obstacles) {
    obs.update();
    obs.show();
    if (obs.hits(player)) {
      loseLife();
    }
  }

  // Water hazard
  if (
    player.y < riverY + 180 &&
    player.y + player.size > riverY &&
    !onLily
  ) {
    loseLife();
  }

  // Reached top
  if (player.y < 100) {
    score++;
    if (score >= 5) {
      gameState = "win";
    } else {
      player = new Player(500, 950); 
    }
  }

  player.update();
  player.show();

  
  fill(255);
  textSize(24);
  text(`Lives: ${lives}`, 500, 60);
  text(`Score: ${score}`, 400, 60);
}

function loseLife() {
  lives--;
  if (lives <= 0) {
    gameState = "lose";
  } else {
    player = new Player(500, 950); 
  }
}

function keyPressed() {
  if (gameState === "play") {
    if (keyCode === LEFT_ARROW) player.move(-50, 0);
    if (keyCode === RIGHT_ARROW) player.move(50, 0);
    if (keyCode === UP_ARROW) player.move(0, -50);
    if (keyCode === DOWN_ARROW) player.move(0, 50);
  } else if (gameState === "lose" || gameState === "win") {
    if (key === 'r' || key === 'R') {
      lives = 2;
      score = 0;
      startGame();
    }
  }
}

function loseScreen() {
  background(0);
  fill(255, 0, 0);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("HAHA! YOU LOSE", width / 2, height / 2 - 40);
  textSize(32);
  text("Press 'R' to Restart", width / 2, height / 2 + 40);
}

function winScreen() {
  background(0);
  fill(0, 150, 0);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("Well Well Well, YOU WIN!", width / 2, height / 2 - 40);
  textSize(32);
  text("Press 'R' to Play Again", width / 2, height / 2 + 40);
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
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 40;
    this.speed = speed;
  }

  update() {
    this.x += this.speed;
    if (this.x > width) this.x = -this.w;
    if (this.x < -this.w) this.x = width;
  }

  show() {
    fill(200, 0, 0);
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

class Lilys {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.w = 150;
    this.h = 40;
    this.speed = speed;
  }

  update() {
    this.x += this.speed;
    if (this.x > width) this.x = -this.w;
    if (this.x < -this.w) this.x = width;
  }

  show() {
    fill(134, 164, 116);
    ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
  }

  carries(player) {
    return (
      player.x < this.x + this.w &&
      player.x + player.size > this.x &&
      player.y < this.y + this.h &&
      player.y + player.size > this.y
    );
  }
}
