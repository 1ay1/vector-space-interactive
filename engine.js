/* ============================================================
   engine.js — reusable interactive widgets + helpers
   Every widget is a factory returning an HTMLElement (or wiring
   into a passed element). Pointer events => mouse + touch.
   ============================================================ */
'use strict';

const VS = (() => {

const C = {
  ink:'#22201C', accent:'#E4572E', accentb:'#2A7DE1', accentc:'#17A398',
  accentd:'#9B5DE5', gold:'#F2A900', muted:'#8A857C', soft:'#EDE7DD',
  softline:'#D8D0C4', paper:'#FAF7F2', dark:'#2B2A28', green:'#4CAF6D'
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const fmt=(x,d=2)=>Number.isInteger(x)?String(x):x.toFixed(d);

/* small DOM helper */
function el(tag, cls, html){
  const e=document.createElement(tag);
  if(cls) e.className=cls;
  if(html!=null) e.innerHTML=html;
  return e;
}

/* ---------- device-pixel-ratio aware canvas ---------- */
function hidpi(canvas){
  const dpr=window.devicePixelRatio||1;
  const w=canvas.width, h=canvas.height;
  canvas.style.width=w+'px'; canvas.style.height=h+'px';
  canvas.width=w*dpr; canvas.height=h*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  canvas._logicalW=w; canvas._logicalH=h;
  return ctx;
}

/* =========================================================
   KNOB — vertical draggable control
   opts:{label,color,min,max,value,integer,onInput}
   ========================================================= */
function knob(opts){
  const {label='',color=C.accent,min=0,max=255,value=0,integer=true,onInput}=opts;
  const wrap=el('div','knob');
  const val=el('div','val'); val.style.color=color;
  const track=el('div','track');
  const fill=el('div','fill'); fill.style.background=color;
  const grip=el('div','grip'); grip.style.borderColor=color;
  const lbl=el('div','lbl',label);
  track.append(fill,grip); wrap.append(val,track,lbl);
  let v=value; const H=150;
  function render(){
    const t=(v-min)/(max-min), y=t*H;
    fill.style.height=y+'px'; grip.style.bottom=y+'px';
    val.textContent=fmt(v); if(onInput)onInput(v);
  }
  function setY(clientY){
    const r=track.getBoundingClientRect();
    let t=clamp((r.bottom-clientY)/r.height,0,1);
    v=min+t*(max-min); if(integer)v=Math.round(v); render();
  }
  let drag=false;
  track.addEventListener('pointerdown',e=>{drag=true;track.setPointerCapture?.(e.pointerId);setY(e.clientY);e.preventDefault();});
  window.addEventListener('pointermove',e=>{if(drag)setY(e.clientY);});
  window.addEventListener('pointerup',()=>drag=false);
  render();
  wrap.api={get:()=>v,set:x=>{v=x;render();}};
  return wrap;
}

/* =========================================================
   VBOARD — a 2D vector board with grid & draggable arrows
   opts:{width,height,unit,arrows:[{x,y,color,label,draggable,fixed}],
         showGrid,onChange, extra(ctx,toPx) }
   Coordinates are math coords; origin center.
   ========================================================= */
function vboard(opts){
  const {width=340,height=340,unit=40,showGrid=true,onChange,extra}=opts;
  const arrows=opts.arrows.map(a=>({draggable:true,...a}));
  const canvas=el('canvas'); canvas.width=width; canvas.height=height;
  const ctx=hidpi(canvas);
  const ox=width/2, oy=height/2;
  const toPx=(x,y)=>[ox+x*unit, oy-y*unit];
  const toMath=(px,py)=>[(px-ox)/unit, -(py-oy)/unit];

  function drawArrow(x,y,color,lw){
    const [ex,ey]=toPx(x,y);
    ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=lw;
    ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(ex,ey); ctx.stroke();
    const a=Math.atan2(ey-oy,ex-ox), s=12;
    if(Math.hypot(ex-ox,ey-oy)>4){
      ctx.beginPath(); ctx.moveTo(ex,ey);
      ctx.lineTo(ex-s*Math.cos(a-0.42),ey-s*Math.sin(a-0.42));
      ctx.lineTo(ex-s*Math.cos(a+0.42),ey-s*Math.sin(a+0.42));
      ctx.closePath(); ctx.fill();
    }
  }
  function render(){
    ctx.clearRect(0,0,width,height);
    if(showGrid){
      ctx.strokeStyle=C.soft; ctx.lineWidth=1;
      for(let gx=ox%unit; gx<width; gx+=unit){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,height);ctx.stroke();}
      for(let gy=oy%unit; gy<height; gy+=unit){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(width,gy);ctx.stroke();}
    }
    ctx.strokeStyle=C.softline; ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(width,oy);ctx.moveTo(ox,0);ctx.lineTo(ox,height);ctx.stroke();
    if(extra) extra(ctx,toPx,arrows);
    arrows.forEach(a=>{
      drawArrow(a.x,a.y,a.color,a.lw||3.5);
      if(a.label){const[lx,ly]=toPx(a.x,a.y);
        ctx.fillStyle=a.color; ctx.font='600 14px '+getComputedStyle(document.body).fontFamily;
        ctx.fillText(a.label, lx+8, ly-6);
        // draggable handle
        if(a.draggable){ctx.beginPath();ctx.arc(lx,ly,7,0,7);ctx.fillStyle=a.color;ctx.globalAlpha=.25;ctx.fill();ctx.globalAlpha=1;}
      }
    });
  }
  let dragIdx=-1;
  function pick(px,py){
    for(let i=arrows.length-1;i>=0;i--){
      if(!arrows[i].draggable) continue;
      const [ex,ey]=toPx(arrows[i].x,arrows[i].y);
      if(Math.hypot(px-ex,py-ey)<20) return i;
    }
    return -1;
  }
  function evt(e){const r=canvas.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];}
  canvas.addEventListener('pointerdown',e=>{const[px,py]=evt(e);dragIdx=pick(px,py);
    if(dragIdx>=0){canvas.setPointerCapture?.(e.pointerId);e.preventDefault();}});
  canvas.addEventListener('pointermove',e=>{
    const[px,py]=evt(e);
    canvas.style.cursor = pick(px,py)>=0 ? 'grab':'default';
    if(dragIdx>=0){
      let[mx,my]=toMath(px,py);
      if(opts.snap){mx=Math.round(mx*2)/2;my=Math.round(my*2)/2;}
      arrows[dragIdx].x=clamp(mx,-width/2/unit,width/2/unit);
      arrows[dragIdx].y=clamp(my,-height/2/unit,height/2/unit);
      render(); if(onChange)onChange(arrows);
    }
  });
  window.addEventListener('pointerup',()=>dragIdx=-1);
  render(); if(onChange)onChange(arrows);
  canvas.api={render,arrows,toPx};
  return canvas;
}

/* =========================================================
   NARRATE — a live dark narration strip
   ========================================================= */
function narrate(initial=''){
  const n=el('div','narrate',initial);
  n.say=html=>n.innerHTML=html;
  return n;
}

/* =========================================================
   RANGE control row
   ========================================================= */
function rangeRow(opts){
  const {label,min,max,step=1,value,fmt:f=(v)=>v,onInput}=opts;
  const row=el('div','controls');
  const lab=el('label'); lab.innerHTML=`${label} <span class="big"></span>`;
  const span=lab.querySelector('.big');
  const inp=el('input'); inp.type='range'; inp.min=min;inp.max=max;inp.step=step;inp.value=value;
  span.textContent=f(value);
  inp.addEventListener('input',()=>{span.textContent=f(parseFloat(inp.value));onInput(parseFloat(inp.value));});
  row.append(lab,inp);
  row.input=inp; row.setVal=v=>{inp.value=v;span.textContent=f(v);onInput(v);};
  return row;
}

/* =========================================================
   QUIZ — multiple choice with feedback
   opts:{question, options:[{t,ok,why}], onSolved}
   ========================================================= */
function quiz(opts){
  const box=el('div','quiz');
  box.append(el('div','q',opts.question));
  const fb=el('div','quiz-fb');
  let solved=false;
  opts.options.forEach(o=>{
    const b=el('button','opt',o.t);
    b.onclick=()=>{
      if(solved && o.ok) return;
      if(o.ok){
        b.classList.add('correct'); b.insertAdjacentHTML('beforeend','<span class="mark">✓</span>');
        fb.innerHTML=`<span class="g" style="color:var(--green);font-weight:700">Yes.</span> ${o.why||''}`;
        solved=true; if(opts.onSolved)opts.onSolved();
      }else{
        b.classList.add('wrong'); b.insertAdjacentHTML('beforeend','<span class="mark">✗</span>');
        fb.innerHTML=`<span style="color:var(--accent);font-weight:700">Not quite.</span> ${o.why||''}`;
      }
    };
    box.append(b);
  });
  box.append(fb);
  return box;
}

/* =========================================================
   ANIMATED LIST-ADD
   opts:{items,a,b,onDone}
   ========================================================= */
function listAdd(opts){
  const {items,a,b}=opts;
  const wrap=el('div');
  const table=el('table','list');
  const nar=narrate('Press <b>Add</b> and follow the glowing line.');
  const controls=el('div','controls');
  const go=el('button','btn','▶ Add, line by line');
  const reset=el('button','btn ghost','reset');
  controls.append(go,reset);
  wrap.append(table,controls,nar);
  let shown=items.map(()=>false), timer=null;
  function build(){
    let h='<tr><th></th><th style="color:var(--accent)">yours</th><th style="color:var(--accentb)">theirs</th><th class="sum">total</th></tr>';
    items.forEach((it,i)=>{h+=`<tr class="lrow" data-i="${i}"><td>${it}</td><td>${a[i]}</td><td>${b[i]}</td><td class="sum">${shown[i]?a[i]+b[i]:'·'}</td></tr>`;});
    table.innerHTML=h;
  }
  function clearLit(){table.querySelectorAll('.lrow').forEach(r=>r.classList.remove('lit'));}
  function doReset(){if(timer)clearInterval(timer);shown=items.map(()=>false);build();clearLit();
    nar.say('Press <b>Add</b> and follow the glowing line.');}
  go.onclick=()=>{doReset();let i=0;
    timer=setInterval(()=>{clearLit();
      if(i>=items.length){clearInterval(timer);
        const va=`(${a.join(', ')})`,vb=`(${b.join(', ')})`,vs=`(${a.map((x,k)=>x+b[k]).join(', ')})`;
        nar.say(`<span class="g">Done.</span> ${va} + ${vb} = <b>${vs}</b>. Each line added by itself — the eggs never touched the milk.`);
        return;}
      shown[i]=true;build();
      const row=table.querySelector(`.lrow[data-i="${i}"]`); if(row)row.classList.add('lit');
      nar.say(`Line <span class="k">${items[i]}</span>: ${a[i]} + ${b[i]} = <b>${a[i]+b[i]}</b>. Nothing else on the list moved.`);
      i++;
    },620);
  };
  reset.onclick=doReset;
  build();
  return wrap;
}

/* =========================================================
   ORTHOGONALITY sampler (histogram of random pair angles)
   ========================================================= */
function randUnit(n){let v=new Array(n),s=0;
  for(let i=0;i<n;i++){let u1=Math.random()||1e-9,u2=Math.random();
    let g=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);v[i]=g;s+=g*g;}
  s=Math.sqrt(s)||1;for(let i=0;i<n;i++)v[i]/=s;return v;}

