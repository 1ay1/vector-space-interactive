/* 14_indep.js — base course */
'use strict';
(function(){
const cIndep={id:'indep',part:'Part II · Structure',title:'Independence — is a vector redundant?',
  sub:'A vector is "redundant" if you could already reach it with the ones you had. Counting the non-redundant ones is what dimension really means.',
render(root){
  head(root,10,cIndep);
  root.append(p('Vector <b>b</b> is <span class="term">redundant</span> (dependent) if it lies along a\'s line — it reaches nowhere new. It\'s <span class="term">independent</span> if it opens a genuinely new direction. Drag b onto a\'s line and back.'));
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[{x:2,y:1,color:C.accentb,label:'a'},{x:1.4,y:2,color:C.accentc,label:'b'}],snap:true,
    extra:(ctx,toPx,arrows)=>{const a=arrows[0],b=arrows[1];const cross=a.x*b.y-a.y*b.x;
      if(Math.abs(cross)<.25){const[ox,oy]=toPx(0,0);const ang=Math.atan2(a.y,a.x),far=600;
        ctx.strokeStyle=C.accent;ctx.globalAlpha=.3;ctx.lineWidth=10;ctx.beginPath();
        ctx.moveTo(ox-far*Math.cos(ang),oy+far*Math.sin(ang));ctx.lineTo(ox+far*Math.cos(ang),oy-far*Math.sin(ang));ctx.stroke();ctx.globalAlpha=1;}},
    onChange:a=>{const cross=a[0].x*a[1].y-a[0].y*a[1].x;const dep=Math.abs(cross)<.25;
      ro.innerHTML=dep?'<b style="color:var(--accent)">REDUNDANT</b>':'<b style="color:var(--accentc)">INDEPENDENT</b>';
      nar.say(dep?'<span class="r">b is redundant</span> — on a\'s line. Together they still only reach a <b>1D line</b>. True dimension: 1.':'<span class="g">b is independent</span> — a new direction. Together they reach the <b>whole plane</b>. True dimension: 2.');}});
  const L=lab('Independent or redundant?','See','see');L.append(stageOf(board,[ro]),nar);root.append(L);
  root.append(box('aha-box','what dimension really counts','Dimension isn\'t "how many vectors you have" — it\'s how many <em>independent</em> ones. Ten vectors on one line still only span a line (dimension 1). The count of genuinely-new directions is the real dimension.'));
  root.append(box('key','basis, made precise','A <span class="term">basis</span> is a set that is (1) independent — nothing redundant — and (2) spans the whole space. It\'s the <em>smallest</em> set of rulers that reaches everywhere: exactly n of them for an n-dimensional space.'));
  root.append(h3('The fast test: the determinant'));
  root.append(p('Dragging shows independence <em>geometrically</em>, but there\'s a one-number test. Put the vectors in the columns of a matrix; they\'re independent exactly when its <b>determinant is nonzero</b> (a zero determinant means they collapse — the “cross product” from the drag is really this determinant).'));
  root.append(worked({title:'are these three vectors independent?',
    prompt:'Test \\((1,2,3)\\), \\((0,1,4)\\), \\((0,0,5)\\) for independence.',
    steps:[
      'Stack them as columns (or rows) and take the determinant. They\'re already in triangular form.',
      'A triangular matrix\'s determinant is the product of its diagonal: \\(1\\times1\\times5=5\\).',
      '\\(5\\neq0\\), so the three columns are independent.'],
    result:'Independent — they span all of \\(\\mathbb R^3\\) and form a basis. Had the determinant been 0, one vector would be a combination of the others. (For 2 vectors it\'s the same test: \\(ad-bc\\neq0\\).)'}));
  root.append(box('connect','connects to','“Independent” is the same fact as \\(\\det\\neq0\\) (<a onclick="vsGoTo(\'det\')">determinant</a>), full <a onclick="vsGoTo(\'rank\')">rank</a>, and <a onclick="vsGoTo(\'inverse\')">invertibility</a> — all unified in the <a onclick="vsGoTo(\'imt\')">Invertible Matrix Theorem</a>.'));
  root.append(quiz({question:'You have 5 vectors in 2D. The most that can be independent is…',
    options:[{t:'2',ok:true,why:'2D holds at most 2 independent directions; vectors 3–5 must be combinations of the first two. That 2 is the dimension.'},
      {t:'5',ok:false,why:'Having five vectors doesn\'t make five directions. In 2D only 2 can be independent.'}]}));
  root.append(summary(['Redundant = reachable from the others.','Dimension = number of <em>independent</em> vectors.','Basis = independent + spanning = smallest complete set of rulers.']));
}};

register(cIndep);
})();
