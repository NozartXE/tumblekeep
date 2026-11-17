// Runs written solution plans against the sim: the same path the balance tool and the demo use.
import { CHAMBERS } from './chambers.js';
import { applyAction, createRun, loadChamber } from './sim.js';

export function runPlan(state, actions) {
  for (const action of actions) applyAction(state, action);
  return state;
}

export function chamberPlan(idx) { return CHAMBERS[idx].solution; }

export function planClears(idx, actions, seed = 7) {
  const state = createRun(seed, 'turning');
  loadChamber(state, idx);
  const initialIdx = state.chamberIdx;
  let turnsUsed = 0;
  for (const action of actions) {
    if (action.t === 'R' || action.t === 'L') turnsUsed++;
    applyAction(state, action);
    if (state.chamberIdx !== initialIdx || state.mode === 'draft' || state.mode === 'results' || state.chamberDone) break;
  }
  const cleared = state.chamberIdx !== initialIdx || state.mode === 'draft' || state.mode === 'results' || Boolean(state.chamberDone);
  return { cleared, turnsUsed: cleared ? turnsUsed : state.turnsUsed, mode: state.mode };
}
