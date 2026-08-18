/* 07_oneD.js — base course */
'use strict';
(function(){
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

register(c1d);
})();
