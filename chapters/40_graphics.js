/* 40_graphics.js — base course */
'use strict';
(function(){
const cGraphics={id:'graphics',part:'Part XII · Applications',title:'Graphics, robotics & 3D',
  sub:'Every time a game rotates a character or a robot arm reaches, it\'s multiplying vectors by matrices. The whole 3D world is linear algebra at 60 fps.',
render(root){
  head(root,0,cGraphics);
  root.append(p('A 3D point is a vector. Moving it — rotate, scale, translate, or view through a camera — is multiplying by a matrix. Chaining those matrices (Part VII) composes a whole camera pipeline into one. Drag to rotate a real 3D object:'));
  const L=lab('A rotating 3D vector','See','see');
  const bd=board3d({vec:{x:2,y:1.5,z:1.5}});L.append(stageOf(bd,[]));root.append(L);
  root.append(box('aha-box','why games use 4×4 matrices','Rotation and scaling are matrices, but <em>translation</em> (sliding) isn\'t linear — so graphics uses a clever trick (homogeneous coordinates): add a 4th coordinate so translation becomes a matrix too. Then the entire transform — model, view, projection — is one 4×4 matrix multiply per vertex, done millions of times per second on your GPU.'));
  root.append(box('key','the same math, everywhere in 3D','Robot arm kinematics, drone orientation, CT-scan reconstruction, physics engines, camera calibration — all are matrix–vector products. The 3D world runs on the operations you\'ve been dragging around this whole course.'));
  root.append(summary(['3D points are vectors; moving them is matrix multiplication.','Rotations/scales compose into one matrix (Part VII).','Homogeneous 4×4 matrices fold in translation too.','Games, robotics, and 3D vision are all this, at scale.']));
}};

register(cGraphics);
})();
