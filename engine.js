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

/* =========================================================
   WORKED — a step-by-step worked example that reveals one
   line at a time. opts:{title, steps:[html,...], result}
   ========================================================= */
function worked(opts){
  const wrap=el('div');wrap.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:12px;padding:16px 18px;margin:16px 0';
  if(opts.title)wrap.append(el('div',null,`<b style="color:var(--accentb)">Worked example · ${opts.title}</b>`));
  if(opts.prompt)wrap.insertAdjacentHTML('beforeend',`<p style="margin:.4em 0">${opts.prompt}</p>`);
  const stepsBox=el('div');stepsBox.style.cssText='margin-top:8px';wrap.append(stepsBox);
  let shown=0;
  const btn=el('button','btn ghost','reveal next step ▾');
  btn.style.marginTop='10px';
  function showNext(){
    if(shown<opts.steps.length){
      const s=el('div');s.style.cssText='padding:8px 0;border-top:1px dashed var(--softline);animation:fade .3s';
      s.innerHTML=`<span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:var(--accentc);color:#fff;font-size:.75rem;font-weight:700;text-align:center;line-height:22px;margin-right:8px">${shown+1}</span>${opts.steps[shown]}`;
      stepsBox.append(s);shown++;
      if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([s]).catch(()=>{});
    }
    if(shown>=opts.steps.length){
      btn.remove();
      if(opts.result){const r=el('div');r.style.cssText='margin-top:10px;padding:10px 12px;background:var(--soft);border-radius:8px;font-weight:600';
        r.innerHTML='✓ '+opts.result;stepsBox.append(r);
        if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([r]).catch(()=>{});}
    }
  }
  btn.onclick=showNext;wrap.append(btn);
  return wrap;
}

/* =========================================================
   GALLERY — real-world things that are vectors. Clickable
   cards that reveal the vector + its dimension.
   opts:{items:[{icon,name,dims,vec,note}]}
   ========================================================= */
function gallery(items){
  const wrap=el('div');wrap.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0';
  items.forEach(it=>{
    const card=el('div');card.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:12px;padding:14px;cursor:pointer;transition:transform .15s,border-color .15s';
    card.innerHTML=`<div style="font-size:1.7rem">${it.icon}</div>
      <div style="font-weight:700;margin-top:4px">${it.name}</div>
      <div style="font-size:.78rem;color:var(--accentd);font-weight:700">${it.dims}</div>
      <div class="reveal" style="max-height:0;overflow:hidden;transition:max-height .25s">
        <div style="font-family:var(--mono);font-size:.82rem;margin-top:8px;color:var(--ink)">${it.vec}</div>
        <div style="font-size:.78rem;color:var(--muted);margin-top:4px">${it.note}</div></div>
      <div class="hintline" style="font-size:.72rem;color:var(--muted);margin-top:6px">tap to see its vector</div>`;
    let open=false;
    card.onclick=()=>{open=!open;const rv=card.querySelector('.reveal');const hl=card.querySelector('.hintline');
      rv.style.maxHeight=open?'140px':'0';hl.textContent=open?'— it’s a list of numbers':'tap to see its vector';
      card.style.borderColor=open?'var(--accentc)':'var(--softline)';};
    wrap.append(card);
  });
  return wrap;
}

/* =========================================================
   MATRIXBOARD — apply a 2x2 matrix to the plane. Shows the
   grid deforming + where the basis vectors land.
   opts:{onChange}
   ========================================================= */
