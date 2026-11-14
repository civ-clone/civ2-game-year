import { calendarFor, yearOf } from '../lib/calendar';
import Chieftain from '@civ-clone/base-difficulty-chieftain/Chieftain';
import Deity from '@civ-clone/base-difficulty-deity/Deity';
import GameDifficultyRegistry from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import King from '@civ-clone/base-difficulty-king/King';
import Prince from '@civ-clone/base-difficulty-prince/Prince';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Warlord from '@civ-clone/base-difficulty-warlord/Warlord';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '@civ-clone/core-game-year/Rules/Year';
import GameYear from '@civ-clone/core-game-year/Year';
import { expect } from 'chai';
import turnYear from '../Rules/Turn/year';

const firstTurnOf = (calendar: number, year: number): number => {
  let turn = 1;

  while (yearOf(turn, calendar) < year) {
    turn++;
  }

  return turn;
};

describe('calendarFor', (): void => {
  it('is the level less 1, kept to 0-3, one fewer on a large map and one more on a small one', (): void => {
    expect([0, 1, 2, 3, 4, 5].map((level) => calendarFor(level, 'normal'))).eql(
      [0, 0, 1, 2, 3, 3]
    );
    expect([0, 1, 2, 3, 4, 5].map((level) => calendarFor(level, 'large'))).eql([
      0, 0, 0, 1, 2, 3,
    ]);
    expect([0, 1, 2, 3, 4, 5].map((level) => calendarFor(level, 'small'))).eql([
      0, 1, 2, 3, 3, 3,
    ]);
  });
});

describe('yearOf', (): void => {
  it('starts every calendar in 4000 BC', (): void => {
    [0, 1, 2, 3].forEach((calendar) => {
      expect(yearOf(1, calendar)).equal(-4000);
      expect(yearOf(0, calendar)).equal(-4000);
    });
  });

  it('reaches 2020 on turns 571, 521, 471 and 421, exactly', (): void => {
    expect([0, 1, 2, 3].map((calendar) => firstTurnOf(calendar, 2020))).eql([
      571, 521, 471, 421,
    ]);
    [0, 1, 2, 3].forEach((calendar) => {
      expect(yearOf(firstTurnOf(calendar, 2020), calendar)).equal(2020);
      expect(yearOf(firstTurnOf(calendar, 2000), calendar)).equal(2000);
    });
  });

  it('steps through the periods of calendar 0: 20 years a turn to AD 1000, then 10, 5, 2 and 1', (): void => {
    expect(yearOf(2, 0)).equal(-3980);
    expect(yearOf(251, 0)).equal(1000);
    expect(yearOf(252, 0)).equal(1010);
    expect(yearOf(301, 0)).equal(1500);
    expect(yearOf(302, 0)).equal(1505);
    expect(yearOf(352, 0)).equal(1752);
    expect(yearOf(402, 0)).equal(1851);
    expect(yearOf(551, 0)).equal(2000);
    expect(yearOf(552, 0)).equal(2001);
  });

  it('steps through calendar 2 (King): 50, 25, 20, 10, 5, then 2 years, then 1', (): void => {
    expect(yearOf(61, 2)).equal(-1000);
    expect(yearOf(62, 2)).equal(-975);
    expect(yearOf(101, 2)).equal(1);
    expect(yearOf(102, 2)).equal(20);
    expect(yearOf(201, 2)).equal(1500);
    expect(yearOf(301, 2)).equal(1850);
    expect(yearOf(302, 2)).equal(1851);
  });

  it('gives year 0 as AD 1', (): void => {
    expect(yearOf(101, 1)).equal(1);
    expect(yearOf(102, 1)).equal(10);
  });

  it('runs a year a turn after the first launch', (): void => {
    // King: turn 201 is 1500, turn 202 1505.
    expect(yearOf(202, 2)).equal(1505);
    expect(yearOf(201, 2, 201)).equal(1500);
    expect(yearOf(202, 2, 201)).equal(1501);
    expect(yearOf(211, 2, 201)).equal(1510);
    expect(yearOf(200, 2, 201)).equal(yearOf(200, 2));
  });
});

