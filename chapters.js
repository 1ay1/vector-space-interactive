/* ============================================================
   chapters.js — the 12-chapter course. Each chapter:
   { id, title, sub, render(root) }  builds DOM into root.
   Uses VS engine widgets.
   ============================================================ */
'use strict';

const CHAPTERS = (() => {
const {el,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,clamp,fmt,C,randUnit}=VS;

/* shared helpers for chapter chrome */
function head(root, n, title, sub){
  root.append(el('div','eyebrow',`Chapter ${n}`));
  root.append(el('h1',null,title));
  root.append(el('p','lead-big',sub));
}
function box(kind,tag,html){const b=el('div','box '+kind);b.append(el('div','box-tag',tag));b.insertAdjacentHTML('beforeend',html);return b;}
function lab(title,badge='Play',cls=''){const l=el('div','lab');
  const h=el('div','lab-head');h.append(el('span','lab-badge '+cls,badge),el('span','lab-title',title));l.append(h);return l;}
function p(html){return el('p',null,html);}
function h2(t){return el('h2',null,t);}
function h3(t){return el('h3',null,t);}

/* ============================================================ 1 */
const c1={id:'what',title:'What a vector actually is',sub:'Forget arrows for a minute. A vector is a list of numbers you can adjust — and you already think this way every single day.',
render(root){
  head(root,1,c1.title,c1.sub);
  root.append(p('Here is the whole secret of the subject, stated once, plainly:'));
  root.append(box('key','the one idea','<b>A vector is a fixed list of numbers. Each number is an independent thing you can change. The <span class="aha">dimension</span> is just how many numbers are in the list.</b>'));
  root.append(p('A colour is three numbers — how much red, green, blue. So a colour <b>is</b> a 3-dimensional vector, and the space of all colours is a 3D space. Let\'s prove it with your finger.'));

  const L=lab('A colour is 3 numbers');
  L.append(box('ask','predict first','The swatch starts orange <code>(228, 87, 46)</code>. If you drag <em>only</em> the green knob to the top, what colour appears? Guess — then do it.'));
  const stage=el('div','stage');
  const knobs=el('div','knobs');
  const right=el('div');right.style.cssText='display:flex;flex-direction:column;gap:14px;align-items:center';
  const sw=el('div','swatch');const ro=el('div','readout','(228, 87, 46)');
  right.append(sw,ro);
  const rgb={r:228,g:87,b:46};
  const nar=narrate('Drag a knob — I\'ll tell you what changed.');
  function upd(which){
    sw.style.background=`rgb(${rgb.r},${rgb.g},${rgb.b})`;
    ro.textContent=`(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if(which)nar.say(`You turned <span class="k">${which}</span>. Only that one number moved — the other two didn't budge. <span class="g">That's what "independent" means.</span>`);
  }
  knobs.append(knob({label:'red',color:C.accent,value:228,onInput:v=>{rgb.r=v;upd('red');}}));
  knobs.append(knob({label:'green',color:C.accentc,value:87,onInput:v=>{rgb.g=v;upd('green');}}));
  knobs.append(knob({label:'blue',color:C.accentb,value:46,onInput:v=>{rgb.b=v;upd('blue');}}));
  stage.append(knobs,right);L.append(stage,nar);
  L.append(box('aha-box','so that\'s what it means','You just moved a point around a 3-dimensional space with your finger. Each knob is one dimension. Notice you never "pictured 3D" as a shape — you turned three knobs. <span class="aha">That same move works with 3 knobs or 3 million.</span>'));
  root.append(L);

  root.append(h3('Everyday things that are secretly vectors'));
  root.append(el('ul',null,`
    <li><b>A coffee order</b> — (shots, syrup pumps, oz of milk). A 3-vector.</li>
    <li><b>The coins in your pocket</b> — (£1s, 50ps, 20ps, pennies). A 4-vector.</li>
    <li><b>A song's audio</b> — the air-pressure at each instant. A ~44,100-per-second vector.</li>
    <li><b>A photo</b> — one brightness number per pixel. A few-million-vector.</li>`));

  root.append(quiz({question:'If a colour needs 3 numbers and a grayscale photo needs one number per pixel, how many dimensions is a 1000×1000 grayscale photo?',
    options:[
      {t:'3 — it\'s still just a picture',ok:false,why:'The 3 was specific to colour. Grayscale uses one number (brightness) per pixel.'},
      {t:'1,000,000 — one number per pixel',ok:true,why:'Exactly. A million pixels = a million-dimensional vector. Nothing about the idea changed — just the length of the list.'},
      {t:'1000 — the width of the image',ok:false,why:'Careful: it\'s 1000×1000 pixels total = a million numbers.'}]}));
  root.append(box('trap','the trap to avoid','"A million dimensions must be impossibly hard to think about." It isn\'t — you just did it above. It\'s a longer list. You never needed to <em>see</em> it; you only needed to set the numbers.'));
}};

/* ============================================================ 2 */
const c2={id:'arrows',title:'Vectors as arrows',sub:'For 2 and 3 numbers, a vector has a second life as an arrow. Same information, friendlier picture — but watch where the picture will fail us later.',
render(root){
  head(root,2,c2.title,c2.sub);
  root.append(p('A 2-number vector <code>(x, y)</code> can be drawn as an arrow from the origin: go <em>x</em> right, then <em>y</em> up. Drag the arrow\'s tip and watch its two numbers change.'));
  const L=lab('Drag the arrow','Play');
  const ro=el('div','readout','v = (3, 2)');
  const nar=narrate('Drag the orange tip around the grid.');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'v'}],snap:true,onChange:a=>{
    const v=a[0];ro.textContent=`v = (${fmt(v.x)}, ${fmt(v.y)})`;
    let q = v.x>=0&&v.y>=0?'upper-right':v.x<0&&v.y>=0?'upper-left':v.x<0&&v.y<0?'lower-left':'lower-right';
    nar.say(`The arrow is the list <span class="k">(${fmt(v.x)}, ${fmt(v.y)})</span> — ${fmt(v.x)} across, ${fmt(v.y)} up. Pointing to the ${q}.`);
  }});
  const stage=el('div','stage');const g=el('div','grow');g.append(ro);stage.append(board,g);
  L.append(stage,nar);
  L.append(box('aha-box','the key realization','The arrow and the pair of numbers are the <em>same thing</em>. The arrow is just the list, drawn. Everything we do to arrows, we\'re really doing to the numbers.'));
  root.append(L);
  root.append(box('key','remember','An arrow is a <b>direction and a length</b> bundled together — and both are captured completely by the list of numbers. Move the tip, the numbers move. Change the numbers, the tip moves.'));
  root.append(box('trap','watch this','The arrow picture is lovely for 2 and 3 numbers. But it <em>secretly needs your eyes</em> — and your eyes give out at 3 numbers. In Chapter 10 we drop the arrow and keep the list. The list never needed your eyes.'));
  root.append(quiz({question:'You drag the tip to (0, 0). What is this vector?',
    options:[
      {t:'The "zero vector" — no direction, no length',ok:true,why:'Right. Every vector space has one. It\'s the "do nothing" vector — add it and nothing changes.'},
      {t:'It\'s not a vector anymore',ok:false,why:'It still is! (0,0) is a perfectly good vector — the special one with all-zero entries.'},
      {t:'An error',ok:false,why:'Nope — the origin arrow is the zero vector, a genuine and important member of the space.'}]}));
}};

/* ============================================================ 3 */
const c3={id:'add',title:'Adding vectors',sub:'The first of only two operations you ever need. And it\'s something you\'ve done since you could count: combine two lists.',
render(root){
  head(root,3,c3.title,c3.sub);
  root.append(p('To add two vectors, add them <b>line by line</b>. That\'s the entire rule. Your 6 eggs + their 4 eggs = 10 eggs; milk with milk; nothing else moves.'));
  const L1=lab('Add two shopping lists');
  L1.append(box('ask','watch for','Does the <em>eggs</em> line ever change the <em>milk</em> line? It can\'t — and that\'s exactly why dimension never matters.'));
  L1.append(listAdd({items:['eggs','milk','bread','coffee','apples'],a:[6,2,1,4,3],b:[4,1,3,0,5]}));
  L1.append(box('aha-box','why this scales forever','Because no line looks at its neighbours, the <em>identical</em> procedure works for 5 lines or 5 billion. A rule that treats each line on its own literally cannot tell how long the list is.'));
  root.append(L1);

  root.append(h3('The same thing, as arrows: tip-to-tail'));
  root.append(p('Drawn as arrows, adding means: walk along the first arrow, then walk along the second from where you landed. The single arrow from start to finish is the sum. Drag either arrow.'));
  const L2=lab('Tip-to-tail','See','see');
  const ro=el('div','readout','');
  const nar=narrate('Drag the blue or teal arrow.');
  const board=vboard({arrows:[
    {x:2,y:1,color:C.accentb,label:'a'},
    {x:1,y:2,color:C.accentc,label:'b'}],snap:true,
    extra:(ctx,toPx,arrows)=>{
      const a=arrows[0],b=arrows[1];
      // b drawn from tip of a (ghost)
      const [ax,ay]=toPx(a.x,a.y), [sx,sy]=toPx(a.x+b.x,a.y+b.y);
      ctx.strokeStyle=C.accentc;ctx.setLineDash([5,4]);ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(sx,sy);ctx.stroke();ctx.setLineDash([]);
      // sum arrow
      ctx.strokeStyle=C.accent;ctx.fillStyle=C.accent;ctx.lineWidth=3.5;
      const [ox,oy]=toPx(0,0);
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(sx,sy);ctx.stroke();
      const ang=Math.atan2(sy-oy,sx-ox),s=12;
      ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-s*Math.cos(ang-0.42),sy-s*Math.sin(ang-0.42));
      ctx.lineTo(sx-s*Math.cos(ang+0.42),sy-s*Math.sin(ang+0.42));ctx.closePath();ctx.fill();
    },
    onChange:a=>{const s={x:a[0].x+a[1].x,y:a[0].y+a[1].y};
      ro.innerHTML=`(${fmt(a[0].x)}, ${fmt(a[0].y)}) + (${fmt(a[1].x)}, ${fmt(a[1].y)}) = <b style="color:var(--accent)">(${fmt(s.x)}, ${fmt(s.y)})</b>`;
      nar.say(`Tip-to-tail lands at <span class="k">(${fmt(s.x)}, ${fmt(s.y)})</span> — which is exactly ${fmt(a[0].x)}+${fmt(a[1].x)} across and ${fmt(a[0].y)}+${fmt(a[1].y)} up. The picture and the line-by-line sum agree, always.`);
    }});
  const stage=el('div','stage');const g=el('div','grow');g.append(ro);stage.append(board,g);
  L2.append(stage,nar);root.append(L2);
  root.append(quiz({question:'(3, −1, 5) + (−3, 1, −5) = ?',
    options:[
      {t:'(0, 0, 0) — the zero vector',ok:true,why:'Yes! These two are opposites; each line cancels. b is called the "negative" of a — every vector has one.'},
      {t:'(6, −2, 10)',ok:false,why:'That would be a+a. Add line by line: 3+(−3)=0, and so on.'},
      {t:'(0, 0, 10)',ok:false,why:'Check the last line: 5+(−5)=0, not 10.'}]}));
}};

/* ============================================================ 4 */
const c4={id:'scale',title:'Scaling vectors',sub:'The second and last operation. Multiply a whole vector by one number — and you\'ve met the brightness slider in every photo app.',
render(root){
  head(root,4,c4.title,c4.sub);
  root.append(p('To <b>scale</b> a vector by a number, multiply every line by that number. Double it → everything doubles. Times ½ → everything halves. Times −1 → it flips to point the opposite way.'));

  const L=lab('Brightness = scaling a photo');
  L.append(box('ask','predict','This face is an 11×11 grid — a <b>121-dimensional</b> vector. What appears at scale <b>0×</b>? At <b>2×</b>?'));
  const canvas=el('canvas');canvas.width=200;canvas.height=200;const ctx=VS.hidpi(canvas);
  const N=11,cell=200/N,base=[];
  for(let y=0;y<N;y++){base[y]=[];for(let x=0;x<N;x++){
    const dx=x-5,dy=y-5,r=Math.hypot(dx,dy);let v=45+150*Math.max(0,1-r/6);
    if(y===3&&(x===3||x===7))v=235; if(y===8&&x>=3&&x<=7)v=225; base[y][x]=Math.round(v);}}
  const nar=narrate('');
  function draw(s){for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=clamp(Math.round(base[y][x]*s),0,255);
    ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}
    const msg = s===0?'<span class="r">Every pixel is now 0 — pure black. That\'s the <b>zero vector</b>.</span>':
      s<1?'Every pixel shrank toward 0 — the photo darkens.':
      s>1?'Every pixel grew (and clipped at white) — the photo brightens.':'Original.';
    nar.say(`scale = <span class="k">${s.toFixed(2)}×</span>. ${msg}`);}
  const row=rangeRow({label:'scale factor',min:0,max:2,step:0.01,value:1,fmt:v=>v.toFixed(2)+'×',onInput:draw});
  const stage=el('div','stage');const g=el('div','grow');g.append(nar);stage.append(canvas,g);
  L.append(row,stage);draw(1);
  L.append(box('aha-box','one number, 121 pixels','You just reached into 121 numbers at once with a single slider. Your real photo app does this to a few <em>million</em> pixels every time you drag "brightness." <span class="aha">Same move, more lines, no extra difficulty.</span>'));
  root.append(L);

  root.append(h3('Scaling an arrow: stretch, don\'t steer'));
  root.append(p('Drag the slider and watch: positive scaling changes the <em>length</em> but not the <em>direction</em>. Negative flips it.'));
  const L2=lab('Stretch vs steer','See','see');
  const ro=el('div','readout','');const nar2=narrate('');
  const base2={x:2,y:1};let k=1.5;
  const board=vboard({arrows:[{x:3,y:1.5,color:C.accent,label:'k·v',draggable:false},{x:2,y:1,color:C.accentb,label:'v',draggable:false}],
    extra:()=>{}});
  function apply(kk){k=kk;board.api.arrows[0].x=base2.x*k;board.api.arrows[0].y=base2.y*k;board.api.render();
    ro.innerHTML=`${k.toFixed(2)} · (2, 1) = <b style="color:var(--accent)">(${(2*k).toFixed(1)}, ${(1*k).toFixed(1)})</b>`;
    nar2.say(k<0?`<span class="r">Negative — the arrow flipped to point the opposite way.</span>`:
      k===0?'Zero — the arrow collapsed to the origin (the zero vector).':
      `Same direction as v, just <span class="k">${k.toFixed(2)}×</span> as long. Direction locked, only length changed.`);}
  const row2=rangeRow({label:'scale k',min:-2,max:2,step:.05,value:1.5,fmt:v=>v.toFixed(2),onInput:apply});
  const stage2=el('div','stage');const g2=el('div','grow');g2.append(ro);stage2.append(board,g2);
  L2.append(row2,stage2,nar2);apply(1.5);root.append(L2);
  root.append(box('trap','the trap','"Scaling makes it point somewhere new." No — positive scaling only changes length; the direction is locked because every line grows by the same factor, so their ratios stay fixed. Stretch ≠ steer.'));
  root.append(quiz({question:'Scaling a vector by 0 gives…',
    options:[{t:'the zero vector',ok:true,why:'Every line × 0 = 0. You always land on the origin, no matter what you started with.'},
      {t:'the same vector',ok:false,why:'That\'s scaling by 1. Zero wipes every line to 0.'},
      {t:'an error',ok:false,why:'Perfectly legal — it just gives the zero vector.'}]}));
}};

/* ============================================================ 5 */
const c5={id:'span',title:'Combinations & span',sub:'Mix the two moves — scale, then add — and you can reach new places. The set of everywhere you can reach is called the span. This is the big one.',
render(root){
  head(root,5,c5.title,c5.sub);
  root.append(p('A <span class="term">linear combination</span> is just: take some of this vector, some of that vector, and add. Like a recipe — 3 scoops of <b>a</b>, 2 scoops of <b>b</b>. The set of <em>every</em> point you can reach this way is the <span class="term">span</span>.'));
  const L=lab('Reach a target by mixing two vectors');
  L.append(box('ask','try it','Set the two dials to hit the star. You\'re choosing "how much a" and "how much b." Can you always reach it? What if the star moves off the line?'));
  const target={x:2.5,y:1.5};
  let ca=1,cb=1;
  const av={x:2,y:0.5}, bv={x:0.5,y:2};
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[
      {x:av.x,y:av.y,color:C.accentb,label:'a',draggable:false},
      {x:bv.x,y:bv.y,color:C.accentc,label:'b',draggable:false}],
    extra:(ctx,toPx)=>{
      // scaled a
      const [ox,oy]=toPx(0,0);
      const pa={x:av.x*ca,y:av.y*ca};
      const res={x:av.x*ca+bv.x*cb,y:av.y*ca+bv.y*cb};
      const [pax,pay]=toPx(pa.x,pa.y),[rx,ry]=toPx(res.x,res.y);
      ctx.strokeStyle=C.accentb;ctx.globalAlpha=.4;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(pax,pay);ctx.stroke();
      ctx.strokeStyle=C.accentc;ctx.beginPath();ctx.moveTo(pax,pay);ctx.lineTo(rx,ry);ctx.stroke();
      ctx.globalAlpha=1;
      // result dot
      ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(rx,ry,6,0,7);ctx.fill();
      // target star
      const [tx,ty]=toPx(target.x,target.y);
      ctx.fillStyle=C.gold;ctx.font='20px sans-serif';ctx.fillText('★',tx-8,ty+7);
    }});
  function upd(){
    const res={x:av.x*ca+bv.x*cb,y:av.y*ca+bv.y*cb};
    board.api.render();
    const hit=Math.hypot(res.x-target.x,res.y-target.y)<0.15;
    ro.innerHTML=`${ca.toFixed(2)}·a + ${cb.toFixed(2)}·b = <b style="color:var(--accent)">(${res.x.toFixed(2)}, ${res.y.toFixed(2)})</b>`;
    nar.say(hit?`<span class="g">Bullseye!</span> That combination reaches the star. With two independent vectors you can reach <b>every</b> point in the plane — their span is the whole 2D space.`
      :`Result at <span class="k">(${res.x.toFixed(2)}, ${res.y.toFixed(2)})</span>. Keep adjusting the two dials.`);
  }
  const rA=rangeRow({label:'how much a',min:-2,max:2,step:.05,value:1,fmt:v=>v.toFixed(2),onInput:v=>{ca=v;upd();}});
  const rB=rangeRow({label:'how much b',min:-2,max:2,step:.05,value:1,fmt:v=>v.toFixed(2),onInput:v=>{cb=v;upd();}});
  const stage=el('div','stage');const g=el('div','grow');g.append(ro,rA,rB);stage.append(board,g);
  L.append(stage,nar);upd();root.append(L);
  root.append(box('aha-box','what "span" means','The <span class="term">span</span> of some vectors is every point you can reach by scaling and adding them. Two arrows that point different ways span the <em>whole plane</em> — you can reach anywhere. That\'s the deepest idea in the subject, and you just felt it.'));
  root.append(box('trap','the exception','If a and b point the <em>same</em> way (one is a scaled copy of the other), you can only ever land <em>on that line</em> — their span collapses to a line, not the whole plane. That "redundancy" is the subject of Chapter 9.'));
  root.append(quiz({question:'Two vectors point in different directions in 2D. What is their span?',
    options:[{t:'The entire 2D plane',ok:true,why:'Yes — two genuinely different directions let you reach anywhere by mixing them. They form a basis for the plane.'},
      {t:'Just a line',ok:false,why:'That only happens if they point the same (or opposite) way. Different directions → the whole plane.'},
      {t:'Only the points between them',ok:false,why:'Scaling can be negative and >1, so you escape the region "between" them and fill the whole plane.'}]}));
}};

/* ============================================================ 6 */
const c6={id:'basis',title:'Basis & coordinates',sub:'Plot twist: the numbers in a vector depend on the "rulers" you chose. Change the rulers, the numbers change — but the vector doesn\'t move.',
render(root){
  head(root,6,c6.title,c6.sub);
  root.append(p('When you write a vector as <code>(3, 2)</code>, you secretly mean "3 of the right-ruler + 2 of the up-ruler." Those rulers are a choice, called a <span class="term">basis</span>. Pick different rulers and the <em>same point</em> gets different numbers.'));
  const L=lab('Same point, two sets of rulers','See','see');
  const pt={x:3,y:2};
  const nar=narrate('');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'p'}],snap:true,
    extra:(ctx,toPx)=>{
      // standard rulers (blue)
      const [ox,oy]=toPx(0,0),[e1x,e1y]=toPx(1,0),[e2x,e2y]=toPx(0,1);
      ctx.strokeStyle=C.accentb;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(e1x,e1y);ctx.moveTo(ox,oy);ctx.lineTo(e2x,e2y);ctx.stroke();
      // diagonal rulers (violet): u1=(1,1), u2=(-1,1)
      const [d1x,d1y]=toPx(1,1),[d2x,d2y]=toPx(-1,1);
      ctx.strokeStyle=C.accentd;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(d1x,d1y);ctx.moveTo(ox,oy);ctx.lineTo(d2x,d2y);ctx.stroke();
    },
    onChange:a=>{
      const v=a[0];
      // standard coords = (x,y). diagonal coords solve c1(1,1)+c2(-1,1)=(x,y)
      const c1=(v.x+v.y)/2, c2=(v.y-v.x)/2;
      nar.say(`Same arrow, two readings:<br>• in <span style="color:var(--accentb);font-weight:700">standard rulers</span>: (${fmt(v.x)}, ${fmt(v.y)})<br>• in <span style="color:var(--accentd);font-weight:700">diagonal rulers</span>: (${fmt(c1)}, ${fmt(c2)}). <span class="g">The point never moved — only the numbers did.</span>`);
    }});
  const stage=el('div','stage');stage.append(board,el('div','grow'));
  L.append(stage,nar);root.append(L);
  root.append(box('aha-box','the big realization','A vector is the underlying <em>thing</em>; its list of numbers is only its <em>shadow</em> in the rulers you picked. This is why "why did my numbers change?!" confuses people — the answer is always "you changed rulers."'));
  root.append(box('key','why bother','Choosing clever rulers turns hard problems easy. JPEG re-describes your photo in "wavy pattern" rulers where most numbers become ~0 and can be thrown away — that\'s image compression. Noise-cancelling headphones pick rulers where "engine drone" is one number, then zero it.'));
  root.append(quiz({question:'You re-describe a vector in a new basis and all its numbers change. Did the vector change?',
    options:[{t:'No — only its coordinates (its "shadow") changed',ok:true,why:'Exactly. The vector is basis-independent; the numbers are just how you read it in chosen rulers.'},
      {t:'Yes — different numbers means different vector',ok:false,why:'This is the classic trap. The point stayed put; you only changed the rulers you measure it with.'}]}));
}};

/* ============================================================ 7 */
const c7={id:'length',title:'Length & distance',sub:'Geometry survives into any dimension. Length is just Pythagoras with more plus signs — and it powers "how similar are these two things?"',
render(root){
  head(root,7,c7.title,c7.sub);
  root.append(p('The length of a vector is <code>√(sum of each number squared)</code>. In 2D that\'s the hypotenuse — Pythagoras. In a million dimensions it\'s the exact same recipe, just a longer sum.'));
  const L=lab('Live Pythagoras','See','see');
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'v'}],snap:true,
    extra:(ctx,toPx,arrows)=>{const v=arrows[0];const[ox,oy]=toPx(0,0),[vx,vy]=toPx(v.x,v.y),[cx,cy]=toPx(v.x,0);
      ctx.strokeStyle=C.accentb;ctx.setLineDash([4,3]);ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(cx,cy);ctx.lineTo(vx,vy);ctx.stroke();ctx.setLineDash([]);},
    onChange:a=>{const v=a[0];const len=Math.hypot(v.x,v.y);
      ro.innerHTML=`length = √(${fmt(v.x)}² + ${fmt(v.y)}²) = <b style="color:var(--accent)">${len.toFixed(2)}</b>`;
      nar.say(`Square each number, add, square-root: <span class="k">√(${(v.x*v.x).toFixed(1)} + ${(v.y*v.y).toFixed(1)}) = ${len.toFixed(2)}</span>. The dashed legs are the triangle — but you didn't need the picture, only the arithmetic.`);
    }});
  const stage=el('div','stage');const g=el('div','grow');g.append(ro);stage.append(board,g);
  L.append(stage,nar);root.append(L);
  root.append(box('aha-box','distance = length of the difference','How far apart are two vectors? Subtract them (line by line) and take the length. That\'s <em>literally</em> how your photo app decides two images are similar: turn each into a vector, subtract, measure. Small distance = alike.'));
  root.append(quiz({question:'Length of the 4-D vector (1, 2, 2, 4)?',
    options:[{t:'5',ok:true,why:'√(1+4+4+16) = √25 = 5. You just measured a distance in a space you can\'t see — with grade-school arithmetic.'},
      {t:'9',ok:false,why:'That\'s 1+2+2+4 (adding, not squaring). Square each first: 1+4+4+16=25, √25=5.'},
      {t:'√9 = 3',ok:false,why:'Re-add the squares: 1+4+4+16 = 25, not 9. So the length is 5.'}]}));
}};

