# TUMBLEKEEP — design freeze (round 6, 2026-11-17)

Mechanic chosen by distinctness scan (hidden_files/round6-work/distinctness-scan.md):
time-echo is held by ECHOFALL (#9, 94.08%, in the paid zone) → pivot to the fallback,
**ROTATE-THE-WORLD gravity**. No top-40 entry rotates the world; nearest neighbours are
slingshot gravity wells (genre ceiling ~90%), personal gravity-flip (#1464, 74.92%) and
ring-rotation TD (#470) — all different mechanics.

## The game

**TUMBLEKEEP** — Nilo, keeper of the Tumbling Vault, turns whole chambers with a brass
crank. Every turn rotates the room 90°; gravity follows, and everything loose — Nilo,
crates, rolling sun-orbs, the golden Idol — falls and re-settles under the new down.
Solve each chamber by *aiming gravity*: seat the Idol on its altar, drop sun-orbs into
their braziers, stack crates onto weight-switches, then walk out the door.

- Canvas 1280×800, fixed 60 Hz sim, deterministic (mulberry32 seeded RNG, no wall-clock
  in the sim), plain JS modules, canvas rendering + DOM overlays for menus (AMBERHOLD
  pattern), WebAudio generative music + sfx, localStorage best/history.
- Grid chamber 15×10 cells of 72 px (1080×720) centred on the canvas with HUD rails.

## Core rules

- **Turn**: Q / E (or on-screen crank buttons) rotates the chamber 90° CCW / CW. The room
  animates rotating (~24 ticks), then the **settle solver** drops every loose entity one
  cell per tick along the gravity vector until it rests on stone or another entity.
  Entities settle in a fixed order (lowest-first along gravity) so results are exact.
- **Gravity frame**: DOWN is one of S/E/N/W in room coordinates. The hero walks "left /
  right" along the floor in the gravity frame (A/D or arrows) and hops 1 cell (W / Space).
  Hero render rotates with the frame so he always stands on the current floor.
- **Objects**: CRATE (blocker, can be stood on, stacks), SUN-ORB (rolls: after falling,
  if it rests on a SLOPE tile or on a rounded support it keeps rolling in its fall-side
  direction; stops on flat), IDOL (the heavy goal block), EMBER-ORB (orb variant for
  braziers, chambers 8+).
- **Tiles**: stone, SLOPE (two orientations per gravity frame — render as ramps), SPIKES
  (hero loses a heart and the chamber resets; a crate landing on spikes is destroyed;
  orbs roll over spikes safely? No — orbs shatter on spikes: fail state for that orb,
  chamber reset without heart loss), DOOR (exit, opens when the chamber goal is met),
  ALTAR (idol seat), BRAZIER (orb seat), SWITCH (floor plate: pressed while any entity
  rests on it; ALL switches pressed opens the door), CRADLE marks orb seats in early
  chambers (same as brazier, visual variant).
- **Chamber goal types** (shown on the HUD objective line): SEAT THE IDOL · LIGHT THE
  BRAZIERS (n) · PRESS EVERY SWITCH · REACH THE DOOR (pure traversal). Door opens when
  met; hero entering the open door clears the chamber.
- **Turns & score**: each chamber has a PAR (turns). Score = clear base 500 + 150 per
  turn under par + 300 per seated object + STEADY chain multiplier ×1–×5 (consecutive
  clears without losing a heart). Walking is free; only turns and resets cost.
- **Hearts**: run starts with hearts by difficulty. Hero on spikes → −1 heart, chamber
  resets (score −200). Hearts 0 → run over → results (a LOSS run in history).
- **Campaign**: 12 chambers, 3 wings — DAWN (1–4), NOON (5–8), DUSK (9–12). Boon draft
  after chambers 4 and 8: pick 1 of 3 from a pool of 9 boons, reroll costs 150 score.
  Chamber 12, THE HEART TURNS, is the finale: idol + 2 braziers + 2 switches in one room.
  Clearing 12 wins the run (results with grade).
- **Difficulties**: STEADY (4 hearts, par +1 grace in scoring), TURNING (3 hearts),
  TUMBLING (3 hearts, par −1, score ×1.25). Title also carries the EVERDEEP endless line:
  after a win, endless mode remixes chambers (mirrored layouts, shuffled objects, seeded)
  for score attack.
- **Boons (pool of 9)**: Soft Boots (hero survives one spike fall per chamber), Greased
  Hinges (first turn each chamber is free), Idol's Blessing (+150 per seat), Wide Cradle
  (orbs seat from one cell further), Second Wind (+1 heart now), Keeper's Eye (par +1 on
  scoring), Heavy Idol (idol presses switches too — it already can; instead: Idol counts
  as two weights), Dust Charm (+25% chain cap → ×6), Slow Fall (settle anim slower,
  +10% score). Pick 3 distinct per draft offer, seeded.
- **Feats (6)**: FIRST TURN (finish chamber 1), UNDER PAR (clear 5 chambers at/under
  par), UNBROKEN (clear a wing without losing a heart), FULL HOUSE (seat idol + 2 orbs
  in one chamber), HEART TURNED (win the run), EVERDEEP 5 (clear 5 endless chambers).

## Escalation (chambers)

1. FIRST TURN — teach rotation; one crate, idol + altar, par 2. REACH+SEAT.
2. TWO FALLS — orb + cradle introduced; par 3.
3. THE LONG DROP — tall shaft, crate stack onto a switch; par 3.
4. SLOPES OF DAWN — slopes make the orb roll across the room; par 4. → DRAFT
5. DOUBLE SWITCH — two switches, one crate + the idol as weights; par 4.
6. EMBER WAKE — first ember-orb + brazier across a spike trench (orb must roll OVER
   via slope momentum... orbs shatter on spikes: route it along a bridge of crates); par 5.
7. THE CROSS — gravity in all four directions matters; idol + switch + door; par 5.
8. TWIN BRAZIERS — two orbs, two braziers, one slope network; par 5. → DRAFT
9. DUSK LEDGES — fragile route: hero traversal + crate lift; par 5.
10. THE TURNING STAIR — big staged chamber (COVER): idol, orb, 2 switches, spikes; par 6.
11. EVERYTHING FALLS — all object kinds, tight par 6.
12. THE HEART TURNS — finale: idol + 2 braziers + 2 switches, par 8.

Chamber layouts are data in src/chambers.js: ASCII grids (15×10) + entity list + par +
goal + intro line. Legend: # stone, . empty, ^ spikes, = slope/, \ slope\, D door,
A altar, B brazier, S switch, H hero spawn, C crate, O orb, E ember-orb, I idol.

## Dossier architecture (SUNWRIGHT pattern, adopted whole)

Shot order: **1-play (cover) · 2-title · 3-draft · 4-results**, staged deterministically
via `?shot=` testhook + scripted plans; HUD numbers rebuilt from the sim (no fake text).

1. **Cover = play**, chamber 10 mid-rotation freeze: room tilted ~26°, crates/orb sliding
   with motion streaks + dust, hero braced on the wall-becoming-floor, huge curved brass
   TURN arrow, gravity dial pointing at the new DOWN. In frame: WIN/LOSE banners
   ("WIN: seat the Idol, light both braziers" / "LOSE: hearts gone"), hearts, SCORE +
   BEST + STEADY ×3, TURNS 4 / PAR 6, chamber track (12 pips, finale skull at 12),
   objective roster ("IDOL → ALTAR · ORB → BRAZIER ×2 · SWITCHES 1/2"), boon bar,
   floating texts "+300 IDOL SEATED!", "ORB ROLLING →", event log 3 lines, controls line.
2. **Title**: wordmark across the frame, live demo chamber auto-turning behind, scope
   strip "12 chambers · 5 loose relics · 9 boons · 3 difficulties · endless EVERDEEP",
   six-row rules digest with explicit WIN and LOSE rows, PLAY + BEST + FEATS 4/6, three
   difficulty buttons, EVERDEEP line, HOW TO PLAY / OPTIONS / VAULT GUIDE buttons,
   keycaps footer.
3. **Draft**: "THE VAULT TURNS — PICK 1" fills the shot; 3 boon roundels (key hint, name,
   effect, synergy note), owned-boons strip, honest next-chamber forecast ("NEXT:
   CHAMBER 9 — DUSK LEDGES · 1 idol · 1 orb · par 5 · your boons: …"), reroll with cost.
4. **Results**: grade letter + score + NEW BEST, stat tiles, run metadata (difficulty,
   seed, time, Δ best), grade thresholds ✓/✗, LAST 3 RUNS incl. losses in red, YOUR
   BOONS summary, feats row, NEXT GOAL line, per-chamber turns-vs-par graph, dominant
   "R — RUN AGAIN".

## Source layout (each file opens with a one-line plain-English job comment)

Load order = outline order; put the mechanic files early.
index.html (pitch comment) · style.css · src/main.js (boot/loop) · src/config.js (all
tuning + NAMES) · src/rng.js · src/chambers.js (12 layouts as data) · src/turning.js
(rotation state + animation) · src/settle.js (the gravity settle solver) · src/hero.js ·
src/objects.js (crate/orb/idol behaviour) · src/goals.js (door/altar/brazier/switch
checks) · src/sim.js (run state, fixed-step update) · src/draft.js · src/feats.js ·
src/save.js · src/audio.js · src/announce.js (banners/floaters/log) · src/input.js ·
src/plan.js (scripted plan runner for staging + balance) · src/testhook.js (?shot=
staging) · src/titledemo.js · src/render/vault.js (chamber diorama) · src/render/
things.js (entities) · src/render/fx.js (dust, streaks, glow) · src/render/hud.js ·
src/render/screens.js (title/draft/results) · src/ui/menus.js (DOM overlays) ·
tools/balance.mjs (plan bots prove chambers solvable; weak/idle plans fail).

Determinism: sim uses only seeded RNG + fixed 60 Hz steps; plans replay inputs at fixed
ticks; two runs of main.ts must produce byte-identical dossier.json.
