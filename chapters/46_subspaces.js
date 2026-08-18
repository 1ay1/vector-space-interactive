/* 46_subspaces.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'subspaces',part:'Part XIII · Abstract spaces',title:'Subspaces, kernel & image',
 sub:'A subspace is a flat slice through the origin that\'s closed under add & scale. Every linear map hands you two crucial ones: its kernel (what it kills) and image (what it can reach).',
render(root){head(root,0,this);
 root.append(p('A <span class="term">subspace</span> is a subset that is itself a vector space: it contains the origin and is closed under addition and scaling \u2014 a line or plane <em>through the origin</em>, not floating off to the side. Two subspaces come free with every matrix \\(A\\):'));
 root.append(box('key','the two subspaces of a map',`
   <b>Kernel (null space):</b> all vectors \\(A\\) sends to <b>0</b> \u2014 the directions it destroys.<br>
   <b>Image (column space):</b> all vectors \\(A\\) can produce \u2014 the span of its columns, everywhere it can reach.`));
 root.append(h3('See the null space appear'));
 root.append(p('Run elimination; columns without pivots are <b>free</b> \u2014 each free variable gives one null-space direction (a nonzero vector the matrix kills).'));
 const L=lab('Kernel via elimination','Play');
 L.append(rrefStepper({rows:3,cols:3,values:[[1,2,3],[2,4,6],[1,1,1]]}));
 root.append(L);
 root.append(box('aha-box','kernel measures collapse','If the kernel is just \\(\\{0\\}\\), the map loses nothing \u2014 it\'s injective (and, for square matrices, invertible). A bigger kernel = more directions crushed to zero = more information lost. The kernel is exactly the \u201clost dimensions\u201d of Part VIII\'s \\(\\det=0\\).'));
 root.append(quiz({question:'A linear map has a nonzero vector in its kernel. Can it be invertible?',
   options:[{t:'No \u2014 it sends a nonzero vector to 0, so it destroys information and can\'t be undone',ok:true,why:'Exactly. Nonzero kernel \u21d2 not injective \u21d2 not invertible \u21d2 det = 0.'},
     {t:'Yes, kernels don\'t affect invertibility',ok:false,why:'A nonzero kernel is precisely why a map fails to be invertible.'}]}));
 root.append(box('key','the three-part test for a subspace','A set \(S\) is a subspace iff: (1) it contains the <b>zero vector</b>, (2) it\'s <b>closed under addition</b> (\(u,v\in S\Rightarrow u+v\in S\)), and (3) it\'s <b>closed under scaling</b> (\(v\in S\Rightarrow cv\in S\)). Fail any one and it\'s not a subspace. The quickest disqualifier: <em>does it contain the origin?</em> If not, done — not a subspace.'));
 const Lp=lab('Practice: is it a subspace?','Practice','');
 Lp.append(p('Answer yes or no. The fastest check is usually “does it contain (0,0)?”'));
 Lp.append(practiceSet(['subspace'],5));
 root.append(Lp);
 root.append(summary(['Subspace = flat piece through the origin, closed under +/×.','Kernel = what a map sends to 0 (directions destroyed).','Image = column space = everywhere the map can reach.','Kernel = {0} ⇔ injective ⇔ (square) invertible.']));
}});

/* ============================================================ XIV — FOUR FUNDAMENTAL SUBSPACES */
})();
