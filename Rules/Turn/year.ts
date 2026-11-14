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
import { levelOf } from '@civ-clone/civ2-difficulty/level';
import mapSize from '@civ-clone/civ2-rules/lib/mapSize';

// The number of squares in the game's map: every player sees the same world. Before there's a world (or in a test
//  without one), a normal map's 4,000.
const squares = (playerWorldRegistry: PlayerWorldRegistry): number => {
  const [playerWorld]: PlayerWorld[] = playerWorldRegistry.entries();

  return playerWorld ? playerWorld.width() * playerWorld.height() : 4000;
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

// Each is asked when the year is: `core-game-year`'s `Year` keeps each turn's year once worked out, so only years
//  already asked for miss a change of level, map or launch.
export const getRules = (
  gameDifficultyRegistry: GameDifficultyRegistry = gameDifficultyRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Year[] => [
  new Year(
    'civ2-game-year:turn/year',
    new Effect((turn: number): number =>
      yearOf(
        turn,
        calendarFor(
          levelOf(gameDifficultyRegistry),
          mapSize(squares(playerWorldRegistry))
        ),
        firstLaunch(spaceshipRegistry)
      )
    )
  ),
];

export default getRules;
