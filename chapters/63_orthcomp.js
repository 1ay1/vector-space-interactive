/* 63_orthcomp.js — mastery track */
'use strict';
(function(){
const cOrthComp={id:'orthcomp',part:'Part X \u00b7 Orthogonality',title:'Orthogonal complements & decomposition',
 sub:'Every subspace has a perpendicular partner. Together they split space cleanly, so every vector = (part inside) + (part perpendicular). This is projection\'s backbone.',
render(root){head(root,0,cOrthComp);
 root.append(p('Given a subspace \\(V\\) (say, a plane through the origin), its <span class="term">orthogonal complement</span> \\(V^{\\perp}\\) is everything perpendicular to all of it (the normal line). Together they fill the whole space with no overlap: \\(\\mathbb R^n = V \\oplus V^{\\perp}\\).'));
 root.append(math('\\mathbb R^n = V \\oplus V^{\\perp}, \\qquad \\dim V + \\dim V^{\\perp} = n'));
 root.append(box('aha-box','every vector splits, uniquely','Any vector \\(\\mathbf b\\) breaks into exactly one piece <em>in</em> \\(V\\) plus one piece <em>perpendicular</em> to \\(V\\). The in-\\(V\\) piece is the <b>projection</b> (Part X); the perpendicular piece is the <b>error</b> in least squares. \u201cClosest point + perpendicular leftover\u201d is this decomposition in action.'));
 root.append(box('key','it ties the four subspaces together','The fundamental theorem (Part XIV) is exactly this: <b>row space</b> and <b>null space</b> are orthogonal complements in \(\mathbb R^n\); <b>column space</b> and <b>left null space</b> are complements in \(\mathbb R^m\). Orthogonal complements ARE the geometry behind the four subspaces.'));
 root.append(worked({title:'split a vector into V + V⊥',
   prompt:'Let \(V\) be the x-axis (the line spanned by \((1,0)\)). Decompose \(\mathbf b=(4,3)\) into a part in \(V\) plus a part in \(V^{\perp}\).',
   steps:['Project onto \(V\): the shadow of \((4,3)\) on the x-axis is \((4,0)\) (just the x-component).',
     'The perpendicular part is the leftover: \(\mathbf b-(4,0)=(0,3)\).',
     'Check: \((0,3)\) is along the y-axis = \(V^{\perp}\), and \((4,0)+(0,3)=(4,3)=\mathbf b\). ✓'],
   result:'\\(\\mathbf b = \\underbrace{(4,0)}_{\\in V} + \\underbrace{(0,3)}_{\\in V^{\\perp}}\\) — a unique split. This is the projection (in \\(V\\)) plus the residual (perpendicular). Every least-squares fit is doing exactly this decomposition.'}));
 root.append(quiz({question:'V is a 2D plane through the origin in 3D. What is V⊥?',
   options:[{t:'The 1D line through the origin perpendicular to the plane',ok:true,why:'Yes \u2014 dim V + dim V\u22a5 = 3, so the complement is a 1D normal line. Every 3D vector = (in-plane part) + (along-normal part).'},
     {t:'Another 2D plane',ok:false,why:'Dimensions must add to 3: a 2D plane\'s complement is a 1D line.'}]}));
 root.append(summary(['Every subspace V has a perpendicular partner V\u22a5.','V \u2295 V\u22a5 fills all of space; dims add to n.','Every vector = projection onto V + perpendicular error.','This is the geometry behind the four fundamental subspaces.']));
}};
register(cOrthComp, {after:"gramschmidt"});
})();
