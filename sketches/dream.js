let points = [];
let breathT = 0;
function setup() {
  createCanvas(900, 700);
  pixelDensity(1);
  background(8, 10, 20);
  buildWord();
}
function draw() {
  breathT += 0.012;
  let bs = 1 + sin(breathT) * 0.008;
  noStroke();
  fill(8, 10, 20, 18);
  rect(0, 0, width, height);
  for (let i = 0; i < points.length; i++) {
    updatePoint(points[i]);
    drawPoint(points[i], bs);
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
  gfx.textSize(200);
  gfx.text('DREAM', gfx.width / 2, gfx.height / 2);
  gfx.loadPixels();
  let step = 9;
  for (let x = 0; x < gfx.width; x += step) {
    for (let y = 0; y < gfx.height; y += step) {
      let idx = 4 * (y * gfx.width + x);
      if (gfx.pixels[idx] > 128) {
        points.push({
          hx: x, hy: y,
          x: x + random(-3, 3),
          y: y + random(-3, 3),
          vx: random(-0.5, 0.5),
          vy: random(-0.5, 0.5),
          wobble: random(1000)
        });
      }
    }
  }
}
function updatePoint(pt) {
  pt.vx += (noise(pt.wobble + frameCount * 0.004) - 0.5) * 0.015;
  pt.vy += sin(frameCount * 0.008 + pt.wobble) * 0.008;
  let dx = pt.hx - pt.x;
  let dy = pt.hy - pt.y;
  let d = sqrt(dx * dx + dy * dy);
  let k = d > 80 ? 0.04 : 0.018;
  pt.vx += dx * k;
  pt.vy += dy * k;
  let rx = pt.x - mouseX;
  let ry = pt.y - mouseY;
  let rd = sqrt(rx * rx + ry * ry);
  if (rd < 200 && rd > 0.5) {
    let falloff = pow(1 - rd / 200, 2.2);
    pt.vx += (rx / rd) * falloff * 4.5;
    pt.vy += (ry / rd) * falloff * 4.5;
    pt.vx += -(ry / rd) * falloff * 0.4;
    pt.vy +=  (rx / rd) * falloff * 0.4;
  }
  pt.vx *= 0.88;
  pt.vy *= 0.88;
  pt.x += pt.vx;
  pt.y += pt.vy;
}
function drawPoint(pt, bs) {
  let d = dist(pt.x, pt.y, pt.hx, pt.hy);
  let disp = constrain(d / 120, 0, 1);
  let alpha = 140 * (1 - disp * 0.4) * bs;
  let r = lerp(200, 140, disp);
  let gb = lerp(170, 190, disp);
  noStroke();
  fill(r, gb, 255, alpha * 0.18);
  ellipse(pt.x, pt.y, 9 * bs);
  fill(r, gb, 255, alpha);
  ellipse(pt.x, pt.y, 2.8 * bs);
}
