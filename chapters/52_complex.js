/* 52_complex.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'complex',part:'Part XVII · Complex spaces',title:'Complex vectors & the Fourier connection',
 sub:'A complex number is a 2D vector that knows how to rotate. Extend vectors to complex entries and rotations, waves, and quantum states all fall into place.',
render(root){head(root,0,this);
 root.append(p('A complex number \\(a+bi\\) is really the 2D vector \\((a,b)\\) \u2014 but with a bonus: multiplication that <em>rotates</em>. Multiplying by \\(i\\) is a 90\u00b0 turn. Drag a complex number and rotate it:'));
 const L=lab('The complex plane','Play');L.append(complexPlane());root.append(L);
 root.append(box('aha-box','why complex entries matter','With complex numbers, <em>every</em> matrix has a full set of eigenvalues (rotations that had none in the reals now do \u2014 their eigenvalues are complex). The dot product upgrades to the <b>Hermitian</b> inner product (conjugate one side), and \u201cperpendicular\u201d and \u201clength\u201d still work perfectly. Complex vector spaces are where the theory becomes complete.'));
 root.append(box('key','the special complex matrices','<b>Hermitian</b> (\(A=A^{*}\), conjugate-transpose) — the complex version of symmetric; real eigenvalues; these are quantum-mechanical observables. <b>Unitary</b> (\(U^{*}U=I\)) — complex rotations; preserve length; quantum time-evolution. The Fourier transform is unitary.'));
 root.append(worked({title:'a rotation\'s eigenvalues are complex',
   prompt:'The 90° rotation \(R=\begin{bmatrix}0&-1\\1&0\end{bmatrix}\) leaves NO real direction unturned. Find its eigenvalues.',
   steps:['Solve \(\det(R-\lambda I)=0\): \(\det\begin{bmatrix}-\lambda&-1\\1&-\lambda\end{bmatrix}=\lambda^2+1=0\).',
     'So \(\lambda^2=-1\), giving \(\lambda=\pm i\) — no real solutions, exactly as expected.',
     'The eigenvalues \(\pm i\) have magnitude 1 (rotations don\'t stretch) and “angle” 90° — encoding the rotation itself.'],
   result:'Over the reals this matrix looked eigenvalue-less; over \(\mathbb C\) it has \(\pm i\). This is WHY we need complex numbers: they complete the eigenvalue story for every matrix.'}));
 root.append(quiz({question:'What does multiplying a complex number by i do geometrically?',
   options:[{t:'Rotates it 90\u00b0 about the origin',ok:true,why:'Yes \u2014 i is a quarter-turn. That built-in rotation is what makes complex numbers perfect for waves and oscillations.'},
     {t:'Doubles its length',ok:false,why:'|i| = 1, so length is unchanged. Multiplying by i is a pure 90\u00b0 rotation.'}]}));
 root.append(summary(['Complex number = 2D vector + rotating multiplication.','Over \u2102 every matrix has a full set of eigenvalues.','Inner product becomes Hermitian; Hermitian/unitary replace symmetric/orthogonal.','This is the natural home of waves and quantum mechanics.']));
}});

/* ============================================================ XVIII — ADVANCED EIGEN */
})();
