/* 12_combo.js — base course */
'use strict';
(function(){
const cCombo={id:'combo',part:'Part II · Structure',title:'Linear combinations',
  sub:'Mix the two moves — scale some vectors, then add. This one operation is the beating heart of the entire subject.',
render(root){
  head(root,8,cCombo);
  root.append(p('A <span class="term">linear combination</span> is just: take some of this vector, some of that one, and add. Like a recipe — "3 scoops of a, 2 scoops of b." Scale, then add. That\'s the whole thing.'));
  root.append(math('c_1\\mathbf a + c_2\\mathbf b + \\dots + c_k\\mathbf z'));
  root.append(p('Everything ahead — span, basis, independence, even matrices — is built from this. Below, mix two vectors with the dials and reach the star.'));
  const target={x:2.5,y:1.5};let ca=1,cb=1;const av={x:2,y:.5},bv={x:.5,y:2};
  const ro=el('div','readout','');const nar=narrate('');
  const board=vboard({arrows:[{x:av.x,y:av.y,color:C.accentb,label:'a',draggable:false},{x:bv.x,y:bv.y,color:C.accentc,label:'b',draggable:false}],
    extra:(ctx,toPx)=>{const[ox,oy]=toPx(0,0);const pa={x:av.x*ca,y:av.y*ca};const res={x:av.x*ca+bv.x*cb,y:av.y*ca+bv.y*cb};
      const[pax,pay]=toPx(pa.x,pa.y),[rx,ry]=toPx(res.x,res.y);
      ctx.strokeStyle=C.accentb;ctx.globalAlpha=.4;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(pax,pay);ctx.stroke();
      ctx.strokeStyle=C.accentc;ctx.beginPath();ctx.moveTo(pax,pay);ctx.lineTo(rx,ry);ctx.stroke();ctx.globalAlpha=1;
      ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(rx,ry,6,0,7);ctx.fill();
      const[tx,ty]=toPx(target.x,target.y);ctx.fillStyle=C.gold;ctx.font='20px sans-serif';ctx.fillText('★',tx-8,ty+7);}});
  function upd(){const res={x:av.x*ca+bv.x*cb,y:av.y*ca+bv.y*cb};board.api.render();
    const hit=Math.hypot(res.x-target.x,res.y-target.y)<.15;
    ro.innerHTML=`${ca.toFixed(2)}·a + ${cb.toFixed(2)}·b = <b style="color:var(--accent)">(${res.x.toFixed(2)}, ${res.y.toFixed(2)})</b>`;
    nar.say(hit?'<span class="g">Bullseye!</span> Two different-direction vectors can reach <b>any</b> point in the plane.':`Result (${res.x.toFixed(2)}, ${res.y.toFixed(2)}). Keep tuning.`);}
  const rA=rangeRow({label:'how much a',min:-2,max:2,step:.05,value:1,fmt:v=>v.toFixed(2),onInput:v=>{ca=v;upd();}});
  const rB=rangeRow({label:'how much b',min:-2,max:2,step:.05,value:1,fmt:v=>v.toFixed(2),onInput:v=>{cb=v;upd();}});
  const L=lab('Reach the star by mixing');const g=el('div','grow');g.append(ro,rA,rB);const s=el('div','stage');s.append(board,g);
  L.append(s,nar);upd();root.append(L);
  root.append(box('aha-box','the phrase, demystified','"Linear combination" sounds intimidating; it means "a smoothie." Scoops of each ingredient, blended. If you can customise a smoothie order, you understand it.'));
  root.append(worked({title:'find the exact recipe',
    prompt:'What combination of \\(\\mathbf a=(1,2)\\) and \\(\\mathbf b=(3,1)\\) equals \\((5,5)\\)?',
    steps:[
      'Set up \\(c_1(1,2)+c_2(3,1)=(5,5)\\), giving \\(c_1+3c_2=5\\) and \\(2c_1+c_2=5\\).',
      'From the first, \\(c_1=5-3c_2\\). Sub into the second: \\(2(5-3c_2)+c_2=5\\Rightarrow 10-5c_2=5\\Rightarrow c_2=1\\).',
      'Then \\(c_1=5-3=2\\).'],
    result:'\\((5,5)=2\\mathbf a+1\\mathbf b\\). “Reach a target by mixing” always turns into a small system — which is exactly the bridge to Part VI. Sanity check: \\(2(1,2)+(3,1)=(2,4)+(3,1)=(5,5)\\). ✓'}));
  root.append(summary(['Linear combination = scale each, then add.','It\'s the engine every later idea is built from.','“Reach a target” = solve a small system for the coefficients.','Two different-direction 2D vectors can combine to reach anywhere.']));
}};

register(cCombo);
})();
