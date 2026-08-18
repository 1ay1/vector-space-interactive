/* 47_fourspaces.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'fourspaces',part:'Part XIV · Fundamental theorem',title:'The four fundamental subspaces',
 sub:'Strang\'s masterpiece: every matrix organizes ALL of space into four subspaces, paired by perpendicularity. This is the structural heart of linear algebra.',
render(root){head(root,0,this);
 root.append(p('Every \\(m\\times n\\) matrix \\(A\\) carves up its input space \\(\\mathbb R^n\\) and output space \\(\\mathbb R^m\\) into <b>four subspaces</b> \u2014 and they pair up as perpendicular complements. This picture (due to Gilbert Strang) is the skeleton everything hangs on.'));
 root.append(box('key','the four subspaces',`
   In the input space \\(\\mathbb R^n\\):<br>
   \u2022 <b>Row space</b> (dim = rank \\(r\\)) \u2014 spanned by the rows.<br>
   \u2022 <b>Null space</b> (dim \\(n-r\\)) \u2014 what \\(A\\) kills. <em>Perpendicular to the row space.</em><br>
   In the output space \\(\\mathbb R^m\\):<br>
   \u2022 <b>Column space</b> (dim \\(r\\)) \u2014 what \\(A\\) reaches.<br>
   \u2022 <b>Left null space</b> (dim \\(m-r\\)) \u2014 what \\(A^{T}\\) kills. <em>Perpendicular to the column space.</em>`));
 root.append(math('\\underbrace{\\text{row space} \\perp \\text{null space}}_{\\text{in }\\mathbb R^n} \\qquad \\underbrace{\\text{col space} \\perp \\text{left null space}}_{\\text{in }\\mathbb R^m}'));
 root.append(box('aha-box','the fundamental theorem, in words','The row space and null space are perpendicular and together fill all of \(\mathbb R^n\): every input splits uniquely into “a part the matrix acts on” (row space) + “a part it destroys” (null space). Same story for outputs. The matrix is a clean map from row space onto column space — a perfect one-to-one correspondence in dimension \(r\).'));
 root.append(h3('See all four — and their perpendicularity'));
 root.append(p('For a 2×2, both spaces are \(\mathbb R^2\). Edit \(A\) and watch: at full rank each space fills entirely; make it <b>rank 1</b> (e.g. rows proportional) and the four subspaces appear as <em>perpendicular line pairs</em> — the fundamental theorem, drawn.'));
 const Lv=lab('The four subspaces, live','See','see');
 Lv.append(fourSubspaces());
 root.append(Lv);
 root.append(box('key','why perpendicular pairs matter','Row space ⊥ null space means: split any input into “the part \(A\) sees” + “the part it kills,” and those parts are perpendicular. That clean split is exactly what makes projection, least squares, and the SVD work. Set the matrix rank-1 above and the two orange/blue lines are always at right angles.'));
 root.append(summary(['Every matrix → four subspaces, two in each space.','row space ⊥ null space; column space ⊥ left null space.','Dimensions: r, n−r, r, m−r.','A maps the row space one-to-one onto the column space.']));
}});
})();
