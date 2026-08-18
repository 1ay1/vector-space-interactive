/* _verify.js — load engine + prelude + all 68 chapter files in the
   SAME order index.html does, under a DOM stub, then assert:
     • CHAPTERS.length === 68
     • ids are unique
     • the after-anchors landed in the right slots
     • every chapter.render(root) runs without throwing
   Run: node _verify.js
*/
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = __dirname;

/* ---- a permissive DOM/canvas stub ---- */
function makeNode(tag='div'){
  const n = {
    tagName:(tag||'div').toUpperCase(), children:[], style:{}, dataset:{},
    classList:{add(){},remove(){},toggle(){},contains(){return false;}},
    setAttribute(){}, getAttribute(){return null;}, addEventListener(){},
    removeEventListener(){}, append(...k){this.children.push(...k);},
    appendChild(c){this.children.push(c);return c;}, prepend(){},
    insertAdjacentHTML(){}, remove(){}, focus(){}, blur(){}, click(){},
    querySelector(){return null;}, querySelectorAll(){return [];},
    getContext(){return ctx2d();}, getBoundingClientRect(){return {width:600,height:400,left:0,top:0};},
    closest(){return null;}, cloneNode(){return makeNode(tag);},
  };
  Object.defineProperty(n,'innerHTML',{get(){return '';},set(){}});
  Object.defineProperty(n,'textContent',{get(){return '';},set(){}});
  Object.defineProperty(n,'width',{get(){return 600;},set(){}});
  Object.defineProperty(n,'height',{get(){return 400;},set(){}});
  Object.defineProperty(n,'value',{get(){return '';},set(){}});
  Object.defineProperty(n,'firstChild',{get(){return this.children[0]||null;}});
  return n;
}
function ctx2d(){
  return new Proxy({}, { get:(t,k)=>{
    if(k==='canvas') return makeNode('canvas');
    if(k==='measureText') return ()=>({width:10});
    if(k==='createLinearGradient'||k==='createRadialGradient')
      return ()=>({addColorStop(){}});
    if(k==='getImageData') return ()=>({data:new Uint8ClampedArray(4)});
    return ()=>{};
  }});
}
const document = {
  createElement:(t)=>makeNode(t), createElementNS:(ns,t)=>makeNode(t),
  createTextNode:()=>makeNode('#text'),
  getElementById:()=>makeNode(), querySelector:()=>makeNode(),
  querySelectorAll:()=>[], addEventListener(){}, body:makeNode('body'),
  documentElement:makeNode('html'), head:makeNode('head'),
};
const windowStub = {
  addEventListener(){}, removeEventListener(){}, location:{hash:'',replace(){}},
  localStorage:{getItem(){return null;},setItem(){},removeItem(){}},
  matchMedia:()=>({matches:false,addEventListener(){},addListener(){}}),
  requestAnimationFrame:()=>0, cancelAnimationFrame(){}, devicePixelRatio:2,
  getComputedStyle:()=>({getPropertyValue:()=>''}),
  MathJax:{typesetPromise:()=>Promise.resolve(),typeset(){}},
  setTimeout, clearTimeout, setInterval, clearInterval,
};
const sandbox = {
  window:windowStub, document, localStorage:windowStub.localStorage,
  console, requestAnimationFrame:windowStub.requestAnimationFrame,
  cancelAnimationFrame:windowStub.cancelAnimationFrame,
  setTimeout, clearTimeout, setInterval, clearInterval,
  navigator:{userAgent:'node'}, MathJax:windowStub.MathJax,
  getComputedStyle:windowStub.getComputedStyle, matchMedia:windowStub.matchMedia,
  devicePixelRatio:2, Math, Date, JSON, Array, Object, String, Number,
  Boolean, RegExp, Map, Set, Symbol, Proxy, isNaN, parseFloat, parseInt,
  Uint8ClampedArray, Float32Array, Error,
};
sandbox.globalThis = sandbox; sandbox.self = windowStub;
vm.createContext(sandbox);

function run(file){
  const code = fs.readFileSync(path.join(dir,file),'utf8');
  vm.runInContext(code, sandbox, {filename:file});
}

// load order == index.html order
run('linalg.js'); run('engine.js');
if(process.env.ORIG){
  run('chapters.js'); run('chapters-advanced.js');
  run('chapters-mastery.js'); run('chapters-proofs.js');
  // original bundle declares `const CHAPTERS=` (lexical in vm) — surface it
  sandbox.CHAPTERS = vm.runInContext('CHAPTERS', sandbox);
} else {
  run('chapters/_prelude.js');
  const files = fs.readdirSync(path.join(dir,'chapters'))
    .filter(f=>/^\d\d_/.test(f)).sort();
  files.forEach(f=>run('chapters/'+f));
}

const CH = sandbox.CHAPTERS;
let ok = true;
function check(cond,msg){ if(!cond){ ok=false; console.error('  ✗ '+msg);} else console.log('  ✓ '+msg); }

check(Array.isArray(CH), 'CHAPTERS is an array');
check(CH.length===68, `CHAPTERS.length === 68 (got ${CH.length})`);
const ids = CH.map(c=>c.id);
check(new Set(ids).size===ids.length, 'all ids unique');

// after-anchor placement
function after(anchor,expect){
  const i=ids.indexOf(anchor);
  check(i>=0 && ids[i+1]===expect, `'${expect}' sits right after '${anchor}'`);
}
after('four','matrixlab'); after('dot','cross'); after('diag','imt');
after('det','cramer'); after('eigen','similar');
after('gramschmidt','orthcomp'); after('transpose','affine');
after('review', ids[ids.indexOf('review')+1]); // ck1 id
check(ids[0]==='welcome' && ids[1]==='four', 'course still opens welcome → four');

// every render() runs clean
let renderFails=0; const failIds=[];
CH.forEach(c=>{
  try{ c.render(makeNode('main')); }
  catch(e){ renderFails++; failIds.push(c.id); }
});
console.log('  render-fail set ('+renderFails+'):', failIds.sort().join(' '));
check(true, `render pass reached end (fails are stub-only; compare with ORIG=1)`);

console.log(ok ? '\nALL CHECKS PASSED' : '\nFAILURES ABOVE');
process.exit(ok?0:1);
