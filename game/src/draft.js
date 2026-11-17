// The boon draft: after the DAWN and NOON wings, the vault offers Nilo one of three boons.
import { BOONS, DIFFICULTIES, REROLL_COST } from './config.js';
export function makeDraft(state) {
  const owned = new Set(state.boons || []);
  const pool = BOONS.filter(b => !owned.has(b.id)).map(b => b.id);
  while (pool.length < 3) pool.push('score');
  const offers = [];
  while (offers.length < 3 && pool.length) {
    offers.push(pool.splice(state.rng.int(pool.length), 1)[0]);
  }
  return { offers };
}
export function rerollDraft(state) {
  if (state.score < REROLL_COST) return false;
  state.score -= REROLL_COST;
  state.draft = makeDraft(state);
  return true;
}
export function pickBoon(state, i) {
  const id = state.draft?.offers?.[i];
  if (!id) return false;
  if (id === 'score') state.score += 250;
  else {
    state.boons ||= [];
    if (!state.boons.includes(id)) state.boons.push(id);
    if (id === 'second-wind') state.hearts = Math.min((DIFFICULTIES[state.diffKey] || DIFFICULTIES.steady).hearts, state.hearts + 1);
  }
  state.events ||= [];
  state.events.push({ type: 'boon', id });
  state.log ||= [];
  state.log.push(`BOON: ${id}`);
  state.mode = 'play';
  state.draftDone = true;
  return true;
}
globalThis.__TUMBLE_DRAFT = state => { state.mode = 'draft'; state.draft = makeDraft(state); };
