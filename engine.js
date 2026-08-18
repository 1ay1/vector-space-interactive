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

/* =========================================================
   EIGENEXPLORER — drag a vector v; show A·v. When A·v is
   parallel to v, you've found an eigenvector. Eigenlines drawn.
   ========================================================= */
function eigenExplorer(opts){
  const W=340,H=340,unit=42;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2,oy=H/2;let M=opts.matrix||[[2,1],[1,2]];let v={x:1,y:0.3};
  const nar=narrate('');
  const toPx=(x,y)=>[ox+x*unit,oy-y*unit];
  function arrow(x,y,color,lw,label){const[ex,ey]=toPx(x,y);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ex,ey);ctx.stroke();
    const a=Math.atan2(ey-oy,ex-ox),s=11;ctx.beginPath();ctx.moveTo(ex,ey);
    ctx.lineTo(ex-s*Math.cos(a-.4),ey-s*Math.sin(a-.4));ctx.lineTo(ex-s*Math.cos(a+.4),ey-s*Math.sin(a+.4));ctx.closePath();ctx.fill();
    if(label){ctx.font='600 13px sans-serif';ctx.fillText(label,ex+6,ey-4);}}
  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.soft;for(let g=ox%unit;g<W;g+=unit){ctx.beginPath();ctx.moveTo(g,0);ctx.lineTo(g,H);ctx.stroke();}
    for(let g=oy%unit;g<H;g+=unit){ctx.beginPath();ctx.moveTo(0,g);ctx.lineTo(W,g);ctx.stroke();}
    ctx.strokeStyle=C.softline;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.moveTo(ox,0);ctx.lineTo(ox,H);ctx.stroke();
    // eigenlines
    const e=LA.eig2(M);
    if(e.real){e.vectors.forEach((ev,k)=>{const far=400;ctx.strokeStyle=k===0?'#f2a90055':'#9b5de555';ctx.lineWidth=8;
      ctx.beginPath();ctx.moveTo(ox-ev[0]*far,oy+ev[1]*far);ctx.lineTo(ox+ev[0]*far,oy-ev[1]*far);ctx.stroke();});}
    // v and Av
    const Av={x:M[0][0]*v.x+M[0][1]*v.y, y:M[1][0]*v.x+M[1][1]*v.y};
    arrow(v.x,v.y,C.accentb,3,'v');
    arrow(Av.x,Av.y,C.accent,3,'A·v');
    // parallel check
    const cross=v.x*Av.y-v.y*Av.x;const parallel=Math.abs(cross)<0.06*(Math.hypot(v.x,v.y)*Math.hypot(Av.x,Av.y)+1e-9);
    if(parallel){const lam=(Math.abs(v.x)>Math.abs(v.y))?Av.x/v.x:Av.y/v.y;
      nar.say(`<span class="g">Eigenvector found!</span> A·v is parallel to v — the matrix only <b>stretched</b> it, didn\'t rotate it. The stretch factor is the <b>eigenvalue</b> λ ≈ <span class="k">${lam.toFixed(2)}</span>.`);}
    else nar.say(`A·v points a <em>different</em> way than v — so v is not special. Drag v onto a <span style="color:var(--gold)">gold</span> or <span style="color:var(--accentd)">violet</span> line: those are the eigen-directions the matrix leaves un-rotated.`);
  }
  let drag=false;
  const ev2=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left-ox)/unit,-(e.clientY-r.top-oy)/unit];};
  cv.addEventListener('pointerdown',e=>{drag=true;cv.setPointerCapture?.(e.pointerId);const[x,y]=ev2(e);v={x,y};render();e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(drag){const[x,y]=ev2(e);v={x,y};render();}});
  window.addEventListener('pointerup',()=>drag=false);
  const wrap=el('div');wrap.setMatrix=m=>{M=m;render();};
  const s=el('div','stage');s.append(cv,el('div','grow'));wrap.append(s,nar);render();
  return wrap;
}

/* =========================================================
   DETAREA — show a 2x2 matrix acting on the unit square;
   the transformed area = |det|. Live.
   ========================================================= */
