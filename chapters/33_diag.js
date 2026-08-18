/* 33_diag.js — base course */
'use strict';
(function(){
const cDiag={id:'diag',part:'Part IX · Eigen',title:'Diagonalization & matrix powers',
  sub:'In its eigenbasis, a matrix becomes pure scaling — diagonal. That makes applying it a million times almost free, and explains long-run behaviour.',
render(root){
  head(root,0,cDiag);
  root.append(p('If you rewrite a matrix in the coordinate system of its own eigenvectors, it becomes <b>diagonal</b> — it just scales each eigen-axis by its eigenvalue. That\'s <span class="term">diagonalization</span>: \\(A = PDP^{-1}\\), where \\(D\\) is the diagonal of eigenvalues and \\(P\\)\'s columns are the eigenvectors.'));
  root.append(math('A = P D P^{-1}, \\qquad A^{k} = P D^{k} P^{-1}'));
  root.append(box('aha-box','why this is a superpower','To apply \\(A\\) a million times you\'d normally multiply a million matrices. But \\(A^{k}=PD^{k}P^{-1}\\), and \\(D^{k}\\) is trivial — just raise each diagonal eigenvalue to the k. Change to the eigenbasis, scale, change back. A hard repeated process becomes one easy exponent.'));
  const L=lab('Watch which eigenvalue wins','See','see');
  const nar=narrate('');const l1s=rangeRow({label:'λ₁',min:0,max:1.5,step:.05,value:1.1,fmt:v=>v.toFixed(2),onInput:()=>upd()});
  const l2s=rangeRow({label:'λ₂',min:0,max:1.5,step:.05,value:0.6,fmt:v=>v.toFixed(2),onInput:()=>upd()});
  const bar=el('div');bar.style.cssText='margin-top:8px';
  function upd(){const l1=parseFloat(l1s.input.value),l2=parseFloat(l2s.input.value);
    let a=1,b=1;let html='';for(let k=0;k<=8;k++){
      html+=`<div style="display:flex;gap:8px;align-items:center;font-size:.8rem"><span style="width:34px;color:var(--muted)">k=${k}</span>
        <div style="height:12px;background:var(--accent);width:${Math.min(180,a*40)}px;border-radius:3px"></div>
        <div style="height:12px;background:var(--accentb);width:${Math.min(180,b*40)}px;border-radius:3px"></div></div>`;
      a*=l1;b*=l2;}
    bar.innerHTML=html;
    const winner=l1>l2?'λ₁':'λ₂';const big=Math.max(l1,l2);
    nar.say(`Component along <span style="color:var(--accent)">λ₁</span> ×${l1.toFixed(2)} each step; <span style="color:var(--accentb)">λ₂</span> ×${l2.toFixed(2)}. After many steps the <b>${winner}</b> direction ${big>1?'blows up and dominates':big<1?'shrinks slowest and dominates the leftovers':'holds steady'}. <span class="g">The largest eigenvalue decides the long-run behaviour.</span>`);}
  L.append(l1s,l2s,bar,nar);upd();root.append(L);
  root.append(box('key','the punchline for applications','The <b>biggest</b> eigenvalue (and its eigenvector) dominates after many steps. That single fact <em>is</em> PageRank (the web\'s ranking vector), the steady state of a Markov chain, and population growth models. The long-run future points along the top eigenvector.'));
  root.append(h3('Two facts that make diagonalization work'));
  root.append(box('aha-box','why different eigenvalues give independent eigenvectors','Suppose \\(\\mathbf x,\\mathbf y\\) had eigenvalues \\(\\lambda\\neq\\mu\\) but were dependent — say \\(\\mathbf y=c\\mathbf x\\). Apply \\(A\\): the left side gives \\(\\mu\\mathbf y=\\mu c\\mathbf x\\), the right gives \\(cA\\mathbf x=c\\lambda\\mathbf x\\). So \\(\\mu c\\mathbf x=\\lambda c\\mathbf x\\), forcing \\(\\lambda=\\mu\\) — a contradiction. So <b>eigenvectors from distinct eigenvalues are automatically independent</b>. That\'s <em>why</em> a matrix with \\(n\\) distinct eigenvalues is always diagonalizable: it hands you \\(n\\) independent directions for free.'));
  root.append(box('key','trace = sum, determinant = product','Two invariants read straight off the eigenvalues: the <b>trace</b> (sum of the diagonal) equals the <b>sum</b> of the eigenvalues, and the <b>determinant</b> equals their <b>product</b>. Reason: in the eigenbasis \\(A\\) is diagonal with the \\(\\lambda_i\\) on the diagonal — sum-of-diagonal and product-of-diagonal are obvious there, and both trace and det are unchanged by the change of basis (Part IX\'s similarity). Quick sanity check: \\(\\det=0 \\Leftrightarrow\\) some \\(\\lambda_i=0\\), matching “singular = has a zero eigenvalue.”'));
  root.append(h3('A complete diagonalization, start to finish'));
  root.append(worked({title:'diagonalize a 2×2 fully',
    prompt:'Diagonalize \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\): find \\(P, D\\) with \\(A=PDP^{-1}\\).',
    steps:[
      'Eigenvalues (Part IX): \\(\\lambda=3\\) and \\(\\lambda=1\\). Eigenvectors: \\((1,1)\\) and \\((1,-1)\\).',
      'Stack eigenvectors as columns of \\(P=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}\\); put eigenvalues on the diagonal of \\(D=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}\\) <b>in the same order</b>.',
      'Invert \\(P\\): \\(\\det P=-2\\), so \\(P^{-1}=\\tfrac{1}{-2}\\begin{bmatrix}-1&-1\\\\-1&1\\end{bmatrix}=\\begin{bmatrix}\\tfrac12&\\tfrac12\\\\\\tfrac12&-\\tfrac12\\end{bmatrix}\\).',
      'Verify: \\(PDP^{-1}\\) multiplies back to \\(\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}=A\\). ✓'],
    result:'\\(A=PDP^{-1}\\) with those \\(P,D\\). Sanity checks: \\(\\text{trace}=4=3+1\\) ✓ and \\(\\det=3=3\\times1\\) ✓ — the eigenvalues match trace and determinant, so you know they\'re right before doing any multiplication.'}));
  root.append(box('key','the column-order rule (a classic slip)','The order of eigenvectors in \\(P\\) MUST match the order of eigenvalues in \\(D\\). Put \\((1,1)\\) first → its eigenvalue 3 goes in the first diagonal slot. Swap the columns of \\(P\\) and you must swap the diagonal of \\(D\\) too, or \\(PDP^{-1}\\neq A\\).'));
  root.append(quiz({question:'Why is A¹⁰⁰ easy once you\'ve diagonalized A = PDP⁻¹?',
    options:[{t:'A¹⁰⁰ = P D¹⁰⁰ P⁻¹, and D¹⁰⁰ is just each eigenvalue to the 100th',ok:true,why:'Exactly. Diagonalizing turns a 100-fold matrix product into one exponent per eigenvalue.'},
      {t:'Because A¹⁰⁰ = 100A',ok:false,why:'Powers aren\'t multiples. The trick is D¹⁰⁰ being trivial in the eigenbasis.'}]}));
  root.append(summary(['Diagonalization: A = PDP⁻¹ (eigenvectors in P, eigenvalues in D).','In the eigenbasis, A is pure scaling.','Aᵏ = PDᵏP⁻¹ makes huge powers cheap.','The largest eigenvalue dominates long-run behaviour (PageRank, Markov).']));
}};

/* ============================================================
   PART X — ORTHOGONALITY & PROJECTIONS
   ============================================================ */

register(cDiag);
})();
