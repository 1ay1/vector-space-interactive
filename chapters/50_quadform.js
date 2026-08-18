/* 50_quadform.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'quadform',part:'Part XVI · Quadratic forms',title:'Quadratic forms & definiteness',
 sub:'Expressions like x\u00b2+xy+y\u00b2 are secretly matrices. Their eigenvalues decide whether the landscape is a bowl, a dome, or a saddle \u2014 the foundation of optimization.',
render(root){head(root,0,this);
 root.append(p('A <span class="term">quadratic form</span> \\(Q(\\mathbf x)=\\mathbf x^{T} A\\mathbf x\\) turns a symmetric matrix into a bowl-shaped landscape. Its curvature everywhere is set by \\(A\\)\'s eigenvalues. Slide the entries and watch the shape morph and get classified:'));
 const L=lab('The shape of x\u1d40Ax','See','see');L.append(quadFormPlot());root.append(L);
 root.append(box('aha-box','eigenvalues = the shape',`
   <b>All eigenvalues > 0</b> \u2192 <span style="color:var(--accentc)">positive definite</span>: a bowl, unique minimum. <br>
   <b>All < 0</b> \u2192 negative definite: a dome, unique maximum.<br>
   <b>Mixed signs</b> \u2192 <span style="color:var(--accentd)">indefinite</span>: a saddle (min one way, max another).`));
 root.append(box('key','why optimization lives here','At a critical point of any smooth function, the <b>Hessian</b> (matrix of second derivatives) is a symmetric matrix, and this exact test decides min vs max vs saddle. Positive-definite = “you found a minimum.” Every training run of every ML model is chasing the positive-definite bowls of a loss landscape.'));
 root.append(worked({title:'complete the square to SEE the bowl',
   prompt:'Is \(Q(x,y)=2x^2+2xy+3y^2\) positive definite (a bowl)?',
   steps:['Group the x-terms and complete the square: \(2x^2+2xy = 2\left(x+\tfrac{y}{2}\right)^2 - \tfrac{y^2}{2}\).',
     'So \(Q = 2\left(x+\tfrac{y}{2}\right)^2 - \tfrac{y^2}{2} + 3y^2 = 2\left(x+\tfrac{y}{2}\right)^2 + \tfrac{5}{2}y^2\).',
     'Both squared terms have <em>positive</em> coefficients, so \(Q\ge 0\), and \(Q=0\) only at \((0,0)\).'],
   result:'Positive definite — a bowl with its unique minimum at the origin. Completing the square is the by-hand version of “all eigenvalues positive”; the positive coefficients you produced ARE (essentially) the eigenvalue signs.'}));
 root.append(box('key','the fast 2×2 test','For \(A=\begin{bmatrix}a&b\\b&c\end{bmatrix}\): positive definite ⇔ \(a>0\) AND \(\det=ac-b^2>0\). (Here \(a=2>0\) and \(\det=6-1=5>0\) — confirms the bowl.) These “leading minors” being positive is Sylvester\'s criterion — a shortcut that avoids computing eigenvalues.'));
 root.append(quiz({question:'A quadratic form has eigenvalues +3 and −1. What shape is it?',
   options:[{t:'A saddle (indefinite) \u2014 a min in one direction, a max in another',ok:true,why:'Mixed-sign eigenvalues = indefinite = saddle. No overall min or max.'},
     {t:'A bowl with a minimum',ok:false,why:'That needs BOTH eigenvalues positive. One negative makes it a saddle.'}]}));
 root.append(summary(['Q(x)=x\u1d40Ax is a landscape set by symmetric A.','Eigenvalue signs classify: bowl / dome / saddle.','Positive definite = unique minimum.','This is the second-derivative test \u2014 the basis of optimization.']));
}});
})();
