/* 41_used.js — base course */
'use strict';
(function(){
const cUsed={id:'used',part:'Part V · Payoff',title:'Where this actually lives',
  sub:'You own the whole toolkit now. Here it is running the real world — plus a live similarity search you can play with.',
render(root){
  head(root,21,cUsed);
  root.append(p('Everything you learned — list, add, scale, length, dot product — is exactly what powers search, recommendations, and AI. Here\'s a toy: three "documents" as 3-number vectors (how much about <b>cats</b>, <b>code</b>, <b>cooking</b>). Tune your query; watch which wins by <em>angle</em>.'));
  const L=lab('Similarity search, live');
  const docs=[{name:'"My cat sat on my keyboard"',v:[.8,.5,.1],color:C.accent},
    {name:'"A recipe for lentil curry"',v:[0,.1,.95],color:C.accentc},
    {name:'"Debugging a null pointer"',v:[.05,.95,.1],color:C.accentb}];
  const q=[.7,.4,.2];const nar=narrate('');const bars=el('div');bars.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:6px';
  function cos(a,b){let d=0,na=0,nb=0;for(let i=0;i<3;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}return d/(Math.sqrt(na*nb)||1);}
  function upd(){const sc=docs.map(d=>({...d,s:cos(q,d.v)})).sort((a,b)=>b.s-a.s);bars.innerHTML='';
    sc.forEach((d,i)=>{const row=el('div');row.style.cssText='display:flex;align-items:center;gap:10px';
      const bar=el('div');bar.style.cssText=`height:20px;border-radius:5px;background:${d.color};width:${Math.max(4,d.s*220)}px;transition:width .2s`;
      row.append(el('div',null,(i===0?'🏆 ':'&nbsp;&nbsp;&nbsp;')+d.name),bar,el('b',null,d.s.toFixed(2)));bars.append(row);});
    nar.say(`Query = (cats ${q[0].toFixed(1)}, code ${q[1].toFixed(1)}, cooking ${q[2].toFixed(1)}). Winner: <span class="k">${sc[0].name}</span> — highest cosine similarity.`);}
  const r1=rangeRow({label:'about cats',min:0,max:1,step:.05,value:q[0],fmt:v=>v.toFixed(2),onInput:v=>{q[0]=v;upd();}});
  const r2=rangeRow({label:'about code',min:0,max:1,step:.05,value:q[1],fmt:v=>v.toFixed(2),onInput:v=>{q[1]=v;upd();}});
  const r3=rangeRow({label:'about cooking',min:0,max:1,step:.05,value:q[2],fmt:v=>v.toFixed(2),onInput:v=>{q[2]=v;upd();}});
  L.append(r1,r2,r3,bars,nar);upd();root.append(L);
  root.append(box('aha-box','that\'s the whole magic trick','Real search engines and chatbots do exactly this — with vectors of hundreds or thousands of numbers from a neural net. "Find similar" = "smallest angle." You now understand the core of it.'));
  root.append(h3('More places you\'re now equipped to see it'));
  root.append(p('The famous one: <b>word embeddings</b> turn words into ~300-D vectors so that <em>directions carry meaning</em>. The step from “man” to “woman” is one fixed vector — and adding it to “king” lands you on “queen.” That\'s <em>literally</em> vector arithmetic. Here it is in a toy 2-D version:'));
  const La=lab('king − man + woman ≈ queen','See','see');La.append(analogyDemo());root.append(La);
  root.append(box('aha-box','meaning becomes geometry','When words are vectors, “analogy” becomes <em>subtraction and addition</em>, and “synonym” becomes <em>small angle</em>. The entire field of modern language AI stands on this: turn meaning into vectors, then do our two moves. You already know the moves.'));
  root.append(el('ul',null,`
    <li><b>Recommendations</b> — you and each movie are vectors; your match is a dot product.</li>
    <li><b>Computer graphics</b> — every rotation, scale, and camera move is a matrix on 3-vectors (Chapter 20).</li>
    <li><b>Machine learning</b> — a neural network is stacks of “multiply by a matrix, then bend.”</li>
    <li><b>Search</b> — your query and every document become vectors; the best matches have the smallest angle.</li>`));
  root.append(summary(['Similarity = angle = dot product, at scale.','Embeddings turn words/images/users into vectors.','You now understand the core operation behind modern AI.']));
}};

register(cUsed);
})();
