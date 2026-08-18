/* 67_exam.js — mastery track */
'use strict';
(function(){
const cExam={id:'exam',part:'Part XXI \u00b7 Numerical & capstone',title:'The mastery exam',
 sub:'Twelve mixed problems spanning the whole course \u2014 no hints about which topic. If you can clear these cold, you have genuinely internalized linear algebra.',
render(root){head(root,0,cExam);
 root.append(el('div','pull','This is the real test of internalization: problems arrive with no label. You have to see what each one is asking and reach for the right tool automatically.'));
 root.append(p('Fifteen problems drawn from across everything: vectors, dot products, lengths, angles, cross products, determinants (2×2 and 3×3), trace, matrix products, systems, inverses, rank, nullity, eigenvalues. Fresh set every visit.'));
 const L=lab('Comprehensive exam — 15 problems','Exam','weird');
 L.append(practiceSet(['add','scale','dot','length','angle','cross','det2','det3','trace','matvec','matmul','solve2','inv2','projscalar','subspace','eig','rank','nullity'], 15));
 root.append(L);
 root.append(box('aha-box','scoring yourself honestly','<b>10\u201312:</b> you own the mechanics \u2014 go build something (an SVD compressor, a tiny neural net, a physics sim). <b>7\u20139:</b> solid; revisit the two or three types that tripped you. <b>&lt;7:</b> replay the relevant checkpoints \u2014 no shame, that\'s exactly what they\'re for. Mastery is built by return visits, not one pass.'));
 root.append(box('key','what you can now do','You can read any equation of the form \\(A\\mathbf x = \\mathbf b\\) or \\(A\\mathbf v = \\lambda\\mathbf v\\) and <em>know what it means geometrically</em>. You can look at a matrix and see the transformation. You can decompose, project, and diagonalize. That vocabulary is the foundation of machine learning, graphics, quantum mechanics, statistics, and control theory \u2014 every one of them is this toolkit, specialized.'));
 root.append(el('div','pull','You started at \u201ca vector is a list of numbers.\u201d You can now compress an image with the SVD, rank the web with an eigenvector, and fit a model with a projection. You didn\'t memorize linear algebra \u2014 you built it, felt it, and made it yours.'));
 root.append(summary(['Mixed, unlabeled problems test true recognition.','Clear them cold = you\'ve internalized the mechanics.','Return visits build durable mastery.','You now hold the foundation the technical world runs on.']));
}};
register(cExam);
})();