/* ============================================================ 8 */
const c8={id:'dot',title:'Dot product & angle',sub:'One number that tells you whether two vectors agree, are unrelated, or clash. This runs search engines, recommendations, and face unlock.',
render(root){
  head(root,8,c8.title,c8.sub);
  root.append(p('The <span class="term">dot product</span> is: multiply matching numbers, add them up. Its <b>sign</b> tells you the relationship — <span class="sign pos">＋ agree</span>, <span class="sign zero">0 unrelated</span>, <span class="sign neg">－ clash</span>.'));
  const L=lab('Rotate an arrow, watch the sign flip','See','see');
  L.append(box('ask','find the flip','Drag the orange arrow from lined-up-with-blue around to opposite. Find the <em>exact</em> spot the sign flips ＋→−. (It\'s 90° — perpendicular means unrelated.)'));
  const ro=el('div','readout','');const nar=narrate('');
  let ang=Math.PI*0.2;
  const board=vboard({showGrid:false,arrows:[
      {x:2,y:0,color:C.accentb,label:'reference',draggable:false},
      {x:2*Math.cos(ang),y:2*Math.sin(ang),color:C.accent,label:'drag me'}],
    onChange:a=>{
      // keep orange at length ~2, only angle matters
      const o=a[1];const L2=Math.hypot(o.x,o.y)||1; o.x=o.x/L2*2;o.y=o.y/L2*2;
      const ux=o.x/2,uy=o.y/2; const dot=1*ux+0*uy; // reference unit (1,0)
      const deg=Math.acos(clamp(dot,-1,1))*180/Math.PI;
      let cls,txt;
      if(dot>0.15){cls='pos';txt='＋ positive → they broadly AGREE';}
      else if(dot<-0.15){cls='neg';txt='－ negative → they CLASH (opposite-ish)';}
      else{cls='zero';txt='≈0 → perpendicular → UNRELATED';}
      ro.innerHTML=`dot ≈ <b>${dot.toFixed(2)}</b> &nbsp; angle ≈ ${deg.toFixed(0)}°`;
      nar.say(`<span class="sign ${cls}">${cls==='pos'?'＋':cls==='neg'?'－':'0'}</span> ${txt}.`);
    }});
  const stage=el('div','stage');const g=el('div','grow');g.append(ro);stage.append(board,g);
  L.append(stage,nar);root.append(L);
  root.append(box('aha-box','why this rules the internet','"Which direction" survives into any dimension. Turn two photos into 500-number vectors, take their dot product: positive = similar, near-zero = unrelated. That\'s <em>cosine similarity</em>, run billions of times a day. You can\'t picture 500-D arrows — the dot product measures their angle anyway.'));
  root.append(quiz({question:'Two vectors have a dot product of exactly 0. They are…',
    options:[{t:'perpendicular / unrelated',ok:true,why:'Right. Zero dot product = a right angle = "these share nothing in common direction-wise."'},
      {t:'identical',ok:false,why:'Identical vectors have a large positive dot product, not zero.'},
      {t:'opposite',ok:false,why:'Opposite vectors have a negative dot product. Zero means perpendicular.'}]}));
}};

