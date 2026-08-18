/* 35_lsq.js — base course */
'use strict';
(function(){
const cLSQ={id:'lsq',part:'Part X · Orthogonality',title:'Least squares — the best fit to messy data',
  sub:'Real data never lands exactly on a line. Least squares finds the line closest to all of it — and it\'s just a projection in disguise.',
render(root){
  head(root,0,cLSQ);
  root.append(p('You have noisy points and want the best straight line. There\'s usually <em>no</em> line through them all — the system \\(Ax=b\\) has no exact solution. So we find the \\(x\\) making \\(Ax\\) as <b>close as possible</b> to \\(b\\): project \\(b\\) onto the column space of \\(A\\). Hit the button and watch the residuals.'));
  const L=lab('Fit the best line','Play');L.append(leastSquares());root.append(L);
  root.append(math('A^{T}A\\,\\hat x = A^{T}b \\quad(\\text{the normal equations})'));
  root.append(h3('Where the normal equations come from'));
  root.append(worked({title:'deriving AᵀA x̂ = Aᵀb',
    prompt:'We want \\(\\hat x\\) making \\(A\\hat x\\) the closest point in the column space to \\(b\\). Turn “closest” into an equation.',
    steps:[
      'The residual \\(b - A\\hat x\\) must be <b>perpendicular to the column space</b> — that\'s what “closest” means (Part X).',
      'Perpendicular to every column of \\(A\\) means each column dotted with the residual is 0: \\(A^{T}(b - A\\hat x) = \\mathbf 0\\).',
      'Distribute: \\(A^{T}b - A^{T}A\\hat x = \\mathbf 0\\).'],
    result:'Rearranged: \\(A^{T}A\\hat x = A^{T}b\\) — the normal equations. Same one idea as every projection: <b>make the error perpendicular.</b> \\(A^{T}A\\) is square and (usually) invertible, so \\(\\hat x=(A^{T}A)^{-1}A^{T}b\\).'}));
  root.append(box('trap','the tempting wrong path','“Just invert \\(A\\) and compute \\(x=A^{-1}b\\).” You <em>can\'t</em> — for real data \\(A\\) is tall (more rows than columns), so it isn\'t square and has no inverse. The fix isn\'t to force an inverse; it\'s to accept there\'s no exact solution and project. That\'s why we form the <em>square</em> matrix \\(A^{T}A\\) instead.'));
  const Lp=lab('Practice: scalar projection','Practice','');
  Lp.append(p('Compute \\(t=(a\\cdot b)/(a\\cdot a)\\), the amount of a in the projection of b onto a.'));
  Lp.append(practiceSet(['projscalar'],4));
  root.append(Lp);
  root.append(box('aha-box','no exact answer? project.','When \\(Ax=b\\) is unsolvable, you can\'t hit \\(b\\) — so you hit the closest reachable point instead: the projection of \\(b\\) onto everything \\(A\\) can produce. The red residual lines are the leftover errors; least squares makes their total <em>squared</em> length as small as possible.'));
  root.append(box('key','where you\'ve used this without knowing','Every trend line, every “line of best fit,” every linear regression in statistics and machine learning is this exact projection. The “learning” in the simplest ML models <em>is</em> solving the normal equations.'));
  root.append(quiz({question:'Why can\'t we usually solve Ax=b exactly for real data?',
    options:[{t:'There are more equations (data points) than unknowns, and noise — so no line hits them all; we project to the closest fit',ok:true,why:'Right. Overdetermined + noisy → no exact solution → least squares finds the nearest reachable point.'},
      {t:'Because matrices can\'t be inverted',ok:false,why:'A here isn\'t even square. The issue is too many constraints; projection handles it.'}]}));
  root.append(summary(['Real data → Ax=b usually has no exact solution.','Least squares = project b onto A\'s column space (closest reachable).','Solved by the normal equations AᵀAx = Aᵀb.','This IS linear regression — the core of basic ML.']));
}};

register(cLSQ);
})();
