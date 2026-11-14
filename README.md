# civ2-game-year

Civilization II's calendars, as a `core-game-year` `Year` rule (OpenCiv2 `src/auto/game.cpp` `game_turn_to_year`).

There are four calendars (`data/calendar`, the table in civ2.exe). The game uses the level less 1, one fewer on a large
map and one more on a small one, kept to 0 to 3 (`lib/calendar`'s `calendarFor`):

| Calendar | Normal map | 2020 on turn |
|---|---|---|
| 0 | Chieftain, Warlord | 571 |
| 1 | Prince | 521 |
| 2 | King | 471 |
| 3 | Emperor, Deity | 421 |

Turn 1 is 4000 BC. Year 0 is given as AD 1. From the turn after the first spaceship launch, every turn is a year.

The rule reads the level (`civ2-difficulty`), the map's size (from the players' worlds, `civ2-rules`' `mapSize`) and the
spaceships each time a year is worked out. A game with no level plays at King, and one with no world yet on a normal
map.
