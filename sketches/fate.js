let points = [];
let fateNodes = [];
let t = 0;
function setup() {
  createCanvas(900, 700);
  pixelDensity(1);
  buildWord();
  for (let i = 0; i < 5; i++) {
    fateNodes.push({
      x: random(150, 750),
      y: random(100, 600),
      strength: random(0.15, 0.4),
      radius: random(80, 180)
    });
  }
}
function draw() {
  background(10, 8, 7);
  t += 0.005;
  for (let i = 0; i < fateNodes.length; i++) {
    fateNodes[i].x += sin(t * 0.3 + fateNodes[i].radius) * 0.12;
    fateNodes[i].y += cos(t * 0.2 + fateNodes[i].strength * 10) * 0.08;
  }
  drawFateThreads();
  for (let i = 0; i < points.length; i++) {
    updatePoint(points[i]);
    drawPoint(points[i]);
  }
}
function buildWord() {
  points = [];
  let gfx = createGraphics(900, 700);
  gfx.pixelDensity(1);
  gfx.background(0);
  gfx.fill(255);
  gfx.noStroke();
  gfx.textAlign(CENTER, CENTER);
  gfx.textSize(220);
  gfx.text('FATE', gfx.width / 2, gfx.height / 2);
  gfx.loadPixels();
  let step = 10;
  for (let x = 0; x < gfx.width; x += step) {
    for (let y = 0; y < gfx.height; y += step) {
      let idx = 4 * (y * gfx.width + x);
      if (gfx.pixels[idx] > 128) {
        points.push({
          hx: x, hy: y,
          x: x, y: y,
          vx: 0, vy: 0,
          fateIdx: floor(random(5))
        });
      }
    }
  }
}
function updatePoint(pt) {
  let dx = pt.hx - pt.x;
  let dy = pt.hy - pt.y;
  pt.vx += dx * 0.055;
  pt.vy += dy * 0.055;
  let node = fateNodes[pt.fateIdx % fateNodes.length];
  let fx = node.x - pt.x;
  let fy = node.y - pt.y;
  let fd = sqrt(fx * fx + fy * fy);
  if (fd < node.radius && fd > 0.5) {
    let influence = (1 - fd / node.radius) * node.strength * 0.4;
    pt.vx += (fx / fd) * influence;
    pt.vy += (fy / fd) * influence;
  }
  if (mouseIsPressed) {
    let rx = mouseX - pt.x;
    let ry = mouseY - pt.y;
    let rd = sqrt(rx * rx + ry * ry);
    if (rd < 140 && rd > 0.5) {
      let pull = (1 - rd / 140) * 1.8;
      pt.vx += (rx / rd) * pull;
      pt.vy += (ry / rd) * pull;
    }
  }
  pt.vx *= 0.82;
  pt.vy *= 0.82;
  pt.x += pt.vx;
  pt.y += pt.vy;
}
function drawFateThreads() {
  let maxDist = 32;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let dx = points[i].x - points[j].x;
      let dy = points[i].y - points[j].y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        let alpha = map(d, 0, maxDist, 90, 0);
        stroke(220, 185, 95, alpha);
        strokeWeight(0.6);
        line(points[i].x, points[i].y, points[j].x, points[j].y);
      }
    }
  }
  for (let i = 0; i < fateNodes.length; i++) {
    let n = fateNodes[i];
    for (let j = 0; j < points.length; j++) {
      let pt = points[j];
      let dx = n.x - pt.x;
      let dy = n.y - pt.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < n.radius * 0.6) {
        let alpha = map(d, 0, n.radius * 0.6, 18, 0);
        stroke(240, 200, 80, alpha);
        strokeWeight(0.3);
        line(pt.x, pt.y, n.x, n.y);
      }
    }
  }
  noStroke();
}
function drawPoint(pt) {
  let displacement = dist(pt.x, pt.y, pt.hx, pt.hy);
  let pull = constrain(displacement / 60, 0, 1);
  let alpha = map(pull, 0, 1, 220, 130);
  noStroke();
  let sz = 2;
  fill(240, lerp(200, 140, pull), lerp(90, 30, pull), alpha);
  rect(pt.x - sz / 2, pt.y - sz / 2, sz, sz);
  if (displacement > 3) {
    fill(255, 230, 140, pull * 60);
    ellipse(pt.x, pt.y, 6);
  }
}
