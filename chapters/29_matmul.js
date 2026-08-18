/* 29_matmul.js — base course */
'use strict';
(function(){
const cMatmul={id:'matmul',part:'Part VII · Matrices deep',title:'Multiplying matrices = chaining transforms',
  sub:'Matrix multiplication looks like a weird bookkeeping rule. It isn\'t — it\'s “do transform B, then transform A.” Composition of verbs.',
render(root){
  head(root,0,cMatmul);
  root.append(p('Why is matrix multiplication defined by that strange “row-times-column” rule? Because a matrix is a <em>transform</em> (Part V), and multiplying two of them means <b>apply one, then the other</b>. \\(AB\\) means “do B first, then A” — the result is a single matrix that does both in one step.'));
  const L=lab('Compose two transforms','Play');
  const gA=matrixGrid({rows:2,cols:2,values:[[0,-1],[1,0]]});   // rotate 90
  const gB=matrixGrid({rows:2,cols:2,values:[[2,0],[0,1]]});   // stretch x
  const out=el('div');out.style.cssText='margin-top:10px';const nar=narrate('Edit A and B, then multiply.');
  const btn=el('button','btn','compute A·B');
  btn.onclick=()=>{const A=gA.get(),B=gB.get();const AB=LA.matmul(A,B);
    out.innerHTML=`A·B = ${matrixHTML(AB)} <span style="color:var(--muted)">(apply B first, then A)</span>`;
    const BA=LA.matmul(B,A);const same=JSON.stringify(AB)===JSON.stringify(BA);
    nar.say(`Each entry of A·B is a row of A dotted with a column of B. ${same?'':'<b>Order matters:</b> A·B ≠ B·A here — rotating then stretching ≠ stretching then rotating.'}`);
    if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([out]).catch(()=>{});};
  const row=el('div');row.style.cssText='display:flex;gap:16px;align-items:center;flex-wrap:wrap';
  const wa=el('div');wa.innerHTML='<div style="font-size:.8rem;color:var(--muted)">A (2nd)</div>';wa.append(gA.el);
  const wb=el('div');wb.innerHTML='<div style="font-size:.8rem;color:var(--muted)">B (1st)</div>';wb.append(gB.el);
  row.append(wa,wb);const ctr=el('div','controls');ctr.append(btn);
  L.append(row,ctr,out,nar);root.append(L);
  root.append(box('aha-box','the rule, finally sensible','The (i,j) entry of A·B is “row i of A” · “column j of B” because column j of B says where the j-th basis vector goes under B, and then A moves that result. Row-times-column is just “track where each basis vector ends up after both transforms.”'));
  root.append(h3('Where the row×column rule actually comes from'));
  root.append(p('The rule feels arbitrary until you derive it. It\'s <em>forced</em> by one requirement: \\(AB\\) must be the single matrix that does “B then A.” Watch it fall out.'));
  root.append(worked({title:'derive the rule from “B then A”',
    prompt:'\\(AB\\) must satisfy \\((AB)\\mathbf x = A(B\\mathbf x)\\) for every \\(\\mathbf x\\). What must column \\(j\\) of \\(AB\\) be?',
    steps:[
      'A matrix\'s column \\(j\\) is just “where it sends the basis vector \\(\\mathbf e_j\\).” So column \\(j\\) of \\(AB\\) is \\((AB)\\mathbf e_j = A(B\\mathbf e_j)\\).',
      '\\(B\\mathbf e_j\\) is column \\(j\\) of \\(B\\). So column \\(j\\) of \\(AB\\) = \\(A\\times(\\text{column } j \\text{ of } B)\\).',
      'And \\(A\\) times a vector dots each ROW of \\(A\\) with that vector. So entry \\((i,j)\\) = (row \\(i\\) of \\(A\\)) · (column \\(j\\) of \\(B\\)).'],
    result:'That IS the multiplication rule — it wasn\'t chosen, it was <em>forced</em> by requiring \\(AB\\) to compose the two maps. Every weird-looking definition in linear algebra has a reason like this hiding behind it.'}));
  root.append(worked({title:'a full 2×2 product, entry by entry',
    prompt:'Multiply \\(\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}\\).',
    steps:[
      'Top-left = (row 1 of A)·(col 1 of B) = \\(1\\cdot5 + 2\\cdot7 = 19\\).',
      'Top-right = (row 1)·(col 2) = \\(1\\cdot6 + 2\\cdot8 = 22\\).',
      'Bottom-left = (row 2)·(col 1) = \\(3\\cdot5 + 4\\cdot7 = 43\\).',
      'Bottom-right = (row 2)·(col 2) = \\(3\\cdot6 + 4\\cdot8 = 50\\).'],
    result:'\\(\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}\\). Each entry is one row dotted with one column — four little dot products.'}));
  root.append(h3('Now build one yourself'));
  root.append(p('Fill in each entry of the product. Click a cell to see which row and column feed it; the box turns green when you\'re right.'));
  const Lb=lab('Build the product, cell by cell','Play');
  Lb.append(matmulBuilder({A:[[1,2],[3,4]],B:[[2,0],[1,2]]}));
  root.append(Lb);
  root.append(box('key','the dimension rule: inner sizes must match','\\(A\\) is \\(m\\times n\\), \\(B\\) is \\(p\\times q\\). The product \\(AB\\) only exists if \\(n=p\\) (A\'s columns = B\'s rows), because you\'re dotting A\'s rows with B\'s columns — they must be the same length. The result is \\(m\\times q\\) (outer sizes). Mnemonic: \\((m\\times \\underline{n})(\\underline{n}\\times q)=m\\times q\\) — the inner \\(n\\)\'s cancel.'));
  root.append(box('trap','order matters','\\(AB \\neq BA\\) in general — putting on socks then shoes ≠ shoes then socks. Matrix multiplication is <em>not</em> commutative. (It <em>is</em> associative: \\(A(BC)=(AB)C\\).) In fact \\(BA\\) may not even exist if the dimensions don\'t line up both ways!'));
  root.append(quiz({question:'In the product A·B applied to a vector, which transform happens first?',
    options:[{t:'B — it\'s closest to the vector: A(B(x))',ok:true,why:'Right. A·B·x = A(B(x)): B acts first, then A. Read right-to-left.'},
      {t:'A — it\'s written first',ok:false,why:'Written first, but applied LAST. The matrix nearest the vector acts first.'}]}));
  root.append(box('connect','connects to','Composition is why deep learning works: a <a onclick="vsGoTo(\'used\')">neural network</a> is a stack of “multiply by a matrix, then bend” layers, and chaining the linear parts is exactly matrix multiplication. It\'s also the whole <a onclick="vsGoTo(\'graphics\')">graphics</a> pipeline (model × view × projection) folded into one product.'));
  root.append(summary(['Matrix product = compose transforms (do the right one first).','(i,j) entry = row i of A · column j of B.','AB ≠ BA (order matters); A(BC)=(AB)C (associative).']));
}};

register(cMatmul);
})();
