/* 23_infinite.js — base course */
'use strict';
(function(){
const cInfinite={id:'infinite',part:'Part IV · The leap',title:'∞ dimensions — functions are vectors',
  sub:'The final leap, and it feels easy: give a vector one number for every point on a line, and you\'ve invented a function.',
render(root){
  head(root,19,cInfinite);
  root.append(p('A vector had one number per slot. A photo had one per pixel. So what if you had one number for <em>every point x on a line</em> — no gaps? That rule, "a number at every x," is exactly a <b>function</b> f(x). A function is a vector with infinitely many numbers.'));
  root.append(box('key','the same two moves survive','Add two functions: (f+g)(x) = f(x)+g(x) — add them at every point. Scale: (2f)(x) = 2·f(x) — turn every point up. Your volume knob is scalar multiplication on an infinite-dimensional vector. Length becomes an integral (a continuous sum), and the dot product too:'));
  root.append(math('\\langle f,g\\rangle=\\int f(x)\\,g(x)\\,dx \\qquad \\lVert f\\rVert=\\sqrt{\\int f(x)^2\\,dx}'));
  const L=lab('Add two functions, point by point','See','see');
  const canvas=el('canvas');canvas.width=440;canvas.height=200;const ctx=VS.hidpi(canvas);
  const nar=narrate('');let A=1,B=1;
  function draw(){const W=440,H=200,mid=H/2;ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=C.softline;ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();
    function plot(fn,color,lw){ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();
      for(let px=0;px<=W;px++){const x=px/W*6;const y=fn(x);const py=mid-y*38;px===0?ctx.moveTo(px,py):ctx.lineTo(px,py);}ctx.stroke();}
    const f=x=>A*Math.sin(x*1.6), g=x=>B*Math.cos(x*2.2);
    plot(f,C.accentb,1.6);plot(g,C.accentc,1.6);plot(x=>f(x)+g(x),C.accent,2.6);
    nar.say(`<span style="color:var(--accentb)">f</span> + <span style="color:var(--accentc)">g</span> = <span style="color:var(--accent)">f+g</span>, added at <em>every</em> point x. Same line-by-line addition — just infinitely many lines.`);}
  const rA=rangeRow({label:'amount of f',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{A=v;draw();}});
  const rB=rangeRow({label:'amount of g',min:-2,max:2,step:.1,value:1,fmt:v=>v.toFixed(1),onInput:v=>{B=v;draw();}});
  L.append(rA,rB,stageOf(canvas,[]),nar);draw();root.append(L);
  root.append(box('aha-box','one idea, all the way up','Fourier analysis, quantum mechanics, signal processing, the guts of your music app — all of it is "treat functions as vectors in an infinite-dimensional space and reuse the two moves." You didn\'t level up to infinity; infinity moved in next door and turned out to use the same recipes.'));
  root.append(worked({title:'are these two functions perpendicular?',
    prompt:'Vectors use a dot product; functions use an <em>integral</em>. Check whether \\(\\sin x\\) and \\(\\cos x\\) are “perpendicular” on \\([0,2\\pi]\\): compute \\(\\langle \\sin,\\cos\\rangle=\\int_0^{2\\pi}\\sin x\\cos x\\,dx\\).',
    steps:[
      'The “dot product” of functions is \\(\\int f(x)g(x)\\,dx\\) — the same “multiply matching entries and sum,” with the sum becoming an integral.',
      'Use \\(\\sin x\\cos x=\\tfrac12\\sin 2x\\), so the integral is \\(\\tfrac12\\int_0^{2\\pi}\\sin 2x\\,dx\\).',
      'Over a full period, \\(\\int_0^{2\\pi}\\sin 2x\\,dx=0\\).'],
    result:'The inner product is <b>0</b> — \\(\\sin\\) and \\(\\cos\\) are <em>orthogonal functions</em>. That perpendicularity is exactly what lets Fourier read off each frequency independently (Part XIX). “Perpendicular” works for functions just like arrows — the integral is the dot product.'}));
  root.append(summary(['A function = a vector with one number per point (∞-dimensional).','Add/scale still work — at every point.','Length & dot product become integrals.','Same idea, all the way to infinity.']));
}};

/* ============================================================
   PART V — PAYOFF & MASTERY
   ============================================================ */

register(cInfinite);
})();