function matrixBoard(opts){
  const W=320,H=320,unit=34;const canvas=el('canvas');canvas.width=W;canvas.height=H;const ctx=hidpi(canvas);
  const ox=W/2,oy=H/2;
  let m=[1,0,0,1]; // a,b,c,d  (columns: i-hat=(a,c), j-hat=(b,d))
  const toPx=(x,y)=>[ox+x*unit,oy-y*unit];
  function apply(x,y){return [m[0]*x+m[1]*y, m[2]*x+m[3]*y];}
  function render(){
    ctx.clearRect(0,0,W,H);
    // deformed grid
    ctx.lineWidth=1;
    for(let i=-6;i<=6;i++){
      ctx.strokeStyle=(i===0)?C.softline:C.soft;
      // vertical line x=i -> from (i,-6) to (i,6) transformed
      let p=apply(i,-6),q=apply(i,6);let[px,py]=toPx(p[0],p[1]),[qx,qy]=toPx(q[0],q[1]);
      ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(qx,qy);ctx.stroke();
      p=apply(-6,i);q=apply(6,i);[px,py]=toPx(p[0],p[1]);[qx,qy]=toPx(q[0],q[1]);
      ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(qx,qy);ctx.stroke();
    }
    // basis vectors
    function arr(vx,vy,color,label){const[ex,ey]=toPx(vx,vy);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ex,ey);ctx.stroke();
      const a=Math.atan2(ey-oy,ex-ox),s=10;ctx.beginPath();ctx.moveTo(ex,ey);
      ctx.lineTo(ex-s*Math.cos(a-.4),ey-s*Math.sin(a-.4));ctx.lineTo(ex-s*Math.cos(a+.4),ey-s*Math.sin(a+.4));ctx.closePath();ctx.fill();
      ctx.font='600 12px sans-serif';ctx.fillText(label,ex+5,ey-4);}
    arr(m[0],m[2],C.accent,'î');   // where (1,0) lands
    arr(m[1],m[3],C.accentb,'ĵ');  // where (0,1) lands
  }
  function set(a,b,c,d){m=[a,b,c,d];render();
    if(opts&&opts.onChange){const det=a*d-b*c;opts.onChange(m,det);}}
  render();canvas.api={set,render,get:()=>m};
  return canvas;
}

/* =========================================================
   ANALOGY — king - man + woman ≈ queen, as vector arithmetic
   Purely illustrative with toy 2D coords.
   ========================================================= */
function analogyDemo(){
  const wrap=el('div');
  const W=380,H=280;const canvas=el('canvas');canvas.width=W;canvas.height=H;const ctx=hidpi(canvas);
  // toy 'semantic' coordinates: x = royalty, y = gender(+male/-female)
  const words={man:[1,1.6],woman:[1,-1.6],king:[3.4,1.6],queen:[3.4,-1.6]};
  const nar=narrate('');
  function px(v){return [30+v[0]*70, H/2 - v[1]*60];}
  function dot(v,label,color){const[x,y]=px(v);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();
    ctx.font='600 13px sans-serif';ctx.fillText(label,x+9,y+4);}
  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.soft;ctx.beginPath();ctx.moveTo(20,H/2);ctx.lineTo(W-10,H/2);ctx.stroke();
    ctx.fillStyle=C.muted;ctx.font='11px sans-serif';ctx.fillText('more royal →',W-95,H/2+16);
    dot(words.man,'man',C.accentb);dot(words.woman,'woman',C.accentc);
    dot(words.king,'king',C.accent);dot(words.queen,'queen',C.accentd);
    // king - man + woman
    const res=[words.king[0]-words.man[0]+words.woman[0], words.king[1]-words.man[1]+words.woman[1]];
    const[rx,ry]=px(res);ctx.strokeStyle=C.gold;ctx.setLineDash([4,3]);ctx.lineWidth=2;
    const[kx,ky]=px(words.king);ctx.beginPath();ctx.arc(rx,ry,11,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=C.gold;ctx.font='600 12px sans-serif';ctx.fillText('king−man+woman',rx+14,ry);
    nar.say(`Compute <span class="k">king − man + woman</span> line by line → (${res[0].toFixed(1)}, ${res[1].toFixed(1)}). That lands right on <b style="color:var(--accentd)">queen</b>. The “male→female” step is one fixed vector — subtract it from king, get queen.`);
  }
  render();wrap.append(canvas,nar);return wrap;
}

/* =========================================================
   CONFIGSPACE — a tiny 2x2 black/white image space.
   Click pixels to toggle; shows which of the 16 possible
   images you're on, laid out as a gallery of all points.
   ========================================================= */
