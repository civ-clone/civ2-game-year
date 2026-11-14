import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Year from '@civ-clone/core-game-year/Rules/Year';
import YearKey from '@civ-clone/core-game-year/Rules/YearKey';
/**
 * What the year rests on besides the turn: the calendar (from the level and the map's size) and the first launch.
 * With no world yet (a restore part-way, or a host asking before the world is built) there is no map size: the
 * calendar is the normal map's for the level, and `worldKnown` is false, so `core-game-year` keeps that year apart and
 * works it out again once the world exists.
 */
export declare const yearInputs: (
  gameDifficultyRegistry: GameDifficultyRegistry,
  playerWorldRegistry: PlayerWorldRegistry,
  spaceshipRegistry: SpaceshipRegistry
) => {
  calendar: number;
  launchTurn: number | null;
  worldKnown: boolean;
};
export declare const getRules: (
  gameDifficultyRegistry?: GameDifficultyRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  spaceshipRegistry?: SpaceshipRegistry
) => (Year | YearKey)[];
export default getRules;
