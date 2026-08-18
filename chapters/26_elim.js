/* 26_elim.js — base course */
'use strict';
(function(){
const cElim={id:'elim',part:'Part VI · Systems',title:'Gaussian elimination, step by step',
  sub:'The universal algorithm to solve ANY linear system: use three legal row moves to grind the matrix into a form where the answer is obvious. Watch every step.',
render(root){
  head(root,0,cElim);
  root.append(p('You can do three things to the rows of a system without changing its solutions: <b>swap</b> two rows, <b>scale</b> a row by a nonzero number, and <b>add a multiple</b> of one row to another. Applied cleverly, they reduce any matrix to <span class="term">reduced row echelon form</span> (RREF), where you can read off the solution. Run it and step through:'));
  const L=lab('Elimination, one move at a time','Play');
  L.append(rrefStepper({rows:3,cols:4,values:[[1,2,1,2],[2,1,-1,1],[1,-1,2,3]]}));
  root.append(L);
  root.append(h3('Now you drive'));
  root.append(p('Watching isn\'t doing. Below, <b>you</b> choose the row operations — scale, add, swap — and reach reduced row echelon form yourself. Stuck? Hit “hint” for the next move. This is where the procedure becomes muscle memory.'));
  const Ld=lab('Reach RREF yourself','Play');
  Ld.append(rowOpSolver({matrix:[[2,4,-2,2],[1,3,1,5]]}));
  root.append(Ld);
  root.append(box('aha-box','why the three moves are “legal”','Each move is <em>reversible</em> and preserves the solution set — swapping the order of equations, rescaling one, or adding one equation to another never changes which points satisfy them all. So the final, simple system has the <em>same</em> answers as the scary original.'));
  root.append(box('key','echelon vs reduced echelon','<b>Echelon form:</b> a staircase of leading entries, zeros below. <b>Reduced (RREF):</b> also zeros <em>above</em> each leading 1, and each leading entry is 1. RREF is unique — the canonical fingerprint of the matrix.'));
  root.append(h3('A full solve, start to finish'));
  root.append(p('Elimination gets you to a staircase; then <b>back-substitution</b> reads off the answer from the bottom up. Here\'s the whole round trip on a 3-variable system.'));
  root.append(worked({title:'solve a 3×3 system completely',
    prompt:'Solve \\(x+y+z=6,\\; 2y+5z=-4,\\; 2x+5y-z=27\\).',
    steps:[
      'Eliminate \\(x\\) from equation 3: subtract 2×(eq 1) → \\(3y-3z=15\\), i.e. \\(y-z=5\\).',
      'Now equations are \\(x+y+z=6\\), \\(2y+5z=-4\\), \\(y-z=5\\). Eliminate \\(y\\): from eq 2 minus 2×(eq 3): \\(7z=-14\\Rightarrow z=-2\\).',
      'Back-substitute \\(z=-2\\) into \\(y-z=5\\): \\(y=3\\).',
      'Back-substitute into eq 1: \\(x+3-2=6\\Rightarrow x=5\\).'],
    result:'\\((x,y,z)=(5,3,-2)\\). Forward elimination makes the staircase; back-substitution climbs it. Check by plugging back in — all three equations hold.'}));
  const Lp=lab('Practice: solve 2×2 systems','Practice','');
  Lp.append(p('Each has a whole-number solution. Give x and y.'));
  Lp.append(practiceSet(['solve2'],4));
  root.append(Lp);
  root.append(quiz({question:'Which row operation is NOT allowed (would change the solutions)?',
    options:[{t:'Multiply a row by 0',ok:true,why:'Correct — that\'s forbidden. Scaling by 0 destroys the equation (0=0) and loses information. You may scale only by NONzero numbers.'},
      {t:'Swap two rows',ok:false,why:'Swapping is fine — order of equations doesn\'t matter.'},
      {t:'Add 3× row 1 to row 2',ok:false,why:'Allowed — adding a multiple of one row to another preserves solutions.'}]}));
  root.append(summary(['Three legal moves: swap, scale (by nonzero), add-a-multiple.','They preserve the solution set, so simplify freely.','Goal: reduced row echelon form (RREF) — answer readable, and unique.']));
}};

register(cElim);
})();