function configSpace(){
  const wrap=el('div');
  const nar=narrate('Click the four pixels to build an image. There are only 16 possible.');
  // editable 2x2
  const edit=el('canvas');edit.width=120;edit.height=120;const ectx=hidpi(edit);
  let bits=[0,0,0,0]; // 4 pixels, row-major
  function drawEdit(){for(let i=0;i<4;i++){const x=i%2,y=(i>>1);ectx.fillStyle=bits[i]?'#fff':'#222';
    ectx.fillRect(x*60,y*60,60,60);ectx.strokeStyle=C.softline;ectx.lineWidth=2;ectx.strokeRect(x*60,y*60,60,60);}}
  edit.addEventListener('pointerdown',e=>{const r=edit.getBoundingClientRect();const x=Math.floor((e.clientX-r.left)/60),y=Math.floor((e.clientY-r.top)/60);
    const i=y*2+x;if(i>=0&&i<4){bits[i]^=1;drawEdit();update();}});
  // gallery of all 16
  const gal=el('div');gal.style.cssText='display:grid;grid-template-columns:repeat(8,1fr);gap:5px;margin-top:10px';
  const cells=[];
  for(let n=0;n<16;n++){const c=el('canvas');c.width=34;c.height=34;const cx=hidpi(c);
    for(let i=0;i<4;i++){const b=(n>>i)&1;const x=i%2,y=(i>>1);cx.fillStyle=b?'#fff':'#222';cx.fillRect(x*17,y*17,17,17);}
    c.style.cssText='border-radius:4px;cursor:pointer;outline:2px solid transparent';
    c.onclick=()=>{bits=[0,1,2,3].map(i=>(n>>i)&1);drawEdit();update();};
    cells.push(c);gal.append(c);}
  function idx(){return bits[0]|(bits[1]<<1)|(bits[2]<<2)|(bits[3]<<3);}
  function update(){const k=idx();cells.forEach((c,n)=>c.style.outlineColor=n===k?C.accent:'transparent');
    nar.say(`You're on image <span class="k">#${k}</span> of 16. Each of the 16 squares below is <em>one point</em> in this tiny image-space — the whole space fits on your screen.`);}
  const lab1=el('div',null,'<b>your image</b> (click a pixel)');lab1.style.cssText='font-size:.8rem;color:var(--muted);margin-bottom:4px';
  const lab2=el('div',null,'<b>the entire space</b> — all 16 possible images (click one)');lab2.style.cssText='font-size:.8rem;color:var(--muted);margin:10px 0 0';
  wrap.append(lab1,edit,lab2,gal,nar);drawEdit();update();
  return wrap;
}

/* =========================================================
   POSSIBILITYCOUNTER — slide pixels & levels, watch the
   count of possible images explode (log-scaled bar + text).
   ========================================================= */
function possibilityCounter(){
  const wrap=el('div');const nar=narrate('');
  let pixels=4, levels=2;
  function bignum(base,exp){
    // returns human string for base^exp
    const log10=exp*Math.log10(base);
    if(log10<15){return Math.round(Math.pow(base,exp)).toLocaleString();}
    const mant=Math.pow(10,log10-Math.floor(log10));
    return mant.toFixed(2)+' × 10^'+Math.floor(log10);
  }
  const out=el('div','readout','');
  function upd(){const log10=pixels*Math.log10(levels);
    out.innerHTML=`${levels}<sup>${pixels}</sup> = <b style="color:var(--accent)">${bignum(levels,pixels)}</b> possible images`;
    let cmp='';
    if(log10>80)cmp=' — more than the number of atoms in the observable universe (~10⁸⁰).';
    else if(log10>18)cmp=' — more than all grains of sand on Earth.';
    else if(log10>9)cmp=' — more than the population of Earth.';
    nar.say(`${pixels} pixels, ${levels} levels each → <span class="k">${bignum(levels,pixels)}</span> possible images${cmp} <span class="g">Each is one point in the space.</span>`);}
  const r1=rangeRow({label:'pixels',min:1,max:1000,step:1,value:4,onInput:v=>{pixels=v;upd();}});
  const r2=rangeRow({label:'brightness levels each',min:2,max:256,step:1,value:2,onInput:v=>{levels=v;upd();}});
  wrap.append(r1,r2,out,nar);upd();return wrap;
}

