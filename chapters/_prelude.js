/* ============================================================
   _prelude.js — shared scaffolding for the per-chapter files.

   The course used to live in four big bundles. It is now ONE
   FILE PER CHAPTER (see chapters/*.js). This prelude is loaded
   first and provides, on the global scope, everything those
   files need:

     • CHAPTERS            the growing ordered course array
     • register(ch, opts)  add a chapter, preserving order
     • all VS engine helpers, destructured once
     • the chrome helpers (head, box, lab, p, h2, h3, math,
       summary, stageOf, repLegend) — defined once, not
       re-declared in every file.

   register(chapter, { after:'someId' })
     - no `after`  → appended in load order (base course + tail).
     - after:'id'  → inserted immediately after that chapter,
                     exactly like the old insertAfter().
   Because the browser loads the <script> tags in order, calling
   register() at the top level of each file reproduces the
   original runtime sequence precisely.
   ============================================================ */
'use strict';

/* the one, global, ordered course array */
var CHAPTERS = [];

/* ---- engine helpers: pull EVERYTHING the chapters use ---- */
const {el,knob,vboard,narrate,rangeRow,quiz,listAdd,orthoLab,clamp,fmt,C,randUnit,
       numberline,board3d,spanBoard,fourRep,projectionBoard,ladder,
       worked,gallery,matrixBoard,analogyDemo,
       configSpace,possibilityCounter,morphPath,diffVector,webGraph,
       matrixGrid,matrixHTML,rrefStepper,systemLines,
       eigenExplorer,detArea,leastSquares,pcaCloud,practiceSet,rowOpSolver,
       matmulBuilder,cofactorBuilder,eigenCheck,gramSchmidtViz,transformQuiz,
       luStepper,quadFormPlot,complexPlane,fourierSynth,svdPhoto,fourSubspaces,
       matrixLab,proofBuilder}=VS;

/* ---- chapter chrome (identical to the old bundles) ---- */
function head(root,n,c){
  // auto-number from position in the course (ignore hand-passed n)
  let num=n;
  try{const i=CHAPTERS.findIndex(x=>x.id===c.id);if(i>=0)num=i+1;}catch(e){}
  if(c.part) root.append(el('div','part-banner',c.part));
  root.append(el('div','eyebrow',`Chapter ${num}`));
  root.append(el('h1',null,c.title));
  root.append(el('p','lead-big',c.sub));
}
function box(kind,tag,html){const b=el('div','box '+kind);b.append(el('div','box-tag',tag));b.insertAdjacentHTML('beforeend',html);return b;}
function lab(title,badge='Play',cls=''){const l=el('div','lab');
  const h=el('div','lab-head');h.append(el('span','lab-badge '+cls,badge),el('span','lab-title',title));l.append(h);return l;}
function p(html){return el('p',null,html);}
function h2(t){return el('h2',null,t);}
function h3(t){return el('h3',null,t);}
function math(tex){const d=el('div','mathblock','$$'+tex+'$$');return d;}
function summary(items){const s=el('div','summary');s.append(el('h4',null,'Lock it in'));
  const u=document.createElement('ul');items.forEach(i=>{const li=document.createElement('li');li.innerHTML=i;u.append(li);});s.append(u);return s;}
function stageOf(canvas, sideNodes){const s=el('div','stage');const g=el('div','grow');(sideNodes||[]).forEach(n=>g.append(n));s.append(canvas,g);return s;}
function repLegend(){const l=el('div','replegend');
  [['list','var(--ink)'],['arrow','var(--accent)'],['knobs','var(--accentb)'],['point','var(--accentc)']]
    .forEach(([t,c])=>{l.insertAdjacentHTML('beforeend',`<span class="repchip"><span class="dotc" style="background:${c}"></span>${t}</span>`);});
  return l;}

/* checkpoint helper (was local to the mastery bundle) */
function checkpoint(root, kinds, msg){
  const L=lab('Checkpoint \u2014 prove it stuck','Practice','');
  L.append(p(msg||'Fresh random problems every visit. Type answers, press Enter. Aim to clear them without peeking.'));
  L.append(practiceSet(kinds, 6));
  root.append(L);
}

/* ---- the registration API ---- */
function register(chapter, opts){
  opts=opts||{};
  if(opts.after){
    const i=CHAPTERS.findIndex(c=>c.id===opts.after);
    if(i>=0){ CHAPTERS.splice(i+1,0,chapter); return; }
  }
  CHAPTERS.push(chapter);
}
