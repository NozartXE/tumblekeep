// Balance proof: every chamber's written solution clears it, idling clears nothing, the campaign is deterministic.
import { CHAMBERS } from '../game/src/chambers.js';
import { chamberPlan, planClears } from '../game/src/plan.js';
import { applyAction, createRun, hashRun, startEndless, stepTick } from '../game/src/sim.js';
import { pickBoon } from '../game/src/draft.js';

let failed = false;
const report = (name, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
  if (!pass) failed = true;
};

for (let i = 0; i < CHAMBERS.length; i++) {
  const result = planClears(i, chamberPlan(i));
  const pass = result.cleared && result.turnsUsed <= CHAMBERS[i].par + 2;
  report(`${i + 1}. ${CHAMBERS[i].name}`, pass, `${result.turnsUsed} turns / par ${CHAMBERS[i].par}`);
}
for (const idx of [0, 4, 9]) {
  const result = planClears(idx, []);
  report(`Idle ${idx + 1}. ${CHAMBERS[idx].name}`, !result.cleared);
}

function campaign(seed = 42) {
  const state = createRun(seed, 'turning');
  for (let idx = 0; idx < CHAMBERS.length && state.mode !== 'results'; idx++) {
    for (const action of chamberPlan(idx)) {
      applyAction(state, action);
      if (state.chamberIdx !== idx || state.mode === 'draft' || state.mode === 'results') break;
    }
    if (state.mode === 'draft') {
      pickBoon(state, 0);
      stepTick(state);
    }
  }
  return state;
}

const first = campaign();
const second = campaign();
const campaignHash = hashRun(first);
report('Campaign win', first.mode === 'results' && first.won, `score ${first.score}, hash ${campaignHash}`);
report('Determinism', campaignHash === hashRun(second), `hash ${hashRun(second)}`);

const endless = createRun(42, 'turning');
endless.won = true;
startEndless(endless);
for (let clear = 0; clear < 2; clear++) {
  const basePlan = chamberPlan(clear);
  const actions = clear % 2 ? basePlan.map(({ t }) => ({ t: ({ L: 'R', R: 'L', '<': '>', '>': '<' })[t] || t })) : basePlan;
  for (const action of actions) {
    applyAction(endless, action);
    if (endless.endlessCount > clear) break;
  }
}
report('Everdeep 2 clears', endless.endlessCount >= 2, `count ${endless.endlessCount}`);
console.log(`Campaign final score: ${first.score}`);
console.log(`Campaign final hash: ${campaignHash}`);
console.log(failed ? 'BALANCE: FAIL' : 'BALANCE: PASS');
if (failed) process.exitCode = 1;
