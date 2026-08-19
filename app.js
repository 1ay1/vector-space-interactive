/* ============================================================
   app.js — controller: nav, routing, progress, landing
   ============================================================ */
'use strict';
(function(){
  const content   = document.getElementById('content');
  const chapnav   = document.getElementById('chapnav');
  const dotline   = document.getElementById('dotline');
  const prevBtn   = document.getElementById('prevChap');
  const nextBtn   = document.getElementById('nextChap');
  const progFill  = document.getElementById('progressFill');
  const progLabel = document.getElementById('progressLabel');
  const landing   = document.getElementById('landing');
  const sidebar   = document.getElementById('sidebar');
  const menuToggle= document.getElementById('menuToggle');

  const KEY='vectorspace_progress_v1';
  let seen = new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));
  let idx = 0;

  function saveSeen(){localStorage.setItem(KEY,JSON.stringify([...seen]));}
  function updateProgress(){
    const pct=Math.round(seen.size/CHAPTERS.length*100);
    progFill.style.width=pct+'%';
    progLabel.textContent=pct+'% explored ('+seen.size+'/'+CHAPTERS.length+')';
  }

  /* ---- sidebar nav ---- */
  let navButtons=[];
  function buildNav(){
    chapnav.innerHTML='';
    navButtons=[];
    let lastPart=null;
    CHAPTERS.forEach((c,i)=>{
      if(c.part && c.part!==lastPart){
        const ph=document.createElement('div');ph.className='part-head';ph.textContent=c.part;
        chapnav.append(ph); lastPart=c.part;
      }
      const b=document.createElement('button');
      b.className='chap-link';
      b.dataset.idx=i;
      b.innerHTML=`<span class="chap-num">${i+1}</span>
        <span class="chap-meta"><span class="chap-title">${c.title}</span>
        <span class="chap-sub">${shortSub(c.sub)}</span></span>`;
      chapnav.append(b);
      navButtons.push(b);
    });
  }
  // one delegated listener — a click anywhere in a chap-link goes to that chapter
  chapnav.addEventListener('click',e=>{
    const b=e.target.closest('.chap-link');
    if(b){ go(parseInt(b.dataset.idx,10), {fromNavClick:true}); }
  });
  function shortSub(s){return s.length>60? s.slice(0,58)+'…':s;}

  // sidebar search: filter chapter buttons by title/sub, hide empty part headers
  const searchInput=document.getElementById('chapSearch');
  if(searchInput){
    searchInput.addEventListener('input',()=>{
      const q=searchInput.value.trim().toLowerCase();
      navButtons.forEach((b,i)=>{
        const c=CHAPTERS[i];
        const hit=!q || (c.title+' '+c.sub+' '+(c.part||'')).toLowerCase().includes(q);
        b.classList.toggle('hiddenBySearch',!hit);
      });
      // hide a part header if all its chapters are hidden
      [...chapnav.querySelectorAll('.part-head')].forEach(ph=>{
        let n=ph.nextElementSibling, anyVisible=false;
        while(n && !n.classList.contains('part-head')){
          if(n.classList.contains('chap-link') && !n.classList.contains('hiddenBySearch')) anyVisible=true;
          n=n.nextElementSibling;
        }
        ph.classList.toggle('hiddenBySearch',!anyVisible);
      });
    });
  }

  function buildDots(){
    // 68 dots overflow + are too small to click; show a compact
    // "chapter N of M" indicator with a slim progress bar instead.
    dotline.innerHTML='<div class="chap-counter"></div><div class="chap-minibar"><div></div></div>';
  }

  function refreshChrome(opts){
    opts=opts||{};
    navButtons.forEach((b,i)=>{
      b.classList.toggle('active',i===idx);
      b.classList.toggle('done',seen.has(CHAPTERS[i].id)&&i!==idx);
    });
    [...dotline.children].forEach((d,i)=>{
      d.classList.toggle('on',i===idx);
      d.classList.toggle('seen',seen.has(CHAPTERS[i].id)&&i!==idx);
    });
    // update compact chapter counter + mini progress bar
    const counter=dotline.querySelector('.chap-counter');
    const barFill=dotline.querySelector('.chap-minibar > div');
    if(counter) counter.textContent='Chapter '+(idx+1)+' of '+CHAPTERS.length;
    if(barFill) barFill.style.width=((idx+1)/CHAPTERS.length*100)+'%';
    prevBtn.disabled=idx===0;
    nextBtn.textContent = idx===CHAPTERS.length-1?'finish ✓':'next →';
    // Only auto-scroll the nav when navigation did NOT come from clicking a
    // nav row (a click means the row is already under the user's cursor;
    // scrolling it would shift the list and feel like a mis-click).
    const active=navButtons[idx];
    if(active && !opts.fromNavClick){
      const navR=chapnav.getBoundingClientRect();
      const itemR=active.getBoundingClientRect();
      if(itemR.top < navR.top+4){
        chapnav.scrollTop -= (navR.top - itemR.top) + 8;
      }else if(itemR.bottom > navR.bottom-4){
        chapnav.scrollTop += (itemR.bottom - navR.bottom) + 8;
      }
    }
    updateProgress();
  }

  function go(i, opts){
    idx=Math.max(0,Math.min(CHAPTERS.length-1,i));
    content.innerHTML='';
    const chapter=document.createElement('div');
    chapter.className='chapter';
    content.append(chapter);
    try{ CHAPTERS[idx].render(chapter); }
    catch(err){ chapter.innerHTML='<p style="color:var(--accent)">Widget error: '+err.message+'</p>'; console.error(err); }
    seen.add(CHAPTERS[idx].id); saveSeen();
    refreshChrome(opts);
    // typeset any math in the freshly rendered chapter
    if(window.MathJax && window.MathJax.typesetPromise){
      window.MathJax.typesetPromise([chapter]).catch(()=>{});
    } else if(window.__mathjaxFailed && window.texPrettify){
      // offline / CDN blocked: render formulas as readable Unicode
      window.texPrettify(chapter);
    } else {
      // MathJax not loaded YET — retry, then fall back to the prettifier
      const target=chapter;
      setTimeout(()=>{
        if(window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([target]).catch(()=>{});
        else if(window.texPrettify) window.texPrettify(target);
      }, 1200);
    }
    // scroll only the page/content — never an ancestor of the sidebar
    window.scrollTo(0,0);
    if(content.scrollTop) content.scrollTop=0;
    sidebar.classList.remove('open');
    location.hash=CHAPTERS[idx].id;
  }

  prevBtn.onclick=()=>go(idx-1);
  nextBtn.onclick=()=>go(idx+1);
  // let connection links jump to a chapter by id
  window.vsGoTo=function(id){const i=CHAPTERS.findIndex(c=>c.id===id);if(i>=0)go(i);};
  // keyboard navigation: ←/→ (or j/k) move between chapters, unless typing in a field
  document.addEventListener('keydown',e=>{
    if(landing && !landing.classList.contains('hidden')) return;
    const tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea'||tag==='select'||e.metaKey||e.ctrlKey||e.altKey) return;
    if(e.key==='ArrowLeft'||e.key==='k'){ if(idx>0){go(idx-1);e.preventDefault();} }
    else if(e.key==='ArrowRight'||e.key==='j'){ if(idx<CHAPTERS.length-1){go(idx+1);e.preventDefault();} }
  });
  menuToggle.onclick=()=>sidebar.classList.toggle('open');
  document.getElementById('resetProgress').onclick=()=>{
    seen=new Set(); saveSeen(); refreshChrome();
  };

  /* ---- landing ---- */
  const chips=['a colour is 3 numbers','add = combine two lists','span','change your rulers',
    'Pythagoras in any-D','similarity = angle','the 4th dimension, demystified',
    'why AI needs high-D'];
  const lc=document.getElementById('landingChips');
  chips.forEach(t=>{const s=document.createElement('span');s.textContent=t;lc.append(s);});

  function enter(target){
    landing.classList.add('hidden');
    go(target);
  }
  document.getElementById('startBtn').onclick=()=>enter(0);
  const labBtn=document.getElementById('labBtn');
  if(labBtn) labBtn.onclick=()=>{const i=CHAPTERS.findIndex(c=>c.id==='matrixlab');enter(i>=0?i:0);};
  document.getElementById('jumpBtn').onclick=()=>{
    landing.classList.add('hidden');
    sidebar.classList.add('open');
    go(idx);
  };

  /* ---- theme ---- */
  const THEME_KEY='vs-theme';
  function currentTheme(){ return document.documentElement.getAttribute('data-theme')==='light'?'light':'dark'; }
  function setTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    try{ localStorage.setItem(THEME_KEY,t); }catch(e){}
    // pull the new CSS colours into the canvas palette, then repaint
    if(window.VS && VS.refreshPalette) VS.refreshPalette();
    if(!landing || landing.classList.contains('hidden')) go(idx,{noScroll:true});
  }
  function toggleTheme(){ setTheme(currentTheme()==='dark'?'light':'dark'); }
  ['themeToggle','themeToggleLanding'].forEach(id=>{const b=document.getElementById(id);if(b)b.onclick=toggleTheme;});

  /* ---- boot ---- */
  buildNav(); buildDots();
  // deep link via hash
  const h=location.hash.replace('#','');
  const found=CHAPTERS.findIndex(c=>c.id===h);
  if(found>=0){ idx=found; landing.classList.add('hidden'); go(found); }
  else { go(0); /* pre-render chapter 1 behind landing */ }
  refreshChrome();
})();

