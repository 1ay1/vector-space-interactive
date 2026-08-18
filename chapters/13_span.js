/* 13_span.js — base course */
'use strict';
(function(){
const cSpan={id:'span',part:'Part II · Structure',title:'Span — everywhere you can reach',
  sub:'The set of all points a few vectors can build by scaling-and-adding. Watch it flip between "a line" and "the whole plane."',
render(root){
  head(root,9,cSpan);
  root.append(p('The <span class="term">span</span> of some vectors is <em>every</em> place you can land by scaling and adding them. Drag the two arrows. When they point different ways, their span is shaded across the <b>whole plane</b>. Line them up and it collapses to a single <b>line</b>.'));
  const ro=el('div','readout','');const nar=narrate('Drag the arrows.');
  const board=spanBoard({arrows:[{x:2,y:1,color:C.accentb,label:'a'},{x:-1,y:1.5,color:C.accentc,label:'b'}],snap:true,
    onChange:a=>{const cross=a[0].x*a[1].y-a[0].y*a[1].x;const line=Math.abs(cross)<.2;
      ro.innerHTML=line?'<b style="color:var(--accent)">span = a LINE</b>':'<b style="color:var(--accentc)">span = the WHOLE PLANE</b>';
      nar.say(line?'<span class="r">They point the same way</span> — so scaling & adding only ever lands on one line. Span collapsed to 1D.':'<span class="g">Two genuine directions</span> — you can reach every point in 2D. Span = the whole plane.');}});
  const L=lab('Watch the span change','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('aha-box','the deepest idea, felt','This is the core of linear algebra. A set of vectors "spans" a space if you can build every point in it from them. Two independent 2D vectors span the plane; three independent 3D vectors span space; <em>n</em> independent vectors span an n-dimensional space. Span is how vectors <em>build</em> a world.'));
  root.append(box('trap','the collapse','If b is just a scaled copy of a, it adds nothing new — you\'re stuck on a\'s line. That redundancy is the subject of the next chapter, and it\'s what "dimension" really measures.'));
  root.append(quiz({question:'Two vectors point in different directions in 2D. Their span is…',
    options:[{t:'the entire plane',ok:true,why:'Yes — two real directions reach anywhere. They form a basis for 2D.'},
      {t:'only the region between them',ok:false,why:'Scaling can be negative and large, so you escape "between" and fill the whole plane.'}]}));
  root.append(h3('Is a given vector in the span? (the acid test)'));
  root.append(p('“Span” becomes concrete when you ask: <em>can I build this specific target?</em> That\'s just solving a system — which ties Part II straight to Part VI.'));
  root.append(worked({title:'is (7, 4) in the span of (2, 1) and (1, 3)?',
    prompt:'Find scalars \\(c_1, c_2\\) with \\(c_1(2,1) + c_2(1,3) = (7,4)\\), or show none exist.',
    steps:[
      'Write the two component equations: \\(2c_1 + c_2 = 7\\) and \\(c_1 + 3c_2 = 4\\).',
      'From the second, \\(c_1 = 4 - 3c_2\\). Substitute: \\(2(4-3c_2)+c_2 = 7 \\Rightarrow 8 - 5c_2 = 7 \\Rightarrow c_2 = \\tfrac15\\).',
      'Then \\(c_1 = 4 - 3\\cdot\\tfrac15 = \\tfrac{17}{5}\\).'],
    result:'Yes — \\((7,4) = \\tfrac{17}{5}(2,1) + \\tfrac15(1,3)\\). “Is it in the span?” ALWAYS means “does this system have a solution?” — and since the two vectors are independent, the answer here is yes for <em>every</em> target.'}));
  root.append(box('key','span in 3D: line, plane, or all of space','One nonzero vector spans a <b>line</b>. Two independent vectors span a <b>plane</b> (through the origin). Three independent vectors span <b>all of \\(\\mathbb R^3\\)</b>. Add a fourth vector in 3D and it\'s guaranteed redundant — there\'s no room for a fourth independent direction. The number of independent vectors = the dimension of the span.'));
  root.append(box('trap','the tempting wrong picture','It\'s natural to imagine the span of \\(\\mathbf a\\) and \\(\\mathbf b\\) as the <em>region between them</em> — like a pizza slice. <b>Wrong.</b> The scalars can be <em>negative</em> and <em>bigger than 1</em>, so you shoot out past both vectors and behind the origin in every direction. Two independent 2D vectors don\'t span a wedge — they span the <em>entire plane</em>. “Between” is a convex-combination idea; span is a linear-combination idea, and linear is much bigger.'));
  root.append(box('connect','connects to','“Is \\(v\\) in the span?” is the SAME question as “does \\(A\\mathbf x=\\mathbf b\\) have a solution?” — which you\'ll solve by elimination in <a onclick="vsGoTo(\'elim\')">Gaussian elimination</a>, and whose answer is decided by <a onclick="vsGoTo(\'rank\')">rank</a>. Span (geometry) and systems (algebra) are two views of one thing.'));
  root.append(summary(['Span = all points reachable by scale-and-add.','“Is v in the span?” = “does c₁a+c₂b+…=v have a solution?”','3D spans: 1 vec → line, 2 → plane, 3 → all of space.','Different directions → whole space; dependent → something smaller.']));
}};

register(cSpan);
})();
