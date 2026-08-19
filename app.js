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
   Landing hero: a LIVE 2×2 EIGEN-ENGINE.
   An animated matrix A(t) is applied to the plane. We render:
     • the unit grid warped by A (space bending),
     • a swarm of particles flowing along x → A·x (the field),
     • the eigenvectors, COMPUTED LIVE, drawn as glowing
       invariant lines — or a rotating swirl when they go complex,
     • a HUD that prints A, det, tr, and λ₁,λ₂ every frame.
   The whole course — transforms, determinants, eigenvectors,
   even complex spectra — running as the background.
   ============================================================ */
(function(){
  const cv=document.getElementById('heroField'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const landing=document.getElementById('landing');
  const hud={m00:g('m00'),m01:g('m01'),m10:g('m10'),m11:g('m11'),
             det:g('hDet'),tr:g('hTr'),l1:g('hL1'),l2:g('hL2'),eig:g('hEig')};
  function g(id){return document.getElementById(id);}
  let W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),t=0,raf=0,frame=0;
  const mouse={x:.72,y:.5};
  function css(v,f){try{return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||f;}catch(e){return f;}}
  function hex(h,f){h=(h||f).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];}
  function resize(){
    W=window.innerWidth; H=window.innerHeight;
    cv.style.width=W+'px'; cv.style.height=H+'px';
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  // world<->screen. The plane is centred on the right third, one unit = `u` px.
  function origin(){ return [ W>900?W*0.70:W*0.5, H>620?H*0.47:H*0.42 ]; }
  function unit(){ return Math.min(W,H)*0.115+26; }

  // particle swarm seeded in a disc
  const NP=170, part=[];
  function seed(p){const r=Math.sqrt(Math.random())*2.6,a=Math.random()*6.283;
    p.x=Math.cos(a)*r; p.y=Math.sin(a)*r; p.life=20+Math.random()*90;}
  for(let i=0;i<NP;i++){const p={};seed(p);p.life=Math.random()*100;part.push(p);}

  function matrix(time){
    // a smooth tour that visits BOTH regimes: real-eigenbasis stretches
    // and complex-pair rotations, roughly half the cycle in each.
    const s=0.75*Math.sin(time*0.31);              // shear
    const rot=0.42*Math.sin(time*0.13);            // bounded rotation (not monotonic)
    const sc=1+0.45*Math.sin(time*0.23);           // anisotropic scale
    const c=Math.cos(rot), sn=Math.sin(rot);
    const b00=sc, b01=s, b10=s*0.5, b11=1+0.4*Math.cos(time*0.19);
    return [ c*b00 - sn*b10, c*b01 - sn*b11,
             sn*b00 + c*b10, sn*b01 + c*b11 ];
  }

  function draw(){
    const A1=hex(css('--accent','#5EEAD4')), A2=hex(css('--accent2','#8B7CFF')),
          AB=hex(css('--accentb','#5AA0FF')), MU=hex(css('--muted','#8B909C'));
    ctx.clearRect(0,0,W,H);
    const [ox,oy]=origin(), u=unit();
    const [a,b,c,d]=matrix(t);
    const W2S=(x,y)=>[ox+x*u, oy-y*u];
    const apply=(x,y)=>[a*x+b*y, c*x+d*y];

    // ---- warped grid: image of the integer grid under A ----
    const G=5;
    ctx.lineWidth=1;
    for(let gx=-G;gx<=G;gx++){
      ctx.beginPath();
      for(let gy=-G;gy<=G;gy+=0.5){
        const [tx,ty]=apply(gx,gy); const [sx,sy]=W2S(tx,ty);
        gy===-G?ctx.moveTo(sx,sy):ctx.lineTo(sx,sy);
      }
      const near=gx===0;
      ctx.strokeStyle=`rgba(${MU[0]},${MU[1]},${MU[2]},${near?0.28:0.10})`;
      ctx.stroke();
    }
    for(let gy=-G;gy<=G;gy++){
      ctx.beginPath();
      for(let gx=-G;gx<=G;gx+=0.5){
        const [tx,ty]=apply(gx,gy); const [sx,sy]=W2S(tx,ty);
        gx===-G?ctx.moveTo(sx,sy):ctx.lineTo(sx,sy);
      }
      const near=gy===0;
      ctx.strokeStyle=`rgba(${MU[0]},${MU[1]},${MU[2]},${near?0.28:0.10})`;
      ctx.stroke();
    }

    // ---- particle field: each particle drifts along x -> A·x ----
    for(const p of part){
      const [vx,vy]=apply(p.x,p.y);
      const dx=(vx-p.x), dy=(vy-p.y);
      const [sx,sy]=W2S(p.x,p.y);
      const sp=Math.min(1,Math.hypot(dx,dy)*0.5);
      const col=sp<0.5?A1:A2;
      ctx.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},${0.15+sp*0.5})`;
      ctx.lineWidth=0.6+sp*1.4;
      const [ex,ey]=W2S(p.x+dx*0.06, p.y+dy*0.06);
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();
      p.x+=dx*0.014; p.y+=dy*0.014; p.life--;
      if(p.life<=0 || Math.hypot(p.x,p.y)>4.5) seed(p);
    }

    // ---- eigenvalues of [[a,b],[c,d]] ----
    const tr=a+d, det=a*d-b*c, disc=tr*tr-4*det;
    let complex=disc<0, l1,l2, e1=null,e2=null;
    if(!complex){
      const s=Math.sqrt(disc); l1=(tr+s)/2; l2=(tr-s)/2;
      // eigenvector for eigenvalue L: solve (a-L)x + b y = 0
      const evec=(L)=>{ let vx,vy;
        if(Math.abs(b)>1e-6){ vx=b; vy=L-a; }
        else if(Math.abs(c)>1e-6){ vx=L-d; vy=c; }
        else { vx=1; vy=0; }
        const n=Math.hypot(vx,vy)||1; return [vx/n,vy/n]; };
      e1=evec(l1); e2=evec(l2);
    } else {
      const re=tr/2, im=Math.sqrt(-disc)/2; l1=[re,im]; l2=[re,-im];
    }

    // ---- draw eigenlines (real) or a rotation swirl (complex) ----
    if(!complex){
      for(const [ev,L,col] of [[e1,l1,A1],[e2,l2,A2]]){
        const [ex,ey]=ev, len=6.5;
        const [x0,y0]=W2S(-ex*len,-ey*len), [x1,y1]=W2S(ex*len,ey*len);
        ctx.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},0.9)`;
        ctx.lineWidth=2; ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.85)`; ctx.shadowBlur=16;
        ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
        // stretch markers at ±λ along the invariant line (how much it scales)
        const sgn=L<0?-1:1;
        const [mx,my]=W2S(ex*Math.min(Math.abs(L),3.2)*sgn, ey*Math.min(Math.abs(L),3.2)*sgn);
        ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},0.95)`;
        ctx.beginPath(); ctx.arc(mx,my,4.5,0,7); ctx.fill();
        ctx.shadowBlur=0;
      }
    } else {
      // complex spectrum: no real invariant line — draw the rotation it encodes
      const re=l1[0], im=l1[1], ang=Math.atan2(im,re), rad=Math.hypot(re,im);
      ctx.strokeStyle=`rgba(${A2[0]},${A2[1]},${A2[2]},0.8)`; ctx.lineWidth=2;
      ctx.shadowColor=`rgba(${A2[0]},${A2[1]},${A2[2]},0.8)`; ctx.shadowBlur=16;
      ctx.beginPath(); ctx.arc(ox,oy,rad*u*0.9,-Math.PI/2,-Math.PI/2+ang*3,ang<0); ctx.stroke();
      ctx.shadowBlur=0;
    }

    // ---- basis images i'=A e1col, j'=A e2col drawn as arrows ----
    const bases=[[1,0,AB],[0,1,A1]];
    for(const [x,y,col] of bases){
      const [tx,ty]=apply(x,y); const [sx,sy]=W2S(tx,ty);
      ctx.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},0.95)`;
      ctx.lineWidth=2.6; ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.9)`; ctx.shadowBlur=12;
      ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(sx,sy); ctx.stroke();
      const ang=Math.atan2(sy-oy,sx-ox), hl=9;
      ctx.beginPath(); ctx.moveTo(sx,sy);
      ctx.lineTo(sx-Math.cos(ang-0.4)*hl, sy-Math.sin(ang-0.4)*hl);
      ctx.lineTo(sx-Math.cos(ang+0.4)*hl, sy-Math.sin(ang+0.4)*hl);
      ctx.closePath(); ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},0.95)`; ctx.fill();
      ctx.shadowBlur=0;
    }

    // ---- update the HUD (throttled to every 3rd frame) ----
    if(hud.m00 && (frame%3===0)){
      const f=x=>(x>=0?' ':'')+x.toFixed(2);
      hud.m00.textContent=f(a); hud.m01.textContent=f(b);
      hud.m10.textContent=f(c); hud.m11.textContent=f(d);
      hud.det.textContent=f(det); hud.det.className=det<0?'neg':'pos';
      hud.tr.textContent=f(tr);
      if(!complex){
        hud.l1.textContent=f(l1); hud.l2.textContent=f(l2);
        hud.l1.className=l1<0?'neg':'pos'; hud.l2.className=l2<0?'neg':'pos';
        hud.eig.textContent='real eigenbasis · space stretches'; hud.eig.className='hud-eig';
      } else {
        hud.l1.textContent=f(l1[0])+'+'+Math.abs(l1[1]).toFixed(2)+'i';
        hud.l2.textContent=f(l2[0])+'−'+Math.abs(l2[1]).toFixed(2)+'i';
        hud.l1.className=''; hud.l2.className='';
        hud.eig.textContent='complex pair · space rotates'; hud.eig.className='hud-eig complex';
      }
    }

    t+=0.010; frame++;
    raf=requestAnimationFrame(draw);
  }
  function stop(){ if(raf) cancelAnimationFrame(raf); raf=0; }
  function start(){ if(!raf && !landing.classList.contains('hidden')) draw(); }
  window.addEventListener('resize',resize);
  const obs=new MutationObserver(()=>{ landing.classList.contains('hidden')?stop():start(); });
  obs.observe(landing,{attributes:true,attributeFilter:['class']});
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    resize(); requestAnimationFrame(()=>{ draw(); stop(); });
  } else { resize(); start(); }
})();
