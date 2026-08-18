/* ============================================================
   chapters.js — the full course.
   Each chapter: { id, part, title, sub, render(root) }.
   Uses the VS engine. Prose aims to make n-D feel like 1/2/3-D.
   ============================================================ */
'use strict';

const CHAPTERS = (() => {
const {el,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,clamp,fmt,C,randUnit,
       numberline,board3d,spanBoard,fourRep,projectionBoard,ladder,
       worked,gallery,matrixBoard,analogyDemo}=VS;

/* ---------- chapter chrome helpers ---------- */
function head(root,n,c){
  if(c.part) root.append(el('div','part-banner',c.part));
  root.append(el('div','eyebrow',`Chapter ${n}`));
  root.append(el('h1',null,c.title));
  root.append(el('p','lead-big',c.sub));
}
function box(kind,tag,html){const b=el('div','box '+kind);b.append(el('div','box-tag',tag));b.insertAdjacentHTML('beforeend',html);return b;}
function lab(title,badge='Play',cls=''){const l=el('div','lab');
  const h=el('div','lab-head');h.append(el('span','lab-badge '+cls,badge),el('span','lab-title',title));l.append(h);return l;}
function p(html){return el('p',null,html);}
function h2(t){return el('h2',null,t);}
function h3(t){return el('h3',null,t);}
function math(tex){const d=el('div','mathblock','$$'+tex+'$$');return d;}
function summary(items){const s=el('div','summary');s.append(el('h4',null,'Lock it in'));
  const ul=el('ul');items.forEach(i=>{const li=el('li');li.innerHTML=i;ul.append(li);});s.append(ul);return s;}
function stageOf(canvas, sideNodes){const s=el('div','stage');const g=el('div','grow');(sideNodes||[]).forEach(n=>g.append(n));s.append(canvas,g);return s;}
function repLegend(){const l=el('div','replegend');
  [['list','var(--ink)'],['arrow','var(--accent)'],['knobs','var(--accentb)'],['point','var(--accentc)']]
    .forEach(([t,c])=>{l.insertAdjacentHTML('beforeend',`<span class="repchip"><span class="dotc" style="background:${c}"></span>${t}</span>`);});
  return l;}

/* ============================================================
   PART 0 — ORIENTATION
   ============================================================ */

const c0={id:'welcome',part:'Part 0 · Orientation',title:'The one idea you\'ll never unsee',
  sub:'Before any math: a single mental image that makes 1, 3, or 3-million dimensions feel like the same easy thing.',
render(root){
  head(root,1,c0);
  root.append(p('Most people meet vectors as arrows in physics class, panic at "the fourth dimension," and quietly decide the subject is not for them. That reaction is 100% avoidable. It comes from <em>one</em> misleading picture, and we\'re going to replace it right now.'));
  root.append(box('key','the whole course in one line','<b>A vector is a list of numbers you can adjust. Each number is an independent thing you can change. The <span class="aha">dimension</span> is just how many numbers are in the list.</b>'));
  root.append(p('That\'s it. Everything else — arrows, length, angle, span, "the 4th dimension," even infinite dimensions — is a consequence of that sentence. You already think in these terms every day:'));
  root.append(el('ul',null,`
    <li>a <b>coffee order</b> — (shots, syrups, oz of milk) — is a 3-number vector,</li>
    <li>the <b>coins in your pocket</b> are a 4-number vector,</li>
    <li>a <b>colour</b> on your screen is a 3-number vector (red, green, blue),</li>
    <li>a <b>photo</b> is a vector with one number per pixel — millions of them.</li>`));
  root.append(el('p','pull','You never once tried to "visualise 4-dimensional coffee." You just set the numbers. That relaxed, number-by-number thinking <em>is</em> how to think in any dimension.'));

  const L=lab('Feel it once: turn three knobs, make a colour');
  L.append(box('ask','predict','The swatch is orange. Drag <em>only</em> the green knob up. What colour appears — before you try it?'));
  const stage=el('div','stage');const knobs=el('div','knobs');
  const right=el('div');right.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center';
  const sw=el('div','swatch');const ro=el('div','readout','(228, 87, 46)');right.append(sw,ro);
  const rgb={r:228,g:87,b:46};const nar=narrate('Drag any knob.');
  function upd(w){sw.style.background=`rgb(${rgb.r},${rgb.g},${rgb.b})`;ro.textContent=`(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if(w)nar.say(`You turned <span class="k">${w}</span> — and <em>only</em> that number moved. <span class="g">That's what "independent" means.</span>`);}
  knobs.append(knob({label:'red',color:C.accent,value:228,onInput:v=>{rgb.r=v;upd('red');}}));
  knobs.append(knob({label:'green',color:C.accentc,value:87,onInput:v=>{rgb.g=v;upd('green');}}));
  knobs.append(knob({label:'blue',color:C.accentb,value:46,onInput:v=>{rgb.b=v;upd('blue');}}));
  stage.append(knobs,right);L.append(stage,nar);root.append(L);
  root.append(box('aha-box','what just happened','You moved a point around a 3-dimensional space with your fingers — no arrows, no "seeing" 3D as a shape. You set three numbers. <span class="aha">The exact same move works for 3 numbers or 3 million.</span>'));
  root.append(h3('A whole world of hidden vectors'));
  root.append(p('Once you see the pattern, vectors are <em>everywhere</em>. Tap each card to reveal the list of numbers hiding inside an everyday thing — and how many dimensions it secretly has.'));
  root.append(gallery([
    {icon:'☕',name:'A coffee order',dims:'3 dimensions',vec:'(2 shots, 1 syrup, 12 oz milk)',note:'change one without touching the others.'},
    {icon:'🎨',name:'A colour',dims:'3 dimensions',vec:'(228, 87, 46) = orange',note:'red, green, blue — your whole screen is a grid of these.'},
    {icon:'💰',name:'Coins in your pocket',dims:'4 dimensions',vec:'(3, 2, 4, 7)',note:'£1s, 50ps, 20ps, pennies.'},
    {icon:'🌦️',name:'Today\'s weather',dims:'4 dimensions',vec:'(22°, 61%, 14 km/h, 1013 hPa)',note:'temperature, humidity, wind, pressure.'},
    {icon:'📷',name:'A phone photo',dims:'~12 million',vec:'(brightness of pixel 1, …, pixel 12M)',note:'one number per pixel. Nobody pictures it — everyone uses it.'},
    {icon:'🎵',name:'One second of audio',dims:'~44,100',vec:'(air pressure at each sample)',note:'a very long list; still just a list.'},
    {icon:'🛒',name:'A grocery cart',dims:'thousands',vec:'(0, …, 6 eggs, …, 2 milk, …)',note:'one slot per product; almost all zero.'},
    {icon:'♟️',name:'A chess position',dims:'64-ish',vec:'(what\'s on each square)',note:'the whole board as one vector.'}]));
  root.append(el('div','pull','Every one of these is a list of numbers you already reason about — \"more shots,\" \"double the recipe,\" \"brighter photo.\" That reasoning <em>is</em> vector math. You were fluent before you knew the word.'));
  root.append(summary([
    'A vector = a list of numbers you can adjust.',
    'Dimension = how many numbers.',
    'You already reason this way (coffee, coins, colour).',
    'The goal of this course: make that reasoning automatic for <em>any</em> number of dimensions.']));
}};

const cRep={id:'four',part:'Part 0 · Orientation',title:'The four faces of a vector',
  sub:'One vector, four ways to see it: a list, an arrow, a bank of knobs, a point. Switching between them fluently is 80% of the skill.',
render(root){
  head(root,2,cRep);
  root.append(p('A vector wears four costumes. They\'re the <em>same information</em> — but each is good at a different job. Learn to flip between them instantly, and higher dimensions stop being scary, because you can always retreat to the costume that still works.'));
  root.append(repLegend());
  root.append(p('Below is <b>one</b> 2D vector shown all four ways at once. Change it in any panel — drag the arrow, turn a knob — and watch the others update in lockstep. They never disagree, because they\'re the same thing.'));
  const L=lab('One vector, four synced views','Play');
  L.append(fourRep({x:3,y:2}));
  root.append(L);
  root.append(el('div','cols2').appendChild(box('key','when each costume wins',`
    <b>List</b> — for <em>computing</em>. You read numbers and do arithmetic.<br>
    <b>Arrow</b> — for <em>direction & length</em> intuition (only up to 3 numbers).<br>
    <b>Knobs</b> — for feeling the numbers are <em>independent</em>.<br>
    <b>Point</b> — for thinking of a vector as a <em>location</em> among all possibilities.`)).parentNode);
  root.append(box('trap','the costume that fails','Only the <b>arrow</b> and <b>point</b> pictures need your eyes — and both die at 3 numbers. The <b>list</b> and <b>knobs</b> never need eyes. So in high dimensions we simply drop the two visual costumes and keep the two that scale forever. Nothing is lost but the pictures.'));
  root.append(summary([
    'Every vector = list = arrow = knobs = point. Same object, four views.',
    'List & knobs work in <em>any</em> dimension; arrow & point only up to 3.',
    'Fluency = switching costumes on demand.']));
}};

/* ============================================================
   PART I — BUILD IT
   ============================================================ */

const c1d={id:'oneD',part:'Part I · Build it',title:'1D — the number line',
  sub:'The simplest vector: a single number. Everything bigger is just more of these, side by side.',
render(root){
  head(root,3,c1d);
  root.append(p('A one-dimensional vector is a single number — how far along a line, sign and all. Positive is one way, negative the other. Drag it.'));
  const nar=narrate('');
  const nl=numberline({value:2,onChange:v=>{nar.say(`v = <span class="k">${fmt(v)}</span>. ${v>0?'Points right.':v<0?'Points left (negative).':'Sitting at the origin — the zero vector.'} Length is just |v| = ${fmt(Math.abs(v))}.`);}});
  const L=lab('Drag a 1D vector');L.append(nl,nar);root.append(L);
  root.append(box('aha-box','why start here','In 1D, "adding vectors" is adding numbers, "scaling" is multiplying, "length" is absolute value. You already mastered 1D vectors in primary school. Every higher dimension just runs this <em>same</em> arithmetic in parallel, once per number.'));
  root.append(math('\\mathbf v = (v_1) \\qquad \\lVert \\mathbf v\\rVert = |v_1|'));
  root.append(summary(['1D vector = one number on a line.','Add = add; scale = multiply; length = absolute value.','Higher-D = many 1D lines running in parallel.']));
}};

const c2d={id:'twoD',part:'Part I · Build it',title:'2D — the plane, and the arrow',
  sub:'Two numbers. Now a vector gets its famous second life as an arrow — beautiful, but watch where it will betray us.',
render(root){
  head(root,4,c2d);
  root.append(p('Add a second number and a vector <code>(x, y)</code> becomes an arrow: go <em>x</em> right, then <em>y</em> up. The arrow and the pair are the same thing — move one, the other moves.'));
  const ro=el('div','readout','v = (3, 2)');const nar=narrate('Drag the tip.');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'v'}],snap:true,onChange:a=>{
    const v=a[0];ro.textContent=`v = (${fmt(v.x)}, ${fmt(v.y)})`;
    nar.say(`<span class="k">(${fmt(v.x)}, ${fmt(v.y)})</span> — ${fmt(v.x)} across, ${fmt(v.y)} up. The arrow is just the list, drawn.`);}});
  const L=lab('Drag the arrow');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('key','remember','An arrow bundles a <b>direction</b> and a <b>length</b>, and both are captured completely by the two numbers. It is a <em>displacement</em> ("go here from there"), which is why the same arrow can start anywhere.'));
  root.append(box('trap','the seed of all confusion','The arrow is lovely — but it secretly needs you to <em>see</em> the whole thing at once. That works for 2 numbers, wobbles at 3, and dies at 4. We will keep the arrow as long as it helps, then let it go. The list never needed your eyes.'));
  root.append(quiz({question:'You drag the tip exactly to the origin, (0,0). What is this?',
    options:[{t:'The zero vector — a real, important vector',ok:true,why:'Yes. Every vector space has exactly one zero vector; it\'s the "do nothing" element. Adding it changes nothing.'},
      {t:'Not a vector anymore',ok:false,why:'It absolutely is — (0,0) is the special all-zeros vector.'}]}));
  root.append(summary(['2D vector = (x, y) = an arrow.','Arrow = direction + length, captured by the numbers.','It\'s a displacement; it can start anywhere.','The arrow picture will fail past 3 numbers — don\'t depend on it.']));
}};

