import {
  GameDifficultyRegistry,
  instance as gameDifficultyRegistryInstance,
} from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import { calendarFor, yearOf } from '../../lib/calendar';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import Year from '@civ-clone/core-game-year/Rules/Year';
import YearKey from '@civ-clone/core-game-year/Rules/YearKey';
import { levelOf } from '@civ-clone/civ2-difficulty/level';
import mapSize, { MapSize } from '@civ-clone/civ2-rules/lib/mapSize';

// The size class of the game's map, from the squares every player sees, or `null` before there's a world.
const sizeOf = (playerWorldRegistry: PlayerWorldRegistry): MapSize | null => {
  const [playerWorld]: PlayerWorld[] = playerWorldRegistry.entries();

  return playerWorld
    ? mapSize(playerWorld.width() * playerWorld.height())
    : null;
};

// The turn the first spaceship was launched on, or `null` before any is.
const firstLaunch = (spaceshipRegistry: SpaceshipRegistry): number | null =>
  spaceshipRegistry
    .entries()
    .map((spaceship: Spaceship) => spaceship.launched())
    .reduce(
      (first: number | null, launched: false | number): number | null =>
        launched === false
          ? first
          : first === null
          ? launched
          : Math.min(first, launched),
      null
    );

/**
 * What the year rests on besides the turn: the calendar (from the level and the map's size) and the first launch.
 * With no world yet (a restore part-way, or a host asking before the world is built) there is no map size: the
 * calendar is the normal map's for the level, and `worldKnown` is false, so `core-game-year` keeps that year apart and
 * works it out again once the world exists.
 */
export const yearInputs = (
  gameDifficultyRegistry: GameDifficultyRegistry,
  playerWorldRegistry: PlayerWorldRegistry,
  spaceshipRegistry: SpaceshipRegistry
): { calendar: number; launchTurn: number | null; worldKnown: boolean } => {
  const size = sizeOf(playerWorldRegistry);

  return {
    calendar: calendarFor(levelOf(gameDifficultyRegistry), size ?? 'normal'),
    launchTurn: firstLaunch(spaceshipRegistry),
    worldKnown: size !== null,
  };
};

// The level, the map and the launches are read each time a year is worked out, and the `YearKey` rule gives them to
//  `core-game-year`'s `Year`, which keeps each year under them as well as the turn: a second game in the same process
//  at another level, or a world that now exists, works its years out again.
export const getRules = (
  gameDifficultyRegistry: GameDifficultyRegistry = gameDifficultyRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): (Year | YearKey)[] => {
  const inputs = () =>
    yearInputs(gameDifficultyRegistry, playerWorldRegistry, spaceshipRegistry);

  return [
    new YearKey(
      'civ2-game-year:turn/year-key',
      new Effect((): string => {
        const { calendar, launchTurn, worldKnown } = inputs();

        return [
          worldKnown ? calendar : `no-world-${calendar}`,
          launchTurn ?? 'no-launch',
        ].join(':');
      })
    ),
    new Year(
      'civ2-game-year:turn/year',
      new Effect((turn: number): number => {
        const { calendar, launchTurn } = inputs();

        return yearOf(turn, calendar, launchTurn);
      })
    ),
  ];
};

export default getRules;
