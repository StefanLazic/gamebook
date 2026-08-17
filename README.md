# Whiskerlight

A small fantasy gamebook: a kid in pyjamas goes through the garden hedge on a Hollow
Night to find Mimi, their missing black cat, and discovers the Hollowwood — a moss troll
with a toll, a crow market that trades in names, a tea witch, something voiceless in the
thorns, and the Court of the Ninefold Hearth, where all lost cats are eventually filed.

Simple choices, a 2d6 + stat dice system, items, and five endings.

The game text is fully in **Serbian** (Latin script) — the player base speaks Serbian. A
"Kako se igra" (how to play) button sits at the top of the title screen and explains the
dice, the rolls and how stats swing a success or a failure.

## Play

It is a static site. Open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

then visit <http://localhost:8000>.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Entry point: title screen, how-to-play sheet, game screen, menu |
| `css/style.css` | Styling, mobile layout, animations |
| `js/story.js` | All story data (passages, choices, dice checks, effects) |
| `js/engine.js` | Renderer and rules: stats, items, flags, dice, saving |
| `notes.md` | Build log |

## Rules

- **Hrabrost 🔥 / Lukavost 🦊 / Dobrota 💛** start at 3, **Zdravlje ❤️** at 5.
- Checks roll **2d6 + stat vs a DC** (usually 7–9). Double sixes can unlock a bonus
  outcome; double ones always fail. Failing branches the story sideways rather than
  ending it.
- Items and story flags unlock extra choices, so different routes exist on replay.
- Progress saves to `localStorage` on this device; the menu (☰) can restart the night.

## Mobile

Single column, large tap targets, sticky stat bar, safe-area padding for notched phones,
a bottom-sheet menu, a scrollable how-to-play sheet, and reduced-motion support. On
desktop, keys `1`–`9` pick choices and `Esc` closes sheets.