function detArea(){
  const W=320,H=320,unit=52;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2+ -40,oy=H/2+40;let M=[[1,0],[0,1]];
  const nar=narrate('');
  const toPx=(x,y)=>[ox+x*unit,oy-y*unit];
  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.softline;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.moveTo(ox,0);ctx.lineTo(ox,H);ctx.stroke();
    // unit square outline (faint)
    ctx.strokeStyle=C.softline;ctx.setLineDash([4,3]);
    const u=[[0,0],[1,0],[1,1],[0,1]];ctx.beginPath();u.forEach((p,i)=>{const[x,y]=toPx(p[0],p[1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.stroke();ctx.setLineDash([]);
    // transformed square
    const t=u.map(p=>[M[0][0]*p[0]+M[0][1]*p[1], M[1][0]*p[0]+M[1][1]*p[1]]);
    const det=M[0][0]*M[1][1]-M[0][1]*M[1][0];
    ctx.fillStyle=det<0?'rgba(228,87,46,.25)':'rgba(23,163,152,.25)';
    ctx.beginPath();t.forEach((p,i)=>{const[x,y]=toPx(p[0],p[1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.fill();ctx.stroke();
    // basis arrows
    function arr(vx,vy,c){const[ex,ey]=toPx(vx,vy);ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(...toPx(0,0));ctx.lineTo(ex,ey);ctx.stroke();
      const a=Math.atan2(ey-oy,ex-ox);}
    arr(M[0][0],M[1][0],C.accent);arr(M[0][1],M[1][1],C.accentb);
    nar.say(`The unit square (area 1) became a parallelogram of area <b>${Math.abs(det).toFixed(2)}</b>. So <b>det = ${det.toFixed(2)}</b>. ${det<0?'<span class="r">Negative</span> — space got flipped (mirrored).':det===0?'<span class="r">Zero</span> — squashed flat, area gone.':'Positive — orientation preserved.'}`);
  }
  function mk(lbl,i,j,val){const r=el('div');r.style.cssText='display:flex;gap:6px;align-items:center';
    const inp=el('input');inp.type='range';inp.min=-2;inp.max=2;inp.step=.1;inp.value=val;inp.style.width='140px';
    const out=el('span','big');out.textContent=val.toFixed(1);
    inp.addEventListener('input',()=>{M[i][j]=parseFloat(inp.value);out.textContent=(+inp.value).toFixed(1);render();});
    r.append(el('span',null,lbl),inp,out);return r;}
  const controls=el('div');controls.style.cssText='display:flex;flex-direction:column;gap:6px';
  controls.append(mk('a',0,0,1),mk('b',0,1,0),mk('c',1,0,0),mk('d',1,1,1));
  const wrap=el('div');const s=el('div','stage');const g=el('div','grow');g.append(controls);s.append(cv,g);wrap.append(s,nar);render();
  return wrap;
}

/* =========================================================
   LEASTSQUARES — scatter points; drag/fit a line; show that
   the best fit minimizes total squared vertical distance.
   ========================================================= */
function leastSquares(){
  const W=340,H=300,unit=26;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=40,oy=H-40;
  const pts=[[1,1.2],[2,1.9],[3,3.4],[4,3.9],[5,5.3],[6,5.6],[7,7.4]];
  const nar=narrate('');let m=1,b=0,fitted=false;
  function fit(){// least squares slope/intercept
    const n=pts.length;let sx=0,sy=0,sxx=0,sxy=0;
    pts.forEach(([x,y])=>{sx+=x;sy+=y;sxx+=x*x;sxy+=x*y;});
    m=(n*sxy-sx*sy)/(n*sxx-sx*sx);b=(sy-m*sx)/n;fitted=true;render();
    nar.say(`<span class="g">Best-fit line found.</span> It minimizes the total <b>squared vertical distance</b> to the points — that\'s “least squares.” Slope ${m.toFixed(2)}, intercept ${b.toFixed(2)}. This is a projection: the data\'s “shadow” onto the space of straight lines.`);}
  function render(){ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.softline;ctx.beginPath();ctx.moveTo(ox,10);ctx.lineTo(ox,oy);ctx.lineTo(W-10,oy);ctx.stroke();
    // line
    ctx.strokeStyle=C.accentb;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ox,oy-b*unit);ctx.lineTo(ox+8*unit,oy-(m*8+b)*unit);ctx.stroke();
    // residuals + points
    pts.forEach(([x,y])=>{const px=ox+x*unit,py=oy-y*unit,ly=oy-(m*x+b)*unit;
      if(fitted){ctx.strokeStyle='#e4572e88';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,ly);ctx.stroke();}
      ctx.fillStyle=C.accent;ctx.beginPath();ctx.arc(px,py,5,0,7);ctx.fill();});
  }
  const btn=el('button','btn','fit the best line');btn.onclick=fit;
  const wrap=el('div');const s=el('div','stage');const g=el('div','grow');const ctr=el('div','controls');ctr.append(btn);g.append(ctr,nar);s.append(cv,g);wrap.append(s);render();
  return wrap;
}

/* =========================================================
   PCACLOUD — a 2D data cloud; show its principal axes
   (eigenvectors of the covariance). Drag spread to see the
   main direction track the data.
   ========================================================= */
function pcaCloud(){
  const W=320,H=320;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2,oy=H/2;const nar=narrate('');
  let angle=0.5, spread=2.2;let pts=[];
  function regen(){pts=[];for(let i=0;i<160;i++){
    const u=(Math.random()+Math.random()+Math.random()-1.5)*spread;
    const v=(Math.random()+Math.random()+Math.random()-1.5)*0.6;
    pts.push([u*Math.cos(angle)-v*Math.sin(angle), u*Math.sin(angle)+v*Math.cos(angle)]);}render();}
  function render(){ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.softline;ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.moveTo(ox,0);ctx.lineTo(ox,H);ctx.stroke();
    // covariance
    let cxx=0,cyy=0,cxy=0;pts.forEach(([x,y])=>{cxx+=x*x;cyy+=y*y;cxy+=x*y;});const n=pts.length;cxx/=n;cyy/=n;cxy/=n;
    const e=LA.eig2([[cxx,cxy],[cxy,cyy]]);
    const u=28;
    pts.forEach(([x,y])=>{ctx.fillStyle='#2a7de188';ctx.beginPath();ctx.arc(ox+x*u,oy-y*u,3,0,7);ctx.fill();});
    if(e.real){e.vectors.forEach((ev,k)=>{const len=Math.sqrt(Math.max(0,e.values[k]))*u*2.2;
      ctx.strokeStyle=k===0?C.accent:C.accentd;ctx.lineWidth=3;ctx.beginPath();
      ctx.moveTo(ox,oy);ctx.lineTo(ox+ev[0]*len,oy-ev[1]*len);ctx.stroke();});
      const big=e.values[0]>e.values[1]?0:1;
      nar.say(`The <span style="color:var(--accent)">longer</span> arrow is the <b>principal component</b> — the single direction the data varies most along. It\'s the top eigenvector of the covariance matrix. <span class="g">PCA = find the axes the data actually uses.</span>`);}
  }
  const rA=rangeRow({label:'cloud angle',min:0,max:3.14,step:.05,value:0.5,fmt:v=>v.toFixed(2),onInput:v=>{angle=v;regen();}});
  const rS=rangeRow({label:'stretch',min:1,max:3.5,step:.1,value:2.2,fmt:v=>v.toFixed(1),onInput:v=>{spread=v;regen();}});
  const wrap=el('div');const s=el('div','stage');const g=el('div','grow');g.append(rA,rS,nar);s.append(cv,g);wrap.append(s);regen();
  return wrap;
}

/* =========================================================
   LUSTEPPER — shows A = LU forming step by step.
   ========================================================= */
function luStepper(){
  const wrap=el('div');
  const grid=matrixGrid({rows:3,cols:3,values:[[2,1,1],[4,3,3],[8,7,9]]});
  const nar=narrate('Edit A, then factor it into L·U.');
  const stepBox=el('div');stepBox.style.cssText='margin-top:10px';
  const runBtn=el('button','btn','▶ factor A = LU');
  let steps=[];
  runBtn.onclick=()=>{const res=LA.luSteps(grid.get());steps=res.steps;stepBox.innerHTML='';
    steps.forEach((s,i)=>{const row=el('div');row.style.cssText='display:flex;gap:14px;align-items:center;margin:8px 0;flex-wrap:wrap';
      row.innerHTML=`<div style="font-size:.82rem;color:var(--muted);min-width:150px">${s.desc}</div>
        <div>L = ${matrixHTML(s.L)}</div><div>U = ${matrixHTML(s.U)}</div>`;stepBox.append(row);});
    nar.say(`<span class="g">Done.</span> A = L·U: a lower-triangular L (the elimination multipliers) times an upper-triangular U (the echelon form). This is exactly Gaussian elimination, <em>recorded</em> — and it lets you solve many systems with the same A cheaply.`);};
  const ctr=el('div','controls');ctr.append(runBtn);
  wrap.append(grid.el,ctr,stepBox,nar);return wrap;
}

/* =========================================================
   QUADFORM — contour plot of x^T A x; classify definiteness.
   ========================================================= */
function quadFormPlot(){
  const W=300,H=300;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  let M=[[1,0],[0,1]];const nar=narrate('');
  function render(){
    const img=ctx.createImageData(W,H);
    const rng=3.2;
    for(let py=0;py<H;py++)for(let px=0;px<W;px++){
      const x=(px/W*2-1)*rng, y=-(py/H*2-1)*rng;
      const v=LA.quadForm(M,x,y);
      const idx=(py*W+px)*4;
      // color: positive teal, negative orange, near-zero light
      const t=Math.max(-1,Math.min(1,v/6));
      const r=t<0?228:237-Math.round(60*t), g=t<0?237+Math.round(60*t):240-Math.round(80*t), b=t<0?230:230-Math.round(80*t);
      // contour bands
      const band=(Math.abs(v)%1)<0.06?200:255;
      img.data[idx]=Math.min(r,band);img.data[idx+1]=Math.min(g,band);img.data[idx+2]=Math.min(b,band);img.data[idx+3]=255;
    }
    ctx.putImageData(img,0,0);
    const e=LA.eig2(M);const l=e.values;
    let cls,col;
    if(l[0]>1e-9&&l[1]>1e-9){cls='positive definite — a bowl (min at origin)';col='var(--accentc)';}
    else if(l[0]<-1e-9&&l[1]<-1e-9){cls='negative definite — a dome (max at origin)';col='var(--accent)';}
    else if(l[0]*l[1]<-1e-9){cls='indefinite — a saddle';col='var(--accentd)';}
    else cls='semidefinite — a trough';
    nar.say(`Eigenvalues (${l.map(x=>x.toFixed(2)).join(', ')}) → <b style="color:${col||'var(--ink)'}">${cls}</b>. <span class="g">The signs of the eigenvalues classify the shape.</span>`);
  }
  function mk(lbl,i,j,val){const r=el('div');r.style.cssText='display:flex;gap:6px;align-items:center';
    const inp=el('input');inp.type='range';inp.min=-2;inp.max=2;inp.step=.1;inp.value=val;inp.style.width='130px';
    const out=el('span','big');out.textContent=val.toFixed(1);
    inp.addEventListener('input',()=>{M[i][j]=parseFloat(inp.value);if(i!==j)M[j][i]=M[i][j];out.textContent=(+inp.value).toFixed(1);render();});
    r.append(el('span',null,lbl),inp,out);return r;}
  const controls=el('div');controls.style.cssText='display:flex;flex-direction:column;gap:6px';
  controls.append(mk('a (xx)',0,0,1),mk('b (xy)',0,1,0),mk('c (yy)',1,1,1));
  const wrap=el('div');const s=el('div','stage');const g=el('div','grow');g.append(controls);s.append(cv,g);wrap.append(s,nar);render();
  return wrap;
}

/* =========================================================
   COMPLEXPLANE — drag a complex number; show polar form and
   what 'multiply by i' (rotate 90) does.
   ========================================================= */
function complexPlane(){
  const W=300,H=300,unit=48;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2,oy=H/2;let z={re:2,im:1};const nar=narrate('Drag the point. Button rotates by i.');
  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.soft;for(let g=ox%unit;g<W;g+=unit){ctx.beginPath();ctx.moveTo(g,0);ctx.lineTo(g,H);ctx.stroke();}
    for(let g=oy%unit;g<H;g+=unit){ctx.beginPath();ctx.moveTo(0,g);ctx.lineTo(W,g);ctx.stroke();}
    ctx.strokeStyle=C.softline;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.moveTo(ox,0);ctx.lineTo(ox,H);ctx.stroke();
    ctx.fillStyle=C.muted;ctx.font='11px sans-serif';ctx.fillText('real',W-30,oy-5);ctx.fillText('imaginary',ox+5,12);
    const ex=ox+z.re*unit,ey=oy-z.im*unit;
    ctx.strokeStyle=C.accent;ctx.fillStyle=C.accent;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ex,ey);ctx.stroke();
    ctx.beginPath();ctx.arc(ex,ey,6,0,7);ctx.fill();
    const r=Math.hypot(z.re,z.im),th=Math.atan2(z.im,z.re)*180/Math.PI;
    nar.say(`z = ${z.re.toFixed(1)} ${z.im>=0?'+':'−'} ${Math.abs(z.im).toFixed(1)}i &nbsp; = &nbsp; magnitude <span class="k">${r.toFixed(2)}</span>, angle <span class="k">${th.toFixed(0)}°</span>. <span class="g">A complex number is a 2D vector with a built-in “rotate” multiplication.</span>`);
  }
  let drag=false;const ev=e=>{const rect=cv.getBoundingClientRect();return[(e.clientX-rect.left-ox)/unit,-(e.clientY-rect.top-oy)/unit];};
  cv.addEventListener('pointerdown',e=>{drag=true;cv.setPointerCapture?.(e.pointerId);const[x,y]=ev(e);z={re:x,im:y};render();e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(drag){const[x,y]=ev(e);z={re:x,im:y};render();}});
  window.addEventListener('pointerup',()=>drag=false);
  const btn=el('button','btn','× i  (rotate 90°)');btn.onclick=()=>{z={re:-z.im,im:z.re};render();};
  const wrap=el('div');const s=el('div','stage');const g=el('div','grow');const ctr=el('div','controls');ctr.append(btn);g.append(ctr,nar);s.append(cv,g);wrap.append(s);render();
  return wrap;
}

/* =========================================================
   FOURIERSYNTH — add sine waves (basis functions) to build a
   signal; show it's a change of basis into frequency.
   ========================================================= */
function fourierSynth(){
  const W=440,H=180;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const amps=[1,0,0.5,0,0.3];const nar=narrate('');
  function render(){
    ctx.clearRect(0,0,W,H);ctx.strokeStyle=C.softline;ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();
    // each harmonic faint
    amps.forEach((a,k)=>{if(a===0)return;ctx.strokeStyle=['#e4572e55','#2a7de155','#17a39855','#9b5de555','#f2a90055'][k];ctx.lineWidth=1;
      ctx.beginPath();for(let px=0;px<=W;px++){const x=px/W*2*Math.PI;const y=a*Math.sin((k+1)*x);ctx.lineTo(px,H/2-y*40);}ctx.stroke();});
    // sum bold
    ctx.strokeStyle=C.ink;ctx.lineWidth=2.5;ctx.beginPath();
    for(let px=0;px<=W;px++){const x=px/W*2*Math.PI;let y=0;amps.forEach((a,k)=>y+=a*Math.sin((k+1)*x));ctx.lineTo(px,H/2-y*40);}ctx.stroke();
    nar.say(`This wave = ${amps.map((a,k)=>a?`${a.toFixed(1)}·sin(${k+1}x)`:'').filter(Boolean).join(' + ')}. <span class="g">The amplitudes ARE the coordinates of the signal in the Fourier basis.</span> Fourier = change of basis into pure frequencies.`);
  }
  const rows=el('div');rows.style.cssText='display:flex;flex-direction:column;gap:5px';
  amps.forEach((a,k)=>{const r=rangeRow({label:`sin(${k+1}x)`,min:0,max:1,step:.1,value:a,fmt:v=>v.toFixed(1),onInput:v=>{amps[k]=v;render();}});rows.append(r);});
  const wrap=el('div');wrap.append(cv,rows,nar);render();return wrap;
}

/* =========================================================
   PRACTICE ENGINE
   A bank of problem generators. Each returns:
     {prompt(html), answer(string|number|array), check(user)->bool,
      solution(html)}
   practiceSet(kinds, n) builds a graded, scored problem set.
   ========================================================= */
const _ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const _mat=(r,c,lo,hi)=>Array.from({length:r},()=>Array.from({length:c},()=>_ri(lo,hi)));
function _approx(a,b,eps){eps=eps||1e-2;return Math.abs(a-b)<=eps;}
function _parseNums(s){return (s.match(/-?\d+\.?\d*/g)||[]).map(Number);}

const PROBLEMS = {
  add:()=>{const a=_mat(1,3,-5,9)[0],b=_mat(1,3,-5,9)[0];const ans=a.map((x,i)=>x+b[i]);
    return {prompt:`Add the vectors: (${a.join(', ')}) + (${b.join(', ')})`,
      answer:ans, check:u=>{const n=_parseNums(u);return n.length===3&&n.every((x,i)=>x===ans[i]);},
      solution:`Add line by line → (${ans.join(', ')}).`};},
  scale:()=>{const k=_ri(-3,4),v=_mat(1,3,-4,6)[0];const ans=v.map(x=>x*k);
    return {prompt:`Compute ${k} · (${v.join(', ')})`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length===3&&n.every((x,i)=>x===ans[i]);},
      solution:`Multiply every entry by ${k} → (${ans.join(', ')}).`};},
  dot:()=>{const a=_mat(1,3,-4,6)[0],b=_mat(1,3,-4,6)[0];const ans=a.reduce((s,x,i)=>s+x*b[i],0);
    return {prompt:`Dot product: (${a.join(', ')}) · (${b.join(', ')})`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length>=1&&n[0]===ans;},
      solution:`Multiply matching entries and add: ${a.map((x,i)=>`${x}·${b[i]}`).join(' + ')} = ${ans}.`};},
  length:()=>{const opts=[[3,4],[6,8],[5,12],[8,15],[2,2,1],[1,2,2],[2,3,6]];const v=opts[_ri(0,opts.length-1)];
    const ans=Math.sqrt(v.reduce((s,x)=>s+x*x,0));
    return {prompt:`Length of (${v.join(', ')})`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length>=1&&_approx(n[0],ans);},
      solution:`√(${v.map(x=>x+'²').join(' + ')}) = √${v.reduce((s,x)=>s+x*x,0)} = ${ans.toFixed(3)}.`};},
  det2:()=>{const A=_mat(2,2,-4,6);const ans=A[0][0]*A[1][1]-A[0][1]*A[1][0];
    return {prompt:`det [[${A[0].join(', ')}], [${A[1].join(', ')}]]`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length>=1&&n[0]===ans;},
      solution:`ad − bc = ${A[0][0]}·${A[1][1]} − ${A[0][1]}·${A[1][0]} = ${ans}.`};},
  matvec:()=>{const A=_mat(2,2,-3,5),v=_mat(1,2,-3,5)[0];const ans=[A[0][0]*v[0]+A[0][1]*v[1],A[1][0]*v[0]+A[1][1]*v[1]];
    return {prompt:`[[${A[0].join(', ')}],[${A[1].join(', ')}]] · (${v.join(', ')})`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length===2&&n.every((x,i)=>x===ans[i]);},
      solution:`Each output row = row·v: (${ans.join(', ')}).`};},
  matmul:()=>{const A=_mat(2,2,-2,4),B=_mat(2,2,-2,4);const C=LA.matmul(A,B);
    return {prompt:`Top-left entry of [[${A[0].join(', ')}],[${A[1].join(', ')}]] · [[${B[0].join(', ')}],[${B[1].join(', ')}]]`,answer:C[0][0],
      check:u=>{const n=_parseNums(u);return n.length>=1&&n[0]===C[0][0];},
      solution:`Row 1 of A · column 1 of B = ${A[0][0]}·${B[0][0]} + ${A[0][1]}·${B[1][0]} = ${C[0][0]}.`};},
  eig:()=>{const picks=[[[2,0],[0,3]],[[1,2],[0,3]],[[4,0],[0,-1]],[[3,1],[0,2]],[[2,0],[0,2]]];const A=picks[_ri(0,picks.length-1)];
    const e=LA.eig2(A);const vals=e.values.map(x=>Math.round(x)).sort((a,b)=>a-b);
    return {prompt:`Eigenvalues of [[${A[0].join(', ')}],[${A[1].join(', ')}]] (triangular — read the diagonal!)`,answer:vals,
      check:u=>{const n=_parseNums(u).map(Math.round).sort((a,b)=>a-b);return n.length>=2&&n[0]===vals[0]&&n[1]===vals[1];},
      solution:`For a triangular matrix the eigenvalues are the diagonal entries: ${vals.join(' and ')}.`};},
  rank:()=>{const kind=_ri(0,1);let A,ans;if(kind===0){const r=_mat(1,3,1,4)[0];A=[r,r.map(x=>2*x)];ans=1;}else{A=[[1,0,2],[0,1,3]];ans=2;}
    return {prompt:`Rank of [[${A[0].join(', ')}], [${A[1].join(', ')}]]`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length>=1&&n[0]===ans;},
      solution:ans===1?`The second row is a multiple of the first — only 1 independent row. Rank 1.`:`The two rows are independent — rank 2.`};},
  nullity:()=>{const cols=_ri(3,5),rank=_ri(1,Math.min(3,cols-1));const ans=cols-rank;
    return {prompt:`A matrix has ${cols} columns and rank ${rank}. What is its nullity (dim of kernel)?`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length>=1&&n[0]===ans;},
      solution:`Rank + nullity = columns → nullity = ${cols} − ${rank} = ${ans}.`};},
  solve2:()=>{ // 2x2 system with an integer solution
    const x=_ri(-3,4),y=_ri(-3,4);let a,b,c,d;
    do{a=_ri(-3,4);b=_ri(-3,4);c=_ri(-3,4);d=_ri(-3,4);}while(a*d-b*c===0);
    const e=a*x+b*y, f=c*x+d*y;
    return {prompt:`Solve: ${a}x + ${b}y = ${e},  ${c}x + ${d}y = ${f}   (give x, y)`,answer:[x,y],
      check:u=>{const n=_parseNums(u);return n.length>=2&&n[0]===x&&n[1]===y;},
      solution:`det = ${a*d-b*c}. By elimination/Cramer: x = ${x}, y = ${y}.`};},
  inv2:()=>{ // top-left entry of the inverse
    let a,b,c,d,det;do{a=_ri(-3,4);b=_ri(-3,4);c=_ri(-3,4);d=_ri(-3,4);det=a*d-b*c;}while(det===0||Math.abs(det)>6);
    const ans=d/det;
    return {prompt:`For A = [[${a}, ${b}],[${c}, ${d}]], what is the TOP-LEFT entry of A⁻¹?`,answer:ans,
      check:u=>{const n=_parseNums(u);if(n.length>=1&&_approx(n[0],ans,0.02))return true;
        // accept 'd/det' style fractions
        const m=u.match(/(-?\d+)\s*\/\s*(-?\d+)/);return m&&_approx(parseInt(m[1])/parseInt(m[2]),ans,0.02);},
      solution:`A⁻¹ = (1/det)·[[d, −b],[−c, a]] with det = ${det}. Top-left = d/det = ${d}/${det} = ${ans.toFixed(3)}.`};},
  det3:()=>{ // 3x3 determinant, small integers
    const A=_mat(3,3,-2,3);const ans=LA.det(A);
    return {prompt:`det [[${A[0].join(', ')}], [${A[1].join(', ')}], [${A[2].join(', ')}]]`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length>=1&&n[0]===ans;},
      solution:`Cofactor-expand along row 1: ${A[0][0]}·(${A[1][1]}·${A[2][2]}−${A[1][2]}·${A[2][1]}) − ${A[0][1]}·(…) + ${A[0][2]}·(…) = ${ans}.`};},
  angle:()=>{ // angle between two vectors, from a clean set
    const pairs=[[[1,0],[1,1],45],[[1,0],[0,1],90],[[1,0],[-1,0],180],[[1,1],[-1,1],90],[[1,0],[1,-1],45],[[2,0],[0,3],90]];
    const[[a,b,deg]]=[pairs[_ri(0,pairs.length-1)]];
    return {prompt:`Angle (in degrees) between (${a.join(', ')}) and (${b.join(', ')})`,answer:deg,
      check:u=>{const n=_parseNums(u);return n.length>=1&&_approx(n[0],deg,1);},
      solution:`cosθ = (a·b)/(‖a‖‖b‖) = ${a[0]*b[0]+a[1]*b[1]}/(${Math.hypot(...a).toFixed(2)}·${Math.hypot(...b).toFixed(2)}) → θ = ${deg}°.`};},
  cross:()=>{ // cross product, one component asked
    const a=_mat(1,3,-3,3)[0],b=_mat(1,3,-3,3)[0];
    const cx=[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    return {prompt:`(${a.join(', ')}) × (${b.join(', ')})   (all three components)`,answer:cx,
      check:u=>{const n=_parseNums(u);return n.length===3&&n.every((x,i)=>x===cx[i]);},
      solution:`(a₂b₃−a₃b₂, a₃b₁−a₁b₃, a₁b₂−a₂b₁) = (${cx.join(', ')}).`};},
  trace:()=>{const A=_mat(3,3,-4,6);const ans=A[0][0]+A[1][1]+A[2][2];
    return {prompt:`Trace of [[${A[0].join(', ')}], [${A[1].join(', ')}], [${A[2].join(', ')}]]`,answer:ans,
      check:u=>{const n=_parseNums(u);return n.length>=1&&n[0]===ans;},
      solution:`Sum of the diagonal: ${A[0][0]} + ${A[1][1]} + ${A[2][2]} = ${ans}.`};},
  projscalar:()=>{ // scalar projection of b onto a = a.b / a.a  (pick clean cases)
    const clean=[[[1,0],[3,4]],[[0,1],[3,4]],[[1,1],[2,4]],[[2,0],[5,3]],[[1,2],[3,1]]];
    const [a,b]=clean[_ri(0,clean.length-1)];
    const ab=a[0]*b[0]+a[1]*b[1], aa=a[0]*a[0]+a[1]*a[1];const ans=ab/aa;
    return {prompt:`Scalar t so that t·(${a.join(', ')}) is the projection of (${b.join(', ')}) onto (${a.join(', ')}).  [t = (a·b)/(a·a)]`,answer:ans,
      check:u=>{const n=_parseNums(u);if(n.length>=1&&_approx(n[0],ans,0.02))return true;const m=u.match(/(-?\d+)\s*\/\s*(-?\d+)/);return m&&_approx(parseInt(m[1])/parseInt(m[2]),ans,0.02);},
      solution:`t = (a·b)/(a·a) = ${ab}/${aa} = ${ans.toFixed(3)}.`};},
  subspace:()=>{ // is this set a subspace? conceptual
    const sets=[
      {t:'all vectors (x, y) with y = 2x',ok:true,why:'a line through the origin — closed under add & scale, contains 0. Subspace.'},
      {t:'all vectors (x, y) with y = 2x + 1',ok:false,why:'does NOT contain the origin (0,0 fails), so not a subspace.'},
      {t:'all vectors with x ≥ 0',ok:false,why:'not closed under scaling by −1 (flips the sign). Not a subspace.'},
      {t:'all vectors (x, y, z) with x + y + z = 0',ok:true,why:'a plane through the origin — closed under add & scale. Subspace.'},
      {t:'just the single point (0, 0)',ok:true,why:'the trivial subspace {0} — perfectly valid.'},
      {t:'all vectors of length 1',ok:false,why:'the unit circle doesn\'t contain 0 and isn\'t closed under scaling. Not a subspace.'}];
    const s=sets[_ri(0,sets.length-1)];
    return {prompt:`Is this a subspace? “${s.t}”  (answer yes or no)`,answer:s.ok?'yes':'no',
      check:u=>{const y=/^\s*(y|yes|true|1)/i.test(u.trim());const no=/^\s*(n|no|false|0)/i.test(u.trim());return (y&&s.ok)||(no&&!s.ok);},
      solution:`${s.ok?'Yes':'No'} — ${s.why}`};},
};

