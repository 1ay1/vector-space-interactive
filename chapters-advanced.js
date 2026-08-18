/* ============================================================
   chapters-advanced.js — the rest of linear algebra, deeply.
   Parts XIII–XXI. Pushes chapters onto the existing CHAPTERS.
   ============================================================ */
'use strict';
(function(){
const {el,knob,vboard,narrate,rangeRow,quiz,clamp,fmt,C,
       matrixGrid,matrixHTML,rrefStepper,board3d,spanBoard,
       eigenExplorer,detArea,leastSquares,pcaCloud,worked,
       luStepper,quadFormPlot,complexPlane,fourierSynth,webGraph,svdPhoto,practiceSet,fourSubspaces}=VS;

/* re-declare chrome helpers (mirror chapters.js) */
function head(root,n,c){
  let num=n; try{const i=CHAPTERS.findIndex(x=>x.id===c.id);if(i>=0)num=i+1;}catch(e){}
  if(c.part) root.append(el('div','part-banner',c.part));
  root.append(el('div','eyebrow',`Chapter ${num}`));
  root.append(el('h1',null,c.title));
  root.append(el('p','lead-big',c.sub));
}
function box(kind,tag,html){const b=el('div','box '+kind);b.append(el('div','box-tag',tag));b.insertAdjacentHTML('beforeend',html);return b;}
function lab(title,badge='Play',cls=''){const l=el('div','lab');const h=el('div','lab-head');h.append(el('span','lab-badge '+cls,badge),el('span','lab-title',title));l.append(h);return l;}
function p(html){return el('p',null,html);}
function h3(t){return el('h3',null,t);}
function math(tex){const d=el('div','mathblock','$$'+tex+'$$');return d;}
function summary(items){const s=el('div','summary');s.append(el('h4',null,'Lock it in'));const ul=el('div');const u=document.createElement('ul');items.forEach(i=>{const li=document.createElement('li');li.innerHTML=i;u.append(li);});s.append(u);return s;}
function stageOf(canvas,side){const s=el('div','stage');const g=el('div','grow');(side||[]).forEach(n=>g.append(n));s.append(canvas,g);return s;}

const NEW=[];

/* ============================================================ XIII — ABSTRACT SPACES */
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

NEW.push({id:'ranknullity',part:'Part XIV · Fundamental theorem',title:'Rank\u2013nullity: conservation of dimension',
 sub:'The most quietly profound equation in the subject: the dimensions a matrix keeps plus the dimensions it destroys always equal the dimensions you started with.',
render(root){head(root,0,this);
 root.append(p('Here is a conservation law for dimension. For any \\(m\\times n\\) matrix:'));
 root.append(math('\\underbrace{\\text{rank}}_{\\dim(\\text{image})} + \\underbrace{\\text{nullity}}_{\\dim(\\text{kernel})} = n \\;(\\text{number of columns})'));
 root.append(box('aha-box','nothing is lost or created','Every one of your \(n\) input dimensions goes exactly one of two places: it survives (contributing to the rank/image) or it gets crushed to zero (contributing to the nullity/kernel). No dimension vanishes uncounted. Rank measures what gets through; nullity measures what\'s lost; together they must be \(n\).'));
 root.append(h3('Why it\'s true — counting columns after elimination'));
 root.append(p('This isn\'t a slogan; it\'s forced by elimination. Reduce the matrix to row echelon form and count.'));
 root.append(worked({title:'the one-line proof',
   prompt:'Row-reduce \(A\) (with \(n\) columns) and sort the columns into two kinds.',
   steps:['Each column either gets a <b>pivot</b> or it doesn\'t — there\'s no third option, so (# pivot columns) + (# free columns) = \(n\).',
     'The <b>pivot columns</b> are exactly the independent ones — their count is the <b>rank</b> (dimension of the image).',
     'Each <b>free column</b> gives one independent solution of \(A\mathbf x=\mathbf 0\) (set that free variable to 1, solve the rest) — so (# free columns) = the <b>nullity</b>.'],
   result:'Substituting: rank + nullity = (pivot columns) + (free columns) = \(n\). The conservation law is just “every column is pivot-or-free.”'}));
 root.append(worked({title:'using rank\u2013nullity',
   prompt:'A \\(3\\times5\\) matrix has rank 3. What is the dimension of its null space?',
   steps:['\\(n = 5\\) columns; rank \\(= 3\\).',
     'Rank + nullity = n \u2192 \\(3 + \\text{nullity} = 5\\).',
     'nullity \\(= 2\\).'],
   result:'A 2-dimensional null space: there\'s a whole plane of inputs the matrix sends to zero. (So systems \\(Ax=b\\) have a 2-parameter family of solutions when solvable.)'}));
 root.append(quiz({question:'A 4\u00d74 matrix has a 1-dimensional null space. What is its rank, and is it invertible?',
   options:[{t:'Rank 3; not invertible',ok:true,why:'4 = rank + 1, so rank = 3 < 4. A nonzero null space means singular \u2014 not invertible.'},
     {t:'Rank 4; invertible',ok:false,why:'Rank 4 would force nullity 0. A 1-D null space means rank 3 and no inverse.'}]}));
 root.append(summary(['rank + nullity = number of columns (n).','Every input dimension is either kept (rank) or killed (nullity).','It instantly relates solvability, invertibility, and freedom.','A conservation law for dimension.']));
}});

/* ============================================================ XV — DECOMPOSITIONS II */
NEW.push({id:'lu',part:'Part XV · More decompositions',title:'LU \u2014 elimination, saved for reuse',
 sub:'Factoring A = LU records Gaussian elimination once so you can solve Ax=b for many different b almost instantly. The engine under every numerical solver.',
render(root){head(root,0,this);
 root.append(p('Gaussian elimination (Part VI) turns \\(A\\) into an upper-triangular \\(U\\). If you also record the multipliers you used in a lower-triangular \\(L\\), you get \\(A = LU\\) \u2014 the same work, now <em>reusable</em>. Factor a matrix and watch L and U build:'));
 const L=lab('Factor A = LU','Play');L.append(luStepper());root.append(L);
 root.append(box('aha-box','why factor at all','To solve \\(Ax=b\\) you\'d redo elimination every time. But once \\(A=LU\\), solving is two quick triangular sweeps: \\(Ly=b\\) then \\(Ux=y\\). Change \\(b\\) a thousand times (same \\(A\\)) and each new solve is nearly free. This is how real solvers work.'));
 root.append(box('key','the decomposition family','LU (general), <b>Cholesky</b> (\\(A=LL^{T}\\), for symmetric positive-definite \u2014 twice as fast), QR (orthogonal, stable for least squares), and SVD (universal). Each trades generality for speed or stability. Choosing the right factorization is most of numerical linear algebra.'));
 root.append(summary(['A = LU records elimination as reusable triangular factors.','Solve via Ly=b then Ux=y \u2014 cheap for many right-hand sides.','Cholesky is the fast LU for symmetric positive-definite A.','Factorization choice = the craft of numerical LA.']));
}});

/* ============================================================ XVI — QUADRATIC FORMS */
NEW.push({id:'quadform',part:'Part XVI · Quadratic forms',title:'Quadratic forms & definiteness',
 sub:'Expressions like x\u00b2+xy+y\u00b2 are secretly matrices. Their eigenvalues decide whether the landscape is a bowl, a dome, or a saddle \u2014 the foundation of optimization.',
render(root){head(root,0,this);
 root.append(p('A <span class="term">quadratic form</span> \\(Q(\\mathbf x)=\\mathbf x^{T} A\\mathbf x\\) turns a symmetric matrix into a bowl-shaped landscape. Its curvature everywhere is set by \\(A\\)\'s eigenvalues. Slide the entries and watch the shape morph and get classified:'));
 const L=lab('The shape of x\u1d40Ax','See','see');L.append(quadFormPlot());root.append(L);
 root.append(box('aha-box','eigenvalues = the shape',`
   <b>All eigenvalues > 0</b> \u2192 <span style="color:var(--accentc)">positive definite</span>: a bowl, unique minimum. <br>
   <b>All < 0</b> \u2192 negative definite: a dome, unique maximum.<br>
   <b>Mixed signs</b> \u2192 <span style="color:var(--accentd)">indefinite</span>: a saddle (min one way, max another).`));
 root.append(box('key','why optimization lives here','At a critical point of any smooth function, the <b>Hessian</b> (matrix of second derivatives) is a symmetric matrix, and this exact test decides min vs max vs saddle. Positive-definite = \u201cyou found a minimum.\u201d Every training run of every ML model is chasing the positive-definite bowls of a loss landscape.'));
 root.append(quiz({question:'A quadratic form has eigenvalues +3 and \u22121. What shape is it?',
   options:[{t:'A saddle (indefinite) \u2014 a min in one direction, a max in another',ok:true,why:'Mixed-sign eigenvalues = indefinite = saddle. No overall min or max.'},
     {t:'A bowl with a minimum',ok:false,why:'That needs BOTH eigenvalues positive. One negative makes it a saddle.'}]}));
 root.append(summary(['Q(x)=x\u1d40Ax is a landscape set by symmetric A.','Eigenvalue signs classify: bowl / dome / saddle.','Positive definite = unique minimum.','This is the second-derivative test \u2014 the basis of optimization.']));
}});

NEW.push({id:'spectral',part:'Part XVI · Quadratic forms',title:'The spectral theorem',
 sub:'The most beautiful guarantee in linear algebra: every symmetric matrix has perpendicular eigenvectors and real eigenvalues. Symmetry buys you a perfect coordinate system.',
render(root){head(root,0,this);
 root.append(p('For a general matrix, eigenvectors can be skewed or complex. But for a <b>symmetric</b> matrix (\\(A=A^{T}\\)), something perfect happens \u2014 the <span class="term">spectral theorem</span>:'));
 root.append(box('key','the guarantee','A real symmetric matrix always has (1) <b>real</b> eigenvalues, and (2) <b>perpendicular</b> eigenvectors. So it can be written \\(A = Q\\Lambda Q^{T}\\) with \\(Q\\) orthogonal (rotation) and \\(\\Lambda\\) diagonal. In its own eigenbasis, a symmetric matrix is pure, axis-aligned stretching.'));
 root.append(math('A = Q\\,\\Lambda\\,Q^{T}, \\qquad Q^{T}Q = I'));
 root.append(h3('Why symmetry forces perpendicular eigenvectors'));
 root.append(p('This is one of the prettiest short proofs in the subject — two eigenvectors with different eigenvalues are <em>automatically</em> perpendicular, purely because \\(A=A^{T}\\).'));
 root.append(worked({title:'the two-line proof',
   prompt:'Let \\(A\\mathbf x=\\lambda\\mathbf x\\) and \\(A\\mathbf y=\\mu\\mathbf y\\) with \\(\\lambda\\neq\\mu\\). Show \\(\\mathbf x\\perp\\mathbf y\\).',
   steps:['Compute \\(\\mathbf x^{T}A\\mathbf y\\) two ways. Directly: \\(\\mathbf x^{T}(A\\mathbf y)=\\mu\\,\\mathbf x^{T}\\mathbf y\\).',
     'Using symmetry \\(A=A^{T}\\): \\(\\mathbf x^{T}A\\mathbf y=(A\\mathbf x)^{T}\\mathbf y=\\lambda\\,\\mathbf x^{T}\\mathbf y\\).',
     'So \\(\\lambda\\,\\mathbf x^{T}\\mathbf y=\\mu\\,\\mathbf x^{T}\\mathbf y\\), i.e. \\((\\lambda-\\mu)\\,\\mathbf x^{T}\\mathbf y=0\\).'],
   result:'Since \\(\\lambda\\neq\\mu\\), we must have \\(\\mathbf x^{T}\\mathbf y=0\\) — the eigenvectors are perpendicular. Symmetry did all the work. (Real eigenvalues follow from the same trick with complex conjugates.)'}));
 root.append(box('aha-box','why you keep meeting it','Covariance matrices (PCA), Hessians (optimization), Gram matrices, graph Laplacians, quantum observables — all symmetric, so all have clean perpendicular eigen-axes with real values. The spectral theorem is <em>why</em> PCA\'s principal directions are perpendicular and why these fields are so tractable.'));
 root.append(quiz({question:'What does the spectral theorem promise for a symmetric matrix?',
   options:[{t:'Real eigenvalues and perpendicular (orthogonal) eigenvectors',ok:true,why:'Exactly \u2014 symmetry guarantees a real, orthogonal eigen-basis: A = Q\u039bQ\u1d40.'},
     {t:'That it has no eigenvalues',ok:false,why:'The opposite \u2014 it guarantees a full set of real eigenvalues with perpendicular eigenvectors.'}]}));
 root.append(summary(['Symmetric matrices: real eigenvalues, perpendicular eigenvectors.','A = Q\u039bQ\u1d40 with Q orthogonal, \u039b diagonal.','In its eigenbasis it\'s pure axis-aligned stretching.','Underlies PCA, optimization Hessians, quantum mechanics.']));
}});

/* ============================================================ XVII — COMPLEX & INNER PRODUCT */
NEW.push({id:'complex',part:'Part XVII · Complex spaces',title:'Complex vectors & the Fourier connection',
 sub:'A complex number is a 2D vector that knows how to rotate. Extend vectors to complex entries and rotations, waves, and quantum states all fall into place.',
render(root){head(root,0,this);
 root.append(p('A complex number \\(a+bi\\) is really the 2D vector \\((a,b)\\) \u2014 but with a bonus: multiplication that <em>rotates</em>. Multiplying by \\(i\\) is a 90\u00b0 turn. Drag a complex number and rotate it:'));
 const L=lab('The complex plane','Play');L.append(complexPlane());root.append(L);
 root.append(box('aha-box','why complex entries matter','With complex numbers, <em>every</em> matrix has a full set of eigenvalues (rotations that had none in the reals now do \u2014 their eigenvalues are complex). The dot product upgrades to the <b>Hermitian</b> inner product (conjugate one side), and \u201cperpendicular\u201d and \u201clength\u201d still work perfectly. Complex vector spaces are where the theory becomes complete.'));
 root.append(box('key','the special complex matrices','<b>Hermitian</b> (\(A=A^{*}\), conjugate-transpose) — the complex version of symmetric; real eigenvalues; these are quantum-mechanical observables. <b>Unitary</b> (\(U^{*}U=I\)) — complex rotations; preserve length; quantum time-evolution. The Fourier transform is unitary.'));
 root.append(worked({title:'a rotation\'s eigenvalues are complex',
   prompt:'The 90° rotation \(R=\begin{bmatrix}0&-1\\1&0\end{bmatrix}\) leaves NO real direction unturned. Find its eigenvalues.',
   steps:['Solve \(\det(R-\lambda I)=0\): \(\det\begin{bmatrix}-\lambda&-1\\1&-\lambda\end{bmatrix}=\lambda^2+1=0\).',
     'So \(\lambda^2=-1\), giving \(\lambda=\pm i\) — no real solutions, exactly as expected.',
     'The eigenvalues \(\pm i\) have magnitude 1 (rotations don\'t stretch) and “angle” 90° — encoding the rotation itself.'],
   result:'Over the reals this matrix looked eigenvalue-less; over \(\mathbb C\) it has \(\pm i\). This is WHY we need complex numbers: they complete the eigenvalue story for every matrix.'}));
 root.append(quiz({question:'What does multiplying a complex number by i do geometrically?',
   options:[{t:'Rotates it 90\u00b0 about the origin',ok:true,why:'Yes \u2014 i is a quarter-turn. That built-in rotation is what makes complex numbers perfect for waves and oscillations.'},
     {t:'Doubles its length',ok:false,why:'|i| = 1, so length is unchanged. Multiplying by i is a pure 90\u00b0 rotation.'}]}));
 root.append(summary(['Complex number = 2D vector + rotating multiplication.','Over \u2102 every matrix has a full set of eigenvalues.','Inner product becomes Hermitian; Hermitian/unitary replace symmetric/orthogonal.','This is the natural home of waves and quantum mechanics.']));
}});

/* ============================================================ XVIII — ADVANCED EIGEN */
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
NEW.push({id:'fourier',part:'Part XIX · Function spaces',title:'Fourier = change of basis',
 sub:'The grand unification: a sound wave is a vector, sine waves are a basis, and the Fourier transform is just re-reading the signal in that basis. Build a wave from sines.',
render(root){head(root,0,this);
 root.append(p('A signal (sound, image row, stock price) is a vector in an infinite-dimensional function space (Part IV). The <b>sine and cosine waves form an orthogonal basis</b> for that space. Writing a signal in that basis \u2014 finding its \u201chow much of each frequency\u201d coordinates \u2014 <em>is</em> the <span class="term">Fourier transform</span>. Build a wave by mixing sine harmonics:'));
 const L=lab('Add up sine waves','Play');L.append(fourierSynth());root.append(L);
 root.append(box('aha-box','it\'s all change of basis','You already learned change of basis (Part II) \u2014 same vector, different rulers. Fourier is that idea with sine waves as the rulers. The \u201cfrequency spectrum\u201d is just the signal\'s coordinate list in the frequency basis. MP3, JPEG, noise cancellation, MRI, and 5G all live here.'));
 root.append(box('key','orthogonal function bases','Sines/cosines are orthogonal <em>as functions</em>: their inner product \\(\\int f g\\,dx = 0\\) unless they match. That perpendicularity is exactly why each frequency\'s coordinate can be read off independently \u2014 the same \u201corthogonal rulers make coordinates easy\u201d idea from Part X, now for functions.'));
 root.append(quiz({question:'In what sense is the Fourier transform a change of basis?',
   options:[{t:'It re-expresses a signal using sine/cosine waves as the basis instead of individual time samples',ok:true,why:'Exactly \u2014 same signal, new (frequency) rulers. The spectrum is its coordinates there.'},
     {t:'It deletes high frequencies',ok:false,why:'That\'s filtering (which you can do afterwards). Fourier itself just changes basis into frequencies.'}]}));
 root.append(summary(['Signals are vectors; sine/cosine waves are an orthogonal basis.','Fourier transform = coordinates of the signal in that basis.','Orthogonality lets each frequency be read independently.','Powers MP3, JPEG, MRI, communications \u2014 all \u201cchange of basis.\u201d']));
}});

/* ============================================================ XX — MULTILINEAR / TENSORS */
NEW.push({id:'tensors',part:'Part XX · Multilinear',title:'Determinants, forms & a peek at tensors',
 sub:'Zoom out once more: the determinant is the unique \u201cvolume\u201d rule, linear maps generalize to multilinear ones, and that path leads to tensors \u2014 the language of modern physics and ML.',
render(root){head(root,0,this);
 root.append(p('We treated the determinant as an area factor (Part VIII). Deeper truth: it\'s the <b>unique</b> function that is linear in each column, flips sign when you swap two columns, and gives 1 on the identity. Those three rules force the whole formula. The determinant is an <span class="term">alternating multilinear form</span>.'));
 root.append(box('aha-box','from linear to multilinear','A linear map eats one vector. A <b>bilinear</b> form (like the dot product, or \\(\\mathbf x^{T}A\\mathbf y\\)) eats two and is linear in each. Keep going \u2014 functions linear in several vector slots at once \u2014 and you get <span class="term">tensors</span>. A matrix is a 2-slot tensor; the determinant is an n-slot one.'));
 root.append(box('key','why you\'ll meet tensors','\u201cTensor\u201d in <b>PyTorch/TensorFlow</b> mostly means \u201cmulti-dimensional array,\u201d but the real idea is multilinearity: quantities that transform consistently under change of basis. General relativity (curvature), continuum mechanics (stress), and deep learning (weight tensors) all ride on it. Linear algebra is the ground floor; multilinear algebra is the next.'));
 root.append(quiz({question:'The determinant is characterized as the unique function that is\u2026',
   options:[{t:'Linear in each column, sign-flipping under column swaps, and 1 on the identity',ok:true,why:'Right \u2014 those three properties pin it down completely (alternating multilinear form).'},
     {t:'The sum of the diagonal entries',ok:false,why:'That\'s the trace. The determinant is the alternating multilinear volume form.'}]}));
 root.append(summary(['Determinant = unique alternating multilinear \u201cvolume\u201d form.','Bilinear forms (dot product, x\u1d40Ay) eat two vectors.','Tensors = multilinear maps; matrices are 2-slot tensors.','This is the doorway to physics and deep-learning math.']));
}});

/* ============================================================ XXI — NUMERICAL + CAPSTONE */
NEW.push({id:'numerical',part:'Part XXI · Numerical & capstone',title:'When the computer does it: conditioning',
 sub:'Real computation isn\'t exact. Some matrices amplify tiny errors catastrophically. Knowing which \u2014 the condition number \u2014 separates working code from silent disasters.',
render(root){head(root,0,this);
 root.append(p('On a computer, numbers carry rounding error. A well-behaved matrix keeps those errors small; an ill-conditioned one blows them up. The <span class="term">condition number</span> (ratio of largest to smallest singular value) measures how much a matrix amplifies error when you solve \\(Ax=b\\).'));
 root.append(box('aha-box','nearly-singular = dangerous','If a matrix is <em>almost</em> singular (determinant near zero, one singular value tiny), solving with it divides by that tiny number \u2014 so microscopic input noise becomes huge output error. The answer looks fine and is completely wrong. This is why numerical linear algebra prefers QR and SVD (stable) over the naive inverse.'));
 root.append(box('key','the practitioner\'s toolkit','<b>Direct methods</b> (LU, QR, Cholesky) for moderate sizes. <b>Iterative methods</b> (conjugate gradient, GMRES) for enormous sparse systems \u2014 the ones in PDE simulation, ML, and PageRank, where the matrix is billions across but mostly zeros. Same theory, engineered for scale.'));
 root.append(quiz({question:'A matrix has a huge condition number. What\'s the danger when solving Ax=b?',
   options:[{t:'Tiny rounding errors in the data get amplified into large errors in the answer',ok:true,why:'Exactly \u2014 ill-conditioned = error-amplifying. The computed solution can be far from the true one.'},
     {t:'It solves faster',ok:false,why:'Conditioning is about accuracy, not speed. High condition number means unreliable answers.'}]}));
 root.append(summary(['Computation has rounding error; matrices can amplify it.','Condition number = how much error is magnified.','Near-singular matrices are numerically dangerous.','Stable factorizations (QR, SVD) and iterative solvers handle real scale.']));
}});

NEW.push({id:'capstone',part:'Part XXI · Numerical & capstone',title:'Capstone: compress an image with the SVD',
 sub:'Put it ALL together. Watch the singular value decomposition throw away detail you can\'t see and rebuild a recognizable image from a fraction of the data.',
render(root){head(root,0,this);
 root.append(p('The finale: real image compression, live — <b>on your own photo</b>. Upload any image (it never leaves your browser) and slide the rank down. The SVD writes the image as a sum of importance-ordered rank-1 layers; keep only the top \\(k\\) and watch how few you need before it still looks like you.'));
 const Lu=lab('Compress YOUR photo with the SVD','✦ Signature','weird');
 Lu.append(svdPhoto());
 root.append(Lu);
 root.append(box('aha-box','you just did real math to a real image','That slider is running an actual singular value decomposition — power iteration finding the top singular vectors, one rank-1 layer at a time — on the pixels of your photo, entirely in your browser. At low rank it stores a tiny fraction of the numbers yet stays recognizable, because the SVD ranks directions by how much they matter. <span class="aha">This is the exact principle inside JPEG-style compression.</span>'));
 root.append(p('Below, the same thing on a built-in pattern, with a per-layer view:'));
 const L=lab('SVD image compression','Play','see');
 // build a small synthetic image and do a crude rank-k reconstruction via power-iteration-free approach:
 const N=24; const img=[]; for(let y=0;y<N;y++){img[y]=[];for(let x=0;x<N;x++){
   let v=120+80*Math.sin(x/3)+60*Math.cos(y/4)+40*Math.sin((x+y)/5); img[y][x]=clamp(v,0,255);}}
 const cv=el('canvas');cv.width=192;cv.height=192;const ctx=VS.hidpi(cv);const cell=192/N;
 // approximate top singular directions by iterated deflation using covariance eigenvectors (2D per step is heavy;
 // instead use a simple SVD via Jacobi on small matrix through LA on A^T A is overkill — do a visual proxy:
 // reconstruct with k DCT-like low-frequency terms to convincingly show "keep top-k".
 function reconstruct(k){
   // crude low-rank proxy: keep k lowest-frequency cosine components per axis
   const out=[];for(let y=0;y<N;y++){out[y]=[];for(let x=0;x<N;x++){
     let v=120; let used=0;
     for(let fy=0;fy<N&&used<k;fy++)for(let fx=0;fx<N&&used<k;fx++){ if(fx+fy>=k) continue;
       // approximate coefficient
     }
     out[y][x]=img[y][x];}}
   return out;
 }
 // Simpler + honest: do a real rank-k using LA.eig on A A^T is too much; use JS SVD-lite via power iteration:
 function svdLowRank(A,k){
   const m=A.length,n=A[0].length; let R=A.map(r=>r.slice()); const layers=[];
   for(let t=0;t<k;t++){
     // power iteration for top singular vector of R
     let v=Array(n).fill(0).map(()=>Math.random());
     for(let it=0;it<40;it++){
       // u = R v
       let u=R.map(row=>row.reduce((s,a,j)=>s+a*v[j],0));
       const un=Math.hypot(...u)||1; u=u.map(x=>x/un);
       // v = R^T u
       let nv=Array(n).fill(0); for(let i=0;i<m;i++)for(let j=0;j<n;j++) nv[j]+=R[i][j]*u[i];
       const nvn=Math.hypot(...nv)||1; v=nv.map(x=>x/nvn);
     }
     let u=R.map(row=>row.reduce((s,a,j)=>s+a*v[j],0));
     const sigma=Math.hypot(...u)||1; u=u.map(x=>x/sigma);
     layers.push({u,v,sigma});
     for(let i=0;i<m;i++)for(let j=0;j<n;j++) R[i][j]-=sigma*u[i]*v[j];
   }
   // reconstruct
   const out=Array.from({length:m},()=>Array(n).fill(0));
   layers.forEach(({u,v,sigma})=>{for(let i=0;i<m;i++)for(let j=0;j<n;j++) out[i][j]+=sigma*u[i]*v[j];});
   return out;
 }
 const nar=narrate('');
 function draw(k){const R=svdLowRank(img,k);
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=clamp(Math.round(R[y][x]),0,255);ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}
   const full=N*N, kept=k*(2*N+1);
   nar.say(`Keeping the top <span class="k">${k}</span> of ${N} layers \u2014 about <b>${Math.round(kept/full*100)}%</b> of the data. ${k<=3?'Blurry, but the big shapes are already there.':k<=8?'Looking good \u2014 most detail with a fraction of the numbers.':'Nearly perfect; the last layers were almost noise.'} <span class="g">That\u2019s lossy compression, powered by the SVD.</span>`);}
 const row=rangeRow({label:'layers kept (rank k)',min:1,max:16,step:1,value:3,onInput:draw});
 L.append(row,stageOf(cv,[]),nar);draw(3);root.append(L);
 root.append(box('aha-box','everything, in one demo','Vectors (pixels), matrices (the image), rank (how many layers), eigen/singular directions (the layers themselves, ordered by importance), projection (each layer is one), and the SVD (the whole factorization). A dozen chapters, running at once, doing something genuinely useful.'));
 root.append(el('div','pull','You started with \u201ca vector is a list of numbers.\u201d You just compressed an image with the singular value decomposition. Same idea, all the way up \u2014 you\u2019ve now seen the whole of linear algebra, and built it with your own hands.'));
 root.append(summary(['SVD writes an image as importance-ordered rank-1 layers.','Keep the top k \u2192 recognizable image from a fraction of the data.','This single demo uses vectors, rank, eigen-directions, projection, SVD.','You have now traversed all of linear algebra.']));
}});

/* append and refresh nav if the app already booted */
NEW.forEach(c=>CHAPTERS.push(c));
if(window.__vsRebuildNav) window.__vsRebuildNav();
})();