/* =========================================================
   MORPHPATH — slide from photo A to photo B and watch the
   image travel through the space along a straight line.
   Uses two tiny generated 'photos' (gradient blobs).
   ========================================================= */
function morphPath(){
  const wrap=el('div');const nar=narrate('');
  const N=16;const A=[],B=[];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    A.push(clamp(255*(0.5+0.5*Math.sin(x/2.5)*Math.cos(y/3)),0,255));
    B.push(clamp(255*(0.5+0.5*Math.cos(x/3)*Math.sin(y/2.2)),0,255));}
  const cv=el('canvas');cv.width=180;cv.height=180;const ctx=hidpi(cv);const cell=180/N;
  const cvA=el('canvas');cvA.width=70;cvA.height=70;const ca=hidpi(cvA);
  const cvB=el('canvas');cvB.width=70;cvB.height=70;const cb=hidpi(cvB);
  function paint(c,data,size){const cl=size/N;for(let i=0;i<N*N;i++){const x=i%N,y=(i/N)|0;const v=Math.round(data[i]);
    c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(x*cl,y*cl,cl+.5,cl+.5);}}
  paint(ca,A,70);paint(cb,B,70);
  function draw(t){const cur=A.map((a,i)=>a+(B[i]-a)*t);paint(ctx,cur,180);
    nar.say(`You're at <span class="k">A + ${t.toFixed(2)}·(B−A)</span>. At t=0 you're exactly on photo A; at t=1, photo B. Every value between is a <em>real image</em> — a point on the straight path connecting them through the space.`);}
  const row=rangeRow({label:'position on the path A→B',min:0,max:1,step:.02,value:0,fmt:v=>'t = '+v.toFixed(2),onInput:draw});
  const strip=el('div');strip.style.cssText='display:flex;align-items:center;gap:12px;margin-top:8px';
  const tagA=el('div',null,'A');tagA.style.cssText='font-weight:700;color:var(--accentb)';
  const tagB=el('div',null,'B');tagB.style.cssText='font-weight:700;color:var(--accentc)';
  strip.append(tagA,cvA,cv,cvB,tagB);
  wrap.append(row,strip,nar);draw(0);return wrap;
}

/* =========================================================
   DIFFVECTOR — two small images + their difference shown as
   a per-pixel signed heatmap = the vector B - A.
   ========================================================= */
function diffVector(){
  const wrap=el('div');const nar=narrate('');
  const N=8;
  const A=[],B=[];
  for(let i=0;i<N*N;i++){const x=i%N,y=(i/N)|0;A.push(80+40*Math.sin(x/1.5));B.push(80+40*Math.sin(x/1.5)+30);} // B = A brighter
  function mk(size){const c=el('canvas');c.width=size;c.height=size;return c;}
  const cA=mk(96),cB=mk(96),cD=mk(96);
  const xa=hidpi(cA),xb=hidpi(cB),xd=hidpi(cD);const cell=96/N;
  function gray(ctx,data){for(let i=0;i<N*N;i++){const x=i%N,y=(i/N)|0;const v=clamp(Math.round(data[i]),0,255);ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}}
  function diff(ctx){for(let i=0;i<N*N;i++){const x=i%N,y=(i/N)|0;const d=B[i]-A[i];
    ctx.fillStyle=d>0?`rgba(228,87,46,${clamp(Math.abs(d)/60,0,1)})`:d<0?`rgba(42,125,225,${clamp(Math.abs(d)/60,0,1)})`:'#eee';
    ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}}
  gray(xa,A);gray(xb,B);diff(xd);
  const row=el('div');row.style.cssText='display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px';
  function tag(t){const d=el('div',null,t);d.style.cssText='font-size:.8rem;color:var(--muted);text-align:center';return d;}
  const wrapCanvas=(c,label)=>{const box=el('div');box.style.cssText='text-align:center';box.append(c,tag(label));return box;};
  row.append(wrapCanvas(cA,'photo A'),el('div',null,'<b>→ B−A →</b>'),wrapCanvas(cB,'photo B'),el('div',null,'<b>=</b>'),wrapCanvas(cD,'the difference vector'));
  nar.say('B is just A with every pixel brightened. So <span class="k">B−A</span> is almost all the same value — a vector that means <b>“brighten.”</b> Orange = pixel went up. That single arrow is a <em>direction</em> in image-space.');
  wrap.append(row,nar);return wrap;
}

