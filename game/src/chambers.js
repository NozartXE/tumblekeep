// The twelve chambers as data: ASCII vaults, loose relics, pars and the scripted solutions the tools replay.
const walk = (t, n) => Array.from({ length: n }, () => ({ t }));
export const CHAMBERS = [
  {
    name: 'FIRST TURN', wing: 'DAWN', par: 2, goal: 'SEAT THE IDOL',
    intro: 'Turn the vault to guide the Idol onto its altar.',
    grid: [
      '###############', '#.............#', '#....I........#', '#....#........#',
      '#.............#', '#.............#', '#.............#', '#.............#',
      '#.H.......D..A#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'L' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }]
  },
  {
    name: 'TWO FALLS', wing: 'DAWN', par: 2, goal: 'LIGHT THE BRAZIER',
    intro: 'A sun-orb rolls along slopes and settles into its brazier.',
    grid: [
      '###############', '#.............#', '#.O...........#', '####..........#',
      '#.............#', '#.............#', '#.............#', '#.............#',
      '#DH........#Z<#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'L' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }]
  },
  {
    name: 'THE LONG DROP', wing: 'DAWN', par: 2, goal: 'PRESS THE SWITCH',
    intro: 'Drop a crate down the shaft to hold the switch.',
    grid: [
      '###############', '#.............#', '#..........C..#', '#..........#..#',
      '#.............#', '#.............#', '#.............#', '#.............#',
      '#S.......H.D..#', '###############'
    ],
    solution: [{ t: 'L' }, { t: 'R' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }]
  },
  {
    name: 'SLOPES OF DAWN', wing: 'DAWN', par: 2, goal: 'LIGHT THE BRAZIER',
    intro: 'Use a ramp to roll the orb across the vault.',
    grid: [
      '###############', '#.............#', '#.O.......#...#', '#####.........#',
      '#.............#', '#.............#', '#.............#', '#.............#',
      '#D..H....>...Z#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'L' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }]
  },
  {
    name: 'DOUBLE SWITCH', wing: 'NOON', par: 3, goal: 'PRESS EVERY SWITCH',
    intro: 'Keep the first plate pressed while you reach the second.',
    grid: [
      '###############', '#.............#', '#.............#', '#......C......#',
      '#.....#####...#', '#.............#', '#.............#', '#.............#',
      '#SD....H.....S#', '###############'
    ],
    solution: [{ t: 'L' }, { t: 'R' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '^' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }]
  },
  {
    name: 'EMBER WAKE', wing: 'NOON', par: 3, goal: 'LIGHT THE BRAZIER',
    intro: 'A crate bridge carries the ember safely over the spikes.',
    grid: [
      '###############', '#.............#', '#.E..#........#', '#.##..........#',
      '#.............#', '#.............#', '#.............#', '#.............#',
      '#DH.>^^^####Z.#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'L' }, { t: '<' }, { t: '<' }]
  },
  {
    name: 'THE CROSS', wing: 'NOON', par: 4, goal: 'SEAT THE IDOL',
    intro: 'Turn through the vault’s cross to lift the Idol to its altar.',
    grid: [
      '###############', '#......A....D.#', '#.....#.#.....#', '#.............#',
      '#.....#I#.....#', '#.....###.....#', '#.............#', '#.............#',
      '#.H...........#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'R' }, { t: '>' }]
  },
  {
    name: 'TWIN BRAZIERS', wing: 'NOON', par: 5, goal: 'LIGHT BOTH BRAZIERS',
    intro: 'Guide each sun-orb along its own slope into a waiting brazier.',
    grid: [
      '###############', '#.............#', '#.O..#...#..O##', '#.##.......##.#',
      '#.............#', '#.............#', '#.............#', '#.............#',
      '#HD.>.Z.Z.<...#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'L' }, { t: 'L' }, { t: 'R' }, { t: '>' }]
  },
  {
    name: 'DUSK LEDGES', wing: 'DUSK', par: 2, goal: 'REACH THE DOOR',
    intro: 'Use the crate and ledge as a stairway to the high door.',
    grid: [
      '###############', '#.............#', '#.............#', '#.............#',
      '#.............#', '#.............#', '#............D#', '#..........####',
      '#.H.C.....#...#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'L' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }]
  },
  {
    name: 'THE TURNING STAIR', wing: 'DUSK', par: 4, goal: 'SEAT EVERYTHING',
    intro: 'One carefully aimed drop seats every relic and presses both plates.',
    grid: [
      '###############', '#....O...#....#', '#....#......C.#', '#.#I........#.#',
      '#..#..........#', '#.............#', '#.............#', '#.............#',
      '#D..H...>#ZASS#', '###############'
    ],
    solution: [{ t: 'R' }, { t: 'L' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '>' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }]
  },
  {
    name: 'EVERYTHING FALLS', wing: 'DUSK', par: 4, goal: 'SEAT EVERYTHING',
    intro: 'Send the whole vault west, then let gravity seat the full collection.',
    grid: [
      '###############', '#....#...O....#', '##.C.....#....#', '#..#.......I..#',
      '#..........#..#', '#.............#', '#.............#', '#.............#',
      '#SSDAZ<.H.....#', '###############'
    ],
    solution: [{ t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: 'L' }, { t: 'R' }, { t: '>' }, { t: '>' }]
  },
  {
    name: 'THE HEART TURNS', wing: 'DUSK', par: 6, goal: 'SEAT EVERYTHING',
    intro: 'Turn the final chamber once, and let every relic find its place.',
    grid: [
      '###############', '#....#...O.#.O#', '##.C.....#...##', '#..#.......I..#',
      '#..........#..#', '#.............#', '#.............#', '#.............#',
      '#SSDAZ<.H...Z.#', '###############'
    ],
    solution: [{ t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: '<' }, { t: 'L' }, { t: 'R' }, { t: '>' }, { t: '>' }]
  }
];
