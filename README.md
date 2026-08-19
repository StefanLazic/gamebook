# Књига-игра (Serbian gamebooks for children)

Two illustrated gamebooks about a first day of school in Belgrade, fully in **Serbian
Cyrillic (ћирилица)**. You pick the story you want to play on the start screen; each one
keeps its own progress, its own stats and its own set of drawings.

## 🎒 Први дан петог разреда (First Day of Fifth Grade)

A small gamebook for children: an eleven-year-old starts **fifth grade** in a Belgrade
primary school. Until yesterday there was one teacher; from today there are five
teachers, five classrooms and a timetable that looks like a crossword. The goal of the
day is simple and terrifying — get through five lessons **without a single bad grade**.

The morning (packing the backpack, burek in foil, stickers from the kiosk), the ride to
school (bus 41 or the shortcut through the park, where a ginger school cat named Мими
walks you to the gate), the schoolyard, and then maths, Serbian, English, biology and
PE, with the long break in between. Simple choices, a 2d6 + stat dice system, grades and
items in the backpack, five endings — and a picture for every passage.

## 🎀 Први дан првог разреда (First Day of First Grade)

Ема is seven and starts **first grade** today. She wakes at 7:00, the bell rings at
8:00, and the whole of Belgrade stands in between: the duvet that steals twelve minutes,
the unicorn T-shirt at the bottom of the third drawer, the shortcut through the park,
a grandmother with two heavy bags, and a traffic light that is very much not a
suggestion. Then four lessons — maths, Serbian (letters А and М, plus paper balls flying
at the teacher), the world around us (Сава and Дунав) and art — with the long break in
the middle, where escaping through the hole in the fence never works, because домар Мија
has known about that hole for twenty years.

Two counters drive the day: **⏰ Минути** (sixty of them, and being late costs a minus)
and **💢 Минуси** — collect five and the day ends with a quiet talk in an empty classroom.
Six endings, none of them frightening: even the worst one ends at home with mint tea and
"let's leave ten minutes earlier tomorrow".

Story text in both books is in short paragraphs (two to four sentences), which is what
younger children read most comfortably. A „Како се игра“ (how to play) button sits at the
top of the title screen and explains the dice, the rolls and how stats swing a success or
a failure.

## Pictures and reading pace

Every passage has its own illustration, drawn as an SVG scene at runtime by `js/art.js`
(shared drawing kit and the fifth-grade cast) and `js/art-prvi.js` (the first-grade
cast: Ема, учитељица Јована, Вук, Тара, бака Даница, домар Мија, саобраћајац Раде) —
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
| `js/stories.js` | Tiny registry every story registers itself with |
| `js/story.js` | Story 1 data (passages, choices, dice checks, effects, endings) |
| `js/story-prvi.js` | Story 2 data: first grade, the sixty-minute morning, five minuses |
| `js/art.js` | Drawing kit, shared cast and backgrounds, art pack for story 1 |
| `js/art-prvi.js` | Art pack for story 2: new cast, bedroom, bathroom, crossing, classroom |
| `js/engine.js` | Renderer and rules: stats, items, flags, dice, saving, story picker |
| `notes.md` | Build log |

## Rules

Each story declares its own stats (`statDefs`) and its own safety rule (`guard`), and the
engine builds the stat bar and the redirects from that.

### Први дан петог разреда

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
### Први дан првог разреда

- **Слова 🔤 / Смелост 🔥 / Другарство 🤝** start at 3; **Минути ⏰** start at 60 and only
  ever go down; **Минуси 💢** and **Плусеви ⭐** count the day.
- Every step of the morning costs minutes. If they run out before the schoolyard, the
  bell rings without you — one minus, and the day carries on.
- Five minuses end the day early (`kraj_pet_minusa`), still gently. There are eight ways
  to earn one, from entering in trainers instead of slippers to throwing paper balls.
- Six endings, chosen from minuses, pluses and how many friends Ема made.

### Both

- Progress saves to `localStorage` per story on this device; the menu (☰) can restart the
  story or send you back to the story picker.

## Mobile

Single column, large tap targets (nothing under 44 px), sticky (wrapping) stat bar,
safe-area padding for notched phones, a bottom-sheet menu, a scrollable how-to-play
sheet, a fluid 8:5 picture frame and reduced-motion support. On desktop, keys `1`–`9`
pick choices, Space/Enter finishes the text reveal and `Esc` closes sheets.
