/* 03_notbox.js — base course */
'use strict';
(function(){
const cBox={id:'notbox',part:'Part ½ · The big picture',title:'Space is not a box',
  sub:'Before any machinery, we have to kill one picture you almost certainly carry — that space is an empty container things sit inside. It will sabotage everything later. Swap it now, while it\'s cheap.',
render(root){
  head(root,3,cBox);
  root.append(p('Here\'s the picture your brain defaults to: <b>space is an empty box, and things go in the box.</b> The room existed before you walked in and stays after you leave. Natural — and, for what\'s coming, poisonous.'));
  root.append(box('trap','the wrong picture','<b>box first, things later.</b> An empty room exists; then you add a chair, a bed, you. Space is the stage; objects are the actors that walk onto it. Natural — and about to cause trouble.'));
  root.append(box('key','the problem','If space is a box that exists on its own, the box must have <em>positions</em> in it before anything arrives. But a position is a <b>relationship</b> — “2 metres from the wall,” “left of the table.” Take away every object and there\'s nothing to relate to. “Here” relative to what? So the positions were never there. <span class="aha">The box was never there.</span>'));
  root.append(h3('Feel it: delete the relationships, watch the space vanish'));
  root.append(p('Below is a little “space” of five cities — the dots are the cities, the lines are the relationships (roads, distances). Hit the button to delete every relationship and watch what\'s left.'));
  const L=lab('Is the space the dots, or the web?','See','see');
  L.append(webGraph({
    nodes:[{label:'Paris',color:C.accent},{label:'Brussels',color:C.accentb},{label:'Amsterdam',color:C.accentc},{label:'Geneva',color:C.accentd},{label:'Berlin',color:C.gold}],
    edges:[[0,1,3],[1,2,3],[0,3,2],[1,4,2],[3,0,2],[2,4,3]],
    caption:'Cities + connections = a transport network. The structure is the <b>web of relationships</b>, not the empty air around the dots.'}));
  root.append(box('aha-box','the swap','<b>Old:</b> space exists first; things go inside. &nbsp; <b>New:</b> things and their relationships come first — <span class="aha">the space IS the web of relationships.</span> Take the cast away and you don\'t get an empty stage; you get no play.'));
  root.append(el('div','pull','Why swap now? Because in a few chapters I\'ll say “a photograph is a point in a million-dimensional space.” With the box picture that\'s nonsense — <em>where</em> is this space? With the web picture it\'s obvious: a photo relates to other photos in a million measurable ways, and that web is the space.'));
  root.append(box('key','one honest caveat','Mathematically you <em>can</em> write \\((3,7)\\) with no object there — coordinates are a useful language. The point isn\'t “space can\'t exist empty.” It\'s: <b>don\'t think of a space as a container. Think of it as a system of possible relationships.</b> Coordinates describe the web; they aren\'t the web.'));
  root.append(quiz({question:'You remove every object and relationship from a space. What remains?',
    options:[{t:'Nothing meaningful — positions, distances, directions were all relationships',ok:true,why:'Right. “Position” only means something relative to other things. No relationships, no structure, no space.'},
      {t:'A pristine empty container with all its positions intact',ok:false,why:'That\'s the box myth. A position IS a relationship; with nothing to relate to, there are no positions.'}]}));
  root.append(summary(['Kill the “space = empty box” picture.','A position is a relationship, not a pre-existing slot.','Space = things + how they relate. The web is the space.','This makes “a photo is a point in a million-D space” sensible later.']));
}};

register(cBox);
})();
