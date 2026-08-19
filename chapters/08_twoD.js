/* 08_twoD.js — base course */
'use strict';
(function(){
const c2d={id:'twoD',part:'Part I · Build it',title:'2D — the plane, and the arrow',
  sub:'Two numbers. Now a vector gets its famous second life as an arrow — beautiful, but watch where it will betray us.',
render(root){
  head(root,4,c2d);
  root.append(p('Add a second number and something almost suspicious happens: the vector <code>(x, y)</code> sprouts an <b>arrow</b>. Go <em>x</em> across, then <em>y</em> up, plant a flag. The arrow and the pair of numbers are the <em>same object</em> wearing different outfits — nudge one, the other twitches. Drag the tip and feel them stay welded together:'));
  const ro=el('div','readout','v = (3, 2)');const nar=narrate('Drag the tip.');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'v'}],snap:true,onChange:a=>{
    const v=a[0];ro.textContent=`v = (${fmt(v.x)}, ${fmt(v.y)})`;
    nar.say(`<span class="k">(${fmt(v.x)}, ${fmt(v.y)})</span> — ${fmt(v.x)} across, ${fmt(v.y)} up. The arrow is just the list, drawn. You didn’t move an arrow; you edited two numbers and the arrow had no choice.`);}});
  const L=lab('Drag the arrow');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('key','what the arrow actually is','An arrow bundles a <b>direction</b> and a <b>length</b> — and both are captured, completely, with zero loss, by the two numbers. Crucially it\'s a <em>displacement</em>: “go <em>this</em> far in <em>that</em> direction.” It\'s an instruction, not a place. That\'s why the identical arrow can start at your house or on the Moon — “three steps northeast” doesn\'t care where you\'re standing.'));
  root.append(box('trap','the arrow is a lie — a useful one','Here\'s the con: the arrow secretly requires you to <em>see</em> the whole thing at once. That parlor trick works dazzlingly for 2 numbers, gets sweaty at 3, and flat-out dies at 4 — nobody has ever pictured a 4D arrow, and the people who claim they have should not be trusted with your money. So we\'ll ride the arrow exactly as far as it helps, wave goodbye, and keep the list. <span class="aha">The list never needed your eyes.</span> The arrow was training wheels with great marketing.'));
  root.append(el('p','pull','Rule for the whole course: when a picture and a list disagree about what’s true, the <b>list wins</b>. The picture is a courtesy your brain extends to you in low dimensions. Be grateful, don’t get attached.'));
  root.append(quiz({question:'You drag the tip exactly to the origin, (0,0). What is this?',
    options:[{t:'The zero vector — a real, important vector',ok:true,why:'Yes. Every vector space has exactly one zero vector; it\'s the “do nothing” displacement. Add it to anything and nothing happens — it\'s the mathematical equivalent of a to-do item that says “exist.”'},
      {t:'Not a vector anymore — it has no arrow to draw',ok:false,why:'It absolutely is still a vector. \((0,0)\) is the special all-zeros vector; it just happens to draw as a dot. “No visible arrow” is a fact about crayons, not about vectors.'}]}));
  root.append(summary(['2D vector = (x, y) = an arrow, same object two outfits.','Arrow = direction + length, both captured by the numbers.','It\'s a displacement (an instruction), so it can start anywhere.','The arrow picture dies past 3 numbers — keep it as a friend, not a crutch.','When picture and list disagree, the list wins.']));
}};

register(c2d);
})();
