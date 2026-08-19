/* 09_threeD.js — base course */
'use strict';
(function(){
const c3d={id:'threeD',part:'Part I · Build it',title:'3D — the last room you can see',
  sub:'Three numbers, three axes. This is the final dimension your eyes handle — so study exactly how the arrow is built, because the recipe is what carries you past it.',
render(root){
  head(root,5,c3d);
  root.append(p('Three numbers now: right, up, and toward-you. This is the <b>last room your eyeballs are invited to</b> — the final dimension your visual cortex will render without filing a complaint. So don\'t just gawk at the arrow; study <em>how it\'s assembled</em>, because that recipe is the smuggler that walks you across the border into dimensions you can\'t see. Drag the box to rotate it:'));
  const bd=board3d({vec:{x:2,y:1.5,z:1.5}});
  const nar=narrate('Drag to rotate. Move the sliders to change the vector.');
  function set(){const v={x:vx,y:vy,z:vz};bd.api.setVec(v);
    const len=Math.sqrt(vx*vx+vy*vy+vz*vz);
    nar.say(`v = <span class="k">(${fmt(vx)}, ${fmt(vy)}, ${fmt(vz)})</span>. Built by walking x → z → up y, then stopping. Length = √(${fmt(vx)}²+${fmt(vy)}²+${fmt(vz)}²) = <b>${len.toFixed(2)}</b> — Pythagoras, now with three legs and zero complaints.`);}
  let vx=2,vy=1.5,vz=1.5;
  const rx=rangeRow({label:'x',min:-3,max:3,step:.5,value:2,fmt:v=>v,onInput:v=>{vx=v;set();}});
  const ry=rangeRow({label:'y (up)',min:-3,max:3,step:.5,value:1.5,fmt:v=>v,onInput:v=>{vy=v;set();}});
  const rz=rangeRow({label:'z',min:-3,max:3,step:.5,value:1.5,fmt:v=>v,onInput:v=>{vz=v;set();}});
  const L=lab('Rotate a real 3D vector','See','see');
  const g=el('div','grow');g.append(rx,ry,rz);const s=el('div','stage');s.append(bd,g);
  L.append(s,nar);root.append(L);set();
  root.append(box('aha-box','the recipe, stated once (memorize this, not the picture)','<em>Lay each number along its own axis; the arrow ends where they all add up.</em> 1D used one axis, 2D two, 3D three. Read that recipe again and notice the thing it <b>never mentions</b>: it never says “and three is the maximum, because eyeballs.” The recipe has no idea your eyes exist. Hand it seven numbers and it lays down seven axes and finishes the job without blinking — which is exactly what we do next chapter. <span class="aha">Your eyes tap out at 3. The recipe never taps out.</span>'));
  root.append(el('p','pull','This is the hinge of the whole course. Everyone who “can’t do higher dimensions” is secretly trying to <em>see</em> them. You’re about to stop seeing and start <em>computing</em> — and computing doesn’t care how many axes there are. That’s not a workaround. That’s the actual superpower.'));
  root.append(math('\\lVert \\mathbf v\\rVert = \\sqrt{x^2+y^2+z^2}\\qquad\\text{(and in }n\\text{-D: just keep adding squares)}'));
  root.append(quiz({question:'Why do we obsess over the build-recipe instead of just enjoying the pretty 3D arrow?',
    options:[
      {t:'Because the recipe is dimension-blind — it runs identically for 3, 7, or 7 million axes',ok:true,why:'Exactly. The picture is a bonus that expires at dimension 3; the recipe is the part that generalizes. Learn the transferable thing.'},
      {t:'Because 3D arrows are actually wrong',ok:false,why:'They\'re perfectly right — just not <em>portable</em>. The recipe is what survives the trip to higher dimensions.'},
      {t:'Because memorizing pictures is how math works',ok:false,why:'The opposite — we\'re replacing “picture it” with “compute it” precisely so we stop needing pictures.'}]}));
  root.append(summary(['3D vector = three numbers along three axes.','Same build-recipe as 1D and 2D, run one more time.','This is the last dimension you can picture — the recipe doesn\'t care.','Stop seeing, start computing: that swap is the whole superpower.']));
}};

register(c3d);
})();
