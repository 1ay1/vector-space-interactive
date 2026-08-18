/* 61_cramer.js — mastery track */
'use strict';
(function(){
const cCramer={id:'cramer',part:'Part VIII \u00b7 Determinants',title:'Cramer\'s rule & the adjugate',
 sub:'A beautiful (if impractical) closed form: solve a system, or invert a matrix, using nothing but determinants. Great for insight, and for tiny systems.',
render(root){head(root,0,cCramer);
 root.append(p('Determinants can solve systems directly. <span class="term">Cramer\'s rule</span>: to find \\(x_i\\), replace column \\(i\\) of \\(A\\) with the right-hand side \\(b\\), take that determinant, and divide by \\(\\det A\\).'));
 root.append(math('x_i = \\frac{\\det(A_i)}{\\det(A)} \\quad(A_i = A \\text{ with column } i \\text{ replaced by } b)'));
 root.append(worked({title:'Cramer on a 2\u00d72 system',
   prompt:'Solve \\(2x+y=5,\\; x+3y=6\\).',
   steps:['\\(\\det A = \\det\\begin{bmatrix}2&1\\\\1&3\\end{bmatrix} = 6-1 = 5\\).',
     '\\(x = \\dfrac{\\det\\begin{bmatrix}5&1\\\\6&3\\end{bmatrix}}{5} = \\dfrac{15-6}{5} = \\dfrac{9}{5}\\).',
     '\\(y = \\dfrac{\\det\\begin{bmatrix}2&5\\\\1&6\\end{bmatrix}}{5} = \\dfrac{12-5}{5} = \\dfrac{7}{5}\\).'],
   result:'\\((x,y) = (9/5,\\,7/5)\\). Notice: if \\(\\det A = 0\\) you\'d be dividing by zero \u2014 exactly the \u201cno unique solution\u201d case.'}));
 root.append(box('aha-box','why it\'s more insight than tool','Cramer\'s rule is gorgeous and shows solutions are ratios of volumes \u2014 but it needs \\(n{+}1\\) determinants, so it\'s hopelessly slow for big systems (elimination wins). Its real value: it proves solutions depend smoothly on the data, and it powers theory like the matrix inverse formula \\(A^{-1} = \\frac{1}{\\det A}\\,\\text{adj}(A)\\).'));
 root.append(box('key','the trace, while we\'re here','The <b>trace</b> (sum of diagonal entries) is the determinant\'s quieter cousin: it equals the <em>sum</em> of eigenvalues (determinant = <em>product</em>). Trace is invariant under similarity and shows up everywhere from statistics (expected values) to physics.'));
 root.append(summary(['Cramer: x_i = det(A with col i \u2192 b) / det(A).','Solutions are ratios of volumes; det=0 \u2192 no unique solution.','Great for insight & tiny systems; elimination wins at scale.','Trace = sum of eigenvalues; determinant = product.']));
}};
register(cCramer, {after:"det"});
})();
