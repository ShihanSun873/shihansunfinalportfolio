let points = [];
let embers = [];
let t = 0;
let energy = 0;
function setup() {
  createCanvas(900, 700);
  pixelDensity(1);
  buildWord();
}
function draw() {
  background(3, 7, 15, 200);
  t += 0.016;
  let targetEnergy = map(mouseY, height, 0, 0.0, 1.0);
  energy += (targetEnergy - energy) * 0.06;
  if (mouseIsPressed) energy = min(energy + 0.08, 1.0);
  for (let i = embers.length - 1; i >= 0; i--) {
    let e = embers[i];
    e.vy -= 0.08 + energy * 0.12;
    e.vx += sin(t * 1.5 + e.wobble) * 0.04;
    e.vx *= 0.96;
    e.x += e.vx;
    e.y += e.vy;
    e.life -= 0.012 + energy * 0.005;
    if (e.life <= 0 || e.y < -20) { embers.splice(i, 1); continue; }
    blendMode(ADD);
    noStroke();
    let rise = 1 - e.life;
    let ea = map(e.life, 0, 1, 0, 180);
    fill(lerp(255, 60, rise), lerp(240, 210, rise), lerp(200, 255, rise), ea);
    ellipse(e.x, e.y, e.size * e.life * 2.5);
    fill(255, 255, 255, ea * 0.4);
    ellipse(e.x, e.y, e.size * 0.7);
    blendMode(BLEND);
  }
  if (frameCount % 2 === 0 && energy > 0.1) {
    for (let i = 0; i < points.length; i++) {
      let pt = points[i];
      if (dist(pt.x, pt.y, pt.hx, pt.hy) > 15 && pt.vy < -0.5) {
        if (random() < 0.05) {
          embers.push({
            x: pt.x + random(-2, 2), y: pt.y,
            vx: pt.vx * 0.5 + random(-0.4, 0.4),
            vy: pt.vy * 0.8 - random(0.3, 1.2) * energy,
            life: random(0.6, 1), size: random(2, 5), wobble: random(100)
          });
        }
      }
    }
  }
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
  gfx.textSize(165);
  gfx.text('SPIRIT', gfx.width / 2, gfx.height / 2);
  gfx.loadPixels();
  let step = 9;
  for (let x = 0; x < gfx.width; x += step) {
    for (let y = 0; y < gfx.height; y += step) {
      let idx = 4 * (y * gfx.width + x);
      if (gfx.pixels[idx] > 128) {
        points.push({
          hx: x, hy: y,
          x: x + random(-2, 2), y: y + random(-2, 2),
          vx: 0, vy: 0,
          phase: random(TWO_PI), noiseOffset: random(1000), temp: random(0.3, 1)
        });
      }
    }
  }
}
function updatePoint(pt) {
  let dx = pt.hx - pt.x, dy = pt.hy - pt.y;
  let k = energy > 0.5 ? 0.025 : 0.045;
  pt.vx += dx * k; pt.vy += dy * k;
  let upForce = energy * pt.temp * (0.5 + sin(t * 1.2 + pt.phase) * 0.3);
  pt.vy -= upForce * 0.7;
  let flicker = noise(pt.noiseOffset + t * 0.6) - 0.5;
  pt.vx += flicker * energy * 0.25;
  let rx = pt.x - mouseX, ry = pt.y - mouseY;
  let rd = sqrt(rx * rx + ry * ry);
  if (rd < 120 && rd > 0.5) {
    let heat = pow(1 - rd / 120, 1.5) * 3;
    pt.vy -= heat * 0.6;
    pt.vx += (rx / rd) * heat * 0.3;
  }
  pt.vx *= 0.86; pt.vy *= 0.86;
  pt.x += pt.vx; pt.y += pt.vy;
}
function drawPoint(pt) {
  let displacement = dist(pt.x, pt.y, pt.hx, pt.hy);
  let heat = constrain(displacement / 80, 0, 1);
  let upVel = constrain(-pt.vy / 3, 0, 1);
  let glow = max(heat, upVel);
  blendMode(ADD); noStroke();
  if (glow > 0.05) {
    fill(40, lerp(100, 200, glow), lerp(200, 255, glow), glow * 55);
    ellipse(pt.x, pt.y, 10 + glow * 8);
  }
  let rc = lerp(80, 255, heat * energy);
  let gc = lerp(200, 255, heat);
  let ac = lerp(160, 230, glow);
  fill(rc, gc, 255, ac);
  ellipse(pt.x, pt.y, lerp(2.5, 4.5, heat));
  blendMode(BLEND);
}
