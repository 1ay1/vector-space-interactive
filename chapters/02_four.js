/* 02_four.js — base course */
'use strict';
(function(){
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
  root.append(box('key','the deepest point: the list is a shadow, not the vector','This one idea prevents years of confusion. A vector is the underlying <em>thing</em> (the arrow, the location). Its <b>list of numbers is its shadow in a chosen set of rulers</b> — change the rulers and the numbers change while the vector sits perfectly still. So “the vector \\((3,2)\\)” is really shorthand for “the vector whose coordinates happen to be \\((3,2)\\) in the standard rulers.” When Chapter 11 changes the rulers and the numbers move, remember: the arrow never budged. <span class="aha">Thing vs. shadow — keep them separate and the whole subject stays clear.</span>'));
  root.append(summary([
    'Every vector = list = arrow = knobs = point. Same object, four views.',
    'List & knobs work in <em>any</em> dimension; arrow & point only up to 3.',
    'Fluency = switching costumes on demand.']));
}};

/* ============================================================
   PART ½ — THE BIG PICTURE (what a space really is)
   ============================================================ */

register(cRep);
})();