/* ============================================================ 9 */
const c9={id:'independence',title:'When a vector is redundant',sub:'Linear independence, made obvious: a vector is "redundant" if you could already reach it with the ones you had. This is what "true dimension" really counts.',
render(root){
  head(root,9,c9.title,c9.sub);
  root.append(p('You have vector <b>a</b>. A second vector <b>b</b> is <span class="term">redundant</span> (dependent) if it points along the same line — because then it reaches nowhere new. It\'s <span class="term">independent</span> if it opens up a genuinely new direction.'));
  const L=lab('Independent or redundant?','See','see');
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[
      {x:2,y:1,color:C.accentb,label:'a'},
      {x:1.4,y:2,color:C.accentc,label:'b'}],snap:true,
    extra:(ctx,toPx,arrows)=>{
      // shade span: if independent -> whole plane tint; if collinear -> line
      const a=arrows[0],b=arrows[1];
      const cross=a.x*b.y-a.y*b.x;
      if(Math.abs(cross)<0.25){ // near collinear -> draw the line they span
        const [ox,oy]=toPx(0,0);const ang=Math.atan2(a.y,a.x);
        const far=600;ctx.strokeStyle=C.accent;ctx.globalAlpha=.3;ctx.lineWidth=10;
        ctx.beginPath();ctx.moveTo(ox-far*Math.cos(ang),oy+far*Math.sin(ang));
        ctx.lineTo(ox+far*Math.cos(ang),oy-far*Math.sin(ang));ctx.stroke();ctx.globalAlpha=1;
      }
    },
    onChange:a=>{const cross=a[0].x*a[1].y-a[0].y*a[1].x;
      const dep=Math.abs(cross)<0.25;
      ro.innerHTML=dep?'<b style="color:var(--accent)">REDUNDANT</b> — b lies on a\'s line':'<b style="color:var(--accentc)">INDEPENDENT</b> — new direction';
      nar.say(dep?`<span class="r">b is redundant.</span> It points along a\'s line, so a and b together still only reach that <b>1D line</b> (highlighted). Their true dimension is 1, not 2.`
        :`<span class="g">b is independent.</span> It opens a new direction, so together they reach the <b>whole 2D plane</b>. True dimension = 2.`);
    }});
  const stage=el('div','stage');const g=el('div','grow');g.append(ro);stage.append(board,g);
  L.append(stage,nar);root.append(L);
  root.append(box('aha-box','what dimension really counts','Dimension isn\'t "how many vectors you have" — it\'s how many <em>independent</em> ones. Ten vectors all on one line still only span a line (dimension 1). The number of genuinely-new directions is the real dimension.'));
  root.append(box('key','basis, finally precise','A <span class="term">basis</span> is a set of vectors that are (1) independent — none redundant — and (2) span the whole space. It\'s the smallest set of rulers that can reach everywhere. Exactly n of them for an n-dimensional space.'));
  root.append(quiz({question:'You have 5 vectors in 2D. What\'s the most independent ones you can have?',
    options:[{t:'2 — after that, every new vector is reachable from the first two',ok:true,why:'Right. 2D holds at most 2 independent directions; vectors 3,4,5 must be combinations of the first two. That "2" is the dimension.'},
      {t:'5 — you have five vectors',ok:false,why:'Having five doesn\'t make five directions. In 2D, only 2 can be independent; the rest are redundant.'},
      {t:'Unlimited',ok:false,why:'The plane only has 2 independent directions. Any extra vector is a combination of those.'}]}));
}};

