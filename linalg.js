/* ============================================================
   linalg.js — a tiny numeric linear-algebra core (no deps).
   Matrices are arrays of row-arrays. All pure functions.
   Exposed as window.LA for use by widgets/chapters.
   ============================================================ */
'use strict';
const LA = (() => {

const clone = M => M.map(r => r.slice());
const shape = M => [M.length, M[0] ? M[0].length : 0];
const zeros = (r,c) => Array.from({length:r},()=>Array(c).fill(0));
const eye = n => Array.from({length:n},(_, i)=>Array.from({length:n},(_, j)=>i===j?1:0));

function matmul(A,B){
  const [ar,ac]=shape(A),[br,bc]=shape(B);
  if(ac!==br) throw new Error('matmul shape mismatch');
  const C=zeros(ar,bc);
  for(let i=0;i<ar;i++)for(let j=0;j<bc;j++){let s=0;for(let k=0;k<ac;k++)s+=A[i][k]*B[k][j];C[i][j]=s;}
  return C;
}
function matvec(A,v){ return A.map(row=>row.reduce((s,a,j)=>s+a*v[j],0)); }
function transpose(A){ const [r,c]=shape(A); const T=zeros(c,r); for(let i=0;i<r;i++)for(let j=0;j<c;j++)T[j][i]=A[i][j]; return T; }
function add(A,B){ return A.map((r,i)=>r.map((a,j)=>a+B[i][j])); }
function scale(A,k){ return A.map(r=>r.map(a=>a*k)); }

/* 2x2 / 3x3 determinant + general via elimination */
function det(A){
  const n=A.length;
  if(n===1) return A[0][0];
  if(n===2) return A[0][0]*A[1][1]-A[0][1]*A[1][0];
  if(n===3){const [a,b,c]=A[0],[d,e,f]=A[1],[g,h,i]=A[2];
    return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);}
  // general: LU with partial pivoting
  const M=clone(A); let d=1;
  for(let k=0;k<n;k++){
    let p=k; for(let i=k+1;i<n;i++) if(Math.abs(M[i][k])>Math.abs(M[p][k])) p=i;
    if(Math.abs(M[p][k])<1e-12) return 0;
    if(p!==k){[M[p],M[k]]=[M[k],M[p]]; d=-d;}
    d*=M[k][k];
    for(let i=k+1;i<n;i++){const f=M[i][k]/M[k][k]; for(let j=k;j<n;j++) M[i][j]-=f*M[k][j];}
  }
  return d;
}

/* inverse via Gauss-Jordan; returns null if singular */
function inv(A){
  const n=A.length; const M=A.map((r,i)=>[...r,...eye(n)[i]]);
  for(let k=0;k<n;k++){
    let p=k; for(let i=k+1;i<n;i++) if(Math.abs(M[i][k])>Math.abs(M[p][k])) p=i;
    if(Math.abs(M[p][k])<1e-12) return null;
    [M[p],M[k]]=[M[k],M[p]];
    const piv=M[k][k]; for(let j=0;j<2*n;j++) M[k][j]/=piv;
    for(let i=0;i<n;i++){ if(i===k) continue; const f=M[i][k]; for(let j=0;j<2*n;j++) M[i][j]-=f*M[k][j]; }
  }
  return M.map(r=>r.slice(n));
}

/* Gaussian elimination to RREF, RECORDING each step for animation.
   Returns {rref, steps:[{desc, matrix}], pivots, rank} */
function rrefSteps(A0){
  const A=clone(A0).map(r=>r.map(x=>+x));
  const [rows,cols]=shape(A);
  const steps=[]; const pivots=[];
  const snap=desc=>steps.push({desc, matrix:clone(A)});
  snap('Start.');
  let r=0;
  for(let c=0;c<cols && r<rows;c++){
    // find pivot
    let p=r; for(let i=r+1;i<rows;i++) if(Math.abs(A[i][c])>Math.abs(A[p][c])) p=i;
    if(Math.abs(A[p][c])<1e-9) continue; // no pivot in this column
    if(p!==r){ [A[p],A[r]]=[A[r],A[p]]; snap(`Swap R${r+1} ↔ R${p+1} (bring a nonzero pivot up).`); }
    // normalize pivot row
    const piv=A[r][c];
    if(Math.abs(piv-1)>1e-9){ A[r]=A[r].map(x=>x/piv); snap(`Divide R${r+1} by ${fmtNum(piv)} to make the pivot 1.`); }
    // eliminate other rows
    let changed=false;
    for(let i=0;i<rows;i++){ if(i===r) continue; const f=A[i][c];
      if(Math.abs(f)>1e-9){ A[i]=A[i].map((x,j)=>x-f*A[r][j]); changed=true; } }
    if(changed) snap(`Clear column ${c+1} using R${r+1}.`);
    pivots.push(c); r++;
  }
  // tidy -0
  for(const row of A) for(let j=0;j<cols;j++) if(Math.abs(row[j])<1e-9) row[j]=0;
  snap('Done — reduced row echelon form.');
  return {rref:A, steps, pivots, rank:pivots.length};
}

function fmtNum(x){
  if(Math.abs(x-Math.round(x))<1e-9) return String(Math.round(x));
  // small fractions
  for(let den=2;den<=12;den++){ const n=x*den; if(Math.abs(n-Math.round(n))<1e-9) return `${Math.round(n)}/${den}`; }
  return (+x.toFixed(3)).toString();
}

/* eigen for 2x2 (closed form) -> {values:[l1,l2], vectors:[[..],[..]], real} */
function eig2(A){
  const a=A[0][0],b=A[0][1],c=A[1][0],d=A[1][1];
  const tr=a+d, dt=a*d-b*c;
  const disc=tr*tr-4*dt;
  if(disc<-1e-9) return {real:false, values:[], vectors:[]};
  const s=Math.sqrt(Math.max(0,disc));
  const l1=(tr+s)/2, l2=(tr-s)/2;
  function vecFor(l){
    // (A - lI) v = 0
    const m00=a-l, m01=b, m10=c, m11=d-l;
    let v;
    if(Math.abs(m00)>1e-9||Math.abs(m01)>1e-9) v=[-m01, m00];
    else if(Math.abs(m10)>1e-9||Math.abs(m11)>1e-9) v=[-m11, m10];
    else v=[1,0];
    const n=Math.hypot(v[0],v[1])||1; return [v[0]/n, v[1]/n];
  }
  return {real:true, values:[l1,l2], vectors:[vecFor(l1),vecFor(l2)]};
}

/* solve Ax=b for square A (returns null if singular) */
function solve(A,b){ const Ai=inv(A); return Ai?matvec(Ai,b):null; }

/* Gram-Schmidt on a list of column vectors (arrays). Returns orthonormal set. */
function gramSchmidt(vs){
  const out=[];
  for(const v of vs){
    let u=v.slice();
    for(const q of out){ const dot=q.reduce((s,x,i)=>s+x*v[i],0); u=u.map((x,i)=>x-dot*q[i]); }
    const n=Math.hypot(...u); if(n>1e-9){ out.push(u.map(x=>x/n)); }
  }
  return out;
}

/* LU decomposition with steps (Doolittle, partial pivot). */
function luSteps(A0){
  const n=A0.length; const U=clone(A0).map(r=>r.map(Number));
  const L=eye(n); const steps=[];
  const snap=desc=>steps.push({desc,L:clone(L),U:clone(U)});
  snap('Start: U = A, L = I.');
  for(let k=0;k<n;k++){
    let p=k; for(let i=k+1;i<n;i++) if(Math.abs(U[i][k])>Math.abs(U[p][k])) p=i;
    if(p!==k){[U[p],U[k]]=[U[k],U[p]];
      for(let j=0;j<k;j++){const t=L[p][j];L[p][j]=L[k][j];L[k][j]=t;}
      snap(`Pivot: swap rows ${k+1} and ${p+1}.`);}
    if(Math.abs(U[k][k])<1e-12) continue;
    for(let i=k+1;i<n;i++){const f=U[i][k]/U[k][k]; L[i][k]=f; for(let j=k;j<n;j++) U[i][j]-=f*U[k][j];}
    snap(`Eliminate below pivot ${k+1} (multipliers → L).`);
  }
  return {L,U,steps};
}

/* characteristic polynomial coefficients (2x2, 3x3) */
function charPoly(A){
  const n=A.length;
  if(n===2){const t=A[0][0]+A[1][1], d=det(A); return [1,-t,d];}
  if(n===3){const t=A[0][0]+A[1][1]+A[2][2];
    const m=(i,j)=>A[i][i]*A[j][j]-A[i][j]*A[j][i];
    const c2=m(0,1)+m(0,2)+m(1,2); const d=det(A);
    return [1,-t,c2,-d];}
  return null;
}

/* nullspace basis via RREF */
function nullspace(A){
  const {rref,pivots}=rrefSteps(A); const [rows,cols]=shape(rref);
  const pivotSet=new Set(pivots); const free=[]; for(let c=0;c<cols;c++) if(!pivotSet.has(c)) free.push(c);
  const basis=[];
  for(const fc of free){const v=Array(cols).fill(0); v[fc]=1;
    pivots.forEach((pc,ri)=>{ v[pc]=-rref[ri][fc]; }); basis.push(v);}
  return {basis, free, pivots, rank:pivots.length};
}

/* quadratic form value x^T A x (2D) */
function quadForm(A,x,y){ return A[0][0]*x*x + (A[0][1]+A[1][0])*x*y + A[1][1]*y*y; }

/* DFT magnitudes of first K components */
function dftMags(samples,K){
  const N=samples.length; const out=[];
  for(let k=0;k<K;k++){let re=0,im=0;
    for(let n=0;n<N;n++){const a=2*Math.PI*k*n/N; re+=samples[n]*Math.cos(a); im-=samples[n]*Math.sin(a);}
    out.push(Math.hypot(re,im)/N*2);}
  return out;
}

/* Cholesky: A = L L^T (lower L) or null if not SPD */
function cholesky(A){
  const n=A.length; const L=zeros(n,n);
  for(let i=0;i<n;i++)for(let j=0;j<=i;j++){
    let s=0; for(let k=0;k<j;k++) s+=L[i][k]*L[j][k];
    if(i===j){const d=A[i][i]-s; if(d<=0) return null; L[i][j]=Math.sqrt(d);}
    else L[i][j]=(A[i][j]-s)/L[j][j];
  }
  return L;
}

return {clone,shape,zeros,eye,matmul,matvec,transpose,add,scale,det,inv,rrefSteps,fmtNum,eig2,solve,gramSchmidt,
        luSteps,charPoly,nullspace,quadForm,dftMags,cholesky};
})();