function orthoLab(){
  const wrap=el('div');
  const canvas=el('canvas');canvas.width=440;canvas.height=200;
  const ctx=hidpi(canvas);
  const nar=narrate('');
  const PAIRS=1500,BINS=36,W=440,H=200,PAD=34;
  let dim=3;
  const row=rangeRow({label:'dimension',min:2,max:1000,step:1,value:3,onInput:v=>{dim=v;render();}});
  const resample=el('button','btn','↻ new random arrows');
  resample.onclick=render;
  const ctrls=el('div','controls');ctrls.append(resample);
  function sample(n){const bins=new Array(BINS).fill(0);let dev=0;
    for(let p=0;p<PAIRS;p++){const a=randUnit(n),b=randUnit(n);let d=0;
      for(let i=0;i<n;i++)d+=a[i]*b[i];
      const ang=Math.acos(clamp(d,-1,1))*180/Math.PI;
      let bi=clamp(Math.floor(ang/180*BINS),0,BINS-1);bins[bi]++;dev+=Math.abs(90-ang);}
    return{bins,dev:dev/PAIRS};}
  function render(){
    const{bins,dev}=sample(dim),max=Math.max(...bins,1);
    ctx.clearRect(0,0,W,H);
    const plotW=W-PAD*2,plotH=H-PAD-16,x0=PAD,y0=H-PAD;
    ctx.strokeStyle=C.softline;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+plotW,y0);ctx.stroke();
    const x90=x0+plotW*.5;
    ctx.strokeStyle=C.accentd;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(x90,y0);ctx.lineTo(x90,PAD-8);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=C.accentd;ctx.font='12px sans-serif';ctx.fillText('90°',x90-9,PAD-11);
    ctx.fillStyle=C.muted;ctx.fillText('0°',x0-3,y0+14);ctx.fillText('180°',x0+plotW-18,y0+14);
    const bw=plotW/BINS;
    for(let i=0;i<BINS;i++){const h=bins[i]/max*plotH,cx=x0+i*bw;
      const centre=Math.abs((i+.5)/BINS*180-90);
      ctx.fillStyle=centre<15?C.accentc:C.accentb;ctx.globalAlpha=.9;
      ctx.fillRect(cx+1,y0-h,bw-2,h);ctx.globalAlpha=1;}
    const verdict = dim<=3?'random angles — anything goes':
                    dim<50?'starting to bunch toward 90°…':
                    'almost every pair is nearly perpendicular!';
    nar.say(`n = <span class="k">${dim}</span>: a typical random pair sits <b>${dev.toFixed(1)}°</b> from a right angle. <span class="g">${verdict}</span>`);
  }
  wrap.append(canvas,row,ctrls,nar);render();
  return wrap;
}

