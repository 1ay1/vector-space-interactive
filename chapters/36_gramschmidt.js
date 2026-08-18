/* 36_gramschmidt.js — base course */
'use strict';
(function(){
const cGramSchmidt={id:'gramschmidt',part:'Part X · Orthogonality',title:'Building perfect rulers (Gram–Schmidt)',
  sub:'Take any basis and straighten it into perpendicular unit vectors. Orthonormal rulers make every later computation trivial — and give you the QR decomposition for free.',
render(root){
  head(root,0,cGramSchmidt);
  root.append(p('Orthonormal vectors (perpendicular + length 1) are the dream basis: coordinates are just dot products, no messy solving. <span class="term">Gram–Schmidt</span> takes any independent set and straightens it into one — subtract off the parts that overlap with what you already have, then normalize.'));
  root.append(h3('Watch the one move: subtract the projection'));
  root.append(p('Gram–Schmidt is a single geometric idea repeated: keep \\(v_1\\); for \\(v_2\\), <b>subtract off its shadow on \\(v_1\\)</b> so what remains is perpendicular. Drag the vectors and watch \\(v_2^{\\perp}=v_2-\\text{proj}\\) form.'));
  const Lv=lab('Orthogonalize, geometrically','See','see');
  Lv.append(gramSchmidtViz());
  root.append(Lv);
  const L=lab('Straighten a basis (numbers)','Play');
  const g=matrixGrid({rows:2,cols:2,values:[[3,1],[1,2]]});
  const out=el('div');out.style.cssText='margin-top:10px';const nar=narrate('Columns are your starting vectors.');
  const btn=el('button','btn','orthonormalize the columns');
  btn.onclick=()=>{const A=g.get();const cols=[[A[0][0],A[1][0]],[A[0][1],A[1][1]]];const q=LA.gramSchmidt(cols);
    out.innerHTML='orthonormal set: '+q.map(v=>`(${v.map(x=>x.toFixed(2)).join(', ')})`).join(' &nbsp; ');
    const dot=q.length>1?(q[0][0]*q[1][0]+q[0][1]*q[1][1]):0;
    nar.say(`These two are now perpendicular (their dot product = <span class="k">${dot.toFixed(2)}</span> ≈ 0) and unit length. <span class="g">Perfect rulers.</span>`);};
  const ctr=el('div','controls');ctr.append(btn);L.append(g.el,ctr,out,nar);root.append(L);
  root.append(box('aha-box','free bonus: QR','Doing Gram–Schmidt on a matrix\'s columns factors it as \\(A = QR\\) — \\(Q\\) orthonormal, \\(R\\) upper-triangular. QR is how computers actually solve least-squares and find eigenvalues, stably. You just met the idea behind industrial-strength numerical linear algebra.'));
  root.append(summary(['Orthonormal = perpendicular + unit length = ideal rulers.','Gram–Schmidt straightens any basis into an orthonormal one.','Coordinates in an orthonormal basis = simple dot products.','It produces the QR decomposition, a workhorse of computation.']));
}};

/* ============================================================
   PART XI — SVD & PCA
   ============================================================ */

register(cGramSchmidt);
})();
