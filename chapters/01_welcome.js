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
  root.append(el('ul',null,`
    <li>your <b>coffee order</b> — (2 shots, 1 syrup, 12 oz milk) — is a 3-dimensional vector, and "make it a double" is vector arithmetic,</li>
    <li>the <b>coins in your pocket</b> are a 4-number vector, and so is your dread when it\'s all pennies,</li>
    <li>a <b>colour</b> on your screen is 3 numbers (red, green, blue) — your phone is juggling a million of these right now,</li>
    <li>a <b>photo</b> is a vector with one number per pixel — twelve <em>million</em> numbers — and nobody, ever, has "pictured" it. They just use it.</li>`));
  root.append(el('p','pull','Notice you never once tried to <em>visualise 4-dimensional coffee</em>. You didn\'t squint. You just set the numbers and moved on with your life. That relaxed, number-by-number, who-cares-what-it-looks-like thinking <em>is</em> exactly how to think in any dimension. You\'ve been fluent for years. We\'re just teaching you the word.'));

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

register(c0);
})();