/* =========================================================
   NUMBERLINE — 1D vector as a point/arrow on a line
   opts:{value,min,max,onChange}
   ========================================================= */
function numberline(opts){
  const {min=-6,max=6}=opts; let v=opts.value??2;
  const W=460,H=90; const canvas=el('canvas');canvas.width=W;canvas.height=H;
  const ctx=hidpi(canvas);
  const pad=30, y=H/2;
  const toPx=x=>pad+(x-min)/(max-min)*(W-2*pad);
  const toMath=px=>clamp(min+(px-pad)/(W-2*pad)*(max-min),min,max);
  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.softline;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad,y);ctx.stroke();
    for(let t=Math.ceil(min);t<=max;t++){const px=toPx(t);
      ctx.strokeStyle=C.softline;ctx.beginPath();ctx.moveTo(px,y-5);ctx.lineTo(px,y+5);ctx.stroke();
      ctx.fillStyle=C.muted;ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillText(t,px,y+20);}
    // arrow from 0 to v
    const z=toPx(0),p=toPx(v);
    ctx.strokeStyle=C.accent;ctx.fillStyle=C.accent;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(z,y-14);ctx.lineTo(p,y-14);ctx.stroke();
    const dir=v>=0?1:-1,s=8;
    ctx.beginPath();ctx.moveTo(p,y-14);ctx.lineTo(p-dir*s,y-14-5);ctx.lineTo(p-dir*s,y-14+5);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.arc(p,y,6,0,7);ctx.fill();
    ctx.fillStyle=C.accent;ctx.font='700 13px sans-serif';ctx.textAlign='center';ctx.fillText('v = '+fmt(v),p,y-24);
  }
  let drag=false;
  const ev=e=>{const r=canvas.getBoundingClientRect();return e.clientX-r.left;};
  canvas.addEventListener('pointerdown',e=>{drag=true;canvas.setPointerCapture?.(e.pointerId);v=Math.round(toMath(ev(e))*2)/2;render();opts.onChange&&opts.onChange(v);e.preventDefault();});
  canvas.addEventListener('pointermove',e=>{if(drag){v=Math.round(toMath(ev(e))*2)/2;render();opts.onChange&&opts.onChange(v);}});
  window.addEventListener('pointerup',()=>drag=false);
  render();opts.onChange&&opts.onChange(v);
  canvas.api={get:()=>v,set:x=>{v=x;render();}};
  return canvas;
}

