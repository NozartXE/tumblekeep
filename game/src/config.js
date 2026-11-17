// Every tuning number in one place: cells, ticks, scores, hearts — and the NAMES table every screen reads.
export const STAGE = { w: 1280, h: 800 };
export const BOARD = { x: 160, y: 88, cell: 64, cols: 15, rows: 10 };
export const TILES = { EMPTY: 0, STONE: 1, SLOPE_E: 2, SLOPE_W: 3, SPIKES: 4, DOOR: 5, ALTAR: 6, BRAZIER: 7, SWITCH: 8 };
export const GRAV_VEC = [[0, 1], [1, 0], [0, -1], [-1, 0]];
export const TICK = 1 / 60;
export const TURN_TICKS = 24;
export const SETTLE_STEP_TICKS = 3;
export const WALK_TICKS = 6;
export const HOP_TICKS = 9;
export const CLEAR_BASE = 500;
export const TURN_BONUS = 150;
export const SEAT_BONUS = 300;
export const RESET_PENALTY = 200;
export const REROLL_COST = 150;
export const CHAIN_MAX = 5;
export const DIFFICULTIES = {
  steady: { name: 'STEADY', hearts: 4, parGrace: 1, mult: 1 },
  turning: { name: 'TURNING', hearts: 3, parGrace: 0, mult: 1 },
  tumbling: { name: 'TUMBLING', hearts: 3, parGrace: -1, mult: 1.25 }
};
export const BOONS = [
  { id: 'soft-boots', name: 'Soft Boots', line: 'Survive one spike fall per chamber.', synergy: 'Pairs with spike chambers.' },
  { id: 'greased-hinges', name: 'Greased Hinges', line: 'Your first turn each chamber is free.', synergy: 'Pairs with tight pars.' },
  { id: 'idols-blessing', name: "Idol's Blessing", line: 'Gain +150 points per seated object.', synergy: 'Pairs with relic chambers.' },
  { id: 'wide-cradle', name: 'Wide Cradle', line: 'Orbs seat from one cell further away.', synergy: 'Pairs with brazier chambers.' },
  { id: 'second-wind', name: 'Second Wind', line: 'Gain +1 heart now.', synergy: 'Pairs with difficult runs.' },
  { id: 'keepers-eye', name: "Keeper's Eye", line: 'Gain +1 par turn when scoring.', synergy: 'Pairs with turn-heavy chambers.' },
  { id: 'heavy-idol', name: 'Heavy Idol', line: 'The Idol crushes any spikes it lands on.', synergy: 'Pairs with switch chambers.' },
  { id: 'dust-charm', name: 'Dust Charm', line: 'Raise the STEADY chain cap to ×6.', synergy: 'Pairs with long runs.' },
  { id: 'slow-fall', name: 'Slow Fall', line: 'Settle more slowly and gain +10% score.', synergy: 'Pairs with careful setups.' }
];
export const FEATS = [
  { id: 'first-turn', name: 'FIRST TURN', line: 'Finish chamber 1.' },
  { id: 'under-par', name: 'UNDER PAR', line: 'Clear 5 chambers at or under par.' },
  { id: 'unbroken', name: 'UNBROKEN', line: 'Clear a wing without losing a heart.' },
  { id: 'full-house', name: 'FULL HOUSE', line: 'Seat an Idol and 2 orbs in one chamber.' },
  { id: 'heart-turned', name: 'HEART TURNED', line: 'Win the run.' },
  { id: 'everdeep-5', name: 'EVERDEEP 5', line: 'Clear 5 endless chambers.' }
];
export const GRADES = [{ grade: 'S', min: 11000 }, { grade: 'A', min: 9000 }, { grade: 'B', min: 7000 }, { grade: 'C', min: 5000 }, { grade: 'D', min: 0 }];
export const NAMES = { hero: 'NILO', vault: 'THE TUMBLING VAULT', win: 'WIN: SEAT THE IDOL - LIGHT THE BRAZIERS - CLEAR 12 CHAMBERS', lose: 'LOSE: HEARTS GONE', endless: 'EVERDEEP', chain: 'STEADY' };
