# Бркосјај (Whiskerlight)

A small fantasy gamebook: a kid in pyjamas goes through the garden hedge on a Hollow
Night to find Мими, their missing black cat, and discovers the Hollowwood — a moss troll
with a toll, a crow market that trades in names, a tea witch, something voiceless in the
thorns, and the Court of the Ninefold Hearth, where all lost cats are eventually filed.

Simple choices, a 2d6 + stat dice system, items, five endings — and a picture for every
passage.

The game text is fully in **Serbian Cyrillic (ћирилица)**, which is what younger children
learn to read first. A „Како се игра“ (how to play) button sits at the top of the title
screen and explains the dice, the rolls and how stats swing a success or a failure.

## Pictures and reading pace

Every passage has its own illustration, drawn as an SVG scene by `js/art.js` at runtime —
no image files, no network. The picture fades in first, then the story is revealed **word
by word**; the choices appear once the passage has finished. Tapping the picture, tapping
the text, the „Додирни за цео текст ⏩“ button, or Space/Enter/1–9 shows everything at once,
and `prefers-reduced-motion` skips the animation entirely.

Characters are drawn from a fixed cast with fixed palettes, so a character looks the same
in every scene they appear in: Мими is always the same dark cat with one white sock, green
eyes and a teal collar, Земичка is always the cream kitten, the crows always wear the same
red waistcoat. The art is deliberately soft and anime-ish — round faces, big eyes, blush —
and nothing in it is scary.

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
| `js/art.js` | Scene illustrations: character cast, backgrounds, passage → scene map |
| `js/engine.js` | Renderer and rules: stats, items, flags, dice, saving |
| `notes.md` | Build log |

## Rules

- **Храброст 🔥 / Лукавост 🦊 / Доброта 💛** start at 3, **Здравље ❤️** at 5.
- Checks roll **2d6 + stat vs a DC** (usually 7–9). Double sixes can unlock a bonus
  outcome; double ones always fail. Failing branches the story sideways rather than
  ending it.
- Items and story flags unlock extra choices, so different routes exist on replay.
- Progress saves to `localStorage` on this device; the menu (☰) can restart the night.

## Mobile

Single column, large tap targets, sticky (wrapping) stat bar, safe-area padding for notched
phones, a bottom-sheet menu, a scrollable how-to-play sheet, a fluid 8:5 picture frame and
reduced-motion support. On desktop, keys `1`–`9` pick choices, Space/Enter finishes the
text reveal and `Esc` closes sheets.
