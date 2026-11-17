// Seeded random numbers (mulberry32): the state lives in a plain object so a run can be copied, replayed and hashed.
export function makeRng(seed) {
  const state = { value: seed >>> 0 };
  return {
    state,
    next() {
      let t = state.value = (state.value + 0x6D2B79F5) >>> 0;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(n) { return Math.floor(this.next() * n); },
    range(a, b) { return a + this.next() * (b - a); },
    pick(arr) { return arr[this.int(arr.length)]; }
  };
}
export function hashState(obj) {
  const str = JSON.stringify(obj);
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) hash = Math.imul(hash ^ str.charCodeAt(i), 0x01000193) >>> 0;
  return hash.toString(16).padStart(8, '0');
}
