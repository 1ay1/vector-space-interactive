/* 51_spectral.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'spectral',part:'Part XVI · Quadratic forms',title:'The spectral theorem',
 sub:'The most beautiful guarantee in linear algebra: every symmetric matrix has perpendicular eigenvectors and real eigenvalues. Symmetry buys you a perfect coordinate system.',
render(root){head(root,0,this);
 root.append(p('For a general matrix, eigenvectors can be skewed or complex. But for a <b>symmetric</b> matrix (\\(A=A^{T}\\)), something perfect happens \u2014 the <span class="term">spectral theorem</span>:'));
 root.append(box('key','the guarantee','A real symmetric matrix always has (1) <b>real</b> eigenvalues, and (2) <b>perpendicular</b> eigenvectors. So it can be written \\(A = Q\\Lambda Q^{T}\\) with \\(Q\\) orthogonal (rotation) and \\(\\Lambda\\) diagonal. In its own eigenbasis, a symmetric matrix is pure, axis-aligned stretching.'));
 root.append(math('A = Q\\,\\Lambda\\,Q^{T}, \\qquad Q^{T}Q = I'));
 root.append(h3('Why symmetry forces perpendicular eigenvectors'));
 root.append(p('This is one of the prettiest short proofs in the subject — two eigenvectors with different eigenvalues are <em>automatically</em> perpendicular, purely because \\(A=A^{T}\\).'));
 root.append(worked({title:'the two-line proof',
   prompt:'Let \\(A\\mathbf x=\\lambda\\mathbf x\\) and \\(A\\mathbf y=\\mu\\mathbf y\\) with \\(\\lambda\\neq\\mu\\). Show \\(\\mathbf x\\perp\\mathbf y\\).',
   steps:['Compute \\(\\mathbf x^{T}A\\mathbf y\\) two ways. Directly: \\(\\mathbf x^{T}(A\\mathbf y)=\\mu\\,\\mathbf x^{T}\\mathbf y\\).',
     'Using symmetry \\(A=A^{T}\\): \\(\\mathbf x^{T}A\\mathbf y=(A\\mathbf x)^{T}\\mathbf y=\\lambda\\,\\mathbf x^{T}\\mathbf y\\).',
     'So \\(\\lambda\\,\\mathbf x^{T}\\mathbf y=\\mu\\,\\mathbf x^{T}\\mathbf y\\), i.e. \\((\\lambda-\\mu)\\,\\mathbf x^{T}\\mathbf y=0\\).'],
   result:'Since \\(\\lambda\\neq\\mu\\), we must have \\(\\mathbf x^{T}\\mathbf y=0\\) — the eigenvectors are perpendicular. Symmetry did all the work. (Real eigenvalues follow from the same trick with complex conjugates.)'}));
 root.append(box('aha-box','why you keep meeting it','Covariance matrices (PCA), Hessians (optimization), Gram matrices, graph Laplacians, quantum observables — all symmetric, so all have clean perpendicular eigen-axes with real values. The spectral theorem is <em>why</em> PCA\'s principal directions are perpendicular and why these fields are so tractable.'));
 root.append(quiz({question:'What does the spectral theorem promise for a symmetric matrix?',
   options:[{t:'Real eigenvalues and perpendicular (orthogonal) eigenvectors',ok:true,why:'Exactly \u2014 symmetry guarantees a real, orthogonal eigen-basis: A = Q\u039bQ\u1d40.'},
     {t:'That it has no eigenvalues',ok:false,why:'The opposite \u2014 it guarantees a full set of real eigenvalues with perpendicular eigenvectors.'}]}));
 root.append(summary(['Symmetric matrices: real eigenvalues, perpendicular eigenvectors.','A = Q\u039bQ\u1d40 with Q orthogonal, \u039b diagonal.','In its eigenbasis it\'s pure axis-aligned stretching.','Underlies PCA, optimization Hessians, quantum mechanics.']));
}});

/* ============================================================ XVII — COMPLEX & INNER PRODUCT */
})();
