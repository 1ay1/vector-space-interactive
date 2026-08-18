/* 39_markov.js — base course */
'use strict';
(function(){
const cMarkov={id:'markov',part:'Part XII · Applications',title:'Markov chains & PageRank',
  sub:'Random processes that hop between states settle into a steady distribution — and that distribution is an eigenvector. This is literally how Google ranked the web.',
render(root){
  head(root,0,cMarkov);
  root.append(p('Imagine a random surfer clicking links, or weather flipping sunny↔rainy with fixed probabilities. Each step multiplies the current state-distribution by a <b>transition matrix</b>. Do it forever and — for almost any start — you converge to a <span class="term">steady state</span>: the distribution that no longer changes.'));
  root.append(math('\\pi = M\\pi \\quad(\\text{steady state = eigenvector of } M \\text{ with eigenvalue } 1)'));
  const L=lab('Walk to the steady state','See','see');
  const nar=narrate('');const M=[[0.9,0.5],[0.1,0.5]];let st=[1,0];
  const bar=el('div');bar.style.cssText='margin-top:8px';
  function draw(){bar.innerHTML=`<div style="display:flex;gap:8px;align-items:center"><span style="width:60px;font-size:.8rem;color:var(--muted)">sunny</span><div style="height:16px;background:var(--gold);width:${st[0]*220}px;border-radius:3px"></div><b>${(st[0]*100).toFixed(1)}%</b></div>
    <div style="display:flex;gap:8px;align-items:center;margin-top:4px"><span style="width:60px;font-size:.8rem;color:var(--muted)">rainy</span><div style="height:16px;background:var(--accentb);width:${st[1]*220}px;border-radius:3px"></div><b>${(st[1]*100).toFixed(1)}%</b></div>`;}
  const step=el('button','btn','take one day');const run=el('button','btn ghost','run 30 days');
  step.onclick=()=>{st=[M[0][0]*st[0]+M[0][1]*st[1], M[1][0]*st[0]+M[1][1]*st[1]];draw();
    nar.say(`Multiplied by the transition matrix. Watch it settle toward the steady state — the eigenvector with eigenvalue 1.`);};
  run.onclick=()=>{for(let i=0;i<30;i++)st=[M[0][0]*st[0]+M[0][1]*st[1], M[1][0]*st[0]+M[1][1]*st[1]];draw();
    nar.say(`<span class="g">Converged.</span> Steady state ≈ (${(st[0]*100).toFixed(0)}% sunny, ${(st[1]*100).toFixed(0)}% rainy). It no longer changes: π = Mπ. That\'s the dominant eigenvector.`);};
  const ctr=el('div','controls');ctr.append(step,run);L.append(bar,ctr,nar);draw();root.append(L);
  root.append(box('aha-box','this is PageRank','Google modeled the web as a giant Markov chain: pages are states, links are transitions. The steady-state distribution — the dominant eigenvector of that billion-by-billion matrix — is exactly how important each page is. <b>PageRank is one eigenvector.</b> A whole company was built on Part IX.'));
  root.append(quiz({question:'The steady state of a Markov chain is…',
    options:[{t:'An eigenvector of the transition matrix with eigenvalue 1',ok:true,why:'Yes — π = Mπ means applying the process doesn\'t change it. That\'s exactly an eigenvector for λ=1.'},
      {t:'The state you started in',ok:false,why:'The steady state is independent of the start — you converge to it from almost anywhere.'}]}));
  root.append(h3('Compute a steady state by hand'));
  root.append(worked({title:'the weather\'s long-run forecast',
    prompt:'Sunny days stay sunny 90% of the time; rainy days turn sunny 50% of the time. Find the steady-state fractions \\((s, r)\\).',
    steps:[
      'Steady state means the distribution doesn\'t change: \\(0.9s + 0.5r = s\\) and \\(s+r=1\\) (it\'s a distribution).',
      'Rearrange the first: \\(0.5r = 0.1s\\Rightarrow r = 0.2s\\).',
      'Substitute into \\(s+r=1\\): \\(s + 0.2s = 1 \\Rightarrow 1.2s = 1 \\Rightarrow s = \\tfrac{5}{6}\\).'],
    result:'\\((s,r) = (5/6,\\,1/6) \\approx (83\\%,\\,17\\%)\\) — matching the bars in the demo. Notice we solved \\(\\pi = M\\pi\\): finding the \\(\\lambda=1\\) eigenvector, then normalizing so it sums to 1.'}));
  root.append(box('trap','the constraint people forget','\\(\\pi = M\\pi\\) alone has infinitely many solutions (any scalar multiple of the eigenvector). What pins down THE steady state is the extra rule that a probability distribution must <b>sum to 1</b>. Eigenvector gives the direction; normalization gives the actual answer.'));
  root.append(summary(['A step = multiply the state by a transition matrix.','Repeat → converge to a steady state π = Mπ.','Steady state = dominant eigenvector (λ=1), normalized to sum 1.','PageRank is literally this eigenvector on the web graph.']));
}};

register(cMarkov);
})();
