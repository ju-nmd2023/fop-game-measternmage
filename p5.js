let canva;

function setup() {
  canva = createCanvas(1000, 1000);
  centerCanvas();
}

function draw() {
  background(220);
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canva.position(x, y);
}

function windowResized() {
  centerCanvas();
}