const c3d={id:'threeD',part:'Part I · Build it',title:'3D — the last room you can see',
  sub:'Three numbers, three axes. This is the final dimension your eyes handle — so study exactly how the arrow is built, because the recipe is what carries you past it.',
render(root){
  head(root,5,c3d);
  root.append(p('A 3D vector is three numbers: right, up, and toward-you. Below is a real 3D box you can <b>rotate by dragging</b>. Watch how the arrow is built: go along x, then z, then up y. That "lay each number along its own axis" recipe is the thing that never changes.'));
  const bd=board3d({vec:{x:2,y:1.5,z:1.5}});
  const nar=narrate('Drag to rotate. Move the sliders to change the vector.');
  function set(){const v={x:vx,y:vy,z:vz};bd.api.setVec(v);
    const len=Math.sqrt(vx*vx+vy*vy+vz*vz);
    nar.say(`v = <span class="k">(${fmt(vx)}, ${fmt(vy)}, ${fmt(vz)})</span>. Built by walking x → z → up y. Length = √(${fmt(vx)}²+${fmt(vy)}²+${fmt(vz)}²) = <b>${len.toFixed(2)}</b>.`);}
  let vx=2,vy=1.5,vz=1.5;
  const rx=rangeRow({label:'x',min:-3,max:3,step:.5,value:2,fmt:v=>v,onInput:v=>{vx=v;set();}});
  const ry=rangeRow({label:'y (up)',min:-3,max:3,step:.5,value:1.5,fmt:v=>v,onInput:v=>{vy=v;set();}});
  const rz=rangeRow({label:'z',min:-3,max:3,step:.5,value:1.5,fmt:v=>v,onInput:v=>{vz=v;set();}});
  const L=lab('Rotate a real 3D vector','See','see');
  const g=el('div','grow');g.append(rx,ry,rz);const s=el('div','stage');s.append(bd,g);
  L.append(s,nar);root.append(L);set();
  root.append(box('aha-box','the recipe, stated once','<em>Lay each number along its own axis; the arrow ends where they add up.</em> 1D used one axis, 2D two, 3D three. Nowhere does the recipe learn that "three" is where human eyes give out — it just keeps going. In Chapter 10 we run it with six, and it works identically.'));
  root.append(math('\\lVert \\mathbf v\\rVert = \\sqrt{x^2+y^2+z^2}'));
  root.append(summary(['3D vector = three numbers along three axes.','Same build-recipe as 1D and 2D, one more time.','This is the last dimension you can picture — the recipe doesn\'t care.']));
}};

const cAdd={id:'add',part:'Part I · Build it',title:'Adding — the first of two moves',
  sub:'The entire subject runs on exactly two operations. Here\'s the first, and you\'ve done it since you could count.',
render(root){
  head(root,6,cAdd);
  root.append(p('To add two vectors, add them <b>line by line</b>. Eggs with eggs, milk with milk. No line ever looks at another — the most antisocial rule in mathematics, and that\'s exactly why it scales to a billion dimensions.'));
  const L1=lab('Add two lists, one line at a time');
  L1.append(box('ask','watch','Does the eggs line ever change the milk line? (It can\'t. That independence is the secret.)'));
  L1.append(listAdd({items:['eggs','milk','bread','coffee','apples'],a:[6,2,1,4,3],b:[4,1,3,0,5]}));
  root.append(L1);
  root.append(h3('The same thing as arrows: tip-to-tail'));
  root.append(p('Walk along the first arrow, then the second from where you landed. The single arrow from start to finish is the sum. Drag either.'));
  const ro=el('div','readout','');const nar=narrate('Drag an arrow.');
  const board=vboard({arrows:[{x:2,y:1,color:C.accentb,label:'a'},{x:1,y:2,color:C.accentc,label:'b'}],snap:true,
    extra:(ctx,toPx,arrows)=>{const a=arrows[0],b=arrows[1];const[ax,ay]=toPx(a.x,a.y),[sx,sy]=toPx(a.x+b.x,a.y+b.y),[ox,oy]=toPx(0,0);
      ctx.strokeStyle=C.accentc;ctx.setLineDash([5,4]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(sx,sy);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle=C.accent;ctx.fillStyle=C.accent;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(sx,sy);ctx.stroke();
      const ang=Math.atan2(sy-oy,sx-ox),s=12;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-s*Math.cos(ang-.42),sy-s*Math.sin(ang-.42));ctx.lineTo(sx-s*Math.cos(ang+.42),sy-s*Math.sin(ang+.42));ctx.closePath();ctx.fill();},
    onChange:a=>{const s={x:a[0].x+a[1].x,y:a[0].y+a[1].y};
      ro.innerHTML=`(${fmt(a[0].x)}, ${fmt(a[0].y)}) + (${fmt(a[1].x)}, ${fmt(a[1].y)}) = <b style="color:var(--accent)">(${fmt(s.x)}, ${fmt(s.y)})</b>`;
      nar.say(`Tip-to-tail lands at <span class="k">(${fmt(s.x)}, ${fmt(s.y)})</span> — exactly the line-by-line sums. The picture and the arithmetic always agree.`);}});
  const L2=lab('Tip-to-tail','See','see');L2.append(stageOf(board,[ro]),nar);root.append(L2);
  root.append(math('\\mathbf a + \\mathbf b = (a_1+b_1,\\; a_2+b_2,\\; \\dots,\\; a_n+b_n)'));
  root.append(box('aha-box','why dimension is a non-issue','Because the rule touches each line alone, the <em>identical</em> procedure works for 5 lines or 5 billion. A rule that treats each line separately literally cannot tell how long the list is.'));
  root.append(quiz({question:'(3, −1, 5) + (−3, 1, −5) = ?',
    options:[{t:'(0, 0, 0)',ok:true,why:'Each line cancels. b is the "negative" of a — every vector has one that adds back to zero.'},
      {t:'(6, −2, 10)',ok:false,why:'That\'s a+a. Add line by line: 3+(−3)=0, etc.'}]}));
  root.append(summary(['Add = line by line, no line looks at its neighbours.','Arrows: tip-to-tail.','That independence is why addition scales to any dimension.']));
}};

