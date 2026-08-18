/* 21_ladder.js — base course */
'use strict';
(function(){
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

register(cLadder);
})();
