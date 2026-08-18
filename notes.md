# Notes — Whiskerlight

A working log for the gamebook build. Appended to with every commit.

## 2026-08-17 — Foundation

**Goal:** a small fantasy gamebook, playable from a static `index.html`, about a kid
searching for a missing cat. Simple choices + a dice/stat system. Mobile first.

**Concept:** *Whiskerlight*. A kid in pyjamas goes through the garden hedge on a
"Hollow Night" after their black cat Mochi. Behind the hedge is the Hollowwood: a moss
troll on a bridge, a market of crows in waistcoats, a tea witch, and the Court of the
Ninefold Hearth where all lost cats are "filed". The surprises: Mochi can talk, she is a
Warden of the wood, she was hiding a kitten, and something voiceless followed her through.

**Structure of the repo**
- `index.html` — the only entry point; title screen + game screen + menu sheet.
- `css/style.css` — dark storybook palette, all touch targets ≥ 44–52px, safe-area padding.
- `js/story.js` — pure data: passages, choices, effects, dice checks.
- `js/engine.js` — renderer + rules: stats, items, flags, 2d6 checks, localStorage saves.

**Rules design**
- Four stats: Courage 🔥, Cunning 🦊, Kindness 💛, Health ❤️ (start 3/3/3/5).
- Checks are `2d6 + stat vs DC` (DCs 7–9). Double sixes = a special crit branch where the
  story provides one; snake eyes always fails. Failure is never a dead end — it branches
  sideways and usually costs Health or an item, so the story keeps moving.
