/* 62_similar.js — mastery track */
'use strict';
(function(){
const cSimilar={id:'similar',part:'Part IX \u00b7 Eigen',title:'Similarity \u2014 the same map in new clothes',
 sub:'Two matrices are \u201csimilar\u201d if they\'re the same transformation seen from different coordinate systems. Eigenvalues, trace, and determinant are exactly what they share.',
render(root){head(root,0,cSimilar);
 root.append(p('Change the basis (Part II) and a transformation\'s <em>matrix</em> changes, but the transformation itself doesn\'t. Two matrices related by \\(B = P^{-1}AP\\) are <span class="term">similar</span> \u2014 the same map, different rulers. Diagonalization is just \u201cfind the rulers (eigenvectors) that make the matrix diagonal.\u201d'));
 root.append(math('B = P^{-1} A P \\quad(\\text{same transformation, new coordinate system } P)'));
 root.append(box('aha-box','what survives a change of basis','Similar matrices share their <b>eigenvalues</b>, <b>determinant</b>, <b>trace</b>, <b>rank</b>, and <b>characteristic polynomial</b> \u2014 because those describe the <em>transformation</em>, not the coordinates. They\'re the \u201ccoordinate-free\u201d truths. (The eigenvectors\' components change, but the eigen-<em>directions</em> are the same lines.)'));
 root.append(box('key','why diagonalization is a similarity','\(A = PDP^{-1}\) says \(A\) is <em>similar</em> to the diagonal matrix \(D\). In the eigenbasis the map is just scaling — same transformation, cleanest possible clothes. Jordan form (Part XVIII) is what you get when no basis makes it fully diagonal.'));
 root.append(worked({title:'similar matrices share their fingerprints',
   prompt:'\(A=\begin{bmatrix}2&1\\0&3\end{bmatrix}\) and \(B=\begin{bmatrix}3&0\\1&2\end{bmatrix}\) turn out to be similar. Check that trace, det, and eigenvalues match without finding \(P\).',
   steps:['Trace: \(A\) gives \(2+3=5\); \(B\) gives \(3+2=5\). ✓',
     'Determinant: \(A\) gives \(2\cdot3-1\cdot0=6\); \(B\) gives \(3\cdot2-0\cdot1=6\). ✓',
     'Eigenvalues: both are triangular-ish with the same trace 5 and det 6, so both solve \(\lambda^2-5\lambda+6=0\Rightarrow\lambda=2,3\). ✓'],
   result:'All the coordinate-free invariants agree — strong evidence they\'re the same map in different clothes. (Matching trace+det+eigenvalues is exactly how you spot similarity without hunting for the change-of-basis \(P\).)'}));
 root.append(quiz({question:'A = P⁻¹BP. Which quantity might DIFFER between A and B?',
   options:[{t:'The individual matrix entries',ok:true,why:'Right \u2014 entries are coordinate-dependent. Eigenvalues, trace, det, rank all stay the same; the entries themselves can look totally different.'},
     {t:'The eigenvalues',ok:false,why:'Eigenvalues are invariant under similarity \u2014 they describe the map, not the basis.'}]}));
 root.append(summary(['Similar: B = P\u207b\u00b9AP = same map, different basis.','Shared invariants: eigenvalues, det, trace, rank, char. poly.','Diagonalization = the similarity that makes A diagonal.','\u201cCoordinate-free\u201d quantities are the ones that survive.']));
}};
register(cSimilar, {after:"eigen"});
})();
