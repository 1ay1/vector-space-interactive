/* 66_ck-matrices.js — mastery track */
'use strict';
(function(){
const ck2={id:'ck-matrices',part:'Part IX \u00b7 Eigen',title:'Checkpoint: matrices, determinants, eigenvalues',
 sub:'Graded practice across systems and transforms: matrix\u00d7vector, matrix\u00d7matrix, determinants, rank, and reading eigenvalues off triangular matrices.',
render(root){head(root,0,ck2);
 root.append(p('Second checkpoint \u2014 the computational core. Aim to clear all six without \u201cshow.\u201d'));
 checkpoint(root,['matvec','matmul','det2','rank','eig','nullity']);
 root.append(box('key','the mixed-practice effect','Notice these problems come <em>shuffled</em>. Mixing problem types (\u201cinterleaving\u201d) is harder than blocked practice but builds far more durable, flexible skill \u2014 you learn to <em>recognize</em> which tool a problem needs, not just crank a known one. That recognition is real mastery.'));
}};
register(ck2, {after:"similar"});
})();
