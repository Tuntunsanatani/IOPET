# IOPET design rules (v3, 3.23.0)

This file is the source of truth for how IOPET looks, reads and moves. Every screen follows it,
whoever changes the code (any Claude chat, any person). If a change breaks a rule, change the rule
here first, with the reason.

It was written after studying 75 Brilliant screens and 4 screen recordings (Nov 2026) and
measuring IOPET's own 77 screens. Brilliant is the reference for quality, not a design to copy.

v3 (3.21.0, the owner's master directive) adds the rulebook in numbers (§1b), the states every part
has (§1c), and the check that keeps the app on the system (§10). 3.22.0 puts the shared parts of every
page on it: buttons, fields, lines, the press, touch areas, times and curves. 3.23.0 puts every space
on the grid. §11 says what is next.

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

## 1b. The rulebook in numbers (3.21.0)

Measured on the app's 93 screens in both looks, then set. "Share" is how far a grey stands from its
ground on the way to full ink (in L*, the eye's scale): 0 % is the ground, 100 % is `--ink`.

**Text: three levels, and a grey that is never text.**

| Level | Token | Dark (on a card) | Light (on white) | Share | Used for |
|---|---|---|---|---|---|
| Primary | `--ink` | 14.9 : 1 | 18.4 : 1 | 100 % | what the screen is about: titles, values, answers, button words |
| Secondary | `--ink2` | 8.0 : 1 | 8.4 : 1 | 72–74 % | what explains it: one line under a title, labels, quiet links |
| Tertiary | `--ink3` | 5.2 : 1 | 5.4 : 1 | 57–59 % | hints, placeholders, small print, locked things |
| Marks only | `--ink-deco` | 2.5 : 1 | 2.5 : 1 | ~35 % | a sheet's handle, a divider dot. Never words |

- Tertiary cannot go lower: under 4.5 : 1 small words fail on a cheap screen in the sun. Hierarchy
  below that is made with size and weight, not with a fainter grey.
- The steps are the same in both looks (3.22.0): light's secondary was `#5E5E5E`, 6.5 : 1, one small
  step above tertiary (5.4), so the two levels read as one. It is `#4D4D4D` now: 18.4 / 8.4 / 5.4 beside
  dark's 14.9 / 8.0 / 5.2.
- One level per piece of text. Bold is for the primary level and for buttons; secondary and tertiary
  text is regular or semibold, never bold and grey at once (a bold grey line competes with the title).

**Lines: three kinds. A line gets brighter only when the thing does more.**

| Kind | For | Token | Width | Dark | Light | Share |
|---|---|---|---|---|---|---|
| A, a box that holds things | cards, panels, rows of a list, stat blocks | `--line` | 1 px (`--bw`) | 1.2 : 1 | 1.3 : 1 | ~10 % |
| B, a control with its own fill | pills that act, steppers, round icon buttons (1 px); what can be chosen: options, course rows, subject tiles (1.5 px) | `--line-2` | 1 or 1.5 px | 1.5 : 1 | 1.7 : 1 | ~20 % |
| B, a control that is only a line | every text field, every second button, a button not ready, a checkbox | `--outline` | 1.5 px (`--bw-ctl`) | 3.1 : 1 | 3.5 : 1 | ~40 % |
| C, in use | the field with the cursor in it | `--outline-on` + a 1 px ring (`--ring`) | 2.5 px in all | 6.4 : 1 | 6.5 : 1 | ~65 % |
| C, said by the student | the chosen answer of a question | `--ink` + a 2 px ring | 3.5 px | 14.9 : 1 | 18.4 : 1 | 100 % |

- Why a control that is only a line is brighter than the directive's 20–30 %: it has no fill, so the
  line is all there is to see, and under 3 : 1 a field cannot be found (WCAG 1.4.11).
- Why focus is not ink: a white outline shouts. 6.4 : 1 with one more pixel is twice the line at rest
  and reads as "here" at once. Its colour also says the state: green when right, muted red when wrong.
- Why the chosen answer keeps ink: it is what the student said, the main thing on that screen before
  Check. It is the one line in the app that is as strong as text.
- State colours replace the grey, never add to it: right `--good`, wrong `--field-bad` (a quieter red
  than `--wrong`), current or on `--primary`.
- No glow anywhere. A shadow only in light, and only under a card or an option (`--shadow-1`, `--shadow-2`);
  no button has one (3.22.0: the second button, the round buttons and the course pill had).

**Sizes.**

| Token | Value | For |
|---|---|---|
| `--h-ctl` | 56 px | a button or a field |
| `--h-row` | 48 px | a line of words to tap (guest, "Skip for now") |
| `--tap` | 44 px | the least a finger needs; a smaller drawing gets an unseen area up to it |
| `--ic` / `--ic-sm` / `--ic-xs` | 24 / 20 / 16 px | an icon; inside a control; inside a chip |
| `--fs-in` | 16 px | what is typed (smaller makes iPhones zoom in) |

**Space, by what it separates** (all on the 4 pt grid; §4).

| Token | Value | Between |
|---|---|---|
| `--sp-icon` | 8 px | a mark and its words |
| `--sp-in` | 16 px | words and the edge of their control or sheet |
| `--sp-rel` | 8 px | things of one group: field and field, button and button |
| `--sp-grp` | 16 px | one group and the next (the ways in, the consent, the foot) |
| `--sp-sec` | 24 px | one section and the next; a sheet's handle and what is under it |

- Things that belong together stand closer than things that do not. If two gaps look alike, the
  parts read as one group.
- The same steps on every page (3.23.0; they were 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 22, 26, 30 px here
  and there):

| Between | Space |
|---|---|
| a small mark and its words inside a chip or a pill | 4 |
| an icon and its words; a number and its label | 8 (4 under a big number) |
| a picture tile (44–54 px) and its title | 12 |
| rows of one list (settings, menu); options of a question; a label and what it names | 8 |
| cards that stand alone (topic rows, course rows, stat boxes, badges, a pack) | 12 |
| words and the edge of their row or card | 16 at the sides, 12 above and below (16 in a card that holds a block) |
| one group and the next | 16 |
| one section and the next; the big card's inside (hero) | 24 |
| a page's opening picture and what follows; the end of a page | 32 |
- Type does not grow or shrink with the screen: the eight sizes are the same on every phone, and
  the layout gives way instead (the brand above the sign-in sheet gets smaller, a short phone hides
  a page's mark, a title drops one step at 370 px and under). The phone's own font-size setting is
  not followed yet (see §11, open points).

## 1c. The states of a part (3.21.0)

Every part that can be touched has these, in both looks, from tokens only:

| State | Button to press | Second button (a line) | Field | Option of a question | Checkbox / switch |
|---|---|---|---|---|---|
| At rest | orange, on its 4 px edge | `--outline`, ink words | `--outline`, no fill | `--line-2`, card fill | `--outline` / grey track |
| In use (focus) | the phone's focus ring | the same | `--outline-on` + ring, inside `--ctl-on`, icon ink | the same ring | the same ring |
| Pressed | sinks 3 px onto its edge | 2 % smaller | (no press) | 2 % smaller | fills at once |
| Chosen / on | | | | ink line + ring, key filled | `--primary` fill, dark tick |
| Not ready, but answers | an outline (`--outline`), words `--ink3`: a tap shows what is missing (the forms) | | | | |
| Cannot be pressed | Check before a choice: a flat grey block (`--surface-3`) with words that can be read (`--ink-off`, 4.6–4.9 : 1) | dimmed to 50 % | | dimmed after the answer | |
| Waiting | the page's "please wait" card over everything; the button does not spin | | | | |
| Right | green button after a right answer | | `--good` line, `--ok-tint` | filled green, ✓ | |
| Wrong | neutral button after a wrong answer | | `--field-bad` line, `--bad-tint`, one 4 px nudge | red line, ✕, never moved | `--field-bad` line when it is asked for |

- A press, by what the thing is (3.22.0: on every page). All in `--t-press`:
  - a thing on an edge sinks onto it: the orange, green and neutral buttons, a chapter panel, a review card;
  - a flat control or card gets 2 % smaller: second buttons, options, topic rows, course rows, badges;
  - a row inside a list, and a small round button, change their ground (`--surface-2`): nothing moves in a list;
  - words alone dim to 55 %.
  (The directive asked for "scale down" on every button; the orange one keeps its sink because it is the one thing
  with an edge, and shrinking it would shrink the edge too. Rows and options used to sink 2 px with no edge to
  sink onto.)
- Two things look alike only if they do alike. Sign in before its fields are right is an outline because a tap on it
  answers (it shows what is missing). Check before a choice cannot be pressed at all, so it stays a grey block:
  an outline there would look like Skip's twin and do nothing.

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
- **Light**: an off-white page (`--bg #F2F2F2`), white surfaces, charcoal ink, shadows soft and few (under cards only;
  no button has one). A control that is only a line (`--outline`) must show on the page and on a sheet: 3 : 1 on both
  (`#8A8A8A`; dark `#6B6B6B`). In use it goes to `--outline-on` (`#5E5E5E`; dark `#A0A0A0`), never to ink.
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
- 8 pt grid (3.15.0, sign-in first; 3.23.0: every page): every margin and padding is a multiple of 4, and of 8
  wherever it separates two parts (4 and 12 only inside a part or between small things).
  Fields 56 px high with 8 px between field rows; a form's message row 24 px; small links 40 px drawn, 48 px to touch.
  The scale: 4, 8, 12, 16, 24, 32, 48. 1 and 2 px are allowed as a nudge of the eye (an icon on its line, a title and
  the line under it). Anything else is counted by the check (§10). Eight lines stay off it on purpose: the logo's own
  lock-up, the figures inside questions (their wrapping belongs to the questions), and four that are half of a thing's
  own size (they centre it) or the 3 px a pressed panel gives back.
- Radius, one family: 12 (`--r-sm`, a small thing inside a control), 16 (`--r-btn`, every control: buttons and, since
  3.21.0, fields, which had 14), 18 (`--r-md`, options, rows, review cards), 24 (`--r-lg`, cards, panels, sheets),
  32 (`--r-xl`, the hero card), pill for chips, tags, handles and bars.
- Depth comes from a 3–5 px darker bottom lip on pressable things (buttons, path panels). Pressing
  sinks it (translateY 3 px, lip 1 px). There are no drop shadows in dark.
- Touch targets are ≥ 44 × 44 px (`--tap`). 3.22.0: the segment buttons (37), text links (40) and "Why?" (40) are 44 now.

## 5. Buttons (the ladder)

| Kind | Look | Examples |
|---|---|---|
| Primary | orange, 56 px, 16 px corners, dark text, a 4 px edge, full width where it is the screen's one action | Start, Check, Next set, Create account |
| Result / acknowledge | green button after right; neutral button (light grey in dark, near-black in light) after wrong and on reward moments | Continue, See results |
| Secondary | a line on what it stands on (`.btn-sec`, `.btn-line`: `--outline`, 56 px, ink words, semibold; 3.22.0: on every page, it was a filled white button with a shadow in some places), or a quiet text link under the primary | Continue with email, Skip, Cancel, Quit, Change exam and date, Sign out |
| Not ready (§1c) | forms: an outline that answers a tap. Check before a choice: a flat grey block, no edge (`--surface-3`, words `--ink-off`). Any other button that cannot be pressed: dimmed to 50 % | Sign in before valid input; Check before a choice; Back up now while it runs |
| Text link | `--ink2` or `--primary-ink`, no underline unless inside a sentence | Forgot password? |
| Icon button | 44 px circle, `--line-2`, no shadow | ✕ close, ‹ back, flag (report), − + |

- At most one primary per screen. A secondary sits left of the primary (about 1/3 width) or below it, 12 px from it
  (3.22.0: Skip and Check touched; a stronger rule had set the gap to 0 since 3.12.0).
- Every button is 56 px with its words in its middle (3.22.0: they were 53.5, 56 and 58). Small buttons inside a card
  (Share, the pay buttons) are 44.

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
    (`--outline`, 3:1 on the sheet and on the page in both looks). On a tap or Tab it pops out 1.5 % and back (250 ms,
    transform only). No pop for a wrong field, for the app's own focus when the sheet opens, or with reduce motion.
    Orange stays the button's.
  - 3.21.0 in use (the owner: no aggressive white outlines): the border goes to `--outline-on` with a 1 px ring of the
    same (2.5 px of line at 6.4 : 1; it was 3.5 px of ink), the inside one step lighter (`--ctl-on`: `#282828`, white
    in light), the icon in ink, fading in 180 ms (`--t-state`). Right and in use: the ring is green. Corners 16.
  - 3.21.0 the new password's strength line shows only once something is typed. Empty, it was a grey line under the
    field that said nothing.
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
  (full width, 44 px high) and it is the sheet's control (3.14.0):
  - 3.21.0 the line is a hint, not a headline: 36 × 4 px in `--ink-deco` (2.5 : 1 in both looks, as on the phone's own
    sheets; it was 40 × 5 at 3.5 : 1), and what is under it starts 24 px below it (it was 15). The same on every sheet.
  - 3.17.1: while the line is held it is 40 % wider, a little thicker (4 → 5 px) and one step brighter (`--ink3`),
    180 ms on the swift curve, with a 10 ms knock; it goes back when let go. Transform and colour only; nothing around
    it moves. (3.21.0: on every sheet, not only the sign-in one.)
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
  button. 3.21.0 the two are one family in both looks: the same size, corners and line; Google is the filled one (white,
  dark letters), email the same shape as a line on the page. No shadow (light had one under Google, and white behind
  email, so the two looked like different parts). Guest: words only, `--ink2`.
- **Consent** (3.21.0, the owner's directive 9.6; built, and off until there are Terms of Service: `CONFIG.TERMS`): a
  20 px box and the sentence "By continuing, you acknowledge that you have chosen to proceed and agree to our Terms of
  Service." between "Continue as guest" and the foot, 16 px from each. The box is empty at every visit; ticked it is
  filled like a switch that is on. Until it is ticked none of the three ways in goes on: a tap points at the box (muted
  red line, one nudge, "Tick the box to continue."). "Terms of Service" is the accent and opens the terms.
- **Confirm your email, Check your email, You're all set** (3.21.0): the same page as Create account. They were the last
  three pages in the older look (a centred card with a shadow, a "← Back" pill, a filled second button, orange links).
  A mark, the title, one line, the numbered steps, the small print, then the buttons in the thumb's reach. The back
  button is the round one on every page.
- **A message** (toast) comes at the top where the bottom of a page is its buttons: in a question, and on every sign-in
  page (3.21.0). It never lies over a button.
- **Card**: `--surface`, 1 px `--line`, radius 24. The current item gets an orange border and a deep orange
  tint. A done item gets a green tick, and its label stays at full ink. A locked item is dimmed with a lock.
- **Chips**: small CAPS labels, used for state only (TODAY'S PRACTICE, NEW).
- **Nav**: 4 tabs, outline icons, labels at `--fs-lg`. The active tab has its icon on a grey pill and a bold label.

## 7. Motion

| Token | Duration | Curve | Use |
|---|---|---|---|
| press (`--t-press`) | 120 ms | swift | a finger down: a button sinks, a flat control gets 2 % smaller, words dim |
| state (`--t-state`) | 180 ms | swift | one thing changes colour: focus, right, wrong, not ready → ready, a handle held |
| fade (`--t-fade`) | 200 ms | standard (`--ease-std`, `cubic-bezier(.4,0,.2,1)`) | a thing appears or goes in place: the dim behind a sheet, a message |
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
- `node .github/scripts/check.js --design` runs the checks that need no browser (ES5, versions, the design check of §10).

## 10. The system keeps itself (3.21.0)

A rule on paper is forgotten. So the check that runs on every pull request reads the style sheet and holds it to this
file (`.github/scripts/check.js`, part 2b):

- A token that is used must exist, and the light look may only redefine tokens of the dark look. (A mistyped
  `var(--name)` draws nothing and says nothing.)
- Whatever is written into a rule instead of coming from the system is **design debt**: a space off the 4 pt grid, a
  colour, a corner, a time or a curve that is not a token, a text size outside the scale. Every such line that exists
  today is listed in `.github/design-debt.txt` (3.21.0: 317 lines; 3.22.0: 235; 3.23.0: 68; the sign-in pages have
  none).
- A line that is not on the list fails the check. So the list can only get shorter, whoever changes the app.
- The splash, the celebrations, the sparks and the loading marks are moves made by hand (§7, "celebrate"): their times
  and curves are their own.
- A new rule: use a token, or a value of the scale. If something truly must be written out, add it with
  `node .github/scripts/check.js --write-debt` and say why in the pull request.

## 11. Where the system is, and what is next

The owner's directive names pages; these are IOPET's:

| Directive | IOPET screens | State |
|---|---|---|
| Login, email login, registration, reset | `login` (+ its sheet), `signup`, `forgot`, `sent`, `verify`, `welcome` | on the system (3.21.0) |
| Home | `home` | shared parts (3.22.0) and spaces (3.23.0) on the system |
| Courses | `course` (the chooser), `topics` (subjects and chapters), `chapter` | the same |
| Premium | `pack`, `redeem` (and the pack card on Topics) | the same (the other chat owns packs' content; the look is ours) |
| Profile | `profile`, `account`, `goals`, `achievements`, `progress` | the same |
| Assessment | `practice`, `paper`, `paperres`, `summary`, `review` | the same; the chosen option waits for the owner |
| Settings and the rest | `settings`, `notifications`, `help`, `privacy`, `admin`, every sheet, the "please wait" card | the same |

Done in 3.22.0, on every page: one button family (56 px, the second button a line), one field (the sign-in field in
the code box, the goal, the account sheets and the feedback box; the eye instead of the word "Show"), lines to their
kind, the press by kind, touch areas of 44 px, every time and curve from the tokens, secondary text of the light look.

Done in 3.23.0, on every page: every space on the 4 pt grid by what it separates (§1b): 167 lines of debt gone, 8 left
on purpose. Rows keep their height to within 2 px (a menu row 64 px, a topic row 80, a FAQ row at least 48); every
question has 0 to 8 px more room above the quiz dock on a small phone.

Next (each step a release, before/after in both looks, the 80-screen walk after each):

1. What is still written into rules: 23 colours (the switch's knob, the toast, the celebration, the streak moment),
   19 corners (bars, the nav's pill, small tiles), 16 text sizes (pictures and big numbers).
2. The quiz's chosen option against §1b, shown to the owner before it changes: it is the one place the owner named as
   the reference.
3. One header for the four tabs; squircle corners (both approved earlier, not built).
4. Each page against the owner's references (Home, Profile, the quiz), once they arrive.

Open points (the owner decides):

- The Terms of Service do not exist yet; the consent row waits for them. A child's tick is not a parent's consent:
  the privacy policy already asks under-18s to use the app with a parent's permission.
- The phone's own font-size setting is not followed (sizes are px). Following it means `rem` sizes and a pass over
  every fixed height.
- The reference pictures named in the directive (the approved login, the profile, the Brilliant quiz) did not arrive
  with it; the work so far follows its words.
