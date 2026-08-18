/* 19_ortho.js — base course */
'use strict';
(function(){
const cOrtho={id:'ortho',part:'Part III · Geometry',title:'Orthogonality — perfect independence',
  sub:'Perpendicular vectors share nothing. They make the cleanest possible rulers — and in high dimensions, they\'re almost the only kind there is.',
render(root){
  head(root,15,cOrtho);
  root.append(p('Two vectors are <span class="term">orthogonal</span> (perpendicular) when their dot product is 0. Orthogonal rulers are ideal: each measures a totally separate thing, with zero overlap. The x and y axes are orthogonal; so are the "wavy patterns" JPEG uses.'));
  root.append(box('aha-box','a teaser for the weirdness ahead','In 2D it takes effort to find perpendicular vectors. In 1000 dimensions, <em>almost every random pair is already nearly perpendicular</em> — which turns out to be the reason AI embeddings work. We\'ll feel that in Part IV.'));
  root.append(h3('The payoff: coordinates become free'));
  root.append(p('In a general basis, finding a vector\'s coordinates means <em>solving a system</em>. In an <b>orthonormal</b> basis it collapses to a dot product — no solving at all.'));
  root.append(worked({title:'coordinates in an orthonormal basis',
    prompt:'The rotated axes \\(\\mathbf u_1=(\\tfrac{3}{5},\\tfrac{4}{5})\\), \\(\\mathbf u_2=(-\\tfrac{4}{5},\\tfrac{3}{5})\\) are orthonormal. Find the coordinates of \\(\\mathbf v=(5,0)\\).',
    steps:[
      'Check they\'re orthonormal: each has length 1, and \\(\\mathbf u_1\\cdot\\mathbf u_2 = -\\tfrac{12}{25}+\\tfrac{12}{25}=0\\). ✓',
      'Coordinate 1 = \\(\\mathbf v\\cdot\\mathbf u_1 = 5\\cdot\\tfrac{3}{5}+0 = 3\\).',
      'Coordinate 2 = \\(\\mathbf v\\cdot\\mathbf u_2 = 5\\cdot(-\\tfrac{4}{5})+0 = -4\\).'],
    result:'\\(\\mathbf v = 3\\mathbf u_1 - 4\\mathbf u_2\\) — no system to solve, just two dot products. That is the entire reason orthonormal bases (and Gram–Schmidt, and the SVD) are the cleanest tools in the subject.'}));
  root.append(quiz({question:'Why are orthogonal rulers especially nice?',
    options:[{t:'Each measures a completely separate thing — no overlap, no double-counting',ok:true,why:'Right. Orthogonal bases make coordinates trivial to compute (just project) and keep dimensions from interfering.'},
      {t:'They\'re longer',ok:false,why:'Length isn\'t the point — it\'s the zero overlap (perpendicularity) that makes them clean.'}]}));
  root.append(summary(['Orthogonal = perpendicular = dot product 0.','Orthogonal rulers measure independent things with no overlap.','High-D is full of near-orthogonal directions (next part).']));
}};

/* ============================================================
   PART IV — THE LEAP
   ============================================================ */

register(cOrtho);
})();
