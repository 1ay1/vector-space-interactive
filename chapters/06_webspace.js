/* 06_webspace.js — base course */
'use strict';
(function(){
const cWebspace={id:'webspace',part:'Part ½ · The big picture',title:'Relationships ARE the space',
  sub:'Put it together. “Closeness,” “direction,” “between” — all of it lives in the relationships between points, not in any background. That web is the space, and it\'s why one machinery fits everything.',
render(root){
  head(root,6,cWebspace);
  root.append(p('Photographs aren\'t a random pile. Some are near (same scene, new lighting), some are far (totally different scenes). That <b>closeness</b> isn\'t physical — it\'s the length of \\(B-A\\), a number you compute. The whole space is this web of near/far/direction relationships.'));
  const L=lab('The space is the web, not the dots','See','see');
  L.append(webGraph({
    nodes:[{label:'A ☀',color:C.accent},{label:'B ☀+',color:C.accentb},{label:'C 🌙',color:C.accentc},{label:'D 🌿',color:C.accentd},{label:'E 🌊',color:C.gold},{label:'F 🔥',color:C.green}],
    edges:[[0,1,5],[0,2,2],[2,3,3],[3,4,2],[4,5,3],[1,3,1],[0,4,1]],
    caption:'Photos as points; thick line = very similar, thin = barely. The space is this <b>web of similarities</b>. Delete it and the photos are just an unrelated heap.'}));
  root.append(box('aha-box','same idea, everywhere','<b>Images:</b> points = photos, relationships = pixel-difference, similarity. <b>Physical space:</b> points = locations, relationships = distance, direction, angle. <b>A network:</b> points = cities, relationships = roads, travel time. Different stuff, <span class="aha">one idea: a world of things + a structure for how they relate.</span>'));
  root.append(h3('The four sentences to carry forever'));
  root.append(box('key','lock this in',`
    <b>space</b> = a world of possibilities (not an empty box)<br>
    <b>point</b> = one possibility (one configuration — e.g. one photograph)<br>
    <b>vector</b> = a change/relationship between possibilities (\\(B-A\\))<br>
    <b>direction</b> = a particular way of changing`));
  root.append(el('div','pull','Whenever you hear “point in space,” don\'t picture a dot in a room. Ask: <em>point among what possibilities?</em> Physical space → possible locations. Image space → possible images. Audio → possible sounds. Portfolio → possible portfolios. The word “point” just means one particular possibility.'));
  root.append(box('aha-box','why this unlocks everything','Because the space is relationships — not a container — the <em>same</em> machinery (subtract, scale, add; length; angle) describes photographs, sounds, word-meanings, motion, and portfolios. You\'re no longer memorizing what a vector space is. You\'re starting to <span class="aha">see it.</span>'));
  root.append(quiz({question:'What is “closeness” between two photographs?',
    options:[{t:'The length of their difference vector B−A — a computed relationship',ok:true,why:'Exactly. Closeness is mathematical (a number), living in the relationship between points, not in any background space.'},
      {t:'How near they physically float in an invisible room',ok:false,why:'There\'s no room. Closeness is the size of the difference — pure relationship.'}]}));
  root.append(summary(['Closeness/direction/between live in the relationships, not a background.','The web of relationships IS the space.','space=possibilities, point=one possibility, vector=a change, direction=a way to change.','One machinery fits images, sound, meaning, motion — because all are webs of relationships.']));
}};

/* ============================================================
   PART I — BUILD IT
   ============================================================ */

register(cWebspace);
})();
