/* 57_capstone.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'capstone',part:'Part XXI · Numerical & capstone',title:'Capstone: compress an image with the SVD',
 sub:'Put it ALL together. Watch the singular value decomposition throw away detail you can\'t see and rebuild a recognizable image from a fraction of the data.',
render(root){head(root,0,this);
 root.append(p('The finale: real image compression, live — <b>on your own photo</b>. Upload any image (it never leaves your browser) and slide the rank down. The SVD writes the image as a sum of importance-ordered rank-1 layers; keep only the top \\(k\\) and watch how few you need before it still looks like you.'));
 const Lu=lab('Compress YOUR photo with the SVD','✦ Signature','weird');
 Lu.append(svdPhoto());
 root.append(Lu);
 root.append(box('aha-box','you just did real math to a real image','That slider is running an actual singular value decomposition — power iteration finding the top singular vectors, one rank-1 layer at a time — on the pixels of your photo, entirely in your browser. At low rank it stores a tiny fraction of the numbers yet stays recognizable, because the SVD ranks directions by how much they matter. <span class="aha">This is the exact principle inside JPEG-style compression.</span>'));
 root.append(p('Below, the same thing on a built-in pattern, with a per-layer view:'));
 const L=lab('SVD image compression','Play','see');
 // build a small synthetic image and do a crude rank-k reconstruction via power-iteration-free approach:
 const N=24; const img=[]; for(let y=0;y<N;y++){img[y]=[];for(let x=0;x<N;x++){
   let v=120+80*Math.sin(x/3)+60*Math.cos(y/4)+40*Math.sin((x+y)/5); img[y][x]=clamp(v,0,255);}}
 const cv=el('canvas');cv.width=192;cv.height=192;const ctx=VS.hidpi(cv);const cell=192/N;
 // approximate top singular directions by iterated deflation using covariance eigenvectors (2D per step is heavy;
 // instead use a simple SVD via Jacobi on small matrix through LA on A^T A is overkill — do a visual proxy:
 // reconstruct with k DCT-like low-frequency terms to convincingly show "keep top-k".
 function reconstruct(k){
   // crude low-rank proxy: keep k lowest-frequency cosine components per axis
   const out=[];for(let y=0;y<N;y++){out[y]=[];for(let x=0;x<N;x++){
     let v=120; let used=0;
     for(let fy=0;fy<N&&used<k;fy++)for(let fx=0;fx<N&&used<k;fx++){ if(fx+fy>=k) continue;
       // approximate coefficient
     }
     out[y][x]=img[y][x];}}
   return out;
 }
 // Simpler + honest: do a real rank-k using LA.eig on A A^T is too much; use JS SVD-lite via power iteration:
 function svdLowRank(A,k){
   const m=A.length,n=A[0].length; let R=A.map(r=>r.slice()); const layers=[];
   for(let t=0;t<k;t++){
     // power iteration for top singular vector of R
     let v=Array(n).fill(0).map(()=>Math.random());
     for(let it=0;it<40;it++){
       // u = R v
       let u=R.map(row=>row.reduce((s,a,j)=>s+a*v[j],0));
       const un=Math.hypot(...u)||1; u=u.map(x=>x/un);
       // v = R^T u
       let nv=Array(n).fill(0); for(let i=0;i<m;i++)for(let j=0;j<n;j++) nv[j]+=R[i][j]*u[i];
       const nvn=Math.hypot(...nv)||1; v=nv.map(x=>x/nvn);
     }
     let u=R.map(row=>row.reduce((s,a,j)=>s+a*v[j],0));
     const sigma=Math.hypot(...u)||1; u=u.map(x=>x/sigma);
     layers.push({u,v,sigma});
     for(let i=0;i<m;i++)for(let j=0;j<n;j++) R[i][j]-=sigma*u[i]*v[j];
   }
   // reconstruct
   const out=Array.from({length:m},()=>Array(n).fill(0));
   layers.forEach(({u,v,sigma})=>{for(let i=0;i<m;i++)for(let j=0;j<n;j++) out[i][j]+=sigma*u[i]*v[j];});
   return out;
 }
 const nar=narrate('');
 function draw(k){const R=svdLowRank(img,k);
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=clamp(Math.round(R[y][x]),0,255);ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}
   const full=N*N, kept=k*(2*N+1);
   nar.say(`Keeping the top <span class="k">${k}</span> of ${N} layers \u2014 about <b>${Math.round(kept/full*100)}%</b> of the data. ${k<=3?'Blurry, but the big shapes are already there.':k<=8?'Looking good \u2014 most detail with a fraction of the numbers.':'Nearly perfect; the last layers were almost noise.'} <span class="g">That\u2019s lossy compression, powered by the SVD.</span>`);}
 const row=rangeRow({label:'layers kept (rank k)',min:1,max:16,step:1,value:3,onInput:draw});
 L.append(row,stageOf(cv,[]),nar);draw(3);root.append(L);
 root.append(box('aha-box','everything, in one demo','Vectors (pixels), matrices (the image), rank (how many layers), eigen/singular directions (the layers themselves, ordered by importance), projection (each layer is one), and the SVD (the whole factorization). A dozen chapters, running at once, doing something genuinely useful.'));
 root.append(el('div','pull','You started with \u201ca vector is a list of numbers.\u201d You just compressed an image with the singular value decomposition. Same idea, all the way up \u2014 you\u2019ve now seen the whole of linear algebra, and built it with your own hands.'));
 root.append(summary(['SVD writes an image as importance-ordered rank-1 layers.','Keep the top k \u2192 recognizable image from a fraction of the data.','This single demo uses vectors, rank, eigen-directions, projection, SVD.','You have now traversed all of linear algebra.']));
}});

/* append and refresh nav if the app already booted */
})();
