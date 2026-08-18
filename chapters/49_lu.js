/* 49_lu.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'lu',part:'Part XV · More decompositions',title:'LU \u2014 elimination, saved for reuse',
 sub:'Factoring A = LU records Gaussian elimination once so you can solve Ax=b for many different b almost instantly. The engine under every numerical solver.',
render(root){head(root,0,this);
 root.append(p('Gaussian elimination (Part VI) turns \\(A\\) into an upper-triangular \\(U\\). If you also record the multipliers you used in a lower-triangular \\(L\\), you get \\(A = LU\\) \u2014 the same work, now <em>reusable</em>. Factor a matrix and watch L and U build:'));
 const L=lab('Factor A = LU','Play');L.append(luStepper());root.append(L);
 root.append(box('aha-box','why factor at all','To solve \(Ax=b\) you\'d redo elimination every time. But once \(A=LU\), solving is two quick triangular sweeps: \(Ly=b\) then \(Ux=y\). Change \(b\) a thousand times (same \(A\)) and each new solve is nearly free. This is how real solvers work.'));
 root.append(worked({title:'factor a 2×2 and solve with it',
   prompt:'Factor \(A=\begin{bmatrix}2&1\\6&8\end{bmatrix}\), then solve \(A\mathbf x=\begin{bmatrix}5\\26\end{bmatrix}\).',
   steps:[
     'Eliminate below the first pivot: \(R_2 \to R_2 - 3R_1\) (multiplier 3). This gives \(U=\begin{bmatrix}2&1\\0&5\end{bmatrix}\), and the multiplier goes into \(L\): \(L=\begin{bmatrix}1&0\\3&1\end{bmatrix}\).',
     'Forward sweep \(L\mathbf y=b\): \(y_1=5\), then \(3y_1+y_2=26\Rightarrow y_2=11\).',
     'Back sweep \(U\mathbf x=y\): \(5x_2=11\Rightarrow x_2=2.2\), then \(2x_1+x_2=5\Rightarrow x_1=1.4\).'],
   result:'\(\mathbf x=(1.4,\,2.2)\). Note: to solve a <em>different</em> \(b\) you reuse the SAME \(L,U\) — just redo the two cheap sweeps, no re-elimination. That reuse is the entire point of factoring.'}));
 root.append(box('key','the decomposition family','LU (general), <b>Cholesky</b> (\(A=LL^{T}\), for symmetric positive-definite — twice as fast), QR (orthogonal, stable for least squares), and SVD (universal). Each trades generality for speed or stability. Choosing the right factorization is most of numerical linear algebra.'));
 root.append(summary(['A = LU records elimination as reusable triangular factors.','Solve via Ly=b then Ux=y \u2014 cheap for many right-hand sides.','Cholesky is the fast LU for symmetric positive-definite A.','Factorization choice = the craft of numerical LA.']));
}});

/* ============================================================ XVI — QUADRATIC FORMS */
})();