/* =========================================================
   WEBGRAPH — nodes (photos/cities) connected by weighted
   relationships. Illustrates 'space = things + relations'.
   opts:{nodes:[{label,color}], edges:[[i,j,w]], caption}
   ========================================================= */
function webGraph(opts){
  const W=380,H=260;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const n=opts.nodes.length;const pos=opts.nodes.map((nd,i)=>{const a=-Math.PI/2+i/n*2*Math.PI;return [W/2+Math.cos(a)*95, H/2+Math.sin(a)*80];});
  let showEdges=true;
  function render(){ctx.clearRect(0,0,W,H);
    if(showEdges)opts.edges.forEach(([i,j,w])=>{ctx.strokeStyle=C.softline;ctx.lineWidth=clamp(w,1,6);
      ctx.beginPath();ctx.moveTo(pos[i][0],pos[i][1]);ctx.lineTo(pos[j][0],pos[j][1]);ctx.stroke();
      const mx=(pos[i][0]+pos[j][0])/2,my=(pos[i][1]+pos[j][1])/2;ctx.fillStyle=C.muted;ctx.font='10px sans-serif';
      if(opts.edgeLabels)ctx.fillText(opts.edgeLabels[opts.edges.indexOf(opts.edges.find(e=>e[0]===i&&e[1]===j))]||'',mx,my);});
    opts.nodes.forEach((nd,i)=>{ctx.fillStyle=nd.color||C.accent;ctx.beginPath();ctx.arc(pos[i][0],pos[i][1],10,0,7);ctx.fill();
      ctx.fillStyle=C.ink;ctx.font='600 12px sans-serif';ctx.fillText(nd.label,pos[i][0]+13,pos[i][1]+4);});}
  const btn=el('button','btn ghost','delete all the relationships');
  const nar=narrate(opts.caption||'');
  btn.onclick=()=>{showEdges=!showEdges;render();
    btn.textContent=showEdges?'delete all the relationships':'restore the relationships';
    nar.say(showEdges?(opts.caption||''):'<span class="r">The dots are still here — but the space is gone.</span> With no relationships there’s no distance, no direction, no “near.” The web <em>was</em> the space, not the dots.');};
  const wrap=el('div');const ctr=el('div','controls');ctr.append(btn);wrap.append(cv,ctr,nar);render();return wrap;
}

/* =========================================================
   MATRIXGRID — an editable grid of numbers. opts:{rows,cols,
   values, onChange, labels}. Returns {el, get, set}.
   ========================================================= */
