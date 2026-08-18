/* 22_weird.js — base course */
'use strict';
(function(){
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

register(cWeird);
})();
