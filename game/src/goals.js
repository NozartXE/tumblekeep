// Winning a chamber: braziers lit, the Idol seated, every switch pressed — and the door that remembers.
import { TILES } from './config.js';
import { gravVec } from './turning.js';
import { entityAt } from './objects.js';
import { supportOf } from './settle.js';
export function evaluateGoals(state) {
  const tiles = state.tiles.flat();
  const braziersTotal = tiles.filter(t => t === TILES.BRAZIER).length;
  const altars = tiles.filter(t => t === TILES.ALTAR).length;
  const switchesTotal = tiles.filter(t => t === TILES.SWITCH).length;
  const seatedOn = (kind, tile) => state.entities.filter(e => e.kind === kind && !e.seated && supportOf(state, e) === tile).length;
  const brazierCount = state.entities.filter(e => (e.kind === 'orb' || e.kind === 'ember') && e.seated).length;
  const switchesPressed = state.tiles.reduce((n, row, r) => n + row.reduce((m, t, c) => m + (t === TILES.SWITCH && entityAt(state, c, r - gravVec(state)[1])?.id ? 1 : 0), 0), 0);
  const idolSeated = altars === 0 ? null : seatedOn('idol', TILES.ALTAR) > 0;
  const braziersLit = braziersTotal === 0 || brazierCount >= braziersTotal;
  const allSwitches = switchesTotal === 0 || switchesPressed === switchesTotal;
  return { braziersLit, braziersTotal, idolSeated, switchesPressed: allSwitches, switchesTotal, doorOpen: braziersLit && (idolSeated !== false) && allSwitches };
}
export function refreshGoals(state) {
  const events = [];
  const tiles = state.tiles.flat();
  if (!state.switchLatch && tiles.includes(TILES.SWITCH)) {
    const g = gravVec(state);
    const pressed = state.tiles.every((row, r) => row.every((t, c) => t !== TILES.SWITCH || Boolean(entityAt(state, c - g[0], r - g[1]))));
    if (pressed) { state.switchLatch = true; events.push({ type: 'switch-latched' }); }
  }
  const goals = evaluateGoals(state);
  if (state.switchLatch || !tiles.includes(TILES.SWITCH)) goals.switchesPressed = true;
  const open = goals.braziersLit && goals.idolSeated !== false && goals.switchesPressed;
  if (open && !state.doorOpen) { state.doorOpen = true; events.push({ type: 'door-open' }); }
  return events;
}
