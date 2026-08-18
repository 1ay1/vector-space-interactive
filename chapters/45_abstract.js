/* 45_abstract.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'abstract',part:'Part XIII · Abstract spaces',title:'Vectors that aren\'t arrows',
 sub:'The payoff of the axioms: polynomials, functions, even matrices are vectors. Anything you can add and scale sanely lives in a vector space, and all our tools apply.',
render(root){head(root,0,this);
 root.append(p('We defined a <span class="term">vector space</span> as anything you can add and scale (obeying the 7 promises). Time to cash that in. Watch three things that look nothing like arrows but <em>are</em> vectors.'));
 root.append(box('key','three surprising vector spaces',`
   <b>Polynomials</b> \\(a+bx+cx^2\\) \u2014 add them, scale them; the space of degree-\u2264 2 polynomials is <em>3-dimensional</em> with basis \\(\\{1,x,x^2\\}\\).<br>
   <b>Functions</b> \u2014 add \\(f+g\\), scale \\(2f\\); an infinite-dimensional space (Part IV).<br>
   <b>Matrices</b> \u2014 the 2\u00d72 matrices form a <em>4-dimensional</em> vector space with basis the four \u201csingle-1\u201d matrices.`));
 root.append(box('aha-box','why this is huge','Every theorem we proved \u2014 span, basis, dimension, linear maps, eigenvectors \u2014 instantly applies to polynomials, signals, and matrices, <em>for free</em>. \u201cThe derivative\u201d becomes a linear map on the space of functions with its own matrix and eigenvectors. One framework, endless applications.'));
 root.append(worked({title:'the derivative is a matrix',
   prompt:'On polynomials \\(a+bx+cx^2\\) (basis \\(1,x,x^2\\)), what matrix is \u201ctake the derivative\u201d?',
   steps:['\\(\\frac{d}{dx}\\) sends \\(1\\to 0,\\; x\\to 1,\\; x^2\\to 2x\\).',
     'In coordinates: \\(1{=}(1,0,0)\\to(0,0,0)\\); \\(x{=}(0,1,0)\\to(1,0,0)\\); \\(x^2{=}(0,0,1)\\to(0,2,0)\\).',
     'Columns = where basis vectors go: \\(D=\\begin{bmatrix}0&1&0\\\\0&0&2\\\\0&0&0\\end{bmatrix}\\).'],
   result:'Calculus\u2019 derivative IS a matrix. Its only eigenvalue is 0 (eigenvector: the constants) \u2014 which is why integration has a \u201c+ C.\u201d'}));
 root.append(quiz({question:'Is the set of degree-\u22642 polynomials a vector space, and what is its dimension?',
   options:[{t:'Yes; dimension 3 (basis 1, x, x\u00b2)',ok:true,why:'Right \u2014 add & scale keep you in the set, and three basis elements span it.'},
     {t:'No; polynomials aren\'t vectors',ok:false,why:'They add and scale by all the rules \u2014 they are a genuine 3-dimensional vector space.'}]}));
 root.append(summary(['Vectors need not be arrows \u2014 polynomials, functions, matrices qualify.','Each has a basis and a dimension.','Linear maps (like the derivative) become matrices.','Every earlier theorem applies to all of them for free.']));
}});
})();