const cScale={id:'scale',part:'Part I · Build it',title:'Scaling — the second move',
  sub:'Multiply a whole vector by one number. You\'ve met this as the brightness slider in every photo app.',
render(root){
  head(root,7,cScale);
  root.append(p('To <b>scale</b> by a number, multiply every line by it. Double → all doubles. Times ½ → all halves. Times −1 → it flips to point the opposite way. This little face is an 11×11 grid — a <b>121-dimensional vector</b> — and the brightness slider scales all 121 at once.'));
  const L=lab('Brightness = scaling a 121-D photo');
  L.append(box('ask','predict','What appears at 0×? At 2×?'));
  const canvas=el('canvas');canvas.width=200;canvas.height=200;const ctx=VS.hidpi(canvas);
  const N=11,cell=200/N,base=[];
  for(let y=0;y<N;y++){base[y]=[];for(let x=0;x<N;x++){const dx=x-5,dy=y-5,r=Math.hypot(dx,dy);let v=45+150*Math.max(0,1-r/6);
    if(y===3&&(x===3||x===7))v=235;if(y===8&&x>=3&&x<=7)v=225;base[y][x]=Math.round(v);}}
  const nar=narrate('');
  function draw(s){for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=clamp(Math.round(base[y][x]*s),0,255);ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}
    const msg=s===0?'<span class="r">Every pixel is 0 — the <b>zero vector</b> (pure black).</span>':s<1?'Every pixel shrank — darker.':s>1?'Every pixel grew (clipped at white) — brighter.':'Original.';
    nar.say(`scale = <span class="k">${s.toFixed(2)}×</span>. ${msg}`);}
  const row=rangeRow({label:'scale factor',min:0,max:2,step:.01,value:1,fmt:v=>v.toFixed(2)+'×',onInput:draw});
  L.append(row,stageOf(canvas,[nar]));draw(1);root.append(L);
  root.append(h3('As an arrow: stretch, don\'t steer'));
  const ro=el('div','readout','');const nar2=narrate('');const base2={x:2,y:1};let k=1.5;
  const board=vboard({arrows:[{x:3,y:1.5,color:C.accent,label:'k·v',draggable:false},{x:2,y:1,color:C.accentb,label:'v',draggable:false}]});
  function apply(kk){k=kk;board.api.arrows[0].x=base2.x*k;board.api.arrows[0].y=base2.y*k;board.api.render();
    ro.innerHTML=`${k.toFixed(2)} · (2, 1) = <b style="color:var(--accent)">(${(2*k).toFixed(1)}, ${(k).toFixed(1)})</b>`;
    nar2.say(k<0?'<span class="r">Negative — flipped to point the opposite way.</span>':k===0?'Zero — collapsed to the origin.':`Same direction, <span class="k">${k.toFixed(2)}×</span> as long. Direction locked; only length changed.`);}
  const row2=rangeRow({label:'scale k',min:-2,max:2,step:.05,value:1.5,fmt:v=>v.toFixed(2),onInput:apply});
  const L2=lab('Stretch vs steer','See','see');L2.append(row2,stageOf(board,[ro]),nar2);apply(1.5);root.append(L2);
  root.append(math('c\\,\\mathbf v = (c\\,v_1,\\; c\\,v_2,\\; \\dots,\\; c\\,v_n)'));
  root.append(box('trap','the trap','"Scaling steers the vector." No — positive scaling only changes length. Every line grows by the same factor, so the ratios (the direction) stay fixed. Stretch ≠ steer.'));
  root.append(summary(['Scale = multiply every line by one number.','0× → zero vector; −1× → flip; positive → stretch, same direction.','Photo brightness is scaling in a million dimensions.']));
}};

/* ============================================================
   PART II — STRUCTURE
   ============================================================ */

const cCombo={id:'combo',part:'Part II · Structure',title:'Linear combinations',
  sub:'Mix the two moves — scale some vectors, then add. This one operation is the beating heart of the entire subject.',
render(root){
  head(root,8,cCombo);
  root.append(p('A <span class="term">linear combination</span> is just: take some of this vector, some of that one, and add. Like a recipe — "3 scoops of a, 2 scoops of b." Scale, then add. That\'s the whole thing.'));
  root.append(math('c_1\\mathbf a + c_2\\mathbf b + \\dots + c_k\\mathbf z'));
  root.append(p('Everything ahead — span, basis, independence, even matrices — is built from this. Below, mix two vectors with the dials and reach the star.'));
  const target={x:2.5,y:1.5};let ca=1,cb=1;const av={x:2,y:.5},bv={x:.5,y:2};
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[{x:av.x,y:av.y,color:C.accentb,label:'a',draggable:false},{x:bv.x,y:bv.y,color:C.accentc,label:'b',draggable:false}],
    extra:(ctx,toPx)=>{const[ox,oy]=toPx(0,0);const pa={x:av.x*ca,y:av.y*ca};const res={x:av.x*ca+bv.x*cb,y:av.y*ca+bv.y*cb};
      const[pax,pay]=toPx(pa.x,pa.y),[rx,ry]=toPx(res.x,res.y);
      ctx.strokeStyle=C.accentb;ctx.globalAlpha=.4;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(pax,pay);ctx.stroke();
      ctx.strokeStyle=C.accentc;ctx.beginPath();ctx.moveTo(pax,pay);ctx.lineTo(rx,ry);ctx.stroke();ctx.globalAlpha=1;
      ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(rx,ry,6,0,7);ctx.fill();
      const[tx,ty]=toPx(target.x,target.y);ctx.fillStyle=C.gold;ctx.font='20px sans-serif';ctx.fillText('★',tx-8,ty+7);}});
  function upd(){const res={x:av.x*ca+bv.x*cb,y:av.y*ca+bv.y*cb};board.api.render();
    const hit=Math.hypot(res.x-target.x,res.y-target.y)<.15;
    ro.innerHTML=`${ca.toFixed(2)}·a + ${cb.toFixed(2)}·b = <b style="color:var(--accent)">(${res.x.toFixed(2)}, ${res.y.toFixed(2)})</b>`;
    nar.say(hit?'<span class="g">Bullseye!</span> Two different-direction vectors can reach <b>any</b> point in the plane.':`Result (${res.x.toFixed(2)}, ${res.y.toFixed(2)}). Keep tuning.`);}
  const rA=rangeRow({label:'how much a',min:-2,max:2,step:.05,value:1,fmt:v=>v.toFixed(2),onInput:v=>{ca=v;upd();}});
  const rB=rangeRow({label:'how much b',min:-2,max:2,step:.05,value:1,fmt:v=>v.toFixed(2),onInput:v=>{cb=v;upd();}});
  const L=lab('Reach the star by mixing');const g=el('div','grow');g.append(ro,rA,rB);const s=el('div','stage');s.append(board,g);
  L.append(s,nar);upd();root.append(L);
  root.append(box('aha-box','the phrase, demystified','"Linear combination" sounds intimidating; it means "a smoothie." Scoops of each ingredient, blended. If you can customise a smoothie order, you understand it.'));
  root.append(summary(['Linear combination = scale each, then add.','It\'s the engine every later idea is built from.','Two different-direction 2D vectors can combine to reach anywhere.']));
}};

