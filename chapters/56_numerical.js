/* 56_numerical.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'numerical',part:'Part XXI · Numerical & capstone',title:'When the computer does it: conditioning',
 sub:'Real computation isn\'t exact. Some matrices amplify tiny errors catastrophically. Knowing which \u2014 the condition number \u2014 separates working code from silent disasters.',
render(root){head(root,0,this);
 root.append(p('On a computer, numbers carry rounding error. A well-behaved matrix keeps those errors small; an ill-conditioned one blows them up. The <span class="term">condition number</span> (ratio of largest to smallest singular value) measures how much a matrix amplifies error when you solve \\(Ax=b\\).'));
 root.append(box('aha-box','nearly-singular = dangerous','If a matrix is <em>almost</em> singular (determinant near zero, one singular value tiny), solving with it divides by that tiny number — so microscopic input noise becomes huge output error. The answer looks fine and is completely wrong. This is why numerical linear algebra prefers QR and SVD (stable) over the naive inverse.'));
 root.append(worked({title:'watch a tiny change wreck the answer',
   prompt:'Solve \(x+y=2,\; x+1.001y=2\). Then change the second constant to 2.001 and re-solve.',
   steps:['First system: subtracting gives \(0.001y=0\Rightarrow y=0\), so \(x=2\). Solution \((2, 0)\).',
     'Now nudge the data by 0.001: \(x+y=2,\; x+1.001y=2.001\). Subtracting: \(0.001y=0.001\Rightarrow y=1\), so \(x=1\). Solution \((1, 1)\).',
     'A <b>0.001</b> change in the input moved the answer by <b>1</b> — a 1000× amplification.'],
   result:'The two lines are almost parallel (nearly the same equation), so their intersection is wildly sensitive. That is ill-conditioning: the geometry is fragile, and no algorithm can fix data that barely determines the answer.'}));
 root.append(box('key','the practitioner\'s toolkit','<b>Direct methods</b> (LU, QR, Cholesky) for moderate sizes. <b>Iterative methods</b> (conjugate gradient, GMRES) for enormous sparse systems — the ones in PDE simulation, ML, and PageRank, where the matrix is billions across but mostly zeros. Same theory, engineered for scale.'));
 root.append(quiz({question:'A matrix has a huge condition number. What\'s the danger when solving Ax=b?',
   options:[{t:'Tiny rounding errors in the data get amplified into large errors in the answer',ok:true,why:'Exactly \u2014 ill-conditioned = error-amplifying. The computed solution can be far from the true one.'},
     {t:'It solves faster',ok:false,why:'Conditioning is about accuracy, not speed. High condition number means unreliable answers.'}]}));
 root.append(summary(['Computation has rounding error; matrices can amplify it.','Condition number = how much error is magnified.','Near-singular matrices are numerically dangerous.','Stable factorizations (QR, SVD) and iterative solvers handle real scale.']));
}});
})();
