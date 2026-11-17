// The gravity settle solver: everything loose falls one cell at a time until the vault is still, and sun-orbs roll.
import { TILES } from './config.js';
import { gravVec, rightVec } from './turning.js';
import { canEnter, entityAt, isLoose, tileAt } from './objects.js';
export { entityAt, tileAt };
export function supportOf(state, e) { const [dc, dr] = gravVec(state); const c = e.c + dc, r = e.r + dr; return entityAt(state, c, r) || tileAt(state, c, r); }
const dot = (e, g) => e.c * g[0] + e.r * g[1];
function seat(e, c, r) { e.c = c; e.r = r; e.seated = true; e.momentum = false; e.rollDir = 0; }
export function settleStep(state) {
  let moved = false; const g = gravVec(state); const ordered = state.entities.filter(isLoose).sort((a, b) => dot(b, g) - dot(a, g) || a.id.localeCompare(b.id)); const fell = new Set();
  for (const e of ordered) {
    if (!isLoose(e)) continue;
    const c = e.c + g[0], r = e.r + g[1];
    if (canEnter(state, e.kind, c, r)) { e.c = c; e.r = r; fell.add(e.id); moved = true; if (tileAt(state, c, r) === TILES.BRAZIER && (e.kind === 'orb' || e.kind === 'ember')) seat(e, c, r); }
  }
  const rv = rightVec(state); const descend = { [TILES.SLOPE_E]: [1, 0], [TILES.SLOPE_W]: [-1, 0] };
  for (const e of state.entities.filter(x => !x.seated && (x.kind === 'orb' || x.kind === 'ember')).sort((a,b) => dot(b,g)-dot(a,g))) {
    if (fell.has(e.id)) continue;
    const beyond = tileAt(state, e.c + g[0], e.r + g[1]); const under = entityAt(state, e.c + g[0], e.r + g[1]);
    if (under) { e.momentum = false; continue; }
    if (descend[beyond]) {
      const d = descend[beyond], a = d[0]*rv[0]+d[1]*rv[1], b = d[0]*g[0]+d[1]*g[1];
      if (!b && a) { const dir = Math.sign(a), c = e.c + rv[0]*dir, r = e.r + rv[1]*dir; if (canEnter(state,e.kind,c,r) || tileAt(state,c,r) === TILES.BRAZIER) { e.c=c; e.r=r; e.rollDir=dir; e.momentum=true; moved=true; if(tileAt(state,c,r)===TILES.BRAZIER) seat(e,c,r); } }
    } else if (e.momentum) {
      const c=e.c+rv[0]*e.rollDir, r=e.r+rv[1]*e.rollDir;
      if (canEnter(state,e.kind,c,r) || tileAt(state,c,r)===TILES.BRAZIER) { e.c=c; e.r=r; moved=true; if(tileAt(state,c,r)===TILES.BRAZIER) seat(e,c,r); }
      else e.momentum=false;
    }
  }
  return moved;
}
export function settleAll(state) {
  const events=[]; let guard=0; while(settleStep(state) && guard++ < 5000) {}
  for(const e of [...state.entities]) if(!e.seated && supportOf(state,e)===TILES.BRAZIER && (e.kind==='orb'||e.kind==='ember')) { seat(e,e.c,e.r); events.push({type:'seated',kind:e.kind,c:e.c,r:e.r}); }
  if(!state.switchLatch) {
    const switches=[]; state.tiles.forEach((row,r)=>row.forEach((t,c)=>{if(t===TILES.SWITCH)switches.push([c,r]);})); const g=gravVec(state);
    if(switches.length && switches.every(([c,r])=>Boolean(entityAt(state,c-g[0],r-g[1])))){state.switchLatch=true;events.push({type:'pressed'});}
  }
  for(const e of [...state.entities]) if(!e.seated && supportOf(state,e)===TILES.SPIKES) {
    if(e.kind==='hero') events.push({type:'spike-hero'});
    else if(e.kind==='crate'){state.entities=state.entities.filter(x=>x!==e);events.push({type:'crate-lost'});}
    else if(e.kind==='orb'||e.kind==='ember') events.push({type:'shattered',kind:e.kind});
    else if(e.kind==='idol' && (state.boons||[]).includes('heavy-idol')) { const [dc,dr]=g; const c=e.c+dc,r=e.r+dr; if(state.tiles[r]?.[c]===TILES.SPIKES){state.tiles[r][c]=TILES.EMPTY;events.push({type:'spike-crushed'});} }
  }
  return events;
}
