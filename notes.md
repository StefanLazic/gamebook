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
