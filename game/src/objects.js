// Loose things of the vault: parsing a chamber's letters into tiles and relics, and what each relic is allowed to do.
import { BOARD, TILES } from './config.js';
export const SEAT_KINDS = ['idol', 'orb', 'ember'];
const LETTERS = { '#': TILES.STONE, '^': TILES.SPIKES, '>': TILES.SLOPE_E, '<': TILES.SLOPE_W, D: TILES.DOOR, A: TILES.ALTAR, Z: TILES.BRAZIER, S: TILES.SWITCH, '.': TILES.EMPTY };
export function parseChamber(def) {
  const tiles = def.grid.map(row => [...row].map(ch => LETTERS[ch] ?? TILES.EMPTY));
  const entities = []; let heroId = null;
  for (let r = 0; r < def.grid.length; r++) for (let c = 0; c < def.grid[r].length; c++) {
    const ch = def.grid[r][c]; const kind = ({ H: 'hero', C: 'crate', O: 'orb', E: 'ember', I: 'idol' })[ch];
    if (kind) { const id = `${kind}-${entities.length}`; entities.push({ id, kind, c, r, seated: false, momentum: false, rollDir: 0 }); if (kind === 'hero') heroId = id; }
  }
  return { tiles, entities, heroId };
}
export function isSolidTile(t) { return [TILES.STONE, TILES.SLOPE_E, TILES.SLOPE_W, TILES.SPIKES, TILES.DOOR, TILES.ALTAR, TILES.SWITCH].includes(t); }
export function tileAt(state, c, r) { if (r < 0 || c < 0 || r >= state.tiles.length || c >= state.tiles[r].length) return TILES.STONE; return state.tiles[r][c]; }
export function entityAt(state, c, r) { return state.entities.find(e => e.c === c && e.r === r) || null; }
export function canEnter(state, kind, c, r) {
  if (r < 0 || c < 0 || r >= state.tiles.length || c >= state.tiles[r].length || entityAt(state, c, r)) return false;
  const t = tileAt(state, c, r);
  if (t === TILES.EMPTY) return true;
  return t === TILES.BRAZIER && (kind === 'orb' || kind === 'ember');
}
export function isLoose(e) { return !e.seated; }
export function countsForSwitch(e) { return Boolean(e); }
