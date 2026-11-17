// The keeper's feet: walking the floor in whatever direction gravity calls down, and hopping up one step.
import { TILES } from './config.js';
import { gravVec, rightVec } from './turning.js';
import { canEnter, tileAt } from './objects.js';
const hero = state => state.entities.find(e=>e.id===state.heroId);
function climb(state, target, h, g) { const upc=target[0]-g[0], upr=target[1]-g[1], huc=h.c-g[0], hur=h.r-g[1]; if(!canEnter(state,'hero',upc,upr)&&upc!==h.c||!canEnter(state,'hero',huc,hur))return false; h.c=upc;h.r=upr;return true; }
export function tryWalk(state, sign) {
  const h=hero(state); if(!h)return false; const [rx,ry]=rightVec(state),g=gravVec(state),tc=h.c+rx*sign,tr=h.r+ry*sign;
  if(tileAt(state,tc,tr)===TILES.DOOR && state.doorOpen){state.heroFrom={c:h.c,r:h.r};h.c=tc;h.r=tr;state.heroExited=true;state.facing=sign;return true;}
  if(canEnter(state,'hero',tc,tr)){state.heroFrom={c:h.c,r:h.r};h.c=tc;h.r=tr;state.facing=sign;return true;}
  if(climb(state,[tc,tr],h,g)){state.heroFrom={c:h.c,r:h.r};state.facing=sign;return true;} return false;
}
export function tryHop(state) { const h=hero(state);if(!h)return false;const [rx,ry]=rightVec(state),g=gravVec(state),sign=state.facing||1,tc=h.c+rx*sign,tr=h.r+ry*sign; if(climb(state,[tc,tr],h,g)){state.heroFrom={c:h.c-rx*sign,r:h.r-ry*sign};state.facing=sign;return true;}return tryWalk(state,sign); }