/* =========================================================
   ROWOPSOLVER — the user performs Gaussian elimination BY HAND:
   choose a row operation, the app applies it and checks progress
   toward RREF. Teaches the procedure, not just the answer.
   ========================================================= */
function rowOpSolver(opts){
  const start=(opts&&opts.matrix)||[[1,2,5],[3,4,11]];
  let M=start.map(r=>r.slice());
  const rows=M.length, cols=M[0].length;
  const wrap=el('div');
  const disp=el('div');disp.style.cssText='margin:8px 0';
  const nar=narrate('Goal: reach reduced row echelon form (leading 1s, zeros elsewhere in pivot columns). Pick an operation.');
  const hist=el('div');hist.style.cssText='font-size:.8rem;color:var(--muted);margin-top:6px';
  const log=[];
  function isRREF(A){
    // quick check: every pivot is 1 and alone in its column
    let lastPivotCol=-1;
    for(let i=0;i<A.length;i++){
      let pc=A[i].findIndex(x=>Math.abs(x)>1e-9);
      if(pc===-1) continue;
      if(pc<=lastPivotCol) return false;
      lastPivotCol=pc;
      if(Math.abs(A[i][pc]-1)>1e-9) return false;
      for(let k=0;k<A.length;k++) if(k!==i && Math.abs(A[k][pc])>1e-9) return false;
    }
    return true;
  }
  function render(){
    disp.innerHTML=matrixHTML(M.map(r=>r.map(x=>Math.abs(x)<1e-9?0:x)));
    hist.innerHTML=log.length?('steps: '+log.join('  →  ')):'';
    if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([disp]).catch(()=>{});
    if(isRREF(M)) nar.say('<span class="g">✓ Reduced row echelon form reached!</span> You drove the matrix there yourself, one legal move at a time.');
  }
  // controls: swap Ri<->Rj, scale Ri by k, add k*Ri to Rj
  const ctr=el('div');ctr.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:6px';
  function rowSel(){const s=el('select');s.style.cssText='padding:5px;border-radius:6px;border:1px solid var(--softline)';
    for(let i=0;i<rows;i++){const o=el('option');o.value=i;o.textContent='R'+(i+1);s.append(o);}return s;}
  function numIn(v,w){const n=el('input');n.type='number';n.value=v;n.step='any';n.style.cssText=`width:${w||52}px;padding:5px;border-radius:6px;border:1px solid var(--softline);text-align:center`;return n;}
  // op 1: scale
  const r1=el('div');r1.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap';
  const sSel=rowSel(),sK=numIn(1);const sBtn=el('button','btn ghost','scale');
  sBtn.onclick=()=>{const i=+sSel.value,k=parseFloat(sK.value);if(!k){nar.say('<span class="r">Can\'t scale by 0.</span>');return;}
    M[i]=M[i].map(x=>x*k);log.push(`R${i+1}×${k}`);render();};
  r1.append(el('span',null,'multiply'),sSel,el('span',null,'by'),sK,sBtn);
  // op 2: add k*Ri to Rj
  const r2=el('div');r2.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap';
  const aK=numIn(-1),aI=rowSel(),aJ=rowSel();const aBtn=el('button','btn ghost','add');
  aBtn.onclick=()=>{const k=parseFloat(aK.value),i=+aI.value,j=+aJ.value;if(i===j){nar.say('<span class="r">Pick two different rows.</span>');return;}
    M[j]=M[j].map((x,c)=>x+k*M[i][c]);log.push(`R${j+1}+=${k}·R${i+1}`);render();};
  r2.append(el('span',null,'add'),aK,el('span',null,'×'),aI,el('span',null,'to'),aJ,aBtn);
  // op 3: swap
  const r3=el('div');r3.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap';
  const wI=rowSel(),wJ=rowSel();const wBtn=el('button','btn ghost','swap');
  wBtn.onclick=()=>{const i=+wI.value,j=+wJ.value;if(i===j)return;[M[i],M[j]]=[M[j],M[i]];log.push(`R${i+1}↔R${j+1}`);render();};
  r3.append(el('span',null,'swap'),wI,el('span',null,'and'),wJ,wBtn);
  // reset + auto-hint
  const r4=el('div');r4.style.cssText='display:flex;gap:8px;margin-top:4px';
  const reset=el('button','btn ghost','reset');reset.onclick=()=>{M=start.map(r=>r.slice());log.length=0;render();nar.say('Reset. Pick an operation.');};
  const hint=el('button','btn','hint: next move');
  hint.onclick=()=>{
    // suggest a move toward RREF using LA.rrefSteps difference heuristic
    // find first column with a pivot not yet normalized/cleared
    for(let c=0;c<cols-1;c++){
      // find a row with nonzero in col c at/after diagonal
      let piv=-1;for(let i=c;i<rows;i++) if(Math.abs(M[i][c])>1e-9){piv=i;break;}
      if(piv===-1) continue;
      if(piv!==c && piv<rows){nar.say(`Hint: swap R${piv+1} and R${c+1} to bring a pivot up.`);return;}
      if(Math.abs(M[c][c]-1)>1e-9){nar.say(`Hint: scale R${c+1} by ${(1/M[c][c]).toFixed(2)} to make the pivot 1.`);return;}
      for(let i=0;i<rows;i++) if(i!==c && Math.abs(M[i][c])>1e-9){nar.say(`Hint: add ${(-M[i][c]).toFixed(2)}·R${c+1} to R${i+1} to clear that entry.`);return;}
    }
    nar.say('Looks done — already in RREF!');
  };
  r4.append(reset,hint);
  ctr.append(r1,r2,r3,r4);
  wrap.append(disp,ctr,hist,nar);render();
  return wrap;
}

