/* 59_cross.js — mastery track */
'use strict';
(function(){
const cCross={id:'cross',part:'Part III · Geometry',title:'The cross product (3D only)',
 sub:'The dot product gives a number; the cross product gives a whole new vector — one perpendicular to both inputs, with length equal to the parallelogram they span. It\'s special to three dimensions.',
render(root){head(root,0,cCross);
 root.append(p('The dot product takes two vectors → a number. The <span class="term">cross product</span> \\(\\mathbf a\\times\\mathbf b\\) takes two 3D vectors → a <em>third vector</em>, perpendicular to both, whose length is the area of the parallelogram they span. It exists only in 3D (a quirk we\'ll explain).'));
 root.append(math('\\mathbf a\\times\\mathbf b = \\big(a_2b_3-a_3b_2,\\; a_3b_1-a_1b_3,\\; a_1b_2-a_2b_1\\big)'));
 root.append(box('aha-box','it\'s built from little 2×2 determinants','Each component is a 2×2 determinant of the other two coordinates — e.g. the first is \\(\\det\\begin{bmatrix}a_2&b_2\\\\a_3&b_3\\end{bmatrix}\\). So the cross product is really “the determinant, one dimension at a time.” Its length \\(\\lVert\\mathbf a\\times\\mathbf b\\rVert=\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\sin\\theta\\) is the parallelogram area — the perfect complement to the dot product\'s \\(\\lVert\\mathbf a\\rVert\\lVert\\mathbf b\\rVert\\cos\\theta\\).'));
 root.append(worked({title:'a cross product by hand',
   prompt:'Compute \\((1,0,0)\\times(0,1,0)\\) — the x-axis crossed with the y-axis.',
   steps:['First component: \\(a_2b_3-a_3b_2 = 0\\cdot0-0\\cdot1 = 0\\).',
     'Second: \\(a_3b_1-a_1b_3 = 0\\cdot0-1\\cdot0 = 0\\).',
     'Third: \\(a_1b_2-a_2b_1 = 1\\cdot1-0\\cdot0 = 1\\).'],
   result:'\\((0,0,1)\\) — the z-axis! Crossing x and y gives z, perpendicular to both, with length 1 (the unit square\'s area). The “right-hand rule” just tracks which of ±z you get.'}));
 root.append(box('key','why only 3D','“A vector perpendicular to two given directions, of a definite length” only has a unique answer in 3D. In 2D there\'s no room to be perpendicular to two independent vectors; in 4D+ the perpendicular space is bigger than one line, so no single vector is singled out. (The real generalization is the <em>wedge product</em> of Part XX.)'));
 root.append(box('key','where it\'s used','Surface normals in 3D graphics (which way a polygon faces), torque and angular momentum in physics, and testing orientation (is this triangle clockwise?). Whenever you need “the perpendicular direction” in 3D, it\'s the cross product.'));
 root.append(quiz({question:'What is a×b geometrically?',
   options:[{t:'A vector perpendicular to both a and b, with length equal to their parallelogram\'s area',ok:true,why:'Exactly — direction perpendicular to both (right-hand rule), magnitude = ‖a‖‖b‖sinθ = the spanned area.'},
     {t:'A number measuring how aligned they are',ok:false,why:'That\'s the dot product. The cross product returns a whole perpendicular vector.'}]}));
 const Lpc=lab('Practice: cross products','Practice','');
 Lpc.append(p('Compute all three components of a×b.'));
 Lpc.append(practiceSet(['cross'],4));
 root.append(Lpc);
 root.append(summary(['Cross product: two 3D vectors → a perpendicular vector.','Length = ‖a‖‖b‖sinθ = parallelogram area (dot uses cos).','Each component is a little 2×2 determinant.','Unique to 3D; used for normals, torque, orientation.']));
}};
register(cCross, {after:"dot"});
})();
