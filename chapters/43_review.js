/* 43_review.js — base course */
'use strict';
(function(){
const cReview={id:'review',part:'Part V · Payoff',title:'You made it — the whole subject, and a review',
  sub:'Everything, compressed. Then a quick self-test to prove it stuck, and a glossary to keep.',
render(root){
  head(root,23,cReview);
  root.append(el('div','pull','You no longer believe in a magic room you can\'t enter. You just see a longer list. That\'s internalized. That\'s the whole thing.'));
  root.append(box('key','the entire course in four lines',`
    <b>• a vector</b> = a list of numbers (equivalently: arrow, knobs, point)<br>
    <b>• two moves</b> = add (line by line) and scale (every line by one number)<br>
    <b>• geometry</b> = length is √(sum of squares); direction/similarity is the dot product<br>
    <b>• dimension</b> = how many <em>independent</em> numbers — can be 2, 900, or ∞ without changing a thing`));
  root.append(h3('Prove it stuck'));
  root.append(quiz({question:'(2, 0, 5, 1) + (3, 4, 1, 1) = ?',options:[
    {t:'(5, 4, 6, 2)',ok:true,why:'Line by line. You just did 4-D addition without a picture.'},
    {t:'(5, 4, 6, 1)',ok:false,why:'Last line: 1+1=2, not 1.'}]}));
  root.append(quiz({question:'A 1000-dimensional vector is best thought of as…',options:[
    {t:'a list of 1000 numbers you operate on',ok:true,why:'Yes. Not a shape to visualise — a list to compute with.'},
    {t:'an arrow in a room you must imagine',ok:false,why:'No arrow survives past 3D, and you never needed one.'}]}));
  root.append(quiz({question:'Two random vectors in very high dimensions are almost always…',options:[
    {t:'nearly perpendicular',ok:true,why:'The concentration effect — and the reason embeddings can pack so much meaning.'},
    {t:'nearly parallel',ok:false,why:'The opposite — they crowd toward 90°, not 0°.'}]}));
  root.append(h3('The formula card — keep this'));
  root.append(box('key','every core formula in one place',`
    <b>length</b> \\(\\;\\lVert\\mathbf v\\rVert=\\sqrt{v_1^2+\\dots+v_n^2}\\) &nbsp;·&nbsp; <b>distance</b> \\(\\;\\lVert\\mathbf a-\\mathbf b\\rVert\\)<br>
    <b>dot</b> \\(\\;\\mathbf a\\cdot\\mathbf b=\\textstyle\\sum a_ib_i=\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\cos\\theta\\)<br>
    <b>projection</b> \\(\\;\\dfrac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\,\\mathbf a\\)<br>
    <b>2×2 det</b> \\(\\;ad-bc\\) (signed area) &nbsp;·&nbsp; <b>2×2 inverse</b> \\(\\;\\dfrac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}\\)<br>
    <b>eigen</b> \\(\\;A\\mathbf v=\\lambda\\mathbf v\\) via \\(\\det(A-\\lambda I)=0\\)<br>
    <b>diagonalize</b> \\(\\;A=PDP^{-1}\\Rightarrow A^{k}=PD^{k}P^{-1}\\) &nbsp;·&nbsp; <b>trace</b>=Σλ, <b>det</b>=Πλ<br>
    <b>rank–nullity</b> \\(\\;\\text{rank}+\\text{nullity}=n\\) &nbsp;·&nbsp; <b>least squares</b> \\(\\;A^{T}A\\hat x=A^{T}b\\)<br>
    <b>SVD</b> \\(\\;A=U\\Sigma V^{T}\\) (every matrix)`));
  root.append(h3('Glossary to keep'));
  const terms=[['vector','a list of numbers you can add and scale'],['dimension','how many independent numbers in the list'],
    ['linear combination','scale some vectors, then add — a "smoothie"'],['span','every point reachable by scaling & adding some vectors'],
    ['independent','not reachable from the others; a genuinely new direction'],['basis','a smallest set of rulers (independent + spanning)'],
    ['norm / length','√(sum of squares)'],['dot product','multiply matching numbers & sum; sign = agree/perp/clash'],
    ['orthogonal','perpendicular; dot product 0'],['vector space','anything you can add & scale that obeys the 7 promises']];
  const g=el('div','glossary');terms.forEach(([t,d])=>{const it=el('div','gitem');it.innerHTML=`<b>${t}</b> — ${d}`;g.append(it);});
  root.append(g);
  root.append(box('aha-box','where to go next','You\'ve met matrices (verbs that move whole spaces). Next come <b>eigenvectors</b> (the special directions a matrix only stretches, never turns), <b>PCA</b> (finding the few directions your data actually uses), and the linear algebra inside every neural network. It\'s all this — lists, two moves, geometry, transformations — just stacked. Go forth and out-list the universe.'));
}};

/* ============================================================
   PART VI — SYSTEMS OF EQUATIONS
   ============================================================ */

register(cReview);
})();