describe('the Year rule', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      gameDifficultyRegistry = new GameDifficultyRegistry(),
      worlds: { width: () => number; height: () => number }[] = [],
      launches: (false | number)[] = [];

    ruleRegistry.register(
      ...turnYear(
        gameDifficultyRegistry,
        { entries: () => worlds } as any,
        {
          entries: () => launches.map((turn) => ({ launched: () => turn })),
        } as any
      )
    );

    const year = (turn: number): number => {
      const [value] = ruleRegistry.process(Year, turn);

      return value;
    };

    return { gameDifficultyRegistry, launches, worlds, year };
  };

  it('plays at King on a normal map when nothing is set', (): void => {
    const { year } = setUp();

    expect(year(102)).equal(20);
  });

  it('reads the level, the map and the launches each time it is asked', (): void => {
    const { gameDifficultyRegistry, launches, worlds, year } = setUp();

    gameDifficultyRegistry.set(Chieftain);
    expect(year(252)).equal(1010);

    gameDifficultyRegistry.set(Warlord);
    // 40 × 50: a small map moves Warlord to calendar 1 (Prince's).
    worlds.push({ width: () => 40, height: () => 50 });
    expect(year(102)).equal(10);

    gameDifficultyRegistry.set(Prince);
    expect(year(102)).equal(20);

    gameDifficultyRegistry.set(Deity);
    // 75 × 120: a large map moves Deity to calendar 3 still.
    worlds[0] = { width: () => 75, height: () => 120 };
    expect(year(176)).equal(1500);

    // King on the large map: calendar 1 (Prince's).
    gameDifficultyRegistry.set(King);
    expect(year(176)).equal(750);

    launches.push(false, 200, 190);
    expect(year(200)).equal(yearOf(190, 1) + 10);
  });
});

describe('the years a game keeps', (): void => {
  // Two games in one process sharing the `Year`, as the default game's rules and registries are reused.
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      gameDifficultyRegistry = new GameDifficultyRegistry(),
      worlds: { width: () => number; height: () => number }[] = [];

    ruleRegistry.register(
      ...turnYear(
        gameDifficultyRegistry,
        { entries: () => worlds } as any,
        { entries: () => [] } as any
      )
    );

    return {
      gameDifficultyRegistry,
      worlds,
      year: new GameYear(new Turn(), ruleRegistry),
    };
  };

  it('are worked out again for a second game at another level', (): void => {
    const { gameDifficultyRegistry, worlds, year } = setUp();

    worlds.push({ width: () => 50, height: () => 80 });
    gameDifficultyRegistry.set(Chieftain);
    expect(year.value(252)).equal(1010);

    // The next game, at Deity, on the same map size.
    gameDifficultyRegistry.set(Deity);
    expect(year.value(252)).equal(yearOf(252, 3));

    // And back: each is kept under its own calendar.
    gameDifficultyRegistry.set(Chieftain);
    expect(year.value(252)).equal(1010);
  });

  it('are worked out again once the world exists, when its size changes the calendar', (): void => {
    const { gameDifficultyRegistry, worlds, year } = setUp();

    gameDifficultyRegistry.set(Prince);
    // No world yet: Prince on a normal map.
    expect(year.value(102)).equal(10);

    // A small map moves Prince to calendar 2 (King's).
    worlds.push({ width: () => 40, height: () => 50 });
    expect(year.value(102)).equal(20);
  });

  it('do not reuse a year from before the world even when the calendar is the same', (): void => {
    const { gameDifficultyRegistry, worlds, year } = setUp();

    gameDifficultyRegistry.set(King);
    expect(year.value(102)).equal(20);

    worlds.push({ width: () => 50, height: () => 80 });
    expect(year.value(102)).equal(20);
  });
});
