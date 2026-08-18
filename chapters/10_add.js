/* 10_add.js — base course */
'use strict';
(function(){
const cAdd={id:'add',part:'Part I · Build it',title:'Adding — the first of two moves',
  sub:'The entire subject runs on exactly two operations. Here\'s the first, and you\'ve done it since you could count.',
render(root){
  head(root,6,cAdd);
  root.append(p('To add two vectors, add them <b>line by line</b>. Eggs with eggs, milk with milk. No line ever looks at another — the most antisocial rule in mathematics, and that\'s exactly why it scales to a billion dimensions.'));
  const L1=lab('Add two lists, one line at a time');
  L1.append(box('ask','watch','Does the eggs line ever change the milk line? (It can\'t. That independence is the secret.)'));
  L1.append(listAdd({items:['eggs','milk','bread','coffee','apples'],a:[6,2,1,4,3],b:[4,1,3,0,5]}));
  root.append(L1);
  root.append(h3('The same thing as arrows: tip-to-tail'));
  root.append(p('Walk along the first arrow, then the second from where you landed. The single arrow from start to finish is the sum. Drag either.'));
  const ro=el('div','readout','');const nar=narrate('Drag an arrow.');
  const board=vboard({arrows:[{x:2,y:1,color:C.accentb,label:'a'},{x:1,y:2,color:C.accentc,label:'b'}],snap:true,
    extra:(ctx,toPx,arrows)=>{const a=arrows[0],b=arrows[1];const[ax,ay]=toPx(a.x,a.y),[sx,sy]=toPx(a.x+b.x,a.y+b.y),[ox,oy]=toPx(0,0);
      ctx.strokeStyle=C.accentc;ctx.setLineDash([5,4]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(sx,sy);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle=C.accent;ctx.fillStyle=C.accent;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(sx,sy);ctx.stroke();
      const ang=Math.atan2(sy-oy,sx-ox),s=12;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-s*Math.cos(ang-.42),sy-s*Math.sin(ang-.42));ctx.lineTo(sx-s*Math.cos(ang+.42),sy-s*Math.sin(ang+.42));ctx.closePath();ctx.fill();},
    onChange:a=>{const s={x:a[0].x+a[1].x,y:a[0].y+a[1].y};
      ro.innerHTML=`(${fmt(a[0].x)}, ${fmt(a[0].y)}) + (${fmt(a[1].x)}, ${fmt(a[1].y)}) = <b style="color:var(--accent)">(${fmt(s.x)}, ${fmt(s.y)})</b>`;
      nar.say(`Tip-to-tail lands at <span class="k">(${fmt(s.x)}, ${fmt(s.y)})</span> — exactly the line-by-line sums. The picture and the arithmetic always agree.`);}});
  const L2=lab('Tip-to-tail','See','see');L2.append(stageOf(board,[ro]),nar);root.append(L2);
  root.append(math('\\mathbf a + \\mathbf b = (a_1+b_1,\\; a_2+b_2,\\; \\dots,\\; a_n+b_n)'));
  root.append(box('aha-box','why dimension is a non-issue','Because the rule touches each line alone, the <em>identical</em> procedure works for 5 lines or 5 billion. A rule that treats each line separately literally cannot tell how long the list is.'));
  root.append(worked({title:'add three vectors (order doesn\'t matter)',
    prompt:'Compute \\((1,2)+(3,-1)+(-2,4)\\), then check that regrouping gives the same answer.',
    steps:[
      'Add the first two: \\((1,2)+(3,-1)=(4,1)\\).',
      'Add the third: \\((4,1)+(-2,4)=(2,5)\\).',
      'Regroup instead — add the last two first: \\((3,-1)+(-2,4)=(1,3)\\), then \\((1,2)+(1,3)=(2,5)\\). Same!'],
    result:'\\((2,5)\\) either way. Addition is <b>commutative</b> (order of vectors doesn\'t matter) and <b>associative</b> (grouping doesn\'t matter) — because each coordinate is just ordinary number addition, which has those properties. This is why we can write \\(a+b+c\\) with no parentheses.'}));
  root.append(quiz({question:'(3, −1, 5) + (−3, 1, −5) = ?',
    options:[{t:'(0, 0, 0)',ok:true,why:'Each line cancels. b is the "negative" of a — every vector has one that adds back to zero.'},
      {t:'(6, −2, 10)',ok:false,why:'That\'s a+a. Add line by line: 3+(−3)=0, etc.'}]}));
  root.append(summary(['Add = line by line, no line looks at its neighbours.','Arrows: tip-to-tail.','That independence is why addition scales to any dimension.']));
}};

register(cAdd);
})();
