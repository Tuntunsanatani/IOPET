# IOPET design rules (v1, 3.12.0)

This file is the source of truth for how IOPET looks, reads and moves. Every screen follows it,
whoever changes the code (any Claude chat, any person). If a change breaks a rule, change the rule
here first, with the reason.

It was written after studying 75 Brilliant screens and 4 screen recordings (Nov 2026) and
measuring IOPET's own 77 screens. Brilliant is the reference for quality, not a design to copy.

## 1. Principles

1. **One screen, one job.** Each screen has one main action. It is the only big coloured button,
   full width, at the bottom, in the thumb's reach.
2. **Colour = meaning, shade = state, motion = feedback.** A hue appears only where it means
   something. Brightness and weight show state (current, done, locked). Things move only when
   something changed because of the student.
3. **Fewer words.** No instructions for things every app does ("tap Check"). One bold line and at
   most one grey line per moment. Icons replace words where the icon is universal (flag = report,
   ↻ = again, ✕ = close).
4. **Numbers carry the moment.** XP, streak and score are shown big, with a small CAPS label
   above them.
5. **Honest and calm.** No fake urgency, no fake numbers, and a mistake is never punished in
   words. "Not quite", never "Wrong!".

## 2. Colour roles (tokens in `index.html`, `:root` and `[data-theme="light"]`)

| Role | Token | Dark | Light | Used for |
|---|---|---|---|---|
| Brand action / current / progress / selected | `--primary`, `--cta` | `#FF9F0A` | `#D96C00` text, `#FF9F0A` fill | main button, current item, progress bars, selected option ring |
| Reward | `--gold` | `#FFD84D` | `#8A5A00` (fill `#FFC400`) | XP, streak (lit), badges |
| Correct / done | `--good` | `#2FD39A` | `#0B9468` | right answer, passed, "done" ticks |
| Wrong / destructive | `--wrong` | `#FF453A` | `#D92D20` | wrong answer, delete, errors |
| Everything else | neutral greys | `--ink` `--ink2` `--ink3` on `--surface*` | | |

- Text in three levels only: `--ink` (main), `--ink2` (secondary), `--ink3` (hint, locked).
  Coloured text is only for links (`--primary-ink`) and the meanings above.
- Glyphs on a coloured fill use dark ink `#141414`, never white (contrast).
- The selection colour (orange ring) is never the correctness colour (green/red).
- Gradients are not used, except the splash light.
- Contrast: normal text ≥ 4.5 : 1, large text and icons ≥ 3 : 1, in both themes.

## 3. Type (Noto Sans, Latin + Devanagari, 400 / 600 / 700)

| Token | Size | Use |
|---|---|---|
| `--fs-cap` | 11 | small CAPS labels only, letter-spacing .8–1.4 px, weight 700 (MADE IN INDIA, chips, eyebrows) |
| `--fs-xs` | 13 | meta lines, hints, footnotes |
| `--fs-sm` | 14 | secondary text, chips, small links |
| `--fs-md` | 15 | body text, explanations |
| `--fs-lg` | 17 | buttons, options, list titles, nav labels |
| `--fs-xl` | 20 | question text, card titles, result titles |
| `--fs-2xl` | 24 | screen titles, big stat values |
| `--fs-3xl` | 28 | hero titles (summary, chapter) |

- No other sizes. Icons keep their own sizes. Text inputs stay at 16 px (iPhones zoom in below that).
- Weights: 700 for titles, values and buttons; 600 for labels and options; 400 for body.
- Case: buttons and titles in sentence case ("Continue with Google"); small labels in CAPS.
- Hindi lines get line-height ≥ 1.5.

## 4. Space, shape, depth

- Page side padding 24 px (20 on sign-in). The gap between blocks is 16 px, and 24 px between groups.
- Radius: 14 (fields), 18 (`--r-md`, options, rows), 24 (`--r-lg`, cards, panels, sheets), pill for buttons.
- Depth comes from a 3–5 px darker bottom lip on pressable things (buttons, path panels). Pressing
  sinks it (translateY 3 px, lip 1 px). There are no drop shadows in dark.
- Touch targets are ≥ 44 × 44 px.

## 5. Buttons (the ladder)

| Kind | Look | Examples |
|---|---|---|
| Primary | orange pill, dark text, lip | Start, Check, Next set, Create account |
| Result (after an answer) | green pill after right, neutral pill after wrong (light grey in dark, near-black in light) | Continue, See results |
| Secondary | outlined pill | Skip, Review answers, Quit |
| Inactive | grey fill, grey text, still tappable: a tap shows what is missing | Check before a choice, Sign in before valid input |
| Text link | `--ink2` or `--primary-ink`, no underline unless inside a sentence | Forgot password? |
| Icon button | 40–44 px circle | ✕ close, ‹ back, flag (report) |

- At most one primary per screen. A secondary sits left of the primary (about 1/3 width) or below it.

## 6. Components

- **Bottom dock**: the main action area of a screen. It is anchored to the bottom (sticky), on the page colour.
- **Result panel** (quiz): slides up from the bottom and is tinted by the result (green-soft / red-soft /
  neutral). Row 1: icon + "Correct!" / "Not quite" / "Skipped" + "+10 XP" + flag. Row 2: the
  explanation (open after a wrong answer or a skip, behind "Why?" after a right one). Row 3: one
  result button.
- **Sheet**: for choices and short info over a page. It is dimmed behind, has a grab handle and rises 300 ms.
- **Card**: `--surface`, 1 px `--line`, radius 24. The current item gets an orange border and a deep orange
  tint. A done item gets a green tick, and its label stays at full ink. A locked item is dimmed with a lock.
- **Chips**: small CAPS labels, used for state only (TODAY'S PRACTICE, NEW).
- **Nav**: 4 tabs, outline icons, labels at `--fs-lg`. The active tab has its icon on a grey pill and a bold label.

## 7. Motion

| Token | Duration | Curve | Use |
|---|---|---|---|
| press | 100–120 ms | ease-out | button sink, card press |
| state | 150–220 ms | ease-out | colour/border changes, ticks, inactive → active |
| enter | 300 ms | `cubic-bezier(.05,.7,.1,1)` (emphasized decelerate) | sheets, result panel, field messages |
| page | 300 ms | same | screen to screen |
| celebrate | 600–1000 ms, once | | reward screens, count-up numbers |

- Only `transform` and `opacity` animate, except colour transitions on one element.
- Nothing loops forever except loading indicators.
- "Reduce animations" (in-app `.calm`) and the phone's reduce-motion turn movement off and keep fades.

## 8. Words (copy)

- Say what happened and what to do next, in as few words as possible: "Correct!", "Not quite",
  "Continue", "Try again", "Set complete".
- Don't explain gestures or obvious controls. Don't repeat the same line on one screen.
- Settings rows get a label only. A description is allowed only when the effect is not obvious,
  and then it is one short line.
- Numbers come before words: "12/12 right", "+120 XP", "70 days left".

## 9. Process

- ES5 only in `index.html` (old phones). CI checks it.
- Change `CONFIG.VERSION` and `sw.js` `VERSION` together. CI checks that they match.
- Every UI change is screenshot before/after in dark and light, at 360 and 390 px, and goes to `main`
  through a PR.
