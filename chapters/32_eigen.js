/* 32_eigen.js — base course */
'use strict';
(function(){
const cEigen={id:'eigen',part:'Part IX · Eigen',title:'Eigenvectors — the directions a matrix won\'t turn',
  sub:'Most vectors get rotated when a matrix hits them. A special few only get stretched, never turned. Those are eigenvectors — the secret skeleton of the transform.',
render(root){
  head(root,0,cEigen);
  root.append(p('Apply a matrix to a vector and usually it <em>rotates</em>. But for special directions, the output points the <b>same way</b> — the matrix only stretches (or flips) it. Those directions are <span class="term">eigenvectors</span>; the stretch factor is the <span class="term">eigenvalue</span> \\(\\lambda\\). Drag v and hunt for the directions that don\'t turn.'));
  const L=lab('Find the un-turning directions','Play');
  const ee=eigenExplorer({matrix:[[2,1],[1,2]]});
  L.append(ee);
  // matrix picker
  const g=matrixGrid({rows:2,cols:2,values:[[2,1],[1,2]]});
  const btn=el('button','btn ghost','use this matrix');btn.onclick=()=>ee.setMatrix(g.get());
  const ctr=el('div','controls');ctr.append(el('span',null,'<span style="font-size:.85rem;color:var(--muted)">try a matrix:</span>'),g.el,btn);
  L.append(ctr);root.append(L);
  root.append(math('A\\mathbf v = \\lambda \\mathbf v \\quad(\\text{output = a scalar multiple of the input})'));
  root.append(box('aha-box','the defining equation','\(A\mathbf v=\lambda\mathbf v\) says: the matrix acting on \(\mathbf v\) is the <em>same</em> as just scaling \(\mathbf v\) by \(\lambda\). No rotation, no shear — pure stretch. Eigenvectors are the axes the transform is “built around.”'));
  root.append(h3('Why on earth does det(A − λI) = 0 find them?'));
  root.append(p('That equation looks like it fell from the sky. It doesn\'t — it\'s forced, step by step, by the definition plus the Invertible Matrix Theorem. Follow the chain:'));
  root.append(worked({title:'from the definition to the characteristic equation',
    prompt:'We want nonzero \(\mathbf v\) with \(A\mathbf v = \lambda\mathbf v\). Turn that into a condition on \(\lambda\) alone.',
    steps:[
      'Move everything to one side: \(A\mathbf v - \lambda\mathbf v = \mathbf 0\).',
      'Factor out \(\mathbf v\) using the identity \(I\) (so the sizes match): \((A - \lambda I)\mathbf v = \mathbf 0\).',
      'This says the matrix \(A-\lambda I\) sends a <em>nonzero</em> \(\mathbf v\) to \(\mathbf 0\) — i.e. it has a nonzero kernel.',
      'By the Invertible Matrix Theorem, a matrix with a nonzero kernel is <b>singular</b> — its determinant is 0.'],
    result:'So \(\det(A-\lambda I)=0\). It\'s not a trick: it\'s the ONLY way a nonzero vector can be killed. Solving it gives the \(\lambda\)\'s; then \((A-\lambda I)\mathbf v=\mathbf 0\) gives each eigenvector.'}));
  root.append(box('key','the characteristic polynomial','Expanding \\(\\det(A-\\lambda I)\\) gives a polynomial in \\(\\lambda\\) (degree \\(n\\) for an \\(n\\times n\\) matrix). Its roots are the eigenvalues — so an \\(n\\times n\\) matrix has exactly \\(n\\) of them (counting repeats, and allowing complex ones — Part XVII). This is why eigenvalues exist at all.'));
  root.append(box('key','three words people mix up','<b>Eigenvalue</b> = the scalar \\(\\lambda\\) (a number). <b>Eigenvector</b> = a specific nonzero \\(\\mathbf v\\) with \\(A\\mathbf v=\\lambda\\mathbf v\\). <b>Eigenspace</b> = <em>all</em> vectors for that \\(\\lambda\\) (the whole line/plane of them, including \\(\\mathbf 0\\)). One eigenvalue owns a whole eigenspace — that\'s why “the” eigenvector isn\'t unique \((1,1), (2,2), \dots\) are all the same eigenvector direction, and if the eigenspace is a plane there are genuinely different eigenvectors sharing one eigenvalue.'));
  root.append(box('trap','when an eigenvalue repeats','If \\(\\lambda\\) is a <em>double root</em> of the characteristic polynomial (algebraic multiplicity 2), it <em>might</em> have a 2D eigenspace (two independent eigenvectors) — or it might have only a 1D one. When it comes up short, the matrix is <b>defective</b> and can\'t be diagonalized (that\'s Jordan form, Part XVIII). The gap between “how many times \\(\\lambda\\) repeats” and “how many independent eigenvectors it has” is one of the subtlest points in the subject.'));
  root.append(worked({title:'finding eigenvalues (2×2)',
    prompt:'Find the eigenvalues of \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\).',
    steps:['Solve \\(\\det(A-\\lambda I)=0\\): \\(\\det\\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}=0\\).',
      'Expand: \\((2-\\lambda)^2 - 1 = 0\\).',
      '\\(\\lambda^2 -4\\lambda +3 = 0 \\Rightarrow (\\lambda-1)(\\lambda-3)=0\\).'],
    result:'\\(\\lambda = 1\\) and \\(\\lambda = 3\\). One direction is unchanged (×1), the other stretched ×3 — exactly the two eigenlines in the demo.'}));
  root.append(worked({title:'now find the eigenVECTOR for λ = 3',
    prompt:'For \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\) and \\(\\lambda=3\\), find a vector \\(\\mathbf v\\) with \\(A\\mathbf v=3\\mathbf v\\).',
    steps:[
      'Form \\(A-3I = \\begin{bmatrix}2-3&1\\\\1&2-3\\end{bmatrix} = \\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}\\).',
      'Solve \\((A-3I)\\mathbf v=\\mathbf 0\\): the top row says \\(-v_1+v_2=0\\), i.e. \\(v_1=v_2\\).',
      'So any vector with equal components works — pick the simplest, \\(\\mathbf v=(1,1)\\).',
      'Check: \\(A(1,1)=(2{+}1,\\;1{+}2)=(3,3)=3(1,1)\\). ✓'],
    result:'The eigenvector for \\(\\lambda=3\\) is \\((1,1)\\) (or any multiple). Eigenvectors always come as a whole line — direction matters, length doesn\'t. Repeat with \\(\\lambda=1\\) to get \\((1,-1)\\), perpendicular to it (as the spectral theorem promises for symmetric \\(A\\)).'}));
  root.append(box('trap','a common mistake: forgetting eigenvectors are a whole line','\\((1,1)\\), \\((2,2)\\), \\((-5,-5)\\) are all the <em>same</em> eigenvector direction — don\'t treat them as different answers. And never “solve” \\((A-\\lambda I)\\mathbf v=\\mathbf 0\\) by inverting \\(A-\\lambda I\\): its determinant is 0 by design (that\'s how you found \\(\\lambda\\)!), so it has no inverse. You must read the solution off the dependent rows.'));
  root.append(h3('Test your own guess'));
  root.append(p('Type any vector and the app computes \\(A\\mathbf v\\), then tells you whether it came out parallel to \\(\\mathbf v\\) (an eigenvector) or rotated (not). Try (1,1), then something random.'));
  const Lc=lab('Is it an eigenvector?','Play');
  Lc.append(eigenCheck({A:[[2,1],[1,2]]}));
  root.append(Lc);
  root.append(box('key','why anyone cares','Eigenvectors are the directions where a complicated transform becomes <em>simple multiplication</em>. That unlocks: raising a matrix to a huge power (repeated application), <b>PageRank</b>, the long-run state of a <b>Markov chain</b>, the vibration modes of a bridge, and <b>PCA</b> (the eigenvectors of your data\'s covariance are its main axes). We\'ll build several of these.'));
  root.append(quiz({question:'A·v = λv means…',
    options:[{t:'The matrix only scales v (by λ) without changing its direction',ok:true,why:'Exactly — that\'s the definition of an eigenvector v with eigenvalue λ.'},
      {t:'v is the largest column of A',ok:false,why:'No relation. It means applying A to v just stretches v.'}]}));
  root.append(box('connect','connects to','Eigenvectors are the engine of the rest of the course: they make <a onclick="vsGoTo(\'diag\')">diagonalization</a> and huge matrix powers cheap, they ARE the answer in <a onclick="vsGoTo(\'markov\')">Markov chains &amp; PageRank</a> (the λ=1 eigenvector), they give the axes in <a onclick="vsGoTo(\'pca\')">PCA</a>, and — for symmetric matrices — they\'re guaranteed perpendicular by the <a onclick="vsGoTo(\'spectral\')">spectral theorem</a>.'));
  root.append(summary(['Eigenvector: a direction the matrix only stretches, never rotates.','Eigenvalue λ: the stretch factor. A·v = λv.','Found via det(A − λI) = 0.','They turn hard transforms into simple scalings — the key to powers, PageRank, PCA.']));
}};

register(cEigen);
})();
