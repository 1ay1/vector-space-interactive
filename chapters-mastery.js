/* ============================================================
   chapters-mastery.js — the mastery layer.
   Practice checkpoints, the equivalences hub, missing topics,
   and the final comprehensive exam. Inserts chapters into the
   course at sensible positions (not just the end).
   ============================================================ */
'use strict';
(function(){
const {el,narrate,quiz,fmt,C,worked,practiceSet,matrixHTML,matrixGrid,webGraph}=VS;

function head(root,n,c){
  let num=n; try{const i=CHAPTERS.findIndex(x=>x.id===c.id);if(i>=0)num=i+1;}catch(e){}
  if(c.part) root.append(el('div','part-banner',c.part));
  root.append(el('div','eyebrow',`Chapter ${num}`));
  root.append(el('h1',null,c.title));
  root.append(el('p','lead-big',c.sub));
}
function box(kind,tag,html){const b=el('div','box '+kind);b.append(el('div','box-tag',tag));b.insertAdjacentHTML('beforeend',html);return b;}
function lab(title,badge='Practice',cls=''){const l=el('div','lab');const h=el('div','lab-head');h.append(el('span','lab-badge '+cls,badge),el('span','lab-title',title));l.append(h);return l;}
function p(html){return el('p',null,html);}
function h3(t){return el('h3',null,t);}
function math(tex){return el('div','mathblock','$$'+tex+'$$');}
function summary(items){const s=el('div','summary');s.append(el('h4',null,'Lock it in'));const u=document.createElement('ul');items.forEach(i=>{const li=document.createElement('li');li.innerHTML=i;u.append(li);});s.append(u);return s;}
function checkpoint(root, kinds, msg){
  const L=lab('Checkpoint \u2014 prove it stuck','Practice','');
  L.append(p(msg||'Fresh random problems every visit. Type answers, press Enter. Aim to clear them without peeking.'));
  L.append(practiceSet(kinds, 6));
  root.append(L);
}

/* helper to insert a chapter right after an existing id */
function insertAfter(afterId, chapter){
  const i=CHAPTERS.findIndex(c=>c.id===afterId);
  if(i>=0) CHAPTERS.splice(i+1,0,chapter); else CHAPTERS.push(chapter);
}

/* ---------- CROSS PRODUCT (the 3D companion to the dot product) ---------- */
const cCross={id:'cross',part:'Part III · Geometry',title:'The cross product (3D only)',
 sub:'The dot product gives a number; the cross product gives a whole new vector — one perpendicular to both inputs, with length equal to the parallelogram they span. It\'s special to three dimensions.',
render(root){head(root,0,cCross);
 root.append(p('The dot product takes two vectors → a number. The <span class="term">cross product</span> \\(\\mathbf a\\times\\mathbf b\\) takes two 3D vectors → a <em>third vector</em>, perpendicular to both, whose length is the area of the parallelogram they span. It exists only in 3D (a quirk we\'ll explain).'));
 root.append(math('\\mathbf a\\times\\mathbf b = \\big(a_2b_3-a_3b_2,\\; a_3b_1-a_1b_3,\\; a_1b_2-a_2b_1\\big)'));
 root.append(box('aha-box','it\'s built from little 2×2 determinants','Each component is a 2×2 determinant of the other two coordinates — e.g. the first is \\(\\det\\begin{bmatrix}a_2&b_2\\\\a_3&b_3\\end{bmatrix}\\). So the cross product is really “the determinant, one dimension at a time.” Its length \\(\\lVert\\mathbf a\\times\\mathbf b\\rVert=\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\sin\\theta\\) is the parallelogram area — the perfect complement to the dot product\'s \\(\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\cos\\theta\\).'));
 root.append(worked({title:'a cross product by hand',
   prompt:'Compute \\((1,0,0)\\times(0,1,0)\\) — the x-axis crossed with the y-axis.',
   steps:['First component: \\(a_2b_3-a_3b_2 = 0\\cdot0-0\\cdot1 = 0\\).',
     'Second: \\(a_3b_1-a_1b_3 = 0\\cdot0-1\\cdot0 = 0\\).',
     'Third: \\(a_1b_2-a_2b_1 = 1\\cdot1-0\\cdot0 = 1\\).'],
   result:'\\((0,0,1)\\) — the z-axis! Crossing x and y gives z, perpendicular to both, with length 1 (the unit square\'s area). The “right-hand rule” just tracks which of ±z you get.'}));
 root.append(box('key','why only 3D','“A vector perpendicular to two given directions, of a definite length” only has a unique answer in 3D. In 2D there\'s no room to be perpendicular to two independent vectors; in 4D+ the perpendicular space is bigger than one line, so no single vector is singled out. (The real generalization is the <em>wedge product</em> of Part XX.)'));
 root.append(box('key','where it\'s used','Surface normals in 3D graphics (which way a polygon faces), torque and angular momentum in physics, and testing orientation (is this triangle clockwise?). Whenever you need “the perpendicular direction” in 3D, it\'s the cross product.'));
 root.append(quiz({question:'What is a×b geometrically?',
   options:[{t:'A vector perpendicular to both a and b, with length equal to their parallelogram\'s area',ok:true,why:'Exactly — direction perpendicular to both (right-hand rule), magnitude = ‖a‖‖b‖sinθ = the spanned area.'},
     {t:'A number measuring how aligned they are',ok:false,why:'That\'s the dot product. The cross product returns a whole perpendicular vector.'}]}));
 root.append(summary(['Cross product: two 3D vectors → a perpendicular vector.','Length = ‖a‖‖b‖sinθ = parallelogram area (dot uses cos).','Each component is a little 2×2 determinant.','Unique to 3D; used for normals, torque, orientation.']));
}};
insertAfter('dot', cCross);

/* ---------- THE INVERTIBLE MATRIX THEOREM (hub) ---------- */
const cIMT={id:'imt',part:'Part IX\u00bd \u00b7 The great connection',title:'The one theorem behind everything',
 sub:'A dozen ideas you\'ve met \u2014 determinant, rank, kernel, independence, solutions \u2014 are secretly THE SAME statement about a square matrix. This is where the whole subject clicks into one.',
render(root){head(root,0,cIMT);
 root.append(p('You keep meeting the same wall wearing different masks: \u201cdet = 0,\u201d \u201crank < n,\u201d \u201chas a nonzero kernel,\u201d \u201ccolumns dependent.\u201d Here\'s the secret \u2014 for a square matrix these are all <b>the exact same fact</b>. This is the <span class="term">Invertible Matrix Theorem</span>, and internalizing it is the moment linear algebra stops being a list of topics.'));
 root.append(box('key','all of these are equivalent (for an n\u00d7n matrix A)',`
   For a square matrix \\(A\\), <b>either ALL of these are true, or ALL are false</b> \u2014 never a mix:<br><br>
   \u2022 \\(A\\) is <b>invertible</b> (\\(A^{-1}\\) exists)<br>
   \u2022 \\(\\det A \\neq 0\\)<br>
   \u2022 \\(A\\) has <b>full rank</b> (rank = n)<br>
   \u2022 the columns are <b>linearly independent</b><br>
   \u2022 the columns <b>span</b> all of \\(\\mathbb R^n\\) (they're a basis)<br>
   \u2022 the <b>kernel is just {0}</b> (nullity 0)<br>
   \u2022 \\(Ax=b\\) has <b>exactly one</b> solution for every \\(b\\)<br>
   \u2022 \\(Ax=0\\) has <b>only</b> the zero solution<br>
   \u2022 <b>0 is not an eigenvalue</b> of \\(A\\)<br>
   \u2022 the rows are independent; \\(A^{T}\\) is invertible too`));
 root.append(box('aha-box','why they\'re all one fact','They all say the same thing: <em>\\(A\\) doesn\'t collapse any dimension.</em> If it preserves all n dimensions, then it\'s reversible, its volume factor (det) is nonzero, nothing lands in the kernel, every target is hit exactly once, and no direction gets scaled to zero (no 0 eigenvalue). Collapse one dimension and <em>every</em> item on the list fails at once. One geometric idea, ten algebraic shadows.'));
 root.append(h3('Feel the equivalence'));
 root.append(p('Pick any statement as your \u201chandle.\u201d The instant you know it, you know all the others for free \u2014 that\'s the power. \u201cThe determinant is 7\u201d instantly tells you: invertible, full rank, unique solutions, independent columns, no zero eigenvalue. One check, ten conclusions.'));
 root.append(quiz({question:'You compute det(A) = 0 for a square matrix. Which of these does that NOT tell you?',
   options:[{t:'It tells you all of them \u2014 singular, rank < n, nonzero kernel, dependent columns, 0 is an eigenvalue, Ax=b not uniquely solvable',ok:true,why:'Right \u2014 det=0 triggers the ENTIRE list. That\'s the whole point of the theorem: they stand or fall together.'},
     {t:'It leaves rank unknown',ok:false,why:'det=0 forces rank < n. Every item is locked to the others.'}]}));
 root.append(summary(['For a square matrix, ~10 properties are all equivalent.','They all say: \u201cthe matrix collapses no dimension.\u201d','Know any one \u2192 know them all, instantly.','This is the spine that unifies the whole subject.']));
}};
insertAfter('diag', cIMT);

/* ---------- CRAMER'S RULE + more determinant ---------- */
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
insertAfter('det', cCramer);

/* ---------- SIMILARITY & CHANGE OF BASIS FOR MAPS ---------- */
const cSimilar={id:'similar',part:'Part IX \u00b7 Eigen',title:'Similarity \u2014 the same map in new clothes',
 sub:'Two matrices are \u201csimilar\u201d if they\'re the same transformation seen from different coordinate systems. Eigenvalues, trace, and determinant are exactly what they share.',
render(root){head(root,0,cSimilar);
 root.append(p('Change the basis (Part II) and a transformation\'s <em>matrix</em> changes, but the transformation itself doesn\'t. Two matrices related by \\(B = P^{-1}AP\\) are <span class="term">similar</span> \u2014 the same map, different rulers. Diagonalization is just \u201cfind the rulers (eigenvectors) that make the matrix diagonal.\u201d'));
 root.append(math('B = P^{-1} A P \\quad(\\text{same transformation, new coordinate system } P)'));
 root.append(box('aha-box','what survives a change of basis','Similar matrices share their <b>eigenvalues</b>, <b>determinant</b>, <b>trace</b>, <b>rank</b>, and <b>characteristic polynomial</b> \u2014 because those describe the <em>transformation</em>, not the coordinates. They\'re the \u201ccoordinate-free\u201d truths. (The eigenvectors\' components change, but the eigen-<em>directions</em> are the same lines.)'));
 root.append(box('key','why diagonalization is a similarity','\\(A = PDP^{-1}\\) says \\(A\\) is <em>similar</em> to the diagonal matrix \\(D\\). In the eigenbasis the map is just scaling \u2014 same transformation, cleanest possible clothes. Jordan form (Part XVIII) is what you get when no basis makes it fully diagonal.'));
 root.append(quiz({question:'A = P\u207b\u00b9BP. Which quantity might DIFFER between A and B?',
   options:[{t:'The individual matrix entries',ok:true,why:'Right \u2014 entries are coordinate-dependent. Eigenvalues, trace, det, rank all stay the same; the entries themselves can look totally different.'},
     {t:'The eigenvalues',ok:false,why:'Eigenvalues are invariant under similarity \u2014 they describe the map, not the basis.'}]}));
 root.append(summary(['Similar: B = P\u207b\u00b9AP = same map, different basis.','Shared invariants: eigenvalues, det, trace, rank, char. poly.','Diagonalization = the similarity that makes A diagonal.','\u201cCoordinate-free\u201d quantities are the ones that survive.']));
}};
insertAfter('eigen', cSimilar);

/* ---------- ORTHOGONAL COMPLEMENTS ---------- */
const cOrthComp={id:'orthcomp',part:'Part X \u00b7 Orthogonality',title:'Orthogonal complements & decomposition',
 sub:'Every subspace has a perpendicular partner. Together they split space cleanly, so every vector = (part inside) + (part perpendicular). This is projection\'s backbone.',
render(root){head(root,0,cOrthComp);
 root.append(p('Given a subspace \\(V\\) (say, a plane through the origin), its <span class="term">orthogonal complement</span> \\(V^{\\perp}\\) is everything perpendicular to all of it (the normal line). Together they fill the whole space with no overlap: \\(\\mathbb R^n = V \\oplus V^{\\perp}\\).'));
 root.append(math('\\mathbb R^n = V \\oplus V^{\\perp}, \\qquad \\dim V + \\dim V^{\\perp} = n'));
 root.append(box('aha-box','every vector splits, uniquely','Any vector \\(\\mathbf b\\) breaks into exactly one piece <em>in</em> \\(V\\) plus one piece <em>perpendicular</em> to \\(V\\). The in-\\(V\\) piece is the <b>projection</b> (Part X); the perpendicular piece is the <b>error</b> in least squares. \u201cClosest point + perpendicular leftover\u201d is this decomposition in action.'));
 root.append(box('key','it ties the four subspaces together','The fundamental theorem (Part XIV) is exactly this: <b>row space</b> and <b>null space</b> are orthogonal complements in \\(\\mathbb R^n\\); <b>column space</b> and <b>left null space</b> are complements in \\(\\mathbb R^m\\). Orthogonal complements ARE the geometry behind the four subspaces.'));
 root.append(quiz({question:'V is a 2D plane through the origin in 3D. What is V\u22a5?',
   options:[{t:'The 1D line through the origin perpendicular to the plane',ok:true,why:'Yes \u2014 dim V + dim V\u22a5 = 3, so the complement is a 1D normal line. Every 3D vector = (in-plane part) + (along-normal part).'},
     {t:'Another 2D plane',ok:false,why:'Dimensions must add to 3: a 2D plane\'s complement is a 1D line.'}]}));
 root.append(summary(['Every subspace V has a perpendicular partner V\u22a5.','V \u2295 V\u22a5 fills all of space; dims add to n.','Every vector = projection onto V + perpendicular error.','This is the geometry behind the four fundamental subspaces.']));
}};
insertAfter('gramschmidt', cOrthComp);

/* ---------- AFFINE vs LINEAR + BLOCK MATRICES ---------- */
const cAffine={id:'affine',part:'Part VII \u00b7 Matrices deep',title:'Lines that miss the origin (affine)',
 sub:'\u201cLinear\u201d has a strict meaning: it must fix the origin. The everyday line y = mx + b is actually affine \u2014 and the fix (homogeneous coordinates) is how all of computer graphics works.',
render(root){head(root,0,cAffine);
 root.append(p('A <b>linear</b> map must send \\(\\mathbf 0 \\to \\mathbf 0\\) and respect add & scale. So \\(y = mx + b\\) with \\(b \\neq 0\\) is <em>not</em> linear \u2014 it\'s <span class="term">affine</span> (a linear map plus a shift). Rotations and scalings are linear; <b>translations</b> (sliding) are only affine.'));
 root.append(box('aha-box','the graphics trick: one extra coordinate','Translation isn\'t linear \u2014 but add a dummy coordinate (set to 1) and it <em>becomes</em> a matrix. These <b>homogeneous coordinates</b> let a single \\((n{+}1)\\times(n{+}1)\\) matrix do rotate + scale + translate at once. That\'s why 3D graphics uses 4\u00d74 matrices (Part XII): to fold translation into the linear machinery.'));
 root.append(box('key','block matrices','You can slice a big matrix into <b>blocks</b> and multiply block-by-block as if the blocks were numbers (when sizes match). Homogeneous transforms are block matrices: a rotation block, a translation column, and a row of \\((0\\dots0\\,1)\\). Blocking is how huge structured matrices get handled efficiently.'));
 root.append(quiz({question:'Why is the map \u201cslide everything 3 units right\u201d not linear?',
   options:[{t:'It moves the origin (0 \u2192 3), and linear maps must fix the origin',ok:true,why:'Exactly \u2014 translation sends 0 somewhere else, breaking linearity. It\'s affine; homogeneous coordinates make it a matrix.'},
     {t:'Because 3 is odd',ok:false,why:'The value doesn\'t matter \u2014 any nonzero shift moves the origin, which is what breaks linearity.'}]}));
 root.append(summary(['Linear maps must fix the origin (respect +/\u00d7).','y = mx + b is affine = linear + shift.','Translation is affine, not linear.','Homogeneous coordinates (an extra 1) make it a matrix \u2192 graphics.']));
}};
insertAfter('transpose', cAffine);

/* ---------- CHECKPOINTS (graded practice) ---------- */
const ck1={id:'ck-foundations',part:'Part V \u00b7 Payoff',title:'Checkpoint: vectors & the two moves',
 sub:'Random graded problems on everything so far \u2014 add, scale, dot product, length. Clear these and the foundations are yours.',
render(root){head(root,0,ck1);
 root.append(p('The first checkpoint. These regenerate every visit, so come back until they\'re automatic. Type the answer (numbers, commas fine) and press Enter.'));
 checkpoint(root,['add','scale','dot','length']);
 root.append(box('aha-box','why practice, not just reading','Reading builds recognition; <em>doing</em> builds recall. If any of these felt slow, that\'s the signal to replay that chapter \u2014 the arithmetic should become as automatic as reading. That automaticity is what \u201cinternalized\u201d means.'));
}};
insertAfter('review', ck1);

const ck2={id:'ck-matrices',part:'Part IX \u00b7 Eigen',title:'Checkpoint: matrices, determinants, eigenvalues',
 sub:'Graded practice across systems and transforms: matrix\u00d7vector, matrix\u00d7matrix, determinants, rank, and reading eigenvalues off triangular matrices.',
render(root){head(root,0,ck2);
 root.append(p('Second checkpoint \u2014 the computational core. Aim to clear all six without \u201cshow.\u201d'));
 checkpoint(root,['matvec','matmul','det2','rank','eig','nullity']);
 root.append(box('key','the mixed-practice effect','Notice these problems come <em>shuffled</em>. Mixing problem types (\u201cinterleaving\u201d) is harder than blocked practice but builds far more durable, flexible skill \u2014 you learn to <em>recognize</em> which tool a problem needs, not just crank a known one. That recognition is real mastery.'));
}};
insertAfter('similar', ck2);

/* ---------- FINAL COMPREHENSIVE EXAM ---------- */
const cExam={id:'exam',part:'Part XXI \u00b7 Numerical & capstone',title:'The mastery exam',
 sub:'Twelve mixed problems spanning the whole course \u2014 no hints about which topic. If you can clear these cold, you have genuinely internalized linear algebra.',
render(root){head(root,0,cExam);
 root.append(el('div','pull','This is the real test of internalization: problems arrive with no label. You have to see what each one is asking and reach for the right tool automatically.'));
 root.append(p('Twelve problems drawn from across everything: vectors, dot products, lengths, determinants, matrix products, rank, nullity, eigenvalues. Fresh set every visit.'));
 const L=lab('Comprehensive exam \u2014 12 problems','Exam','weird');
 L.append(practiceSet(['add','scale','dot','length','det2','matvec','matmul','eig','rank','nullity'], 12));
 root.append(L);
 root.append(box('aha-box','scoring yourself honestly','<b>10\u201312:</b> you own the mechanics \u2014 go build something (an SVD compressor, a tiny neural net, a physics sim). <b>7\u20139:</b> solid; revisit the two or three types that tripped you. <b>&lt;7:</b> replay the relevant checkpoints \u2014 no shame, that\'s exactly what they\'re for. Mastery is built by return visits, not one pass.'));
 root.append(box('key','what you can now do','You can read any equation of the form \\(A\\mathbf x = \\mathbf b\\) or \\(A\\mathbf v = \\lambda\\mathbf v\\) and <em>know what it means geometrically</em>. You can look at a matrix and see the transformation. You can decompose, project, and diagonalize. That vocabulary is the foundation of machine learning, graphics, quantum mechanics, statistics, and control theory \u2014 every one of them is this toolkit, specialized.'));
 root.append(el('div','pull','You started at \u201ca vector is a list of numbers.\u201d You can now compress an image with the SVD, rank the web with an eigenvector, and fit a model with a projection. You didn\'t memorize linear algebra \u2014 you built it, felt it, and made it yours.'));
 root.append(summary(['Mixed, unlabeled problems test true recognition.','Clear them cold = you\'ve internalized the mechanics.','Return visits build durable mastery.','You now hold the foundation the technical world runs on.']));
}};
CHAPTERS.push(cExam);

})();