const cSpan={id:'span',part:'Part II · Structure',title:'Span — everywhere you can reach',
  sub:'The set of all points a few vectors can build by scaling-and-adding. Watch it flip between "a line" and "the whole plane."',
render(root){
  head(root,9,cSpan);
  root.append(p('The <span class="term">span</span> of some vectors is <em>every</em> place you can land by scaling and adding them. Drag the two arrows. When they point different ways, their span is shaded across the <b>whole plane</b>. Line them up and it collapses to a single <b>line</b>.'));
  const ro=el('div','readout','');const nar=narrate('Drag the arrows.');
  const board=spanBoard({arrows:[{x:2,y:1,color:C.accentb,label:'a'},{x:-1,y:1.5,color:C.accentc,label:'b'}],snap:true,
    onChange:a=>{const cross=a[0].x*a[1].y-a[0].y*a[1].x;const line=Math.abs(cross)<.2;
      ro.innerHTML=line?'<b style="color:var(--accent)">span = a LINE</b>':'<b style="color:var(--accentc)">span = the WHOLE PLANE</b>';
      nar.say(line?'<span class="r">They point the same way</span> — so scaling & adding only ever lands on one line. Span collapsed to 1D.':'<span class="g">Two genuine directions</span> — you can reach every point in 2D. Span = the whole plane.');}});
  const L=lab('Watch the span change','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('aha-box','the deepest idea, felt','This is the core of linear algebra. A set of vectors "spans" a space if you can build every point in it from them. Two independent 2D vectors span the plane; three independent 3D vectors span space; <em>n</em> independent vectors span an n-dimensional space. Span is how vectors <em>build</em> a world.'));
  root.append(box('trap','the collapse','If b is just a scaled copy of a, it adds nothing new — you\'re stuck on a\'s line. That redundancy is the subject of the next chapter, and it\'s what "dimension" really measures.'));
  root.append(quiz({question:'Two vectors point in different directions in 2D. Their span is…',
    options:[{t:'the entire plane',ok:true,why:'Yes — two real directions reach anywhere. They form a basis for 2D.'},
      {t:'only the region between them',ok:false,why:'Scaling can be negative and large, so you escape "between" and fill the whole plane.'}]}));
  root.append(summary(['Span = all points reachable by scale-and-add.','Different directions → whole plane; same direction → just a line.','Spanning is how vectors build a space.']));
}};

const cIndep={id:'indep',part:'Part II · Structure',title:'Independence — is a vector redundant?',
  sub:'A vector is "redundant" if you could already reach it with the ones you had. Counting the non-redundant ones is what dimension really means.',
render(root){
  head(root,10,cIndep);
  root.append(p('Vector <b>b</b> is <span class="term">redundant</span> (dependent) if it lies along a\'s line — it reaches nowhere new. It\'s <span class="term">independent</span> if it opens a genuinely new direction. Drag b onto a\'s line and back.'));
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[{x:2,y:1,color:C.accentb,label:'a'},{x:1.4,y:2,color:C.accentc,label:'b'}],snap:true,
    extra:(ctx,toPx,arrows)=>{const a=arrows[0],b=arrows[1];const cross=a.x*b.y-a.y*b.x;
      if(Math.abs(cross)<.25){const[ox,oy]=toPx(0,0);const ang=Math.atan2(a.y,a.x),far=600;
        ctx.strokeStyle=C.accent;ctx.globalAlpha=.3;ctx.lineWidth=10;ctx.beginPath();
        ctx.moveTo(ox-far*Math.cos(ang),oy+far*Math.sin(ang));ctx.lineTo(ox+far*Math.cos(ang),oy-far*Math.sin(ang));ctx.stroke();ctx.globalAlpha=1;}},
    onChange:a=>{const cross=a[0].x*a[1].y-a[0].y*a[1].x;const dep=Math.abs(cross)<.25;
      ro.innerHTML=dep?'<b style="color:var(--accent)">REDUNDANT</b>':'<b style="color:var(--accentc)">INDEPENDENT</b>';
      nar.say(dep?'<span class="r">b is redundant</span> — on a\'s line. Together they still only reach a <b>1D line</b>. True dimension: 1.':'<span class="g">b is independent</span> — a new direction. Together they reach the <b>whole plane</b>. True dimension: 2.');}});
  const L=lab('Independent or redundant?','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('aha-box','what dimension really counts','Dimension isn\'t "how many vectors you have" — it\'s how many <em>independent</em> ones. Ten vectors on one line still only span a line (dimension 1). The count of genuinely-new directions is the real dimension.'));
  root.append(box('key','basis, made precise','A <span class="term">basis</span> is a set that is (1) independent — nothing redundant — and (2) spans the whole space. It\'s the <em>smallest</em> set of rulers that reaches everywhere: exactly n of them for an n-dimensional space.'));
  root.append(quiz({question:'You have 5 vectors in 2D. The most that can be independent is…',
    options:[{t:'2',ok:true,why:'2D holds at most 2 independent directions; vectors 3–5 must be combinations of the first two. That 2 is the dimension.'},
      {t:'5',ok:false,why:'Having five vectors doesn\'t make five directions. In 2D only 2 can be independent.'}]}));
  root.append(summary(['Redundant = reachable from the others.','Dimension = number of <em>independent</em> vectors.','Basis = independent + spanning = smallest complete set of rulers.']));
}};

const cBasis={id:'basis',part:'Part II · Structure',title:'Basis & coordinates — the numbers were a choice',
  sub:'A vector\'s numbers depend on which rulers you measure with. Change rulers, the numbers change — but the vector doesn\'t move.',
render(root){
  head(root,11,cBasis);
  root.append(p('When you write <code>(3, 2)</code> you secretly mean "3 of the right-ruler + 2 of the up-ruler." Those rulers are your <span class="term">basis</span>. Pick <em>different</em> rulers and the same point gets different numbers. Drag the point and read it two ways.'));
  const nar=narrate('');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'p'}],snap:true,
    extra:(ctx,toPx)=>{const[ox,oy]=toPx(0,0),[e1x,e1y]=toPx(1,0),[e2x,e2y]=toPx(0,1),[d1x,d1y]=toPx(1,1),[d2x,d2y]=toPx(-1,1);
      ctx.strokeStyle=C.accentb;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(e1x,e1y);ctx.moveTo(ox,oy);ctx.lineTo(e2x,e2y);ctx.stroke();
      ctx.strokeStyle=C.accentd;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(d1x,d1y);ctx.moveTo(ox,oy);ctx.lineTo(d2x,d2y);ctx.stroke();},
    onChange:a=>{const v=a[0];const c1=(v.x+v.y)/2,c2=(v.y-v.x)/2;
      nar.say(`Same arrow, two readings:<br>• <span style="color:var(--accentb);font-weight:700">standard rulers</span>: (${fmt(v.x)}, ${fmt(v.y)})<br>• <span style="color:var(--accentd);font-weight:700">diagonal rulers</span>: (${fmt(c1)}, ${fmt(c2)}). <span class="g">The point never moved — only the numbers.</span>`);}});
  const L=lab('One point, two sets of rulers','See','see');L.append(stageOf(board,[]),nar);root.append(L);
  root.append(box('aha-box','thing vs shadow','A vector is the underlying <em>thing</em>; its list of numbers is only its <em>shadow</em> in the rulers you chose. "Why did my numbers change?!" always has the same answer: you changed rulers.'));
  root.append(box('key','why re-choose rulers','Clever rulers make hard problems easy. <b>JPEG</b> re-describes your photo in "wavy pattern" rulers where most numbers become ~0 and can be dropped — that\'s compression. <b>Noise-cancelling</b> picks rulers where "engine drone" is one number, then zeroes it.'));
  root.append(quiz({question:'You re-describe a vector in a new basis; all its numbers change. Did the vector change?',
    options:[{t:'No — only its coordinates (its shadow) changed',ok:true,why:'Exactly. The vector is basis-independent; the numbers are how you read it in chosen rulers.'},
      {t:'Yes — new numbers, new vector',ok:false,why:'The classic trap. The point stayed put; you changed the measuring rulers.'}]}));
  root.append(summary(['A basis = your chosen rulers.','Coordinates = "how much of each ruler."','Change basis → numbers change, vector doesn\'t.','Smart bases power compression and denoising.']));
}};

/* ============================================================
   PART III — GEOMETRY
   ============================================================ */

