/* 48_ranknullity.js — Parts XIII–XXI (advanced) */
'use strict';
(function(){
const NEW={push:function(ch){register(ch);}};
NEW.push({id:'ranknullity',part:'Part XIV · Fundamental theorem',title:'Rank\u2013nullity: conservation of dimension',
 sub:'The most quietly profound equation in the subject: the dimensions a matrix keeps plus the dimensions it destroys always equal the dimensions you started with.',
render(root){head(root,0,this);
 root.append(p('Here is a conservation law for dimension. For any \\(m\\times n\\) matrix:'));
 root.append(math('\\underbrace{\\text{rank}}_{\\dim(\\text{image})} + \\underbrace{\\text{nullity}}_{\\dim(\\text{kernel})} = n \\;(\\text{number of columns})'));
 root.append(box('aha-box','nothing is lost or created','Every one of your \(n\) input dimensions goes exactly one of two places: it survives (contributing to the rank/image) or it gets crushed to zero (contributing to the nullity/kernel). No dimension vanishes uncounted. Rank measures what gets through; nullity measures what\'s lost; together they must be \(n\).'));
 root.append(h3('Why it\'s true — counting columns after elimination'));
 root.append(p('This isn\'t a slogan; it\'s forced by elimination. Reduce the matrix to row echelon form and count.'));
 root.append(worked({title:'the one-line proof',
   prompt:'Row-reduce \(A\) (with \(n\) columns) and sort the columns into two kinds.',
   steps:['Each column either gets a <b>pivot</b> or it doesn\'t — there\'s no third option, so (# pivot columns) + (# free columns) = \(n\).',
     'The <b>pivot columns</b> are exactly the independent ones — their count is the <b>rank</b> (dimension of the image).',
     'Each <b>free column</b> gives one independent solution of \(A\mathbf x=\mathbf 0\) (set that free variable to 1, solve the rest) — so (# free columns) = the <b>nullity</b>.'],
   result:'Substituting: rank + nullity = (pivot columns) + (free columns) = \(n\). The conservation law is just “every column is pivot-or-free.”'}));
 root.append(worked({title:'using rank\u2013nullity',
   prompt:'A \\(3\\times5\\) matrix has rank 3. What is the dimension of its null space?',
   steps:['\\(n = 5\\) columns; rank \\(= 3\\).',
     'Rank + nullity = n \u2192 \\(3 + \\text{nullity} = 5\\).',
     'nullity \\(= 2\\).'],
   result:'A 2-dimensional null space: there\'s a whole plane of inputs the matrix sends to zero. (So systems \\(Ax=b\\) have a 2-parameter family of solutions when solvable.)'}));
 root.append(quiz({question:'A 4\u00d74 matrix has a 1-dimensional null space. What is its rank, and is it invertible?',
   options:[{t:'Rank 3; not invertible',ok:true,why:'4 = rank + 1, so rank = 3 < 4. A nonzero null space means singular \u2014 not invertible.'},
     {t:'Rank 4; invertible',ok:false,why:'Rank 4 would force nullity 0. A 1-D null space means rank 3 and no inverse.'}]}));
 root.append(summary(['rank + nullity = number of columns (n).','Every input dimension is either kept (rank) or killed (nullity).','It instantly relates solvability, invertibility, and freedom.','A conservation law for dimension.']));
}});

/* ============================================================ XV — DECOMPOSITIONS II */
})();
