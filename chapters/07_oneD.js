/* 07_oneD.js — base course */
'use strict';
(function(){
const c1d={id:'oneD',part:'Part I · Build it',title:'1D — the number line',
  sub:'The simplest vector: a single number. Everything bigger is just more of these, side by side.',
render(root){
  head(root,3,c1d);
  root.append(p('Plot twist: you already passed the hardest exam in this entire course. It was in the second grade, and it was called “the number line.” Congratulations, you\'ve been doing linear algebra since before you could ride a bike — nobody just called it that, because “linear algebra” sounds like a fee and “number line” sounds like a nap.'));
  root.append(p('A <b>one-dimensional vector is a single number</b>: how far along a line, sign included. Positive marches one way, negative the other, zero stands there doing nothing (it\'s important later — the overachiever who achieves nothing). Grab it and drag:'));
  const nar=narrate('');
  const nl=numberline({value:2,onChange:v=>{nar.say(`v = <span class="k">${fmt(v)}</span>. ${v>0?'Marching <b>right</b>.':v<0?'Marching <b>left</b> — negative just means “the other way.”':'Parked at the origin. This is the <b>zero vector</b>, the most famous do-nothing in mathematics.'} Its length is |v| = <b>${fmt(Math.abs(v))}</b> — direction thrown away, size kept.`);}});
  const L=lab('Drag a 1D vector');L.append(nl,nar);root.append(L);
  root.append(box('aha-box','the whole subject, hiding in a single number','Watch what the three big operations become when there\'s only one number to push around:<br><br>• <b>adding vectors</b> → adding numbers. \\(3+4=7\\). Groundbreaking.<br>• <b>scaling</b> → multiplying. Double it, halve it, flip it with \\(-1\\).<br>• <b>length</b> → absolute value. “How big, ignoring which way.”<br><br>That\'s it. That\'s the engine. Every higher dimension you ever meet is just this <em>exact</em> arithmetic, run in parallel — once per number, all at the same time, never talking to each other. A 4-million-dimensional vector is four million second-graders doing their number line simultaneously and minding their own business.'));
  root.append(el('p','pull','The number — not the arrow, not the picture — is the atom of this whole subject. Get comfortable that a lone number is already a vector, and the jump to a million of them stops being a jump. It\'s just a longer worksheet.'));
  root.append(math('\\mathbf v = (v_1) \\qquad \\lVert \\mathbf v\\rVert = |v_1|'));
  root.append(box('trap','the one thing 1D hides from you','1D is so easy it lies to you by omission: on a line there are only <em>two</em> directions, left and right, so “direction” feels boring. The instant we add a second number, directions explode into a full 360° — and that\'s where the good stuff (angles, projections, spin) lives. Enjoy the calm. It ends next chapter.'));
  root.append(summary(['1D vector = one number on a line. You already own this.','add = add · scale = multiply · length = absolute value.','Higher-D = many 1D number lines running in parallel, once per entry.','The number is the atom. Everything else is more atoms, side by side.']));
}};

register(c1d);
})();
