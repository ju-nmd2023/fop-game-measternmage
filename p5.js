let canva;
let player;
let obstacles = [];
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
  } else if (gameState === "win") {
    winScreen();
  } else if (gameState === "lose") {
    loseScreen();
  }
}

function startGame() {
  player = new Player(500, 950);
  obstacles = [];
  for (let i = 0; i < 3; i++) {
    let y = 700 - i * 60;
    for (let j = 0; j < 4; j++) {
      let x = j * 300;
      let speed = (i % 2 === 0) ? 2 : -2;
      obstacles.push(new Obstacle(x, y, speed));
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
  
    update(){}
      
  
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
  