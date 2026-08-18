/* 08_twoD.js — base course */
'use strict';
(function(){
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

register(c2d);
})();
