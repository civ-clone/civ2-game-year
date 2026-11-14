import { MapSize } from '@civ-clone/civ2-rules/lib/mapSize';
/**
 * Which calendar a game uses (`game.cpp:4049-4057`): the level less 1, one fewer on a large map and one more on a small
 * one, kept to 0 to 3.
 */
export declare const calendarFor: (level: number, size: MapSize) => number;
/**
 * The year of `turn` (1 is the first) in `calendar` (`game.cpp:4042`). Turn 1 is 4000 BC; each period runs its turns
 * at its step, and after the last every turn is a year. Year 0 is given as 1. From the turn after the first spaceship
 * launch (`launchTurn`), every turn is a year.
 */
export declare const yearOf: (
  turn: number,
  calendar: number,
  launchTurn?: number | null
) => number;
