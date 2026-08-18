/* 28_inverse.js — base course */
'use strict';
(function(){
const cInverse={id:'inverse',part:'Part VI · Systems',title:'The inverse — undoing a matrix',
  sub:'When a square matrix doesn\'t squash space, it can be undone. That undo is the inverse, and it solves Ax=b in one shot: x = A⁻¹b.',
render(root){
  head(root,0,cInverse);
  root.append(p('A matrix is a verb (Part V) — it moves space. If it doesn\'t collapse any dimension (determinant ≠ 0), the move can be <b>reversed</b>. The reversing matrix is the <span class="term">inverse</span>, written \\(A^{-1}\\), and it satisfies \\(A^{-1}A = I\\) (do, then undo, = do nothing).'));
  const L=lab('Invert a matrix (and see it fail)','Play');
  const grid=matrixGrid({rows:2,cols:2,values:[[2,1],[1,3]]});
  const out=el('div');out.style.cssText='margin-top:10px';const nar=narrate('Edit A, then invert.');
  const btn=el('button','btn','compute A⁻¹');
  btn.onclick=()=>{const A=grid.get();const d=LA.det(A);const Ai=LA.inv(A);
    if(!Ai){out.innerHTML='';nar.say(`<span class="r">det = 0 — no inverse.</span> This matrix squashes the plane onto a line, throwing away a dimension. You can\'t undo that; many inputs map to the same output.`);}
    else{out.innerHTML=`A⁻¹ = ${matrixHTML(Ai)} &nbsp; and &nbsp; A⁻¹A = ${matrixHTML(LA.matmul(Ai,A).map(r=>r.map(x=>Math.abs(x)<1e-9?0:x)))}`;
      nar.say(`det = <span class="k">${LA.fmtNum(d)}</span> ≠ 0, so A is invertible. Notice A⁻¹A = I — the identity, i.e. “do nothing.”`);
      if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([out]).catch(()=>{});}};
  const ctr=el('div','controls');ctr.append(btn);
  L.append(grid.el,ctr,out,nar);root.append(L);
  root.append(math('A x = b \\quad\\Longrightarrow\\quad x = A^{-1} b'));
  root.append(box('aha-box','why inverse solves systems instantly','If \\(Ax=b\\), multiply both sides by \\(A^{-1}\\): \\(x = A^{-1}b\\). One matrix-times-vector and you\'re done — <em>if</em> the inverse exists. (In practice, elimination is faster and more stable, but the inverse is the clean idea.)'));
  root.append(box('trap','not everything is invertible','Only <b>square</b> matrices can have inverses, and only when \\(\\det \\neq 0\\) (“non-singular”). A determinant of 0 means the matrix flattened space — information was destroyed, so there\'s nothing to reverse. This is the same “you lost a dimension” idea as rank < n.'));
  root.append(h3('The 2×2 inverse formula — and why it works'));
  root.append(p('For 2×2 there\'s a memorable closed form. It\'s worth knowing <em>and</em> understanding.'));
  root.append(math('\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}'));
  root.append(worked({title:'why that formula is the inverse',
    prompt:'Check that multiplying \\(A\\) by the claimed inverse gives \\(I\\).',
    steps:[
      'Swap the diagonal (\\(a\\leftrightarrow d\\)), negate the off-diagonal (\\(b,c\\)), and divide by \\(\\det=ad-bc\\).',
      'Multiply: \\(\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix} = \\begin{bmatrix}ad-bc&0\\\\0&ad-bc\\end{bmatrix}\\).',
      'That is \\((ad-bc)\\,I\\). Dividing by \\(ad-bc\\) leaves exactly \\(I\\).'],
    result:'So the formula really is \\(A^{-1}\\) — and you can see the division by \\(\\det\\) is what breaks when \\(\\det=0\\): you\'d be dividing by zero, i.e. no inverse exists.'}));
  const Lp=lab('Practice: 2×2 inverses','Practice','');
  Lp.append(p('Give the top-left entry of \\(A^{-1}\\) (a fraction like 3/5 is fine).'));
  Lp.append(practiceSet(['inv2'],4));
  root.append(Lp);
  root.append(quiz({question:'When does a square matrix FAIL to have an inverse?',
    options:[{t:'When its determinant is 0 (it squashes space, losing a dimension)',ok:true,why:'Exactly. det = 0 = singular = not invertible = rank < n. All the same fact.'},
      {t:'When it has negative entries',ok:false,why:'Negative entries are fine. Invertibility is purely about det ≠ 0.'}]}));
  root.append(summary(['Inverse A⁻¹ undoes A: A⁻¹A = I.','Exists only for square matrices with det ≠ 0.','Solves Ax=b in one shot: x = A⁻¹b.','det = 0 ⇔ singular ⇔ rank < n ⇔ no inverse.']));
}};

/* ============================================================
   PART VII — MATRICES DEEP
   ============================================================ */

register(cInverse);
})();
