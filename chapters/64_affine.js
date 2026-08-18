/* 64_affine.js — mastery track */
'use strict';
(function(){
const cAffine={id:'affine',part:'Part VII \u00b7 Matrices deep',title:'Lines that miss the origin (affine)',
 sub:'\u201cLinear\u201d has a strict meaning: it must fix the origin. The everyday line y = mx + b is actually affine \u2014 and the fix (homogeneous coordinates) is how all of computer graphics works.',
render(root){head(root,0,cAffine);
 root.append(p('A <b>linear</b> map must send \\(\\mathbf 0 \\to \\mathbf 0\\) and respect add & scale. So \\(y = mx + b\\) with \\(b \\neq 0\\) is <em>not</em> linear \u2014 it\'s <span class="term">affine</span> (a linear map plus a shift). Rotations and scalings are linear; <b>translations</b> (sliding) are only affine.'));
 root.append(box('aha-box','the graphics trick: one extra coordinate','Translation isn\'t linear \u2014 but add a dummy coordinate (set to 1) and it <em>becomes</em> a matrix. These <b>homogeneous coordinates</b> let a single \\((n{+}1)\\times(n{+}1)\\) matrix do rotate + scale + translate at once. That\'s why 3D graphics uses 4\u00d74 matrices (Part XII): to fold translation into the linear machinery.'));
 root.append(box('key','block matrices','You can slice a big matrix into <b>blocks</b> and multiply block-by-block as if the blocks were numbers (when sizes match). Homogeneous transforms are block matrices: a rotation block, a translation column, and a row of \((0\dots0\,1)\). Blocking is how huge structured matrices get handled efficiently.'));
 root.append(worked({title:'make translation a matrix (homogeneous coords)',
   prompt:'Slide the point \((2,3)\) by \((+5,+1)\) using a 3×3 matrix.',
   steps:['Append a 1 to the point: \((2,3)\to(2,3,1)\).',
     'Build \(T=\begin{bmatrix}1&0&5\\0&1&1\\0&0&1\end{bmatrix}\) — identity, with the shift in the last column.',
     'Multiply: \(T\,(2,3,1)^{T}=(2+5,\;3+1,\;1)=(7,4,1)\).'],
   result:'Drop the appended 1: the result is \((7,4)\) — the point slid by \((5,1)\), done as a single matrix multiply. That extra coordinate is the trick that lets a GPU do rotate+scale+translate in one \(4\times4\) product per vertex.'}));
 root.append(quiz({question:'Why is the map “slide everything 3 units right” not linear?',
   options:[{t:'It moves the origin (0 \u2192 3), and linear maps must fix the origin',ok:true,why:'Exactly \u2014 translation sends 0 somewhere else, breaking linearity. It\'s affine; homogeneous coordinates make it a matrix.'},
     {t:'Because 3 is odd',ok:false,why:'The value doesn\'t matter \u2014 any nonzero shift moves the origin, which is what breaks linearity.'}]}));
 root.append(summary(['Linear maps must fix the origin (respect +/\u00d7).','y = mx + b is affine = linear + shift.','Translation is affine, not linear.','Homogeneous coordinates (an extra 1) make it a matrix \u2192 graphics.']));
}};
register(cAffine, {after:"transpose"});
})();