function practiceSet(kinds, n){
  n=n||6;
  const wrap=el('div');
  const head=el('div');head.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px';
  const score=el('div');score.style.cssText='font-weight:700';
  head.append(el('div',null,'<b>Practice — type your answers</b>'),score);
  wrap.append(head);
  let correct=0, done=0;
  function refresh(){score.innerHTML=`score: <span style="color:var(--green)">${correct}</span> / ${n}`;}
  refresh();
  for(let i=0;i<n;i++){
    const kind=kinds[_ri(0,kinds.length-1)];
    const prob=PROBLEMS[kind]();
    const card=el('div');card.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:10px;padding:12px 14px;margin:8px 0';
    const q=el('div');q.style.cssText='font-family:var(--mono);font-size:.95rem;margin-bottom:8px';q.textContent=`${i+1}. ${prob.prompt}`;
    const rowc=el('div');rowc.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap';
    const inp=el('input');inp.type='text';inp.placeholder='your answer';inp.style.cssText='flex:1;min-width:140px;padding:8px 10px;border:1px solid var(--softline);border-radius:7px;font-family:var(--mono)';
    const btn=el('button','btn','check');
    const fb=el('div');fb.style.cssText='font-size:.88rem;margin-top:6px;min-height:1em';
    let solved=false;
    function grade(){if(solved)return;const ok=prob.check(inp.value);done++;
      if(ok){solved=true;correct++;refresh();inp.style.borderColor='var(--green)';fb.innerHTML=`<span style="color:var(--green);font-weight:700">✓ correct.</span> ${prob.solution}`;}
      else{inp.style.borderColor='var(--accent)';fb.innerHTML=`<span style="color:var(--accent);font-weight:700">not yet.</span> Try again, or click “show.”`;}}
    btn.onclick=grade;inp.addEventListener('keydown',e=>{if(e.key==='Enter')grade();});
    const showBtn=el('button','btn ghost','show');showBtn.onclick=()=>{fb.innerHTML=`<span style="color:var(--muted)">answer:</span> ${prob.solution}`;if(!solved){solved=true;}};
    rowc.append(inp,btn,showBtn);card.append(q,rowc,fb);
    if(window.MathJax&&window.MathJax.typesetPromise)setTimeout(()=>window.MathJax.typesetPromise([card]).catch(()=>{}),0);
    wrap.append(card);
  }
  return wrap;
}

/* =========================================================
   MATMULBUILDER — user fills each entry of A·B; app checks
   each cell and shows the row·column that produces it.
   ========================================================= */