/* ============================================================ 10 */
const c10={id:'higherd',title:'The leap past 3D',sub:'Here your eyes tap out — and it doesn\'t matter. You stop watching the vector and start operating it. Nothing else changes.',
render(root){
  head(root,10,c10.title,c10.sub);
  root.append(p('At 3 numbers, the arrow picture dies — you can\'t draw a 4-arrow. This is where most people quit. The fix isn\'t a better brain; it\'s a new <em>habit</em>: drop the arrow, keep the list.'));
  root.append(box('key','the reframe','Below 4 numbers you <b>watch</b> the vector (as an arrow). From 4 up, you <b>operate</b> it (as a list). The math didn\'t get harder — your eyes just stopped being the tool. Switch tools.'));
  const L=lab('Operate a vector you can\'t picture');
  L.append(p('Here\'s a 6-dimensional vector as six sliders. You can\'t draw its arrow — but you can absolutely turn six knobs, add another 6-vector, and read its length. Do it.'));
  const dim=6;let v=[3,1,4,1,5,2],w=[1,2,0,3,1,1];
  const nar=narrate('');
  const ro=el('div','readout','');
  function upd(){ro.textContent='v = ('+v.join(', ')+')';}
  const knobs=el('div','knobs');
  const api=[];
  for(let i=0;i<dim;i++){const k=knob({label:'n'+(i+1),color:[C.accent,C.accentb,C.accentc,C.accentd,C.gold,C.green][i],min:0,max:9,value:v[i],onInput:val=>{v[i]=val;upd();}});api.push(k);knobs.append(k);}
  const addBtn=el('button','btn','+ add w = (1,2,0,3,1,1)');
  const lenBtn=el('button','btn ghost','measure length');
  const ctr=el('div','controls');ctr.append(addBtn,lenBtn);
  addBtn.onclick=()=>{v=v.map((x,i)=>x+w[i]);v=v.map(x=>clamp(x,0,9));api.forEach((k,i)=>k.api.set(v[i]));upd();
    nar.say(`Added <span class="k">w</span> line by line. New v = (${v.join(', ')}). Six separate sums — you just did 6-D vector addition without a single picture.`);};
  lenBtn.onclick=()=>{const len=Math.sqrt(v.reduce((s,x)=>s+x*x,0));
    nar.say(`length = √(${v.map(x=>x+'²').join(' + ')}) = <b>${len.toFixed(2)}</b>. Pythagoras in 6 dimensions. It just works.`);};
  L.append(knobs,ctr,ro,nar);upd();root.append(L);
  root.append(box('aha-box','the whole point','You just added and measured a 6-dimensional vector as comfortably as a 2D one — because the operations only ever touch one number at a time. <span class="aha">"100-dimensional" just means "a list with 100 lines." Instantly comfortable, completely correct.</span>'));
  root.append(quiz({question:'What\'s the honest way to "picture" a 50-dimensional vector?',
    options:[{t:'Don\'t picture it — treat it as a list of 50 numbers and operate on them',ok:true,why:'Yes. That\'s exactly what mathematicians and ML engineers do. The list is the tool; the picture was optional all along.'},
      {t:'Squint really hard until you see 50 axes',ok:false,why:'Nobody can, and nobody needs to. The arrow was only ever a crutch for tiny dimensions.'},
      {t:'Imagine 3D moving through time 47 times',ok:false,why:'A fun idea, but you don\'t need any of it — a 50-number list is complete on its own.'}]}));
}};

