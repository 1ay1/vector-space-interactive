/* 68_prooflab.js — proofs track */
'use strict';
(function(){
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

 root.append(h3('Proof 4 — eigenvectors of distinct eigenvalues are independent'));
 root.append(p('This is the fact that <em>guarantees</em> a matrix with n distinct eigenvalues is diagonalizable. It\'s a proof by contradiction — order the reasoning.'));
 const L4=lab('Assemble: distinct eigenvalues → independent eigenvectors','✎ Proof','weird');
 L4.append(proofBuilder({claim:'If \\(A\\mathbf x=\\lambda\\mathbf x\\), \\(A\\mathbf y=\\mu\\mathbf y\\), \\(\\lambda\\neq\\mu\\), then \\(\\mathbf x,\\mathbf y\\) are independent',
   steps:[
     {text:'Suppose for contradiction they are dependent: \\(\\mathbf y=c\\mathbf x\\) for some scalar \\(c\\neq0\\).',reason:'assume the opposite of what we want (proof by contradiction)',choices:['assume the opposite of what we want (proof by contradiction)','the definition of independence','a known theorem']},
     {text:'Apply \\(A\\) to both sides: \\(A\\mathbf y=cA\\mathbf x\\), so \\(\\mu\\mathbf y=c\\lambda\\mathbf x\\).',reason:'use both eigenvalue equations',choices:['use both eigenvalue equations','the triangle inequality','symmetry']},
     {text:'But \\(\\mu\\mathbf y=\\mu(c\\mathbf x)=c\\mu\\mathbf x\\). So \\(c\\mu\\mathbf x=c\\lambda\\mathbf x\\).',reason:'substitute y = c x again',choices:['substitute y = c x again','divide by zero','definition of eigenvalue']},
     {text:'Since \\(c\\neq0\\) and \\(\\mathbf x\\neq\\mathbf 0\\), this forces \\(\\mu=\\lambda\\) — contradicting \\(\\lambda\\neq\\mu\\).',reason:'cancel the nonzero c x, reaching a contradiction',choices:['cancel the nonzero c x, reaching a contradiction','the eigenvectors are equal','nothing follows']},
     {text:'The assumption was false, so \\(\\mathbf x,\\mathbf y\\) must be independent.',reason:'contradiction discharges the assumption',choices:['contradiction discharges the assumption','we proved they are equal','luck']}]}));
 root.append(L4);

 root.append(h3('Proof 5 — the Cauchy–Schwarz inequality'));
 root.append(p('\\(|\\mathbf a\\cdot\\mathbf b|\\le\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\) — the inequality behind “cosine is between −1 and 1,” the triangle inequality, and correlation coefficients. Build the slick one-line proof.'));
 const L5=lab('Assemble: Cauchy–Schwarz','✎ Proof','weird');
 L5.append(proofBuilder({claim:'\\(|\\mathbf a\\cdot\\mathbf b| \\le \\lVert\\mathbf a\\rVert\\,\\lVert\\mathbf b\\rVert\\)',
   steps:[
     {text:'For every real \\(t\\), \\(\\lVert\\mathbf a - t\\mathbf b\\rVert^2 \\ge 0\\) — a length squared is never negative.',reason:'lengths are non-negative',choices:['lengths are non-negative','the dot product is positive','a is longer than b']},
     {text:'Expand: \\(\\lVert\\mathbf a\\rVert^2 - 2t(\\mathbf a\\cdot\\mathbf b) + t^2\\lVert\\mathbf b\\rVert^2 \\ge 0\\) for all \\(t\\).',reason:'expand using the dot product',choices:['expand using the dot product','the Law of Cosines','integration']},
     {text:'This is a quadratic in \\(t\\) that is never negative, so its discriminant is \\(\\le 0\\).',reason:'a parabola opening up that never dips below 0 has no two real roots',choices:['a parabola opening up that never dips below 0 has no two real roots','the quadratic formula gives t','it equals zero']},
     {text:'Discriminant \\(\\le 0\\): \\((2\\,\\mathbf a\\cdot\\mathbf b)^2 - 4\\lVert\\mathbf a\\rVert^2\\lVert\\mathbf b\\rVert^2 \\le 0\\).',reason:'the discriminant of At²+Bt+C is B²−4AC',choices:['the discriminant of At²+Bt+C is B²−4AC','the vertex formula','completing the square']},
     {text:'Rearrange and take square roots: \\(|\\mathbf a\\cdot\\mathbf b| \\le \\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\).',reason:'algebra on the inequality',choices:['algebra on the inequality','the dot product is zero','a new assumption']}]}));
 root.append(L5);

 root.append(box('aha-box','why assembling beats reading','When you read a proof, your brain nods along and forgets it by morning. When you have to <em>order the steps and justify each one</em>, you\'re forced to hold the whole logical structure at once — which is exactly the skill of “doing math.” You now have <b>five</b> landmark theorems not as facts you were told, but as arguments you built — including a proof by contradiction and the discriminant trick behind Cauchy–Schwarz.'));
 root.append(quiz({question:'What makes a sequence of true statements a valid proof?',
   options:[{t:'Each step follows logically from the steps (and known facts) before it, ending at the claim',ok:true,why:'Exactly \u2014 validity is about the LINKS, not just the statements. That\'s what the ordering exercise trains.'},
     {t:'All the statements are individually true',ok:false,why:'True statements in a random order aren\'t a proof \u2014 the logical dependency between them is what matters.'}]}));
 root.append(summary(['A proof = a chain where each step follows from earlier ones.','Order the steps: what must be true BEFORE this step?','Justify each step: name the definition/theorem that licenses it.','Techniques you assembled: direct, contradiction, and the discriminant trick.','Assembling proofs (not reading them) is what builds real understanding.']));
}};
register(cProofLab);
})();
