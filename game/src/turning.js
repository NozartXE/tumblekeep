// The turning world: which way is down, which way is the keeper's right, and the crank that rotates the vault.
import { GRAV_VEC } from './config.js';
export function gravityIndex(state) { return ((state.turnsNet % 4) + 4) % 4; }
export function gravVec(state) { return GRAV_VEC[gravityIndex(state)]; }
export function rightVec(state) { const [dc, dr] = gravVec(state); return [dr, -dc]; }
export function startTurn(state, dir) { state.turnAnim = { dir, t: 0 }; }
export function finishTurn(state) {
  const dir = state.turnAnim?.dir || 0;
  state.turnsNet += dir;
  if (!(state.boons || []).includes('greased-hinges') || state.freeTurnUsed) state.turnsUsed += 1;
  else state.freeTurnUsed = true;
  state.turnAnim = null;
}