function matmulBuilder(opts){
  const A=(opts&&opts.A)||[[1,2],[3,4]], B=(opts&&opts.B)||[[2,0],[1,2]];
  const C=LA.matmul(A,B);const n=A.length,m=B[0].length;
  const wrap=el('div');
  const nar=narrate('Fill each entry of the product. Each cell = one row of A dotted with one column of B.');
  const top=el('div');top.style.cssText='display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:10px';
  top.innerHTML=`<div><div style="font-size:.75rem;color:var(--muted)">A</div>${matrixHTML(A)}</div>
    <div style="font-size:1.3rem">×</div>
    <div><div style="font-size:.75rem;color:var(--muted)">B</div>${matrixHTML(B)}</div>
    <div style="font-size:1.3rem">=</div>`;
  const grid=el('div');grid.style.cssText=`display:grid;grid-template-columns:repeat(${m},1fr);gap:6px`;
  const inputs=[];
  for(let i=0;i<n;i++){inputs[i]=[];for(let j=0;j<m;j++){
    const inp=el('input');inp.type='number';inp.style.cssText='width:56px;text-align:center;padding:8px 2px;border:1.5px solid var(--softline);border-radius:7px;font-family:var(--mono)';
    inp.dataset.i=i;inp.dataset.j=j;
    inp.addEventListener('input',()=>{const v=parseFloat(inp.value);
      if(inp.value==='')  {inp.style.borderColor='var(--softline)';return;}
      if(v===C[i][j]){inp.style.borderColor='var(--green)';inp.style.background='#EBF7EF';checkDone();}
      else{inp.style.borderColor='var(--accent)';inp.style.background='#FDEEE8';}});
    inp.addEventListener('focus',()=>{
      const rowA=A[i].join(', '), colB=B.map(r=>r[j]).join(', ');
      const terms=A[i].map((a,k)=>`${a}·${B[k][j]}`).join(' + ');
      nar.say(`Entry (${i+1},${j+1}) = row ${i+1} of A · column ${j+1} of B = (${rowA})·(${colB}) = ${terms}.`);});
    inputs[i][j]=inp;grid.append(inp);}}
  function checkDone(){let all=true;for(let i=0;i<n;i++)for(let j=0;j<m;j++)if(parseFloat(inputs[i][j].value)!==C[i][j])all=false;
    if(all)nar.say('<span class="g">✓ Every entry correct — you built the whole product.</span> Each was a row·column dot product.');}
  const reveal=el('button','btn ghost','reveal all');reveal.onclick=()=>{for(let i=0;i<n;i++)for(let j=0;j<m;j++){inputs[i][j].value=C[i][j];inputs[i][j].style.borderColor='var(--green)';inputs[i][j].style.background='#EBF7EF';}nar.say('Filled in. Compare each to your row·column reasoning.');};
  const ctr=el('div','controls');ctr.append(reveal);
  wrap.append(top,grid,ctr,nar);return wrap;
}

/* =========================================================
   COFACTORBUILDER — guided 3x3 determinant by cofactors:
   user types the three 2x2 minors and the final answer.
   ========================================================= */
function cofactorBuilder(opts){
  const A=(opts&&opts.A)||[[2,1,0],[1,3,1],[0,2,2]];
  const wrap=el('div');const nar=narrate('Expand along the top row. Type each 2×2 minor, then the total.');
  wrap.append(el('div',null,`<div style="font-size:.75rem;color:var(--muted)">A</div>`));
  const disp=el('div');disp.innerHTML=matrixHTML(A);wrap.append(disp);
  // minors for top row: delete row0, and each column
  const minor=c=>{const rows=[1,2],cols=[0,1,2].filter(x=>x!==c);
    return A[rows[0]][cols[0]]*A[rows[1]][cols[1]]-A[rows[0]][cols[1]]*A[rows[1]][cols[0]];};
  const M=[minor(0),minor(1),minor(2)];
  const signs=['+','−','+'];
  const total=A[0][0]*M[0]-A[0][1]*M[1]+A[0][2]*M[2];
  const rowsBox=el('div');rowsBox.style.cssText='display:flex;flex-direction:column;gap:8px;margin:10px 0';
  function mkRow(idx){const r=el('div');r.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-family:var(--mono);font-size:.9rem';
    const inp=el('input');inp.type='number';inp.style.cssText='width:60px;text-align:center;padding:6px;border:1.5px solid var(--softline);border-radius:6px';
    inp.addEventListener('input',()=>{if(inp.value==='')return;
      if(parseFloat(inp.value)===M[idx]){inp.style.borderColor='var(--green)';inp.style.background='#EBF7EF';}
      else{inp.style.borderColor='var(--accent)';inp.style.background='#FDEEE8';}});
    const cols=[0,1,2].filter(x=>x!==idx);
    r.innerHTML=`<b>minor ${idx+1}</b> (delete row 1, col ${idx+1}): det [[${A[1][cols[0]]}, ${A[1][cols[1]]}], [${A[2][cols[0]]}, ${A[2][cols[1]]}]] = `;
    r.append(inp);return r;}
  rowsBox.append(mkRow(0),mkRow(1),mkRow(2));
  const totRow=el('div');totRow.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-family:var(--mono);font-size:.95rem;margin-top:4px';
  const totInp=el('input');totInp.type='number';totInp.style.cssText='width:70px;text-align:center;padding:6px;border:1.5px solid var(--softline);border-radius:6px';
  totInp.addEventListener('input',()=>{if(totInp.value==='')return;
    if(parseFloat(totInp.value)===total){totInp.style.borderColor='var(--green)';totInp.style.background='#EBF7EF';nar.say('<span class="g">✓ Correct!</span> det = '+A[0][0]+'·('+M[0]+') − '+A[0][1]+'·('+M[1]+') + '+A[0][2]+'·('+M[2]+') = '+total+'.');}
    else{totInp.style.borderColor='var(--accent)';totInp.style.background='#FDEEE8';nar.say('Not yet — remember the signs: <b>+ − +</b>. total = '+A[0][0]+'·minor₁ − '+A[0][1]+'·minor₂ + '+A[0][2]+'·minor₃.');}});
  totRow.innerHTML=`<b>det A</b> = ${A[0][0]}·m₁ − ${A[0][1]}·m₂ + ${A[0][2]}·m₃ = `;totRow.append(totInp);
  wrap.append(rowsBox,totRow,nar);
  if(window.MathJax&&window.MathJax.typesetPromise)setTimeout(()=>window.MathJax.typesetPromise([disp]).catch(()=>{}),0);
  return wrap;
}

/* =========================================================
   EIGENCHECK — type a candidate eigenvector; app computes Av
   and tells you if it's parallel to v (and the eigenvalue).
   ========================================================= */
/* =========================================================
   MATRIXLAB — THE signature widget. One editable 2x2 matrix,
   shown simultaneously as: a grid transformation, its
   determinant (area), eigenvectors/lines, and a live readout
   of det, trace, rank, eigenvalues, inverse, singular values.
   EVERYTHING updates together — the 'it's all connected' reveal.
   ========================================================= */
