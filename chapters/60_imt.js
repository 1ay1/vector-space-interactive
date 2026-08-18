/* 60_imt.js — mastery track */
'use strict';
(function(){
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
register(cIMT, {after:"diag"});
})();
