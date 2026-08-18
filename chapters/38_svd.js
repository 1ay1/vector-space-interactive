/* 38_svd.js — base course */
'use strict';
(function(){
const cSVD={id:'svd',part:'Part XI · SVD & PCA',title:'The SVD — every matrix, decoded',
  sub:'The crown jewel: ANY matrix, of any shape, is a rotation, then a stretch along axes, then another rotation. This single fact underlies compression, recommendations, and search.',
render(root){
  head(root,0,cSVD);
  root.append(p('The <span class="term">Singular Value Decomposition</span> says every matrix \\(A\\) — square or not — factors as \\(A = U\\Sigma V^{T}\\): a rotation \\(V^{T}\\), then a pure stretch \\(\\Sigma\\) along perpendicular axes, then another rotation \\(U\\). No matter how tangled the matrix looks, it\'s only ever “rotate, stretch, rotate.”'));
  root.append(math('A = U\\,\\Sigma\\,V^{T} \\quad(\\text{rotate} \\to \\text{stretch} \\to \\text{rotate})'));
  root.append(h3('Where do U, Σ, and V actually come from?'));
  root.append(p('The SVD isn\'t pulled from nowhere — it is built directly from eigenvectors of a <em>symmetric</em> matrix you can always form, so the spectral theorem (Part XVI) guarantees it exists for <em>every</em> matrix.'));
  root.append(worked({title:'constructing the SVD from AᵀA',
    prompt:'Given any matrix \\(A\\), build \\(U,\\Sigma,V\\) from scratch.',
    steps:[
      'Form \\(A^{T}A\\). It is <b>symmetric</b> (since \\((A^{T}A)^{T}=A^{T}A\\)) and positive-semidefinite, so by the spectral theorem it has real, non-negative eigenvalues and <em>perpendicular</em> eigenvectors.',
      'Those eigenvectors become the columns of \\(V\\) (the input rotation). The <b>singular values</b> are \\(\\sigma_i=\\sqrt{\\lambda_i}\\) — square roots of those eigenvalues — down the diagonal of \\(\\Sigma\\).',
      'Apply \\(A\\) to each \\(v_i\\) and normalize: \\(u_i = A v_i / \\sigma_i\\). These come out perpendicular and form the columns of \\(U\\) (the output rotation).',
      'Then \\(A v_i = \\sigma_i u_i\\) for every axis — which is exactly \\(AV = U\\Sigma\\), i.e. \\(A = U\\Sigma V^{T}\\).'],
    result:'Because \\(A^{T}A\\) is <em>always</em> symmetric, this construction <em>always</em> works — any matrix, any shape. That is precisely why the SVD is universal where eigen-decomposition is not.'}));
  root.append(box('key','SVD vs eigen — the exact link','The singular values of \\(A\\) are the square roots of the eigenvalues of \\(A^{T}A\\). For a symmetric positive matrix the SVD and eigen-decomposition coincide; in general they differ because \\(A\\) may be non-square or non-diagonalizable — but \\(A^{T}A\\) is symmetric no matter what, so the SVD hands the spectral theorem\'s guarantees to <em>every</em> matrix.'));
  root.append(box('aha-box','why the SVD is the deepest theorem','It works for <em>every</em> matrix (unlike eigen-decomposition, which needs square + diagonalizable). The <b>singular values</b> in \\(\\Sigma\\) rank the directions by importance. Keep the biggest few and you get the best possible low-rank approximation — that\'s <b>image compression</b>, <b>recommendation systems</b> (the Netflix prize), and <b>latent semantic search</b>, all at once.'));
  root.append(box('key','SVD in one sentence per field','<b>Compression:</b> drop small singular values → tiny file, looks the same. <b>Recommendations:</b> the top singular directions are “taste factors” linking users and movies. <b>Search / NLP:</b> singular directions are latent topics. <b>Noise:</b> small singular values are usually noise — drop them.'));
  root.append(worked({title:'low-rank = compression',
    prompt:'A 1000×1000 image matrix has 1,000,000 numbers. Its SVD keeps only the top 50 singular values. How many numbers now?',
    steps:['Rank-50 approximation stores \\(U_{50}\\) (1000×50), \\(\\Sigma_{50}\\) (50), \\(V_{50}\\) (1000×50).',
      'Total ≈ \\(1000\\cdot50 + 50 + 1000\\cdot50 = 100{,}050\\) numbers.',
      'That\'s about 10% of the original — a 10× compression.'],
    result:'Keeping the strongest directions throws away detail you can barely see. That\'s lossy compression, in one theorem.'}));
  root.append(quiz({question:'What makes the SVD more general than eigen-decomposition?',
    options:[{t:'It works for ANY matrix — any shape, always real — not just square diagonalizable ones',ok:true,why:'Exactly. Every matrix has an SVD; that universality is why it\'s everywhere.'},
      {t:'It\'s faster to compute by hand',ok:false,why:'It\'s not about speed — it\'s that the SVD always exists, for every matrix.'}]}));
  root.append(summary(['Every matrix = rotate (Vᵀ) → stretch (Σ) → rotate (U).','Singular values rank directions by importance.','Keep the top few → best low-rank approximation.','This is compression, recommendations, and latent search.']));
}};

/* ============================================================
   PART XII — APPLICATIONS
   ============================================================ */

register(cSVD);
})();