function matrixGrid(opts){
  const {rows,cols}=opts; let V=opts.values?opts.values.map(r=>r.slice()):Array.from({length:rows},()=>Array(cols).fill(0));
  const wrap=el('div');wrap.style.cssText='display:inline-flex;align-items:center;gap:6px;margin:6px 0';
  const brL=el('div');brL.style.cssText='width:8px;align-self:stretch;border:2px solid var(--ink);border-right:none;border-radius:3px 0 0 3px';
  const grid=el('div');grid.style.cssText=`display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px`;
  const brR=el('div');brR.style.cssText='width:8px;align-self:stretch;border:2px solid var(--ink);border-left:none;border-radius:0 3px 3px 0';
  const inputs=[];
  for(let i=0;i<rows;i++){inputs[i]=[];for(let j=0;j<cols;j++){
    const inp=el('input');inp.type='number';inp.value=V[i][j];
    inp.style.cssText='width:52px;text-align:center;padding:6px 2px;border:1px solid var(--softline);border-radius:6px;font-family:var(--mono);font-size:.95rem';
    inp.addEventListener('input',()=>{V[i][j]=parseFloat(inp.value)||0;if(opts.onChange)opts.onChange(getV());});
    inputs[i][j]=inp;grid.append(inp);}}
  wrap.append(brL,grid,brR);
  function getV(){return V.map(r=>r.slice());}
  function setV(nv){V=nv.map(r=>r.slice());for(let i=0;i<rows;i++)for(let j=0;j<cols;j++)inputs[i][j].value=fmt(V[i][j]);}
  return {el:wrap,get:getV,set:setV};
}

/* render a static matrix as a small bracketed table (for steps) */
function matrixHTML(M, highlightCol){
  const cols=M[0].length;
  let inner=M.map(row=>'<tr>'+row.map((x,j)=>`<td style="padding:2px 9px;text-align:right;font-family:var(--mono);${j===highlightCol?'background:#FFF3C4;border-radius:4px':''}">${LA.fmtNum(x)}</td>`).join('')+'</tr>').join('');
  return `<span style="display:inline-flex;align-items:stretch;gap:4px;vertical-align:middle">
    <span style="width:7px;border:2px solid var(--ink);border-right:none;border-radius:3px 0 0 3px"></span>
    <table style="border-collapse:collapse">${inner}</table>
    <span style="width:7px;border:2px solid var(--ink);border-left:none;border-radius:0 3px 3px 0"></span></span>`;
}

/* =========================================================
   RREFSTEPPER — shows Gaussian elimination one step at a time
   on an editable matrix (augmented allowed).
   opts:{rows,cols,values, augcol(optional index of | line)}
   ========================================================= */
function rrefStepper(opts){
  const wrap=el('div');
  const grid=matrixGrid({rows:opts.rows,cols:opts.cols,values:opts.values});
  const nar=narrate('Edit the matrix, then step through the elimination.');
  const stepBox=el('div');stepBox.style.cssText='margin-top:10px';
  const ctr=el('div','controls');
  const runBtn=el('button','btn','▶ run elimination');
  const nextBtn=el('button','btn ghost','next step');nextBtn.disabled=true;
  const allBtn=el('button','btn ghost','show all');allBtn.disabled=true;
  ctr.append(runBtn,nextBtn,allBtn);
  let steps=[],cur=0;
  function showStep(k){
    stepBox.innerHTML='';
    for(let s=0;s<=k && s<steps.length;s++){
      const row=el('div');row.style.cssText='display:flex;align-items:center;gap:12px;margin:8px 0;opacity:'+(s===k?'1':'.65');
      row.innerHTML=`<div style="font-size:.85rem;color:var(--muted);min-width:150px">${steps[s].desc}</div>${matrixHTML(steps[s].matrix)}`;
      stepBox.append(row);
    }
    if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([stepBox]).catch(()=>{});
  }
  runBtn.onclick=()=>{const res=LA.rrefSteps(grid.get());steps=res.steps;cur=0;showStep(0);
    nextBtn.disabled=false;allBtn.disabled=false;
    nar.say(`Elimination has <span class="k">${steps.length}</span> steps. The <b>rank</b> is <b>${res.rank}</b> (number of pivots). Click “next step.”`);};
  nextBtn.onclick=()=>{if(cur<steps.length-1){cur++;showStep(cur);} if(cur>=steps.length-1)nar.say('<span class="g">Reached reduced row echelon form.</span> Each leading 1 is a pivot; pivot columns are independent.');};
  allBtn.onclick=()=>{cur=steps.length-1;showStep(cur);};
  wrap.append(grid.el,ctr,stepBox,nar);
  return wrap;
}

/* =========================================================
   SYSTEMLINES — two equations a x + b y = e as two lines;
   shows their intersection (unique / none / infinite).
   ========================================================= */
