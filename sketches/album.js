let cam;
let outputGfx;
let colorMode = 1;
let hasCaptured = false;
const MEMBERS = [
  { name: "YUKINA", hex: "#7B5EA7", rgb: [123, 94,  167] },
  { name: "SAYO",   hex: "#40C4C8", rgb: [64,  196, 200] },
  { name: "LISA",   hex: "#C8294B", rgb: [200, 41,   75] },
  { name: "RINKO",  hex: "#F0EEF5", rgb: [240, 238, 245] },
  { name: "AKO",    hex: "#E8548A", rgb: [232, 84,  138] }
];
const OUT_W = 320, OUT_H = 320;
const LEFT_X = 40, RIGHT_X = 480, PANEL_Y = 75;
function setup() {
  createCanvas(860, 520);
  pixelDensity(1);
  cam = createCapture(VIDEO);
  cam.size(320, 240);
  cam.hide();
  outputGfx = createGraphics(OUT_W, OUT_H);
  outputGfx.pixelDensity(1);
  outputGfx.background(0);
  textFont("monospace");
}
function draw() {
  background(12);
  drawPanels();
  drawColorSelector();
  drawInstructions();
  push();
  translate(LEFT_X + 320, PANEL_Y);
  scale(-1, 1);
  image(cam, 0, 0, 320, 240);
  pop();
  image(outputGfx, RIGHT_X, PANEL_Y, OUT_W, OUT_H);
  if (!hasCaptured) {
    let pulse = abs(sin(frameCount * 0.05));
    noStroke();
    fill(200, 41, 75, pulse * 220);
    ellipse(LEFT_X + 14, PANEL_Y + 14, 7, 7);
    fill(255, pulse * 180 + 75);
    textSize(9); textAlign(LEFT, CENTER);
    text("LIVE", LEFT_X + 22, PANEL_Y + 14);
  }
}
function drawPanels() {
  fill(255, 255, 255, 120); noStroke();
  textSize(10); textAlign(LEFT, BOTTOM);
  text("CAMERA INPUT", LEFT_X, PANEL_Y - 10);
  text("ALBUM COVER OUTPUT", RIGHT_X, PANEL_Y - 10);
  noFill(); stroke(60); strokeWeight(1);
  rect(LEFT_X, PANEL_Y, 320, 240);
  if (hasCaptured) {
    let col = MEMBERS[(colorMode - 1 + 5) % 5].rgb;
    stroke(col[0], col[1], col[2], 120);
  } else { stroke(60); }
  rect(RIGHT_X, PANEL_Y, OUT_W, OUT_H);
  noStroke();
}
function drawColorSelector() {
  let dotY = PANEL_Y + OUT_H + 36;
  let startX = RIGHT_X;
  textSize(9); textAlign(LEFT, CENTER);
  fill(255, 255, 255, 80);
  text("COLOR", startX, dotY);
  for (let i = 0; i < 5; i++) {
    let col = MEMBERS[i].rgb;
    let x = startX + 58 + i * 44;
    let active = (colorMode === i + 1);
    if (active) {
      noFill(); stroke(col[0], col[1], col[2], 200); strokeWeight(1.5);
      ellipse(x, dotY, 24, 24);
    }
    noStroke();
    fill(col[0], col[1], col[2], active ? 255 : 120);
    ellipse(x, dotY, active ? 14 : 10, active ? 14 : 10);
    fill(255, 255, 255, active ? 160 : 60);
    textSize(8); textAlign(CENTER, TOP);
    text(i + 1, x, dotY + 14);
  }
  let mx = startX + 58 + 5 * 44;
  let active6 = (colorMode === 6);
  if (active6) {
    noFill(); stroke(255, 255, 255, 160); strokeWeight(1.5);
    ellipse(mx, dotY, 24, 24);
  }
  noStroke();
  let rColors = MEMBERS.map(m => m.rgb);
  for (let i = 0; i < 5; i++) {
    let angle = (i / 5) * TWO_PI - HALF_PI;
    let nextAngle = ((i + 1) / 5) * TWO_PI - HALF_PI;
    fill(rColors[i][0], rColors[i][1], rColors[i][2], active6 ? 255 : 140);
    arc(mx, dotY, active6 ? 14 : 10, active6 ? 14 : 10, angle, nextAngle);
  }
  fill(255, 255, 255, active6 ? 160 : 60);
  textSize(8); textAlign(CENTER, TOP);
  text(6, mx, dotY + 14);
}
function drawInstructions() {
  noStroke();
  fill(255, 255, 255, 50);
  textSize(10); textAlign(LEFT, TOP);
  text("SPACE  capture", LEFT_X, PANEL_Y + 260);
  text("S  save PNG", LEFT_X, PANEL_Y + 278);
  text("1–6  color", LEFT_X, PANEL_Y + 296);
  let labelY = PANEL_Y + OUT_H + 36;
  let col = MEMBERS[(colorMode - 1 + 5) % 5].rgb;
  noStroke();
  if (colorMode <= 5) {
    fill(col[0], col[1], col[2], 180);
    textSize(10); textAlign(RIGHT, CENTER);
    text(MEMBERS[colorMode - 1].name, RIGHT_X + OUT_W, labelY);
  } else {
    fill(255, 255, 255, 120);
    textSize(10); textAlign(RIGHT, CENTER);
    text("ALL MEMBERS", RIGHT_X + OUT_W, labelY);
  }
}
function generateCover() {
  let img = cam.get();
  img.loadPixels();
  let mirrored = createImage(img.width, img.height);
  mirrored.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let srcIdx = (x + y * img.width) * 4;
      let dstIdx = ((img.width - 1 - x) + y * img.width) * 4;
      mirrored.pixels[dstIdx]     = img.pixels[srcIdx];
      mirrored.pixels[dstIdx + 1] = img.pixels[srcIdx + 1];
      mirrored.pixels[dstIdx + 2] = img.pixels[srcIdx + 2];
      mirrored.pixels[dstIdx + 3] = img.pixels[srcIdx + 3];
    }
  }
  mirrored.updatePixels();
  mirrored.loadPixels();
  let iw = mirrored.width, ih = mirrored.height;
  let gray = [];
  for (let i = 0; i < iw * ih; i++) {
    gray[i] = mirrored.pixels[i*4]*0.299 + mirrored.pixels[i*4+1]*0.587 + mirrored.pixels[i*4+2]*0.114;
  }
  outputGfx.background(0);
  outputGfx.noStroke();
  for (let y = 1; y < ih - 1; y++) {
    for (let x = 1; x < iw - 1; x++) {
      let gx = -gray[(y-1)*iw+(x-1)] - 2*gray[y*iw+(x-1)] - gray[(y+1)*iw+(x-1)]
               +gray[(y-1)*iw+(x+1)] + 2*gray[y*iw+(x+1)] + gray[(y+1)*iw+(x+1)];
      let gy = -gray[(y-1)*iw+(x-1)] - 2*gray[(y-1)*iw+x] - gray[(y-1)*iw+(x+1)]
               +gray[(y+1)*iw+(x-1)] + 2*gray[(y+1)*iw+x] + gray[(y+1)*iw+(x+1)];
      let mag = sqrt(gx * gx + gy * gy);
      let threshold = 40;
      if (mag < threshold) continue;
      let strength = constrain((mag - threshold) / (255 - threshold), 0, 1);
      let ox = map(x, 0, iw, 0, OUT_W);
      let oy = map(y, 0, ih, 0, OUT_H);
      let col;
      if (colorMode <= 5) {
        col = MEMBERS[colorMode - 1].rgb;
      } else {
        let angle = atan2(gy, gx);
        let norm = (angle + PI) / TWO_PI;
        let idx = floor(norm * 5) % 5;
        col = MEMBERS[idx].rgb;
      }
      outputGfx.fill(col[0], col[1], col[2], strength * 240);
      outputGfx.ellipse(ox, oy, 1.8, 1.8);
    }
  }
  hasCaptured = true;
}
function keyPressed() {
  if (key === " ") generateCover();
  if (key === "s" || key === "S") save(outputGfx, "album_cover.png");
  if (key === "1") colorMode = 1;
  if (key === "2") colorMode = 2;
  if (key === "3") colorMode = 3;
  if (key === "4") colorMode = 4;
  if (key === "5") colorMode = 5;
  if (key === "6") colorMode = 6;
}
function mousePressed() {
  let dotY = PANEL_Y + OUT_H + 36;
  for (let i = 0; i < 5; i++) {
    let x = RIGHT_X + 58 + i * 44;
    if (dist(mouseX, mouseY, x, dotY) < 16) colorMode = i + 1;
  }
  let mx = RIGHT_X + 58 + 5 * 44;
  if (dist(mouseX, mouseY, mx, dotY) < 16) colorMode = 6;
}
