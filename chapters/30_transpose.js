/* 30_transpose.js — base course */
'use strict';
(function(){
const cTranspose={id:'transpose',part:'Part VII · Matrices deep',title:'Transpose & special matrices',
  sub:'Flip a matrix across its diagonal and a surprising amount of structure appears — symmetry, orthogonal matrices, and the shapes that make later theorems work.',
render(root){
  head(root,0,cTranspose);
  root.append(p('The <span class="term">transpose</span> \\(A^{T}\\) swaps rows and columns — flip the matrix across its main diagonal. Simple move, deep consequences.'));
  const L=lab('Flip it','Play');
  const g=matrixGrid({rows:2,cols:3,values:[[1,2,3],[4,5,6]]});
  const out=el('div');out.style.cssText='margin-top:10px';const btn=el('button','btn','transpose');
  btn.onclick=()=>{out.innerHTML='Aᵀ = '+matrixHTML(LA.transpose(g.get()));};
  const ctr=el('div','controls');ctr.append(btn);L.append(g.el,ctr,out);root.append(L);
  root.append(box('key','the special matrices to know',`
    <b>Symmetric</b> (\\(A^{T}=A\\)) — mirror across the diagonal; always has real eigenvalues & perpendicular eigenvectors (huge for PCA).<br>
    <b>Diagonal</b> — only the diagonal is nonzero; just scales each axis independently.<br>
    <b>Identity</b> \\(I\\) — the “do nothing” matrix; \\(IA=A\\).<br>
    <b>Orthogonal</b> (\\(Q^{T}Q=I\\)) — columns are perpendicular unit vectors; rotations & reflections, they preserve length and angle.`));
  root.append(box('aha-box','why transpose matters','\\((AB)^{T}=B^{T}A^{T}\\), and the dot product is \\(\\mathbf a\\cdot\\mathbf b=\\mathbf a^{T}\\mathbf b\\). Transpose is the bridge between “transforms” and “geometry” — it\'s how length, angle, and projection get written in matrix language (Part X).'));
  root.append(quiz({question:'A matrix Q has perpendicular unit-length columns (QᵀQ = I). What does it do to shapes?',
    options:[{t:'Rotates/reflects them without changing sizes or angles',ok:true,why:'Yes — orthogonal matrices are rigid motions. Lengths and angles are preserved; only orientation changes.'},
      {t:'Stretches them by the determinant',ok:false,why:'That\'s a general matrix. Orthogonal ones have |det|=1 and preserve all distances.'}]}));
  root.append(summary(['Transpose Aᵀ = swap rows/columns (flip across diagonal).','Symmetric: Aᵀ=A. Orthogonal: QᵀQ=I (rigid motion).','(AB)ᵀ=BᵀAᵀ; the dot product is aᵀb.','These shapes power the big theorems ahead.']));
}};

/* ============================================================
   PART VIII — DETERMINANTS
   ============================================================ */

register(cTranspose);
})();