/* =========================================================
   BOARD3D — a rotatable 3D axis box with one draggable-ish vector.
   Rotation via drag; vector set by sliders elsewhere.
   opts:{vec:{x,y,z}, width,height}
   Returns canvas with api.setVec / api.render
   ========================================================= */
function board3d(opts){
  const W=opts.width||340,H=opts.height||300;
  const canvas=el('canvas');canvas.width=W;canvas.height=H;
  const ctx=hidpi(canvas);
  let yaw=-0.6, pitch=0.5, scale=opts.scale||34;
  let vec=opts.vec||{x:2,y:1,z:1.5};
  const cx=W/2, cy=H/2+10;
  function proj(x,y,z){
    // rotate around y (yaw) then x (pitch), simple orthographic
    let X=x*Math.cos(yaw)+z*Math.sin(yaw);
    let Z=-x*Math.sin(yaw)+z*Math.cos(yaw);
    let Y=y*Math.cos(pitch)-Z*Math.sin(pitch);
    return [cx+X*scale, cy-Y*scale];
  }
  function line(a,b,color,lw,dash){ctx.strokeStyle=color;ctx.lineWidth=lw||1.5;
    ctx.setLineDash(dash||[]);ctx.beginPath();const p=proj(...a),q=proj(...b);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.setLineDash([]);}
  function arrow(a,b,color,lw){line(a,b,color,lw);const p=proj(...a),q=proj(...b);
    const ang=Math.atan2(q[1]-p[1],q[0]-p[0]),s=10;ctx.fillStyle=color;
    ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]-s*Math.cos(ang-0.4),q[1]-s*Math.sin(ang-0.4));
    ctx.lineTo(q[0]-s*Math.cos(ang+0.4),q[1]-s*Math.sin(ang+0.4));ctx.closePath();ctx.fill();}
  function label(a,txt,color){const p=proj(...a);ctx.fillStyle=color;ctx.font='600 12px sans-serif';ctx.textAlign='left';ctx.fillText(txt,p[0]+5,p[1]-3);}
  function render(){
    ctx.clearRect(0,0,W,H);
    const A=4;
    line([-A,0,0],[A,0,0],C.softline,1); line([0,-A,0],[0,A,0],C.softline,1); line([0,0,-A],[0,0,A],C.softline,1);
    label([A,0,0],'x',C.muted);label([0,A,0],'y (up)',C.muted);label([0,0,A],'z',C.muted);
    // box showing the three components
    const {x,y,z}=vec;
    line([0,0,0],[x,0,0],C.accentb,2);
    line([x,0,0],[x,0,z],C.accentd,2);
    line([x,0,z],[x,y,z],C.accentc,2);
    line([0,0,0],[x,0,z],C.softline,1,[3,3]);
    arrow([0,0,0],[x,y,z],C.accent,3);
    label([x,y,z],`(${fmt(x)}, ${fmt(y)}, ${fmt(z)})`,C.accent);
  }
  let drag=false,lx=0,ly=0;
  canvas.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture?.(e.pointerId);canvas.style.cursor='grabbing';e.preventDefault();});
  canvas.addEventListener('pointermove',e=>{if(drag){yaw+=(e.clientX-lx)*0.01;pitch=clamp(pitch+(e.clientY-ly)*0.01,-1.3,1.3);lx=e.clientX;ly=e.clientY;render();}});
  window.addEventListener('pointerup',()=>{drag=false;canvas.style.cursor='grab';});
  canvas.style.cursor='grab';
  render();
  canvas.api={setVec:v=>{vec=v;render();},render};
  return canvas;
}