/* ============================================================ 11 */
const c11={id:'weird',title:'Where your 3D gut lies',sub:'The comforting story was 90% true. Here\'s the mind-bending 10% — the geometry of high dimensions is genuinely strange, and that strangeness powers modern AI.',
render(root){
  head(root,11,c11.title,c11.sub);
  root.append(p('The <em>arithmetic</em> of high-D is boring and familiar (add, scale, measure). But the <em>geometry</em> gets weird. Exhibit A: random directions.'));
  const L=lab('Almost everything is perpendicular','Weird','weird');
  L.append(box('ask','predict','In 1000 dimensions, two <em>random</em> arrows — do they tend to point a similar way, opposite ways, or at right angles? Guess, then drag the dimension slider up.'));
  L.append(orthoLab());
  L.append(box('aha-box','the weirdness is the feature','As dimension grows, random vectors crowd toward 90° — nearly everything is perpendicular to everything. That\'s <em>why</em> AI works: high-D has room for millions of near-orthogonal "concepts" that barely interfere. Your 3D gut said "no way"; the formula said "yes," and up here the formula wins.'));
  root.append(L);
  root.append(h3('Two more facts your gut refuses to believe'));
  root.append(el('ul',null,`
    <li><b>The orange is all peel.</b> In 100-D, over 99% of a ball\'s volume sits in its outer 5% shell. The "juicy middle" essentially vanishes.</li>
    <li><b>The box is all corners.</b> In 10-D, the ball inside a box fills only 0.25% of it — 99.75% of the box lives out in corners the ball can\'t reach.</li>`));
  root.append(box('key','the mature takeaway','The recipes (add, scale, length, dot product) stay <em>perfect</em> in every dimension. What breaks is your <em>expectation</em> about the results. Keep the list and the knobs for doing the math — and a third rule: don\'t trust your 3D gut about volumes, corners, and angles. Up here, the formula is your eyes.'));
  root.append(quiz({question:'Why is "almost everything is perpendicular" actually useful?',
    options:[{t:'High-D has room for millions of near-orthogonal directions, so distinct concepts barely interfere',ok:true,why:'Exactly — it\'s the backbone of word/image embeddings. Independence comes almost for free in high dimensions.'},
      {t:'It isn\'t useful, just a curiosity',ok:false,why:'It\'s one of the load-bearing facts of modern ML — it\'s why embeddings can pack so much meaning.'},
      {t:'It makes vectors easier to draw',ok:false,why:'You still can\'t draw them — but you can pack a lot of nearly-independent meaning into them, which is the real win.'}]}));
}};