function systemLines(){
  const W=320,H=320,unit=28;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2,oy=H/2;
  let eq=[[1,1,3],[1,-1,1]]; // a b e
  const nar=narrate('');
  function drawLine(a,b,e,color){
    // a x + b y = e
    ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.beginPath();
    if(Math.abs(b)>1e-9){const y=x=>(e-a*x)/b;const x0=-8,x1=8;
      ctx.moveTo(ox+x0*unit,oy-y(x0)*unit);ctx.lineTo(ox+x1*unit,oy-y(x1)*unit);}
    else if(Math.abs(a)>1e-9){const x=e/a;ctx.moveTo(ox+x*unit,0);ctx.lineTo(ox+x*unit,H);}
    ctx.stroke();
  }
  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.soft;for(let g=ox%unit;g<W;g+=unit){ctx.beginPath();ctx.moveTo(g,0);ctx.lineTo(g,H);ctx.stroke();}
    for(let g=oy%unit;g<H;g+=unit){ctx.beginPath();ctx.moveTo(0,g);ctx.lineTo(W,g);ctx.stroke();}
    ctx.strokeStyle=C.softline;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.moveTo(ox,0);ctx.lineTo(ox,H);ctx.stroke();
    drawLine(...eq[0],C.accent);drawLine(...eq[1],C.accentb);
    // intersection
    const [a1,b1,e1]=eq[0],[a2,b2,e2]=eq[1];const dt=a1*b2-a2*b1;
    if(Math.abs(dt)>1e-9){const x=(e1*b2-e2*b1)/dt,y=(a1*e2-a2*e1)/dt;
      ctx.fillStyle=C.accentc;ctx.beginPath();ctx.arc(ox+x*unit,oy-y*unit,6,0,7);ctx.fill();
      nar.say(`Lines cross at <span class="k">(${x.toFixed(2)}, ${y.toFixed(2)})</span> — <b>one unique solution.</b> The determinant ${a1}·${b2}−${a2}·${b1} = ${dt} is nonzero, so the lines aren’t parallel.`);}
    else {const parallelSame=Math.abs(e1*b2-e2*b1)<1e-9 && Math.abs(a1*e2-a2*e1)<1e-9;
      nar.say(parallelSame?'<span class="r">Same line — infinitely many solutions.</span> det = 0 and the equations agree.':'<span class="r">Parallel, never meet — no solution.</span> det = 0 means the rows are dependent.');}
  }
  function mk(i){const r=el('div');r.style.cssText='display:flex;gap:6px;align-items:center;font-family:var(--mono);font-size:.9rem';
    const mkI=(idx,val)=>{const inp=el('input');inp.type='number';inp.value=val;inp.style.cssText='width:44px;text-align:center;padding:4px;border:1px solid var(--softline);border-radius:5px';
      inp.addEventListener('input',()=>{eq[i][idx]=parseFloat(inp.value)||0;render();});return inp;};
    r.append(mkI(0,eq[i][0]),el('span',null,'x +'),mkI(1,eq[i][1]),el('span',null,'y ='),mkI(2,eq[i][2]));return r;}
  const controls=el('div');controls.style.cssText='display:flex;flex-direction:column;gap:8px';
  const t1=el('div',null,'<b style="color:var(--accent)">line 1</b>');const t2=el('div',null,'<b style="color:var(--accentb)">line 2</b>');
  controls.append(t1,mk(0),t2,mk(1));
  const wrap=el('div');const s=el('div','stage');const g=el('div','grow');g.append(controls);s.append(cv,g);wrap.append(s,nar);render();
  return wrap;
}

return {C,clamp,lerp,fmt,el,hidpi,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,randUnit,
        numberline,board3d,spanBoard,fourRep,projectionBoard,ladder,
        worked,gallery,matrixBoard,analogyDemo,
        configSpace,possibilityCounter,morphPath,diffVector,webGraph,
        matrixGrid,matrixHTML,rrefStepper,systemLines};
})();
