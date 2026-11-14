import { MapSize } from '@civ-clone/civ2-rules/lib/mapSize';
import calendars from '../data/calendar';

/**
 * Which calendar a game uses (OpenCiv2 `src/auto/game.cpp` `game_turn_to_year`, richardpenman/civ2@49f26ec): the level less 1, one fewer on a large map and one more on a small
 * one, kept to 0 to 3.
 */
export const calendarFor = (level: number, size: MapSize): number =>
  Math.min(
    3,
    Math.max(
      0,
      level - 1 - (size === 'large' ? 1 : 0) + (size === 'small' ? 1 : 0)
    )
  );

/**
 * The year of `turn` (1 is the first) in `calendar` (`game_turn_to_year`). Turn 1 is 4000 BC; each period runs its turns
 * at its step, and after the last every turn is a year. Year 0 is given as 1. From the turn after the first spaceship
 * launch (`launchTurn`), every turn is a year.
 */
export const yearOf = (
  turn: number,
  calendar: number,
  launchTurn: number | null = null
): number => {
  const periods = calendars[calendar];
  let extraTurns = 0;

  if (launchTurn !== null) {
    extraTurns = Math.max(0, turn - launchTurn);
    turn -= extraTurns;
  }

  if (turn !== 0) {
    turn--;
  }

  let period = 0;

  while (period < 6 && periods[period][1] < turn) {
    turn -= periods[period][1];
    period++;
  }

  let year: number;

  if (period < 6) {
    const [startYear, , step] = periods[period];

    year = startYear + step * turn;
  } else {
    const [startYear, turns, step] = periods[5];

    year = startYear + step * turns + turn;
  }

  if (year === 0) {
    year = 1;
  }

  return year + extraTurns;
};