const cLength={id:'length',part:'Part III · Geometry',title:'Length & distance',
  sub:'Geometry survives into any dimension. Length is Pythagoras with more plus signs — and it powers "how similar are these two things?"',
render(root){
  head(root,12,cLength);
  root.append(p('The length of a vector is the square root of the sum of its squared numbers. In 2D that\'s the hypotenuse — Pythagoras. In a million dimensions it\'s the exact same recipe, just a longer sum.'));
  root.append(math('\\lVert\\mathbf v\\rVert=\\sqrt{v_1^2+v_2^2+\\cdots+v_n^2}'));
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'v'}],snap:true,
    extra:(ctx,toPx,arrows)=>{const v=arrows[0];const[ox,oy]=toPx(0,0),[vx,vy]=toPx(v.x,v.y),[cx,cy]=toPx(v.x,0);
      ctx.strokeStyle=C.accentb;ctx.setLineDash([4,3]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(cx,cy);ctx.lineTo(vx,vy);ctx.stroke();ctx.setLineDash([]);},
    onChange:a=>{const v=a[0];const len=Math.hypot(v.x,v.y);
      ro.innerHTML=`length = √(${fmt(v.x)}² + ${fmt(v.y)}²) = <b style="color:var(--accent)">${len.toFixed(2)}</b>`;
      nar.say(`Square each, add, root: <span class="k">√(${(v.x*v.x).toFixed(1)} + ${(v.y*v.y).toFixed(1)}) = ${len.toFixed(2)}</span>. The dashed legs are the triangle — but the arithmetic didn't need it.`);}});
  const L=lab('Live Pythagoras','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('aha-box','distance = length of the difference','How far apart are two vectors? Subtract them (line by line) and take the length. That\'s <em>literally</em> how your photo app decides two images are similar: turn each into a vector, subtract, measure. Small distance = alike.'));
  root.append(math('\\text{dist}(\\mathbf a,\\mathbf b)=\\lVert\\mathbf a-\\mathbf b\\rVert=\\sqrt{\\textstyle\\sum_i (a_i-b_i)^2}'));
  root.append(worked({title:'length in 4 dimensions',
    prompt:'Find the length of \\( \\mathbf v = (1,\\,2,\\,2,\\,4) \\). You cannot picture a 4-D arrow — you don\'t need to.',
    steps:[
      'Square every number: \\(1^2=1,\\; 2^2=4,\\; 2^2=4,\\; 4^2=16\\).',
      'Add the squares: \\(1+4+4+16 = 25\\).',
      'Take the square root: \\(\\sqrt{25}=5\\).'],
    result:'\\( \\lVert\\mathbf v\\rVert = 5 \\). A distance in a space you can\'t see, from grade-school arithmetic.'}));
  root.append(worked({title:'distance between two songs',
    prompt:'Two songs as (tempo, loudness) after scaling: \\(\\mathbf a=(4,1)\\), \\(\\mathbf b=(1,5)\\). How different are they?',
    steps:[
      'Subtract line by line: \\(\\mathbf a-\\mathbf b=(4-1,\\;1-5)=(3,-4)\\).',
      'Length of the difference: \\(\\sqrt{3^2+(-4)^2}=\\sqrt{9+16}=\\sqrt{25}\\).'],
    result:'distance \\(=5\\). Bigger number = less alike — exactly how a music app rates similarity.'}));
  root.append(quiz({question:'Length of the 4-D vector (1, 2, 2, 4)?',
    options:[{t:'5',ok:true,why:'√(1+4+4+16)=√25=5. You measured a distance in a space you can\'t see, with grade-school arithmetic.'},
      {t:'9',ok:false,why:'That\'s 1+2+2+4 (no squaring). Square first: 1+4+4+16=25, √25=5.'}]}));
  root.append(summary(['Length = √(sum of squares) — Pythagoras, any dimension.','Distance = length of the difference vector.','This is the backbone of "similarity" in tech.']));
}};

const cDot={id:'dot',part:'Part III · Geometry',title:'Dot product & angle',
  sub:'One number telling you whether two vectors agree, are unrelated, or clash. It runs search, recommendations, and face unlock.',
render(root){
  head(root,13,cDot);
  root.append(p('The <span class="term">dot product</span>: multiply matching numbers, add them up. Its <b>sign</b> reveals the relationship — <span class="sign pos">＋ agree</span>, <span class="sign zero">0 unrelated</span>, <span class="sign neg">－ clash</span>. Rotate the orange arrow and hunt for the flip.'));
  root.append(math('\\mathbf a\\cdot\\mathbf b=a_1b_1+a_2b_2+\\cdots+a_nb_n=\\lVert\\mathbf a\\rVert\\,\\lVert\\mathbf b\\rVert\\cos\\theta'));
  const ro=el('div','readout','');const nar=narrate('');let ang=Math.PI*.2;
  const board=vboard({showGrid:false,arrows:[{x:2,y:0,color:C.accentb,label:'reference',draggable:false},{x:2*Math.cos(ang),y:2*Math.sin(ang),color:C.accent,label:'drag me'}],
    onChange:a=>{const o=a[1];const L2=Math.hypot(o.x,o.y)||1;o.x=o.x/L2*2;o.y=o.y/L2*2;const dot=o.x/2;
      const deg=Math.acos(clamp(dot,-1,1))*180/Math.PI;let cls,txt;
      if(dot>.15){cls='pos';txt='＋ they broadly AGREE';}else if(dot<-.15){cls='neg';txt='－ they CLASH';}else{cls='zero';txt='≈0 → perpendicular → UNRELATED';}
      ro.innerHTML=`dot ≈ <b>${dot.toFixed(2)}</b> · angle ≈ ${deg.toFixed(0)}°`;
      nar.say(`<span class="sign ${cls}">${cls==='pos'?'＋':cls==='neg'?'－':'0'}</span> ${txt}.`);}});
  const L=lab('Rotate, watch the sign flip','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(worked({title:'do these two shoppers agree?',
    prompt:'Habits as (organic, budget, bulk): \\(\\mathbf p=(2,3,-1)\\), \\(\\mathbf q=(4,-1,2)\\). Compute the dot product and read its sign.',
    steps:[
      'Multiply matching numbers: \\(2\\cdot4=8,\\; 3\\cdot(-1)=-3,\\; (-1)\\cdot2=-2\\).',
      'Add them: \\(8-3-2=3\\).',
      'The result \\(+3\\) is <b>positive</b> → the vectors broadly agree.'],
    result:'These shoppers roughly agree. (0 would be “unrelated”; negative would be “opposite tastes.”) This sign-check is the heart of every “you might also like…”'}));
  root.append(box('aha-box','why it rules the internet','"Which direction" survives to any dimension. Turn two photos into 500-number vectors, take their dot product: positive = similar, near-zero = unrelated. That\'s <em>cosine similarity</em>, run billions of times a day. You can\'t picture 500-D arrows — the dot product measures their angle anyway.'));
  root.append(quiz({question:'Two vectors have dot product exactly 0. They are…',
    options:[{t:'perpendicular / unrelated',ok:true,why:'Zero dot product = right angle = "nothing in common, direction-wise."'},
      {t:'identical',ok:false,why:'Identical vectors have a large positive dot product.'}]}));
  root.append(summary(['Dot product = multiply matching numbers, sum.','Sign: ＋ agree, 0 perpendicular, − clash.','It equals ‖a‖‖b‖cosθ — it secretly holds the angle.','Cosine similarity = the core of modern search/recommendation.']));
}};

const cProj={id:'proj',part:'Part III · Geometry',title:'Projection — a vector\'s shadow',
  sub:'Drop a vector\'s shadow onto a direction. This "how much of me points that way?" is how you decompose anything into parts.',
render(root){
  head(root,14,cProj);
  root.append(p('The <span class="term">projection</span> of v onto a direction is v\'s shadow on that direction — "how much of v points that way." Drag v; the teal shadow follows, and its length is exactly the dot product with the (unit) blue direction.'));
  const nar=narrate('Drag v.');const board=projectionBoard({nar});
  const L=lab('Cast a shadow','See','see');L.append(stageOf(board,[]),nar);root.append(L);
  root.append(math('\\text{proj}_{\\mathbf u}\\mathbf v=(\\mathbf v\\cdot\\hat{\\mathbf u})\\,\\hat{\\mathbf u}'));
  root.append(box('aha-box','why projection is everywhere','Splitting a vector into "along this direction" + "the rest" is how you separate signal from noise, compress data, fit lines to data (least squares), and re-express a vector in a new basis. Every ruler-reading in Chapter 11 is a projection.'));
  root.append(summary(['Projection = shadow of v on a direction.','Its length = dot product with the unit direction.','Decomposing into parts underlies compression, denoising, and fitting.']));
}};

