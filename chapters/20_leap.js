/* 20_leap.js — base course */
'use strict';
(function(){
const cLeap={id:'leap',part:'Part IV · The leap',title:'Past 3D — operate, don\'t watch',
  sub:'Here your eyes tap out, and it doesn\'t matter. You stop watching the vector and start operating it. Nothing else changes.',
render(root){
  head(root,16,cLeap);
  root.append(p('At three numbers the arrow dies — you can\'t draw a 4-arrow. This is where most people quit. The fix isn\'t a better brain; it\'s a new <em>habit</em>: drop the arrow, keep the list.'));
  root.append(el('div','pull','Below 4 numbers you <b>watch</b> the vector. From 4 up you <b>operate</b> it. The math didn\'t get harder — your eyes just stopped being the tool.'));
  const L=lab('Operate a 6-D vector you can\'t picture');
  L.append(p('Here\'s a 6-dimensional vector as six knobs. You can\'t draw its arrow — but you can absolutely turn six knobs, add another 6-vector, and read its length.'));
  let v=[3,1,4,1,5,2],w=[1,2,0,3,1,1];const nar=narrate('');
  const ro=el('div','readout','');function updRO(){ro.textContent='v = ('+v.join(', ')+')';}
  const knobs=el('div','knobs');knobs.style.flexWrap='wrap';const api=[];
  const pal=[C.accent,C.accentb,C.accentc,C.accentd,C.gold,C.green];
  for(let i=0;i<6;i++){const k=knob({label:'n'+(i+1),color:pal[i],min:0,max:9,value:v[i],onInput:val=>{v[i]=val;updRO();}});api.push(k);knobs.append(k);}
  const addBtn=el('button','btn','+ add w = (1,2,0,3,1,1)');const lenBtn=el('button','btn ghost','measure length');
  const ctr=el('div','controls');ctr.append(addBtn,lenBtn);
  addBtn.onclick=()=>{v=v.map((x,i)=>clamp(x+w[i],0,9));api.forEach((k,i)=>k.api.set(v[i]));updRO();
    nar.say(`Added <span class="k">w</span> line by line → (${v.join(', ')}). Six separate sums — 6-D addition, no picture needed.`);};
  lenBtn.onclick=()=>{const len=Math.sqrt(v.reduce((s,x)=>s+x*x,0));nar.say(`length = √(${v.map(x=>x+'²').join('+')}) = <b>${len.toFixed(2)}</b>. Pythagoras in 6 dimensions. It just works.`);};
  L.append(knobs,ctr,ro,nar);updRO();root.append(L);
  root.append(box('aha-box','the reframe that wins','You just added and measured a 6-D vector as easily as a 2-D one — because the operations only ever touch one number at a time. <span class="aha">"100-dimensional" just means "a list with 100 lines." Instantly comfortable, completely correct.</span>'));
  root.append(quiz({question:'The honest way to "picture" a 50-dimensional vector is…',
    options:[{t:'Don\'t — treat it as a list of 50 numbers and operate on them',ok:true,why:'Exactly what mathematicians and ML engineers do. The list is the tool; the picture was optional all along.'},
      {t:'Squint until you see 50 axes',ok:false,why:'Nobody can, nobody needs to. The arrow was only ever a crutch for tiny dimensions.'}]}));
  root.append(summary(['Past 3D: operate the list, don\'t watch the arrow.','Every operation touches one number at a time.','"n-dimensional" = "a list with n lines." That\'s the whole leap.']));
}};

register(cLeap);
})();
