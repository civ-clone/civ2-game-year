import { MapSize } from '@civ-clone/civ2-rules/lib/mapSize';
/**
 * Which calendar a game uses (OpenCiv2 `src/auto/game.cpp` `game_turn_to_year`, richardpenman/civ2@49f26ec): the level less 1, one fewer on a large map and one more on a small
 * one, kept to 0 to 3.
 */
export declare const calendarFor: (level: number, size: MapSize) => number;
/**
 * The year of `turn` (1 is the first) in `calendar` (`game_turn_to_year`). Turn 1 is 4000 BC; each period runs its turns
 * at its step, and after the last every turn is a year. Year 0 is given as 1. From the turn after the first spaceship
 * launch (`launchTurn`), every turn is a year.
 */
export declare const yearOf: (
  turn: number,
  calendar: number,
  launchTurn?: number | null
) => number;
