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
   Landing: a terminal boot sequence typed into #termOut.
   No canvas, no animation loop — just text.
   ============================================================ */
(function(){
  const out=document.getElementById('termOut'); if(!out) return;

  // ok/hi tokens rendered as coloured spans mid-line
  const OK='  \u0001g[ ok ]\u0002', DEF='\u0001g def\u0002';
  // ASCII banner (kept narrow so it survives small screens; hidden < 34ch via CSS)
  const banner=[
    {t:'\u250c\u2500\u2500\u2510  vectorspace',cls:'a',art:1},
    {t:'\u2502 \u2197\u2502  linear algebra runtime  v1.0',cls:'a',art:1},
    {t:'\u2514\u2500\u2500\u2518  \u211d\u207f \u2192 span \u2192 eig \u2192 SVD',cls:'d',art:1},
  ];
  const lines=[
    ...banner,
    {t:'',cls:'d'},
    {t:'$ ./configure --field=\u211d --dims=n && make',cls:'c'},
    {t:'probing scalar field ................ \u211d (\u2102 available)'+OK,cls:'d'},
    {t:'allocating basis {e\u2081 \u2026 e\u2099} ......... rank n'+OK,cls:'d'},
    {t:'checking 8 vector-space axioms ...... 8/8 pass'+OK,cls:'d'},
    {t:'  \u2022 closure, assoc, \u21920, \u2192\u2212v, 1\u00b7v, distributivity',cls:'d'},
    {t:'mounting inner-product \u27e8u,v\u27e9 ........ \u2016\u00b7\u2016, \u2220 online'+OK,cls:'d'},
    {t:'linking solvers: LU / QR / Gram\u2013Schmidt'+OK,cls:'d'},
    {t:'diagonalizing A = P\u039bP\u207b\u00b9 ........... \u03bb spectrum ok'+OK,cls:'d'},
    {t:'factoring A = U\u03a3V\u1d40 (SVD) ......... \u03c3\u2081\u2265\u2026\u2265\u03c3\u1d63'+OK,cls:'d'},
    {t:'verifying rank + nullity = n ........ \u2713 conserved'+OK,cls:'d'},
    {t:'loaded 68 chapters \u00b7 vectors \u2192 spectral \u2192 Fourier'+OK,cls:'d'},
    {t:'',cls:'d'},
    {t:'// theorem of the day',cls:'g'},
    {t:'  vector := ordered list of numbers you can adjust'+DEF,cls:'w'},
    {t:'  dim(V) := how many numbers. that is the whole idea.'+DEF,cls:'w'},
    {t:'',cls:'d'},
    {t:'>> drag \u00b7 predict \u00b7 solve \u00b7 prove \u2014 until n-D feels like 3-D',cls:'g'},
    {t:'',cls:'d'},
    {t:'system ready. type ./start to boot the course_',cls:'a'},
  ];

  const esc=ch=> ch==='<'?'&lt;': ch==='>'?'&gt;': ch==='&'?'&amp;': ch;
  const clsSpan=c=>c==='c'?'<span class="tc">':c==='a'?'<span class="ta">':c==='g'?'<span class="tg">':c==='w'?'<span class="tw">':'<span class="td">';
  // render a line's text with inline \u0001g..\u0002 = green, \u0001k..\u0002 = amber tokens
  function render(txt){
    let html='', mode=null;
    for(const ch of txt){
      if(ch==='\u0001'){ mode='open'; continue; }
      if(mode==='open'){ html+= ch==='g'?'<span class="to">':'<span class="tk">'; mode=null; continue; }
      if(ch==='\u0002'){ html+='</span>'; continue; }
      html+=esc(ch);
    }
    return html;
  }

  let li=0, buf='';
  function typeLine(){
    if(li>=lines.length){ out.innerHTML=buf+'<span class="tcur">\u2588</span>'; return; }
    const L=lines[li];
    // reveal char-by-char but on the RENDERED string so tokens colour correctly
    let i=0; const chars=[...L.t];
    (function step(){
      out.innerHTML = buf + clsSpan(L.cls) + render(L.t.slice(0,i)) + '</span><span class="tcur">\u2588</span>';
      if(i<chars.length){ i+=L.t.length>46?2:1; setTimeout(step, L.art?10:(L.t.length>46?5:14)); }
      else { buf += clsSpan(L.cls)+render(L.t)+'</span>\n'; li++; setTimeout(typeLine, L.art?60:(L.t===''?40:105)); }
    })();
  }
  function dumpAll(){
    out.innerHTML=lines.map(L=>clsSpan(L.cls)+render(L.t)+'</span>').join('\n')+'<span class="tcur">\u2588</span>';
  }
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){ dumpAll(); }
  else { setTimeout(typeLine,220); }
})();
