// Feats of the keeper: six small honours, checked whenever a chamber falls or a run ends.
export function checkFeats(state, event) {
  const unlock = id => {
    if (state.feats[id]) return;
    state.feats[id] = true;
    state.events ||= [];
    state.events.push({ type: 'feat', id });
  };
  if (event === 'clear' && state.chamberIdx === 0) unlock('first-turn');
  if (event === 'clear' && state.stats.clearsUnderPar >= 5) unlock('under-par');
  if (event === 'clear' && [3, 7, 11].includes(state.chamberIdx) && state.stats.heartsLostThisWing === 0) unlock('unbroken');
  if (event === 'clear' && state.seatsInChamber >= 3) unlock('full-house');
  if (event === 'win') unlock('heart-turned');
  if (event === 'endless-clear' && state.endlessCount >= 5) unlock('everdeep-5');
}