/* =========================================================
   SPANBOARD — 2D board that SHADES the span of 1 or 2 vectors
   opts:{arrows:[...], onChange}
   ========================================================= */
function spanBoard(opts){
  return vboard(Object.assign({},opts,{extra:(ctx,toPx,arrows)=>{
    const W=680,H=680; // large fill via clip on the visible canvas is enough
    if(arrows.length>=2){
      const a=arrows[0],b=arrows[1];
      const cross=a.x*b.y-a.y*b.x;
      const [ox,oy]=toPx(0,0);
      if(Math.abs(cross)<0.2){
        // span is a line
        const ang=Math.atan2(a.y||b.y,a.x||b.x),far=700;
        ctx.strokeStyle=C.accent;ctx.globalAlpha=.18;ctx.lineWidth=16;
        ctx.beginPath();ctx.moveTo(ox-far*Math.cos(ang),oy+far*Math.sin(ang));
        ctx.lineTo(ox+far*Math.cos(ang),oy-far*Math.sin(ang));ctx.stroke();ctx.globalAlpha=1;
      }else{
        // span is whole plane -> tint background
        ctx.fillStyle=C.accent;ctx.globalAlpha=.07;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.globalAlpha=1;
      }
    }
    if(opts.extra)opts.extra(ctx,toPx,arrows);
  }}));
}

