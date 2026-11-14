"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.yearInputs = void 0;
const GameDifficultyRegistry_1 = require("@civ-clone/core-difficulty/GameDifficultyRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const calendar_1 = require("../../lib/calendar");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Year_1 = require("@civ-clone/core-game-year/Rules/Year");
const YearKey_1 = require("@civ-clone/core-game-year/Rules/YearKey");
const level_1 = require("@civ-clone/civ2-difficulty/level");
const mapSize_1 = require("@civ-clone/civ2-rules/lib/mapSize");
// The size class of the game's map, from the squares every player sees, or `null` before there's a world.
const sizeOf = (playerWorldRegistry) => {
    const [playerWorld] = playerWorldRegistry.entries();
    return playerWorld
        ? (0, mapSize_1.default)(playerWorld.width() * playerWorld.height())
        : null;
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
/**
 * What the year rests on besides the turn: the calendar (from the level and the map's size) and the first launch.
 * With no world yet (a restore part-way, or a host asking before the world is built) there is no map size: the
 * calendar is the normal map's for the level, and `worldKnown` is false, so `core-game-year` keeps that year apart and
 * works it out again once the world exists.
 */
const yearInputs = (gameDifficultyRegistry, playerWorldRegistry, spaceshipRegistry) => {
    const size = sizeOf(playerWorldRegistry);
    return {
        calendar: (0, calendar_1.calendarFor)((0, level_1.levelOf)(gameDifficultyRegistry), size !== null && size !== void 0 ? size : 'normal'),
        launchTurn: firstLaunch(spaceshipRegistry),
        worldKnown: size !== null,
    };
};
exports.yearInputs = yearInputs;
// The level, the map and the launches are read each time a year is worked out, and the `YearKey` rule gives them to
//  `core-game-year`'s `Year`, which keeps each year under them as well as the turn: a second game in the same process
//  at another level, or a world that now exists, works its years out again.
const getRules = (gameDifficultyRegistry = GameDifficultyRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, spaceshipRegistry = SpaceshipRegistry_1.instance) => {
    const inputs = () => (0, exports.yearInputs)(gameDifficultyRegistry, playerWorldRegistry, spaceshipRegistry);
    return [
        new YearKey_1.default('civ2-game-year:turn/year-key', new Effect_1.default(() => {
            const { calendar, launchTurn, worldKnown } = inputs();
            return [
                worldKnown ? calendar : `no-world-${calendar}`,
                launchTurn !== null && launchTurn !== void 0 ? launchTurn : 'no-launch',
            ].join(':');
        })),
        new Year_1.default('civ2-game-year:turn/year', new Effect_1.default((turn) => {
            const { calendar, launchTurn } = inputs();
            return (0, calendar_1.yearOf)(turn, calendar, launchTurn);
        })),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=year.js.map