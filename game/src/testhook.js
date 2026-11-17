// Stages the four dossier photographs: ?shot=play|title|draft|results, then raises __SHOT_READY.
import { createRun, applyAction, loadChamber } from './sim.js';
import { CHAMBERS } from './chambers.js';
import { makeDraft } from './draft.js';
import { makeRng } from './rng.js';
import { createDemo, demoStep } from './titledemo.js';
import { boardPoint } from './render/vault.js';
import { spawnDust, spawnFloater, spawnStreak } from './render/fx.js';

const playActions = (state, actions) => { for (const action of actions) applyAction(state, action); };

function stagePlay(state, stage) {
  loadChamber(state, 11);
  playActions(state, [...Array(7).fill({ t: '<' }), { t: 'L' }, { t: 'R' }]);
  state.events.length = 0;
  state.score = 11200;
  state.save = { ...(state.save || {}), best: 12400 };
  state.banner = null;
  state.mode = 'play';
  globalThis.__TK_ANGLE = 8;
  const point = (kind, fallback) => {
    const e = state.entities.find(x => x.kind === kind);
    return boardPoint(state, e?.c ?? fallback[0], e?.r ?? fallback[1]);
  };
  const idol = point('idol', [11, 7]), crate = point('crate', [13, 7]);
  spawnFloater(stage, idol.x, idol.y - 44, '+300 SEATED', '#f4cb57');
  for (const orbEntity of state.entities.filter(e => (e.kind === 'orb' || e.kind === 'ember') && e.seated)) {
    const orb = boardPoint(state, orbEntity.c, orbEntity.r);
    spawnFloater(stage, orb.x, orb.y - 38, '+300 LIT', '#ffad4c');
  }
  const doorTile = state.tiles.flatMap((row, r) => row.map((tile, c) => tile === 5 ? { c, r } : null)).find(Boolean);
  if (doorTile) { const door = boardPoint(state, doorTile.c, doorTile.r); spawnFloater(stage, door.x, door.y - 38, 'LATCHED!', '#e4bf67'); }
  spawnDust(stage, idol.x, idol.y + 18, 12, '#cbb98e');
  spawnDust(stage, crate.x, crate.y + 18, 10, '#cbb98e');
  const heroEntity = state.entities.find(e => e.id === state.heroId);
  if (heroEntity) {
    const heroPoint = boardPoint(state, heroEntity.c, heroEntity.r);
    spawnStreak(stage, heroPoint.x - 20, heroPoint.y, 15, 0);
    const applyOffset = () => {
      if (window.__TK?.state !== state) return;
      const p = boardPoint(state, heroEntity.c, heroEntity.r);
      stage.entityPos.set(heroEntity, { x: p.x + 26, y: p.y });
    };
    applyOffset();
    setInterval(applyOffset, 30);
  }
}

export function initTesthook() {
  const shot = new URLSearchParams(location.search).get('shot');
  if (!['play', 'title', 'draft', 'results'].includes(shot)) return;
  const tk = window.__TK;
  if (!tk) return;
  const live = tk.state;
  const state = createRun(7, 'turning');
  if (shot === 'play') { tk.save.best = 12400; stagePlay(state, tk.stage); }
  else if (shot === 'title') {
    state.mode = 'title';
    const demo = createDemo(2077);
    for (let i = 0; i < 150; i++) { demoStep(demo); }
  } else if (shot === 'draft') {
    state.boons = ['soft-boots', 'keepers-eye'];
    state.score = 2350;
    loadChamber(state, 3);
    for (const action of CHAMBERS[3].solution) {
      applyAction(state, action);
      if (state.mode === 'draft') break;
    }
    if (state.mode !== 'draft') {
      state.mode = 'draft';
      let seed = 7;
      do { state.rng = makeRng(seed++); state.draft = makeDraft(state); }
      while (new Set(state.draft.offers).size !== 3);
    }
  } else {
    state.mode = 'results';
    state.won = true;
    state.score = 9650;
    state.grade = 'A';
    state.totalTurns = 58;
    state.bestChain = 5;
    state.stats.chambersCleared = 12;
    state.stats.seatsInChamber = 3;
    state.boons = ['soft-boots', 'wide-cradle', 'second-wind'];
    state.feats = { 'first-turn': true, 'under-par': true, 'full-house': true, 'heart-turned': true, 'unbroken': true };
    const stagedSave = { best: 9650, history: [
      { score: 9650, won: true, difficulty: 'TURNING', seed: 7 },
      { score: 7200, won: false, difficulty: 'TURNING', seed: 19 },
      { score: 5400, won: true, difficulty: 'STEADY', seed: 31 }
    ], feats: state.feats };
    Object.assign(tk.save, stagedSave);
  }
  Object.assign(live, state);
  tk.state = live;
  let frames = 0;
  const ready = () => {
    if (++frames >= 20) { window.__SHOT_READY = true; return; }
    requestAnimationFrame(ready);
  };
  requestAnimationFrame(ready);
}