/* =========================================================
   FOURREP — show ONE 2D vector as list + arrow + knobs + point,
   all synced. The spine of the whole course.
   opts:{x,y}
   ========================================================= */
function fourRep(opts){
  const state={x:opts.x??3,y:opts.y??2};
  let ready=false;
  const wrap=el('div');wrap.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px';
  const listCard=el('div');listCard.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:10px;padding:12px';
  const board=vboard({width:200,height:200,unit:26,arrows:[{x:state.x,y:state.y,color:C.accent,label:'v'}],snap:true,onChange:a=>{if(!ready)return;state.x=a[0].x;state.y=a[0].y;sync('arrow');}});
  const boardCard=el('div');boardCard.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:10px;padding:8px;display:grid;place-items:center';boardCard.append(board);
  const knobCard=el('div');knobCard.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:10px;padding:12px;display:grid;place-items:center';
  const knobs=el('div','knobs');
  const kx=knob({label:'x',color:C.accentb,min:-6,max:6,value:state.x,onInput:v=>{if(!ready)return;state.x=v;sync('knob');}});
  const ky=knob({label:'y',color:C.accentc,min:-6,max:6,value:state.y,onInput:v=>{if(!ready)return;state.y=v;sync('knob');}});
  knobs.append(kx,ky);knobCard.append(knobs);
  const ptCanvas=el('canvas');ptCanvas.width=200;ptCanvas.height=200;const pctx=hidpi(ptCanvas);
  const ptCard=el('div');ptCard.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:10px;padding:8px;display:grid;place-items:center';ptCard.append(ptCanvas);
  function drawPoint(){const W=200,H=200,o=W/2,u=26;pctx.clearRect(0,0,W,H);
    pctx.strokeStyle=C.soft;for(let g=o%u;g<W;g+=u){pctx.beginPath();pctx.moveTo(g,0);pctx.lineTo(g,H);pctx.stroke();pctx.beginPath();pctx.moveTo(0,g);pctx.lineTo(W,g);pctx.stroke();}
    pctx.strokeStyle=C.softline;pctx.beginPath();pctx.moveTo(0,o);pctx.lineTo(W,o);pctx.moveTo(o,0);pctx.lineTo(o,H);pctx.stroke();
    pctx.fillStyle=C.accent;pctx.beginPath();pctx.arc(o+state.x*u,o-state.y*u,6,0,7);pctx.fill();}
  function sync(src){
    listCard.innerHTML=`<div style="font-size:.72rem;color:var(--muted);font-weight:700;text-transform:uppercase">as a list</div>
      <div style="font-family:var(--mono);font-size:1.4rem;margin-top:8px">(${fmt(state.x)}, ${fmt(state.y)})</div>
      <div style="font-size:.8rem;color:var(--muted);margin-top:6px">x = ${fmt(state.x)}<br>y = ${fmt(state.y)}</div>`;
    if(src!=='arrow'){board.api.arrows[0].x=state.x;board.api.arrows[0].y=state.y;board.api.render();}
    if(src!=='knob'){kx.api.set(state.x);ky.api.set(state.y);}
    drawPoint();
  }
  const l1=el('div');l1.append(listCard);
  wrap.append(l1,boardCard,knobCard,ptCard);
  boardCard.insertAdjacentHTML('afterbegin','<div style="font-size:.72rem;color:var(--muted);font-weight:700;text-transform:uppercase;width:100%">as an arrow</div>');
  knobCard.insertAdjacentHTML('afterbegin','<div style="font-size:.72rem;color:var(--muted);font-weight:700;text-transform:uppercase;width:100%">as knobs</div>');
  ptCard.insertAdjacentHTML('afterbegin','<div style="font-size:.72rem;color:var(--muted);font-weight:700;text-transform:uppercase;width:100%">as a point</div>');
  ready=true; sync('init');
  return wrap;
}

