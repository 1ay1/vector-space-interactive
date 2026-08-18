/* 42_axioms.js — base course */
'use strict';
(function(){
const cAxioms={id:'axioms',part:'Part V · Payoff',title:'The rules of the club (axioms)',
  sub:'What officially makes something a "vector space." They read like legalese but each one is just a promise that your intuition transfers.',
render(root){
  head(root,22,cAxioms);
  root.append(p('A <span class="term">vector space</span> is <em>any</em> collection of things you can <b>add</b> and <b>scale</b>, where a short list of promises holds. Not arrows — <em>anything</em>: numbers, functions, matrices, quantum states, financial portfolios. If it keeps the promises, every theorem you learned works for it, free.'));
  const promises=[['Order-blind addition','a + b = b + a. Your cart plus theirs = theirs plus yours.'],
    ['Grouping-blind addition','(a+b)+c = a+(b+c). Add in any grouping.'],
    ['A "do-nothing" vector','the zero vector; adding it changes nothing.'],
    ['Every vector has an undo','a + (−a) = 0. No vector is a trap.'],
    ['Scaling composes','a(b·v) = (ab)·v. Triple then double = sextuple.'],
    ['Scaling by 1 does nothing','1·v = v.'],
    ['Scaling spreads over addition','a(u+v)=au+av and (a+b)v=av+bv.']];
  const g=el('div','glossary');promises.forEach(([t,d])=>{const it=el('div','gitem');it.innerHTML=`<b>${t}</b> — ${d}`;g.append(it);});
  root.append(g);
  root.append(box('aha-box','what the promises buy you','They are a <em>guarantee your intuition transfers</em>. Whatever weird object you\'re holding, if it passes this checklist, then adding, scaling, length, distance, angle, and direction all behave exactly like they did on childhood graph paper. That\'s why the same machinery describes arrows, photos, songs, and functions.'));
  root.append(quiz({question:'The set of all functions f(x), with normal add & scale — is it a vector space?',
    options:[{t:'Yes — you can add and scale them, and all the promises hold',ok:true,why:'Correct. Functions form one of the most important vector spaces in all of math and physics.'},
      {t:'No — vectors have to be arrows',ok:false,why:'That\'s the myth this whole course dismantles. "Vector" means "member of a vector space" — arrows are just one example.'}]}));
  root.append(summary(['Vector space = things you can add & scale, obeying 7 promises.','The promises guarantee your 2D intuition transfers.','Arrows, functions, matrices, portfolios — all vector spaces.']));
}};

register(cAxioms);
})();
