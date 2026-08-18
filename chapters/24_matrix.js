/* 24_matrix.js — base course */
'use strict';
(function(){
const cMatrix={id:'matrix',part:'Part V · Going deeper',title:'Matrices — verbs for vectors',
  sub:'So far vectors just sat there. A matrix is a machine that MOVES every vector at once — rotate, stretch, shear the whole space. It\'s the next big idea, and it\'s still just our two moves.',
render(root){
  head(root,20,cMatrix);
  root.append(p('A vector is a <em>noun</em> (a thing). A <span class="term">matrix</span> is a <em>verb</em> — it does something to every vector in the space at once: rotate it, stretch it, flip it, shear it. And here\'s the beautiful part: a matrix is fully described by <b>where it sends the basis vectors</b>. Move the two arrows below and watch the <em>entire grid</em> follow.'));
  const ro=el('div','readout','');const nar=narrate('Drag the sliders to reshape space.');
  const board=matrixBoard({onChange:(m,det)=>{
    ro.innerHTML=`î → (${fmt(m[0])}, ${fmt(m[2])}) &nbsp; ĵ → (${fmt(m[1])}, ${fmt(m[3])}) &nbsp;·&nbsp; area × <b>${fmt(det)}</b>`;
    const msg = Math.abs(det)<0.05?'<span class="r">area → 0: the whole plane got squashed onto a line!</span>':
      det<0?'space got <b>flipped</b> (mirror) and scaled.':'space stretched/rotated; area scaled by the number.';
    nar.say(`The grid is now sheared/scaled so î lands at (${fmt(m[0])}, ${fmt(m[2])}) and ĵ at (${fmt(m[1])}, ${fmt(m[3])}). ${msg}`);}});
  const rA=rangeRow({label:'î x',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(v,m[1],m[2],m[3]);}});
  const rC=rangeRow({label:'î y',min:-2,max:2,step:.1,value:0,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(m[0],m[1],v,m[3]);}});
  const rB=rangeRow({label:'ĵ x',min:-2,max:2,step:.1,value:0,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(m[0],v,m[2],m[3]);}});
  const rD=rangeRow({label:'ĵ y',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{const m=board.api.get();board.api.set(m[0],m[1],m[2],v);}});
  const L=lab('Reshape the whole plane','See','see');
  const g=el('div','grow');g.append(ro,rA,rC,rB,rD);const s=el('div','stage');s.append(board,g);
  L.append(s,nar);root.append(L);
  root.append(box('key','presets to try','<b>Rotate 90°:</b> î→(0,1), ĵ→(−1,0). &nbsp; <b>Stretch x by 2:</b> î→(2,0), ĵ→(0,1). &nbsp; <b>Shear:</b> î→(1,0), ĵ→(1,1). &nbsp; <b>Squash flat:</b> î→(1,0), ĵ→(2,0) — the whole plane collapses to a line (area × 0).'));
  root.append(worked({title:'applying a matrix is just a linear combination',
    prompt:'A matrix sends \\(\\hat\\imath\\to(2,0)\\) and \\(\\hat\\jmath\\to(1,3)\\). Where does the vector \\((x,y)\\) go?',
    steps:[
      'Any vector is \\(x\\hat\\imath + y\\hat\\jmath\\) — a linear combination of the basis.',
      'A matrix respects add & scale, so it sends \\(x\\hat\\imath+y\\hat\\jmath \\to x\\,(2,0)+y\\,(1,3)\\).',
      'Combine: \\((2x+y,\\; 3y)\\).'],
    result:'A matrix moves the whole space, but each vector just rides its <em>own</em> linear combination of “where the basis went.” It\'s our two moves again.'}));
  root.append(box('aha-box','why matrices are everywhere','Rotating a game character, warping a photo, one layer of a neural network, a Google-search ranking step — all are “apply a matrix to a vector.” The <span class="term">determinant</span> you saw (the area factor) tells you if the transform squashes information (det = 0) or is reversible. <span class="aha">Everything deeper — eigenvectors, PCA, transformers — is built on this one picture.</span>'));
  root.append(h3('Read the geometry: name that transformation'));
  root.append(p('A matrix\'s <em>type</em> is written in what it does to the grid. Rotations preserve lengths and angles; shears slide one axis; a determinant of 0 squashes onto a line. Identify each one — it trains you to see the geometry <em>in</em> the numbers.'));
  const Lt=lab('Name that transformation','Play');
  Lt.append(transformQuiz());
  root.append(Lt);
  root.append(quiz({question:'A matrix squashes the whole plane onto a single line (determinant 0). What did it lose?',
    options:[{t:'Information — many different inputs now map to the same output, so you can\'t undo it',ok:true,why:'Exactly. Zero determinant = not reversible = the transform threw away a dimension. This is “singular.”'},
      {t:'Nothing — it\'s fully reversible',ok:false,why:'A collapse to a line means countless inputs share one output; you can\'t recover which. Not reversible.'}]}));
  root.append(summary(['A matrix = a verb: it moves every vector at once.','It\'s defined by where the basis vectors land.','Applying it = a linear combination (our two moves).','Determinant = how area scales; 0 means it squashed a dimension.']));
}};

register(cMatrix);
})();
