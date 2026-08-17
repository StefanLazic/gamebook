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
