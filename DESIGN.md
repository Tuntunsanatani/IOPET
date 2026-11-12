# IOPET design rules (v2, 3.20.0)

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
4. **Numbers carry the moment.** XP, streak and score are shown big: the icon above, the number, and a short label
   under it (numbers come before words, §8).
5. **Honest and calm.** No fake urgency, no fake numbers, and a mistake is never punished in
   words. "Not quite", never "Wrong!".

## 2. Colour roles (tokens in `index.html`, `:root` and `[data-theme="light"]`)

| Role | Token | Dark | Light | Used for |
|---|---|---|---|---|
| Brand action / current / progress / selected | `--primary`, `--cta` | `#FF9F0A` | `#A35200` text, `#D96C00` lines, `#FF9F0A` button fill | main button, current item (e.g. the subject), progress bars, switches that are on, the "?" in a figure |
| Reward | `--gold` | `#FFD84D` | `#8A5A00` (fill `#FFC400`) | XP, streak (lit), badges |
| Correct / done | `--good` | `#2FD39A` | `#0B9468` | right answer, passed, "done" ticks |
| Wrong answer / error / destructive | `--wrong` (panel `--wrong-soft`) | `#FF453A` (panel `#2C1A1A`) | `#D92D20` (panel `#FDECEA`) | the wrong option, the result panel after a wrong answer, review marks, form errors, delete |
| Everything else | neutral greys | `--ink` `--ink2` `--ink3` on `--surface*` | | |

- Text in three levels only: `--ink` (main), `--ink2` (secondary), `--ink3` (hint, locked).
  Coloured text is only for links (`--primary-ink`) and the meanings above.
- Glyphs on a coloured fill use dark ink `#141414` (contrast). The one exception is the light theme's red, where the ✕ is
  white: 4.8 : 1, against 3.8 : 1 for dark ink. On the dark theme's red, dark ink stays (5.4 : 1).
- A chosen option (before Check) is a neutral ring: white in dark, black in light. It is never orange, because orange is
  the action (the Check button). The ✕ / ✓ marks carry the meaning for colour-blind students.
- A wrong answer sits on a burgundy panel in dark (`#2C1A1A`) and a soft pink one in light (`#FDECEA`), never on a brown
  or yellow tint. Amber was tried in 3.13.0 and dropped: it measured only ΔE 9.5 from the brand orange.
- The action orange stays `#FF9F0A`, the logo's flame. A suggested `#FFAB00` measured ΔE 2.9 from it, which is the same
  colour to the eye, and it sits closer to the reward gold.
- Gradients are not used, except the splash light and the skeleton's passing light.
- Contrast: normal text ≥ 4.5 : 1, large text and icons ≥ 3 : 1, in both themes.

## 2b. Two looks, one design (3.20.0)

Dark and light are the same design. Neither is made from the other by turning colours round.

- **Only tokens differ.** Every box, size, weight, space and every motion is the same in both looks. A rule of a
  component names tokens, never a colour; a colour that is right in one look only gets two token values, not a second
  rule. (Sign-in pages: checked, no colour is written into any of their rules.)
- **Light**: an off-white page (`--bg #F2F2F2`), white surfaces, charcoal ink, shadows soft and few. A control that is
  only a line (`--outline`) must show on the page and on a sheet: 3 : 1 on both (`#8A8A8A`; dark `#6B6B6B`).
- **Dark**: charcoal page, lighter charcoal surfaces, off-white ink, no shadows: a surface is lifted by its grey.
- **Orange** is not one value: the button's fill is `#FF9F0A` in both looks; orange words and thin marks are lighter on
  dark (`#FFB340`) and deeper on light (`#A35200`, `#D96C00`); the logo's flame is `--logo-flame`. Orange is for the
  brand, the button to press and links. An icon that only shows a state (the eye of "show password") is ink, not orange.
- **The dim behind the sign-in sheet** is `--scrim-soft`: 50 % black on dark, 40 % on light, so the brand stays readable
  above the sheet. It covers the whole page, top edge included.
