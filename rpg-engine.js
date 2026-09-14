// Pure movement/collision helpers, independent of rendering and UI.
(function(root){
  function blocked(x,y,r,world){
    if(x<45+r||x>world.width-45-r||y<55+r||y>world.height-45-r)return true;
    for(const b of world.obstacles){const cx=Math.max(b.x,Math.min(x,b.x+b.w)),cy=Math.max(b.y,Math.min(y,b.y+b.h));if((x-cx)**2+(y-cy)**2<r*r)return true;}
    for(const o of [...world.npcs,...world.portals,world.gate])if(Math.hypot(x-o.x,y-o.y)<r+(o.label==='CONTACT'?30:world.portals.includes(o)?28:18))return true;
    return false;
  }
  function move(player,dx,dy,dt,world){
    const length=Math.hypot(dx,dy);if(!length)return false;
    const distance=190*Math.min(dt,.05),sx=dx/length*distance,sy=dy/length*distance;
    player.facing=Math.atan2(dy,dx);const oldX=player.x,oldY=player.y;
    // Axis separation gives natural sliding along obstacles.
    if(!blocked(player.x+sx,player.y,13,world))player.x+=sx;
    if(!blocked(player.x,player.y+sy,13,world))player.y+=sy;
    return oldX!==player.x||oldY!==player.y;
  }
  function nearest(player,objects){let best=null,distance=90;for(const o of objects){const d=Math.hypot(player.x-o.x,player.y-o.y);if(d<distance){best=o;distance=d;}}return best;}
  root.RPG_ENGINE={blocked,move,nearest};
})(typeof window==='undefined'?globalThis:window);
