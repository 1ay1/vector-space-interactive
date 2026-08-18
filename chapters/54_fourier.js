/* 54_fourier.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'fourier',part:'Part XIX · Function spaces',title:'Fourier = change of basis',
 sub:'The grand unification: a sound wave is a vector, sine waves are a basis, and the Fourier transform is just re-reading the signal in that basis. Build a wave from sines.',
render(root){head(root,0,this);
 root.append(p('A signal (sound, image row, stock price) is a vector in an infinite-dimensional function space (Part IV). The <b>sine and cosine waves form an orthogonal basis</b> for that space. Writing a signal in that basis \u2014 finding its \u201chow much of each frequency\u201d coordinates \u2014 <em>is</em> the <span class="term">Fourier transform</span>. Build a wave by mixing sine harmonics:'));
 const L=lab('Add up sine waves','Play');L.append(fourierSynth());root.append(L);
 root.append(box('aha-box','it\'s all change of basis','You already learned change of basis (Part II) \u2014 same vector, different rulers. Fourier is that idea with sine waves as the rulers. The \u201cfrequency spectrum\u201d is just the signal\'s coordinate list in the frequency basis. MP3, JPEG, noise cancellation, MRI, and 5G all live here.'));
 root.append(box('key','orthogonal function bases','Sines/cosines are orthogonal <em>as functions</em>: their inner product \(\int f g\,dx = 0\) unless they match. That perpendicularity is exactly why each frequency\'s coordinate can be read off independently — the same “orthogonal rulers make coordinates easy” idea from Part X, now for functions.'));
 root.append(worked({title:'extract one frequency\'s coordinate',
   prompt:'A signal is \(f(x)=3\sin(x)+2\sin(2x)\). How much “\(\sin(2x)\)” does it contain? (Find that Fourier coefficient.)',
   steps:['The coefficient of \(\sin(2x)\) is the inner product \(\langle f, \sin(2x)\rangle\), normalized — just like reading a coordinate by dotting with a basis vector.',
     'Because the sines are orthogonal, \(\langle \sin(x),\sin(2x)\rangle = 0\): the \(3\sin(x)\) part contributes nothing.',
     'Only the matching term survives: the coefficient is exactly the <b>2</b> sitting in front of \(\sin(2x)\).'],
   result:'Answer: 2. Orthogonality did the work — every other frequency dropped out of the integral, leaving just the one you asked for. That independence is why an equalizer can boost one frequency without touching the rest.'}));
 root.append(quiz({question:'In what sense is the Fourier transform a change of basis?',
   options:[{t:'It re-expresses a signal using sine/cosine waves as the basis instead of individual time samples',ok:true,why:'Exactly \u2014 same signal, new (frequency) rulers. The spectrum is its coordinates there.'},
     {t:'It deletes high frequencies',ok:false,why:'That\'s filtering (which you can do afterwards). Fourier itself just changes basis into frequencies.'}]}));
 root.append(summary(['Signals are vectors; sine/cosine waves are an orthogonal basis.','Fourier transform = coordinates of the signal in that basis.','Orthogonality lets each frequency be read independently.','Powers MP3, JPEG, MRI, communications \u2014 all \u201cchange of basis.\u201d']));
}});

/* ============================================================ XX — MULTILINEAR / TENSORS */
})();
