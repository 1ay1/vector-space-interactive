/* 16_length.js — base course */
'use strict';
(function(){
const cLength={id:'length',part:'Part III · Geometry',title:'Length & distance',
  sub:'Geometry survives into any dimension. Length is Pythagoras with more plus signs — and it powers "how similar are these two things?"',
render(root){
  head(root,12,cLength);
  root.append(p('The length of a vector is the square root of the sum of its squared numbers. In 2D that\'s the hypotenuse — Pythagoras. In a million dimensions it\'s the exact same recipe, just a longer sum.'));
  root.append(math('\\lVert\\mathbf v\\rVert=\\sqrt{v_1^2+v_2^2+\\cdots+v_n^2}'));
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'v'}],snap:true,
    extra:(ctx,toPx,arrows)=>{const v=arrows[0];const[ox,oy]=toPx(0,0),[vx,vy]=toPx(v.x,v.y),[cx,cy]=toPx(v.x,0);
      ctx.strokeStyle=C.accentb;ctx.setLineDash([4,3]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(cx,cy);ctx.lineTo(vx,vy);ctx.stroke();ctx.setLineDash([]);},
    onChange:a=>{const v=a[0];const len=Math.hypot(v.x,v.y);
      ro.innerHTML=`length = √(${fmt(v.x)}² + ${fmt(v.y)}²) = <b style="color:var(--accent)">${len.toFixed(2)}</b>`;
      nar.say(`Square each, add, root: <span class="k">√(${(v.x*v.x).toFixed(1)} + ${(v.y*v.y).toFixed(1)}) = ${len.toFixed(2)}</span>. The dashed legs are the triangle — but the arithmetic didn't need it.`);}});
  const L=lab('Live Pythagoras','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('aha-box','distance = length of the difference','How far apart are two vectors? Subtract them (line by line) and take the length. That\'s <em>literally</em> how your photo app decides two images are similar: turn each into a vector, subtract, measure. Small distance = alike.'));
  root.append(math('\\text{dist}(\\mathbf a,\\mathbf b)=\\lVert\\mathbf a-\\mathbf b\\rVert=\\sqrt{\\textstyle\\sum_i (a_i-b_i)^2}'));
  root.append(worked({title:'length in 4 dimensions',
    prompt:'Find the length of \\( \\mathbf v = (1,\\,2,\\,2,\\,4) \\). You cannot picture a 4-D arrow — you don\'t need to.',
    steps:[
      'Square every number: \\(1^2=1,\\; 2^2=4,\\; 2^2=4,\\; 4^2=16\\).',
      'Add the squares: \\(1+4+4+16 = 25\\).',
      'Take the square root: \\(\\sqrt{25}=5\\).'],
    result:'\\( \\lVert\\mathbf v\\rVert = 5 \\). A distance in a space you can\'t see, from grade-school arithmetic.'}));
  root.append(worked({title:'distance between two songs',
    prompt:'Two songs as (tempo, loudness) after scaling: \\(\\mathbf a=(4,1)\\), \\(\\mathbf b=(1,5)\\). How different are they?',
    steps:[
      'Subtract line by line: \\(\\mathbf a-\\mathbf b=(4-1,\\;1-5)=(3,-4)\\).',
      'Length of the difference: \\(\\sqrt{3^2+(-4)^2}=\\sqrt{9+16}=\\sqrt{25}\\).'],
    result:'distance \\(=5\\). Bigger number = less alike — exactly how a music app rates similarity.'}));
  root.append(quiz({question:'Length of the 4-D vector (1, 2, 2, 4)?',
    options:[{t:'5',ok:true,why:'√(1+4+4+16)=√25=5. You measured a distance in a space you can\'t see, with grade-school arithmetic.'},
      {t:'9',ok:false,why:'That\'s 1+2+2+4 (no squaring). Square first: 1+4+4+16=25, √25=5.'}]}));
  root.append(box('trap','the mistake almost everyone makes once','“Length of \\((3,4)\\) is \\(3+4=7\\).” <b>No.</b> You must <em>square</em> first: \\(\\sqrt{3^2+4^2}=\\sqrt{25}=5\\), not 7. Adding the raw numbers ignores the right-angle — it would only be right if the vector went purely along one axis. Square, add, <em>then</em> root, always in that order.'));
  const Lpl=lab('Practice: lengths','Practice','');
  Lpl.append(p('Square, add, root. Type the number.'));
  Lpl.append(practiceSet(['length'],4));
  root.append(Lpl);
  root.append(box('connect','connects to','Length powers the two big “sameness” measures: <b>distance</b> \\(\\lVert\\mathbf a-\\mathbf b\\rVert\\) (used by k-nearest-neighbours and clustering) and, once you divide it out, <a onclick="vsGoTo(\'dot\')">cosine similarity</a> (used by search and embeddings). Normalizing a vector to length 1 is <a onclick="vsGoTo(\'scale\')">scaling</a> by 1/length.'));
  root.append(summary(['Length = √(sum of squares) — Pythagoras, any dimension.','Distance = length of the difference vector.','This is the backbone of "similarity" in tech.']));
}};

register(cLength);
})();
