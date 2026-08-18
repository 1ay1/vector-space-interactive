/* 18_proj.js — base course */
'use strict';
(function(){
const cProj={id:'proj',part:'Part III · Geometry',title:'Projection — a vector\'s shadow',
  sub:'Drop a vector\'s shadow onto a direction. This "how much of me points that way?" is how you decompose anything into parts.',
render(root){
  head(root,14,cProj);
  root.append(p('The <span class="term">projection</span> of v onto a direction is v\'s shadow on that direction — "how much of v points that way." Drag v; the teal shadow follows, and its length is exactly the dot product with the (unit) blue direction.'));
  const nar=narrate('Drag v.');const board=projectionBoard({nar});
  const L=lab('Cast a shadow','See','see');L.append(stageOf(board,[]),nar);root.append(L);
  root.append(math('\\text{proj}_{\\mathbf u}\\mathbf v=(\\mathbf v\\cdot\\hat{\\mathbf u})\\,\\hat{\\mathbf u}'));
  root.append(box('aha-box','why projection is everywhere','Splitting a vector into "along this direction" + "the rest" is how you separate signal from noise, compress data, fit lines to data (least squares), and re-express a vector in a new basis. Every ruler-reading in Chapter 11 is a projection.'));
  root.append(worked({title:'project one vector onto another',
    prompt:'How much of \\(\\mathbf b=(4,2)\\) points along \\(\\mathbf a=(3,0)\\)? Find the projection.',
    steps:[
      'Scalar amount: \\(t = \\dfrac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a} = \\dfrac{3\\cdot4+0\\cdot2}{3\\cdot3+0\\cdot0} = \\dfrac{12}{9} = \\tfrac{4}{3}\\).',
      'Projection vector: \\(t\\,\\mathbf a = \\tfrac{4}{3}(3,0) = (4,0)\\).',
      'Sanity check: the leftover \\(\\mathbf b - (4,0) = (0,2)\\) is perpendicular to \\(\\mathbf a=(3,0)\\) — dot product 0. ✓'],
    result:'The shadow of \\((4,2)\\) on the x-axis direction is \\((4,0)\\) — exactly the x-part, as expected. Always sanity-check by confirming the leftover is perpendicular.'}));
  const Lp=lab('Practice: scalar projection','Practice','');
  Lp.append(p('Find \\(t=(a\\cdot b)/(a\\cdot a)\\), the amount of a in b\'s shadow.'));
  Lp.append(practiceSet(['projscalar','dot'],4));
  root.append(Lp);
  root.append(box('connect','connects to','“Closest point + perpendicular error” is one idea reused constantly: it becomes <a onclick="vsGoTo(\'lsq\')">least squares</a> (fit a line to data), <a onclick="vsGoTo(\'gramschmidt\')">Gram–Schmidt</a> (subtract projections to orthogonalize), <a onclick="vsGoTo(\'pca\')">PCA</a> (project onto the top directions), and every “residual” in statistics.'));
  root.append(summary(['Projection = shadow of v on a direction.','Its length = dot product with the unit direction.','Sanity check: the leftover (v − projection) is perpendicular.','Decomposing into parts underlies compression, denoising, and fitting.']));
}};

register(cProj);
})();
