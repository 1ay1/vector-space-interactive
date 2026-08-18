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
   Landing hero: a live vector field. A grid of little arrows
   whose directions swirl through a slowly-evolving flow, with
   a soft parallax toward the cursor. On-brand and calm, not busy.
   ============================================================ */
(function(){
  const cv=document.getElementById('heroField'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const landing=document.getElementById('landing');
  let W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),t=0,raf=0;
  const mouse={x:.5,y:.4,tx:.5,ty:.4};
  function css(v,f){try{return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||f;}catch(e){return f;}}
  function resize(){
    W=window.innerWidth; H=window.innerHeight;
    cv.style.width=W+'px'; cv.style.height=H+'px';
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  // flow angle at a point — layered sines make a smooth, non-repeating swirl
  function field(x,y,time){
    return Math.sin(x*0.9+time*0.6)*1.1
         + Math.cos(y*0.8-time*0.5)*1.1
         + Math.sin((x+y)*0.5+time*0.3)*0.8;
  }
  function hex2rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];}
  function draw(){
    const acc=css('--accent','#5EEAD4'), acc2=css('--accent2','#8B7CFF');
    const c1=hex2rgb(acc), c2=hex2rgb(acc2);
    ctx.clearRect(0,0,W,H);
    mouse.x+=(mouse.tx-mouse.x)*0.05; mouse.y+=(mouse.ty-mouse.y)*0.05;
    const step=Math.max(46, Math.min(72, W/22));
    const len=step*0.42;
    const mx=mouse.x*W, my=mouse.y*H;
    for(let gy=step*0.6; gy<H; gy+=step){
      for(let gx=step*0.6; gx<W; gx+=step){
        const nx=gx/W*6, ny=gy/H*6;
        // parallax pull toward cursor
        const dxm=(mx-gx), dym=(my-gy), dist=Math.hypot(dxm,dym);
        const pull=Math.max(0,1-dist/(W*0.5));
        const a=field(nx,ny,t)+Math.atan2(dym,dxm)*pull*0.9;
        const ex=gx+Math.cos(a)*len, ey=gy+Math.sin(a)*len;
        // colour + opacity blend across the field
        const mix=(Math.sin(nx+ny+t*0.4)+1)/2;
        const r=Math.round(c1[0]+(c2[0]-c1[0])*mix),
              g=Math.round(c1[1]+(c2[1]-c1[1])*mix),
              b=Math.round(c1[2]+(c2[2]-c1[2])*mix);
        const op=0.10+0.22*mix+0.35*pull;
        ctx.strokeStyle=`rgba(${r},${g},${b},${op})`;
        ctx.lineWidth=1.1+pull*1.2;
        ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(ex,ey); ctx.stroke();
        // arrowhead
        const hl=3.4+pull*2;
        ctx.beginPath();
        ctx.moveTo(ex,ey);
        ctx.lineTo(ex-Math.cos(a-0.5)*hl, ey-Math.sin(a-0.5)*hl);
        ctx.moveTo(ex,ey);
        ctx.lineTo(ex-Math.cos(a+0.5)*hl, ey-Math.sin(a+0.5)*hl);
        ctx.stroke();
        // node dot
        ctx.fillStyle=`rgba(${r},${g},${b},${op*0.9})`;
        ctx.beginPath(); ctx.arc(gx,gy,1.1+pull*1.4,0,7); ctx.fill();
      }
    }
    t+=0.006;
    raf=requestAnimationFrame(draw);
  }
  function stop(){ if(raf) cancelAnimationFrame(raf); raf=0; }
  function start(){ if(!raf && !landing.classList.contains('hidden')) draw(); }
  window.addEventListener('resize',resize);
  window.addEventListener('pointermove',e=>{ mouse.tx=e.clientX/window.innerWidth; mouse.ty=e.clientY/window.innerHeight; });
  // pause when the landing is dismissed to save cycles; resume if it returns
  const obs=new MutationObserver(()=>{ landing.classList.contains('hidden')?stop():start(); });
  obs.observe(landing,{attributes:true,attributeFilter:['class']});
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    resize(); // draw one static frame
    const one=requestAnimationFrame(()=>{ draw(); stop(); });
  } else { resize(); start(); }
})();