/* ============================================================ 12 */
const c12={id:'used',title:'Where this actually lives',sub:'You now own the whole toolkit. Here\'s it running in the real world — and a tiny "similarity search" you can play with.',
render(root){
  head(root,12,c12.title,c12.sub);
  root.append(p('Everything you learned — list, add, scale, length, dot product — is exactly what powers search, recommendations, and AI. Here\'s a toy version: three "documents" as 3-number vectors (how much they\'re about <b>cats</b>, <b>code</b>, <b>cooking</b>). Tune your query and watch which doc wins by <em>angle</em>.'));
  const L=lab('Similarity search, live');
  const docs=[
    {name:'"My cat sat on my keyboard"',v:[0.8,0.5,0.1],color:C.accent},
    {name:'"A recipe for lentil curry"',v:[0.0,0.1,0.95],color:C.accentc},
    {name:'"Debugging a null pointer"',v:[0.05,0.95,0.1],color:C.accentb}];
  const q=[0.7,0.4,0.2];
  const nar=narrate('');
  const bars=el('div');bars.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:6px';
  function cos(a,b){let d=0,na=0,nb=0;for(let i=0;i<3;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}return d/(Math.sqrt(na*nb)||1);}
  function upd(){
    const scored=docs.map(d=>({...d,s:cos(q,d.v)})).sort((a,b)=>b.s-a.s);
    bars.innerHTML='';
    scored.forEach((d,i)=>{const row=el('div');row.style.cssText='display:flex;align-items:center;gap:10px';
      const bar=el('div');bar.style.cssText=`height:20px;border-radius:5px;background:${d.color};width:${Math.max(4,d.s*220)}px;transition:width .2s`;
      row.append(el('div',null,(i===0?'🏆 ':'&nbsp;&nbsp;&nbsp;')+d.name),bar,el('b',null,d.s.toFixed(2)));
      bars.append(row);});
    nar.say(`Your query = (cats ${q[0].toFixed(1)}, code ${q[1].toFixed(1)}, cooking ${q[2].toFixed(1)}). Winner: <span class="k">${scored[0].name}</span> — highest cosine similarity. Change the sliders and the winner changes.`);
  }
  const r1=rangeRow({label:'about cats',min:0,max:1,step:.05,value:q[0],fmt:v=>v.toFixed(2),onInput:v=>{q[0]=v;upd();}});
  const r2=rangeRow({label:'about code',min:0,max:1,step:.05,value:q[1],fmt:v=>v.toFixed(2),onInput:v=>{q[1]=v;upd();}});
  const r3=rangeRow({label:'about cooking',min:0,max:1,step:.05,value:q[2],fmt:v=>v.toFixed(2),onInput:v=>{q[2]=v;upd();}});
  L.append(r1,r2,r3,bars,nar);upd();root.append(L);
  root.append(box('aha-box','that\'s the whole magic trick','Real search engines and chatbots do <em>exactly</em> this — just with vectors of hundreds or thousands of numbers instead of 3, produced by a neural net. "Find similar" = "smallest angle." You now understand the core of it.'));
  root.append(h2('You made it. Here\'s everything, in four lines.'));
  root.append(box('key','the whole subject',`
    <b>• a vector</b> = a list of numbers (equivalently, a row of independent knobs)<br>
    <b>• two moves</b> = add (line by line) and scale (every line by one number)<br>
    <b>• geometry</b> = length is √(sum of squares); direction/similarity is the dot product<br>
    <b>• dimension</b> = how many <em>independent</em> numbers — and it can be 2, 900, or ∞ without changing a thing`));
  root.append(p('<span class="aha" style="font-size:1.1rem">You no longer believe in a magic room you can\'t enter. You just see a longer list. That\'s internalized. That\'s the whole thing.</span>'));
}};

return [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12];
})();
