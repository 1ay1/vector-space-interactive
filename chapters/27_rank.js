/* 27_rank.js — base course */
'use strict';
(function(){
const cRank={id:'rank',part:'Part VI · Systems',title:'Rank, pivots & how many solutions',
  sub:'The number of pivots after elimination — the rank — tells you everything: whether a solution exists, and whether it\'s unique. One number, the whole story.',
render(root){
  head(root,0,cRank);
  root.append(p('After elimination, count the <b>pivots</b> (leading 1s). That count is the <span class="term">rank</span> — the number of genuinely independent equations (or independent columns). Rank is the deepest single number attached to a matrix.'));
  root.append(box('key','the rule that decides everything',`For a system with \\(n\\) unknowns:<br>
    • <b>rank = n</b>, and consistent → <span style="color:var(--accentc)">exactly one solution</span> (every variable pinned).<br>
    • <b>rank &lt; n</b>, and consistent → <span style="color:var(--accentd)">infinitely many</span> (free variables roam).<br>
    • a pivot in the “=” column (like \\(0=1\\)) → <span style="color:var(--accent)">no solution</span> (contradiction).`));
  root.append(h3('Free variables = the shape of the solution set'));
  root.append(p('If rank &lt; number of unknowns, the leftover unknowns are <b>free</b> — you can set them to anything and the rest follow. Each free variable adds a dimension to the solution set: one free variable → the solutions form a line; two → a plane; and so on.'));
  root.append(worked({title:'find the rank by elimination',
    prompt:'Find the rank of \\(\\begin{bmatrix}1&2&3\\\\2&4&6\\\\1&1&1\\end{bmatrix}\\).',
    steps:[
      'Row 2 is exactly \\(2\\times\\)row 1, so \\(R_2\\to R_2-2R_1\\) makes it all zeros.',
      'Clear row 3: \\(R_3\\to R_3-R_1 = (0,-1,-2)\\). Now the matrix is \\(\\begin{bmatrix}1&2&3\\\\0&0&0\\\\0&-1&-2\\end{bmatrix}\\).',
      'Swap to get the staircase: two nonzero rows remain — two pivots.'],
    result:'Rank = 2. One row was redundant (row 2 = 2·row 1), so only 2 of the 3 rows are independent. The rank counts the genuinely independent rows — which always equals the number of independent columns.'}));
  root.append(worked({title:'counting solutions from rank',
    prompt:'A system has 4 unknowns. Elimination gives 2 pivots and no contradiction. Describe the solutions.',
    steps:['Rank = 2 (two pivots), unknowns = 4.',
      'Free variables = \\(4 - 2 = 2\\).',
      'Consistent + 2 free variables → a 2-dimensional sheet of solutions.'],
    result:'Infinitely many solutions, forming a 2D plane inside 4D space. Rank told us instantly.'}));
  root.append(box('aha-box','rank is independence, counted','Rank = how many rows are truly independent = how many columns are truly independent (these are always equal!). It\'s the “true size” of what the matrix does — the same idea as dimension from Part II, now computable by elimination.'));
  root.append(box('key','the surprise: row rank = column rank','It\'s genuinely startling that the number of independent <em>rows</em> always equals the number of independent <em>columns</em> — rows and columns look unrelated! Here\'s the intuition: elimination on rows produces the same number of pivots whether you read them as “independent rows” or “pivot columns.” Deeper reason (Part XI): the SVD gives \\(A=U\\Sigma V^{T}\\), and the count of nonzero singular values in \\(\\Sigma\\) <em>is</em> the rank — a single number that doesn\'t care about rows vs columns. This is why \\(\\text{rank}(A)=\\text{rank}(A^{T})\\).'));
  root.append(quiz({question:'A consistent system has 5 unknowns and rank 5. How many solutions?',
    options:[{t:'Exactly one',ok:true,why:'rank = number of unknowns and consistent → unique solution. No free variables.'},
      {t:'Infinitely many',ok:false,why:'That needs rank < unknowns. Here rank = 5 = unknowns, so every variable is pinned.'}]}));
  root.append(box('connect','connects to','Rank is the master number: it decides <a onclick="vsGoTo(\'inverse\')">invertibility</a> (full rank ⇔ invertible), splits space into the <a onclick="vsGoTo(\'fourspaces\')">four fundamental subspaces</a>, obeys <a onclick="vsGoTo(\'ranknullity\')">rank + nullity = n</a>, and equals the count of nonzero <a onclick="vsGoTo(\'svd\')">singular values</a>.'));
  root.append(summary(['Rank = number of pivots = independent equations/columns.','rank = unknowns (consistent) → unique solution.','rank < unknowns (consistent) → free variables → infinite solutions.','Contradiction row (0 = nonzero) → no solution.']));
}};

register(cRank);
})();