const cOrtho={id:'ortho',part:'Part III · Geometry',title:'Orthogonality — perfect independence',
  sub:'Perpendicular vectors share nothing. They make the cleanest possible rulers — and in high dimensions, they\'re almost the only kind there is.',
render(root){
  head(root,15,cOrtho);
  root.append(p('Two vectors are <span class="term">orthogonal</span> (perpendicular) when their dot product is 0. Orthogonal rulers are ideal: each measures a totally separate thing, with zero overlap. The x and y axes are orthogonal; so are the "wavy patterns" JPEG uses.'));
  root.append(box('aha-box','a teaser for the weirdness ahead','In 2D it takes effort to find perpendicular vectors. In 1000 dimensions, <em>almost every random pair is already nearly perpendicular</em> — which turns out to be the reason AI embeddings work. We\'ll feel that in Part IV.'));
  root.append(quiz({question:'Why are orthogonal rulers especially nice?',
    options:[{t:'Each measures a completely separate thing — no overlap, no double-counting',ok:true,why:'Right. Orthogonal bases make coordinates trivial to compute (just project) and keep dimensions from interfering.'},
      {t:'They\'re longer',ok:false,why:'Length isn\'t the point — it\'s the zero overlap (perpendicularity) that makes them clean.'}]}));
  root.append(summary(['Orthogonal = perpendicular = dot product 0.','Orthogonal rulers measure independent things with no overlap.','High-D is full of near-orthogonal directions (next part).']));
}};

/* ============================================================
   PART IV — THE LEAP
   ============================================================ */

const cLeap={id:'leap',part:'Part IV · The leap',title:'Past 3D — operate, don\'t watch',
  sub:'Here your eyes tap out, and it doesn\'t matter. You stop watching the vector and start operating it. Nothing else changes.',
render(root){
  head(root,16,cLeap);
  root.append(p('At three numbers the arrow dies — you can\'t draw a 4-arrow. This is where most people quit. The fix isn\'t a better brain; it\'s a new <em>habit</em>: drop the arrow, keep the list.'));
  root.append(el('div','pull','Below 4 numbers you <b>watch</b> the vector. From 4 up you <b>operate</b> it. The math didn\'t get harder — your eyes just stopped being the tool.'));
  const L=lab('Operate a 6-D vector you can\'t picture');
  L.append(p('Here\'s a 6-dimensional vector as six knobs. You can\'t draw its arrow — but you can absolutely turn six knobs, add another 6-vector, and read its length.'));
  let v=[3,1,4,1,5,2],w=[1,2,0,3,1,1];const nar=narrate('');
  const ro=el('div','readout','');function updRO(){ro.textContent='v = ('+v.join(', ')+')';}
  const knobs=el('div','knobs');knobs.style.flexWrap='wrap';const api=[];
  const pal=[C.accent,C.accentb,C.accentc,C.accentd,C.gold,C.green];
  for(let i=0;i<6;i++){const k=knob({label:'n'+(i+1),color:pal[i],min:0,max:9,value:v[i],onInput:val=>{v[i]=val;updRO();}});api.push(k);knobs.append(k);}
  const addBtn=el('button','btn','+ add w = (1,2,0,3,1,1)');const lenBtn=el('button','btn ghost','measure length');
  const ctr=el('div','controls');ctr.append(addBtn,lenBtn);
  addBtn.onclick=()=>{v=v.map((x,i)=>clamp(x+w[i],0,9));api.forEach((k,i)=>k.api.set(v[i]));updRO();
    nar.say(`Added <span class="k">w</span> line by line → (${v.join(', ')}). Six separate sums — 6-D addition, no picture needed.`);};
  lenBtn.onclick=()=>{const len=Math.sqrt(v.reduce((s,x)=>s+x*x,0));nar.say(`length = √(${v.map(x=>x+'²').join('+')}) = <b>${len.toFixed(2)}</b>. Pythagoras in 6 dimensions. It just works.`);};
  L.append(knobs,ctr,ro,nar);updRO();root.append(L);
  root.append(box('aha-box','the reframe that wins','You just added and measured a 6-D vector as easily as a 2-D one — because the operations only ever touch one number at a time. <span class="aha">"100-dimensional" just means "a list with 100 lines." Instantly comfortable, completely correct.</span>'));
  root.append(quiz({question:'The honest way to "picture" a 50-dimensional vector is…',
    options:[{t:'Don\'t — treat it as a list of 50 numbers and operate on them',ok:true,why:'Exactly what mathematicians and ML engineers do. The list is the tool; the picture was optional all along.'},
      {t:'Squint until you see 50 axes',ok:false,why:'Nobody can, nobody needs to. The arrow was only ever a crutch for tiny dimensions.'}]}));
  root.append(summary(['Past 3D: operate the list, don\'t watch the arrow.','Every operation touches one number at a time.','"n-dimensional" = "a list with n lines." That\'s the whole leap.']));
}};

const cLadder={id:'ladder',part:'Part IV · The leap',title:'Climb the ladder',
  sub:'Slide the dimension up and watch the exact same square-add-root recipe keep working, long after the picture is gone.',
render(root){
  head(root,17,cLadder);
  root.append(p('The best way to trust higher dimensions is to watch one fact — length — climb the dimensions without ever changing its recipe. Slide the dimension from 1 to 8. Notice the moment your ability to picture it ends (around 3–4), and notice that the arithmetic <em>doesn\'t care at all</em>.'));
  const L=lab('Dimension climber','Play');L.append(ladder());root.append(L);
  root.append(box('aha-box','the pattern is your new eyes','You can\'t see 7D, but you can finish the pattern: length is always √(sum of squares). The recipe is dimension-blind. In high dimensions, <em>the formula is what you "see" with</em> — and it never lies to you the way a forced mental picture would.'));
  root.append(el('div','pull','You didn\'t "understand" 7 dimensions in a flash of insight. You added a few lists and measured a few lengths, and one day you noticed you\'d stopped flinching. That\'s the whole enlightenment.'));
  root.append(summary(['The length recipe is identical in every dimension.','The picture ends ~3D; the arithmetic never does.','Finishing the pattern is how you reason past what you can see.']));
}};

const cWeird={id:'weird',part:'Part IV · The leap',title:'Where your 3D gut lies',
  sub:'The comforting story was 90% true. Here\'s the mind-bending 10% — high-dimensional geometry is genuinely strange, and that strangeness powers modern AI.',
render(root){
  head(root,18,cWeird);
  root.append(p('The <em>arithmetic</em> of high-D is familiar and boring. But the <em>geometry</em> gets weird. Exhibit A: random directions. Predict first — in 1000 dimensions, are two random arrows usually similar, opposite, or at right angles? Then drag the slider.'));
  const L=lab('Almost everything is perpendicular','Weird','weird');L.append(orthoLab());root.append(L);
  root.append(box('aha-box','the weirdness IS the feature','As dimension grows, random vectors crowd toward 90° — nearly everything is perpendicular to everything. That\'s <em>why</em> AI works: high-D has room for millions of near-orthogonal "concepts" that barely interfere. Your 3D gut said "no way"; the formula said "yes," and up here the formula wins.'));
  root.append(h3('Two more facts your gut refuses'));
  root.append(el('ul',null,`
    <li><b>The orange is all peel.</b> In 100-D, over 99% of a ball\'s volume sits in its outer 5% shell. The juicy middle essentially vanishes.</li>
    <li><b>The box is all corners.</b> In 10-D, the ball inside a box fills just 0.25% of it — 99.75% lives out in corners the ball can\'t reach.</li>`));
  root.append(box('key','the mature takeaway','The recipes (add, scale, length, dot product) stay <em>perfect</em> in every dimension. What breaks is your <em>expectation</em> about the results. Keep the list and the knobs for doing the math — plus a third rule: don\'t trust your 3D gut about volumes, corners, and angles. Up here, the formula is your eyes.'));
  root.append(quiz({question:'Why is "almost everything is perpendicular" useful?',
    options:[{t:'High-D fits millions of near-orthogonal directions, so distinct concepts barely interfere',ok:true,why:'The backbone of word/image embeddings — independence is nearly free in high dimensions.'},
      {t:'It isn\'t useful, just a curiosity',ok:false,why:'It\'s a load-bearing fact of modern ML — it\'s why embeddings pack so much meaning.'}]}));
  root.append(summary(['Random high-D vectors are almost always near-perpendicular.','Volume flees to the shell; boxes become all-corners.','Recipes stay exact; only your visual expectations break.','This weirdness is exactly what makes embeddings work.']));
}};

