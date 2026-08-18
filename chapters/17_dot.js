/* 17_dot.js — base course */
'use strict';
(function(){
const cDot={id:'dot',part:'Part III · Geometry',title:'Dot product & angle',
  sub:'One number telling you whether two vectors agree, are unrelated, or clash. It runs search, recommendations, and face unlock.',
render(root){
  head(root,13,cDot);
  root.append(p('The <span class="term">dot product</span>: multiply matching numbers, add them up. Its <b>sign</b> reveals the relationship — <span class="sign pos">＋ agree</span>, <span class="sign zero">0 unrelated</span>, <span class="sign neg">－ clash</span>. Rotate the orange arrow and hunt for the flip.'));
  root.append(math('\\mathbf a\\cdot\\mathbf b=a_1b_1+a_2b_2+\\cdots+a_nb_n=\\lVert\\mathbf a\\rVert\\,\\lVert\\mathbf b\\rVert\\cos\\theta'));
  const ro=el('div','readout','');const nar=narrate('');let ang=Math.PI*.2;
  const board=vboard({showGrid:false,arrows:[{x:2,y:0,color:C.accentb,label:'reference',draggable:false},{x:2*Math.cos(ang),y:2*Math.sin(ang),color:C.accent,label:'drag me'}],
    onChange:a=>{const o=a[1];const L2=Math.hypot(o.x,o.y)||1;o.x=o.x/L2*2;o.y=o.y/L2*2;const dot=o.x/2;
      const deg=Math.acos(clamp(dot,-1,1))*180/Math.PI;let cls,txt;
      if(dot>.15){cls='pos';txt='＋ they broadly AGREE';}else if(dot<-.15){cls='neg';txt='－ they CLASH';}else{cls='zero';txt='≈0 → perpendicular → UNRELATED';}
      ro.innerHTML=`dot ≈ <b>${dot.toFixed(2)}</b> · angle ≈ ${deg.toFixed(0)}°`;
      nar.say(`<span class="sign ${cls}">${cls==='pos'?'＋':cls==='neg'?'－':'0'}</span> ${txt}.`);}});
  const L=lab('Rotate, watch the sign flip','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(h3('Where does that formula even come from?'));
  root.append(p('We should never hand you \(\mathbf a\cdot\mathbf b = \lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\) as magic. Here is exactly why it\'s true, from the length recipe you already own.'));
  root.append(worked({title:'deriving dot = ‖a‖‖b‖cosθ from Pythagoras',
    prompt:'Start from the Law of Cosines on the triangle formed by \(\mathbf a\), \(\mathbf b\), and the side \(\mathbf a-\mathbf b\).',
    steps:[
      'Law of cosines: \(\lVert\mathbf a-\mathbf b\rVert^2 = \lVert\mathbf a\rVert^2 + \lVert\mathbf b\rVert^2 - 2\lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\).',
      'But length is “sum of squares,” so expand the left side entry by entry: \(\lVert\mathbf a-\mathbf b\rVert^2 = \sum_i (a_i-b_i)^2 = \sum a_i^2 - 2\sum a_i b_i + \sum b_i^2\).',
      'That is \(\lVert\mathbf a\rVert^2 - 2(\mathbf a\cdot\mathbf b) + \lVert\mathbf b\rVert^2\), where \(\mathbf a\cdot\mathbf b=\sum a_i b_i\) is just the multiply-and-add rule.',
      'Set the two expressions equal. The \(\lVert\mathbf a\rVert^2\) and \(\lVert\mathbf b\rVert^2\) cancel, leaving \(-2(\mathbf a\cdot\mathbf b) = -2\lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\).'],
    result:'Divide by −2: \(\mathbf a\cdot\mathbf b = \lVert\mathbf a\rVert\lVert\mathbf b\rVert\cos\theta\). The “multiply matching numbers and add” rule and the geometric “lengths times cosine” are the SAME thing — proven, not asserted.'}));
  root.append(box('key','so the sign is forced','Since \(\lVert\mathbf a\rVert,\lVert\mathbf b\rVert>0\), the sign of the dot product is exactly the sign of \(\cos\theta\): positive for \(\theta<90^\circ\) (agree), zero at \(90^\circ\) (perpendicular), negative beyond (clash). That\'s why the sign-flip you dragged happens precisely at a right angle — it\'s not a convention, it falls out of the algebra.'));
  root.append(worked({title:'do these two shoppers agree?',
    prompt:'Habits as (organic, budget, bulk): \\(\\mathbf p=(2,3,-1)\\), \\(\\mathbf q=(4,-1,2)\\). Compute the dot product and read its sign.',
    steps:[
      'Multiply matching numbers: \\(2\\cdot4=8,\\; 3\\cdot(-1)=-3,\\; (-1)\\cdot2=-2\\).',
      'Add them: \\(8-3-2=3\\).',
      'The result \\(+3\\) is <b>positive</b> → the vectors broadly agree.'],
    result:'These shoppers roughly agree. (0 would be “unrelated”; negative would be “opposite tastes.”) This sign-check is the heart of every “you might also like…”'}));
  root.append(box('aha-box','why it rules the internet','"Which direction" survives to any dimension. Turn two photos into 500-number vectors, take their dot product: positive = similar, near-zero = unrelated. That\'s <em>cosine similarity</em>, run billions of times a day. You can\'t picture 500-D arrows — the dot product measures their angle anyway.'));
  root.append(quiz({question:'Two vectors have dot product exactly 0. They are…',
    options:[{t:'perpendicular / unrelated',ok:true,why:'Zero dot product = right angle = "nothing in common, direction-wise."'},
      {t:'identical',ok:false,why:'Identical vectors have a large positive dot product.'}]}));
  root.append(worked({title:'cosine similarity (the real ML use)',
    prompt:'Two documents as word-count vectors: \\(\\mathbf a=(3,0,4)\\), \\(\\mathbf b=(6,0,8)\\). How similar are they? Use cosine similarity \\(\\dfrac{\\mathbf a\\cdot\\mathbf b}{\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert}\\).',
    steps:[
      'Dot product: \\(3\\cdot6+0+4\\cdot8 = 18+32 = 50\\).',
      'Lengths: \\(\\lVert\\mathbf a\\rVert=\\sqrt{9+16}=5\\), \\(\\lVert\\mathbf b\\rVert=\\sqrt{36+64}=10\\).',
      'Cosine similarity \\(=\\dfrac{50}{5\\cdot10}=\\dfrac{50}{50}=1\\).'],
    result:'Similarity = 1 (a perfect match!). Makes sense: \\(\\mathbf b=2\\mathbf a\\) points the exact same way — one document is just a longer version of the other. Cosine ignores length and measures pure <em>direction</em>, which is why it\'s the standard tool for comparing text and embeddings.'}));
  const Lpd=lab('Practice: dot products & angles','Practice','');
  Lpd.append(p('Compute the dot product, and read the angle where asked.'));
  Lpd.append(practiceSet(['dot','angle','length'],5));
  root.append(Lpd);
  root.append(summary(['Dot product = multiply matching numbers, sum.','Sign: ＋ agree, 0 perpendicular, − clash.','It equals ‖a‖‖b‖cosθ — it secretly holds the angle.','Cosine similarity = the core of modern search/recommendation.']));
}};

register(cDot);
})();
