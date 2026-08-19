/* 04_point.js — base course */
'use strict';
(function(){
const cPoint={id:'point',part:'Part ½ · The big picture',title:'A photograph is a point',
  sub:'The famous mind-bender, made obvious. A configuration — a whole image — is a single point in a space of possibilities. Build the smallest such space by hand.',
render(root){
  head(root,4,cPoint);
  root.append(p('Think of a machine with one knob per pixel. A <em>setting of all the knobs</em> produces one image. So one image = one list of numbers = <b>one point</b> in the space of all possible images. Let\'s make the tiniest version you can hold in your hand: a 2×2 black-and-white image — just 4 pixels.'));
  const L=lab('The entire space of 2×2 images','Play');
  L.append(configSpace());
  root.append(L);
  root.append(box('aha-box','the whole space fits on screen','With 4 pixels and 2 values each there are only \\(2^4 = 16\\) possible images — and you\'re looking at <em>all of them</em>. Each little square is one <b>point</b>. “The space” isn\'t a room they float in; it\'s literally this collection of possibilities plus how they relate.'));
  root.append(h3('Now let the space explode'));
  root.append(p('Add pixels and brightness levels and count the possibilities. This is where combinatorics meets the space — slide both up.'));
  const L2=lab('Count the possibilities','Play');L2.append(possibilityCounter());root.append(L2);
  root.append(worked({title:'how many photographs exist?',
    prompt:'A real photo: 1,000,000 pixels, each with 256 brightness values. How many possible images?',
    steps:['Each pixel independently has 256 choices.',
      'Multiply choices across all pixels: \\(256 \\times 256 \\times \\dots\\) (a million times).',
      'That\'s \\(256^{1{,}000{,}000}\\) — a number with over two million digits.'],
    result:'Vastly more than the atoms in the universe. Every possible photograph — every one that ever could be taken — is a single point in that space.'}));
  root.append(box('key','combinatorics vs. the real thing','Counting works when values are <em>discrete</em> (0 or 1, or 0–255). But let each pixel be any <em>real</em> number and there are <b>infinitely</b> many images — so counting isn\'t what defines the space. What defines it is: <span class="aha">what can these points do together?</span> Can we subtract two? Average them? That structure — next chapter — is the real subject.'));
  root.append(box('aha-box','why call it a “point”','A million-number photograph feels like a huge complicated object. But relative to the space of <em>all</em> photographs, it\'s just one location — one choice among the possibilities. Calling it a “point” is the mental move that locks everything together: complex object out here, simple point in there.'));
  root.append(h3('The plot twist: “dimension” just means “knobs”'));
  root.append(p('Here\'s the thing nobody says out loud. When a physicist says spacetime is 4-dimensional, or a machine-learning person says their model lives in 512 dimensions, they are <em>not</em> claiming there\'s a secret 512-directional room somewhere. They mean one boring, wonderful thing:'));
  root.append(box('key','dimension = how many knobs you can turn independently','A 2×2 image has 4 pixels → <b>4 knobs</b> → a 4-dimensional space. A megapixel photo has a million knobs → a million dimensions. “Dimension” was never about how many directions you can <em>see</em> — it\'s about how many numbers you can dial <span class="aha">without any one of them forcing another to move.</span> That\'s it. That\'s the whole mystery, deflated.'));
  root.append(el('p','pull','So “500-dimensional space” isn’t a horror-movie set. It’s a control panel with 500 knobs. You’ve used a mixing board, a spreadsheet, a settings menu — congratulations, you’ve already stood comfortably inside high-dimensional spaces and felt nothing. The fear was always about <em>seeing</em>; the reality is just <em>knobs</em>.'));
  root.append(quiz({question:'A 1000×1000 black-and-white (2-value) image — how many possible images, and what is each one?',
    options:[{t:'2^(1,000,000) images; each image is one point in the space',ok:true,why:'Exactly. A million pixels, 2 choices each. Each specific image = one point among those possibilities.'},
      {t:'1,000,000 images; each is a pixel',ok:false,why:'A pixel isn\'t an image. Each whole image is one point; there are 2^(1,000,000) of them.'}]}));
  root.append(summary(['One image = one list of numbers = one point in image-space.','Discrete values → combinatorics counts the points.','Real values → infinitely many points; counting stops mattering.','What matters is what points can do together (next).']));
}};

register(cPoint);
})();