function matrixLab(opts){
  let M=(opts&&opts.matrix)||[[2,1],[1,2]];
  const wrap=el('div');
  const layout=el('div');layout.style.cssText='display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start';
  // LEFT: big transformation canvas
  const W=340,H=340,unit=42;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2,oy=H/2;
  const toPx=(x,y)=>[ox+x*unit,oy-y*unit];
  function apply(x,y){return [M[0][0]*x+M[0][1]*y, M[1][0]*x+M[1][1]*y];}
  function drawGridTransform(){
    ctx.clearRect(0,0,W,H);
    // transformed grid lines
    for(let i=-6;i<=6;i++){
      ctx.strokeStyle=(i===0)?'#c9bfb0':'#efe9df';ctx.lineWidth=1;
      let p=apply(i,-6),q=apply(i,6);let a=toPx(p[0],p[1]),b=toPx(q[0],q[1]);
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
      p=apply(-6,i);q=apply(6,i);a=toPx(p[0],p[1]);b=toPx(q[0],q[1]);
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
    }
    // unit square -> parallelogram (the determinant area)
    const sq=[[0,0],[1,0],[1,1],[0,1]].map(p=>apply(p[0],p[1]));
    const det=M[0][0]*M[1][1]-M[0][1]*M[1][0];
    ctx.fillStyle=det<0?'rgba(228,87,46,.18)':'rgba(23,163,152,.18)';
    ctx.beginPath();sq.forEach((p,i)=>{const q=toPx(p[0],p[1]);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.closePath();ctx.fill();
    // eigenlines (glowing)
    const e=LA.eig2(M);
    if(e.real){e.vectors.forEach((ev,k)=>{const far=400;ctx.strokeStyle=k===0?'rgba(242,169,0,.55)':'rgba(155,93,229,.55)';ctx.lineWidth=7;
      ctx.beginPath();ctx.moveTo(ox-ev[0]*far,oy+ev[1]*far);ctx.lineTo(ox+ev[0]*far,oy-ev[1]*far);ctx.stroke();});}
    // basis vectors: where i-hat and j-hat land
    function arr(vx,vy,color,lbl){const e2=toPx(vx,vy);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3.5;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(e2[0],e2[1]);ctx.stroke();
      const ang=Math.atan2(e2[1]-oy,e2[0]-ox),s=11;ctx.beginPath();ctx.moveTo(e2[0],e2[1]);
      ctx.lineTo(e2[0]-s*Math.cos(ang-.4),e2[1]-s*Math.sin(ang-.4));ctx.lineTo(e2[0]-s*Math.cos(ang+.4),e2[1]-s*Math.sin(ang+.4));ctx.closePath();ctx.fill();
      ctx.font='700 13px sans-serif';ctx.fillText(lbl,e2[0]+6,e2[1]-4);}
    arr(M[0][0],M[1][0],C.accent,'î');arr(M[0][1],M[1][1],C.accentb,'ĵ');
  }
  // RIGHT: the live readout panel
  const panel=el('div');panel.style.cssText='flex:1;min-width:250px;display:flex;flex-direction:column;gap:7px';
  function fnum(x){return LA.fmtNum(Math.abs(x)<1e-9?0:x);}
  function stat(label,val,color,note){
    return `<div style="display:flex;justify-content:space-between;gap:8px;background:#fff;border:1px solid var(--softline);border-left:3px solid ${color};border-radius:8px;padding:7px 11px">
      <span style="font-size:.82rem;color:var(--muted)">${label}</span>
      <span style="font-family:var(--mono);font-weight:700;text-align:right">${val}${note?`<br><span style="font-size:.7rem;color:var(--muted);font-weight:400">${note}</span>`:''}</span></div>`;
  }
  function updatePanel(){
    const det=M[0][0]*M[1][1]-M[0][1]*M[1][0];
    const tr=M[0][0]+M[1][1];
    const e=LA.eig2(M);
    const inv=LA.inv(M);
    const rank=(Math.abs(det)>1e-9)?2:(M.flat().some(x=>Math.abs(x)>1e-9)?1:0);
    // singular values = sqrt(eig of M^T M)
    const MtM=LA.matmul(LA.transpose(M),M);const se=LA.eig2(MtM);
    const sv=se.real?se.values.map(v=>Math.sqrt(Math.max(0,v))).sort((a,b)=>b-a):[];
    let html='';
    html+=stat('determinant (area ×)',fnum(det),det<0?C.accent:(Math.abs(det)<1e-9?C.accent:C.accentc),
      Math.abs(det)<1e-9?'= 0 → SINGULAR, collapses a dimension':(det<0?'negative → flips orientation':'invertible'));
    html+=stat('trace (Σ diagonal)',fnum(tr),C.accentb,'= sum of eigenvalues');
    html+=stat('rank',rank,rank===2?C.accentc:C.accent,rank===2?'full → invertible':'deficient → not invertible');
    if(e.real) html+=stat('eigenvalues λ',e.values.map(fnum).join(',  '),C.gold,'product = det, sum = trace');
    else html+=stat('eigenvalues λ','complex',C.accentd,'the matrix rotates — no real eigenlines');
    if(inv) html+=stat('inverse A⁻¹',`[${fnum(inv[0][0])}, ${fnum(inv[0][1])}; ${fnum(inv[1][0])}, ${fnum(inv[1][1])}]`,C.accentb,'det(A⁻¹)=1/det');
    else html+=stat('inverse A⁻¹','does not exist',C.accent,'because det = 0');
    if(sv.length) html+=stat('singular values σ',sv.map(v=>v.toFixed(2)).join(',  '),C.accentd,'√ eig(AᵀA) — the SVD stretch factors');
    panel.innerHTML=html;
  }
  // the editable matrix on top
  const editRow=el('div');editRow.style.cssText='display:flex;gap:10px;align-items:center;margin-bottom:8px;flex-wrap:wrap';
  const grid=matrixGrid({rows:2,cols:2,values:M,onChange:v=>{M=v;refresh();}});
  const presets=el('div');presets.style.cssText='display:flex;gap:6px;flex-wrap:wrap';
  const P=[['rotate 90°',[[0,-1],[1,0]]],['shear',[[1,1],[0,1]]],['stretch',[[2,0],[0,1]]],['flip',[[-1,0],[0,1]]],['singular!',[[1,2],[2,4]]],['symmetric',[[2,1],[1,2]]]];
  P.forEach(([name,mat])=>{const b=el('button','btn ghost',name);b.style.fontSize='.78rem';b.style.padding='5px 9px';
    b.onclick=()=>{M=mat.map(r=>r.slice());grid.set(M);refresh();};presets.append(b);});
  editRow.append(el('div',null,'<b style="font-size:.9rem">A =</b>'),grid.el,presets);
  const nar=narrate('Edit A or hit a preset — every panel below recomputes together. This is the whole subject in one view.');
  function refresh(){drawGridTransform();updatePanel();
    const det=M[0][0]*M[1][1]-M[0][1]*M[1][0];
    nar.say(Math.abs(det)<1e-9
      ? '<span class="r">det = 0:</span> watch the grid squash flat, the parallelogram vanish, rank drop to 1, the inverse disappear, and a singular value hit 0 — <b>all at once.</b> These aren\'t separate facts; they\'re one.'
      : 'Notice: <b>product of eigenvalues = determinant</b>, <b>sum = trace</b>, the eigenlines are the directions the grid <em>doesn\'t</em> rotate, and the parallelogram\'s area <em>is</em> the determinant. One matrix, one truth, many faces.');}
  layout.append(cv,panel);
  wrap.append(editRow,layout,nar);refresh();
  return wrap;
}

/* =========================================================
   SVDPHOTO — upload (or use sample) an image, watch a REAL
   SVD low-rank reconstruction compress it live with a slider.
   The 'I did math to my own photo' moment.
   ========================================================= */
/* =========================================================
   PROOFBUILDER — the reader ASSEMBLES a proof.
   Two modes per proof:
   (A) ORDER: scrambled steps, click them into the right order.
   (B) JUSTIFY: for each step, pick the reason from choices.
   opts:{claim, steps:[{text, reason, choices:[...]}]}
   ========================================================= */
/* =========================================================
   GRAMSCHMIDTVIZ — watch two vectors get orthogonalized:
   drag them; see v2's projection onto v1 subtracted off to
   make the perpendicular component. Step through it.
   ========================================================= */
/* =========================================================
   TRANSFORMQUIZ — a hidden matrix deforms the grid; the
   learner names the transformation type. Trains reading
   geometry directly from what a matrix DOES.
   ========================================================= */
function transformQuiz(){
  const W=280,H=280,unit=40;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2,oy=H/2;
  const kinds=[
    {m:[[0,-1],[1,0]],label:'rotation',hint:'lengths & angles preserved, det=+1, no fixed direction'},
    {m:[[1,1],[0,1]],label:'shear',hint:'one axis slides parallel to itself; det=1 but not a rotation'},
    {m:[[2,0],[0,2]],label:'uniform scale',hint:'everything grows by the same factor; det=4'},
    {m:[[-1,0],[0,1]],label:'reflection',hint:'a mirror flip; det=−1'},
    {m:[[1,0],[0,0]],label:'projection',hint:'squashes onto a line; det=0, not reversible'},
    {m:[[2,0],[0,1]],label:'stretch (one axis)',hint:'grows along x only; det=2'},
  ];
  let cur, answered=false;
  const nar=narrate('');
  function apply(x,y,m){return [m[0][0]*x+m[0][1]*y, m[1][0]*x+m[1][1]*y];}
  function draw(m){
    ctx.clearRect(0,0,W,H);
    for(let i=-5;i<=5;i++){ctx.strokeStyle=(i===0)?'#c9bfb0':'#efe9df';ctx.lineWidth=1;
      let p=apply(i,-5,m),q=apply(i,5,m);let a=[ox+p[0]*unit,oy-p[1]*unit],b=[ox+q[0]*unit,oy-q[1]*unit];
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
      p=apply(-5,i,m);q=apply(5,i,m);a=[ox+p[0]*unit,oy-p[1]*unit];b=[ox+q[0]*unit,oy-q[1]*unit];
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
    // basis arrows
    function arr(vx,vy,c){const e=[ox+vx*unit,oy-vy*unit];ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(e[0],e[1]);ctx.stroke();
      const ang=Math.atan2(e[1]-oy,e[0]-ox),s=9;ctx.beginPath();ctx.moveTo(e[0],e[1]);
      ctx.lineTo(e[0]-s*Math.cos(ang-.4),e[1]-s*Math.sin(ang-.4));ctx.lineTo(e[0]-s*Math.cos(ang+.4),e[1]-s*Math.sin(ang+.4));ctx.closePath();ctx.fill();}
    arr(m[0][0],m[1][0],C.accent);arr(m[0][1],m[1][1],C.accentb);
  }
  const opts=el('div');opts.style.cssText='display:flex;flex-wrap:wrap;gap:7px;margin-top:10px';
  function newRound(){
    answered=false;cur=kinds[Math.floor(Math.random()*kinds.length)];draw(cur.m);
    opts.innerHTML='';
    // shuffle labels
    const labels=kinds.map(k=>k.label).sort(()=>Math.random()-0.5);
    labels.forEach(lb=>{const b=el('button','opt',lb);b.style.cssText='display:inline-block;width:auto;margin:0';
      b.onclick=()=>{if(answered&&lb===cur.label)return;
        if(lb===cur.label){b.style.borderColor='var(--green)';b.style.background='#EBF7EF';answered=true;
          nar.say(`<span class="g">✓ ${lb}.</span> ${cur.hint}. The matrix is [[${cur.m[0].join(', ')}], [${cur.m[1].join(', ')}]]. Click “new” for another.`);}
        else{b.style.borderColor='var(--accent)';b.style.background='#FDEEE8';
          nar.say('Not that one — look at what happens to the two basis arrows and whether area/angles are preserved.');}};
      opts.append(b);});
    nar.say('What kind of transformation is this? Read the deformed grid and the basis arrows.');
  }
  const nb=el('button','btn','new transformation');nb.onclick=newRound;
  const ctr=el('div','controls');ctr.append(nb);
  const wrap=el('div');const s=el('div','stage');s.append(cv,el('div','grow'));wrap.append(s,opts,ctr,nar);newRound();
  return wrap;
}

function gramSchmidtViz(){
  const W=340,H=340,unit=40;const cv=el('canvas');cv.width=W;cv.height=H;const ctx=hidpi(cv);
  const ox=W/2,oy=H/2;let v1={x:3,y:1},v2={x:1,y:2.5};let step=2;
  const nar=narrate('Drag either vector. Watch v₂ lose its “v₁ component” to become perpendicular.');
  const toPx=(x,y)=>[ox+x*unit,oy-y*unit];
  function arrow(x,y,color,lw,label){const[ex,ey]=toPx(x,y);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ex,ey);ctx.stroke();
    const a=Math.atan2(ey-oy,ex-ox),s=10;ctx.beginPath();ctx.moveTo(ex,ey);
    ctx.lineTo(ex-s*Math.cos(a-.4),ey-s*Math.sin(a-.4));ctx.lineTo(ex-s*Math.cos(a+.4),ey-s*Math.sin(a+.4));ctx.closePath();ctx.fill();
    if(label){ctx.font='700 13px sans-serif';ctx.fillText(label,ex+6,ey-4);}}
  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.soft;for(let g=ox%unit;g<W;g+=unit){ctx.beginPath();ctx.moveTo(g,0);ctx.lineTo(g,H);ctx.stroke();}
    for(let g=oy%unit;g<H;g+=unit){ctx.beginPath();ctx.moveTo(0,g);ctx.lineTo(W,g);ctx.stroke();}
    ctx.strokeStyle=C.softline;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.moveTo(ox,0);ctx.lineTo(ox,H);ctx.stroke();
    // projection of v2 onto v1
    const t=(v1.x*v2.x+v1.y*v2.y)/(v1.x*v1.x+v1.y*v1.y);
    const proj={x:t*v1.x,y:t*v1.y};
    const perp={x:v2.x-proj.x,y:v2.y-proj.y};
    arrow(v1.x,v1.y,C.accentb,3.5,'v₁');
    if(step>=1){arrow(v2.x,v2.y,C.muted,2.5,'v₂');}
    if(step>=2){
      // projection (dashed) + the subtraction
      const[px,py]=toPx(proj.x,proj.y);const[v2x,v2y]=toPx(v2.x,v2.y);
      ctx.strokeStyle=C.accent;ctx.setLineDash([4,3]);ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(v2x,v2y);ctx.lineTo(px,py);ctx.stroke();ctx.setLineDash([]);
      arrow(proj.x,proj.y,C.accent,2,'proj');
      arrow(perp.x,perp.y,C.accentc,3.5,'v₂⊥');
    }
    const dot=v1.x*perp.x+v1.y*perp.y;
    nar.say(step<2?'v₂ still leans along v₁. Click “orthogonalize”.':`<span class="g">v₂⊥ = v₂ − proj is now perpendicular to v₁</span> (their dot product = ${dot.toFixed(2)} ≈ 0). Normalize both and you have an orthonormal basis — that\'s Gram–Schmidt, and the QR decomposition.`);
  }
  let drag=0;const ev=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left-ox)/unit,-(e.clientY-r.top-oy)/unit];};
  cv.addEventListener('pointerdown',e=>{const[x,y]=ev(e);drag=(Math.hypot(x-v1.x,y-v1.y)<Math.hypot(x-v2.x,y-v2.y))?1:2;cv.setPointerCapture?.(e.pointerId);e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(drag){const[x,y]=ev(e);if(drag===1)v1={x,y};else v2={x,y};render();}});
  window.addEventListener('pointerup',()=>drag=0);
  const btn=el('button','btn','orthogonalize v₂');btn.onclick=()=>{step=2;render();};
  const ctr=el('div','controls');ctr.append(btn);
  const wrap=el('div');const s=el('div','stage');s.append(cv,el('div','grow'));wrap.append(s,ctr,nar);render();
  return wrap;
}