/* =========================================================
   PROJECTION — drag a vector, see its shadow on a fixed direction
   ========================================================= */
function projectionBoard(opts){
  const nar=opts.nar;
  const board=vboard({arrows:[{x:3,y:2,color:C.accent,label:'v'}],snap:true,
    extra:(ctx,toPx,arrows)=>{
      const v=arrows[0]; const dir={x:1,y:0}; // project onto x-axis-ish reference (fixed)
      // reference direction arrow (blue), unit*4
      const [ox,oy]=toPx(0,0);
      const reflen=4;
      ctx.strokeStyle=C.accentb;ctx.lineWidth=3;
      const [rx,ry]=toPx(dir.x*reflen,dir.y*reflen);
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(rx,ry);ctx.stroke();
      // projection scalar = v·dir
      const s=v.x*dir.x+v.y*dir.y;
      const [px,py]=toPx(dir.x*s,dir.y*s);
      // shadow line
      const [vx,vy]=toPx(v.x,v.y);
      ctx.strokeStyle=C.muted;ctx.setLineDash([4,3]);ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(vx,vy);ctx.lineTo(px,py);ctx.stroke();ctx.setLineDash([]);
      // projection vector (teal)
      ctx.strokeStyle=C.accentc;ctx.lineWidth=4;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(px,py);ctx.stroke();
      ctx.fillStyle=C.accentc;ctx.beginPath();ctx.arc(px,py,4,0,7);ctx.fill();
    },
    onChange:a=>{const v=a[0];const s=v.x;
      if(nar)nar.say(`v's shadow on the blue direction has length <span class="k">${fmt(s)}</span> — that's the dot product v·(1,0). The teal arrow is the shadow itself.`);
    }});
  return board;
}

/* =========================================================
   LADDER — climb dimensions, watch the SAME recipe apply
   Shows n knobs; computes length live.
   ========================================================= */
function ladder(){
  const wrap=el('div');
  let n=2; let vals=[3,2];
  const nar=narrate('');
  const knobRow=el('div','knobs');knobRow.style.flexWrap='wrap';
  const ro=el('div','readout','');
  const palette=[C.accent,C.accentb,C.accentc,C.accentd,C.gold,C.green,'#d1495b','#3a86ff'];
  function rebuild(){
    knobRow.innerHTML='';
    while(vals.length<n)vals.push(Math.floor(Math.random()*6)+1);
    vals=vals.slice(0,n);
    vals.forEach((v,i)=>{knobRow.append(knob({label:'n'+(i+1),color:palette[i%palette.length],min:0,max:9,value:v,onInput:val=>{vals[i]=val;upd();}}));});
    upd();
  }
  function upd(){
    const len=Math.sqrt(vals.reduce((s,x)=>s+x*x,0));
    ro.innerHTML=`v = (${vals.join(', ')}) &nbsp;·&nbsp; length = √(${vals.map(x=>x+'²').join('+')}) = <b style="color:var(--accent)">${len.toFixed(2)}</b>`;
    const msg = n<=3?'You can still picture this one.':n<=6?'Past 3 — no picture, but the recipe is identical.':'Way past seeing it — yet adding & measuring feel exactly the same.';
    nar.say(`Dimension <span class="k">${n}</span>. ${msg} <span class="g">Same square-add-root recipe, more terms.</span>`);
  }
  const row=rangeRow({label:'dimension',min:1,max:8,step:1,value:2,onInput:v=>{n=v;rebuild();}});
  wrap.append(row,knobRow,ro,nar);rebuild();
  return wrap;
}

return {C,clamp,lerp,fmt,el,hidpi,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,randUnit,
        numberline,board3d,spanBoard,fourRep,projectionBoard,ladder};
})();
