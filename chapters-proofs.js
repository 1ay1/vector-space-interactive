/* ============================================================
   chapters-proofs.js — the Proof Lab.
   You don't READ these proofs — you ASSEMBLE them and justify
   each step. Interactive proof training. Pushes chapters in.
   ============================================================ */
'use strict';
(function(){
const {el,narrate,quiz,C,proofBuilder,worked}=VS;

function head(root,n,c){
  let num=n; try{const i=CHAPTERS.findIndex(x=>x.id===c.id);if(i>=0)num=i+1;}catch(e){}
  if(c.part) root.append(el('div','part-banner',c.part));
  root.append(el('div','eyebrow',`Chapter ${num}`));
  root.append(el('h1',null,c.title));
  root.append(el('p','lead-big',c.sub));
}
function box(kind,tag,html){const b=el('div','box '+kind);b.append(el('div','box-tag',tag));b.insertAdjacentHTML('beforeend',html);return b;}
function lab(title,badge='Proof',cls=''){const l=el('div','lab');const h=el('div','lab-head');h.append(el('span','lab-badge '+cls,badge),el('span','lab-title',title));l.append(h);return l;}
function p(html){return el('p',null,html);}
function h3(t){return el('h3',null,t);}
function summary(items){const s=el('div','summary');s.append(el('h4',null,'Lock it in'));const u=document.createElement('ul');items.forEach(i=>{const li=document.createElement('li');li.innerHTML=i;u.append(li);});s.append(u);return s;}
function insertAfter(afterId, chapter){const i=CHAPTERS.findIndex(c=>c.id===afterId);if(i>=0) CHAPTERS.splice(i+1,0,chapter); else CHAPTERS.push(chapter);}

/* ---------- PROOF LAB: intro + several assembled proofs ---------- */
const cProofLab={id:'prooflab',part:'Part XXII · The Proof Lab',title:'✎ The Proof Lab — build the arguments yourself',
 sub:'The deepest test of understanding isn\'t computing — it\'s KNOWING WHY. Here you don\'t read proofs. You assemble them from scrambled steps and justify each move. This is what mathematicians actually do.',
render(root){head(root,0,cProofLab);
 root.append(p('Everywhere else in this course you\'ve <em>computed</em>. Now you\'ll <em>reason</em>. Each proof below comes as scrambled steps \u2014 <b>your job is to put them in a valid logical order</b>, where every step follows from the ones before it. Then switch to the \u201cjustify\u201d tab and name <em>why</em> each step holds. Get an argument into your own hands and it stops being something you memorized.'));
 root.append(box('key','how to think about ordering a proof','Ask at each step: \u201cwhat do I need to already know for this to be true?\u201d Put those first. A proof is a chain where each link hangs off the previous ones \u2014 start from definitions and known facts, end at the claim. A red step means it depends on something you haven\'t established yet.'));

 root.append(h3('Proof 1 \u2014 the dot product equals ‖a‖‖b‖cos θ'));
 root.append(p('You met this derivation in Part III. Now rebuild its logic.'));
 const L1=lab('Assemble: dot = ‖a‖‖b‖cos θ','✎ Proof','weird');
 L1.append(proofBuilder({claim:'\\(\\mathbf a\\cdot\\mathbf b = \\lVert\\mathbf a\\rVert\\,\\lVert\\mathbf b\\rVert\\cos\\theta\\)',
   steps:[
     {text:'By the Law of Cosines on the triangle with sides \\(\\mathbf a,\\mathbf b,\\mathbf a-\\mathbf b\\): \\(\\lVert\\mathbf a-\\mathbf b\\rVert^2=\\lVert\\mathbf a\\rVert^2+\\lVert\\mathbf b\\rVert^2-2\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\cos\\theta\\).',
      reason:'geometry of the triangle (Law of Cosines)',choices:['geometry of the triangle (Law of Cosines)','definition of the dot product','because we want it to be true']},
     {text:'Expand the left side coordinate-wise: \\(\\lVert\\mathbf a-\\mathbf b\\rVert^2=\\sum(a_i-b_i)^2=\\lVert\\mathbf a\\rVert^2-2\\sum a_ib_i+\\lVert\\mathbf b\\rVert^2\\).',
      reason:'length is √(sum of squares), then algebra',choices:['length is √(sum of squares), then algebra','the Law of Cosines again','a guess']},
     {text:'Recognize \\(\\sum a_i b_i=\\mathbf a\\cdot\\mathbf b\\), so the left side is \\(\\lVert\\mathbf a\\rVert^2-2(\\mathbf a\\cdot\\mathbf b)+\\lVert\\mathbf b\\rVert^2\\).',
      reason:'definition of the dot product',choices:['definition of the dot product','the Pythagorean theorem','coincidence']},
     {text:'Set the two expressions equal; the \\(\\lVert\\mathbf a\\rVert^2,\\lVert\\mathbf b\\rVert^2\\) cancel, leaving \\(-2(\\mathbf a\\cdot\\mathbf b)=-2\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\cos\\theta\\); divide by \\(-2\\).',
      reason:'both equal ‖a−b‖², so they equal each other',choices:['both equal ‖a−b‖², so they equal each other','random algebra','definition of cosine']}]}));
 root.append(L1);

 root.append(h3('Proof 2 \u2014 rank + nullity = n'));
 const L2=lab('Assemble: the rank\u2013nullity theorem','✎ Proof','weird');
 L2.append(proofBuilder({claim:'For an \\(m\\times n\\) matrix, \\(\\text{rank}+\\text{nullity}=n\\)',
   steps:[
     {text:'Row-reduce the matrix to echelon form.',reason:'every matrix can be reduced (elimination)',choices:['every matrix can be reduced (elimination)','because the theorem says so','it looks nicer']},
     {text:'Every one of the \\(n\\) columns is now either a pivot column or a free column \u2014 there is no third kind.',reason:'a column has a leading entry or it doesn\'t',choices:['a column has a leading entry or it doesn\'t','the fundamental theorem of algebra','random']},
     {text:'The number of pivot columns equals the rank (the count of independent columns).',reason:'definition of rank',choices:['definition of rank','definition of nullity','Cramer\'s rule']},
     {text:'Each free column contributes one independent solution of \\(A\\mathbf x=\\mathbf 0\\), so the number of free columns equals the nullity.',reason:'definition of nullity via free variables',choices:['definition of nullity via free variables','the spectral theorem','luck']},
     {text:'Therefore \\(\\text{rank}+\\text{nullity}=(\\text{pivots})+(\\text{free})=n\\).',reason:'the two kinds partition all n columns',choices:['the two kinds partition all n columns','they overlap','coincidence']}]}));
 root.append(L2);

 root.append(h3('Proof 3 \u2014 symmetric matrices have perpendicular eigenvectors'));
 const L3=lab('Assemble: symmetric \u2192 orthogonal eigenvectors','✎ Proof','weird');
 L3.append(proofBuilder({claim:'If \\(A=A^{T}\\), eigenvectors for distinct eigenvalues are perpendicular',
   steps:[
     {text:'Suppose \\(A\\mathbf x=\\lambda\\mathbf x\\) and \\(A\\mathbf y=\\mu\\mathbf y\\) with \\(\\lambda\\neq\\mu\\).',reason:'set up the hypothesis',choices:['set up the hypothesis','the conclusion we want','an axiom']},
     {text:'Compute \\(\\mathbf x^{T}A\\mathbf y\\) directly: it equals \\(\\mu\\,\\mathbf x^{T}\\mathbf y\\).',reason:'A y = μ y',choices:['A y = μ y','A x = λ x','symmetry']},
     {text:'Compute \\(\\mathbf x^{T}A\\mathbf y\\) using \\(A=A^{T}\\): it equals \\((A\\mathbf x)^{T}\\mathbf y=\\lambda\\,\\mathbf x^{T}\\mathbf y\\).',reason:'symmetry lets us move A onto x',choices:['symmetry lets us move A onto x','A y = μ y','definition of transpose only']},
     {text:'So \\(\\lambda\\,\\mathbf x^{T}\\mathbf y=\\mu\\,\\mathbf x^{T}\\mathbf y\\), i.e. \\((\\lambda-\\mu)\\,\\mathbf x^{T}\\mathbf y=0\\).',reason:'the two computations of the same quantity must agree',choices:['the two computations of the same quantity must agree','division by zero','the triangle inequality']},
     {text:'Since \\(\\lambda\\neq\\mu\\), we conclude \\(\\mathbf x^{T}\\mathbf y=0\\): the eigenvectors are perpendicular.',reason:'a nonzero factor can be divided out',choices:['a nonzero factor can be divided out','λ = μ after all','they might not be']}]}));
 root.append(L3);

 root.append(box('aha-box','why assembling beats reading','When you read a proof, your brain nods along and forgets it by morning. When you have to <em>order the steps and justify each one</em>, you\'re forced to hold the whole logical structure at once \u2014 which is exactly the skill of \u201cdoing math.\u201d You now have three landmark theorems not as facts you were told, but as arguments you built.'));
 root.append(quiz({question:'What makes a sequence of true statements a valid proof?',
   options:[{t:'Each step follows logically from the steps (and known facts) before it, ending at the claim',ok:true,why:'Exactly \u2014 validity is about the LINKS, not just the statements. That\'s what the ordering exercise trains.'},
     {t:'All the statements are individually true',ok:false,why:'True statements in a random order aren\'t a proof \u2014 the logical dependency between them is what matters.'}]}));
 root.append(summary(['A proof = a chain where each step follows from earlier ones.','Order the steps: what must be true BEFORE this step?','Justify each step: name the definition/theorem that licenses it.','Assembling proofs (not reading them) is what builds real understanding.']));
}};
CHAPTERS.push(cProofLab);

})();