- Health hitting 0 routes to the `faint` ending rather than a game-over wall.
- Items and flags gate optional, better routes (Barnaby's Bell, Troll Token, Truth Shard…),
  so a second playthrough finds new doors.

**Story shape** — 73 nodes (about 35 full scenes plus short outcome/result nodes),
five acts, five endings (`end_home`, `end_stay`, `end_both`, `end_wild`, `faint`).

**Validation** — a random-walk simulation of 4000 playthroughs: no dead ends, no broken
passage links, every ending reachable.

**Mobile-friendliness** — single column, sticky HUD, large tap targets, `touch-action:
manipulation` to kill the 300ms delay, `env(safe-area-inset-*)` padding for notched
phones, bottom sheet menu, `prefers-reduced-motion` support.

## 2026-08-17 — Hardening pass

- Health can now drop below zero from any effect, not just a dice check, so `goto()` routes
  to the `faint` ending centrally instead of relying on the roll handler.
- Removed a dead branch in `goto()` and the leftover `to:` fields on dice-check choices
  (they are ignored by the engine — the roll's `success`/`fail`/`crit` decide the target).
- Added desktop keyboard shortcuts: keys `1`–`9` pick the numbered choice. Touch remains
  the primary input; nothing depends on hover.
- Tested by driving the real engine in jsdom: hundreds of clicks per run, several runs,
  zero console errors, no stuck screens.
- README rewritten with the premise, rules, file map and how to serve the static site.

## 2026-08-17 — Review follow-ups

- Dropped the redundant faint check in the dice handler; `goto()` is the single place that
  routes to the `faint` ending when Health reaches zero.
- Put the previously unused `hideWhenLocked: false` option to work: two item-gated choices
  (ringing Barnaby's Bell at the gate, and the Truth Shard during the hunt) now appear
  greyed out with a "needs …" tag instead of vanishing, so players can see the routes they
  missed and have a reason to replay.

## 2026-08-17 — Serbian localisation, Mimi, and a how-to-play screen

- **Mačka se sada zove Mimi.** Renamed the cat from Mochi to Mimi across the story, the
  README and these notes' future entries. The name appears in prose only, never as a key,
  so nothing in the engine had to change.
- **Everything the player reads is now in Serbian** (Latin script): the title screen,
  subtitle, buttons, HUD tooltips, menu sheet, dice captions ("Bacam 2k6 + Hrabrost (3)
  protiv 8", "Uspeh!", "Dve jedinice. Ma nemoj…"), locked-choice tags ("treba: …"), and the
  whole of `js/story.js` — every passage, choice and item name.
- Stat labels in `engine.js`: Courage → **Hrabrost**, Cunning → **Lukavost**, Kindness →
  **Dobrota**, Health → **Zdravlje**. These labels also feed the dice tags on choices
  (e.g. `Hrabrost 8+`), so the roll hints are localised for free.
- Item names are both display strings *and* identifiers (`needItem`, `itemBonus.item`,
  `lose`), so each one was translated consistently everywhere and re-checked with a link
  validator that walks every passage.
- Because item identifiers changed, the save key moved to `whiskerlight.save.sr.v2`; an old
  English save can't half-load into the Serbian story.
- **New: "❓ Kako se igra — kocke i osobine"** button, first thing on the title screen (and
  repeated in the in-game menu). It opens a bottom sheet explaining: 2k6 + osobina ≥ težina,
  what double sixes / double ones do, item bonuses, what each of the four stats is for, that
  failure branches the story instead of ending it, and the touch/keyboard controls.
- `index.html` remains the single static entry point loading `css/style.css`, `js/story.js`
  and `js/engine.js` — nothing else to build or serve.
- **Mobile:** the new sheet is capped at `88dvh` with contained scrolling and a sticky close
  button so it never traps the page behind it; the title-screen button keeps the 48px
  minimum tap target; `Esc` and tapping the backdrop close it.

### Validation of the translated story

- `node --check` on both JS files; a link validator walks all 73 passages and confirms every
  `to:` / `roll.success` / `roll.fail` / `roll.crit` target exists, every `needItem`,
  `itemBonus.item` and `lose` string is actually granted somewhere (item names double as
  identifiers, so a sloppy translation would silently break gates), and no passage is a dead
  end. Only `faint` is "unreachable" by links — by design, the engine routes there when
  Zdravlje hits 0.
- 200 random playthroughs driven through the real engine in jsdom: zero console errors, no
  stuck screens, and all five endings still reachable — *Udubljenje u jorganu*, *Stalni
  poziv*, *Dve mačke, jedna Čuvarka, bez objašnjenja*, *Šuma te zadrži još malo*, *Dete koje
  je ostalo do jutra*.

## 2026-08-18 — Ćirilica (Serbian Cyrillic)

- Younger readers learn **ћирилица** first, so every player-visible string was transliterated
  from Serbian Latin to Cyrillic: `js/story.js` (all 73 passages, choices and item names),
  `index.html` (title screen, how-to-play sheet, HUD tooltips, menu) and the engine's runtime
  strings (dice captions, "Успех!", "треба: …", "Даље", stat labels
  Храброст / Лукавост / Доброта / Здравље).
- Transliteration was done with a script rather than by hand so digraphs (`nj → њ`,
  `lj → љ`, `dž → џ`) are handled uniformly; the whole corpus was checked for false digraphs
  (e.g. *надживети*-type words) and there were none.
- Only prose was converted: passage ids, flags and stat keys stay ASCII, so the engine code
  is unchanged. Item names double as identifiers, so they were converted everywhere at once
  and re-verified by the link validator.
- The game title is now **Бркосјај** (was *Whiskerlight*).
- Save key moved to `whiskerlight.save.sr-cyr.v3` — a Latin-era save cannot half-load into
  the Cyrillic story, whose item identifiers differ.
- Validator: 73 passages, 17 items, every `to:` / roll target resolves, no dead ends, no
  Latin leftovers in player-visible text.

## 2026-08-18 — Слике за сваку сцену + текст реч по реч

**Pictures.** New `js/art.js` draws one illustration per passage as an SVG scene, in the
browser. No image files and no network calls, so the static site stays a three-file drop.

- *Consistent characters.* Every character is one drawing function with a fixed palette:
  Мими is always the same dark-violet cat with one white sock, mint-green anime eyes and a
  teal collar; Земичка is always the small cream kitten; the queen is the white cat with the
  gold crown; the crows always wear the same red waistcoat; Брамблвика always has teal hair
  and a cup. Because scenes only name characters (`['kid', 'mimi']`), the same character can
  never come out as a different-looking animal in another passage.
- *Anime-ish, never scary.* Big round eyes with two highlights, blush, round smiles, soft
  round bodies. The troll is a smiling mossy dumpling; the Тихо-створ is a soft lilac cloud
  with sleepy eyes, no teeth and no claws.
- *Backgrounds* per location (porch, shed, village door, hedge, forest, brook, bridge,
  mushroom ring, crow market, tea hut, thornway, hollow tree, court gate, court, three trial
  rooms, bedroom, dawn, moss) with six sky palettes. Random details (stars, sparks, ash) come
  from a seeded RNG keyed to the passage id, so a passage always looks identical on revisit.
- All 73 passages are mapped; a check script asserts scene coverage in both directions.
- Each `<svg>` carries `role="img"` and a Serbian `aria-label` describing the scene.

**Reading.** The picture appears first (a 0.5s fade/zoom), then the words arrive one by one
(65 ms apart, blur-to-sharp), and only when the passage has finished do the choices appear.
Impatient readers can tap the picture, tap the text, tap the „Додирни за цео текст ⏩“ button
or press Space/Enter/1–9 to show everything at once. `prefers-reduced-motion` shows the whole
passage immediately.

**Mobile.** The scene is a fluid 8:5 box (with a padding-box fallback for browsers without
`aspect-ratio`), the skip button is a full-width 44px target, and the HUD now wraps so nothing
overflows at 320px. Checked at 320 / 390 / 834 px: no horizontal scrolling, no console errors,
choices stay ≥ 52px tall.

## 2026-08-18 — Art polish pass

Reviewed every rendered scene and fixed what read badly:

- A soft warm light pool now sits behind each character, so Мими's dark fur and the kid's
  blue pyjamas stay readable on the night backgrounds.
- The moon is placed by the passage seed inside a safe band per background, so scenes that
  share a location no longer look like the same drawing twice.
- The troll is drawn smaller than the child's eyeline — friendly, not looming.
- A reaching child now raises both arms (it read as lopsided), and there is a `kidBell`
  pose holding Барнабијево звонце for the three passages where the bell is rung.
- The Тихо-створ is lighter, more translucent, with a wider smile and rosier cheeks; it is
  also drawn smaller, and it no longer stands between the reader and the child.
- The trnoviti пут got brighter thorns, fireflies and a moonlit path through the middle, so
  the darkest scene in the book still shows a way out.

## 2026-08-18 — Validation and docs

- Fixed one bad `rect()` call in the thornway background (options object landed in the `rx`
  slot and Chromium logged an SVG attribute error).
- 25 randomised playthroughs driven through the real page in headless Chromium at 390×780:
  64 passages visited, four endings reached (`end_home`, `end_stay`, `end_wild`, `end_both`;
  `faint` only triggers when Здравље hits 0), every passage rendered an `<svg>` scene, zero
  console errors.
- Layout asserted at 320 / 390 / 834 px: no horizontal scrolling, choices ≥ 52 px tall,
  the scene box keeps its 8:5 ratio, choices stay hidden until the text has been read in.
- „Како се игра“ gained a „🖼️ Слике и текст“ section explaining the picture-then-words pace
  and how to skip it; README updated for the Cyrillic script, the art module and the new
  controls.

## 2026-08-18 — Review follow-ups

- `startReveal` no longer calls `finishReveal` on a queue it has not adopted yet; the new
  queue is assigned first, so the reduced-motion / empty-passage path really does show the
  whole passage.
- The promised "picture first" beat is now real: the words start 550 ms after the passage is
  built (matching the scene fade), instead of the first word slipping in after 10 ms. The
  pending delay is cleared when the reader skips or navigates away.
- Dropped an identity `translate(0,0)` from the cat drawing helper.
