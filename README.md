# Whiskerlight

A small fantasy gamebook: a kid in pyjamas goes through the garden hedge on a Hollow
Night to find Mochi, their missing black cat, and discovers the Hollowwood — a moss troll
with a toll, a crow market that trades in names, a tea witch, something voiceless in the
thorns, and the Court of the Ninefold Hearth, where all lost cats are eventually filed.

Simple choices, a 2d6 + stat dice system, items, and five endings.

## Play

It is a static site. Open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

then visit <http://localhost:8000>.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Entry point: title screen, game screen, menu |
| `css/style.css` | Styling, mobile layout, animations |
| `js/story.js` | All story data (passages, choices, dice checks, effects) |
| `js/engine.js` | Renderer and rules: stats, items, flags, dice, saving |
| `notes.md` | Build log |

## Rules

- **Courage 🔥 / Cunning 🦊 / Kindness 💛** start at 3, **Health ❤️** at 5.
- Checks roll **2d6 + stat vs a DC** (usually 7–9). Double sixes can unlock a bonus
  outcome; double ones always fail. Failing branches the story sideways rather than
  ending it.
- Items and story flags unlock extra choices, so different routes exist on replay.
- Progress saves to `localStorage` on this device; the menu (☰) can restart the night.

## Mobile

Single column, large tap targets, sticky stat bar, safe-area padding for notched phones,
a bottom-sheet menu, and reduced-motion support. On desktop, keys `1`–`9` pick choices.
