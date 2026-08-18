/* 58_matrixlab.js — mastery track */
'use strict';
(function(){
const cLab={id:'matrixlab',part:'Part 0 · Orientation',title:'✦ The Matrix Lab — everything at once',
 sub:'The signature view of this course. One matrix, shown as a transformation AND its determinant, eigenvectors, rank, inverse, trace and singular values — all recomputing together. Change it once; watch every idea move.',
render(root){head(root,0,cLab);
 root.append(p('Most courses teach determinant, then — chapters later — eigenvalues, then rank, then the inverse, as if they were separate topics. <b>They are not.</b> They are one object seen from different angles. Here is that object. Edit the matrix \\(A\\), or hit a preset, and watch <em>every</em> quantity update <em>together</em>.'));
 const L=lab('One matrix, eight faces — live','✦ Signature','weird');
 L.append(matrixLab({matrix:[[2,1],[1,2]]}));
 root.append(L);
 root.append(box('aha-box','the connections you can now SEE move','Drag toward the <b>singular!</b> preset and watch, simultaneously: the grid squashes flat → the parallelogram\'s area (determinant) hits 0 → rank drops from 2 to 1 → the inverse vanishes → a singular value becomes 0 → one eigenvalue becomes 0. <span class="aha">These are not six facts. They are one fact with six faces.</span> That realization IS linear algebra.'));
 root.append(box('key','what to try','• <b>rotate 90°</b>: eigenvalues go <em>complex</em> — a pure rotation leaves no direction unturned. • <b>shear</b>: det stays 1 (area preserved) but it\'s not a rotation. • <b>symmetric</b>: the two eigenlines are perpendicular (the spectral theorem, visible). • <b>stretch</b>: eigenvalues sit right on the diagonal.'));
 root.append(el('div','pull','Come back to this lab after every chapter. Each new idea you learn is just <em>another reading</em> of the panel you\'re looking at right now. By the end, you\'ll see all eight at a glance — and that unified sight is what it means to truly know linear algebra.'));
 root.append(quiz({question:'In the Lab, you make det = 0. Which panel does NOT change to reflect it?',
   options:[{t:'None — they ALL change together (rank drops, inverse vanishes, a λ and a σ hit 0)',ok:true,why:'Exactly the point. det=0 is the same event as “rank<2” = “not invertible” = “0 is an eigenvalue” = “a singular value is 0.” One fact, all the panels.'},
     {t:'The trace stays put',ok:false,why:'True that trace can stay nonzero — but the question was which does NOT reflect singularity, and the real insight is how many DO move together.'}]}));
 root.append(summary(['One matrix = transformation + det + eigen + rank + inverse + trace + singular values.','Edit it once → all update together (they\'re one object).','det=0 ⇔ rank<n ⇔ not invertible ⇔ 0 is an eigenvalue ⇔ a σ is 0.','Return here after every chapter to see the new idea in the same panel.']));
}};
register(cLab, {after:"four"});
})();