const cInfinite={id:'infinite',part:'Part IV · The leap',title:'∞ dimensions — functions are vectors',
  sub:'The final leap, and it feels easy: give a vector one number for every point on a line, and you\'ve invented a function.',
render(root){
  head(root,19,cInfinite);
  root.append(p('A vector had one number per slot. A photo had one per pixel. So what if you had one number for <em>every point x on a line</em> — no gaps? That rule, "a number at every x," is exactly a <b>function</b> f(x). A function is a vector with infinitely many numbers.'));
  root.append(box('key','the same two moves survive','Add two functions: (f+g)(x) = f(x)+g(x) — add them at every point. Scale: (2f)(x) = 2·f(x) — turn every point up. Your volume knob is scalar multiplication on an infinite-dimensional vector. Length becomes an integral (a continuous sum), and the dot product too:'));
  root.append(math('\\langle f,g\\rangle=\\int f(x)\\,g(x)\\,dx \\qquad \\lVert f\\rVert=\\sqrt{\\int f(x)^2\\,dx}'));
  const L=lab('Add two functions, point by point','See','see');
  const canvas=el('canvas');canvas.width=440;canvas.height=200;const ctx=VS.hidpi(canvas);
  const nar=narrate('');let A=1,B=1;
  function draw(){const W=440,H=200,mid=H/2;ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.softline;ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();
    function plot(fn,color,lw){ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();
      for(let px=0;px<=W;px++){const x=px/W*6;const y=fn(x);const py=mid-y*38;px===0?ctx.moveTo(px,py):ctx.lineTo(px,py);}ctx.stroke();}
    const f=x=>A*Math.sin(x*1.6), g=x=>B*Math.cos(x*2.2);
    plot(f,C.accentb,1.6);plot(g,C.accentc,1.6);plot(x=>f(x)+g(x),C.accent,2.6);
    nar.say(`<span style="color:var(--accentb)">f</span> + <span style="color:var(--accentc)">g</span> = <span style="color:var(--accent)">f+g</span>, added at <em>every</em> point x. Same line-by-line addition — just infinitely many lines.`);}
  const rA=rangeRow({label:'amount of f',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{A=v;draw();}});
  const rB=rangeRow({label:'amount of g',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{B=v;draw();}});
  L.append(rA,rB,stageOf(canvas,[]),nar);draw();root.append(L);
  root.append(box('aha-box','one idea, all the way up','Fourier analysis, quantum mechanics, signal processing, the guts of your music app — all of it is "treat functions as vectors in an infinite-dimensional space and reuse the two moves." You didn\'t level up to infinity; infinity moved in next door and turned out to use the same recipes.'));
  root.append(summary(['A function = a vector with one number per point (∞-dimensional).','Add/scale still work — at every point.','Length & dot product become integrals.','Same idea, all the way to infinity.']));
}};

/* ============================================================
   PART V — PAYOFF & MASTERY
   ============================================================ */

const cMatrix={id:'matrix',part:'Part V · Going deeper',title:'Matrices — verbs for vectors',
  sub:'So far vectors just sat there. A matrix is a machine that MOVES every vector at once — rotate, stretch, shear the whole space. It\'s the next big idea, and it\'s still just our two moves.',
render(root){
  head(root,20,cMatrix);
  root.append(p('A vector is a <em>noun</em> (a thing). A <span class="term">matrix</span> is a <em>verb</em> — it does something to every vector in the space at once: rotate it, stretch it, flip it, shear it. And here\'s the beautiful part: a matrix is fully described by <b>where it sends the basis vectors</b>. Move the two arrows below and watch the <em>entire grid</em> follow.'));
  const ro=el('div','readout','');const nar=narrate('Drag the sliders to reshape space.');
  const board=matrixBoard({onChange:(m,det)=>{
    ro.innerHTML=`î → (${fmt(m[0])}, ${fmt(m[2])}) &nbsp; ĵ → (${fmt(m[1])}, ${fmt(m[3])}) &nbsp;·&nbsp; area × <b>${fmt(det)}</b>`;
    const msg = Math.abs(det)<0.05?'<span class="r">area → 0: the whole plane got squashed onto a line!</span>':
      det<0?'space got <b>flipped</b> (mirror) and scaled.':'space stretched/rotated; area scaled by the number.';
    nar.say(`The grid is now sheared/scaled so î lands at (${fmt(m[0])}, ${fmt(m[2])}) and ĵ at (${fmt(m[1])}, ${fmt(m[3])}). ${msg}`);}});
  const rA=rangeRow({label:'î x',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(v,m[1],m[2],m[3]);}});
  const rC=rangeRow({label:'î y',min:-2,max:2,step:.1,value:0,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(m[0],m[1],v,m[3]);}});
  const rB=rangeRow({label:'ĵ x',min:-2,max:2,step:.1,value:0,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(m[0],v,m[2],m[3]);}});
  const rD=rangeRow({label:'ĵ y',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(m[0],m[1],m[2],v);}});
  const L=lab('Reshape the whole plane','See','see');
  const g=el('div','grow');g.append(ro,rA,rC,rB,rD);const s=el('div','stage');s.append(board,g);
  L.append(s,nar);root.append(L);
  root.append(box('key','presets to try','<b>Rotate 90°:</b> î→(0,1), ĵ→(−1,0). &nbsp; <b>Stretch x by 2:</b> î→(2,0), ĵ→(0,1). &nbsp; <b>Shear:</b> î→(1,0), ĵ→(1,1). &nbsp; <b>Squash flat:</b> î→(1,0), ĵ→(2,0) — the whole plane collapses to a line (area × 0).'));
  root.append(worked({title:'applying a matrix is just a linear combination',
    prompt:'A matrix sends \\(\\hat\\imath\\to(2,0)\\) and \\(\\hat\\jmath\\to(1,3)\\). Where does the vector \\((x,y)\\) go?',
    steps:[
      'Any vector is \\(x\\hat\\imath + y\\hat\\jmath\\) — a linear combination of the basis.',
      'A matrix respects add & scale, so it sends \\(x\\hat\\imath+y\\hat\\jmath \\to x\\,(2,0)+y\\,(1,3)\\).',
      'Combine: \\((2x+y,\\; 3y)\\).'],
    result:'A matrix moves the whole space, but each vector just rides its <em>own</em> linear combination of “where the basis went.” It\'s our two moves again.'}));
  root.append(box('aha-box','why matrices are everywhere','Rotating a game character, warping a photo, one layer of a neural network, a Google-search ranking step — all are “apply a matrix to a vector.” The <span class="term">determinant</span> you saw (the area factor) tells you if the transform squashes information (det = 0) or is reversible. <span class="aha">Everything deeper — eigenvectors, PCA, transformers — is built on this one picture.</span>'));
  root.append(quiz({question:'A matrix squashes the whole plane onto a single line (determinant 0). What did it lose?',
    options:[{t:'Information — many different inputs now map to the same output, so you can\'t undo it',ok:true,why:'Exactly. Zero determinant = not reversible = the transform threw away a dimension. This is “singular.”'},
      {t:'Nothing — it\'s fully reversible',ok:false,why:'A collapse to a line means countless inputs share one output; you can\'t recover which. Not reversible.'}]}));
  root.append(summary(['A matrix = a verb: it moves every vector at once.','It\'s defined by where the basis vectors land.','Applying it = a linear combination (our two moves).','Determinant = how area scales; 0 means it squashed a dimension.']));
}};

