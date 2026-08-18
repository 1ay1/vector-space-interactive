/* 25_sysgeo.js — base course */
'use strict';
(function(){
const cSysGeo={id:'sysgeo',part:'Part VI · Systems',title:'Equations are shapes that must agree',
  sub:'A system of linear equations is a bunch of flat shapes — lines, planes — and “solving” means finding where they all meet. Three outcomes, and you can see all three.',
render(root){
  head(root,0,cSysGeo);
  root.append(p('One linear equation like \\(x+y=3\\) is a <b>line</b> — every point on it satisfies the equation. Two equations = two lines. “Solving the system” means: <b>which point is on both lines at once?</b> Drag the coefficients and watch the three possible fates.'));
  const L=lab('Two lines, one system','See','see');L.append(systemLines());root.append(L);
  root.append(box('aha-box','the three fates of any linear system','<b>Cross once</b> → exactly one solution. <b>Parallel</b> → no solution (the equations contradict). <b>Same line</b> → infinitely many solutions (one equation was redundant). These three are the <em>only</em> possibilities — for 2 lines, 3 planes, or 900-dimensional hyperplanes.'));
  root.append(box('key','two ways to read the same system','<b>Row picture:</b> each equation is a shape; solutions are where shapes meet (what you just saw). <b>Column picture:</b> the same system asks “what combination of these column-vectors builds the target?” — that\'s the span idea from Part II. Two lenses, one truth. We\'ll use both.'));
  root.append(worked({title:'reading a system as columns',
    prompt:'The system \\(2x+y=5,\\; x+3y=6\\) as a column combination.',
    steps:['Write it as \\(x\\begin{bmatrix}2\\\\1\\end{bmatrix}+y\\begin{bmatrix}1\\\\3\\end{bmatrix}=\\begin{bmatrix}5\\\\6\\end{bmatrix}\\).',
      'So: “what amounts \\(x,y\\) of the two column-vectors add up to the target?”',
      'That\'s asking if the target is in the <em>span</em> of the columns.'],
    result:'Solving a system = finding the linear combination of columns that hits the target. Row picture and column picture always agree.'}));
  root.append(quiz({question:'Two lines in a system are parallel but not identical. How many solutions?',
    options:[{t:'None — they never meet, so no point satisfies both',ok:true,why:'Right. Parallel distinct lines = inconsistent system = no solution.'},
      {t:'Infinitely many',ok:false,why:'That\'s the case where they\'re the SAME line. Distinct parallel lines share no point.'}]}));
  root.append(summary(['A linear equation is a flat shape (line/plane/hyperplane).','Solving = where all the shapes meet.','Exactly three fates: one / none / infinitely many solutions.','Row picture (shapes meet) = column picture (span a target).']));
}};

register(cSysGeo);
})();
