/* 31_det.js — base course */
'use strict';
(function(){
const cDet={id:'det',part:'Part VIII · Determinants',title:'The determinant is an area factor',
  sub:'One number that captures what a matrix does to size and orientation. Zero means “collapsed a dimension.” Watch the unit square deform.',
render(root){
  head(root,0,cDet);
  root.append(p('Every 2×2 matrix turns the unit square into a parallelogram. The <span class="term">determinant</span> is <b>the area of that parallelogram</b> (with a sign for orientation). Slide the entries and watch area = det.'));
  const L=lab('det = how area scales','See','see');L.append(detArea());root.append(L);
  root.append(box('aha-box','what the number means','<b>|det| = 2</b> → the transform doubles areas. <b>det &lt; 0</b> → space was flipped (mirrored). <b>det = 0</b> → the square was squashed to a line: a whole dimension collapsed — which is exactly why det=0 means <em>not invertible</em> (Part VI). In 3D it\'s a volume factor; in n-D, an n-volume factor.'));
  root.append(h3('Why is the area exactly ad − bc?'));
  root.append(p('The formula shouldn\'t be memorized blind. Here\'s where \(ad-bc\) comes from — it\'s literally the area of the parallelogram spanned by the two columns.'));
  root.append(worked({title:'deriving the parallelogram area',
    prompt:'The columns \\((a,c)\\) and \\((b,d)\\) span a parallelogram. Find its area.',
    steps:[
      'Enclose it in an \\((a+b)\\times(c+d)\\) bounding rectangle, area \\((a+b)(c+d)=ac+ad+bc+bd\\).',
      'Subtract the bits outside the parallelogram: two triangles of area \\(\\tfrac12 ac\\), two of area \\(\\tfrac12 bd\\), and two rectangles of area \\(bc\\).',
      'Total removed: \\(ac + bd + 2bc\\).',
      'Area \\(= (ac+ad+bc+bd) - (ac+bd+2bc) = ad - bc\\).'],
    result:'The determinant \\(ad-bc\\) IS the parallelogram area — derived, not decreed. The sign tracks orientation: swap the two columns and area → \\(bc-ad\\), the negative.'}));
  root.append(worked({title:'2×2 determinant by hand',
    prompt:'Find \\(\\det\\begin{bmatrix}3&1\\\\2&4\\end{bmatrix}\\).',
    steps:['For \\(\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\), the determinant is \\(ad-bc\\).',
      'Here \\(a=3,b=1,c=2,d=4\\): \\(3\\cdot4 - 1\\cdot2\\).',
      '\\(12 - 2 = 10\\).'],
    result:'det = 10 — this matrix scales every area by 10 and keeps orientation.'}));
  root.append(box('key','the properties worth remembering','\\(\\det(AB)=\\det(A)\\det(B)\\) (areas multiply when you compose). \\(\\det(A^{T})=\\det(A)\\). \\(\\det(A^{-1})=1/\\det(A)\\). Swapping two rows flips the sign. A repeated row makes det = 0.'));
  root.append(box('aha-box','why det(AB) = det(A)·det(B)','It has to be true, geometrically. Apply \\(B\\), then \\(A\\). \\(B\\) scales every area by \\(\\det B\\); then \\(A\\) scales <em>that</em> by \\(\\det A\\). Scaling twice multiplies the factors, so the combined map \\(AB\\) scales area by \\(\\det A\\cdot\\det B\\). And since \\(A A^{-1}=I\\) (area factor 1), \\(\\det A\\cdot\\det A^{-1}=1\\) — which is exactly why \\(\\det A^{-1}=1/\\det A\\), and why \\(\\det A=0\\) can\'t be inverted (you can\'t scale zero area back up to 1).'));
  root.append(h3('Bigger matrices: cofactor expansion'));
  root.append(p('For 3×3 and up, break the determinant into smaller ones. Pick a row, and for each entry multiply it by the determinant of the little matrix left when you delete that entry\'s row and column — with a checkerboard of signs \\(+\,-\,+\).'));
  root.append(worked({title:'a 3×3 determinant by cofactors',
    prompt:'Find \\(\\det\\begin{bmatrix}2&1&0\\\\1&3&1\\\\0&2&2\\end{bmatrix}\\), expanding along the top row.',
    steps:[
      'Entry 2 (sign +): delete its row & column, leaving \\(\\begin{bmatrix}3&1\\\\2&2\\end{bmatrix}\\), det \\(=6-2=4\\). Contribution \\(+2\\cdot4=8\\).',
      'Entry 1 (sign −): leftover \\(\\begin{bmatrix}1&1\\\\0&2\\end{bmatrix}\\), det \\(=2\\). Contribution \\(-1\\cdot2=-2\\).',
      'Entry 0 (sign +): contributes \\(0\\).',
      'Add: \\(8-2+0=6\\).'],
    result:'det = 6. The 3×3 became three 2×2s. The same recipe (with alternating signs) handles any size — though for big matrices, elimination is far faster.'}));
  root.append(box('trap','common mistake: forgetting the signs','The cofactor signs alternate \\(+\,-\,+\,-\dots\) across the row — the middle term is <em>subtracted</em>. Forgetting that flips your answer. And you can expand along <em>any</em> row or column: pick the one with the most zeros to save work.'));
  root.append(h3('Do the cofactor expansion yourself'));
  root.append(p('Type each 2×2 minor, then combine them with the \\(+\,-\,+\) signs to get the total. Each box checks itself.'));
  const Lc=lab('Guided 3×3 determinant','Play');
  Lc.append(cofactorBuilder({A:[[2,1,0],[1,3,1],[0,2,2]]}));
  root.append(Lc);
  const Lp=lab('Practice: determinants','Practice','');
  Lp.append(p('Mixed 2×2 and 3×3 determinants. Type the number.'));
  Lp.append(practiceSet(['det2','det3','trace'],5));
  root.append(Lp);
  root.append(quiz({question:'A 3×3 matrix has determinant 0. What did it do to 3D space?',
    options:[{t:'Squashed it into a plane or line — volume became 0, so it\'s not invertible',ok:true,why:'Exactly. det=0 means a collapsed dimension: the output is flat, information is lost, no inverse exists.'},
      {t:'Doubled every volume',ok:false,why:'That would be det=2. Zero means the volume collapsed to nothing.'}]}));
  root.append(box('connect','connects to','\\(\\det=0\\) isn\'t a lone fact — it\'s one face of a single idea. It means the matrix has no <a onclick="vsGoTo(\'inverse\')">inverse</a>, has <a onclick="vsGoTo(\'rank\')">rank</a> below full, and has <b>0</b> as an <a onclick="vsGoTo(\'eigen\')">eigenvalue</a>. See them move together in the <a onclick="vsGoTo(\'matrixlab\')">Matrix Lab</a> and unified in the <a onclick="vsGoTo(\'imt\')">Invertible Matrix Theorem</a>.'));
  root.append(summary(['det = signed area/volume scale factor of the transform.','det < 0 = orientation flipped; det = 0 = dimension collapsed.','det(AB)=det(A)det(B); det=0 ⇔ singular ⇔ no inverse.']));
}};

/* ============================================================
   PART IX — EIGENVALUES & EIGENVECTORS
   ============================================================ */

register(cDet);
})();