const cUsed={id:'used',part:'Part V · Payoff',title:'Where this actually lives',
  sub:'You own the whole toolkit now. Here it is running the real world — plus a live similarity search you can play with.',
render(root){
  head(root,21,cUsed);
  root.append(p('Everything you learned — list, add, scale, length, dot product — is exactly what powers search, recommendations, and AI. Here\'s a toy: three "documents" as 3-number vectors (how much about <b>cats</b>, <b>code</b>, <b>cooking</b>). Tune your query; watch which wins by <em>angle</em>.'));
  const L=lab('Similarity search, live');
  const docs=[{name:'"My cat sat on my keyboard"',v:[.8,.5,.1],color:C.accent},
    {name:'"A recipe for lentil curry"',v:[0,.1,.95],color:C.accentc},
    {name:'"Debugging a null pointer"',v:[.05,.95,.1],color:C.accentb}];
  const q=[.7,.4,.2];const nar=narrate('');const bars=el('div');bars.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:6px';
  function cos(a,b){let d=0,na=0,nb=0;for(let i=0;i<3;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}return d/(Math.sqrt(na*nb)||1);}
  function upd(){const sc=docs.map(d=>({...d,s:cos(q,d.v)})).sort((a,b)=>b.s-a.s);bars.innerHTML='';
    sc.forEach((d,i)=>{const row=el('div');row.style.cssText='display:flex;align-items:center;gap:10px';
      const bar=el('div');bar.style.cssText=`height:20px;border-radius:5px;background:${d.color};width:${Math.max(4,d.s*220)}px;transition:width .2s`;
      row.append(el('div',null,(i===0?'🏆 ':'&nbsp;&nbsp;&nbsp;')+d.name),bar,el('b',null,d.s.toFixed(2)));bars.append(row);});
    nar.say(`Query = (cats ${q[0].toFixed(1)}, code ${q[1].toFixed(1)}, cooking ${q[2].toFixed(1)}). Winner: <span class="k">${sc[0].name}</span> — highest cosine similarity.`);}
  const r1=rangeRow({label:'about cats',min:0,max:1,step:.05,value:q[0],fmt:v=>v.toFixed(2),onInput:v=>{q[0]=v;upd();}});
  const r2=rangeRow({label:'about code',min:0,max:1,step:.05,value:q[1],fmt:v=>v.toFixed(2),onInput:v=>{q[1]=v;upd();}});
  const r3=rangeRow({label:'about cooking',min:0,max:1,step:.05,value:q[2],fmt:v=>v.toFixed(2),onInput:v=>{q[2]=v;upd();}});
  L.append(r1,r2,r3,bars,nar);upd();root.append(L);
  root.append(box('aha-box','that\'s the whole magic trick','Real search engines and chatbots do exactly this — with vectors of hundreds or thousands of numbers from a neural net. "Find similar" = "smallest angle." You now understand the core of it.'));
  root.append(h3('More places you\'re now equipped to see it'));
  root.append(p('The famous one: <b>word embeddings</b> turn words into ~300-D vectors so that <em>directions carry meaning</em>. The step from “man” to “woman” is one fixed vector — and adding it to “king” lands you on “queen.” That\'s <em>literally</em> vector arithmetic. Here it is in a toy 2-D version:'));
  const La=lab('king − man + woman ≈ queen','See','see');La.append(analogyDemo());root.append(La);
  root.append(box('aha-box','meaning becomes geometry','When words are vectors, “analogy” becomes <em>subtraction and addition</em>, and “synonym” becomes <em>small angle</em>. The entire field of modern language AI stands on this: turn meaning into vectors, then do our two moves. You already know the moves.'));
  root.append(el('ul',null,`
    <li><b>Recommendations</b> — you and each movie are vectors; your match is a dot product.</li>
    <li><b>Computer graphics</b> — every rotation, scale, and camera move is a matrix on 3-vectors (Chapter 20).</li>
    <li><b>Machine learning</b> — a neural network is stacks of “multiply by a matrix, then bend.”</li>
    <li><b>Search</b> — your query and every document become vectors; the best matches have the smallest angle.</li>`));
  root.append(summary(['Similarity = angle = dot product, at scale.','Embeddings turn words/images/users into vectors.','You now understand the core operation behind modern AI.']));
}};

const cAxioms={id:'axioms',part:'Part V · Payoff',title:'The rules of the club (axioms)',
  sub:'What officially makes something a "vector space." They read like legalese but each one is just a promise that your intuition transfers.',
render(root){
  head(root,22,cAxioms);
  root.append(p('A <span class="term">vector space</span> is <em>any</em> collection of things you can <b>add</b> and <b>scale</b>, where a short list of promises holds. Not arrows — <em>anything</em>: numbers, functions, matrices, quantum states, financial portfolios. If it keeps the promises, every theorem you learned works for it, free.'));
  const promises=[['Order-blind addition','a + b = b + a. Your cart plus theirs = theirs plus yours.'],
    ['Grouping-blind addition','(a+b)+c = a+(b+c). Add in any grouping.'],
    ['A "do-nothing" vector','the zero vector; adding it changes nothing.'],
    ['Every vector has an undo','a + (−a) = 0. No vector is a trap.'],
    ['Scaling composes','a(b·v) = (ab)·v. Triple then double = sextuple.'],
    ['Scaling by 1 does nothing','1·v = v.'],
    ['Scaling spreads over addition','a(u+v)=au+av and (a+b)v=av+bv.']];
  const g=el('div','glossary');promises.forEach(([t,d])=>{const it=el('div','gitem');it.innerHTML=`<b>${t}</b> — ${d}`;g.append(it);});
  root.append(g);
  root.append(box('aha-box','what the promises buy you','They are a <em>guarantee your intuition transfers</em>. Whatever weird object you\'re holding, if it passes this checklist, then adding, scaling, length, distance, angle, and direction all behave exactly like they did on childhood graph paper. That\'s why the same machinery describes arrows, photos, songs, and functions.'));
  root.append(quiz({question:'The set of all functions f(x), with normal add & scale — is it a vector space?',
    options:[{t:'Yes — you can add and scale them, and all the promises hold',ok:true,why:'Correct. Functions form one of the most important vector spaces in all of math and physics.'},
      {t:'No — vectors have to be arrows',ok:false,why:'That\'s the myth this whole course dismantles. "Vector" means "member of a vector space" — arrows are just one example.'}]}));
  root.append(summary(['Vector space = things you can add & scale, obeying 7 promises.','The promises guarantee your 2D intuition transfers.','Arrows, functions, matrices, portfolios — all vector spaces.']));
}};

const cReview={id:'review',part:'Part V · Payoff',title:'You made it — the whole subject, and a review',
  sub:'Everything, compressed. Then a quick self-test to prove it stuck, and a glossary to keep.',
render(root){
  head(root,23,cReview);
  root.append(el('div','pull','You no longer believe in a magic room you can\'t enter. You just see a longer list. That\'s internalized. That\'s the whole thing.'));
  root.append(box('key','the entire course in four lines',`
    <b>• a vector</b> = a list of numbers (equivalently: arrow, knobs, point)<br>
    <b>• two moves</b> = add (line by line) and scale (every line by one number)<br>
    <b>• geometry</b> = length is √(sum of squares); direction/similarity is the dot product<br>
    <b>• dimension</b> = how many <em>independent</em> numbers — can be 2, 900, or ∞ without changing a thing`));
  root.append(h3('Prove it stuck'));
  root.append(quiz({question:'(2, 0, 5, 1) + (3, 4, 1, 1) = ?',options:[
    {t:'(5, 4, 6, 2)',ok:true,why:'Line by line. You just did 4-D addition without a picture.'},
    {t:'(5, 4, 6, 1)',ok:false,why:'Last line: 1+1=2, not 1.'}]}));
  root.append(quiz({question:'A 1000-dimensional vector is best thought of as…',options:[
    {t:'a list of 1000 numbers you operate on',ok:true,why:'Yes. Not a shape to visualise — a list to compute with.'},
    {t:'an arrow in a room you must imagine',ok:false,why:'No arrow survives past 3D, and you never needed one.'}]}));
  root.append(quiz({question:'Two random vectors in very high dimensions are almost always…',options:[
    {t:'nearly perpendicular',ok:true,why:'The concentration effect — and the reason embeddings can pack so much meaning.'},
    {t:'nearly parallel',ok:false,why:'The opposite — they crowd toward 90°, not 0°.'}]}));
  root.append(h3('Glossary to keep'));
  const terms=[['vector','a list of numbers you can add and scale'],['dimension','how many independent numbers in the list'],
    ['linear combination','scale some vectors, then add — a "smoothie"'],['span','every point reachable by scaling & adding some vectors'],
    ['independent','not reachable from the others; a genuinely new direction'],['basis','a smallest set of rulers (independent + spanning)'],
    ['norm / length','√(sum of squares)'],['dot product','multiply matching numbers & sum; sign = agree/perp/clash'],
    ['orthogonal','perpendicular; dot product 0'],['vector space','anything you can add & scale that obeys the 7 promises']];
  const g=el('div','glossary');terms.forEach(([t,d])=>{const it=el('div','gitem');it.innerHTML=`<b>${t}</b> — ${d}`;g.append(it);});
  root.append(g);
  root.append(box('aha-box','where to go next','You\'ve met matrices (verbs that move whole spaces). Next come <b>eigenvectors</b> (the special directions a matrix only stretches, never turns), <b>PCA</b> (finding the few directions your data actually uses), and the linear algebra inside every neural network. It\'s all this — lists, two moves, geometry, transformations — just stacked. Go forth and out-list the universe.'));
}};

return [c0,cRep,c1d,c2d,c3d,cAdd,cScale,cCombo,cSpan,cIndep,cBasis,
        cLength,cDot,cProj,cOrtho,cLeap,cLadder,cWeird,cInfinite,cMatrix,cUsed,cAxioms,cReview];
})();