/* =========================================================
   FOURSUBSPACES — for an editable 2x2, draw the row space &
   null space (in input R²) and column space & left-null space
   (in output R²), showing the perpendicularity.
   ========================================================= */
function fourSubspaces(){
  const wrap=el('div');
  const grid=matrixGrid({rows:2,cols:2,values:[[1,2],[2,4]],onChange:v=>{M=v;render();}});
  let M=[[1,2],[2,4]];
  const S=150,unit=22;
  function mkCanvas(){const c=el('canvas');c.width=S;c.height=S;return c;}
  const cin=mkCanvas(),cout=mkCanvas();const xin=hidpi(cin),xout=hidpi(cout);
  const nar=narrate('');
  function drawSpace(ctx,lines){const o=S/2;ctx.clearRect(0,0,S,S);
    ctx.strokeStyle=C.softline;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,o);ctx.lineTo(S,o);ctx.moveTo(o,0);ctx.lineTo(o,S);ctx.stroke();
    lines.forEach(({dir,color,label,whole})=>{
      if(whole){ctx.fillStyle=color+'22';ctx.fillRect(0,0,S,S);return;}
      if(!dir)return;const n=Math.hypot(dir[0],dir[1])||1;const dx=dir[0]/n,dy=dir[1]/n,far=200;
      ctx.strokeStyle=color;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(o-dx*far,o+dy*far);ctx.lineTo(o+dx*far,o-dy*far);ctx.stroke();
    });}
  function render(){
    const a=M[0][0],b=M[0][1],c=M[1][0],d=M[1][1];
    const det=a*d-b*c;
    // row space: span of rows (a,b),(c,d); null space: perp to row space
    const rowDir=[a,b];const rank=(Math.abs(det)>1e-9)?2:((a||b||c||d)?1:0);
    // INPUT space (R^2): row space (blue) + null space (orange, perp)
    if(rank===2){drawSpace(xin,[{whole:true,color:'#2a7de1'}]);}
    else if(rank===1){drawSpace(xin,[{dir:rowDir,color:C.accentb},{dir:[-rowDir[1],rowDir[0]],color:C.accent}]);}
    else drawSpace(xin,[]);
    // OUTPUT space (R^2): column space (teal) + left null (violet)
    const colDir=[a,c];
    if(rank===2){drawSpace(xout,[{whole:true,color:'#17a398'}]);}
    else if(rank===1){drawSpace(xout,[{dir:colDir,color:C.accentc},{dir:[-colDir[1],colDir[0]],color:C.accentd}]);}
    else drawSpace(xout,[]);
    nar.say(rank===2
      ? 'Full rank: row space = all of input R², column space = all of output R², and both null spaces are just {0}. No collapse.'
      : rank===1
        ? '<span class="k">Rank 1.</span> <span style="color:var(--accentb)">Row space</span> (a line) ⊥ <span style="color:var(--accent)">null space</span> in the input; <span style="color:var(--accentc)">column space</span> ⊥ <span style="color:var(--accentd)">left-null space</span> in the output. The perpendicular pairs ARE the fundamental theorem.'
        : 'Zero matrix: null space is everything, column space is just {0}.');
  }
  const legend=el('div');legend.style.cssText='font-size:.78rem;color:var(--muted);margin-top:6px';
  legend.innerHTML='input R²: <span style="color:var(--accentb)">row space</span> ⊥ <span style="color:var(--accent)">null space</span> &nbsp;·&nbsp; output R²: <span style="color:var(--accentc)">column space</span> ⊥ <span style="color:var(--accentd)">left-null</span>';
  const row=el('div');row.style.cssText='display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:8px';
  const b1=el('div');b1.style.cssText='text-align:center';b1.append(cin);b1.insertAdjacentHTML('beforeend','<div style="font-size:.72rem;color:var(--muted)">input space ℝ²</div>');
  const b2=el('div');b2.style.cssText='text-align:center';b2.append(cout);b2.insertAdjacentHTML('beforeend','<div style="font-size:.72rem;color:var(--muted)">output space ℝ²</div>');
  row.append(b1,b2);
  wrap.append(el('div',null,'<b style="font-size:.9rem">A =</b>'),grid.el,row,legend,nar);render();
  return wrap;
}

function proofBuilder(opts){
  const wrap=el('div');
  wrap.style.cssText='background:#fff;border:1px solid var(--softline);border-radius:12px;padding:16px 18px;margin:14px 0';
  wrap.append(el('div',null,`<div style="font-size:.72rem;font-weight:800;letter-spacing:.5px;color:var(--accentd);text-transform:uppercase">Guided proof</div>
    <div style="font-weight:700;margin:4px 0 10px">Claim: ${opts.claim}</div>`));
  const nSteps=opts.steps.length;
  const correctOrder=opts.steps.map((s,i)=>i); // steps given IN correct order
  // ---- MODE A: ORDER ----
  const orderWrap=el('div');
  const pool=el('div');pool.style.cssText='display:flex;flex-direction:column;gap:7px';
  // shuffle indices
  const shuffled=correctOrder.slice();for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  let placed=[]; // indices in the order the user clicked
  const slots=el('div');slots.style.cssText='display:flex;flex-direction:column;gap:6px;margin-bottom:10px;min-height:20px';
  const nar=narrate('Click the steps in the order that makes a valid logical argument.');
  function renderOrder(){
    slots.innerHTML='';
    placed.forEach((idx,pos)=>{
      const correct=(idx===correctOrder[pos]);
      const d=el('div');d.style.cssText=`display:flex;gap:8px;align-items:flex-start;padding:8px 11px;border-radius:8px;border:1.5px solid ${correct?'var(--green)':'var(--accent)'};background:${correct?'#EBF7EF':'#FDEEE8'}`;
      d.innerHTML=`<b style="color:${correct?'var(--green)':'var(--accent)'}">${pos+1}.</b> <span>${opts.steps[idx].text}</span>`;
      slots.append(d);
    });
    // pool of remaining
    pool.innerHTML='';
    shuffled.filter(i=>!placed.includes(i)).forEach(idx=>{
      const b=el('button');b.style.cssText='text-align:left;background:var(--soft);border:1px solid var(--softline);border-radius:8px;padding:8px 11px;cursor:pointer;font-size:.92rem';
      b.innerHTML=opts.steps[idx].text;
      b.onclick=()=>{placed.push(idx);renderOrder();check();};
      pool.append(b);
    });
    if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise([slots,pool]).catch(()=>{});
  }
  function check(){
    const allRight=placed.length===nSteps && placed.every((idx,pos)=>idx===correctOrder[pos]);
    if(placed.length===nSteps){
      if(allRight)nar.say('<span class="g">✓ Valid proof!</span> Every step follows from the ones before it. You didn\'t read this argument — you built it.');
      else nar.say('<span class="r">Not a valid order yet.</span> A red step doesn\'t follow from what precedes it. Reset and rethink the logical flow.');
    } else {
      const lastWrong=placed.length>0 && placed[placed.length-1]!==correctOrder[placed.length-1];
      if(lastWrong)nar.say('That step doesn\'t follow yet — but keep going, or reset. (What must be established <em>before</em> this step is true?)');
      else nar.say(`Good — ${placed.length}/${nSteps} in place. What comes next?`);
    }
  }
  const resetO=el('button','btn ghost','reset');resetO.onclick=()=>{placed=[];renderOrder();nar.say('Cleared. Click the steps in logical order.');};
  const ctrO=el('div','controls');ctrO.append(resetO);
  orderWrap.append(slots,el('div',null,'<div style="font-size:.78rem;color:var(--muted);margin:4px 0">available steps:</div>'),pool,ctrO);

  // ---- MODE B: JUSTIFY (only if steps carry reasons/choices) ----
  const hasReasons=opts.steps.every(s=>s.reason&&s.choices);
  const justifyWrap=el('div');
  if(hasReasons){
    opts.steps.forEach((s,i)=>{
      const card=el('div');card.style.cssText='border:1px solid var(--softline);border-radius:9px;padding:10px 12px;margin:7px 0';
      card.innerHTML=`<div style="margin-bottom:6px"><b>${i+1}.</b> ${s.text}</div><div style="font-size:.78rem;color:var(--muted);margin-bottom:5px">why is this step justified?</div>`;
      const fb=el('div');fb.style.cssText='font-size:.85rem;margin-top:5px;min-height:1em';
      s.choices.forEach(ch=>{const b=el('button','opt',ch);b.style.margin='4px 0';
        b.onclick=()=>{if(ch===s.reason){b.style.borderColor='var(--green)';b.style.background='#EBF7EF';fb.innerHTML='<span style="color:var(--green);font-weight:700">✓ Right justification.</span>';}
          else{b.style.borderColor='var(--accent)';b.style.background='#FDEEE8';fb.innerHTML='<span style="color:var(--accent);font-weight:700">Not the reason this step holds.</span>';}};
        card.append(b);});
      card.append(fb);justifyWrap.append(card);
    });
    if(window.MathJax&&window.MathJax.typesetPromise)setTimeout(()=>window.MathJax.typesetPromise([justifyWrap]).catch(()=>{}),0);
  }
  // ---- mode tabs ----
  const tabs=el('div');tabs.style.cssText='display:flex;gap:6px;margin-bottom:10px';
  const tabO=el('button','btn','1 · order the steps');
  const tabJ=el('button','btn ghost','2 · justify each step');
  const body=el('div');
  function show(which){
    body.innerHTML='';
    if(which==='order'){tabO.className='btn';tabJ.className='btn ghost';body.append(orderWrap);renderOrder();}
    else{tabO.className='btn ghost';tabJ.className='btn';body.append(justifyWrap);}
  }
  tabO.onclick=()=>show('order');tabJ.onclick=()=>show('justify');
  tabs.append(tabO);if(hasReasons)tabs.append(tabJ);
  wrap.append(tabs,body,nar);show('order');
  return wrap;
}

