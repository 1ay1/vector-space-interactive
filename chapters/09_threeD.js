/* 09_threeD.js — base course */
'use strict';
(function(){
const c3d={id:'threeD',part:'Part I · Build it',title:'3D — the last room you can see',
  sub:'Three numbers, three axes. This is the final dimension your eyes handle — so study exactly how the arrow is built, because the recipe is what carries you past it.',
render(root){
  head(root,5,c3d);
  root.append(p('A 3D vector is three numbers: right, up, and toward-you. Below is a real 3D box you can <b>rotate by dragging</b>. Watch how the arrow is built: go along x, then z, then up y. That "lay each number along its own axis" recipe is the thing that never changes.'));
  const bd=board3d({vec:{x:2,y:1.5,z:1.5}});
  const nar=narrate('Drag to rotate. Move the sliders to change the vector.');
  function set(){const v={x:vx,y:vy,z:vz};bd.api.setVec(v);
    const len=Math.sqrt(vx*vx+vy*vy+vz*vz);
    nar.say(`v = <span class="k">(${fmt(vx)}, ${fmt(vy)}, ${fmt(vz)})</span>. Built by walking x → z → up y. Length = √(${fmt(vx)}²+${fmt(vy)}²+${fmt(vz)}²) = <b>${len.toFixed(2)}</b>.`);}
  let vx=2,vy=1.5,vz=1.5;
  const rx=rangeRow({label:'x',min:-3,max:3,step:.5,value:2,fmt:v=>v,onInput:v=>{vx=v;set();}});
  const ry=rangeRow({label:'y (up)',min:-3,max:3,step:.5,value:1.5,fmt:v=>v,onInput:v=>{vy=v;set();}});
  const rz=rangeRow({label:'z',min:-3,max:3,step:.5,value:1.5,fmt:v=>v,onInput:v=>{vz=v;set();}});
  const L=lab('Rotate a real 3D vector','See','see');
  const g=el('div','grow');g.append(rx,ry,rz);const s=el('div','stage');s.append(bd,g);
  L.append(s,nar);root.append(L);set();
  root.append(box('aha-box','the recipe, stated once','<em>Lay each number along its own axis; the arrow ends where they add up.</em> 1D used one axis, 2D two, 3D three. Nowhere does the recipe learn that "three" is where human eyes give out — it just keeps going. In Chapter 10 we run it with six, and it works identically.'));
  root.append(math('\\lVert \\mathbf v\\rVert = \\sqrt{x^2+y^2+z^2}'));
  root.append(summary(['3D vector = three numbers along three axes.','Same build-recipe as 1D and 2D, one more time.','This is the last dimension you can picture — the recipe doesn\'t care.']));
}};

register(c3d);
})();
