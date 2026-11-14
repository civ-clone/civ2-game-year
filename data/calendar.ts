// Civilization II's four calendars (OpenCiv2 `src/auto/game.cpp` `game_turn_to_year`, :4042), read from the table at
//  0x62c490 in civ2.exe (OpenCiv2 `src/data/gamedata.cpp`, `year_table_start_years_block`). Each is six periods of
//  `[start year, turns, years per turn]`; after the sixth, every turn is a year.
export type Period = readonly [startYear: number, turns: number, step: number];

export const calendars: readonly (readonly Period[])[] = [
  // 0: Chieftain and Warlord on a normal map.
  [
    [-4000, 250, 20],
    [1000, 50, 10],
    [1500, 50, 5],
    [1750, 50, 2],
    [1850, 50, 1],
    [1900, 100, 1],
  ],
  // 1: Prince.
  [
    [-4000, 60, 50],
    [-1000, 40, 25],
    [0, 150, 10],
    [1500, 50, 5],
    [1750, 50, 2],
    [1850, 50, 1],
  ],
  // 2: King.
  [
    [-4000, 60, 50],
    [-1000, 40, 25],
    [0, 50, 20],
    [1000, 50, 10],
    [1500, 50, 5],
    [1750, 50, 2],
  ],
  // 3: Emperor and Deity.
  [
    [-4000, 60, 50],
    [-1000, 40, 25],
    [0, 75, 20],
    [1500, 25, 10],
    [1750, 50, 2],
    [1850, 50, 1],
  ],
];

export default calendars;
