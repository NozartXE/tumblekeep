// The run itself: chambers, hearts, score and the STEADY chain — a fixed-step state machine the tools can replay headless.
import { CHAMBERS } from './chambers.js';
import { DIFFICULTIES, CLEAR_BASE, TURN_BONUS, SEAT_BONUS, RESET_PENALTY, CHAIN_MAX, TURN_TICKS, WALK_TICKS, HOP_TICKS, SETTLE_STEP_TICKS, TILES } from './config.js';
import { makeRng, hashState } from './rng.js';
import { parseChamber, tileAt } from './objects.js';
import { startTurn, finishTurn, gravVec } from './turning.js';
import { settleAll, settleStep } from './settle.js';
import { tryWalk, tryHop } from './hero.js';
import { refreshGoals } from './goals.js';
import { checkFeats } from './feats.js';
export function createRun(seed=1,diffKey='steady') { const d=DIFFICULTIES[diffKey]||DIFFICULTIES.steady; const s={mode:'play',seed,diffKey,rng:makeRng(seed),score:0,hearts:d.hearts,chain:0,bestChain:0,chamberIdx:0,endless:false,endlessCount:0,boons:[],feats:{},events:[],log:[],startedAtTick:0,tick:0,stats:{clears:0,clearsUnderPar:0,wingClearsNoHeart:0,seatsInChamber:0,heartsLostThisWing:0,chambersCleared:0}};loadChamber(s,0);return s; }
export function mirrorDef(def) { return {...def,grid:def.grid.map(row=>[...row].reverse().map(ch=>ch==='>'?'<':ch==='<'?'>':ch).join(''))}; }
export function endlessDef(state) { const base=CHAMBERS[state.endlessCount%CHAMBERS.length],def=state.endlessCount%2===1?mirrorDef(base):{...base};return {...def,name:`EVERDEEP ${state.endlessCount+1}`,par:base.par+1}; }
export function startEndless(state) { state.endless=true;state.endlessCount=0;state.hearts=(DIFFICULTIES[state.diffKey]||DIFFICULTIES.steady).hearts;state.won=false;state.mode='play';loadChamber(state,0,endlessDef(state));return state; }
export function loadChamber(state,idx,defOverride) { if(idx>=CHAMBERS.length&&!defOverride&&!state.endless){state.mode='results';state.won=true;checkFeats(state,'win');return state;}const entering=state.chamberIdx!==idx||!state.chamber;const def=defOverride||(state.endless?endlessDef(state):CHAMBERS[idx]),p=parseChamber(def);state.chamberIdx=idx;state.chamber=def;state.tiles=p.tiles.map(row=>row.slice());state.entities=p.entities.map(e=>({...e}));state.heroId=p.heroId;state.turnsNet=0;state.turnsUsed=0;state.switchLatch=false;state.doorOpen=false;state.heroExited=false;state.freeTurnUsed=false;state.softBootsUsed=false;state.seatsInChamber=0;state.events ||= [];state.log ||= [];if(entering&&idx%4===0)state.stats.heartsLostThisWing=0;state.log.push(`CHAMBER ${idx+1}: ${def.name}`);refreshGoals(state);return state; }
export function resetChamber(state) { const {score,hearts,boons,chain}=state;loadChamber(state,state.chamberIdx);Object.assign(state,{score,hearts,boons,chain}); }
function postSettle(state,events) { state.events.push(...events);state.events.push(...refreshGoals(state));
  if(events.some(e=>e.type==='spike-hero')) { if((state.boons||[]).includes('soft-boots')&&!state.softBootsUsed){state.softBootsUsed=true;}else{state.hearts--;state.stats.heartsLostThisWing=(state.stats.heartsLostThisWing||0)+1;state.score-=RESET_PENALTY;state.chain=0;if(state.hearts<=0){state.mode='results';state.won=false;return;}resetChamber(state);return;} }
  if(events.some(e=>e.type==='shattered')){state.score-=RESET_PENALTY/2;resetChamber(state);return;}
  if(!state.heroExited&&state.doorOpen){const h=state.entities.find(e=>e.id===state.heroId);if(h){const [dc,dr]=gravVec(state);if(tileAt(state,h.c+dc,h.r+dr)===TILES.DOOR)state.heroExited=true;}}
  if(state.heroExited)clearChamber(state);
}
function runAction(state,action) { if(action.t==='R'||action.t==='L'){startTurn(state,action.t==='R'?1:-1);finishTurn(state);postSettle(state,settleAll(state));return true;}let moved=false;if(action.t==='>'||action.t==='<')moved=tryWalk(state,action.t==='>'?1:-1);else if(action.t==='^')moved=tryHop(state);if(!moved)return false;postSettle(state,settleAll(state));return true; }
export function applyAction(state,action) { if(state.busyAnim||state.mode!=='play')return false;return runAction(state,action); }
export function clearChamber(state) { const def=state.chamber,d=DIFFICULTIES[state.diffKey]||DIFFICULTIES.steady,grace=d.parGrace+((state.boons||[]).includes('keepers-eye')?1:0);const seats=state.entities.filter(e=>e.seated).length;const base=CLEAR_BASE+TURN_BONUS*Math.max(0,def.par+grace-state.turnsUsed)+SEAT_BONUS*seats;state.score+=Math.round(base*(1+.1*Math.min(state.chain,4))*d.mult);state.chain++;state.bestChain=Math.max(state.bestChain,state.chain);state.stats.clearsUnderPar+=state.turnsUsed<=def.par?1:0;state.stats.seatsInChamber=seats;state.stats.chambersCleared=(state.stats.chambersCleared||0)+1;
  state.stats.clears=(state.stats.clears||0)+1;
  if(state.endless){state.endlessCount++;checkFeats(state,'endless-clear');loadChamber(state,0,endlessDef(state));return;}
  checkFeats(state,'clear');
  if(state.chamberIdx===3||state.chamberIdx===7){if(typeof globalThis.__TUMBLE_DRAFT==='function'){globalThis.__TUMBLE_DRAFT(state);return;} }
  if(state.chamberIdx===11){state.mode='results';state.won=true;checkFeats(state,'win');return;}if([3,7].includes(state.chamberIdx))state.stats.heartsLostAtWingStart=state.hearts;loadChamber(state,state.chamberIdx+1);
}
export function queueAction(state,action){if(state.busyAnim)return false;state.animQueue ||= [];if(action.t==='R'||action.t==='L'){startTurn(state,action.t==='R'?1:-1);state.pendingTurn=action.t;state.busyAnim=true;return true;}const before=state.entities.find(e=>e.id===state.heroId);const from=before&&{c:before.c,r:before.r};if(!runAction(state,action))return false;state.heroAnim={from,t:0,ticks:action.t==='^'?HOP_TICKS:WALK_TICKS};state.busyAnim=true;return true;}
export function stepTick(state){state.tick++;if(state.draftDone){state.draftDone=false;loadChamber(state,state.chamberIdx+1);return state;}if(state.turnAnim){state.turnAnim.t++;if(state.turnAnim.t>=TURN_TICKS){finishTurn(state);postSettle(state,settleAll(state));state.turnAnim=null;state.settleAnim={t:0,ticks:SETTLE_STEP_TICKS*4};}return state;}if(state.heroAnim){if(++state.heroAnim.t>=state.heroAnim.ticks){state.heroAnim=null;state.busyAnim=false;}return state;}if(state.settleAnim){if(++state.settleAnim.t>=state.settleAnim.ticks){state.settleAnim=null;state.busyAnim=false;}return state;}return state;}
export function hashRun(state){return hashState({score:state.score,hearts:state.hearts,chamberIdx:state.chamberIdx,entities:state.entities.map(e=>[e.kind,e.c,e.r,e.seated]).sort((a,b)=>a[0].localeCompare(b[0])||a[1]-b[1]||a[2]-b[2]),turnsNet:state.turnsNet,tiles:state.tiles});}
