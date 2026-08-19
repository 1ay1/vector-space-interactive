/* 01_welcome.js — base course */
'use strict';
(function(){
const c0={id:'welcome',part:'Part 0 · Orientation',title:'The one idea you\'ll never unsee',
  sub:'Before any math: a single mental image that makes 1, 3, or 3-million dimensions feel like the same easy thing.',
render(root){
  head(root,1,c0);
  root.append(p('Almost everyone meets vectors the same tragic way: an arrow on a physics whiteboard, a teacher muttering "magnitude and direction," and then — one slide later — the words <em>"now imagine the fourth dimension."</em> Nobody can. The room goes quiet. You decide, privately and forever, that this subject belongs to other people. Some sweaty genius, probably. Not you.'));
  root.append(p('That reaction is 100% avoidable, and it\'s not your fault. It comes from <em>one</em> bad picture that got installed early and never uninstalled. We\'re going to yank it out right now and bolt in a better one — a picture so ordinary you already use it before your first coffee.'));
  root.append(box('key','the whole course in one line','<b>A vector is a list of numbers you can adjust. Each number is an independent thing you can change. The <span class="aha">dimension</span> is just how many numbers are in the list.</b>'));
  root.append(p('That\'s it. That\'s the whole movie. Arrows, length, angle, span, "the 4th dimension," even <em>infinite</em> dimensions — all of it is a consequence of that one sentence. And here\'s the twist: you already think this way every single day and never noticed. Watch:'));
  root.append(box('trap','three lies your first vector taught you',`Before we go on, let\'s uninstall the bad picture properly. If you believe any of these, that\'s the arrow talking:<br><br>
    <b>Lie #1: "A vector is an arrow."</b> An arrow is <em>one costume</em> a 2D or 3D vector can wear. A 12-million-dimensional photo owns no arrow and doesn\'t miss it.<br>
    <b>Lie #2: "Higher dimensions are spooky."</b> The 900th dimension is just… the 900th number in the list. It\'s not hiding in a haunted house. It\'s line 900.<br>
    <b>Lie #3: "You have to picture it."</b> You have never pictured your bank balance, yet you reason about it fine. Numbers &gt; pictures. Always.`));
  root.append(el('ul',null,`
    <li>your <b>coffee order</b> — (2 shots, 1 syrup, 12 oz milk) — is a 3-dimensional vector, and "make it a double" is vector arithmetic,</li>
    <li>the <b>coins in your pocket</b> are a 4-number vector, and so is your dread when it\'s all pennies,</li>
    <li>a <b>colour</b> on your screen is 3 numbers (red, green, blue) — your phone is juggling a million of these right now,</li>
    <li>a <b>photo</b> is a vector with one number per pixel — twelve <em>million</em> numbers — and nobody, ever, has "pictured" it. They just use it.</li>`));
  root.append(el('p','pull','Notice you never once tried to <em>visualise 4-dimensional coffee</em>. You didn\'t squint. You just set the numbers and moved on with your life. That relaxed, number-by-number, who-cares-what-it-looks-like thinking <em>is</em> exactly how to think in any dimension. You\'ve been fluent for years. We\'re just teaching you the word.'));
  root.append(box('aha-box','the one promise of this course','By the end, "imagine the 900-dimensional case" will feel exactly as calm as "imagine a longer shopping list." Not because you grew a new lobe of brain — because you stopped trying to <em>see</em> and started trusting the numbers. That swap is the entire trick, and you just did it with coffee.'));

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
    {icon:'♟️',name:'A chess position',dims:'64-ish',vec:'(what\'s on each square)',note:'the whole board as one vector.'},
    {icon:'🐶',name:'Your dog\'s mood',dims:'as many as you dare',vec:'(hunger, zoomies, guilt, ball-focus, …)',note:'yes, even this. If you can list the numbers, it\'s a vector.'}]));
  root.append(el('div','pull','Every one of these is a list of numbers you already reason about — "more shots," "double the recipe," "brighter photo." That reasoning <em>is</em> vector math. You were fluent before you knew the word.'));
  const Q=lab('Quick gut-check: count the dimensions','Quiz','');
  Q.append(quiz({
    question:'A playlist rates each song on <b>danceability, energy, tempo, and mood</b>. How many dimensions is one song\'s "vibe vector"?',
    options:[
      {t:'1 — it\'s just "the vibe"',ok:false,why:'Nope — "the vibe" is the whole vector, not its dimension. Count the independent numbers.'},
      {t:'4 — one number per rated quality',ok:true,why:'Exactly. Four independent knobs → a 4-dimensional vector. No arrow required, and you didn\'t even flinch.'},
      {t:'∞ — music is infinite, man',ok:false,why:'Poetic, but we only listed four numbers. Dimension = how many numbers are actually in the list.'}]}));
  root.append(Q);
  root.append(h3('So why is it called “linear” algebra?'));
  root.append(p('Fair question, because there\'s not an obvious <em>line</em> in sight. Here\'s the honest answer, and it\'s the deepest idea in the whole subject hiding in plain sight: out of everything you could possibly do to a list of numbers, we deliberately restrict ourselves to just <b>two moves</b> — and then we obsess over what you can build from only those two.'));
  root.append(box('key','the entire subject runs on exactly two moves','<b>1. Add two vectors</b> — line up their lists and add entry by entry. <span class="vec">(2,1)+(1,3)=(3,4)</span>.<br><b>2. Scale a vector</b> — multiply the whole list by one number. <span class="vec">3·(2,1)=(6,3)</span>.<br><br>That\'s the entire toolkit. Every headline word coming your way — <em>span, basis, linear independence, rank, eigenvector, the SVD</em> — is just a question about what these two moves can and can\'t reach. You already know the moves. The rest of the course is consequences.'));
  root.append(p('“Linear” is the promise that these two moves <b>never surprise you</b>: scaling then adding gives the same answer as adding then scaling, always, in every dimension. No hidden fees, no fine print. That boringness is a <em>superpower</em> — it\'s exactly why a 900-dimensional problem is no scarier than a 2-dimensional one. The rules don\'t change; only the length of the list does.'));
  root.append(el('p','pull','Almost everything in the universe is <em>non</em>-linear and genuinely horrifying. Linear algebra is the study of the one beautiful corner where combining things is fair, predictable, and adds up — which is precisely why we can actually solve it, and why it quietly runs your search engine, your camera, and every neural network on Earth.'));
  root.append(summary([
    'A vector = a list of numbers you can adjust.',
    'Dimension = how many numbers.',
    'You already reason this way (coffee, coins, colour).',
    'The whole subject runs on <b>two moves</b>: add vectors, and scale a vector.',
    '“Linear” = combining those moves never surprises you — which is why n-D is no harder than 2-D.',
    'The goal of this course: make that reasoning automatic for <em>any</em> number of dimensions.']));
}};

register(c0);
})();
