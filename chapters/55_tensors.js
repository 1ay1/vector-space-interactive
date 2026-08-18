/* 55_tensors.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'tensors',part:'Part XX · Multilinear',title:'Determinants, forms & a peek at tensors',
 sub:'Zoom out once more: the determinant is the unique \u201cvolume\u201d rule, linear maps generalize to multilinear ones, and that path leads to tensors \u2014 the language of modern physics and ML.',
render(root){head(root,0,this);
 root.append(p('We treated the determinant as an area factor (Part VIII). Deeper truth: it\'s the <b>unique</b> function that is linear in each column, flips sign when you swap two columns, and gives 1 on the identity. Those three rules force the whole formula. The determinant is an <span class="term">alternating multilinear form</span>.'));
 root.append(box('aha-box','from linear to multilinear','A linear map eats one vector. A <b>bilinear</b> form (like the dot product, or \(\mathbf x^{T}A\mathbf y\)) eats two and is linear in each. Keep going — functions linear in several vector slots at once — and you get <span class="term">tensors</span>. A matrix is a 2-slot tensor; the determinant is an n-slot one.'));
 root.append(worked({title:'the three rules force ad − bc',
   prompt:'Show that “linear in each column + sign-flip on swap + det(I)=1” forces the 2×2 formula.',
   steps:['Write the columns in the standard basis: col 1 = \(a\,\mathbf e_1 + c\,\mathbf e_2\), col 2 = \(b\,\mathbf e_1 + d\,\mathbf e_2\).',
     'Linearity in each column expands \(\det\) into four terms \(ad\,D(\mathbf e_1,\mathbf e_2) + \dots\), where \(D\) is the determinant of pairs of basis vectors.',
     'The alternating rule kills repeats: \(D(\mathbf e_1,\mathbf e_1)=D(\mathbf e_2,\mathbf e_2)=0\), and \(D(\mathbf e_2,\mathbf e_1)=-D(\mathbf e_1,\mathbf e_2)\).',
     'With \(D(\mathbf e_1,\mathbf e_2)=\det(I)=1\), only \(ad(1)+bc(-1)\) survives.'],
   result:'\(\det = ad - bc\) — not defined arbitrarily, but <em>forced</em> by three natural rules. That\'s the multilinear-forms viewpoint: the formula is the unique thing satisfying the properties you actually want.'}));
 root.append(box('key','why you\'ll meet tensors','“Tensor” in <b>PyTorch/TensorFlow</b> mostly means “multi-dimensional array,” but the real idea is multilinearity: quantities that transform consistently under change of basis. General relativity (curvature), continuum mechanics (stress), and deep learning (weight tensors) all ride on it. Linear algebra is the ground floor; multilinear algebra is the next.'));
 root.append(quiz({question:'The determinant is characterized as the unique function that is\u2026',
   options:[{t:'Linear in each column, sign-flipping under column swaps, and 1 on the identity',ok:true,why:'Right \u2014 those three properties pin it down completely (alternating multilinear form).'},
     {t:'The sum of the diagonal entries',ok:false,why:'That\'s the trace. The determinant is the alternating multilinear volume form.'}]}));
 root.append(summary(['Determinant = unique alternating multilinear \u201cvolume\u201d form.','Bilinear forms (dot product, x\u1d40Ay) eat two vectors.','Tensors = multilinear maps; matrices are 2-slot tensors.','This is the doorway to physics and deep-learning math.']));
}});

/* ============================================================ XXI — NUMERICAL + CAPSTONE */
})();
