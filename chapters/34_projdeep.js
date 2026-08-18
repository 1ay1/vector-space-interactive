/* 34_projdeep.js — base course */
'use strict';
(function(){
const cProjDeep={id:'projdeep',part:'Part X · Orthogonality',title:'Projection onto a subspace',
  sub:'The shadow idea, leveled up: drop any vector onto a whole subspace to get the closest point in it. This single move powers data fitting, compression, and graphics.',
render(root){
  head(root,0,cProjDeep);
  root.append(p('Given a vector \\(\\mathbf b\\) and a subspace (a line, a plane…), the <span class="term">projection</span> is the point <em>in</em> the subspace closest to \\(\\mathbf b\\). The error — what\'s left over — is always <b>perpendicular</b> to the subspace. That perpendicularity is the whole trick.'));
  root.append(math('\\text{proj}_{\\mathbf a}\\mathbf b = \\frac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\,\\mathbf a'));
  root.append(worked({title:'deriving the projection formula',
    prompt:'Find the point on the line through \\(\\mathbf a\\) closest to \\(\\mathbf b\\). Call it \\(t\\mathbf a\\) — we just need the right scalar \\(t\\).',
    steps:[
      'The error is \\(\\mathbf b - t\\mathbf a\\). “Closest” means this error is <em>perpendicular</em> to the line — perpendicular to \\(\\mathbf a\\).',
      'Perpendicular means dot product zero: \\(\\mathbf a\\cdot(\\mathbf b - t\\mathbf a) = 0\\).',
      'Expand: \\(\\mathbf a\\cdot\\mathbf b - t\\,(\\mathbf a\\cdot\\mathbf a) = 0\\), so \\(t = \\dfrac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\).'],
    result:'The projection is \\(t\\mathbf a = \\dfrac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\mathbf a\\). The whole formula falls out of one idea: <b>the error must be perpendicular.</b> Nothing memorized.'}));
  const nar=narrate('Drag b.');const board=projectionBoard({nar});
  const L=lab('Closest point in the subspace','See','see');L.append(stageOf(board,[]),nar);root.append(L);
  root.append(box('aha-box','why “perpendicular error” is everything','The closest point is found by making the leftover error perpendicular to the subspace. Set the error\'s dot product with the subspace to zero and you get the <b>normal equations</b> — the formula behind every least-squares fit. Perpendicular = optimal.'));
  root.append(summary(['Projection = closest point in a subspace to a given vector.','The error (b − projection) is perpendicular to the subspace.','“Perpendicular error” gives the normal equations = least squares.']));
}};

register(cProjDeep);
})();
