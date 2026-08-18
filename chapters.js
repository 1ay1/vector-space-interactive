/* ============================================================
   chapters.js — the full course.
   Each chapter: { id, part, title, sub, render(root) }.
   Uses the VS engine. Prose aims to make n-D feel like 1/2/3-D.
   ============================================================ */
'use strict';

const CHAPTERS = (() => {
const {el,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,clamp,fmt,C,randUnit,
       numberline,board3d,spanBoard,fourRep,projectionBoard,ladder,
       worked,gallery,matrixBoard,analogyDemo,
       configSpace,possibilityCounter,morphPath,diffVector,webGraph,
       matrixGrid,matrixHTML,rrefStepper,systemLines,
       eigenExplorer,detArea,leastSquares,pcaCloud,practiceSet,rowOpSolver,
       matmulBuilder,cofactorBuilder,eigenCheck,gramSchmidtViz}=VS;
/* ---------- chapter chrome helpers ---------- */
function head(root,n,c){
  // auto-number from position in the course (ignore hand-passed n)
  let num=n;
  try{const i=CHAPTERS.findIndex(x=>x.id===c.id);if(i>=0)num=i+1;}catch(e){}
  if(c.part) root.append(el('div','part-banner',c.part));
  root.append(el('div','eyebrow',`Chapter ${num}`));
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
   PART ½ — THE BIG PICTURE (what a space really is)
   ============================================================ */

const cBox={id:'notbox',part:'Part ½ · The big picture',title:'Space is not a box',
  sub:'Before any machinery, we have to kill one picture you almost certainly carry — that space is an empty container things sit inside. It will sabotage everything later. Swap it now, while it\'s cheap.',
render(root){
  head(root,3,cBox);
  root.append(p('Here\'s the picture your brain defaults to: <b>space is an empty box, and things go in the box.</b> The room existed before you walked in and stays after you leave. Natural — and, for what\'s coming, poisonous.'));
  root.append(box('trap','the wrong picture','<b>box first, things later.</b> An empty room exists; then you add a chair, a bed, you. Space is the stage; objects are the actors that walk onto it. Natural — and about to cause trouble.'));
  root.append(box('key','the problem','If space is a box that exists on its own, the box must have <em>positions</em> in it before anything arrives. But a position is a <b>relationship</b> — “2 metres from the wall,” “left of the table.” Take away every object and there\'s nothing to relate to. “Here” relative to what? So the positions were never there. <span class="aha">The box was never there.</span>'));
  root.append(h3('Feel it: delete the relationships, watch the space vanish'));
  root.append(p('Below is a little “space” of five cities — the dots are the cities, the lines are the relationships (roads, distances). Hit the button to delete every relationship and watch what\'s left.'));
  const L=lab('Is the space the dots, or the web?','See','see');
  L.append(webGraph({
    nodes:[{label:'Paris',color:C.accent},{label:'Brussels',color:C.accentb},{label:'Amsterdam',color:C.accentc},{label:'Geneva',color:C.accentd},{label:'Berlin',color:C.gold}],
    edges:[[0,1,3],[1,2,3],[0,3,2],[1,4,2],[3,0,2],[2,4,3]],
    caption:'Cities + connections = a transport network. The structure is the <b>web of relationships</b>, not the empty air around the dots.'}));
  root.append(box('aha-box','the swap','<b>Old:</b> space exists first; things go inside. &nbsp; <b>New:</b> things and their relationships come first — <span class="aha">the space IS the web of relationships.</span> Take the cast away and you don\'t get an empty stage; you get no play.'));
  root.append(el('div','pull','Why swap now? Because in a few chapters I\'ll say “a photograph is a point in a million-dimensional space.” With the box picture that\'s nonsense — <em>where</em> is this space? With the web picture it\'s obvious: a photo relates to other photos in a million measurable ways, and that web is the space.'));
  root.append(box('key','one honest caveat','Mathematically you <em>can</em> write \\((3,7)\\) with no object there — coordinates are a useful language. The point isn\'t “space can\'t exist empty.” It\'s: <b>don\'t think of a space as a container. Think of it as a system of possible relationships.</b> Coordinates describe the web; they aren\'t the web.'));
  root.append(quiz({question:'You remove every object and relationship from a space. What remains?',
    options:[{t:'Nothing meaningful — positions, distances, directions were all relationships',ok:true,why:'Right. “Position” only means something relative to other things. No relationships, no structure, no space.'},
      {t:'A pristine empty container with all its positions intact',ok:false,why:'That\'s the box myth. A position IS a relationship; with nothing to relate to, there are no positions.'}]}));
  root.append(summary(['Kill the “space = empty box” picture.','A position is a relationship, not a pre-existing slot.','Space = things + how they relate. The web is the space.','This makes “a photo is a point in a million-D space” sensible later.']));
}};

const cPoint={id:'point',part:'Part ½ · The big picture',title:'A photograph is a point',
  sub:'The famous mind-bender, made obvious. A configuration — a whole image — is a single point in a space of possibilities. Build the smallest such space by hand.',
render(root){
  head(root,4,cPoint);
  root.append(p('Think of a machine with one knob per pixel. A <em>setting of all the knobs</em> produces one image. So one image = one list of numbers = <b>one point</b> in the space of all possible images. Let\'s make the tiniest version you can hold in your hand: a 2×2 black-and-white image — just 4 pixels.'));
  const L=lab('The entire space of 2×2 images','Play');
  L.append(configSpace());
  root.append(L);
  root.append(box('aha-box','the whole space fits on screen','With 4 pixels and 2 values each there are only \\(2^4 = 16\\) possible images — and you\'re looking at <em>all of them</em>. Each little square is one <b>point</b>. “The space” isn\'t a room they float in; it\'s literally this collection of possibilities plus how they relate.'));
  root.append(h3('Now let the space explode'));
  root.append(p('Add pixels and brightness levels and count the possibilities. This is where combinatorics meets the space — slide both up.'));
  const L2=lab('Count the possibilities','Play');L2.append(possibilityCounter());root.append(L2);
  root.append(worked({title:'how many photographs exist?',
    prompt:'A real photo: 1,000,000 pixels, each with 256 brightness values. How many possible images?',
    steps:['Each pixel independently has 256 choices.',
      'Multiply choices across all pixels: \\(256 \\times 256 \\times \\dots\\) (a million times).',
      'That\'s \\(256^{1{,}000{,}000}\\) — a number with over two million digits.'],
    result:'Vastly more than the atoms in the universe. Every possible photograph — every one that ever could be taken — is a single point in that space.'}));
  root.append(box('key','combinatorics vs. the real thing','Counting works when values are <em>discrete</em> (0 or 1, or 0–255). But let each pixel be any <em>real</em> number and there are <b>infinitely</b> many images — so counting isn\'t what defines the space. What defines it is: <span class="aha">what can these points do together?</span> Can we subtract two? Average them? That structure — next chapter — is the real subject.'));
  root.append(box('aha-box','why call it a “point”','A million-number photograph feels like a huge complicated object. But relative to the space of <em>all</em> photographs, it\'s just one location — one choice among the possibilities. Calling it a “point” is the mental move that locks everything together: complex object out here, simple point in there.'));
  root.append(quiz({question:'A 1000×1000 black-and-white (2-value) image — how many possible images, and what is each one?',
    options:[{t:'2^(1,000,000) images; each image is one point in the space',ok:true,why:'Exactly. A million pixels, 2 choices each. Each specific image = one point among those possibilities.'},
      {t:'1,000,000 images; each is a pixel',ok:false,why:'A pixel isn\'t an image. Each whole image is one point; there are 2^(1,000,000) of them.'}]}));
  root.append(summary(['One image = one list of numbers = one point in image-space.','Discrete values → combinatorics counts the points.','Real values → infinitely many points; counting stops mattering.','What matters is what points can do together (next).']));
}};

const cDiff={id:'diff',part:'Part ½ · The big picture',title:'A difference is a direction',
  sub:'Here\'s where geometry appears out of thin air. Subtract two configurations and you get a vector that means “how to turn one into the other” — a direction of change, with no physical arrow anywhere.',
render(root){
  head(root,5,cDiff);
  root.append(p('Take two photos A and B. Compare them pixel by pixel: \\(B - A\\) is a new list of numbers — the <b>change</b> that turns A into B. That difference is a vector, and it points in a <em>direction</em> through image-space. Watch a concrete one:'));
  const L=lab('B − A is the vector “brighten”','See','see');L.append(diffVector());root.append(L);
  root.append(box('aha-box','direction without north','If B is A-but-brighter, then \\(B-A \\approx (2,2,2,\\dots,2)\\) — “add a little to every pixel.” That\'s a genuine <b>direction</b> in the space, and it means something human: <em>brighter</em>. Not north/up — a <span class="aha">particular way of changing the thing.</span> A direction is just a way to change.'));
  root.append(h3('Travel along that direction: a path through possibility-space'));
  root.append(p('If \\(B-A\\) is a direction, then \\(A + t\\,(B-A)\\) walks from A to B as \\(t\\) goes 0→1 — and every step is a <em>real image</em>. Slide it and watch yourself travel through the space.'));
  const L2=lab('Walk from photo A to photo B','Play');L2.append(morphPath());root.append(L2);
  root.append(math('A + t\\,(B-A) \\quad\\text{for } t:0\\to1 \\;=\\; \\text{the straight path from } A \\text{ to } B'));
  root.append(box('key','geometry from nothing physical','Look what we built with only subtract, scale, and add: a <b>direction</b> (\\(B-A\\)), a <b>path</b> (\\(A+t(B-A)\\)), and “keep going past B” (\\(t>1\\)). No room, no physical arrows — just possibilities + operations. <span class="aha">That\'s geometry, created out of relationships alone.</span>'));
  root.append(worked({title:'continue past B',
    prompt:'Photos A and B. What is \\(A + 2(B-A)\\), in words?',
    steps:['\\(B-A\\) is the change “A → B.”',
      'Doubling it, \\(2(B-A)\\), is “twice that change.”',
      'Adding to A: keep moving in the same direction, past B, the same distance again.'],
    result:'You moved along a direction in image-space — e.g. “twice as much brighter.” Same machinery as arrows on paper, zero paper involved.'}));
  root.append(quiz({question:'A is a dark photo; B is the same photo brighter. What does the vector B−A represent?',
    options:[{t:'A direction of change — “make every pixel brighter”',ok:true,why:'Yes. Differences are directions; this one means “brighten.” Moving along it changes the image in that specific way.'},
      {t:'A physical arrow pointing north in a room',ok:false,why:'There\'s no room and no north. “Direction” here means a particular way of changing the configuration.'}]}));
  root.append(summary(['B−A = the change turning A into B = a vector.','A vector is a <em>direction</em>: a particular way to change a thing.','A + t(B−A) is a path through possibility-space; every point is real.','Geometry emerges from subtract/scale/add alone — no physical space needed.']));
}};

const cWebspace={id:'webspace',part:'Part ½ · The big picture',title:'Relationships ARE the space',
  sub:'Put it together. “Closeness,” “direction,” “between” — all of it lives in the relationships between points, not in any background. That web is the space, and it\'s why one machinery fits everything.',
render(root){
  head(root,6,cWebspace);
  root.append(p('Photographs aren\'t a random pile. Some are near (same scene, new lighting), some are far (totally different scenes). That <b>closeness</b> isn\'t physical — it\'s the length of \\(B-A\\), a number you compute. The whole space is this web of near/far/direction relationships.'));
  const L=lab('The space is the web, not the dots','See','see');
  L.append(webGraph({
    nodes:[{label:'A ☀',color:C.accent},{label:'B ☀+',color:C.accentb},{label:'C 🌙',color:C.accentc},{label:'D 🌿',color:C.accentd},{label:'E 🌊',color:C.gold},{label:'F 🔥',color:C.green}],
    edges:[[0,1,5],[0,2,2],[2,3,3],[3,4,2],[4,5,3],[1,3,1],[0,4,1]],
    caption:'Photos as points; thick line = very similar, thin = barely. The space is this <b>web of similarities</b>. Delete it and the photos are just an unrelated heap.'}));
  root.append(box('aha-box','same idea, everywhere','<b>Images:</b> points = photos, relationships = pixel-difference, similarity. <b>Physical space:</b> points = locations, relationships = distance, direction, angle. <b>A network:</b> points = cities, relationships = roads, travel time. Different stuff, <span class="aha">one idea: a world of things + a structure for how they relate.</span>'));
  root.append(h3('The four sentences to carry forever'));
  root.append(box('key','lock this in',`
    <b>space</b> = a world of possibilities (not an empty box)<br>
    <b>point</b> = one possibility (one configuration — e.g. one photograph)<br>
    <b>vector</b> = a change/relationship between possibilities (\\(B-A\\))<br>
    <b>direction</b> = a particular way of changing`));
  root.append(el('div','pull','Whenever you hear “point in space,” don\'t picture a dot in a room. Ask: <em>point among what possibilities?</em> Physical space → possible locations. Image space → possible images. Audio → possible sounds. Portfolio → possible portfolios. The word “point” just means one particular possibility.'));
  root.append(box('aha-box','why this unlocks everything','Because the space is relationships — not a container — the <em>same</em> machinery (subtract, scale, add; length; angle) describes photographs, sounds, word-meanings, motion, and portfolios. You\'re no longer memorizing what a vector space is. You\'re starting to <span class="aha">see it.</span>'));
  root.append(quiz({question:'What is “closeness” between two photographs?',
    options:[{t:'The length of their difference vector B−A — a computed relationship',ok:true,why:'Exactly. Closeness is mathematical (a number), living in the relationship between points, not in any background space.'},
      {t:'How near they physically float in an invisible room',ok:false,why:'There\'s no room. Closeness is the size of the difference — pure relationship.'}]}));
  root.append(summary(['Closeness/direction/between live in the relationships, not a background.','The web of relationships IS the space.','space=possibilities, point=one possibility, vector=a change, direction=a way to change.','One machinery fits images, sound, meaning, motion — because all are webs of relationships.']));
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
  root.append(h3('Is a given vector in the span? (the acid test)'));
  root.append(p('“Span” becomes concrete when you ask: <em>can I build this specific target?</em> That\'s just solving a system — which ties Part II straight to Part VI.'));
  root.append(worked({title:'is (7, 4) in the span of (2, 1) and (1, 3)?',
    prompt:'Find scalars \\(c_1, c_2\\) with \\(c_1(2,1) + c_2(1,3) = (7,4)\\), or show none exist.',
    steps:[
      'Write the two component equations: \\(2c_1 + c_2 = 7\\) and \\(c_1 + 3c_2 = 4\\).',
      'From the second, \\(c_1 = 4 - 3c_2\\). Substitute: \\(2(4-3c_2)+c_2 = 7 \\Rightarrow 8 - 5c_2 = 7 \\Rightarrow c_2 = \\tfrac15\\).',
      'Then \\(c_1 = 4 - 3\\cdot\\tfrac15 = \\tfrac{17}{5}\\).'],
    result:'Yes — \\((7,4) = \\tfrac{17}{5}(2,1) + \\tfrac15(1,3)\\). “Is it in the span?” ALWAYS means “does this system have a solution?” — and since the two vectors are independent, the answer here is yes for <em>every</em> target.'}));
  root.append(box('key','span in 3D: line, plane, or all of space','One nonzero vector spans a <b>line</b>. Two independent vectors span a <b>plane</b> (through the origin). Three independent vectors span <b>all of \\(\\mathbb R^3\\)</b>. Add a fourth vector in 3D and it\'s guaranteed redundant — there\'s no room for a fourth independent direction. The number of independent vectors = the dimension of the span.'));
  root.append(box('trap','the tempting wrong picture','It\'s natural to imagine the span of \\(\\mathbf a\\) and \\(\\mathbf b\\) as the <em>region between them</em> — like a pizza slice. <b>Wrong.</b> The scalars can be <em>negative</em> and <em>bigger than 1</em>, so you shoot out past both vectors and behind the origin in every direction. Two independent 2D vectors don\'t span a wedge — they span the <em>entire plane</em>. “Between” is a convex-combination idea; span is a linear-combination idea, and linear is much bigger.'));
  root.append(summary(['Span = all points reachable by scale-and-add.','“Is v in the span?” = “does c₁a+c₂b+…=v have a solution?”','3D spans: 1 vec → line, 2 → plane, 3 → all of space.','Different directions → whole space; dependent → something smaller.']));
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
  root.append(h3('Actually computing new coordinates'));
  root.append(p('“Change of basis” isn\'t vague — it\'s a concrete calculation, and it\'s just solving a system (Part VI again).'));
  root.append(worked({title:'re-express (4, 2) in a new basis',
    prompt:'New rulers are \\(\\mathbf b_1=(1,1)\\) and \\(\\mathbf b_2=(1,-1)\\). Find the coordinates of \\((4,2)\\) in this basis.',
    steps:[
      'We need \\(c_1(1,1)+c_2(1,-1)=(4,2)\\).',
      'Component equations: \\(c_1+c_2=4\\) and \\(c_1-c_2=2\\).',
      'Add them: \\(2c_1=6\\Rightarrow c_1=3\\). Subtract: \\(2c_2=2\\Rightarrow c_2=1\\).'],
    result:'In the new basis, \\((4,2)\\) has coordinates \\((3,1)\\) — meaning \\(3\\mathbf b_1+1\\mathbf b_2\\). Same point, new numbers. The matrix whose columns are \\(\\mathbf b_1,\\mathbf b_2\\) converts <em>new</em> coords back to standard; its inverse goes the other way.'}));
  root.append(box('key','the change-of-basis matrix','Put the new basis vectors in the columns of a matrix \\(P\\). Then \\(P\\) turns new-coordinates into standard ones, and \\(P^{-1}\\) turns standard into new. That\'s the whole mechanism — and it\'s why “similar matrices” (Part IX) look like \\(P^{-1}AP\\): sandwich the map between a basis change and its undo.'));
  root.append(summary(['A basis = your chosen rulers.','Coordinates = "how much of each ruler."','Change basis → numbers change, vector doesn\'t.','New coords = solve c₁b₁+c₂b₂+… = v; the basis matrix P (and P⁻¹) convert.']));
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
  root.append(box('trap','the mistake almost everyone makes once','“Length of \\((3,4)\\) is \\(3+4=7\\).” <b>No.</b> You must <em>square</em> first: \\(\\sqrt{3^2+4^2}=\\sqrt{25}=5\\), not 7. Adding the raw numbers ignores the right-angle — it would only be right if the vector went purely along one axis. Square, add, <em>then</em> root, always in that order.'));
  const Lpl=lab('Practice: lengths','Practice','');
  Lpl.append(p('Square, add, root. Type the number.'));
  Lpl.append(practiceSet(['length'],4));
  root.append(Lpl);
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
  root.append(h3('Where does that formula even come from?'));
  root.append(p('We should never hand you \(\mathbf a\cdot\mathbf b = \lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\) as magic. Here is exactly why it\'s true, from the length recipe you already own.'));
  root.append(worked({title:'deriving dot = ‖a‖‖b‖cosθ from Pythagoras',
    prompt:'Start from the Law of Cosines on the triangle formed by \(\mathbf a\), \(\mathbf b\), and the side \(\mathbf a-\mathbf b\).',
    steps:[
      'Law of cosines: \(\lVert\mathbf a-\mathbf b\rVert^2 = \lVert\mathbf a\rVert^2 + \lVert\mathbf b\rVert^2 - 2\lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\).',
      'But length is “sum of squares,” so expand the left side entry by entry: \(\lVert\mathbf a-\mathbf b\rVert^2 = \sum_i (a_i-b_i)^2 = \sum a_i^2 - 2\sum a_i b_i + \sum b_i^2\).',
      'That is \(\lVert\mathbf a\rVert^2 - 2(\mathbf a\cdot\mathbf b) + \lVert\mathbf b\rVert^2\), where \(\mathbf a\cdot\mathbf b=\sum a_i b_i\) is just the multiply-and-add rule.',
      'Set the two expressions equal. The \(\lVert\mathbf a\rVert^2\) and \(\lVert\mathbf b\rVert^2\) cancel, leaving \(-2(\mathbf a\cdot\mathbf b) = -2\lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\).'],
    result:'Divide by −2: \(\mathbf a\cdot\mathbf b = \lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\). The “multiply matching numbers and add” rule and the geometric “lengths times cosine” are the SAME thing — proven, not asserted.'}));
  root.append(box('key','so the sign is forced','Since \(\lVert\mathbf a\rVert,\lVert\mathbf b\rVert>0\), the sign of the dot product is exactly the sign of \(\cos\theta\): positive for \(\theta<90^\circ\) (agree), zero at \(90^\circ\) (perpendicular), negative beyond (clash). That\'s why the sign-flip you dragged happens precisely at a right angle — it\'s not a convention, it falls out of the algebra.'));
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
  const Lpd=lab('Practice: dot products & angles','Practice','');
  Lpd.append(p('Compute the dot product, and read the angle where asked.'));
  Lpd.append(practiceSet(['dot','angle','length'],5));
  root.append(Lpd);
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
  root.append(worked({title:'project one vector onto another',
    prompt:'How much of \\(\\mathbf b=(4,2)\\) points along \\(\\mathbf a=(3,0)\\)? Find the projection.',
    steps:[
      'Scalar amount: \\(t = \\dfrac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a} = \\dfrac{3\\cdot4+0\\cdot2}{3\\cdot3+0\\cdot0} = \\dfrac{12}{9} = \\tfrac{4}{3}\\).',
      'Projection vector: \\(t\\,\\mathbf a = \\tfrac{4}{3}(3,0) = (4,0)\\).',
      'Sanity check: the leftover \\(\\mathbf b - (4,0) = (0,2)\\) is perpendicular to \\(\\mathbf a=(3,0)\\) — dot product 0. ✓'],
    result:'The shadow of \\((4,2)\\) on the x-axis direction is \\((4,0)\\) — exactly the x-part, as expected. Always sanity-check by confirming the leftover is perpendicular.'}));
  const Lp=lab('Practice: scalar projection','Practice','');
  Lp.append(p('Find \\(t=(a\\cdot b)/(a\\cdot a)\\), the amount of a in b\'s shadow.'));
  Lp.append(practiceSet(['projscalar','dot'],4));
  root.append(Lp);
  root.append(summary(['Projection = shadow of v on a direction.','Its length = dot product with the unit direction.','Sanity check: the leftover (v − projection) is perpendicular.','Decomposing into parts underlies compression, denoising, and fitting.']));
}};

const cOrtho={id:'ortho',part:'Part III · Geometry',title:'Orthogonality — perfect independence',
  sub:'Perpendicular vectors share nothing. They make the cleanest possible rulers — and in high dimensions, they\'re almost the only kind there is.',
render(root){
  head(root,15,cOrtho);
  root.append(p('Two vectors are <span class="term">orthogonal</span> (perpendicular) when their dot product is 0. Orthogonal rulers are ideal: each measures a totally separate thing, with zero overlap. The x and y axes are orthogonal; so are the "wavy patterns" JPEG uses.'));
  root.append(box('aha-box','a teaser for the weirdness ahead','In 2D it takes effort to find perpendicular vectors. In 1000 dimensions, <em>almost every random pair is already nearly perpendicular</em> — which turns out to be the reason AI embeddings work. We\'ll feel that in Part IV.'));
  root.append(h3('The payoff: coordinates become free'));
  root.append(p('In a general basis, finding a vector\'s coordinates means <em>solving a system</em>. In an <b>orthonormal</b> basis it collapses to a dot product — no solving at all.'));
  root.append(worked({title:'coordinates in an orthonormal basis',
    prompt:'The rotated axes \\(\\mathbf u_1=(\\tfrac{3}{5},\\tfrac{4}{5})\\), \\(\\mathbf u_2=(-\\tfrac{4}{5},\\tfrac{3}{5})\\) are orthonormal. Find the coordinates of \\(\\mathbf v=(5,0)\\).',
    steps:[
      'Check they\'re orthonormal: each has length 1, and \\(\\mathbf u_1\\cdot\\mathbf u_2 = -\\tfrac{12}{25}+\\tfrac{12}{25}=0\\). ✓',
      'Coordinate 1 = \\(\\mathbf v\\cdot\\mathbf u_1 = 5\\cdot\\tfrac{3}{5}+0 = 3\\).',
      'Coordinate 2 = \\(\\mathbf v\\cdot\\mathbf u_2 = 5\\cdot(-\\tfrac{4}{5})+0 = -4\\).'],
    result:'\\(\\mathbf v = 3\\mathbf u_1 - 4\\mathbf u_2\\) — no system to solve, just two dot products. That is the entire reason orthonormal bases (and Gram–Schmidt, and the SVD) are the cleanest tools in the subject.'}));
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

/* ============================================================
   PART VI — SYSTEMS OF EQUATIONS
   ============================================================ */

const cSysGeo={id:'sysgeo',part:'Part VI · Systems',title:'Equations are shapes that must agree',
  sub:'A system of linear equations is a bunch of flat shapes — lines, planes — and “solving” means finding where they all meet. Three outcomes, and you can see all three.',
render(root){
  head(root,0,cSysGeo);
  root.append(p('One linear equation like \\(x+y=3\\) is a <b>line</b> — every point on it satisfies the equation. Two equations = two lines. “Solving the system” means: <b>which point is on both lines at once?</b> Drag the coefficients and watch the three possible fates.'));
  const L=lab('Two lines, one system','See','see');L.append(systemLines());root.append(L);
  root.append(box('aha-box','the three fates of any linear system','<b>Cross once</b> → exactly one solution. <b>Parallel</b> → no solution (the equations contradict). <b>Same line</b> → infinitely many solutions (one equation was redundant). These three are the <em>only</em> possibilities — for 2 lines, 3 planes, or 900-dimensional hyperplanes.'));
  root.append(box('key','two ways to read the same system','<b>Row picture:</b> each equation is a shape; solutions are where shapes meet (what you just saw). <b>Column picture:</b> the same system asks “what combination of these column-vectors builds the target?” — that\'s the span idea from Part II. Two lenses, one truth. We\'ll use both.'));
  root.append(worked({title:'reading a system as columns',
    prompt:'The system \\(2x+y=5,\\; x+3y=6\\) as a column combination.',
    steps:['Write it as \\(x\\begin{bmatrix}2\\\\1\\end{bmatrix}+y\\begin{bmatrix}1\\\\3\\end{bmatrix}=\\begin{bmatrix}5\\\\6\\end{bmatrix}\\).',
      'So: “what amounts \\(x,y\\) of the two column-vectors add up to the target?”',
      'That\'s asking if the target is in the <em>span</em> of the columns.'],
    result:'Solving a system = finding the linear combination of columns that hits the target. Row picture and column picture always agree.'}));
  root.append(quiz({question:'Two lines in a system are parallel but not identical. How many solutions?',
    options:[{t:'None — they never meet, so no point satisfies both',ok:true,why:'Right. Parallel distinct lines = inconsistent system = no solution.'},
      {t:'Infinitely many',ok:false,why:'That\'s the case where they\'re the SAME line. Distinct parallel lines share no point.'}]}));
  root.append(summary(['A linear equation is a flat shape (line/plane/hyperplane).','Solving = where all the shapes meet.','Exactly three fates: one / none / infinitely many solutions.','Row picture (shapes meet) = column picture (span a target).']));
}};

const cElim={id:'elim',part:'Part VI · Systems',title:'Gaussian elimination, step by step',
  sub:'The universal algorithm to solve ANY linear system: use three legal row moves to grind the matrix into a form where the answer is obvious. Watch every step.',
render(root){
  head(root,0,cElim);
  root.append(p('You can do three things to the rows of a system without changing its solutions: <b>swap</b> two rows, <b>scale</b> a row by a nonzero number, and <b>add a multiple</b> of one row to another. Applied cleverly, they reduce any matrix to <span class="term">reduced row echelon form</span> (RREF), where you can read off the solution. Run it and step through:'));
  const L=lab('Elimination, one move at a time','Play');
  L.append(rrefStepper({rows:3,cols:4,values:[[1,2,1,2],[2,1,-1,1],[1,-1,2,3]]}));
  root.append(L);
  root.append(h3('Now you drive'));
  root.append(p('Watching isn\'t doing. Below, <b>you</b> choose the row operations — scale, add, swap — and reach reduced row echelon form yourself. Stuck? Hit “hint” for the next move. This is where the procedure becomes muscle memory.'));
  const Ld=lab('Reach RREF yourself','Play');
  Ld.append(rowOpSolver({matrix:[[2,4,-2,2],[1,3,1,5]]}));
  root.append(Ld);
  root.append(box('aha-box','why the three moves are “legal”','Each move is <em>reversible</em> and preserves the solution set — swapping the order of equations, rescaling one, or adding one equation to another never changes which points satisfy them all. So the final, simple system has the <em>same</em> answers as the scary original.'));
  root.append(box('key','echelon vs reduced echelon','<b>Echelon form:</b> a staircase of leading entries, zeros below. <b>Reduced (RREF):</b> also zeros <em>above</em> each leading 1, and each leading entry is 1. RREF is unique — the canonical fingerprint of the matrix.'));
  root.append(h3('A full solve, start to finish'));
  root.append(p('Elimination gets you to a staircase; then <b>back-substitution</b> reads off the answer from the bottom up. Here\'s the whole round trip on a 3-variable system.'));
  root.append(worked({title:'solve a 3×3 system completely',
    prompt:'Solve \\(x+y+z=6,\\; 2y+5z=-4,\\; 2x+5y-z=27\\).',
    steps:[
      'Eliminate \\(x\\) from equation 3: subtract 2×(eq 1) → \\(3y-3z=15\\), i.e. \\(y-z=5\\).',
      'Now equations are \\(x+y+z=6\\), \\(2y+5z=-4\\), \\(y-z=5\\). Eliminate \\(y\\): from eq 2 minus 2×(eq 3): \\(7z=-14\\Rightarrow z=-2\\).',
      'Back-substitute \\(z=-2\\) into \\(y-z=5\\): \\(y=3\\).',
      'Back-substitute into eq 1: \\(x+3-2=6\\Rightarrow x=5\\).'],
    result:'\\((x,y,z)=(5,3,-2)\\). Forward elimination makes the staircase; back-substitution climbs it. Check by plugging back in — all three equations hold.'}));
  const Lp=lab('Practice: solve 2×2 systems','Practice','');
  Lp.append(p('Each has a whole-number solution. Give x and y.'));
  Lp.append(practiceSet(['solve2'],4));
  root.append(Lp);
  root.append(quiz({question:'Which row operation is NOT allowed (would change the solutions)?',
    options:[{t:'Multiply a row by 0',ok:true,why:'Correct — that\'s forbidden. Scaling by 0 destroys the equation (0=0) and loses information. You may scale only by NONzero numbers.'},
      {t:'Swap two rows',ok:false,why:'Swapping is fine — order of equations doesn\'t matter.'},
      {t:'Add 3× row 1 to row 2',ok:false,why:'Allowed — adding a multiple of one row to another preserves solutions.'}]}));
  root.append(summary(['Three legal moves: swap, scale (by nonzero), add-a-multiple.','They preserve the solution set, so simplify freely.','Goal: reduced row echelon form (RREF) — answer readable, and unique.']));
}};

const cRank={id:'rank',part:'Part VI · Systems',title:'Rank, pivots & how many solutions',
  sub:'The number of pivots after elimination — the rank — tells you everything: whether a solution exists, and whether it\'s unique. One number, the whole story.',
render(root){
  head(root,0,cRank);
  root.append(p('After elimination, count the <b>pivots</b> (leading 1s). That count is the <span class="term">rank</span> — the number of genuinely independent equations (or independent columns). Rank is the deepest single number attached to a matrix.'));
  root.append(box('key','the rule that decides everything',`For a system with \\(n\\) unknowns:<br>
    • <b>rank = n</b>, and consistent → <span style="color:var(--accentc)">exactly one solution</span> (every variable pinned).<br>
    • <b>rank &lt; n</b>, and consistent → <span style="color:var(--accentd)">infinitely many</span> (free variables roam).<br>
    • a pivot in the “=” column (like \\(0=1\\)) → <span style="color:var(--accent)">no solution</span> (contradiction).`));
  root.append(h3('Free variables = the shape of the solution set'));
  root.append(p('If rank &lt; number of unknowns, the leftover unknowns are <b>free</b> — you can set them to anything and the rest follow. Each free variable adds a dimension to the solution set: one free variable → the solutions form a line; two → a plane; and so on.'));
  root.append(worked({title:'counting solutions from rank',
    prompt:'A system has 4 unknowns. Elimination gives 2 pivots and no contradiction. Describe the solutions.',
    steps:['Rank = 2 (two pivots), unknowns = 4.',
      'Free variables = \\(4 - 2 = 2\\).',
      'Consistent + 2 free variables → a 2-dimensional sheet of solutions.'],
    result:'Infinitely many solutions, forming a 2D plane inside 4D space. Rank told us instantly.'}));
  root.append(box('aha-box','rank is independence, counted','Rank = how many rows are truly independent = how many columns are truly independent (these are always equal!). It\'s the “true size” of what the matrix does — the same idea as dimension from Part II, now computable by elimination.'));
  root.append(quiz({question:'A consistent system has 5 unknowns and rank 5. How many solutions?',
    options:[{t:'Exactly one',ok:true,why:'rank = number of unknowns and consistent → unique solution. No free variables.'},
      {t:'Infinitely many',ok:false,why:'That needs rank < unknowns. Here rank = 5 = unknowns, so every variable is pinned.'}]}));
  root.append(summary(['Rank = number of pivots = independent equations/columns.','rank = unknowns (consistent) → unique solution.','rank < unknowns (consistent) → free variables → infinite solutions.','Contradiction row (0 = nonzero) → no solution.']));
}};

const cInverse={id:'inverse',part:'Part VI · Systems',title:'The inverse — undoing a matrix',
  sub:'When a square matrix doesn\'t squash space, it can be undone. That undo is the inverse, and it solves Ax=b in one shot: x = A⁻¹b.',
render(root){
  head(root,0,cInverse);
  root.append(p('A matrix is a verb (Part V) — it moves space. If it doesn\'t collapse any dimension (determinant ≠ 0), the move can be <b>reversed</b>. The reversing matrix is the <span class="term">inverse</span>, written \\(A^{-1}\\), and it satisfies \\(A^{-1}A = I\\) (do, then undo, = do nothing).'));
  const L=lab('Invert a matrix (and see it fail)','Play');
  const grid=matrixGrid({rows:2,cols:2,values:[[2,1],[1,3]]});
  const out=el('div');out.style.cssText='margin-top:10px';const nar=narrate('Edit A, then invert.');
  const btn=el('button','btn','compute A⁻¹');
  btn.onclick=()=>{const A=grid.get();const d=LA.det(A);const Ai=LA.inv(A);
    if(!Ai){out.innerHTML='';nar.say(`<span class="r">det = 0 — no inverse.</span> This matrix squashes the plane onto a line, throwing away a dimension. You can\'t undo that; many inputs map to the same output.`);}
    else{out.innerHTML=`A⁻¹ = ${matrixHTML(Ai)} &nbsp; and &nbsp; A⁻¹A = ${matrixHTML(LA.matmul(Ai,A).map(r=>r.map(x=>Math.abs(x)<1e-9?0:x)))}`;
      nar.say(`det = <span class="k">${LA.fmtNum(d)}</span> ≠ 0, so A is invertible. Notice A⁻¹A = I — the identity, i.e. “do nothing.”`);
      if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([out]).catch(()=>{});}};
  const ctr=el('div','controls');ctr.append(btn);
  L.append(grid.el,ctr,out,nar);root.append(L);
  root.append(math('A x = b \\quad\\Longrightarrow\\quad x = A^{-1} b'));
  root.append(box('aha-box','why inverse solves systems instantly','If \\(Ax=b\\), multiply both sides by \\(A^{-1}\\): \\(x = A^{-1}b\\). One matrix-times-vector and you\'re done — <em>if</em> the inverse exists. (In practice, elimination is faster and more stable, but the inverse is the clean idea.)'));
  root.append(box('trap','not everything is invertible','Only <b>square</b> matrices can have inverses, and only when \\(\\det \\neq 0\\) (“non-singular”). A determinant of 0 means the matrix flattened space — information was destroyed, so there\'s nothing to reverse. This is the same “you lost a dimension” idea as rank < n.'));
  root.append(h3('The 2×2 inverse formula — and why it works'));
  root.append(p('For 2×2 there\'s a memorable closed form. It\'s worth knowing <em>and</em> understanding.'));
  root.append(math('\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}'));
  root.append(worked({title:'why that formula is the inverse',
    prompt:'Check that multiplying \\(A\\) by the claimed inverse gives \\(I\\).',
    steps:[
      'Swap the diagonal (\\(a\\leftrightarrow d\\)), negate the off-diagonal (\\(b,c\\)), and divide by \\(\\det=ad-bc\\).',
      'Multiply: \\(\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix} = \\begin{bmatrix}ad-bc&0\\\\0&ad-bc\\end{bmatrix}\\).',
      'That is \\((ad-bc)\\,I\\). Dividing by \\(ad-bc\\) leaves exactly \\(I\\).'],
    result:'So the formula really is \\(A^{-1}\\) — and you can see the division by \\(\\det\\) is what breaks when \\(\\det=0\\): you\'d be dividing by zero, i.e. no inverse exists.'}));
  const Lp=lab('Practice: 2×2 inverses','Practice','');
  Lp.append(p('Give the top-left entry of \\(A^{-1}\\) (a fraction like 3/5 is fine).'));
  Lp.append(practiceSet(['inv2'],4));
  root.append(Lp);
  root.append(quiz({question:'When does a square matrix FAIL to have an inverse?',
    options:[{t:'When its determinant is 0 (it squashes space, losing a dimension)',ok:true,why:'Exactly. det = 0 = singular = not invertible = rank < n. All the same fact.'},
      {t:'When it has negative entries',ok:false,why:'Negative entries are fine. Invertibility is purely about det ≠ 0.'}]}));
  root.append(summary(['Inverse A⁻¹ undoes A: A⁻¹A = I.','Exists only for square matrices with det ≠ 0.','Solves Ax=b in one shot: x = A⁻¹b.','det = 0 ⇔ singular ⇔ rank < n ⇔ no inverse.']));
}};

/* ============================================================
   PART VII — MATRICES DEEP
   ============================================================ */

const cMatmul={id:'matmul',part:'Part VII · Matrices deep',title:'Multiplying matrices = chaining transforms',
  sub:'Matrix multiplication looks like a weird bookkeeping rule. It isn\'t — it\'s “do transform B, then transform A.” Composition of verbs.',
render(root){
  head(root,0,cMatmul);
  root.append(p('Why is matrix multiplication defined by that strange “row-times-column” rule? Because a matrix is a <em>transform</em> (Part V), and multiplying two of them means <b>apply one, then the other</b>. \\(AB\\) means “do B first, then A” — the result is a single matrix that does both in one step.'));
  const L=lab('Compose two transforms','Play');
  const gA=matrixGrid({rows:2,cols:2,values:[[0,-1],[1,0]]});   // rotate 90
  const gB=matrixGrid({rows:2,cols:2,values:[[2,0],[0,1]]});   // stretch x
  const out=el('div');out.style.cssText='margin-top:10px';const nar=narrate('Edit A and B, then multiply.');
  const btn=el('button','btn','compute A·B');
  btn.onclick=()=>{const A=gA.get(),B=gB.get();const AB=LA.matmul(A,B);
    out.innerHTML=`A·B = ${matrixHTML(AB)} <span style="color:var(--muted)">(apply B first, then A)</span>`;
    const BA=LA.matmul(B,A);const same=JSON.stringify(AB)===JSON.stringify(BA);
    nar.say(`Each entry of A·B is a row of A dotted with a column of B. ${same?'':'<b>Order matters:</b> A·B ≠ B·A here — rotating then stretching ≠ stretching then rotating.'}`);
    if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([out]).catch(()=>{});};
  const row=el('div');row.style.cssText='display:flex;gap:16px;align-items:center;flex-wrap:wrap';
  const wa=el('div');wa.innerHTML='<div style="font-size:.8rem;color:var(--muted)">A (2nd)</div>';wa.append(gA.el);
  const wb=el('div');wb.innerHTML='<div style="font-size:.8rem;color:var(--muted)">B (1st)</div>';wb.append(gB.el);
  row.append(wa,wb);const ctr=el('div','controls');ctr.append(btn);
  L.append(row,ctr,out,nar);root.append(L);
  root.append(box('aha-box','the rule, finally sensible','The (i,j) entry of A·B is “row i of A” · “column j of B” because column j of B says where the j-th basis vector goes under B, and then A moves that result. Row-times-column is just “track where each basis vector ends up after both transforms.”'));
  root.append(worked({title:'a full 2×2 product, entry by entry',
    prompt:'Multiply \\(\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}\\).',
    steps:[
      'Top-left = (row 1 of A)·(col 1 of B) = \\(1\\cdot5 + 2\\cdot7 = 19\\).',
      'Top-right = (row 1)·(col 2) = \\(1\\cdot6 + 2\\cdot8 = 22\\).',
      'Bottom-left = (row 2)·(col 1) = \\(3\\cdot5 + 4\\cdot7 = 43\\).',
      'Bottom-right = (row 2)·(col 2) = \\(3\\cdot6 + 4\\cdot8 = 50\\).'],
    result:'\\(\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}\\). Each entry is one row dotted with one column — four little dot products.'}));
  root.append(h3('Now build one yourself'));
  root.append(p('Fill in each entry of the product. Click a cell to see which row and column feed it; the box turns green when you\'re right.'));
  const Lb=lab('Build the product, cell by cell','Play');
  Lb.append(matmulBuilder({A:[[1,2],[3,4]],B:[[2,0],[1,2]]}));
  root.append(Lb);
  root.append(box('key','the dimension rule: inner sizes must match','\\(A\\) is \\(m\\times n\\), \\(B\\) is \\(p\\times q\\). The product \\(AB\\) only exists if \\(n=p\\) (A\'s columns = B\'s rows), because you\'re dotting A\'s rows with B\'s columns — they must be the same length. The result is \\(m\\times q\\) (outer sizes). Mnemonic: \\((m\\times \\underline{n})(\\underline{n}\\times q)=m\\times q\\) — the inner \\(n\\)\'s cancel.'));
  root.append(box('trap','order matters','\\(AB \\neq BA\\) in general — putting on socks then shoes ≠ shoes then socks. Matrix multiplication is <em>not</em> commutative. (It <em>is</em> associative: \\(A(BC)=(AB)C\\).) In fact \\(BA\\) may not even exist if the dimensions don\'t line up both ways!'));
  root.append(quiz({question:'In the product A·B applied to a vector, which transform happens first?',
    options:[{t:'B — it\'s closest to the vector: A(B(x))',ok:true,why:'Right. A·B·x = A(B(x)): B acts first, then A. Read right-to-left.'},
      {t:'A — it\'s written first',ok:false,why:'Written first, but applied LAST. The matrix nearest the vector acts first.'}]}));
  root.append(summary(['Matrix product = compose transforms (do the right one first).','(i,j) entry = row i of A · column j of B.','AB ≠ BA (order matters); A(BC)=(AB)C (associative).']));
}};

const cTranspose={id:'transpose',part:'Part VII · Matrices deep',title:'Transpose & special matrices',
  sub:'Flip a matrix across its diagonal and a surprising amount of structure appears — symmetry, orthogonal matrices, and the shapes that make later theorems work.',
render(root){
  head(root,0,cTranspose);
  root.append(p('The <span class="term">transpose</span> \\(A^{T}\\) swaps rows and columns — flip the matrix across its main diagonal. Simple move, deep consequences.'));
  const L=lab('Flip it','Play');
  const g=matrixGrid({rows:2,cols:3,values:[[1,2,3],[4,5,6]]});
  const out=el('div');out.style.cssText='margin-top:10px';const btn=el('button','btn','transpose');
  btn.onclick=()=>{out.innerHTML='Aᵀ = '+matrixHTML(LA.transpose(g.get()));};
  const ctr=el('div','controls');ctr.append(btn);L.append(g.el,ctr,out);root.append(L);
  root.append(box('key','the special matrices to know',`
    <b>Symmetric</b> (\\(A^{T}=A\\)) — mirror across the diagonal; always has real eigenvalues & perpendicular eigenvectors (huge for PCA).<br>
    <b>Diagonal</b> — only the diagonal is nonzero; just scales each axis independently.<br>
    <b>Identity</b> \\(I\\) — the “do nothing” matrix; \\(IA=A\\).<br>
    <b>Orthogonal</b> (\\(Q^{T}Q=I\\)) — columns are perpendicular unit vectors; rotations & reflections, they preserve length and angle.`));
  root.append(box('aha-box','why transpose matters','\\((AB)^{T}=B^{T}A^{T}\\), and the dot product is \\(\\mathbf a\\cdot\\mathbf b=\\mathbf a^{T}\\mathbf b\\). Transpose is the bridge between “transforms” and “geometry” — it\'s how length, angle, and projection get written in matrix language (Part X).'));
  root.append(quiz({question:'A matrix Q has perpendicular unit-length columns (QᵀQ = I). What does it do to shapes?',
    options:[{t:'Rotates/reflects them without changing sizes or angles',ok:true,why:'Yes — orthogonal matrices are rigid motions. Lengths and angles are preserved; only orientation changes.'},
      {t:'Stretches them by the determinant',ok:false,why:'That\'s a general matrix. Orthogonal ones have |det|=1 and preserve all distances.'}]}));
  root.append(summary(['Transpose Aᵀ = swap rows/columns (flip across diagonal).','Symmetric: Aᵀ=A. Orthogonal: QᵀQ=I (rigid motion).','(AB)ᵀ=BᵀAᵀ; the dot product is aᵀb.','These shapes power the big theorems ahead.']));
}};

/* ============================================================
   PART VIII — DETERMINANTS
   ============================================================ */

const cDet={id:'det',part:'Part VIII · Determinants',title:'The determinant is an area factor',
  sub:'One number that captures what a matrix does to size and orientation. Zero means “collapsed a dimension.” Watch the unit square deform.',
render(root){
  head(root,0,cDet);
  root.append(p('Every 2×2 matrix turns the unit square into a parallelogram. The <span class="term">determinant</span> is <b>the area of that parallelogram</b> (with a sign for orientation). Slide the entries and watch area = det.'));
  const L=lab('det = how area scales','See','see');L.append(detArea());root.append(L);
  root.append(box('aha-box','what the number means','<b>|det| = 2</b> → the transform doubles areas. <b>det &lt; 0</b> → space was flipped (mirrored). <b>det = 0</b> → the square was squashed to a line: a whole dimension collapsed — which is exactly why det=0 means <em>not invertible</em> (Part VI). In 3D it\'s a volume factor; in n-D, an n-volume factor.'));
  root.append(h3('Why is the area exactly ad − bc?'));
  root.append(p('The formula shouldn\'t be memorized blind. Here\'s where \(ad-bc\) comes from — it\'s literally the area of the parallelogram spanned by the two columns.'));
  root.append(worked({title:'deriving the parallelogram area',
    prompt:'The columns \\((a,c)\\) and \\((b,d)\\) span a parallelogram. Find its area.',
    steps:[
      'Enclose it in an \\((a+b)\\times(c+d)\\) bounding rectangle, area \\((a+b)(c+d)=ac+ad+bc+bd\\).',
      'Subtract the bits outside the parallelogram: two triangles of area \\(\\tfrac12 ac\\), two of area \\(\\tfrac12 bd\\), and two rectangles of area \\(bc\\).',
      'Total removed: \\(ac + bd + 2bc\\).',
      'Area \\(= (ac+ad+bc+bd) - (ac+bd+2bc) = ad - bc\\).'],
    result:'The determinant \\(ad-bc\\) IS the parallelogram area — derived, not decreed. The sign tracks orientation: swap the two columns and area → \\(bc-ad\\), the negative.'}));
  root.append(worked({title:'2×2 determinant by hand',
    prompt:'Find \\(\\det\\begin{bmatrix}3&1\\\\2&4\\end{bmatrix}\\).',
    steps:['For \\(\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\), the determinant is \\(ad-bc\\).',
      'Here \\(a=3,b=1,c=2,d=4\\): \\(3\\cdot4 - 1\\cdot2\\).',
      '\\(12 - 2 = 10\\).'],
    result:'det = 10 — this matrix scales every area by 10 and keeps orientation.'}));
  root.append(box('key','the properties worth remembering','\\(\\det(AB)=\\det(A)\\det(B)\\) (areas multiply when you compose). \\(\\det(A^{T})=\\det(A)\\). \\(\\det(A^{-1})=1/\\det(A)\\). Swapping two rows flips the sign. A repeated row makes det = 0.'));
  root.append(box('aha-box','why det(AB) = det(A)·det(B)','It has to be true, geometrically. Apply \\(B\\), then \\(A\\). \\(B\\) scales every area by \\(\\det B\\); then \\(A\\) scales <em>that</em> by \\(\\det A\\). Scaling twice multiplies the factors, so the combined map \\(AB\\) scales area by \\(\\det A\\cdot\\det B\\). And since \\(A A^{-1}=I\\) (area factor 1), \\(\\det A\\cdot\\det A^{-1}=1\\) — which is exactly why \\(\\det A^{-1}=1/\\det A\\), and why \\(\\det A=0\\) can\'t be inverted (you can\'t scale zero area back up to 1).'));
  root.append(h3('Bigger matrices: cofactor expansion'));
  root.append(p('For 3×3 and up, break the determinant into smaller ones. Pick a row, and for each entry multiply it by the determinant of the little matrix left when you delete that entry\'s row and column — with a checkerboard of signs \\(+\,-\,+\).'));
  root.append(worked({title:'a 3×3 determinant by cofactors',
    prompt:'Find \\(\\det\\begin{bmatrix}2&1&0\\\\1&3&1\\\\0&2&2\\end{bmatrix}\\), expanding along the top row.',
    steps:[
      'Entry 2 (sign +): delete its row & column, leaving \\(\\begin{bmatrix}3&1\\\\2&2\\end{bmatrix}\\), det \\(=6-2=4\\). Contribution \\(+2\\cdot4=8\\).',
      'Entry 1 (sign −): leftover \\(\\begin{bmatrix}1&1\\\\0&2\\end{bmatrix}\\), det \\(=2\\). Contribution \\(-1\\cdot2=-2\\).',
      'Entry 0 (sign +): contributes \\(0\\).',
      'Add: \\(8-2+0=6\\).'],
    result:'det = 6. The 3×3 became three 2×2s. The same recipe (with alternating signs) handles any size — though for big matrices, elimination is far faster.'}));
  root.append(box('trap','common mistake: forgetting the signs','The cofactor signs alternate \\(+\,-\,+\,-\dots\) across the row — the middle term is <em>subtracted</em>. Forgetting that flips your answer. And you can expand along <em>any</em> row or column: pick the one with the most zeros to save work.'));
  root.append(h3('Do the cofactor expansion yourself'));
  root.append(p('Type each 2×2 minor, then combine them with the \\(+\,-\,+\) signs to get the total. Each box checks itself.'));
  const Lc=lab('Guided 3×3 determinant','Play');
  Lc.append(cofactorBuilder({A:[[2,1,0],[1,3,1],[0,2,2]]}));
  root.append(Lc);
  const Lp=lab('Practice: determinants','Practice','');
  Lp.append(p('Mixed 2×2 and 3×3 determinants. Type the number.'));
  Lp.append(practiceSet(['det2','det3','trace'],5));
  root.append(Lp);
  root.append(quiz({question:'A 3×3 matrix has determinant 0. What did it do to 3D space?',
    options:[{t:'Squashed it into a plane or line — volume became 0, so it\'s not invertible',ok:true,why:'Exactly. det=0 means a collapsed dimension: the output is flat, information is lost, no inverse exists.'},
      {t:'Doubled every volume',ok:false,why:'That would be det=2. Zero means the volume collapsed to nothing.'}]}));
  root.append(summary(['det = signed area/volume scale factor of the transform.','det < 0 = orientation flipped; det = 0 = dimension collapsed.','det(AB)=det(A)det(B); det=0 ⇔ singular ⇔ no inverse.']));
}};

/* ============================================================
   PART IX — EIGENVALUES & EIGENVECTORS
   ============================================================ */

const cEigen={id:'eigen',part:'Part IX · Eigen',title:'Eigenvectors — the directions a matrix won\'t turn',
  sub:'Most vectors get rotated when a matrix hits them. A special few only get stretched, never turned. Those are eigenvectors — the secret skeleton of the transform.',
render(root){
  head(root,0,cEigen);
  root.append(p('Apply a matrix to a vector and usually it <em>rotates</em>. But for special directions, the output points the <b>same way</b> — the matrix only stretches (or flips) it. Those directions are <span class="term">eigenvectors</span>; the stretch factor is the <span class="term">eigenvalue</span> \\(\\lambda\\). Drag v and hunt for the directions that don\'t turn.'));
  const L=lab('Find the un-turning directions','Play');
  const ee=eigenExplorer({matrix:[[2,1],[1,2]]});
  L.append(ee);
  // matrix picker
  const g=matrixGrid({rows:2,cols:2,values:[[2,1],[1,2]]});
  const btn=el('button','btn ghost','use this matrix');btn.onclick=()=>ee.setMatrix(g.get());
  const ctr=el('div','controls');ctr.append(el('span',null,'<span style="font-size:.85rem;color:var(--muted)">try a matrix:</span>'),g.el,btn);
  L.append(ctr);root.append(L);
  root.append(math('A\\mathbf v = \\lambda \\mathbf v \\quad(\\text{output = a scalar multiple of the input})'));
  root.append(box('aha-box','the defining equation','\(A\mathbf v=\lambda\mathbf v\) says: the matrix acting on \(\mathbf v\) is the <em>same</em> as just scaling \(\mathbf v\) by \(\lambda\). No rotation, no shear — pure stretch. Eigenvectors are the axes the transform is “built around.”'));
  root.append(h3('Why on earth does det(A − λI) = 0 find them?'));
  root.append(p('That equation looks like it fell from the sky. It doesn\'t — it\'s forced, step by step, by the definition plus the Invertible Matrix Theorem. Follow the chain:'));
  root.append(worked({title:'from the definition to the characteristic equation',
    prompt:'We want nonzero \(\mathbf v\) with \(A\mathbf v = \lambda\mathbf v\). Turn that into a condition on \(\lambda\) alone.',
    steps:[
      'Move everything to one side: \(A\mathbf v - \lambda\mathbf v = \mathbf 0\).',
      'Factor out \(\mathbf v\) using the identity \(I\) (so the sizes match): \((A - \lambda I)\mathbf v = \mathbf 0\).',
      'This says the matrix \(A-\lambda I\) sends a <em>nonzero</em> \(\mathbf v\) to \(\mathbf 0\) — i.e. it has a nonzero kernel.',
      'By the Invertible Matrix Theorem, a matrix with a nonzero kernel is <b>singular</b> — its determinant is 0.'],
    result:'So \(\det(A-\lambda I)=0\). It\'s not a trick: it\'s the ONLY way a nonzero vector can be killed. Solving it gives the \(\lambda\)\'s; then \((A-\lambda I)\mathbf v=\mathbf 0\) gives each eigenvector.'}));
  root.append(box('key','the characteristic polynomial','Expanding \(\det(A-\lambda I)\) gives a polynomial in \(\lambda\) (degree \(n\) for an \(n\times n\) matrix). Its roots are the eigenvalues — so an \(n\times n\) matrix has exactly \(n\) of them (counting repeats, and allowing complex ones — Part XVII). This is why eigenvalues exist at all.'));
  root.append(worked({title:'finding eigenvalues (2×2)',
    prompt:'Find the eigenvalues of \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\).',
    steps:['Solve \\(\\det(A-\\lambda I)=0\\): \\(\\det\\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}=0\\).',
      'Expand: \\((2-\\lambda)^2 - 1 = 0\\).',
      '\\(\\lambda^2 -4\\lambda +3 = 0 \\Rightarrow (\\lambda-1)(\\lambda-3)=0\\).'],
    result:'\\(\\lambda = 1\\) and \\(\\lambda = 3\\). One direction is unchanged (×1), the other stretched ×3 — exactly the two eigenlines in the demo.'}));
  root.append(worked({title:'now find the eigenVECTOR for λ = 3',
    prompt:'For \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\) and \\(\\lambda=3\\), find a vector \\(\\mathbf v\\) with \\(A\\mathbf v=3\\mathbf v\\).',
    steps:[
      'Form \\(A-3I = \\begin{bmatrix}2-3&1\\\\1&2-3\\end{bmatrix} = \\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}\\).',
      'Solve \\((A-3I)\\mathbf v=\\mathbf 0\\): the top row says \\(-v_1+v_2=0\\), i.e. \\(v_1=v_2\\).',
      'So any vector with equal components works — pick the simplest, \\(\\mathbf v=(1,1)\\).',
      'Check: \\(A(1,1)=(2{+}1,\\;1{+}2)=(3,3)=3(1,1)\\). ✓'],
    result:'The eigenvector for \\(\\lambda=3\\) is \\((1,1)\\) (or any multiple). Eigenvectors always come as a whole line — direction matters, length doesn\'t. Repeat with \\(\\lambda=1\\) to get \\((1,-1)\\), perpendicular to it (as the spectral theorem promises for symmetric \\(A\\)).'}));
  root.append(box('trap','a common mistake: forgetting eigenvectors are a whole line','\\((1,1)\\), \\((2,2)\\), \\((-5,-5)\\) are all the <em>same</em> eigenvector direction — don\'t treat them as different answers. And never “solve” \\((A-\\lambda I)\\mathbf v=\\mathbf 0\\) by inverting \\(A-\\lambda I\\): its determinant is 0 by design (that\'s how you found \\(\\lambda\\)!), so it has no inverse. You must read the solution off the dependent rows.'));
  root.append(h3('Test your own guess'));
  root.append(p('Type any vector and the app computes \\(A\\mathbf v\\), then tells you whether it came out parallel to \\(\\mathbf v\\) (an eigenvector) or rotated (not). Try (1,1), then something random.'));
  const Lc=lab('Is it an eigenvector?','Play');
  Lc.append(eigenCheck({A:[[2,1],[1,2]]}));
  root.append(Lc);
  root.append(box('key','why anyone cares','Eigenvectors are the directions where a complicated transform becomes <em>simple multiplication</em>. That unlocks: raising a matrix to a huge power (repeated application), <b>PageRank</b>, the long-run state of a <b>Markov chain</b>, the vibration modes of a bridge, and <b>PCA</b> (the eigenvectors of your data\'s covariance are its main axes). We\'ll build several of these.'));
  root.append(quiz({question:'A·v = λv means…',
    options:[{t:'The matrix only scales v (by λ) without changing its direction',ok:true,why:'Exactly — that\'s the definition of an eigenvector v with eigenvalue λ.'},
      {t:'v is the largest column of A',ok:false,why:'No relation. It means applying A to v just stretches v.'}]}));
  root.append(summary(['Eigenvector: a direction the matrix only stretches, never rotates.','Eigenvalue λ: the stretch factor. A·v = λv.','Found via det(A − λI) = 0.','They turn hard transforms into simple scalings — the key to powers, PageRank, PCA.']));
}};

const cDiag={id:'diag',part:'Part IX · Eigen',title:'Diagonalization & matrix powers',
  sub:'In its eigenbasis, a matrix becomes pure scaling — diagonal. That makes applying it a million times almost free, and explains long-run behaviour.',
render(root){
  head(root,0,cDiag);
  root.append(p('If you rewrite a matrix in the coordinate system of its own eigenvectors, it becomes <b>diagonal</b> — it just scales each eigen-axis by its eigenvalue. That\'s <span class="term">diagonalization</span>: \\(A = PDP^{-1}\\), where \\(D\\) is the diagonal of eigenvalues and \\(P\\)\'s columns are the eigenvectors.'));
  root.append(math('A = P D P^{-1}, \\qquad A^{k} = P D^{k} P^{-1}'));
  root.append(box('aha-box','why this is a superpower','To apply \\(A\\) a million times you\'d normally multiply a million matrices. But \\(A^{k}=PD^{k}P^{-1}\\), and \\(D^{k}\\) is trivial — just raise each diagonal eigenvalue to the k. Change to the eigenbasis, scale, change back. A hard repeated process becomes one easy exponent.'));
  const L=lab('Watch which eigenvalue wins','See','see');
  const nar=narrate('');const l1s=rangeRow({label:'λ₁',min:0,max:1.5,step:.05,value:1.1,fmt:v=>v.toFixed(2),onInput:()=>upd()});
  const l2s=rangeRow({label:'λ₂',min:0,max:1.5,step:.05,value:0.6,fmt:v=>v.toFixed(2),onInput:()=>upd()});
  const bar=el('div');bar.style.cssText='margin-top:8px';
  function upd(){const l1=parseFloat(l1s.input.value),l2=parseFloat(l2s.input.value);
    let a=1,b=1;let html='';for(let k=0;k<=8;k++){
      html+=`<div style="display:flex;gap:8px;align-items:center;font-size:.8rem"><span style="width:34px;color:var(--muted)">k=${k}</span>
        <div style="height:12px;background:var(--accent);width:${Math.min(180,a*40)}px;border-radius:3px"></div>
        <div style="height:12px;background:var(--accentb);width:${Math.min(180,b*40)}px;border-radius:3px"></div></div>`;
      a*=l1;b*=l2;}
    bar.innerHTML=html;
    const winner=l1>l2?'λ₁':'λ₂';const big=Math.max(l1,l2);
    nar.say(`Component along <span style="color:var(--accent)">λ₁</span> ×${l1.toFixed(2)} each step; <span style="color:var(--accentb)">λ₂</span> ×${l2.toFixed(2)}. After many steps the <b>${winner}</b> direction ${big>1?'blows up and dominates':big<1?'shrinks slowest and dominates the leftovers':'holds steady'}. <span class="g">The largest eigenvalue decides the long-run behaviour.</span>`);}
  L.append(l1s,l2s,bar,nar);upd();root.append(L);
  root.append(box('key','the punchline for applications','The <b>biggest</b> eigenvalue (and its eigenvector) dominates after many steps. That single fact <em>is</em> PageRank (the web\'s ranking vector), the steady state of a Markov chain, and population growth models. The long-run future points along the top eigenvector.'));
  root.append(h3('Two facts that make diagonalization work'));
  root.append(box('aha-box','why different eigenvalues give independent eigenvectors','Suppose \\(\\mathbf x,\\mathbf y\\) had eigenvalues \\(\\lambda\\neq\\mu\\) but were dependent — say \\(\\mathbf y=c\\mathbf x\\). Apply \\(A\\): the left side gives \\(\\mu\\mathbf y=\\mu c\\mathbf x\\), the right gives \\(cA\\mathbf x=c\\lambda\\mathbf x\\). So \\(\\mu c\\mathbf x=\\lambda c\\mathbf x\\), forcing \\(\\lambda=\\mu\\) — a contradiction. So <b>eigenvectors from distinct eigenvalues are automatically independent</b>. That\'s <em>why</em> a matrix with \\(n\\) distinct eigenvalues is always diagonalizable: it hands you \\(n\\) independent directions for free.'));
  root.append(box('key','trace = sum, determinant = product','Two invariants read straight off the eigenvalues: the <b>trace</b> (sum of the diagonal) equals the <b>sum</b> of the eigenvalues, and the <b>determinant</b> equals their <b>product</b>. Reason: in the eigenbasis \\(A\\) is diagonal with the \\(\\lambda_i\\) on the diagonal — sum-of-diagonal and product-of-diagonal are obvious there, and both trace and det are unchanged by the change of basis (Part IX\'s similarity). Quick sanity check: \\(\\det=0 \\Leftrightarrow\\) some \\(\\lambda_i=0\\), matching “singular = has a zero eigenvalue.”'));
  root.append(h3('A complete diagonalization, start to finish'));
  root.append(worked({title:'diagonalize a 2×2 fully',
    prompt:'Diagonalize \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\): find \\(P, D\\) with \\(A=PDP^{-1}\\).',
    steps:[
      'Eigenvalues (Part IX): \\(\\lambda=3\\) and \\(\\lambda=1\\). Eigenvectors: \\((1,1)\\) and \\((1,-1)\\).',
      'Stack eigenvectors as columns of \\(P=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}\\); put eigenvalues on the diagonal of \\(D=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}\\) <b>in the same order</b>.',
      'Invert \\(P\\): \\(\\det P=-2\\), so \\(P^{-1}=\\tfrac{1}{-2}\\begin{bmatrix}-1&-1\\\\-1&1\\end{bmatrix}=\\begin{bmatrix}\\tfrac12&\\tfrac12\\\\\\tfrac12&-\\tfrac12\\end{bmatrix}\\).',
      'Verify: \\(PDP^{-1}\\) multiplies back to \\(\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}=A\\). ✓'],
    result:'\\(A=PDP^{-1}\\) with those \\(P,D\\). Sanity checks: \\(\\text{trace}=4=3+1\\) ✓ and \\(\\det=3=3\\times1\\) ✓ — the eigenvalues match trace and determinant, so you know they\'re right before doing any multiplication.'}));
  root.append(box('key','the column-order rule (a classic slip)','The order of eigenvectors in \\(P\\) MUST match the order of eigenvalues in \\(D\\). Put \\((1,1)\\) first → its eigenvalue 3 goes in the first diagonal slot. Swap the columns of \\(P\\) and you must swap the diagonal of \\(D\\) too, or \\(PDP^{-1}\\neq A\\).'));
  root.append(quiz({question:'Why is A¹⁰⁰ easy once you\'ve diagonalized A = PDP⁻¹?',
    options:[{t:'A¹⁰⁰ = P D¹⁰⁰ P⁻¹, and D¹⁰⁰ is just each eigenvalue to the 100th',ok:true,why:'Exactly. Diagonalizing turns a 100-fold matrix product into one exponent per eigenvalue.'},
      {t:'Because A¹⁰⁰ = 100A',ok:false,why:'Powers aren\'t multiples. The trick is D¹⁰⁰ being trivial in the eigenbasis.'}]}));
  root.append(summary(['Diagonalization: A = PDP⁻¹ (eigenvectors in P, eigenvalues in D).','In the eigenbasis, A is pure scaling.','Aᵏ = PDᵏP⁻¹ makes huge powers cheap.','The largest eigenvalue dominates long-run behaviour (PageRank, Markov).']));
}};

/* ============================================================
   PART X — ORTHOGONALITY & PROJECTIONS
   ============================================================ */

const cProjDeep={id:'projdeep',part:'Part X · Orthogonality',title:'Projection onto a subspace',
  sub:'The shadow idea, leveled up: drop any vector onto a whole subspace to get the closest point in it. This single move powers data fitting, compression, and graphics.',
render(root){
  head(root,0,cProjDeep);
  root.append(p('Given a vector \\(\\mathbf b\\) and a subspace (a line, a plane…), the <span class="term">projection</span> is the point <em>in</em> the subspace closest to \\(\\mathbf b\\). The error — what\'s left over — is always <b>perpendicular</b> to the subspace. That perpendicularity is the whole trick.'));
  root.append(math('\\text{proj}_{\\mathbf a}\\mathbf b = \\frac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\,\\mathbf a'));
  root.append(worked({title:'deriving the projection formula',
    prompt:'Find the point on the line through \\(\\mathbf a\\) closest to \\(\\mathbf b\\). Call it \\(t\\mathbf a\\) — we just need the right scalar \\(t\\).',
    steps:[
      'The error is \\(\\mathbf b - t\\mathbf a\\). “Closest” means this error is <em>perpendicular</em> to the line — perpendicular to \\(\\mathbf a\\).',
      'Perpendicular means dot product zero: \\(\\mathbf a\\cdot(\\mathbf b - t\\mathbf a) = 0\\).',
      'Expand: \\(\\mathbf a\\cdot\\mathbf b - t\\,(\\mathbf a\\cdot\\mathbf a) = 0\\), so \\(t = \\dfrac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\).'],
    result:'The projection is \\(t\\mathbf a = \\dfrac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\mathbf a\\). The whole formula falls out of one idea: <b>the error must be perpendicular.</b> Nothing memorized.'}));
  const nar=narrate('Drag b.');const board=projectionBoard({nar});
  const L=lab('Closest point in the subspace','See','see');L.append(stageOf(board,[]),nar);root.append(L);
  root.append(box('aha-box','why “perpendicular error” is everything','The closest point is found by making the leftover error perpendicular to the subspace. Set the error\'s dot product with the subspace to zero and you get the <b>normal equations</b> — the formula behind every least-squares fit. Perpendicular = optimal.'));
  root.append(summary(['Projection = closest point in a subspace to a given vector.','The error (b − projection) is perpendicular to the subspace.','“Perpendicular error” gives the normal equations = least squares.']));
}};

const cLSQ={id:'lsq',part:'Part X · Orthogonality',title:'Least squares — the best fit to messy data',
  sub:'Real data never lands exactly on a line. Least squares finds the line closest to all of it — and it\'s just a projection in disguise.',
render(root){
  head(root,0,cLSQ);
  root.append(p('You have noisy points and want the best straight line. There\'s usually <em>no</em> line through them all — the system \\(Ax=b\\) has no exact solution. So we find the \\(x\\) making \\(Ax\\) as <b>close as possible</b> to \\(b\\): project \\(b\\) onto the column space of \\(A\\). Hit the button and watch the residuals.'));
  const L=lab('Fit the best line','Play');L.append(leastSquares());root.append(L);
  root.append(math('A^{T}A\\,\\hat x = A^{T}b \\quad(\\text{the normal equations})'));
  root.append(h3('Where the normal equations come from'));
  root.append(worked({title:'deriving AᵀA x̂ = Aᵀb',
    prompt:'We want \\(\\hat x\\) making \\(A\\hat x\\) the closest point in the column space to \\(b\\). Turn “closest” into an equation.',
    steps:[
      'The residual \\(b - A\\hat x\\) must be <b>perpendicular to the column space</b> — that\'s what “closest” means (Part X).',
      'Perpendicular to every column of \\(A\\) means each column dotted with the residual is 0: \\(A^{T}(b - A\\hat x) = \\mathbf 0\\).',
      'Distribute: \\(A^{T}b - A^{T}A\\hat x = \\mathbf 0\\).'],
    result:'Rearranged: \\(A^{T}A\\hat x = A^{T}b\\) — the normal equations. Same one idea as every projection: <b>make the error perpendicular.</b> \\(A^{T}A\\) is square and (usually) invertible, so \\(\\hat x=(A^{T}A)^{-1}A^{T}b\\).'}));
  root.append(box('trap','the tempting wrong path','“Just invert \\(A\\) and compute \\(x=A^{-1}b\\).” You <em>can\'t</em> — for real data \\(A\\) is tall (more rows than columns), so it isn\'t square and has no inverse. The fix isn\'t to force an inverse; it\'s to accept there\'s no exact solution and project. That\'s why we form the <em>square</em> matrix \\(A^{T}A\\) instead.'));
  const Lp=lab('Practice: scalar projection','Practice','');
  Lp.append(p('Compute \\(t=(a\\cdot b)/(a\\cdot a)\\), the amount of a in the projection of b onto a.'));
  Lp.append(practiceSet(['projscalar'],4));
  root.append(Lp);
  root.append(box('aha-box','no exact answer? project.','When \\(Ax=b\\) is unsolvable, you can\'t hit \\(b\\) — so you hit the closest reachable point instead: the projection of \\(b\\) onto everything \\(A\\) can produce. The red residual lines are the leftover errors; least squares makes their total <em>squared</em> length as small as possible.'));
  root.append(box('key','where you\'ve used this without knowing','Every trend line, every “line of best fit,” every linear regression in statistics and machine learning is this exact projection. The “learning” in the simplest ML models <em>is</em> solving the normal equations.'));
  root.append(quiz({question:'Why can\'t we usually solve Ax=b exactly for real data?',
    options:[{t:'There are more equations (data points) than unknowns, and noise — so no line hits them all; we project to the closest fit',ok:true,why:'Right. Overdetermined + noisy → no exact solution → least squares finds the nearest reachable point.'},
      {t:'Because matrices can\'t be inverted',ok:false,why:'A here isn\'t even square. The issue is too many constraints; projection handles it.'}]}));
  root.append(summary(['Real data → Ax=b usually has no exact solution.','Least squares = project b onto A\'s column space (closest reachable).','Solved by the normal equations AᵀAx = Aᵀb.','This IS linear regression — the core of basic ML.']));
}};

const cGramSchmidt={id:'gramschmidt',part:'Part X · Orthogonality',title:'Building perfect rulers (Gram–Schmidt)',
  sub:'Take any basis and straighten it into perpendicular unit vectors. Orthonormal rulers make every later computation trivial — and give you the QR decomposition for free.',
render(root){
  head(root,0,cGramSchmidt);
  root.append(p('Orthonormal vectors (perpendicular + length 1) are the dream basis: coordinates are just dot products, no messy solving. <span class="term">Gram–Schmidt</span> takes any independent set and straightens it into one — subtract off the parts that overlap with what you already have, then normalize.'));
  root.append(h3('Watch the one move: subtract the projection'));
  root.append(p('Gram–Schmidt is a single geometric idea repeated: keep \\(v_1\\); for \\(v_2\\), <b>subtract off its shadow on \\(v_1\\)</b> so what remains is perpendicular. Drag the vectors and watch \\(v_2^{\\perp}=v_2-\\text{proj}\\) form.'));
  const Lv=lab('Orthogonalize, geometrically','See','see');
  Lv.append(gramSchmidtViz());
  root.append(Lv);
  const L=lab('Straighten a basis (numbers)','Play');
  const g=matrixGrid({rows:2,cols:2,values:[[3,1],[1,2]]});
  const out=el('div');out.style.cssText='margin-top:10px';const nar=narrate('Columns are your starting vectors.');
  const btn=el('button','btn','orthonormalize the columns');
  btn.onclick=()=>{const A=g.get();const cols=[[A[0][0],A[1][0]],[A[0][1],A[1][1]]];const q=LA.gramSchmidt(cols);
    out.innerHTML='orthonormal set: '+q.map(v=>`(${v.map(x=>x.toFixed(2)).join(', ')})`).join(' &nbsp; ');
    const dot=q.length>1?(q[0][0]*q[1][0]+q[0][1]*q[1][1]):0;
    nar.say(`These two are now perpendicular (their dot product = <span class="k">${dot.toFixed(2)}</span> ≈ 0) and unit length. <span class="g">Perfect rulers.</span>`);};
  const ctr=el('div','controls');ctr.append(btn);L.append(g.el,ctr,out,nar);root.append(L);
  root.append(box('aha-box','free bonus: QR','Doing Gram–Schmidt on a matrix\'s columns factors it as \\(A = QR\\) — \\(Q\\) orthonormal, \\(R\\) upper-triangular. QR is how computers actually solve least-squares and find eigenvalues, stably. You just met the idea behind industrial-strength numerical linear algebra.'));
  root.append(summary(['Orthonormal = perpendicular + unit length = ideal rulers.','Gram–Schmidt straightens any basis into an orthonormal one.','Coordinates in an orthonormal basis = simple dot products.','It produces the QR decomposition, a workhorse of computation.']));
}};

/* ============================================================
   PART XI — SVD & PCA
   ============================================================ */

const cPCA={id:'pca',part:'Part XI · SVD & PCA',title:'PCA — the directions your data actually uses',
  sub:'Data clouds have a shape. PCA finds the few directions that capture most of the variation — the eigenvectors of the covariance — letting you compress high-D data to its essence.',
render(root){
  head(root,0,cPCA);
  root.append(p('Most real data lives near a <em>low-dimensional</em> shape inside its high-dimensional space — a stretched cloud. <span class="term">Principal Component Analysis</span> finds the directions of greatest spread (the long axes of the cloud). Rotate and stretch the cloud; watch the main axis track it.'));
  const L=lab('Find the principal direction','See','see');L.append(pcaCloud());root.append(L);
  root.append(box('aha-box','PCA is eigenvectors of the covariance','The cloud\'s spread is captured by a <b>covariance matrix</b>. Its <em>eigenvectors</em> are the cloud\'s natural axes; the <em>eigenvalues</em> say how much variation lies along each. Keep the top few, drop the rest — you\'ve compressed the data while losing almost nothing. Eigenvectors (Part IX) come back as data science.'));
  root.append(box('key','where PCA runs the world','Face recognition (“eigenfaces”), recommendation systems, gene-expression analysis, noise reduction, and the “embeddings” visualisations you\'ve seen — all use PCA to squeeze many dimensions down to the few that matter.'));
  root.append(quiz({question:'What are the principal components of a dataset?',
    options:[{t:'The eigenvectors of its covariance — the directions of greatest variation',ok:true,why:'Exactly. Top eigenvector = direction of most spread; its eigenvalue = how much.'},
      {t:'The average of all the data points',ok:false,why:'That\'s just the center. PCA is about the directions of spread around the center.'}]}));
  root.append(summary(['Data clouds have a shape; PCA finds their main axes.','Those axes = eigenvectors of the covariance matrix.','Keep the top few → compress high-D data with little loss.','Powers eigenfaces, recommendations, denoising.']));
}};

const cSVD={id:'svd',part:'Part XI · SVD & PCA',title:'The SVD — every matrix, decoded',
  sub:'The crown jewel: ANY matrix, of any shape, is a rotation, then a stretch along axes, then another rotation. This single fact underlies compression, recommendations, and search.',
render(root){
  head(root,0,cSVD);
  root.append(p('The <span class="term">Singular Value Decomposition</span> says every matrix \\(A\\) — square or not — factors as \\(A = U\\Sigma V^{T}\\): a rotation \\(V^{T}\\), then a pure stretch \\(\\Sigma\\) along perpendicular axes, then another rotation \\(U\\). No matter how tangled the matrix looks, it\'s only ever “rotate, stretch, rotate.”'));
  root.append(math('A = U\\,\\Sigma\\,V^{T} \\quad(\\text{rotate} \\to \\text{stretch} \\to \\text{rotate})'));
  root.append(h3('Where do U, Σ, and V actually come from?'));
  root.append(p('The SVD isn\'t pulled from nowhere — it is built directly from eigenvectors of a <em>symmetric</em> matrix you can always form, so the spectral theorem (Part XVI) guarantees it exists for <em>every</em> matrix.'));
  root.append(worked({title:'constructing the SVD from AᵀA',
    prompt:'Given any matrix \\(A\\), build \\(U,\\Sigma,V\\) from scratch.',
    steps:[
      'Form \\(A^{T}A\\). It is <b>symmetric</b> (since \\((A^{T}A)^{T}=A^{T}A\\)) and positive-semidefinite, so by the spectral theorem it has real, non-negative eigenvalues and <em>perpendicular</em> eigenvectors.',
      'Those eigenvectors become the columns of \\(V\\) (the input rotation). The <b>singular values</b> are \\(\\sigma_i=\\sqrt{\\lambda_i}\\) — square roots of those eigenvalues — down the diagonal of \\(\\Sigma\\).',
      'Apply \\(A\\) to each \\(v_i\\) and normalize: \\(u_i = A v_i / \\sigma_i\\). These come out perpendicular and form the columns of \\(U\\) (the output rotation).',
      'Then \\(A v_i = \\sigma_i u_i\\) for every axis — which is exactly \\(AV = U\\Sigma\\), i.e. \\(A = U\\Sigma V^{T}\\).'],
    result:'Because \\(A^{T}A\\) is <em>always</em> symmetric, this construction <em>always</em> works — any matrix, any shape. That is precisely why the SVD is universal where eigen-decomposition is not.'}));
  root.append(box('key','SVD vs eigen — the exact link','The singular values of \\(A\\) are the square roots of the eigenvalues of \\(A^{T}A\\). For a symmetric positive matrix the SVD and eigen-decomposition coincide; in general they differ because \\(A\\) may be non-square or non-diagonalizable — but \\(A^{T}A\\) is symmetric no matter what, so the SVD hands the spectral theorem\'s guarantees to <em>every</em> matrix.'));
  root.append(box('aha-box','why the SVD is the deepest theorem','It works for <em>every</em> matrix (unlike eigen-decomposition, which needs square + diagonalizable). The <b>singular values</b> in \\(\\Sigma\\) rank the directions by importance. Keep the biggest few and you get the best possible low-rank approximation — that\'s <b>image compression</b>, <b>recommendation systems</b> (the Netflix prize), and <b>latent semantic search</b>, all at once.'));
  root.append(box('key','SVD in one sentence per field','<b>Compression:</b> drop small singular values → tiny file, looks the same. <b>Recommendations:</b> the top singular directions are “taste factors” linking users and movies. <b>Search / NLP:</b> singular directions are latent topics. <b>Noise:</b> small singular values are usually noise — drop them.'));
  root.append(worked({title:'low-rank = compression',
    prompt:'A 1000×1000 image matrix has 1,000,000 numbers. Its SVD keeps only the top 50 singular values. How many numbers now?',
    steps:['Rank-50 approximation stores \\(U_{50}\\) (1000×50), \\(\\Sigma_{50}\\) (50), \\(V_{50}\\) (1000×50).',
      'Total ≈ \\(1000\\cdot50 + 50 + 1000\\cdot50 = 100{,}050\\) numbers.',
      'That\'s about 10% of the original — a 10× compression.'],
    result:'Keeping the strongest directions throws away detail you can barely see. That\'s lossy compression, in one theorem.'}));
  root.append(quiz({question:'What makes the SVD more general than eigen-decomposition?',
    options:[{t:'It works for ANY matrix — any shape, always real — not just square diagonalizable ones',ok:true,why:'Exactly. Every matrix has an SVD; that universality is why it\'s everywhere.'},
      {t:'It\'s faster to compute by hand',ok:false,why:'It\'s not about speed — it\'s that the SVD always exists, for every matrix.'}]}));
  root.append(summary(['Every matrix = rotate (Vᵀ) → stretch (Σ) → rotate (U).','Singular values rank directions by importance.','Keep the top few → best low-rank approximation.','This is compression, recommendations, and latent search.']));
}};

/* ============================================================
   PART XII — APPLICATIONS
   ============================================================ */

const cMarkov={id:'markov',part:'Part XII · Applications',title:'Markov chains & PageRank',
  sub:'Random processes that hop between states settle into a steady distribution — and that distribution is an eigenvector. This is literally how Google ranked the web.',
render(root){
  head(root,0,cMarkov);
  root.append(p('Imagine a random surfer clicking links, or weather flipping sunny↔rainy with fixed probabilities. Each step multiplies the current state-distribution by a <b>transition matrix</b>. Do it forever and — for almost any start — you converge to a <span class="term">steady state</span>: the distribution that no longer changes.'));
  root.append(math('\\pi = M\\pi \\quad(\\text{steady state = eigenvector of } M \\text{ with eigenvalue } 1)'));
  const L=lab('Walk to the steady state','See','see');
  const nar=narrate('');const M=[[0.9,0.5],[0.1,0.5]];let st=[1,0];
  const bar=el('div');bar.style.cssText='margin-top:8px';
  function draw(){bar.innerHTML=`<div style="display:flex;gap:8px;align-items:center"><span style="width:60px;font-size:.8rem;color:var(--muted)">sunny</span><div style="height:16px;background:var(--gold);width:${st[0]*220}px;border-radius:3px"></div><b>${(st[0]*100).toFixed(1)}%</b></div>
    <div style="display:flex;gap:8px;align-items:center;margin-top:4px"><span style="width:60px;font-size:.8rem;color:var(--muted)">rainy</span><div style="height:16px;background:var(--accentb);width:${st[1]*220}px;border-radius:3px"></div><b>${(st[1]*100).toFixed(1)}%</b></div>`;}
  const step=el('button','btn','take one day');const run=el('button','btn ghost','run 30 days');
  step.onclick=()=>{st=[M[0][0]*st[0]+M[0][1]*st[1], M[1][0]*st[0]+M[1][1]*st[1]];draw();
    nar.say(`Multiplied by the transition matrix. Watch it settle toward the steady state — the eigenvector with eigenvalue 1.`);};
  run.onclick=()=>{for(let i=0;i<30;i++)st=[M[0][0]*st[0]+M[0][1]*st[1], M[1][0]*st[0]+M[1][1]*st[1]];draw();
    nar.say(`<span class="g">Converged.</span> Steady state ≈ (${(st[0]*100).toFixed(0)}% sunny, ${(st[1]*100).toFixed(0)}% rainy). It no longer changes: π = Mπ. That\'s the dominant eigenvector.`);};
  const ctr=el('div','controls');ctr.append(step,run);L.append(bar,ctr,nar);draw();root.append(L);
  root.append(box('aha-box','this is PageRank','Google modeled the web as a giant Markov chain: pages are states, links are transitions. The steady-state distribution — the dominant eigenvector of that billion-by-billion matrix — is exactly how important each page is. <b>PageRank is one eigenvector.</b> A whole company was built on Part IX.'));
  root.append(quiz({question:'The steady state of a Markov chain is…',
    options:[{t:'An eigenvector of the transition matrix with eigenvalue 1',ok:true,why:'Yes — π = Mπ means applying the process doesn\'t change it. That\'s exactly an eigenvector for λ=1.'},
      {t:'The state you started in',ok:false,why:'The steady state is independent of the start — you converge to it from almost anywhere.'}]}));
  root.append(h3('Compute a steady state by hand'));
  root.append(worked({title:'the weather\'s long-run forecast',
    prompt:'Sunny days stay sunny 90% of the time; rainy days turn sunny 50% of the time. Find the steady-state fractions \\((s, r)\\).',
    steps:[
      'Steady state means the distribution doesn\'t change: \\(0.9s + 0.5r = s\\) and \\(s+r=1\\) (it\'s a distribution).',
      'Rearrange the first: \\(0.5r = 0.1s\\Rightarrow r = 0.2s\\).',
      'Substitute into \\(s+r=1\\): \\(s + 0.2s = 1 \\Rightarrow 1.2s = 1 \\Rightarrow s = \\tfrac{5}{6}\\).'],
    result:'\\((s,r) = (5/6,\\,1/6) \\approx (83\\%,\\,17\\%)\\) — matching the bars in the demo. Notice we solved \\(\\pi = M\\pi\\): finding the \\(\\lambda=1\\) eigenvector, then normalizing so it sums to 1.'}));
  root.append(box('trap','the constraint people forget','\\(\\pi = M\\pi\\) alone has infinitely many solutions (any scalar multiple of the eigenvector). What pins down THE steady state is the extra rule that a probability distribution must <b>sum to 1</b>. Eigenvector gives the direction; normalization gives the actual answer.'));
  root.append(summary(['A step = multiply the state by a transition matrix.','Repeat → converge to a steady state π = Mπ.','Steady state = dominant eigenvector (λ=1), normalized to sum 1.','PageRank is literally this eigenvector on the web graph.']));
}};

const cGraphics={id:'graphics',part:'Part XII · Applications',title:'Graphics, robotics & 3D',
  sub:'Every time a game rotates a character or a robot arm reaches, it\'s multiplying vectors by matrices. The whole 3D world is linear algebra at 60 fps.',
render(root){
  head(root,0,cGraphics);
  root.append(p('A 3D point is a vector. Moving it — rotate, scale, translate, or view through a camera — is multiplying by a matrix. Chaining those matrices (Part VII) composes a whole camera pipeline into one. Drag to rotate a real 3D object:'));
  const L=lab('A rotating 3D vector','See','see');
  const bd=board3d({vec:{x:2,y:1.5,z:1.5}});L.append(stageOf(bd,[]));root.append(L);
  root.append(box('aha-box','why games use 4×4 matrices','Rotation and scaling are matrices, but <em>translation</em> (sliding) isn\'t linear — so graphics uses a clever trick (homogeneous coordinates): add a 4th coordinate so translation becomes a matrix too. Then the entire transform — model, view, projection — is one 4×4 matrix multiply per vertex, done millions of times per second on your GPU.'));
  root.append(box('key','the same math, everywhere in 3D','Robot arm kinematics, drone orientation, CT-scan reconstruction, physics engines, camera calibration — all are matrix–vector products. The 3D world runs on the operations you\'ve been dragging around this whole course.'));
  root.append(summary(['3D points are vectors; moving them is matrix multiplication.','Rotations/scales compose into one matrix (Part VII).','Homogeneous 4×4 matrices fold in translation too.','Games, robotics, and 3D vision are all this, at scale.']));
}};

const cFinale={id:'finale',part:'Part XII · Applications',title:'The whole map, and where to go',
  sub:'You\'ve crossed the entire landscape of linear algebra. Here it is on one page — every big idea and how they connect.',
render(root){
  head(root,0,cFinale);
  root.append(el('div','pull','From “a vector is a list of numbers” to the SVD and PageRank — it was all one idea, growing. You didn\'t memorize linear algebra. You built it.'));
  root.append(box('key','the entire subject, connected',`
    <b>Vectors</b> = lists of numbers = points in a space of possibilities.<br>
    <b>Two moves</b> (add, scale) → <b>linear combinations</b> → <b>span</b>, <b>independence</b>, <b>basis</b>, <b>dimension</b>.<br>
    <b>Geometry</b>: length, dot product, angle, <b>projection</b>, orthogonality.<br>
    <b>Matrices</b> = transforms (verbs); multiply = compose; <b>inverse</b> = undo.<br>
    <b>Systems</b>: elimination → rank → how many solutions.<br>
    <b>Determinant</b> = area/volume factor; 0 = collapsed = singular.<br>
    <b>Eigenvectors</b> = un-rotated directions → <b>diagonalization</b>, powers, <b>PageRank</b>, <b>PCA</b>.<br>
    <b>SVD</b> = rotate–stretch–rotate for <em>any</em> matrix → compression, recommendations, search.`));
  root.append(h3('The threads that tie it together'));
  root.append(el('ul',null,`
    <li><b>Independence</b> shows up as: span not collapsing, det ≠ 0, full rank, invertible, unique solutions — all the <em>same</em> fact wearing different clothes.</li>
    <li><b>Projection</b> shows up as: shadows, least squares, regression, Gram–Schmidt, PCA — always “closest point, perpendicular error.”</li>
    <li><b>Eigenvectors</b> show up as: stable directions, long-run behaviour, PageRank, PCA axes, SVD — “where the transform is just scaling.”</li>`));
  root.append(box('aha-box','where to go from here','You\'re now equipped for: <b>machine learning</b> (it\'s matrices + gradients), <b>quantum mechanics</b> (vectors in complex spaces), <b>signal processing</b> (Fourier = a change of basis), <b>optimization</b>, <b>graphics</b>, and <b>data science</b>. Every one of them is this toolkit, specialized. You have the foundation the whole technical world is built on.'));
  root.append(el('div','pull','space = possibilities · point = one possibility · vector = a change · matrix = a transform · eigenvector = a direction it leaves alone. Carry these, and nothing in linear algebra can surprise you again.'));
}};

return [c0,cRep,cBox,cPoint,cDiff,cWebspace,c1d,c2d,c3d,cAdd,cScale,cCombo,cSpan,cIndep,cBasis,
        cLength,cDot,cProj,cOrtho,cLeap,cLadder,cWeird,cInfinite,cMatrix,
        cSysGeo,cElim,cRank,cInverse,
        cMatmul,cTranspose,cDet,cEigen,cDiag,
        cProjDeep,cLSQ,cGramSchmidt,cPCA,cSVD,
        cMarkov,cGraphics,
        cUsed,cAxioms,cReview,cFinale];
})();
