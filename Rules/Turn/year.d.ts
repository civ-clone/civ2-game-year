import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Year from '@civ-clone/core-game-year/Rules/Year';
export declare const getRules: (
  gameDifficultyRegistry?: GameDifficultyRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  spaceshipRegistry?: SpaceshipRegistry
) => Year[];
export default getRules;
