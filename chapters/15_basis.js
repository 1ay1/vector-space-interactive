/* 15_basis.js — base course */
'use strict';
(function(){
const cBasis={id:'basis',part:'Part II · Structure',title:'Basis & coordinates — the numbers were a choice',
  sub:'A vector\'s numbers depend on which rulers you measure with. Change rulers, the numbers change — but the vector doesn\'t move.',
render(root){
  head(root,11,cBasis);
  root.append(p('When you write <code>(3, 2)</code> you secretly mean "3 of the right-ruler + 2 of the up-ruler." Those rulers are your <span class="term">basis</span>. Pick <em>different</em> rulers and the same point gets different numbers. Drag the point and read it two ways.'));
  const nar=narrate('');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'p'}],snap:true,
    extra:(ctx,toPx)=>{const[ox,oy]=toPx(0,0),[e1x,e1y]=toPx(1,0),[e2x,e2y]=toPx(0,1),[d1x,d1y]=toPx(1,1),[d2x,d2y]=toPx(-1,1);
      ctx.strokeStyle=C.accentb;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(e1x,e1y);ctx.moveTo(ox,oy);ctx.lineTo(e2x,e2y);ctx.stroke();
      ctx.strokeStyle=C.accentd;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(d1x,d1y);ctx.moveTo(ox,oy);ctx.lineTo(d2x,d2y);ctx.stroke();},
    onChange:a=>{const v=a[0];const c1=(v.x+v.y)/2,c2=(v.y-v.x)/2;
      nar.say(`Same arrow, two readings:<br>• <span style="color:var(--accentb);font-weight:700">standard rulers</span>: (${fmt(v.x)}, ${fmt(v.y)})<br>• <span style="color:var(--accentd);font-weight:700">diagonal rulers</span>: (${fmt(c1)}, ${fmt(c2)}). <span class="g">The point never moved — only the numbers.</span>`);}});
  const L=lab('One point, two sets of rulers','See','see');L.append(stageOf(board,[]),nar);root.append(L);
  root.append(box('aha-box','thing vs shadow','A vector is the underlying <em>thing</em>; its list of numbers is only its <em>shadow</em> in the rulers you chose. "Why did my numbers change?!" always has the same answer: you changed rulers.'));
  root.append(box('key','why re-choose rulers','Clever rulers make hard problems easy. <b>JPEG</b> re-describes your photo in "wavy pattern" rulers where most numbers become ~0 and can be dropped — that\'s compression. <b>Noise-cancelling</b> picks rulers where "engine drone" is one number, then zeroes it.'));
  root.append(quiz({question:'You re-describe a vector in a new basis; all its numbers change. Did the vector change?',
    options:[{t:'No — only its coordinates (its shadow) changed',ok:true,why:'Exactly. The vector is basis-independent; the numbers are how you read it in chosen rulers.'},
      {t:'Yes — new numbers, new vector',ok:false,why:'The classic trap. The point stayed put; you changed the measuring rulers.'}]}));
  root.append(h3('Actually computing new coordinates'));
  root.append(p('“Change of basis” isn\'t vague — it\'s a concrete calculation, and it\'s just solving a system (Part VI again).'));
  root.append(worked({title:'re-express (4, 2) in a new basis',
    prompt:'New rulers are \\(\\mathbf b_1=(1,1)\\) and \\(\\mathbf b_2=(1,-1)\\). Find the coordinates of \\((4,2)\\) in this basis.',
    steps:[
      'We need \\(c_1(1,1)+c_2(1,-1)=(4,2)\\).',
      'Component equations: \\(c_1+c_2=4\\) and \\(c_1-c_2=2\\).',
      'Add them: \\(2c_1=6\\Rightarrow c_1=3\\). Subtract: \\(2c_2=2\\Rightarrow c_2=1\\).'],
    result:'In the new basis, \\((4,2)\\) has coordinates \\((3,1)\\) — meaning \\(3\\mathbf b_1+1\\mathbf b_2\\). Same point, new numbers. The matrix whose columns are \\(\\mathbf b_1,\\mathbf b_2\\) converts <em>new</em> coords back to standard; its inverse goes the other way.'}));
  root.append(box('key','the change-of-basis matrix','Put the new basis vectors in the columns of a matrix \\(P\\). Then \\(P\\) turns new-coordinates into standard ones, and \\(P^{-1}\\) turns standard into new. That\'s the whole mechanism — and it\'s why “similar matrices” (Part IX) look like \\(P^{-1}AP\\): sandwich the map between a basis change and its undo.'));
  root.append(box('connect','connects to','Choosing a clever basis is a superpower used everywhere: <a onclick="vsGoTo(\'basis\')">here</a> it just relabels a point, but the same move powers <a onclick="vsGoTo(\'pca\')">PCA</a> (pick the data\'s own axes), <a onclick="vsGoTo(\'fourier\')">Fourier</a> (pick sine-wave axes), <a onclick="vsGoTo(\'diag\')">diagonalization</a> (pick the eigenvector axes), and the whole <a onclick="vsGoTo(\'similar\')">similarity</a> story \\(P^{-1}AP\\).'));
  root.append(summary(['A basis = your chosen rulers.','Coordinates = "how much of each ruler."','Change basis → numbers change, vector doesn\'t.','New coords = solve c₁b₁+c₂b₂+… = v; the basis matrix P (and P⁻¹) convert.']));
}};

/* ============================================================
   PART III — GEOMETRY
   ============================================================ */

register(cBasis);
})();
