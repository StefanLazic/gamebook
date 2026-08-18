# Први дан петог разреда (First Day of Fifth Grade)

A small gamebook for children: an eleven-year-old starts **fifth grade** in a Belgrade
primary school. Until yesterday there was one teacher; from today there are five
teachers, five classrooms and a timetable that looks like a crossword. The goal of the
day is simple and terrifying — get through five lessons **without a single bad grade**.

The morning (packing the backpack, burek in foil, stickers from the kiosk), the ride to
school (bus 41 or the shortcut through the park, where a ginger school cat named Мими
walks you to the gate), the schoolyard, and then maths, Serbian, English, biology and
PE, with the long break in between. Simple choices, a 2d6 + stat dice system, grades and
items in the backpack, five endings — and a picture for every passage.

The game text is fully in **Serbian Cyrillic (ћирилица)**, in short paragraphs (two to
four sentences), which is what younger children read most comfortably. A „Како се игра“
(how to play) button sits at the top of the title screen and explains the dice, the
rolls and how stats swing a success or a failure.

## Pictures and reading pace

Every passage has its own illustration, drawn as an SVG scene by `js/art.js` at runtime —
no image files, no network. The picture fades in first, then the story is revealed **word
by word**; the choices appear once the passage has finished. Tapping the picture, tapping
the text, the „Додирни за цео текст ⏩“ button, or Space/Enter/1–9 shows everything at once,
and `prefers-reduced-motion` skips the animation entirely.

Everybody is drawn by one `person()` function with a fixed palette and fixed hair, so a
character looks the same in every scene: Лука is always the boy in the too-big green
hoodie, наставник Раша is always in the blue tracksuit with the whistle, Мими is always
the ginger cat with the white bib and green eyes. The art is deliberately soft and
anime-ish — round faces, big eyes, blush — and nothing in it is scary.

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
| `js/story.js` | All story data (passages, choices, dice checks, effects, endings) |
| `js/art.js` | Scene illustrations: character cast, backgrounds, passage → scene map |
| `js/engine.js` | Renderer and rules: stats, items, flags, dice, saving |
| `notes.md` | Build log |

## Rules

- **Знање 📘 / Смелост 🔥 / Другарство 🤝** start at 3, **Живци 😌** at 5.
- Checks roll **2d6 + stat vs a DC** (usually 6–9). Double sixes can unlock a bonus
  outcome; double ones always fail. Failing branches the story sideways rather than
  ending it — there is almost always a way to save the lesson.
- Lessons are chosen freely from the corridor (`hall`), which knows how many classes you
  have had and how many bad grades you are carrying.
- Grades live in the backpack next to the items: **⭐ is a good grade, 💢 a bad one.**
  The ending is picked from the grades, the friendships and the choices you made, so
  there are five different ways for the day to end.
- If Живци reach 0 you do not lose: you take a break with педагог Милица, drink a glass
  of water and go back to the corridor calmer.
- Progress saves to `localStorage` on this device; the menu (☰) can restart the day.

## Mobile

Single column, large tap targets (nothing under 44 px), sticky (wrapping) stat bar,
safe-area padding for notched phones, a bottom-sheet menu, a scrollable how-to-play
sheet, a fluid 8:5 picture frame and reduced-motion support. On desktop, keys `1`–`9`
pick choices, Space/Enter finishes the text reveal and `Esc` closes sheets.
