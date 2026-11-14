"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const GameDifficultyRegistry_1 = require("@civ-clone/core-difficulty/GameDifficultyRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const calendar_1 = require("../../lib/calendar");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Year_1 = require("@civ-clone/core-game-year/Rules/Year");
const level_1 = require("@civ-clone/civ2-difficulty/level");
const mapSize_1 = require("@civ-clone/civ2-rules/lib/mapSize");
// The number of squares in the game's map: every player sees the same world. Before there's a world (or in a test
//  without one), a normal map's 4,000.
const squares = (playerWorldRegistry) => {
    const [playerWorld] = playerWorldRegistry.entries();
    return playerWorld ? playerWorld.width() * playerWorld.height() : 4000;
};
// The turn the first spaceship was launched on, or `null` before any is.
const firstLaunch = (spaceshipRegistry) => spaceshipRegistry
    .entries()
    .map((spaceship) => spaceship.launched())
    .reduce((first, launched) => launched === false
    ? first
    : first === null
        ? launched
        : Math.min(first, launched), null);
// Each is asked when the year is: `core-game-year`'s `Year` keeps each turn's year once worked out, so only years
//  already asked for miss a change of level, map or launch.
const getRules = (gameDifficultyRegistry = GameDifficultyRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    new Year_1.default('civ2-game-year:turn/year', new Effect_1.default((turn) => (0, calendar_1.yearOf)(turn, (0, calendar_1.calendarFor)((0, level_1.levelOf)(gameDifficultyRegistry), (0, mapSize_1.default)(squares(playerWorldRegistry))), firstLaunch(spaceshipRegistry)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=year.js.map