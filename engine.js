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

return {C,clamp,lerp,fmt,el,hidpi,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,randUnit};
})();
