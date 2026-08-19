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
   Landing hero: an ISOMETRIC coordinate frame.
   A 3-D unit cube + the i/j/k basis arrows, drawn in axonometric
   projection and slowly rotating — the theme's grid made literal.
   Calm, light, on-brand. Pauses when the landing is dismissed.
   ============================================================ */
(function(){
  const cv=document.getElementById('isoField'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const landing=document.getElementById('landing');
  let W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),t=0,raf=0;
  function css(v,f){try{return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||f;}catch(e){return f;}}
  function resize(){
    W=window.innerWidth; H=window.innerHeight;
    cv.style.width=W+'px'; cv.style.height=H+'px';
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  // unit cube corners + edges
  const V=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
  const E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  function rotY(p,a){const c=Math.cos(a),s=Math.sin(a);return [c*p[0]+s*p[2],p[1],-s*p[0]+c*p[2]];}
  function rotX(p,a){const c=Math.cos(a),s=Math.sin(a);return [p[0],c*p[1]-s*p[2],s*p[1]+c*p[2]];}
  // isometric projection
  function iso(p,cx,cy,s){
    const x=p[0]-0.5,y=p[1]-0.5,z=p[2]-0.5;
    const sx=(x-z)*Math.cos(0.5236);
    const sy=(x+z)*Math.sin(0.5236)-y;
    return [cx+sx*s, cy - sy*s];
  }
  function arrow(a,b,col,w){
    ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=w;
    ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();
    const ang=Math.atan2(b[1]-a[1],b[0]-a[0]), hl=10;
    ctx.beginPath(); ctx.moveTo(b[0],b[1]);
    ctx.lineTo(b[0]-Math.cos(ang-0.4)*hl,b[1]-Math.sin(ang-0.4)*hl);
    ctx.lineTo(b[0]-Math.cos(ang+0.4)*hl,b[1]-Math.sin(ang+0.4)*hl);
    ctx.closePath(); ctx.fill();
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const cx = W>760 ? W*0.72 : W*0.5;
    const cy = H*0.42;
    const s  = Math.min(W,H)*0.16 + 40;
    const ay=t*0.28, ax=0.15*Math.sin(t*0.4);
    const line=css('--iso-strong','rgba(79,70,229,.10)');
    const I=css('--accent','#4F46E5'), J=css('--accent2','#E5484D'), K=css('--accentb','#0EA5A5');
    const P=V.map(p=>iso(rotX(rotY(p,ay),ax),cx,cy,s));
    // faint cube wireframe
    ctx.strokeStyle=line; ctx.lineWidth=1.4;
    for(const [a,b] of E){ctx.beginPath();ctx.moveTo(P[a][0],P[a][1]);ctx.lineTo(P[b][0],P[b][1]);ctx.stroke();}
    // corner dots
    ctx.fillStyle=line;
    for(const p of P){ctx.beginPath();ctx.arc(p[0],p[1],2.2,0,7);ctx.fill();}
    // i / j / k basis arrows from the origin corner
    const O=iso(rotX(rotY([0,0,0],ay),ax),cx,cy,s);
    const ei=iso(rotX(rotY([1,0,0],ay),ax),cx,cy,s);
    const ej=iso(rotX(rotY([0,1,0],ay),ax),cx,cy,s);
    const ek=iso(rotX(rotY([0,0,1],ay),ax),cx,cy,s);
    arrow(O,ei,I,2.6); arrow(O,ej,J,2.6); arrow(O,ek,K,2.6);
    ctx.font='600 15px "Inter",system-ui,sans-serif';
    ctx.fillStyle=I; ctx.fillText('i',ei[0]+7,ei[1]+4);
    ctx.fillStyle=J; ctx.fillText('j',ej[0]+7,ej[1]+4);
    ctx.fillStyle=K; ctx.fillText('k',ek[0]+7,ek[1]+4);
    t+=0.006;
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
