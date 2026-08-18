/* 05_diff.js — base course */
'use strict';
(function(){
const cDiff={id:'diff',part:'Part ½ · The big picture',title:'A difference is a direction',
  sub:'Here\'s where geometry appears out of thin air. Subtract two configurations and you get a vector that means “how to turn one into the other” — a direction of change, with no physical arrow anywhere.',
render(root){
  head(root,5,cDiff);
  root.append(p('Take two photos A and B. Compare them pixel by pixel: \\(B - A\\) is a new list of numbers — the <b>change</b> that turns A into B. That difference is a vector, and it points in a <em>direction</em> through image-space. Watch a concrete one:'));
  const L=lab('B − A is the vector “brighten”','See','see');L.append(diffVector());root.append(L);
  root.append(box('aha-box','direction without north','If B is A-but-brighter, then \\(B-A \\approx (2,2,2,\\dots,2)\\) — “add a little to every pixel.” That\'s a genuine <b>direction</b> in the space, and it means something human: <em>brighter</em>. Not north/up — a <span class="aha">particular way of changing the thing.</span> A direction is just a way to change.'));
  root.append(h3('Travel along that direction: a path through possibility-space'));
  root.append(p('If \\(B-A\\) is a direction, then \\(A + t\\,(B-A)\\) walks from A to B as \\(t\\) goes 0→1 — and every step is a <em>real image</em>. Slide it and watch yourself travel through the space.'));
  const L2=lab('Walk from photo A to photo B','Play');L2.append(morphPath());root.append(L2);
  root.append(math('A + t\\,(B-A) \\quad\\text{for } t:0\\to1 \\;=\\; \\text{the straight path from } A \\text{ to } B'));
  root.append(box('key','geometry from nothing physical','Look what we built with only subtract, scale, and add: a <b>direction</b> (\\(B-A\\)), a <b>path</b> (\\(A+t(B-A)\\)), and “keep going past B” (\\(t>1\\)). No room, no physical arrows — just possibilities + operations. <span class="aha">That\'s geometry, created out of relationships alone.</span>'));
  root.append(worked({title:'continue past B',
    prompt:'Photos A and B. What is \\(A + 2(B-A)\\), in words?',
    steps:['\\(B-A\\) is the change “A → B.”',
      'Doubling it, \\(2(B-A)\\), is “twice that change.”',
      'Adding to A: keep moving in the same direction, past B, the same distance again.'],
    result:'You moved along a direction in image-space — e.g. “twice as much brighter.” Same machinery as arrows on paper, zero paper involved.'}));
  root.append(quiz({question:'A is a dark photo; B is the same photo brighter. What does the vector B−A represent?',
    options:[{t:'A direction of change — “make every pixel brighter”',ok:true,why:'Yes. Differences are directions; this one means “brighten.” Moving along it changes the image in that specific way.'},
      {t:'A physical arrow pointing north in a room',ok:false,why:'There\'s no room and no north. “Direction” here means a particular way of changing the configuration.'}]}));
  root.append(summary(['B−A = the change turning A into B = a vector.','A vector is a <em>direction</em>: a particular way to change a thing.','A + t(B−A) is a path through possibility-space; every point is real.','Geometry emerges from subtract/scale/add alone — no physical space needed.']));
}};

register(cDiff);
})();
