let recentClicks = 0;
let lastClickTime = 0;
let message = "", subMessage = "", state = "idle";
let cardName = "", cardLevel = "";
let isShowingResult = false, resultStartTime = 0, resultHoldTime = 3500;
let cardRevealT = 0, circleT = 0, bgFlashAlpha = 0;
let bgFlashColor = [255, 255, 255];
let particles = [];
let idleT = 0;
let goodCards = ["The Fool","The Magician","The High Priestess","The Empress","The Emperor","The Hierophant","The Lovers","The Chariot","Strength","Wheel of Fortune","Justice","Temperance","The Star","The Sun","Judgement","The World","Ace of Cups","Ace of Wands","Ace of Pentacles","Ten of Cups","Ten of Pentacles"];
let neutralCards = ["The Hermit","The Hanged Man","Death","The Moon","Two of Swords","Four of Cups","Seven of Cups","Eight of Cups","Page of Cups","Knight of Swords","Queen of Swords","King of Swords"];
let badCards = ["The Devil","The Tower","Five of Cups","Five of Pentacles","Nine of Swords","Ten of Swords","Three of Swords","Seven of Swords","Eight of Swords","Five of Wands"];
let cardMeanings = {"The Fool":"A new beginning appears.","The Magician":"You already have what you need.","The High Priestess":"Trust what is quiet inside you.","The Empress":"Something can grow from this.","The Emperor":"Control gives shape to the answer.","The Hierophant":"A structure is guiding you.","The Lovers":"A choice needs honesty.","The Chariot":"Move forward with control.","Strength":"Calm power is still power.","Wheel of Fortune":"The situation is turning.","Justice":"The result follows your action.","Temperance":"Balance is the answer.","The Star":"Hope is still present.","The Sun":"The answer is clear.","Judgement":"A decision is ready to rise.","The World":"Something reaches completion.","Ace of Cups":"A new feeling begins.","Ace of Wands":"A spark is enough to start.","Ace of Pentacles":"A real chance is forming.","Ten of Cups":"The result is gentle.","Ten of Pentacles":"There is stability here.","The Hermit":"Step back before deciding.","The Hanged Man":"The answer needs another angle.","Death":"Something must change first.","The Moon":"Not everything is visible.","Two of Swords":"You are still between choices.","Four of Cups":"The answer is present, but distant.","Seven of Cups":"Too many possibilities are clouding the result.","Eight of Cups":"Leaving may also be an answer.","Page of Cups":"A small sign appears.","Knight of Swords":"The movement is too fast.","Queen of Swords":"Clarity needs distance.","King of Swords":"Think before you act.","The Devil":"Attachment is speaking louder than reason.","The Tower":"The structure is not stable.","Five of Cups":"The loss is still visible.","Five of Pentacles":"The path feels cold.","Nine of Swords":"The fear is repeating itself.","Ten of Swords":"This cannot continue the same way.","Three of Swords":"The answer cuts directly.","Seven of Swords":"Something is being avoided.","Eight of Swords":"You are trapped by your own thought.","Five of Wands":"Conflict is already here."};
let themes = {
  idle:    { bg:[8,6,16],    circle:[30,22,55],  accent:[123,94,167],  flash:[200,190,255] },
  good:    { bg:[8,6,18],    circle:[38,26,72],  accent:[123,94,167],  flash:[180,160,255] },
  neutral: { bg:[4,16,18],   circle:[20,58,62],  accent:[64,196,200],  flash:[120,230,235] },
  bad:     { bg:[18,5,10],   circle:[72,14,32],  accent:[200,41,75],   flash:[232,84,138]  }
};
function setup() {
  createCanvas(600, 620);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  lastClickTime = millis();
  for (let i = 0; i < 38; i++) particles.push(newParticle(true));
}
function newParticle(randomY) {
  return { x:random(width), y:randomY?random(height):height+5, vy:random(-0.25,-0.7), vx:random(-0.15,0.15), size:random(1,2.8), alpha:random(30,100), life:random(0.4,1), decay:random(0.001,0.003) };
}
function draw() {
  let now = millis();
  let timeSinceClick = now - lastClickTime;
  if (timeSinceClick > 6000 && state !== "waiting" && !isShowingResult && state !== "idle") { state = "waiting"; drawCardFromGroup("neutral"); }
  if (isShowingResult && now - resultStartTime > resultHoldTime) isShowingResult = false;
  cardRevealT = lerp(cardRevealT, 1, 0.09);
  circleT     = lerp(circleT, 1, 0.06);
  idleT      += 0.012;
  let th = getTheme();
  let bg = th.bg;
  background(bg[0], bg[1], bg[2]);
  if (bgFlashAlpha > 0) { noStroke(); fill(bgFlashColor[0],bgFlashColor[1],bgFlashColor[2],bgFlashAlpha); rect(0,0,width,height); bgFlashAlpha = max(0, bgFlashAlpha-14); }
  updateParticles(th);
  drawAmbientRings(th);
  drawTitle(th);
  drawCircle(th);
  drawCardPanel(th);
  drawResponsePanel(th);
  drawInstruction();
}
function getTheme() {
  if (cardLevel==="good") return themes.good;
  if (cardLevel==="neutral") return themes.neutral;
  if (cardLevel==="bad") return themes.bad;
  return themes.idle;
}
function drawAmbientRings(th) {
  let cx=width/2, cy=height/2-30, acc=th.accent;
  noFill();
  for (let i=0;i<5;i++) { let r=90+i*55+sin(idleT*0.4+i*0.9)*6; stroke(acc[0],acc[1],acc[2],map(i,0,4,18,4)); strokeWeight(0.6); ellipse(cx,cy,r*2,r*2); }
  noStroke();
}
function updateParticles(th) {
  let acc=th.accent;
  for (let i=particles.length-1;i>=0;i--) {
    let p=particles[i];
    p.x+=p.vx+sin(idleT+i)*0.06; p.y+=p.vy; p.life-=p.decay;
    if (p.life<=0||p.y<-10) { particles[i]=newParticle(false); continue; }
    noStroke();
    let pc=p.col?p.col:acc;
    fill(pc[0],pc[1],pc[2],p.alpha*p.life);
    ellipse(p.x,p.y,p.size);
  }
}
function drawTitle(th) {
  let acc=th.accent;
  for (let i=3;i>0;i--) { fill(acc[0],acc[1],acc[2],i*6); textSize(33+i*1.5); text("Are You Sure",width/2,58); }
  fill(245); textSize(33); text("Are You Sure",width/2,58);
  stroke(255,255,255,18); strokeWeight(0.5); line(width/2-120,82,width/2+120,82); noStroke();
}
function drawCircle(th) {
  let cx=width/2, cy=230, col=th.circle, acc=th.accent;
  let pulseR=82+sin(idleT*0.8)*4;
  for (let i=4;i>0;i--) { fill(acc[0],acc[1],acc[2],circleT*i*7); ellipse(cx,cy,(pulseR+i*14)*2*circleT); }
  fill(col[0],col[1],col[2]); ellipse(cx,cy,pulseR*2);
  stroke(acc[0],acc[1],acc[2],40); strokeWeight(0.5);
  push(); translate(cx,cy); rotate(idleT*0.3);
  line(-pulseR*0.6,0,pulseR*0.6,0); line(0,-pulseR*0.6,0,pulseR*0.6);
  rotate(PI/4); stroke(acc[0],acc[1],acc[2],20);
  line(-pulseR*0.5,0,pulseR*0.5,0); line(0,-pulseR*0.5,0,pulseR*0.5);
  pop(); noStroke();
  let sym="◈";
  if (cardLevel==="good") sym="✦";
  if (cardLevel==="neutral") sym="◯";
  if (cardLevel==="bad") sym="⟁";
  fill(acc[0],acc[1],acc[2],90+sin(idleT)*30); textSize(28); text(sym,cx,cy);
}
function drawCardPanel(th) {
  let acc=th.accent, panelY=355;
  rectMode(CENTER);
  fill(10,10,20,210); rect(width/2,panelY,500,88,10);
  if (cardLevel!=="") { stroke(acc[0],acc[1],acc[2],55*cardRevealT); strokeWeight(0.8); rect(width/2,panelY,500,88,10); noStroke(); }
  let slideX=lerp(width/2-30,width/2,cardRevealT);
  fill(255,255*cardRevealT); textSize(21); text(cardName,slideX,panelY-15);
  textSize(11);
  let badge=cardLevel==="good"?"GOOD CARD":cardLevel==="neutral"?"NEUTRAL CARD":cardLevel==="bad"?"WARNING CARD":"";
  fill(acc[0],acc[1],acc[2],210*cardRevealT);
  text(badge,slideX,panelY+15);
}
function drawResponsePanel(th) {
  let acc=th.accent, panelY=465;
  rectMode(CENTER);
  fill(8,8,18,230); rect(width/2,panelY,520,115,10);
  fill(255,240*cardRevealT); textSize(20); text(message,width/2,panelY-24);
  stroke(255,255,255,15); strokeWeight(0.5); line(width/2-200,panelY-8,width/2+200,panelY-8); noStroke();
  fill(acc[0],acc[1],acc[2],190*cardRevealT); textSize(13); text(subMessage,width/2,panelY+20,460,60);
}
function drawInstruction() {
  fill(255,255,255,35+sin(idleT*0.5)*15); textSize(11);
  text("click once  ·  click rapidly  ·  wait",width/2,584);
}
function mousePressed() {
  let now=millis(), timeGap=now-lastClickTime;
  if (timeGap<1200) recentClicks++; else recentClicks=1;
  lastClickTime=now;
  if (recentClicks>=5) { state="impatient"; drawCardFromGroup("bad"); return; }
  if (isShowingResult) return;
  state="normal"; drawCardFromGroup("good");
}
function drawCardFromGroup(group) {
  cardRevealT=0; circleT=0;
  let th;
  if (group==="good") { cardName=random(goodCards); cardLevel="good"; message="The system gives a quiet yes."; th=themes.good; }
  else if (group==="neutral") { cardName=random(neutralCards); cardLevel="neutral"; message="The system reads your hesitation."; th=themes.neutral; }
  else { cardName=random(badCards); cardLevel="bad"; message="The system becomes less patient."; th=themes.bad; }
  subMessage=cardMeanings[cardName];
  bgFlashColor=th.flash; bgFlashAlpha=90;
  let roseColors=[[123,94,167],[64,196,200],[200,41,75],[240,238,245],[232,84,138]];
  for (let i=0;i<16;i++) {
    let rc=roseColors[floor(random(roseColors.length))];
    particles.push({ x:random(width*0.25,width*0.75), y:random(height*0.3,height*0.65), vx:random(-1,1), vy:random(-2.2,-0.3), size:random(1.5,4), alpha:random(100,200), life:1, decay:random(0.007,0.016), col:rc });
  }
  resultStartTime=millis(); isShowingResult=true;
}
