// What the vault remembers between visits: best score, the last three runs, lifetime feats.
const KEY = 'tumblekeep-save-v1';
const fresh = () => ({ best: 0, history: [], feats: {} });
export function loadSave() {
  if (typeof localStorage === 'undefined') return fresh();
  try { const value = JSON.parse(localStorage.getItem(KEY)); return value && typeof value === 'object' ? { ...fresh(), ...value } : fresh(); }
  catch { return fresh(); }
}
export function recordRun(save, state) {
  const clearedCount = state.stats?.clears ?? state.chamberIdx;
  save.history ||= [];
  save.feats ||= {};
  save.history.unshift({ score: state.score, won: !!state.won, difficulty: state.diffKey, seed: state.seed, chambers: clearedCount });
  save.history = save.history.slice(0, 3);
  save.best = Math.max(save.best || 0, state.score);
  for (const [id, unlocked] of Object.entries(state.feats || {})) if (unlocked) save.feats[id] = true;
  return save;
}
export function persistSave(save) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(save));
}
