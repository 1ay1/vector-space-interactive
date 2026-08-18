/* 02_four.js — base course */
'use strict';
(function(){
const cRep={id:'four',part:'Part 0 · Orientation',title:'The four faces of a vector',
  sub:'One vector, four ways to see it: a list, an arrow, a bank of knobs, a point. Switching between them fluently is 80% of the skill.',
render(root){
  head(root,2,cRep);
  root.append(p('A vector is a bit of a drama queen: it wears <em>four different costumes</em> depending on the room it walks into. Same actor, same information underneath — but each costume is brilliant at a different job and useless at the others. The entire skill of "being good at linear algebra" is really just <b>changing costumes fast enough that you always have the right one on.</b>'));
  root.append(p('Meet the cast:'));
  root.append(gallery([
    {icon:'🧾',name:'The List',dims:'(3, 2)',vec:'the accountant',note:'boring, reliable, does the actual arithmetic. Works in any dimension without complaint.'},
    {icon:'↗️',name:'The Arrow',dims:'→',vec:'the show-off',note:'gorgeous for direction & length — and faints the instant you ask for a 4th number.'},
    {icon:'🎛️',name:'The Knobs',dims:'●●●',vec:'the honest one',note:'makes it obvious the numbers are independent — turn one, the rest sit still.'},
    {icon:'📍',name:'The Point',dims:'•',vec:'the philosopher',note:'"you are one location among all the ways this could have gone." Also dies past 3 numbers.'}]));
  root.append(repLegend());
  root.append(p('Here\'s the punchline before the demo: <b>they are literally the same object.</b> Below is <em>one</em> 2D vector shown all four ways at once. Poke it in any panel — drag the arrow, turn a knob — and the others update in lockstep. They can\'t disagree, any more than your reflection can disagree with you.'));
  const L=lab('One vector, four synced views','Play');
  L.append(fourRep({x:3,y:2}));
  root.append(L);
  root.append(el('div','cols2').appendChild(box('key','when each costume wins',`
    <b>List</b> — for <em>computing</em>. You read numbers and do arithmetic.<br>
    <b>Arrow</b> — for <em>direction & length</em> intuition (only up to 3 numbers).<br>
    <b>Knobs</b> — for feeling the numbers are <em>independent</em>.<br>
    <b>Point</b> — for thinking of a vector as a <em>location</em> among all possibilities.`)).parentNode);
  root.append(box('trap','the costume that fails','Only the <b>arrow</b> and <b>point</b> pictures need your eyes — and both die at 3 numbers, like a party trick that only works while people are watching. The <b>list</b> and <b>knobs</b> never needed eyes to begin with. So the moment we go to 4, 40, or 4-million dimensions, we quietly send the two visual costumes home and keep the two that scale forever. Nothing is lost but the pictures — and you were never really seeing 12-million-D anyway.'));
  const Q=lab('Pick the right costume for the job','Quiz','');
  Q.append(quiz({
    question:'You need to <b>add two 500-dimensional vectors</b>. Which costume do you reach for?',
    options:[
      {t:'The Arrow — draw them tip-to-tail',ok:false,why:'With 500 numbers? The arrow fainted 497 dimensions ago. This is a job for the accountant.'},
      {t:'The List — add them line by line',ok:true,why:'Exactly. Adding is pure bookkeeping: 500 tiny sums, no picture required. The List does it in any dimension without breaking a sweat.'},
      {t:'The Point — find its location',ok:false,why:'A location doesn\'t help you combine two of them, and "picture a point in 500-D" is a request no brain can fill.'}]}));
  root.append(Q);
  root.append(box('key','the deepest point: the list is a shadow, not the vector','This one idea prevents years of confusion. A vector is the underlying <em>thing</em> (the arrow, the location). Its <b>list of numbers is its shadow in a chosen set of rulers</b> — change the rulers and the numbers change while the vector sits perfectly still. So “the vector \\((3,2)\\)” is really shorthand for “the vector whose coordinates happen to be \\((3,2)\\) in the standard rulers.” When Chapter 11 changes the rulers and the numbers move, remember: the arrow never budged. <span class="aha">Thing vs. shadow — keep them separate and the whole subject stays clear.</span>'));
  root.append(summary([
    'A vector wears four costumes: <b>list, arrow, knobs, point</b> — one object, four views.',
    'List &amp; knobs work in <em>any</em> dimension; arrow &amp; point only up to 3.',
    'The list is a <em>shadow</em> in chosen rulers, not the vector itself.',
    'Fluency = switching costumes on demand, and knowing which one just fainted.']));
}};

/* ============================================================
   PART ½ — THE BIG PICTURE (what a space really is)
   ============================================================ */

register(cRep);
})();