- **Changing the look** (Settings, or the phone going from day to night):
  - It is set in one frame: nothing fades by itself while it changes, so no part is still on its way from the old
    colour (before 3.20.0 a field's border took 180 ms and a button 220 ms while the rest changed at once).
  - On a screen that is showing, the whole page then dissolves into the new look in 200 ms. With "Reduce animations" or
    the phone's reduce-motion it just changes.
  - What was typed, an open sheet and the cursor stay. A page with chapter pictures is drawn again, because they are
    drawn for one look.
- Tested: on ten sign-in screens and states every element has the same place, size, type and motion in both looks;
  after a change of look the page is, pixel for pixel, the page of a fresh start in that look.

## 3. Type ("IOPET Sans": English and numbers in Plus Jakarta Sans, Hindi in Noto Sans Devanagari)

- 3.14.0: Plus Jakarta Sans replaced Noto Sans for English. Noto's Latin comes from the Open Sans family, which half the web
  uses, so buttons read as "default". Plus Jakarta Sans is geometric, has a tall x-height and tabular figures. Its English
  is drawn one step heavier than the CSS weight asks (400 → its 500, 600 → 600, 700 → its 800): its own 400 is thin on a
  cheap screen in the sun, and its 700 looked light beside the Hindi. The Hindi stays Noto Sans Devanagari 400/600/700.
- All six files: 166 KB, OFL (see `OFL.txt`).

| Token | Size | Use |
|---|---|---|
| `--fs-cap` | 12 | small CAPS labels only, letter-spacing .8–1.4 px, weight 700 (MADE IN INDIA, chips, eyebrows); 11 until 3.14.0 |
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

- Page side padding 24 px (16 on the sign-in, registration and reset pages and in sheets). The gap between blocks is
  16 px, and 24 px between groups.
- 8 pt grid (3.15.0, sign-in first): every margin and padding is a multiple of 8 (4 only inside a small component).
  Fields 56 px high with 8 px between field rows; a form's message row 24 px; small links 40 px drawn, 48 px to touch.
- Radius: 14 (fields), 16 (`--r-btn`, every full-size button), 18 (`--r-md`, options, rows, review cards), 24 (`--r-lg`,
  cards, panels, sheets), pill only for small chips and tags.
- Depth comes from a 3–5 px darker bottom lip on pressable things (buttons, path panels). Pressing
  sinks it (translateY 3 px, lip 1 px). There are no drop shadows in dark.
- Touch targets are ≥ 44 × 44 px.

## 5. Buttons (the ladder)

| Kind | Look | Examples |
|---|---|---|
| Primary | orange, 16 px corners, dark text, lip, full width where it is the screen's one action | Start, Check, Next set, Create account |
| Result / acknowledge | green button after right; neutral button (light grey in dark, near-black in light) after wrong and on reward moments | Continue, See results |
| Secondary | outlined button, or a quiet text link under the primary | Skip (quiz dock), Review answers and Practice this again (summary), Quit |
| Inactive (sign-in forms since 3.19.0: an outline, see §6) | flat grey fill with a hairline, no lip, text ≥ 7 : 1 (dark `#C4C4C4` on `#2B2B2B`, light `#4A4A4A` on `#EFEFEF`); still tappable: a tap shows what is missing | Check before a choice, Sign in before valid input |
| Text link | `--ink2` or `--primary-ink`, no underline unless inside a sentence | Forgot password? |
| Icon button | 40–44 px circle | ✕ close, ‹ back, flag (report) |

- At most one primary per screen. A secondary sits left of the primary (about 1/3 width) or below it.

## 6. Components

- **Bottom dock**: the main action area of a screen. It is anchored to the bottom (sticky), on the page colour.
- **Result panel** (quiz): slides up from the bottom and is tinted by the result (green-soft after right,
  wrong-soft after wrong, grey after a skip). Row 1: icon + "Correct!" / "Not quite" / "Skipped" + "+10 XP" + flag. Row 2: the
  explanation (open after a wrong answer or a skip, behind "Why?" after a right one). Row 3: one
  result button.
- **Reward moment** (end of a set): the chapter art in a soft glow, one word (Perfect! / Well done! / Set complete),
  then three stat blocks with their icons: the share right (`83%`, with `10/12 RIGHT` under it), the time, and the XP
  (which counts up once from 0). No sentence of counts. What the set earned follows as small chips, then UP NEXT. The dock
  holds the next set alone at full width, with "Review answers" and "Practice this again" as quiet links under it. ✕ means
  later. On a short phone (height ≤ 700 px) the art and the gaps shrink so that UP NEXT shows above the dock.
- **Review answers**: a two-column grid of question cards. Each card shows its number, a mark (green ✓ / red ✕ / grey ›,
  repeated on the card's bottom lip) and the start of the question. If the set repeats one question line, the card shows
  the options instead. A tap opens a sheet with the whole question, your answer, the correct answer and the explanation;
  ‹ › go through the set and Done closes it. The counts (✓ 10 ✕ 1 › 1) sit on top.
- **Daily streak moment**: after the day's first set, full screen: the flame, the count, one line, this week's days
  (lit = practised, today bold), one grey line, a neutral Continue. It shows once a day, after the Mark celebration if
  there is one.
- **Form errors** (sign-in, registration, reset; 3.14.0): nothing moves and nothing shakes.
  - 3.19.0 a field has three states, told by its border and a faint tint, never by an icon (the green ticks are gone):
    grey = not yet right; green (`--good`, `--ok-tint`) = right; muted red (`--field-bad`, `--bad-tint`, quieter than
    the green) = left wrong or sent wrong, never while typing. The ring's width says which field is in use, its colour
    the state. A field that turns wrong gets one 4 px nudge sideways (260 ms, once, none with reduce motion) and, when
    it was left wrong, a 15 ms knock. The words stay in the message row. Sign-in forms only (see §7).
  - 3.19.0 the form's button, not ready: no fill, the field's outline (`--outline`), text `--ink3` (5:1). Ready (every
    field right): the orange button, as before. Grey = not ready, green = right, muted red = wrong, orange = go.
  - 3.18.0 a field is part of the surface it sits on: no fill of its own, a 1.5 px border that can be seen
    (`--outline`, 3:1 on the sheet and on the page in both looks). In use it answers like a chosen quiz option: ink border with the
    same 2 px neutral ring, the inside one step lighter (`--surface-2`), the icon in ink, fading in 180 ms on the swift
    curve; on a tap or Tab it pops out 1.5 % and back (250 ms, transform only). No pop for a wrong field, for the app's
    own focus when the sheet opens, or with reduce motion. Orange stays the button's.
  - 3.17.1 sign-in: "Forgot password?" sits right under the password field, right-aligned; the message row comes after it.
  - 3.15.0: the words are in ONE message row of the form, under its last field, always there (24 px, fixed height),
    so the fields can sit 8 px apart. It says what the first wrong field needs, in red (`--wrong-ink`), one line, never
    wrapping; with nothing wrong it is the new password's grey hint ("At least 8 characters", "Good", "Strong"), or
    empty. Every wrong field still turns into the panel, so the eye finds it.
  - The wrong field itself becomes the panel: `--wrong-soft` fill (burgundy in dark, pink in light) with a red border.
  - Email (3.15.0): `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, no `..`, no `.` or `-` at the start or end of
    the domain. That pattern lets `gmail.co` through (`.co` is a real domain), so a well-known mail service (gmail,
    yahoo, outlook, hotmail, rediffmail, icloud, live) must be written in full: `gmail.co`, `gmail.con` or `gmial.com`
    gets no tick, and the row offers "Did you mean …@gmail.com?", which one tap writes in. `yahoo.co.in` and the like
    are right.
  - A message about the whole form (wrong password, no internet, too many tries) floats 12 px above the form, in space
    that is already empty: above the sheet, or above the form of the page. It is the same panel as a wrong answer:
    `--wrong-soft`, a red ✕ circle and ink text. On a very short screen it may cover the title, never a field. It goes
    away at the next try or when the sheet closes.
  - A tap on the inactive button marks every wrong field and puts the cursor in the first one. The fields are
    `aria-invalid`, and the first one is described by the message row, so a screen reader hears both.
- **Sheet**: for choices and short info over a page. It is dimmed behind and rises 300 ms. Its grab line is a real strip
  (full width, 28–36 px high) and it is the sheet's control (3.14.0):
  - 3.17.1 (sign-in sheet): while the line is held it is 40 % wider and a little thicker (5 → 6 px), 180 ms on the swift
    curve, with a 10 ms knock; it goes back when let go. Transform only; nothing around it moves.
  - Drag it and the sheet follows the finger, and the page behind gets lighter.
  - Let go past a third of the sheet's height, or with a flick, and it goes down (140–280 ms). Any less and it settles back
    (260 ms, no bounce). Pulled up, it gives a little.
  - A tap on the strip, on the dimmed page, or Back also closes it.
  - The sign-in sheet has no title and no ✕: the title only repeated the Sign in button, and the line already says "pull
    me down".
  - The brand stays whole above the sign-in sheet (3.15.0). When the sheet opens, the logo, the name and the line move
    into the middle of the free space above it (and above a message on it), 16 px clear of each edge, and get smaller
    only if they must; with almost no room (a keyboard) they fade out. Transform only, on the sheet's 300 ms curve.
- **Sign-in foot** (3.20.0): MADE IN INDIA leads (CAPS, bold, `--ink2`); Privacy follows, quieter: a 14 px green shield
  and the word (CAPS, semibold, `--ink3`), with no frame round it (the hairline pill of 3.14.0 is gone). Both stay 12 px,
  the smallest size of the scale; the touch area of Privacy is 48 px high.
- **Ways to sign in** (3.20.0): one column. Each mark sits in the same 24 px box and each line of words starts at the
  same place, so the Google "G" and the envelope stand exactly under each other; the block is in the middle of the
  button. Google: white with dark letters in both looks (on a light page with a hairline and a soft shadow). Email: an
  outlined button (`--outline`), with nothing behind it on dark and white behind it on a light page. Guest: words only,
  `--ink2`.
- **Card**: `--surface`, 1 px `--line`, radius 24. The current item gets an orange border and a deep orange
  tint. A done item gets a green tick, and its label stays at full ink. A locked item is dimmed with a lock.
- **Chips**: small CAPS labels, used for state only (TODAY'S PRACTICE, NEW).
- **Nav**: 4 tabs, outline icons, labels at `--fs-lg`. The active tab has its icon on a grey pill and a bold label.

## 7. Motion

| Token | Duration | Curve | Use |
|---|---|---|---|
| press | 100–120 ms | ease-out | button sink, card press |
| state | 150–220 ms | ease-out | colour/border changes, ticks, inactive → active |
| pop (`--t-pop`, `--ease-pop`) | 250 ms | spring k 400, c 28, m 0.8: 1.9 % overshoot | a tapped option (out 3 % and back), the right answer's option |
| sheet (`--t-sheet`, `--ease-sheet`) | 280 ms | spring k 400, c 35.8, m 0.8: critically damped, no bounce | sheets (from 100 % below), the brand above the sign-in sheet, the progress bar |
| screen (`scr`) | 200 ms | swift (`--ease-swift`, `cubic-bezier(.25,1,.5,1)`) | a new screen comes in: from 35 % and 6 px below (never from 0, so a throttled WebView still shows it) |
| tab switch (`--t-out`, `--t-in`) | 120 ms out, then 150 ms in | out `linear` (`--ease-leave`), in swift | the four tabs of the bottom bar (below) |
| look change | 200 ms | `linear` | light ↔ dark on a screen that is showing: the whole page dissolves (see §2b) |
| celebrate | 600–1000 ms, once | | reward moments, count-up numbers; they never block the next tap |

- 3.16.0 springs: the curves are the real spring, drawn once at start as CSS `linear()` (20 points) by `applyEase()`, so
  the compositor plays them and no script runs per frame; an old browser keeps the cubic fallbacks in `:root`. The
  owner's first spring (320 / 22 / 0.8) overshoots 5 % and needs 300 ms to settle (at 250 ms it is still 4 % off, a
  visible jump), so small things use the tuned pop and sheets never bounce (5 % of a sheet is ~19 px).
- 3.17.0 **tab switch** (the owner's timeline), native View Transitions (`tabTo()`):
  - Only the page moves. The bottom bar is never redrawn (only its classes change) and shows the new tab at the tap; the
    ground, the bar, the top edge's fade and a message that is showing stay exactly as they are, live, in every frame.
  - The old page leaves in 120 ms (fades out, sinks 10 px); then the new page comes in 150 ms (fades in, rises 10 px into
    place). Transform and opacity only, on the compositor.
  - No frame is empty or half-drawn: the browser shows a still picture of the old page while the new one is built, so a
    slow phone waits on the old page (measured: the move starts 32–60 ms after the tap; 83–130 ms on a 6× slower CPU).
  - Why the leaving page is `linear`: on the swift curve it is 84 % gone in 50 ms and the screen stands empty for ~80 ms
    (five frames) before the next page, a blink. Linear keeps that gap to one frame and still answers in the first frame.
  - Each tab keeps its place (per profile): coming back to Topics opens it where it was left; a second tap on the tab goes
    to the top. Taps wait 300 ms, as on every screen.
  - Without View Transitions (older phones) the new page comes in like any screen (`scr`); with "Reduce animations" or the
    phone's reduce-motion it just appears.
  - On a tablet or a computer the phone has round corners; the moving pictures are clipped to them (`--phone-r`).
  - Tested frame by frame (20 frames per switch, both looks, phone and frame): the bar identical in every frame; the
    first frame is the old page and the last the new one; between them only the page colour; no other colour anywhere.
- Anything that answers a touch is done in 300 ms or less.
- Only `transform` and `opacity` animate, except colour transitions on one element.
- Nothing shakes, with one exception the owner asked for (3.19.0): a sign-in field that turns wrong is nudged 4 px once. A quiz answer never moves. A mistake is shown in place (colour, ✕, a few words), never by moving things (3.14.0: the sign-in
  field shake and the wrong-option shake were removed).
- Nothing loops forever except loading indicators (the spinner, the skeleton's light). 3.16.0: the locked chapter's lock
  no longer shines every 2 s; it shines once, in 300 ms, when tapped.
- "Reduce animations" (in-app `.calm`) and the phone's reduce-motion turn movement off and keep fades.

## 7b. Senses: sound and touch (3.16.0, the owner's Phase 3)

Every moment goes through one table, `SENSE`, and one call, `sense('…')`, so a moment changes in one place.

| Moment | Sound | Haptic |
|---|---|---|
| select: an option chosen, a tab, a menu chip | none | 10 ms knock |
| correct: Check, right | G5-B5-D6 chime, rising, 55 ms apart (triangle) | `[16, 70, 28]` |
| wrong: Check, not quite | A3 then F#3, soft, 90 ms apart (sine, quieter) | one light 15 ms knock |
| complete: a set's summary appears | C5-E5-G5 | `[15, 30, 15]` |
| milestone: a Mark passed | the celebration's notes | timed with the celebration |
| refuse: a locked chapter, Sign in too early | none | `[28, 40, 28]` |
| fail: the network fails during a step the student started | none | one 60 ms pulse (never for a background sync) |
| confirm: a pack unlocked or given | none | `[16, 70, 28]` |

- Sounds are made by the app (Web Audio oscillators): 0 KB, offline, no delay. Only learning moments make a sound,
  never navigation.
- "Sound effects" and "Vibration" in Settings switch them off. Before sign-in the defaults (on) apply.
- iPhones have no vibration in the browser; a cheap phone's motor may not feel 10 ms (test on the phone).
- **Skeleton**: where content is on its way (a new phone's first backup; a pack's papers downloading), grey blocks in its
  shape (`--fill-2`) with one soft light passing every 1.2 s; still with reduce motion. Actions keep their own waiting
  state: a skeleton is never used for a button press.

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
