/* 11_scale.js — base course */
'use strict';
(function(){
const cScale={id:'scale',part:'Part I · Build it',title:'Scaling — the second move',
  sub:'Multiply a whole vector by one number. You\'ve met this as the brightness slider in every photo app.',
render(root){
  head(root,7,cScale);
  root.append(p('To <b>scale</b> by a number, multiply every line by it. Double → all doubles. Times ½ → all halves. Times −1 → it flips to point the opposite way. This little face is an 11×11 grid — a <b>121-dimensional vector</b> — and the brightness slider scales all 121 at once.'));
  const L=lab('Brightness = scaling a 121-D photo');
  L.append(box('ask','predict','What appears at 0×? At 2×?'));
  const canvas=el('canvas');canvas.width=200;canvas.height=200;const ctx=VS.hidpi(canvas);
  const N=11,cell=200/N,base=[];
  for(let y=0;y<N;y++){base[y]=[];for(let x=0;x<N;x++){const dx=x-5,dy=y-5,r=Math.hypot(dx,dy);let v=45+150*Math.max(0,1-r/6);
    if(y===3&&(x===3||x===7))v=235;if(y===8&&x>=3&&x<=7)v=225;base[y][x]=Math.round(v);}}
  const nar=narrate('');
  function draw(s){for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=clamp(Math.round(base[y][x]*s),0,255);ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}
    const msg=s===0?'<span class="r">Every pixel is 0 — the <b>zero vector</b> (pure black).</span>':s<1?'Every pixel shrank — darker.':s>1?'Every pixel grew (clipped at white) — brighter.':'Original.';
    nar.say(`scale = <span class="k">${s.toFixed(2)}×</span>. ${msg}`);}
  const row=rangeRow({label:'scale factor',min:0,max:2,step:.01,value:1,fmt:v=>v.toFixed(2)+'×',onInput:draw});
  L.append(row,stageOf(canvas,[nar]));draw(1);root.append(L);
  root.append(h3('As an arrow: stretch, don\'t steer'));
  const ro=el('div','readout','');const nar2=narrate('');const base2={x:2,y:1};let k=1.5;
  const board=vboard({arrows:[{x:3,y:1.5,color:C.accent,label:'k·v',draggable:false},{x:2,y:1,color:C.accentb,label:'v',draggable:false}]});
  function apply(kk){k=kk;board.api.arrows[0].x=base2.x*k;board.api.arrows[0].y=base2.y*k;board.api.render();
    ro.innerHTML=`${k.toFixed(2)} · (2, 1) = <b style="color:var(--accent)">(${(2*k).toFixed(1)}, ${(k).toFixed(1)})</b>`;
    nar2.say(k<0?'<span class="r">Negative — flipped to point the opposite way.</span>':k===0?'Zero — collapsed to the origin.':`Same direction, <span class="k">${k.toFixed(2)}×</span> as long. Direction locked; only length changed.`);}
  const row2=rangeRow({label:'scale k',min:-2,max:2,step:.05,value:1.5,fmt:v=>v.toFixed(2),onInput:apply});
  const L2=lab('Stretch vs steer','See','see');L2.append(row2,stageOf(board,[ro]),nar2);apply(1.5);root.append(L2);
  root.append(math('c\\,\\mathbf v = (c\\,v_1,\\; c\\,v_2,\\; \\dots,\\; c\\,v_n)'));
  root.append(box('trap','the trap','"Scaling steers the vector." No — positive scaling only changes length. Every line grows by the same factor, so the ratios (the direction) stay fixed. Stretch ≠ steer.'));
  root.append(worked({title:'scale to make a unit vector',
    prompt:'Rescale \\(\\mathbf v=(3,4)\\) so it has length 1 but points the same way (a “unit vector”).',
    steps:[
      'Find the current length: \\(\\lVert\\mathbf v\\rVert=\\sqrt{3^2+4^2}=5\\).',
      'Scale by \\(1/\\lVert\\mathbf v\\rVert=1/5\\): \\(\\tfrac{1}{5}(3,4)=(0.6,\\,0.8)\\).',
      'Check: \\(\\sqrt{0.6^2+0.8^2}=\\sqrt{0.36+0.64}=1\\). ✓'],
    result:'\\((0.6, 0.8)\\) — same direction, length 1. “Normalizing” (dividing by the length) is scaling in disguise, and it\'s everywhere: it\'s how you separate a vector\'s <em>direction</em> from its <em>size</em>.'}));
  root.append(summary(['Scale = multiply every line by one number.','0× → zero vector; −1× → flip; positive → stretch, same direction.','Normalize = scale by 1/length to get a unit vector (pure direction).','Photo brightness is scaling in a million dimensions.']));
}};

/* ============================================================
   PART II — STRUCTURE
   ============================================================ */

register(cScale);
})();