/* ============================================================
   Landing hero: a LIVE LINEAR TRANSFORMATION.
   A 3-D lattice of points is continuously deformed by an
   animated 3x3 matrix (rotation + slow shear + breathing),
   perspective-projected, drawn as a depth-fogged wireframe
   with glowing i/j/k basis arrows. The mouse tilts the camera.
   This literally shows space bending — the whole course in a loop.
   ============================================================ */
(function(){
  const cv=document.getElementById('heroField'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const landing=document.getElementById('landing');
  let W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),t=0,raf=0;
  const cam={rx:-0.5,ry:0.6,trx:-0.5,try_:0.6};
  function css(v,f){try{return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||f;}catch(e){return f;}}
  function hex(h,f){h=(h||f).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];}
  function resize(){
    W=window.innerWidth; H=window.innerHeight;
    cv.style.width=W+'px'; cv.style.height=H+'px';
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  // ---- build a lattice of points on an N×N×N grid, plus its edges ----
  const N=4, R=1.6, verts=[], edges=[];
  const idx=(i,j,k)=>((i*N)+j)*N+k;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++)for(let k=0;k<N;k++){
    const x=(i/(N-1)-0.5)*2*R, y=(j/(N-1)-0.5)*2*R, z=(k/(N-1)-0.5)*2*R;
    verts.push([x,y,z]);
  }
  for(let i=0;i<N;i++)for(let j=0;j<N;j++)for(let k=0;k<N;k++){
    if(i<N-1)edges.push([idx(i,j,k),idx(i+1,j,k)]);
    if(j<N-1)edges.push([idx(i,j,k),idx(i,j+1,k)]);
    if(k<N-1)edges.push([idx(i,j,k),idx(i,j,k+1)]);
  }

  function matmul(M,v){return [
    M[0]*v[0]+M[1]*v[1]+M[2]*v[2],
    M[3]*v[0]+M[4]*v[1]+M[5]*v[2],
    M[6]*v[0]+M[7]*v[1]+M[8]*v[2]];}
  // camera rotation (yaw then pitch)
  function view(v,rx,ry){
    let [x,y,z]=v;
    let x1=x*Math.cos(ry)+z*Math.sin(ry), z1=-x*Math.sin(ry)+z*Math.cos(ry);
    let y2=y*Math.cos(rx)-z1*Math.sin(rx), z2=y*Math.sin(rx)+z1*Math.cos(rx);
    return [x1,y2,z2];
  }
  function project(v,cx,cy,scale){
    const d=5.2, f=d/(d - v[2]);           // perspective
    return [cx+v[0]*scale*f, cy - v[1]*scale*f, f];
  }

  function draw(){
    const c1=hex(css('--accent','#5EEAD4')), c2=hex(css('--accent2','#8B7CFF'));
    const bg=hex(css('--bg','#0A0B0F'));
    ctx.clearRect(0,0,W,H);
    cam.rx+=(cam.trx-cam.rx)*0.04; cam.ry+=(cam.try_-cam.ry)*0.04;

    // hero art is anchored to the right third on wide screens
    const cx = W>900 ? W*0.72 : W*0.5;
    const cy = H>620 ? H*0.46 : H*0.4;
    const scale = Math.min(W,H)*0.17 + 40;

    // ---- the animated transformation matrix M(t) ----
    const a=t*0.5, breathe=1+0.12*Math.sin(t*0.7);
    const shear=0.5*Math.sin(t*0.33), shear2=0.35*Math.cos(t*0.24);
    // base spin about the vertical axis, folded into the lattice itself
    const cs=Math.cos(a*0.35), sn=Math.sin(a*0.35);
    const M=[ breathe*cs, shear, breathe*sn,
              shear2, breathe, shear,
             -breathe*sn, shear2, breathe*cs ];

    // transform + view + project every vertex
    const P=new Array(verts.length);
    for(let n=0;n<verts.length;n++){
      const tv=matmul(M,verts[n]);
      const vv=view(tv,cam.rx,cam.ry);
      P[n]=project(vv,cx,cy,scale);
      P[n].z=vv[2];
    }

    // depth sort edges (painter's algorithm) for correct fog layering
    const order=edges.map((e,i)=>i).sort((A,B)=>
      (P[edges[B][0]].z+P[edges[B][1]].z) - (P[edges[A][0]].z+P[edges[A][1]].z));

    for(const ei of order){
      const [a0,b0]=edges[ei], p=P[a0], q=P[b0];
      const zc=(p.z+q.z)/2;
      const depth=Math.max(0,Math.min(1,(zc-2.6)/3.2));   // 0 far .. 1 near
      const mix=Math.max(0,Math.min(1,(p[0]+q[0])/(W)+.5));
      const r=Math.round(c1[0]+(c2[0]-c1[0])*mix),
            g=Math.round(c1[1]+(c2[1]-c1[1])*mix),
            b=Math.round(c1[2]+(c2[2]-c1[2])*mix);
      const op=0.05+depth*0.5;
      ctx.strokeStyle=`rgba(${r},${g},${b},${op})`;
      ctx.lineWidth=0.5+depth*1.6;
      ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(q[0],q[1]); ctx.stroke();
    }
    // glowing lattice nodes (near ones brighter)
    for(let n=0;n<P.length;n++){
      const depth=Math.max(0,Math.min(1,(P[n].z-2.6)/3.2));
      if(depth<0.15)continue;
      ctx.fillStyle=`rgba(${c1[0]},${c1[1]},${c1[2]},${depth*0.7})`;
      ctx.beginPath(); ctx.arc(P[n][0],P[n][1],depth*1.8,0,7); ctx.fill();
    }

    // ---- glowing basis vectors i, j, k transformed by M ----
    const axes=[[R*1.15,0,0,c1],[0,R*1.15,0,c2],[0,0,R*1.15,hex(css('--accentb','#5AA0FF'))]];
    const O=project(view(matmul(M,[0,0,0]),cam.rx,cam.ry),cx,cy,scale);
    for(const [x,y,z,col] of axes){
      const e=project(view(matmul(M,[x,y,z]),cam.rx,cam.ry),cx,cy,scale);
      ctx.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},0.95)`;
      ctx.lineWidth=2.4; ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.8)`; ctx.shadowBlur=14;
      ctx.beginPath(); ctx.moveTo(O[0],O[1]); ctx.lineTo(e[0],e[1]); ctx.stroke();
      const ang=Math.atan2(e[1]-O[1],e[0]-O[0]), hl=9;
      ctx.beginPath(); ctx.moveTo(e[0],e[1]);
      ctx.lineTo(e[0]-Math.cos(ang-0.4)*hl,e[1]-Math.sin(ang-0.4)*hl);
      ctx.lineTo(e[0]-Math.cos(ang+0.4)*hl,e[1]-Math.sin(ang+0.4)*hl);
      ctx.closePath(); ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},0.95)`; ctx.fill();
      ctx.shadowBlur=0;
    }

    t+=0.010;
    raf=requestAnimationFrame(draw);
  }
  function stop(){ if(raf) cancelAnimationFrame(raf); raf=0; }
  function start(){ if(!raf && !landing.classList.contains('hidden')) draw(); }
  window.addEventListener('resize',resize);
  window.addEventListener('pointermove',e=>{
    const nx=e.clientX/window.innerWidth-0.5, ny=e.clientY/window.innerHeight-0.5;
    cam.try_=0.6+nx*0.9; cam.trx=-0.5-ny*0.7;
  });
  const obs=new MutationObserver(()=>{ landing.classList.contains('hidden')?stop():start(); });
  obs.observe(landing,{attributes:true,attributeFilter:['class']});
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    resize(); requestAnimationFrame(()=>{ draw(); stop(); });
  } else { resize(); start(); }
})();
