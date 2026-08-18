/* 44_finale.js — base course */
'use strict';
(function(){
const cFinale={id:'finale',part:'Part XII · Applications',title:'The whole map, and where to go',
  sub:'You\'ve crossed the entire landscape of linear algebra. Here it is on one page — every big idea and how they connect.',
render(root){
  head(root,0,cFinale);
  root.append(el('div','pull','From “a vector is a list of numbers” to the SVD and PageRank — it was all one idea, growing. You didn\'t memorize linear algebra. You built it.'));
  root.append(box('key','the entire subject, connected',`
    <b>Vectors</b> = lists of numbers = points in a space of possibilities.<br>
    <b>Two moves</b> (add, scale) → <b>linear combinations</b> → <b>span</b>, <b>independence</b>, <b>basis</b>, <b>dimension</b>.<br>
    <b>Geometry</b>: length, dot product, angle, <b>projection</b>, orthogonality.<br>
    <b>Matrices</b> = transforms (verbs); multiply = compose; <b>inverse</b> = undo.<br>
    <b>Systems</b>: elimination → rank → how many solutions.<br>
    <b>Determinant</b> = area/volume factor; 0 = collapsed = singular.<br>
    <b>Eigenvectors</b> = un-rotated directions → <b>diagonalization</b>, powers, <b>PageRank</b>, <b>PCA</b>.<br>
    <b>SVD</b> = rotate–stretch–rotate for <em>any</em> matrix → compression, recommendations, search.`));
  root.append(h3('The threads that tie it together'));
  root.append(el('ul',null,`
    <li><b>Independence</b> shows up as: span not collapsing, det ≠ 0, full rank, invertible, unique solutions — all the <em>same</em> fact wearing different clothes.</li>
    <li><b>Projection</b> shows up as: shadows, least squares, regression, Gram–Schmidt, PCA — always “closest point, perpendicular error.”</li>
    <li><b>Eigenvectors</b> show up as: stable directions, long-run behaviour, PageRank, PCA axes, SVD — “where the transform is just scaling.”</li>`));
  root.append(box('aha-box','where to go from here','You\'re now equipped for: <b>machine learning</b> (it\'s matrices + gradients), <b>quantum mechanics</b> (vectors in complex spaces), <b>signal processing</b> (Fourier = a change of basis), <b>optimization</b>, <b>graphics</b>, and <b>data science</b>. Every one of them is this toolkit, specialized. You have the foundation the whole technical world is built on.'));
  root.append(el('div','pull','space = possibilities · point = one possibility · vector = a change · matrix = a transform · eigenvector = a direction it leaves alone. Carry these, and nothing in linear algebra can surprise you again.'));
}};

register(cFinale);
})();
