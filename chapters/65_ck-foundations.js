/* 65_ck-foundations.js — mastery track */
'use strict';
(function(){
const ck1={id:'ck-foundations',part:'Part V \u00b7 Payoff',title:'Checkpoint: vectors & the two moves',
 sub:'Random graded problems on everything so far \u2014 add, scale, dot product, length. Clear these and the foundations are yours.',
render(root){head(root,0,ck1);
 root.append(p('The first checkpoint. These regenerate every visit, so come back until they\'re automatic. Type the answer (numbers, commas fine) and press Enter.'));
 checkpoint(root,['add','scale','dot','length']);
 root.append(box('aha-box','why practice, not just reading','Reading builds recognition; <em>doing</em> builds recall. If any of these felt slow, that\'s the signal to replay that chapter \u2014 the arithmetic should become as automatic as reading. That automaticity is what \u201cinternalized\u201d means.'));
}};
register(ck1, {after:"review"});
})();