function svdPhoto(){
  const wrap=el('div');
  const nar=narrate('Upload a photo (or use the sample), then slide the rank down and watch the SVD throw away detail you can barely see.');
  const SZ=64; // work at 64x64 grayscale for speed
  let gray=null; // SZ x SZ matrix
  const srcC=el('canvas');srcC.width=160;srcC.height=160;const sctx=srcC.getContext('2d');
  const outC=el('canvas');outC.width=160;outC.height=160;const octx=outC.getContext('2d');
  const work=document.createElement('canvas');work.width=SZ;work.height=SZ;const wctx=work.getContext('2d');
  const info=el('div');info.style.cssText='font-size:.82rem;color:var(--muted);margin-top:6px';
  // rank-k reconstruction via power iteration + deflation on the SZxSZ matrix
  function svdRecon(A,k){
    const n=A.length; let R=A.map(r=>r.slice());const layers=[];
    for(let t=0;t<k;t++){
      let v=Array(n).fill(0).map(()=>Math.random());
      for(let it=0;it<25;it++){
        let u=R.map(row=>row.reduce((s,a,j)=>s+a*v[j],0));const un=Math.hypot(...u)||1;u=u.map(x=>x/un);
        let nv=Array(n).fill(0);for(let i=0;i<n;i++)for(let j=0;j<n;j++)nv[j]+=R[i][j]*u[i];const nvn=Math.hypot(...nv)||1;v=nv.map(x=>x/nvn);
      }
      let u=R.map(row=>row.reduce((s,a,j)=>s+a*v[j],0));const sigma=Math.hypot(...u)||1;u=u.map(x=>x/sigma);
      layers.push({u,v,sigma});
      for(let i=0;i<n;i++)for(let j=0;j<n;j++)R[i][j]-=sigma*u[i]*v[j];
    }
    const out=Array.from({length:n},()=>Array(n).fill(0));
    layers.forEach(({u,v,sigma})=>{for(let i=0;i<n;i++)for(let j=0;j<n;j++)out[i][j]+=sigma*u[i]*v[j];});
    return out;
  }
  function drawSmall(ctx,mat,size){const cell=size/SZ;for(let y=0;y<SZ;y++)for(let x=0;x<SZ;x++){const v=clamp(Math.round(mat[y][x]),0,255);ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(x*cell,y*cell,cell+1,cell+1);}}
  function recompute(k){
    if(!gray)return;const R=svdRecon(gray,k);drawSmall(octx,R,160);
    const full=SZ*SZ, kept=k*(2*SZ+1);
    info.innerHTML=`rank <b>${k}</b> of ${SZ} · stored numbers: <b>${kept.toLocaleString()}</b> vs ${full.toLocaleString()} — about <b>${Math.round(kept/full*100)}%</b> of the data`;
    nar.say(k<=3?'Just the biggest shapes — but you can already tell what it is.':k<=12?'Most of the detail, a fraction of the numbers. <span class="g">This is lossy compression, running the real SVD on YOUR image.</span>':'Nearly perfect — the last layers were almost noise.');
  }
  function loadFromCanvas(){
    wctx.drawImage(srcC,0,0,SZ,SZ);const d=wctx.getImageData(0,0,SZ,SZ).data;gray=[];
    for(let y=0;y<SZ;y++){gray[y]=[];for(let x=0;x<SZ;x++){const i=(y*SZ+x)*4;gray[y][x]=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];}}
    recompute(parseInt(rk.input.value));
  }
  function makeSample(){ // a friendly synthetic 'landscape'
    sctx.fillStyle='#888';sctx.fillRect(0,0,160,160);
    for(let y=0;y<160;y++){const t=y/160;const c=Math.round(60+150*t);sctx.fillStyle=`rgb(${c},${c},${c})`;sctx.fillRect(0,y,160,1);}
    sctx.fillStyle='#fff';sctx.beginPath();sctx.arc(120,40,18,0,7);sctx.fill(); // 'sun'
    sctx.fillStyle='#333';sctx.beginPath();sctx.moveTo(0,120);sctx.lineTo(50,70);sctx.lineTo(100,120);sctx.closePath();sctx.fill(); // 'mountain'
    sctx.beginPath();sctx.moveTo(70,120);sctx.lineTo(120,80);sctx.lineTo(160,120);sctx.closePath();sctx.fill();
    loadFromCanvas();
  }
  const rk=rangeRow({label:'rank kept (k)',min:1,max:SZ,step:1,value:6,onInput:v=>recompute(v)});
  // file upload
  const fileWrap=el('div');fileWrap.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px';
  const file=el('input');file.type='file';file.accept='image/*';file.style.cssText='font-size:.85rem';
  file.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const img=new Image();
    img.onload=()=>{sctx.fillStyle='#000';sctx.fillRect(0,0,160,160);
      // fit
      const s=Math.min(160/img.width,160/img.height);const w=img.width*s,h=img.height*s;sctx.drawImage(img,(160-w)/2,(160-h)/2,w,h);loadFromCanvas();};
    img.src=URL.createObjectURL(f);});
  const sampleBtn=el('button','btn ghost','use sample');sampleBtn.onclick=makeSample;
  fileWrap.append(el('span',null,'<b style="font-size:.85rem">your photo:</b>'),file,sampleBtn);
  const imgs=el('div');imgs.style.cssText='display:flex;gap:16px;align-items:center;flex-wrap:wrap';
  const c1=el('div');c1.style.cssText='text-align:center';c1.append(srcC);c1.insertAdjacentHTML('beforeend','<div style="font-size:.75rem;color:var(--muted)">original</div>');
  const c2=el('div');c2.style.cssText='text-align:center';c2.append(outC);c2.insertAdjacentHTML('beforeend','<div style="font-size:.75rem;color:var(--muted)">SVD-compressed</div>');
  imgs.append(c1,c2);
  const dlBtn=el('button','btn','⬇ download compressed');
  dlBtn.onclick=()=>{const a=document.createElement('a');a.download='svd-compressed.png';a.href=outC.toDataURL('image/png');a.click();};
  const dlRow=el('div','controls');dlRow.append(dlBtn);
  wrap.append(fileWrap,rk,imgs,info,dlRow,nar);
  makeSample();
  return wrap;
}

function eigenCheck(opts){
  const A=(opts&&opts.A)||[[2,1],[1,2]];
  const wrap=el('div');const nar=narrate('Type a vector (x, y). I\'ll compute A·v and check if it\'s an eigenvector.');
  wrap.append(el('div',null,`<div style="font-size:.75rem;color:var(--muted)">A</div>`));
  const disp=el('div');disp.innerHTML=matrixHTML(A);wrap.append(disp);
  const row=el('div');row.style.cssText='display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap';
  const xi=el('input');xi.type='number';xi.placeholder='x';const yi=el('input');yi.type='number';yi.placeholder='y';
  [xi,yi].forEach(inp=>inp.style.cssText='width:56px;text-align:center;padding:8px;border:1.5px solid var(--softline);border-radius:7px;font-family:var(--mono)');
  const btn=el('button','btn','check v = (x, y)');
  btn.onclick=()=>{const x=parseFloat(xi.value)||0,y=parseFloat(yi.value)||0;
    if(x===0&&y===0){nar.say('The zero vector is never an eigenvector — try a nonzero one.');return;}
    const av=[A[0][0]*x+A[0][1]*y, A[1][0]*x+A[1][1]*y];
    const cross=x*av[1]-y*av[0];
    const parallel=Math.abs(cross)<1e-9;
    if(parallel){const lam=Math.abs(x)>Math.abs(y)?av[0]/x:av[1]/y;
      nar.say(`A·v = (${av[0]}, ${av[1]}) = <span class="k">${lam}</span>·(${x}, ${y}). <span class="g">✓ Yes! v is an eigenvector with eigenvalue λ = ${lam}.</span>`);}
    else nar.say(`A·v = (${av[0]}, ${av[1]}), which is <span class="r">NOT</span> a multiple of (${x}, ${y}) — the matrix rotated it, so v is not an eigenvector. Try again. (Hint: this A\'s eigenvectors are (1,1) and (1,−1).)`);};
  xi.addEventListener('keydown',e=>{if(e.key==='Enter')btn.click();});yi.addEventListener('keydown',e=>{if(e.key==='Enter')btn.click();});
  row.append(el('span',null,'v = ('),xi,el('span',null,','),yi,el('span',null,')'),btn);
  wrap.append(row,nar);
  if(window.MathJax&&window.MathJax.typesetPromise)setTimeout(()=>window.MathJax.typesetPromise([disp]).catch(()=>{}),0);
  return wrap;
}

return {C,clamp,lerp,fmt,el,hidpi,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,randUnit,
        numberline,board3d,spanBoard,fourRep,projectionBoard,ladder,
        worked,gallery,matrixBoard,analogyDemo,
        configSpace,possibilityCounter,morphPath,diffVector,webGraph,
        matrixGrid,matrixHTML,rrefStepper,systemLines,
        eigenExplorer,detArea,
        leastSquares,pcaCloud,
        luStepper,quadFormPlot,complexPlane,fourierSynth,
        practiceSet,PROBLEMS,rowOpSolver,matmulBuilder,cofactorBuilder,eigenCheck,matrixLab,svdPhoto,proofBuilder,gramSchmidtViz,fourSubspaces,transformQuiz};
})();
