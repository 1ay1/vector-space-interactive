/* 53_jordan.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'jordan',part:'Part XVIII · Advanced eigen',title:'When diagonalization fails: Jordan form',
 sub:'Some matrices can\'t be fully diagonalized \u2014 they shear as well as stretch. Jordan form is the closest you can get, and Cayley\u2013Hamilton is a spooky identity every matrix obeys.',
render(root){head(root,0,this);
 root.append(p('Diagonalization (Part IX) needs enough independent eigenvectors. Some matrices are \u201cdefective\u201d \u2014 they don\'t have enough, because they <em>shear</em> along an eigendirection. The best you can do is <span class="term">Jordan form</span>: almost diagonal, with a few 1\'s just above the diagonal marking the shear.'));
 root.append(math('J = \\begin{bmatrix}\\lambda & 1 \\\\ 0 & \\lambda\\end{bmatrix} \\quad(\\text{a Jordan block: stretch by }\\lambda\\text{, plus a shear})'));
 root.append(box('aha-box','generalized eigenvectors','When true eigenvectors run out, you extend with <b>generalized eigenvectors</b> \u2014 vectors that the matrix eventually sends into the eigenspace after repeated application. Every matrix, no matter how defective, has a Jordan form; it\'s the complete classification of what a linear map can do.'));
 root.append(box('key','Cayley\u2013Hamilton','Every matrix satisfies its own characteristic equation: plug the matrix into its characteristic polynomial and you get the zero matrix. \\(p(A)=0\\). It sounds like a coincidence; it\'s a deep structural fact \u2014 and it means high powers of \\(A\\) are always combinations of low ones.'));
 root.append(worked({title:'Cayley\u2013Hamilton on a 2\u00d72',
   prompt:'Verify for \\(A=\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}\\) (char. poly \\((\\lambda-2)^2=\\lambda^2-4\\lambda+4\\)).',
   steps:['Compute \\(A^2 = \\begin{bmatrix}4&4\\\\0&4\\end{bmatrix}\\).',
     'Form \\(A^2 - 4A + 4I\\): \\(\\begin{bmatrix}4&4\\\\0&4\\end{bmatrix}-\\begin{bmatrix}8&4\\\\0&8\\end{bmatrix}+\\begin{bmatrix}4&0\\\\0&4\\end{bmatrix}\\).',
     'Add: \\(\\begin{bmatrix}0&0\\\\0&0\\end{bmatrix}\\).'],
   result:'p(A) = 0, exactly as Cayley\u2013Hamilton promises. This matrix is a Jordan block: it stretches by 2 AND shears \u2014 not diagonalizable.'}));
 root.append(summary(['Not every matrix is diagonalizable (defective = too few eigenvectors).','Jordan form = almost-diagonal with shear 1\'s; every matrix has one.','Generalized eigenvectors fill the gaps.','Cayley\u2013Hamilton: every matrix satisfies its own char. polynomial.']));
}});

/* ============================================================ XIX — FOURIER / FUNCTION SPACES */
})();
