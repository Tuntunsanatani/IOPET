# IOPET design rules (v3, 3.47.0)

This file is the source of truth for how IOPET looks, reads and moves. Every screen follows it,
whoever changes the code (any Claude chat, any person). If a change breaks a rule, change the rule
here first, with the reason.

It was written after studying 75 Brilliant screens and 4 screen recordings (Nov 2026) and
measuring IOPET's own 77 screens. Brilliant is the reference for quality, not a design to copy.

v3 (3.21.0, the owner's master directive) adds the rulebook in numbers (§1b), the states every part
has (§1c), and the check that keeps the app on the system (§10). 3.22.0 puts the shared parts of every
page on it: buttons, fields, lines, the press, touch areas, times and curves. 3.23.0 puts every space
on the grid. §11 says what is next.

## 0. FINAL: what the owner has locked (read this first)

The owner (18 Nov 2026): a change the owner has tested and marked **FINAL** is part of IOPET's identity for life.
It is never changed again: not by any chat, not by any person, not as a side effect of another change, unless the
owner asks for exactly that change. If it changes by mistake, it is put back as it was locked. More broadly, the
identity written in this file is followed strictly in every update, and nothing new is added to the look on one's
own initiative: an update does what was asked and nothing more.

Each entry below is checked on every pull request by `.github/scripts/check.js` (step 2d, "FINAL holds"). To change
one (only when the owner asks for it), change the app, this table and the FINAL list in `check.js` together, and say so
in the pull request. `CLAUDE.md` (read by every Claude chat on this repo) points here.

| # | What is locked | The values | Since | Status |
|---|---|---|---|---|
| 1 | The words on every action button (`.btn` and all that build on it: primary, neutral, Check, Continue, Start; the secondary line buttons; Skip; Sign in `.au-go`; Sign out): one weight lighter than they were and a little space between the letters, so a word on a button is read at a glance | `--fw-btn: 600` (they drew in the 800 face before), `--ls-btn: .03em`; no rule on a button sets another weight or spacing | 3.33.1 | **FINAL** (the owner, 18 Nov 2026) |
| 2 | Skip never calls louder than Check: its word is the ink at 75 % | `--ink-skip`: `rgba(242,242,242,.75)` dark, `rgba(20,20,20,.75)` light, on `.q-skip` (9.5:1 and 8.2:1). It was `--ink2` in 3.33.1; the owner chose 75 % out of 60 / 75 / 80 / 85 % in 3.33.3 | 3.33.1, 75 % in 3.33.3 | **FINAL** (the owner, 18 Nov 2026) |
| 3 | The words on every action button at 88 % of their colour (Skip apart, which has its own 75 %; a button that cannot be pressed keeps the not-ready look) | `--btn-ink: 88%`, one rule: `-webkit-text-fill-color: color-mix(in srgb, currentColor var(--btn-ink), transparent)` on `.btn:not([disabled]):not(.q-skip)`, `.au-go:not(.off)`, `.sign-out`; no other button rule sets a text fill. Sign in 7.3:1, Continue 7.1:1, Check 9.8:1 light / 11.0:1 dark. A browser without `color-mix` keeps the words whole. The owner chose 88 % in 3.33.3 | 3.33.3 | **FINAL** (the owner, 18 Nov 2026) |
| 4 | The set's dots in practice (§12.17), in place of the bar and its count | One dot a question: the first answer right is `--win`. The green grows out of the dot (`::after` scale .15 → 1.08 → 1, `--t-dot` 460 ms, `--ease-dot` `cubic-bezier(.2,1.55,.36,1)`, from `--q-ans`; transform and opacity only). Wrong or skipped is `--ink3`, at once, no motion. The open question is `--line-2` in a ring of `--fill`, 3 px out, 2 px wide. Not reached is `--fill`. Dots are 12 px with 8 px gaps, smaller to fit; a too-long set gets thin pieces. The row is centred in a 44 px, 1fr, 44 px grid | 3.34.0, 3.34.2 | **FINAL** (the owner, 18 Nov 2026) |
| 5 | The practice X | 30 px drawn (line 1.75 px), `--ink-x` #A3A3A3 light, #5C5C5C dark, 12 px higher and 12 px further left than the dots' line; the place to tap 44 px | 3.34.2 | **FINAL** (the owner, 18 Nov 2026) |
| 6 | The question's words, in a set, a game, a paper and Review (`.q-text`, `.rv-q`): not bold, so Hindi's joined letters stay open and the question's own bold words stand out (§3) | `--fw-q: 450` (it was 700; 600 in 3.38.0, 400 in 3.38.2; the owner chose 450). Its Hindi is its own file, `noto-hi-450.woff2`: the 450 of the same Noto Sans 2.015 the other Hindi files are cut from, in its `@font-face` (the Devanagari range), cached by `sw.js`, waited for by the splash. The English, numbers and spaces in it use the 400 face's file (`pjs-500.woff2`), given again at 450 (3.39.0: until then they were drawn in the phone's own font, a bug); its bold words 700. No rule on `.q-text` / `.rv-q` sets another weight; every weight has both an English and a Hindi face | 3.38.3 | **FINAL** (the owner, 19 Nov 2026) |
| 7 | The right option's mark (`.qz .opt-btn.correct .opt-mk`): a white ✓ on the deeper green circle; black on the green was harsh (the owner) | `background:var(--right-lip);color:var(--on-right)`; `--on-right` `#FFFFFF` (one value, both looks); `--right-lip` `#18B348` light, `#1C9E42` dark (2.8 : 1 and 3.5 : 1); the circle 24 px, the ✓ 14 px at stroke 3.2 | 3.41.0, 3.42.0 | **FINAL** (the owner, 20 Nov 2026) |
| 8 | The right answer's green (§2): Brilliant's green one step brighter, on the sheet, Continue (white words), the right option and a game's right answer, the XP | light: `--right` `#2DE060`, `--right-lip` `#18B348`, `--right-sheet` `#CFF8DB`, `--right-ink` `#0E7C3A`; dark: `#2FEB64`, `#1C9E42`, `#0E4520`, `#6CF294`; `--on-right` `#FFFFFF`; the rules `.qz .q-result.ok`, `.qz .qr-go.ok` (and `:active`), `.qz .opt-btn.correct`, `.gm .ok`, `.qz .fb-xp` as they are | 3.42.0 | **FINAL** (the owner, 20 Nov 2026) |

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
| A0, a panel's own edge (3.30.0, Brilliant's) | every card, panel, notice, chip, stat block | `--edge` + `--edge-in` | 2.33 px (7 px at 3x) | `#2C2C2C` on `#141414` | `#E5E5E5` on white | the panel is the page's colour |
| A, a line inside or between | the rules of a list or table, the path joining chapters or Marks | `--line` | 1 px (`--bw`), 2 px for a path | 1.2 : 1 | 1.3 : 1 | ~10 % |
| B, a control with its own fill | pills that act, steppers, round icon buttons (1 px); what can be chosen: options, course rows, subject tiles (1.5 px) | `--line-2` | 1 or 1.5 px | 1.5 : 1 | 1.7 : 1 | ~20 % |
| B, a control that is only a line | every text field, every second button, a button not ready, a checkbox | `--outline` | 1.5 px (`--bw-ctl`) | 3.1 : 1 | 3.5 : 1 | ~40 % |
| C, in use | the field with the cursor in it | `--outline-on` + a 1 px ring (`--ring`) | 2.5 px in all | 6.4 : 1 | 6.5 : 1 | ~65 % |
| C, said by the student | the chosen answer of a question | `--ink2` + a 1.5 px ring (`--bw-ctl`) on `--ctl-on` | 3 px | 8.0 : 1 | 8.4 : 1 | ~55 % |

- Why a control that is only a line is brighter than the directive's 20–30 %: it has no fill, so the
  line is all there is to see, and under 3 : 1 a field cannot be found (WCAG 1.4.11).
- Why focus is not ink: a white outline shouts. 6.4 : 1 with one more pixel is twice the line at rest
  and reads as "here" at once. Its colour also says the state: green when right, muted red when wrong.
- Why the chosen answer is grey, not ink (the owner chose C, 14 Nov 2026): it is what the student said, so it must be the
  strongest frame on the page (8 : 1, more than any field in use), but its words must read before its frame: an ink ring
  as strong as the text made the frame louder than the answer. The letter key stays ink-filled, so "chosen" is still
  told by more than a line.
- State colours replace the grey, never add to it: right `--good`, wrong `--field-bad` (a quieter red
  than `--wrong`), current or on `--primary`.
- No glow anywhere. No shadow on a page in either look (3.29.0: `--shadow-1` and `--shadow-2` are `none` on light
  too; a panel is its colour and its faint line, §12.13); no button has one (3.22.0: the second button, the round
  buttons and the course pill had).

**Sizes.**

| Token | Value | For |
|---|---|---|
| `--h-ctl` | 56 px | a field |
| `--h-btn` | 48 px | a button, every kind (3.40.1, Brilliant's; §5b) |
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
  answers (it shows what is missing). Check before a choice cannot be pressed at all, so it lies flat and faint
  (3.32.0, Brilliant's: `--off`, words `--ink-off`, no line, no edge; WCAG exempts inactive controls from contrast;
  3.32.1, the owner: about 25 % fainter than Brilliant's, and on every button that cannot be pressed, of any kind:
  light `#F5F5F5` / `#D2D2D2` (1.4 : 1), dark `#1A1A1A` / `#3C3C3C` (1.6 : 1); the block 23-25 % and the words 28-29 %
  closer to the page in L*), and
  rises when there is a choice.

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
- A chosen option (before Check) is the flame: its border and `--done-bg` tint (3.32.0, the owner's word; 3.24.0 had a grey
  ring because orange was Check's, and Check is the neutral ink now). The ✕ / ✓ marks carry the meaning for colour-blind
  students.
- A wrong answer is shown on the option (its red border and ✕); the sheet under it is neutral grey (3.32.0, as Brilliant's
  "Incorrect"), never red or amber. Amber was tried in 3.13.0 and dropped: it measured only ΔE 9.5 from the brand orange.
- A right answer's sheet is the one vivid moment of a set (3.32.0, measured on Brilliant: light `#D3F5DD` with a
  `#29CC57` button, dark `#0D3A1B` with `#2DCC5A`).
- **3.41.0, the leaf, and back (3.42.0).** The owner found the green dull and sent a photo of a young leaf in the sun
  (measured `#CFE916`, a lime). 3.41.0 put it on the sheet, Continue and the right option. On the phone it looked dull
  in its turn (an olive sheet in the dark look, white words washed out on the lime), so 3.42.0 went back to Brilliant's
  green, one step brighter, the owner's way (the shade the research favours):
  - the same hue (137°) and saturation as 3.40's, more light: brighter colours are felt as more pleasant and more
    saturated ones as more exciting (Valdez and Mehrabian 1994, people's own ratings), so a brighter shade that keeps its
    saturation keeps both; a pastel one (tried, `#59EB82`) loses the excitement;
  - light: the sheet `--right-sheet` `#CFF8DB`, Continue `--right` `#2DE060` on `--right-lip` `#18B348`, "+10 XP"
    `--right-ink` `#0E7C3A` (4.6 : 1);
  - dark: the sheet `#0E4520`, Continue `#2FEB64` on `#1C9E42`, the XP `#6CF294` (7.8 : 1);
  - the right option and a game's right answer in the same family (the owner, 3.41.0: one colour from the answer to
    the sheet): fill `--right-sheet`, border `--right`;
  - its ✓ white on `--right-lip` (§0 7, FINAL);
  - Continue's words white (`--on-right`, the owner, 3.40.0): 1.8 : 1 light, 1.6 : 1 dark (brighter green, fainter
    white: the price of the brighter shade, chosen knowingly; Brilliant's own is 2.6 : 1);
  - the set's dots keep `--win` (§0 4, FINAL), the 3.40 green.
  - What is learned: a brighter green and white words pull against each other; and a colour is judged on the phone, not
    on a screenshot. Which green moves students most is measured on students (how fast they tap Continue, how many sets
    they finish), not chosen in advance.
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
- 3.38.3: one more Hindi file, `noto-hi-450.woff2`, for the question's words (`--fw-q`). It is the 450 instance of the
  very font the other three come from (Google's Noto Sans 2.015, its Devanagari part): drawn at 400 and 600 from that same
  source, it matches IOPET's own two files pixel for pixel, so the 450 is the same design, one quarter of the way to 600.
  A 450 asked of the old three would have drawn 400. The splash waits for it with the others, so a question never shows
  in a stand-in font.
- 3.44.0 (the owner chose T3, 20 Nov 2026): the CSS weight 700 is drawn in Plus Jakarta Sans' own Bold (`pjs-700.woff2`,
  Fontsource 5.3.0 like the others), not its ExtraBold: the titles in the 800 face read as bold-and-cheap ("chunky"). The 800
  face stays for 800–900 (the celebration title, figures). The practice pages (`.page.practice`: a set, a game, a paper)
  keep the drawing they had through `'IOPET Q'`, the same files under another name with 700 → the 800 face, because the
  question and its bold words are FINAL (§0 6–8). The Hindi files are unchanged.
- All eight files: 223 KB, OFL (see `OFL.txt`).

| Token | Size | Spacing (3.44.0) | Use |
|---|---|---|---|
| `--fs-cap` | 12 | `--ls-cap` .1em | small CAPS labels only, weight 700 (MADE IN INDIA, chips, eyebrows); 11 until 3.14.0 |
| `--fs-xs` | 13 | `--ls-xs` +.025em | meta lines, hints, footnotes, small counts |
| `--fs-sm` | 14 | `--ls-sm` +.02em | secondary text, text that is read (FAQ answers, Privacy, Terms: line 1.6), small links |
| `--fs-md` | 15 | `--ls-md` +.015em | body text, menu rows, an FAQ question |
| `--fs-lg` | 17 | `--ls-lg` +.01em | buttons, options, card and list titles, nav labels |
| `--fs-xl` | 20 | `--ls-xl` 0 | question text, section titles, Hindi chapter names, result titles |
| `--fs-2xl` | 24 | `--ls-2xl` −.015em | screen titles, big stat values |
| `--fs-3xl` | 28 | `--ls-3xl` −.018em | hero titles (Progress, summary, chapter) |
| `--fs-doc` | 36 | 0 (Roboto Slab) | a document's large line only (3.47.0, the owner) |

- **Spacing by size (3.44.0, the owner: "the smaller the text, the more room between its letters").** Every rule that sets
  a size sets the spacing of that size with it (`font-size:var(--fs-sm);letter-spacing:var(--ls-sm)`); CAPS labels take
  `--ls-cap`, a CAPS line of 14–17 px .05em. Not the words on action buttons (`--ls-btn`, FINAL 1), not the practice pages
  (FINAL 6–8), not drawings (`svg`). The values are Material 3's curve (12 px +.033em, 14 px +.018em, 57 px −.004em) and
  Brilliant's own text measured in IOPET's font (its reading text ≈ 15.5 px at +.014em, its bold list titles +.01–.02em,
  its small CAPS +.11em). Hindi: Chrome keeps the headline (shirorekha) of a word joined with the spacing (tested); very
  old phones were not tested.
- **A document is read, not boxed (3.45.0, the owner, after Brilliant's About page).** Privacy and Terms (`docPage`): no
  cards and no borders; a large line on top (28 px), each part a 24 px heading and short paragraphs at 17 px in the ink,
  line 1.6, 56 px between parts. Boxing text that is read to fit more in less room makes it harder to read (the owner).
  Tap groups (menus, settings, the FAQ list) keep their edge. Illustrations and a hand-drawn mark come later; the mark must
  look drawn by a student with a marker, not a perfect shape.
- **3.46.0 (the owner):** a document's name is its title and its date the line under it; the large line ("Your data stays
  yours.") is the door into the text: centred, just above the first part, 84 px from it, 112 px below the date. The large
  line and the part headings are in **Roboto Slab 500** (`rs-500.woff2`, Fontsource 5.3.0, Apache-2.0,
  `LICENSE-Roboto-Slab.txt`), the voice of a document, as Brilliant's About page sets its headings in a serif; only there.
  The words of the text and every other screen stay in IOPET Sans.
- **Sign-in (3.46.0, the owner):** "By continuing, you agree to our Terms of Service and Privacy Policy." stands above the
  ways in, centred, so it is read first; the tick box is gone (it was one more step; pressing a way in after the line is
  the agreement). 3.47.0 (the owner): "Continue with email" is dressed like "Continue with Google" (white, its envelope
  beside the words); the owner will come back to this page. The ways in breathe, grouped by what they are (the owner: they
  read as one crowded box): the line, 40 px, the two buttons 12 px apart, 16 px, the guest way, 24 px, the foot; the group
  rises into the empty middle and the brand stays centred in what is left (fits a 320 x 568 phone).
- **3.47.0 (the owner):** the large line is "Your data / stays safe." on two lines, 36 px (`--fs-doc`, the one size above the
  scale, for a document's large line only: the owner asked for 25 % more). Under a heading, 20 px before its first paragraph
  (room to breathe). **The hand mark:** the owner drew a loop with a tick round a word on a screenshot; it is traced from his
  own stroke (potrace), so its wobble, its open start and its tick are his (`HAND_MARK`). The loop is fitted round the word
  with the air his had; the tick keeps its shape and its place on the loop's corner; the flame's orange (`--logo-flame`),
  bright on dark. One mark on a page, on the one word that matters ("safe").
- **Fewer words (3.45.0):** 46 lines across the app say the same in 36 % fewer letters: one idea a sentence, the point first,
  nothing the screen already shows, no technical names outside the Privacy policy (Morkes & Nielsen 1997: concise text
  alone, 58 % more usable). Sign-in: "By continuing, you agree to our Terms of Service and Privacy Policy."
- **Lines that break well (3.44.0):** titles, card titles and short descriptions use `text-wrap:balance` (no lone word on a
  second line: "Class 7 to / 12" was); a range such as (A–Z) never splits at its dash (`escName`: a word joiner after the
  dash). Phones without `text-wrap` simply wrap as before.

- No other sizes. Icons keep their own sizes. Text inputs stay at 16 px (iPhones zoom in below that).
- Weights (3.44.0): 700 for titles of 20 px and more and for big values; 600 for every word or number of 17 px and less that stands out (card titles, labels, counts, an FAQ question; the owner: the card titles were "chunky"); 600 for the words on buttons (`--fw-btn`, with `--ls-btn` .03em between the letters: §0, 3.33.1); 400 for body. CAPS labels keep 700.
- **A question is read, not glanced at (3.38.0; 400 in 3.38.2; 450 in 3.38.3, FINAL, the owner, 19 Nov 2026: §0 6).** Its
  words (`.q-text` in a set and a paper, `.rv-q` in Review) are `--fw-q` 450: a little fuller than the regular 400, far
  lighter than 600; they were 700. The English and the numbers in it stay on the 400 face (Plus Jakarta Sans 500).
  - **Why:** Hindi joins letters (क्ष, ष्क, द्या, ह्न) and hangs marks above and below the line. At 700 their small
    openings fill in and the letters run together. At 400 every opening stays clear, and the question's own bold words
    (कथन:, निष्कर्ष:) stand out at 700.
  - **Its place above the options** comes from where it sits, its size (20 px, the options 17 px) and the room around it
    (§12.17), not from weight.
  - **Why not 600 (3.38.0):** IOPET's Noto Sans Devanagari 600 file is drawn almost as heavy as its 700, so 3.38.0
    changed almost nothing that could be seen. The comparison that chose it was wrong: its 600, 550 and 500 samples were
    taken before those fonts had loaded, so they showed the phone's own fallback font. Checked again with each file
    loaded on its own: 700 and 600 nearly the same, 400 clearly lighter.
  - **The lesson:** before a picture of a new weight, wait for that face itself (`document.fonts.load('600 20px "IOPET
    Sans"', 'क')`), not for `document.fonts.ready`, which was already settled.
  - **Research:** type designers and India's UX4G guide keep bold for short headings and use regular or medium for text
    that is read. The peer-reviewed evidence for Devanagari weight on screens is thin, so this is the practitioners' rule.
  - **Brilliant:** it sets short English prompts bold. Hindi is denser than English, so IOPET takes its own rule here.
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
- Depth comes from a 3–5 px darker bottom lip on pressable things (buttons). Pressing
  sinks it (translateY 3 px, lip 1 px). There are no drop shadows on a page, in either look (3.29.0, §12.13);
  only what floats over the page (a sheet, the busy card) casts one.
- Touch targets are ≥ 44 × 44 px (`--tap`). 3.22.0: the segment buttons (37), text links (40) and "Why?" (40) are 44 now.

## 5. Buttons (the ladder)

| Kind | Look | Examples |
|---|---|---|
| Primary | orange, 48 px, round ends (3.40.1), dark text, a 4 px edge, full width where it is the screen's one action | Start, Next set, Create account (3.32.0: Check is the neutral ink, §12.15) |
| Result / acknowledge | green button after right; neutral button (light grey in dark, near-black in light) after wrong and on reward moments | Continue, See results |
| Secondary | a line on what it stands on (`.btn-sec`, `.btn-line`: `--outline`, 48 px (3.40.1), ink words (Skip: `--ink-skip`, the ink at 75 %, §0), semibold; 3.22.0: on every page, it was a filled white button with a shadow in some places), or a quiet text link under the primary | Continue with email, Skip, Cancel, Quit, Change exam and date, Sign out |
| Not ready (§1c, §12.7) | one look for every primary button that cannot go on yet (3.24.0): a flat grey block (`--surface-3`), a faint `--line-2` line, `--ink-off` words, no edge. A sign-in button in that state still answers a tap (it says what is missing). A second button that cannot be pressed: dimmed to 50 % | Sign in before valid input; Check before a choice; Back up now while it runs |
| Text link (§12.6) | `--ink2`, 15 px, semibold, 44 px to touch, no underline; inside a sentence it takes the sentence's size, bold. Orange (`--primary-ink`, `.link.acc`) only where it moves you between accounts (3.24.0: it was on Cancel, Close and Copy too) | Forgot password?, Continue as guest, Review answers; orange: Create account, Sign in, I already have an account |
| Icon button | 44 px circle, `--line-2`, no shadow | ✕ close, ‹ back, flag (report), − + |

- At most one primary per screen. In a pair the way back stands left and the way forward right (§12.2: Skip | Check,
  Keep going | Quit, Cancel | Delete); the orange goes to the one the app recommends. In a dock the minor one takes about 1/3;
  in a dialog both halves are equal. Stacked: the primary on top, the second under it, text actions last, 12 px from it
  (3.22.0: Skip and Check touched; a stronger rule had set the gap to 0 since 3.12.0).
- Every button is 48 px (`--h-btn`) with round ends and its words in its middle: 3.40.1, the owner, so that every
  button of the app is the question's (§5b), one family (3.22.0: 56 px with 16 px corners; before that 53.5, 56 and 58).
  Small buttons inside a card (Share, the pay buttons) are 44, round too. Fields stay 56 px with 16 px corners.
- A page's one docked button (`.sm-dock`: a chapter's Practice, a summary's Next set, Review's Done; a celebration's
  Continue) stands as Brilliant's does: 16 px from the sides, 20 px over the bottom.

## 5b. A question's bottom buttons: Brilliant 1:1 (3.40.0, the owner)

The owner (19 Nov 2026): the words on Skip, Check, Continue and Try again are short; a 56 px button for them is more than
a premium screen needs. Copy Brilliant, learn why, then make it our own.

**Brilliant, measured** on the owner's phone (360 x 790 css, 3x; the owner's screenshots and two screen recordings):

| | Brilliant | IOPET before | IOPET now |
|---|---|---|---|
| Height (the lip apart) | 48, a 4 px lip | 56 | **48** |
| Shape | round ends | 16 px corners | **round ends** (`--r-pill`) |
| Skip | 86 wide | 32 % (100) | **86** (12 px sides inside) |
| Skip to Check | 12 | 12 | 12 |
| Sides: Skip and Check | 20 | 24 | **20** |
| Sides: the sheet's Continue / Try again | 16 | 24 | **16** |
| The lip's foot over the bottom of the screen | 16 | 12 | **16** (the button 20) |
| Continue's words on the green | white | dark | **white** (3.40.0; `--on-right` since 3.42.0, 1.8 : 1 on the brighter green, §2) |

**Why Brilliant does it:**
- 48 is the comfortable touch target (Google's Material guidance 48 dp; Apple's 44 pt). A button no bigger than a finger
  needs keeps the eye on the question.
- Lifted 16 px off the bottom edge: the edge is the phone's own gesture zone (swipe up for Home), and taps there are the
  least sure (Hoober).
- Skip is small and Check takes the rest: the main action gets the room.
- Round ends make a button's edge look inset, so a 16 px Continue lines up with the 20 to 24 px of what is around it.

**What IOPET keeps of its own:**
- The words on the buttons stay as locked (§0 1 to 3: 600, .03em, 88 %). Brilliant's are a little smaller (about 15
  px); IOPET's stay 17.
- **The sheet** has a little more room than Brilliant's, because it holds more (the title, the XP, Why?, the flag, the
  button): 24 px above the title, 20 px between it and the button (Brilliant 16 / 16). The sheet is 156 px; the dock
  keeps 88 px above Skip / Check so the page does not move when it comes. On a phone 720 px tall or less, the 3.39 room
  (16 / 16, the dock 76) is kept, so a question with a figure still fits.
- **The flag** is not a first action: it is drawn in the X's quiet grey (`--ink-x`; Brilliant's is #9F9F9F).
- **The animation** was already Brilliant's: Check greys at once; about 120 ms later the sheet rises in about 250 ms
  (IOPET 280); Continue or Try again stands exactly where Check stood. The ghost Skip / Check the sheet slides over now
  stands exactly on the real ones at every width (on a 320 px phone it stood 8 px off since 3.32).
- **Contrast, the owner's choice**: white on the green is 2.1:1 (Brilliant's too), under the 3:1 asked of large words.
  (3.42.0: on the brighter green, 1.8 : 1 light, 1.6 : 1 dark, §2.)
- **3.40.1, the owner: every button of the app** in this family (the sign-in buttons, a chapter's Practice, the paper's
  Start, the sheets' pairs such as Keep going / Quit, Sign out): 48 px, round ends (§5). Brilliant does the same
  everywhere (measured: the lesson's last Continue 48 px, 16 px sides; Review with Koji / Skip review 48 px, 20 px sides).

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
- Two things shake, both asked for by the owner: a sign-in field that turns wrong is nudged 4 px once (3.19.0), and a
  wrong quiz option shakes once, 6 px and less, 360 ms, with two quick knocks of the motor (3.32.0). Nothing else moves to
  show a mistake (3.14.0).
- Nothing loops forever except loading indicators (the spinner, the skeleton's light). 3.16.0: the locked chapter's lock
  no longer shines every 2 s; it shines once, in 300 ms, when tapped.
- "Reduce animations" (in-app `.calm`) and the phone's reduce-motion turn movement off and keep fades.

## 7b. Senses: sound and touch (3.16.0, the owner's Phase 3)

Every moment goes through one table, `SENSE`, and one call, `sense('…')`, so a moment changes in one place.

| Moment | Sound | Haptic |
|---|---|---|
| select: an option chosen, a tab, a menu chip | none | 10 ms knock |
| correct: Check, right | the owner's sound (3.43.1, §7c): a sweet run over three soft pulses that grow | `[14, 126, 20, 120, 30]`: on the three pulses, each a little longer |
| wrong: Check, not quite | a soft, low double thud with no pitch (3.43.0), 12 dB under the right one | two quick knocks `[20, 50, 20]` |
| complete: a set's summary appears | C5-E5-G5 | `[15, 30, 15]` |
| milestone: a Mark passed | the celebration's notes | timed with the celebration |
| refuse: a locked chapter, Sign in too early | none | `[28, 40, 28]` |
| fail: the network fails during a step the student started | none | one 60 ms pulse (never for a background sync) |
| confirm: a pack unlocked or given | none | `[16, 70, 28]` |

- The right and the wrong sound are the owner's, kept inside the app as 16 kHz WAV (42 KB together, decoded once when a
  set opens). The others are made by the app (Web Audio oscillators). Only learning moments make a sound, never
  navigation.
- "Sound effects" and "Vibration" in Settings switch them off. Before sign-in the defaults (on) apply.
- iPhones have no vibration in the browser; a cheap phone's motor may not feel 10 ms (test on the phone).
- **Skeleton**: where content is on its way (a new phone's first backup; a pack's papers downloading), grey blocks in its
  shape (`--fill-2`) with one soft light passing every 1.2 s; still with reduce motion. Actions keep their own waiting
  state: a skeleton is never used for a button press.

### 7c. The right answer: its sound and its beats (3.43.0, the owner)

**What Brilliant does (measured on the owner's three screen recordings, 19 Nov 2026):**
- Right: one 0.41 s sound, the same every time: four or five wooden notes about 90 ms apart, peak -12 dBFS. Half its
  energy sits between 100 and 300 Hz: a warm body, not a bell.
- Wrong: no pitch at all, a soft "shh" of noise, 11 dB under the right one.
- No suspense: the sound starts within ~0.1 s of Check, with the green; the sheet rises in about 250 ms; Continue lights
  last.

**IOPET's (the owner chose it by ear, 20 Nov 2026, after three rounds):**
- Right (3.43.1): a sweet rising run, E4 G4 C5 E5 G5, 70 ms apart, that ends on a soft C major chord (the win), over
  three soft low pulses that grow: C2, E2, G2 at 0, 140 and 280 ms.
  - The run is the sound. Its notes are round: a soft octave for warmth, very little of a mallet's woody "clack".
  - The pulses are a feeling behind it: 8 dB under the run, a slow attack (no click, no hit), no saturation.
  - Each pulse is a little stronger and higher than the last, so the whole sound rises to its top note (-12 dB at the
    start, -7 dB at 280 ms). Nothing hums after it.
  - -13.5 LUFS, peak -1 dBFS, almost nothing above 3 kHz: full, never shrill.
  - Our own notes, in our own order and key: no recording of anyone else is used.
- 3.43.0 had two drum beats, "dham-dham", 6 dB louder than the run and loudest at the very start. On the phone the owner
  felt them as a blow, a punishment, as if a mistake had been made. A held low tone before that read as a horror "hmm".
  A reward must rise to its peak, not open with it.
- Wrong: a soft, low double thud with no pitch, 12 dB under the right one (Brilliant's idea, our own sound).
- Not taken:
  - thin bells: they ring like a warning and tire the ear (the owner);
  - a suspense lead-in before the reveal. It would have to play for wrong answers too, or it would give the answer
    away, and the owner found it was too much motion: tiring, not exciting.

**The beats** (T = the Check tap; a phone plays a sound about 60 ms late, so what is seen is set to land on what is
heard):

| T | heard | seen |
|---|---|---|
| 0-60 ms | the first pulse | the chosen card holds at 96 % for a moment |
| 60 ms (`--q-ans`) | pulse 1 | the card turns green and springs back (`--t-win` 420 ms, `--ease-win`); a ring of light leaves it (`--t-ring` 520 ms); the ✓ pops (`--q-mark`); the sheet starts to rise (`--q-sheet`) |
| 200 ms (`--q-title`) | pulse 2 | "Correct!" pops |
| 270 ms (`--q-xp`) | E5 | the XP pops and counts up (+0 to +10 in six steps) |
| 340 ms (`--q-go`) | G5, the chord, pulse 3: the peak | Continue lights; ten sparks fly from the ✓ (3.43.1: on the peak, where the sound is fullest) |

- Transform and opacity only. The sparks are one element (its shadows), the ring one more: nothing is added to the page.
- 3.43.0's page dip (4 px with the first drum) was taken out in 3.43.1: with the drum it read as a blow.
- With Reduce animations or a phone set to less motion, nothing moves: the colours change at once and the XP shows its
  number. Sound and Vibration have their own switches.
- A wrong answer keeps its calm: the soft thud, the shake, no ring, no sparks.
- The set's dots (§0 4, FINAL) are untouched: `--q-ans` stays 60 ms. 3.40's beats were Brilliant's (`--q-mark` 140,
  `--q-sheet` 220, `--q-go` 460, `--q-xp` 500 ms).
- What research says, and what it does not: dopamine neurons ramp up while a reward is uncertain (Fiorillo, Tobler and
  Schultz 2003, in monkeys; still debated). Feedback tied to success raises motivation; more feedback for its own sake
  lowered it (Kao et al. 2024). Rising pitch and major chords are felt as positive. Which sound moves students most is
  measured on students (how fast they tap Continue, how many sets they finish), not chosen in advance.

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
  today is listed in `.github/design-debt.txt` (3.21.0: 317 lines; 3.22.0: 235; 3.23.0: 68; 3.23.1: 43; the sign-in
  pages have none). What is left is there on purpose: the figures' four patches, the splash, the celebrations' light,
  the sizes of pictures and big numbers, a chart bar's shape, and the eight spaces of §4.
- A line that is not on the list fails the check. So the list can only get shorter, whoever changes the app.
- 3.24.0: CI also measures the geometry of the pages it opens, in both looks (the sign-in page, the four tabs, Account,
  Privacy, Terms, Notifications, Settings, Help, a chapter, a question before a choice): every button 48 px with round ends (3.40.1; it was
  56 px with 16 px corners; 44 for the small one in a card), every block 24 px from both sides, the top-left mark at 12,12
  (3.37.0), a header 16 px over its first block, the one not-ready look, docked buttons 20 px over the bottom (3.40.1; it was
  16) (§12). It was proved to
  fail: with the sign-in pages put back on 16 px sides, it stopped the build on both looks.
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
| Assessment | `practice`, `paper`, `paperres`, `summary`, `review` | the same; the chosen option is the owner's C (3.24.0) |
| Settings and the rest | `settings`, `notifications`, `help`, `privacy`, `admin`, every sheet, the "please wait" card | the same |

Done in 3.22.0, on every page: one button family (56 px, the second button a line), one field (the sign-in field in
the code box, the goal, the account sheets and the feedback box; the eye instead of the word "Show"), lines to their
kind, the press by kind, touch areas of 44 px, every time and curve from the tokens, secondary text of the light look.

Done in 3.23.0, on every page: every space on the 4 pt grid by what it separates (§1b): 167 lines of debt gone, 8 left
on purpose. Rows keep their height to within 2 px (a menu row 64 px, a topic row 80, a FAQ row at least 48); every
question has 0 to 8 px more room above the quiz dock on a small phone.

Done in 3.24.0 (the owner's Phase 15): the whole app measured, state by state, and the outliers brought onto one system
(§12): one not-ready look, one place for the top-left button, one place for a docked button, one text-link look, the
sign-in pages on the same 24 px sides, the rows of a section in one box, the steps of space between header, labels,
cards and sections. CI now measures that geometry on every push. The quiz's chosen option is the owner's C.

Next (each step a release, before/after in both looks, the walk after each):

1. One header for the four tabs (the owner's Zone 1: still while the tabs change): its contents need the owner's word.
2. Each page against the owner's Brilliant pictures (14 Nov 2026): Topics done in 3.26.0 (§12.10), the chapter page in
   3.27.0 (§12.11), Home in 3.28.0 (§12.12); next the You tab's stat cards.
3. Line icons onto three sizes (§12.9 L1); squircle corners (approved earlier, not built).
4. 3.29.0, the owner's UI/UX Phase 1: the icons and the panels (§12.13). Typography (Phase 1, priority 3) waits for
   the owner's word on these two.

(3.23.1: every bar, track, switch and the bar's pill take the pill corner, small tiles the small one; the switch's knob,
the message and the glyph on the red mark take their colours from tokens. Nothing looks different: 26 pictures of nine
pages are the same pixel for pixel in both looks.)

Open points (the owner decides):

- The Terms of Service are on (3.24.0, the owner's word "on kar do"): every line says only what the app does. The owner
  gave: IOPET Authority, handled by Tuntun Sanatani; refunds within 7 days of paying if the pack is unopened, within 24 hours of opening it otherwise (3.24.3); disputes in Patna, Bihar (3.24.1). Still wise: and a lawyer's
  reading. A child's tick is not a parent's consent: the terms and the privacy policy ask under-18s to use the app with
  a parent's permission.
- The phone's own font-size setting is not followed (sizes are px). Following it means `rem` sizes and a pass over
  every fixed height.
- The reference pictures arrived on 14 Nov 2026 (about 80 Brilliant screens; notes kept with the work). Brilliant is
  the benchmark, not a template: where the owner's directive says otherwise (the sign-in page: brand above the sheet,
  "Forgot password?" under the password field, "Create account" in orange) the directive wins.

## 12. Composition and consistency (3.24.0, the owner's Phase 15)

Made by measuring, not by looking: a script walks all 74 states of the app (every page, sheet, dialog, toast and moment),
in both looks, and records where each header, button, card, field, row, link and gap sits and how it is drawn. Every
rule below was checked against that record; §12.9 is what it found. CI measures the same geometry on the pages it opens
on every push (`check.js`, "each in the system"), so a page cannot drift off the system unnoticed.

### 12.1 The regions of a page

| Region | Rule |
|---|---|
| 1. The phone's own bar | the app's top 24 px fade out of the bar's colour (3.7.2) |
| 2. Header | sub-page: the Back (←, 44 px) at 12,12, the X's place (3.37.0, §12.18), the title (24 px bold) on its line beside it at x = 68. Tab: its title block at 24 (still uneven, §12.9 L2). A set, a paper or the summary: the X at 12,12 |
| 3. Content | every block 24 px from both sides, on every page, the sign-in sheet included |
| 4. The action | where its kind says (§12.2) |
| 5. Bottom bar or dock | the tab bar on the four tabs; a dock where the page's action is docked |
| 6. Bottom safe area | docks and the tab bar add `env(safe-area-inset-bottom)` |

### 12.2 Where the action goes: one place per kind of page

| Pattern | When | Where | Pages |
|---|---|---|---|
| A, docked | the page is there to do one thing next | pinned at the bottom, 16 px over the edge (+ safe area); a text action may sit under it | quiz (Skip, Check, the result's Continue), summary, review, a chapter (3.27.0), welcome, forgot, the Mark celebration, the streak moment |
| B, after the content | a short form or a short page | right under the last field or paragraph, full width | sign in, create account, redeem, pack, goals, confirm your email |
| C, in its card | the action belongs to one card | inside that card, at its foot | Home (Start), Progress (Practice), Account (Create account & back up), Share |
| D, dangerous | it deletes or resets | the last section ("Danger zone"), a red row, then a dialog in which the safe choice is the orange one | Delete account, Delete guest data, Reset progress |

- Pairs: the way back on the left, the way forward on the right (Skip | Check; Keep going | Quit; Cancel | Delete),
  as the phone's own dialogs do. Orange marks the choice the app recommends: forward in a flow, back in a warning. In a
  dock the minor action takes about a third; in a dialog both halves are equal (two real choices).
- Stacks: the primary on top, a second button 8 px under it, text actions last and centred.
- Measured before 3.24.0: the moments put Continue in the middle of the screen (225 and 195 px over the edge) while the
  welcome page docked it; Review docked "Done" 8 px over the edge, the quiz 16. Now every A sits 16 px over the edge.

### 12.3 The thumb

The bottom third is where the thumb rests, so every docked action (A) and the tab bar are there. Actions in a card (C)
sit in the first screenful of their tab, reached without a scroll. Nothing to press is closer than 16 px to the bottom
edge (the gesture bar). Every target is at least 44 px. A form's button (B) follows its last field, so the keyboard
never covers it.

### 12.4 Component geometry (measured, all pages)

| Component | Height | Corners | Line | Inside | Note |
|---|---|---|---|---|---|
| Button, every kind | 48 (3.40.1) | round ends | none, or 1.5 px `--outline` for a second button | 8 24 | the small button inside a card: 44 |
| Field | 56 | 16 | 1.5 px `--outline` | 0 16 | |
| Option of a question | 72 and up | 18 | 1.5 px `--line-2` | 12 8 (grid) / 12 16 | |
| Row (menu, switch, FAQ) | 64 (FAQ 48 and up) | the group's 24 | a hairline between rows | 12 16 | the rows of a section sit in ONE box (3.24.0) |
| Card | its content | 24 | 2.33 px `--edge` | 20 | |
| Topic row | 136 | 24 | 1 px, a 2 px foot | 24 | |
| Page header | 44 | | | | the Back (←) at 12,12, the X's place (3.37.0) |

Corners grow with the box: 16 for what you press, 18 for options and alerts, 24 for cards and groups.

### 12.5 Space (adds to §1b)

| Between | Space |
|---|---|
| a page's header and its first block (a subtitle line under the title stays with the title) | 16 |
| a section label and what it names | 8 |
| above a section label | 24 (16 right under the header) |
| cards that stand alone | 12 |
| the sections of a tab (Home, Progress, You) and of a chapter | 24 |
| rows of one section | none: one box, hairlines |

### 12.6 Text actions

One look: `--ink2`, 15 px, semibold, 44 px to touch, no underline. Inside a sentence it takes the sentence's size, bold.
Orange only where it moves you between accounts (Create account, Sign in, I already have an account) and for "Terms of
Service" in the consent sentence: the owner's rules for the sign-in page (directive 9.6, 10), carried to every page. Before 3.24.0 Cancel, Close, Copy, Done, Sign out and Practice more were
orange too, and links came in 14 and 15 px.

### 12.7 Not ready

One look for every primary button that cannot go on yet: flat `--surface-3`, a faint `--line-2` line, `--ink-off`
words, no edge. Measured before 3.24.0: the not-ready Sign in, Create account and Send reset link wore the outline of a
second button, the same picture as "Quit" in a dialog, while Check wore the grey block. A second button that cannot be
pressed is dimmed to 50 %.

### 12.8 Levels of importance (one logic, every page)

1. Primary: the page's title (28 px on a tab, 24 px beside the back button), the one orange button.
2. Secondary: card titles (17 px bold; a chapter on Topics 20 px, §12.10), the second button (a line), `--ink` words.
3. Tertiary: `--ink2` words, text actions, section labels (14 px semibold).
4. Decoration: `--ink-deco`, pictures, glows; never needed to understand the page.

### 12.9 The matrix: what the walk found (3.23.1) and what 3.24.0 did

| | Found | Done |
|---|---|---|
| Critical | none | |
| High H1 | the not-ready sign-in buttons looked like a second button | one not-ready look (§12.7) |
| High H2 | the moments' Continue: orange on one, neutral on the other, both in the middle of the screen | both neutral (as §5 says), both docked |
| High H3 | the top-left button at 16,16 (sign-up, forgot), 24,28 (course chooser), 24,16 (summary), 24,24 (all other pages) | 24,24 everywhere |
| High H4 | orange on Cancel, Close, Copy, Done, Sign out, Practice more | one text-link look (§12.6) |
| Medium M1 | the sign-in pages and sheet 16 px from the sides (358 px wide), every other page 24 (342) | 24 |
| Medium M2 | Review's Done 8 px over the edge, every other dock 16 | 16 |
| Medium M3 | header → first block 2 to 20 px; label → rows 8 or 12; 28 above a label; tab and chapter sections 20 | §12.5 |
| Medium M4 | Account, Settings, Notifications and Help drew each row as its own box; You drew a section as one box | one box per section |
| Low L1 | line icons in 7 sizes (14 to 22 px) where the tokens give 16 / 20 / 24 | written down; next |
| Low L2 | tab tops: Home 20 px, Progress 28 px, You 24 px, Topics none | next: one header for the four tabs |
| Low L3 | corners 16 / 18 / 24 | kept: they grow with the box |
| Consistent already | side margins 24 on every page; every button 56 px with 16 px corners; dialog pairs in the phone's order | kept, and now guarded by CI |

### 12.10 Topics: only the syllabus (3.26.0)

The owner's brief (15 Nov 2026): the page shows only the syllabus, with no frames, lines or extra colours, and every
word sits on its own level. Checked against Brilliant's Courses tab (14 pictures and 2 recordings the owner sent).

| Level | On Topics | Size / weight / colour |
|---|---|---|
| Display | the subject's name (मानसिक योग्यता) | 28 / 700 / `--ink` |
| Card title | a chapter's Hindi name | 20 / 700 / `--ink` |
| Subtitle | the subject's one sentence | 17 / 400 / `--ink3`, written to fit two lines from 320 to 412 px |
| Small title | the pack's name | 15 / 700 / `--ink` |
| Label | a chapter's English name (600); the pack's line (400) | 14 / `--ink3` |
| Caps | the exam above the subject (NMMS BIHAR) | 12 / 700 / `--ink3`, capitals |

The step from the subject (28) to a chapter (20) is 1.4x, so the subject leads and each chapter reads as one item of it.
The English name is a label above the Hindi one (bold and grey), not body text.

Cards: one height (120 px), a 72 px picture, no lip, no tint, no shadow; the pack card the same. 3.29.0: the faint
line every panel has (§12.13; the owner's later brief, one panel look on every page). Where a
chapter stands is told by its own bar (on the way) or by one mark in the top right corner: the green tick (passed), a
lock (waits for a free place), a clock (questions to come). The names keep clear of the mark.

Taken from Brilliant: the label above the title, one card height, the mark in the corner, the big step from the
subject to its chapters, the line joining the cards. Not taken: the frame and lip of each card (the owner: no frames),
the course colour behind the header (no extra colours), the pinned subject strip (one subject is open; pinning costs
about 120 px at every scroll, so it comes when the SAT subjects open), the "..." cut of a long sentence (ours is
written to fit).

### 12.11 A chapter: like a course in Brilliant (3.27.0)

From the owner's two recordings of a Brilliant course (14 Nov 2026): a big picture, the name, one sentence, the steps
as points on one line, and the action pinned at the bottom.

- Head, centred, the levels of a chapter on Topics: picture 120 px (88 on a phone under 700 px tall), the English name
  a 14 px grey label, the Hindi name 28 px, one sentence 17 px ("In NMMS, about 7 questions per paper.").
- The three Marks: a 48 px point each on one 2 px line, 32 px apart; no box, no lines between rows, no chips. Each:
  MARK N in small capitals, its name 20 px, then what it asks (questions and minutes; the pass mark) in 14 px grey, then
  one line of where it stands (the bar on the way; Passed in green; the lock and why; for Mark 3 the badge it earns).
  The Mark to do is the orange point with a soft ring; a passed one the green ring with a tick; one that waits grey.
- The one button (Start, Continue or Revise the Mark that is due) is docked (§12.2 A), so it is in reach on every phone;
  before 3.27.0 it sat after the content and on a 390 x 844 phone half of it was below the screen.
- Gone: the framed "In NMMS" box, the framed list, the chips (XP, what passing opens: the next Mark's own line says it).
- Not taken: the card that follows the scroll (a chapter has three Marks; all of them fit on one screen).

### 12.12 Home: one thing to do (3.28.0)

From the owner's Brilliant Home pictures: the counts at the top, the course in the middle with its picture big, and
one card at the bottom holding the next steps and the button. IOPET's page, top to bottom:

- Two counts, each a pill (surface, the panel's faint line since 3.29.0), 44 px tall: the streak (the flame lit once today's set is done) on the
  left, the XP of the last 7 days on the right. A tap opens Progress, where both are explained.
- The nudges that matter (storage blocked, confirm your email, back up a guest's progress) under them, as before.
- Today's chapter, centred, in the free space: its picture (160 px, smaller on shorter phones, see below), the English
  name a 14 px grey label, the Hindi name 28 px. A tap opens the chapter's page.
- One grey line only when something is at stake: "Practise today to keep your 3-day streak."
- The card (surface, 24 px corners, the panel's faint line since 3.29.0): the Mark as on the chapter page (the orange point, MARK 1, Learn, what
  it asks), the bar once started, and the button inside (Start or Continue), in the thumb's reach.
- Done for today: the lit flame, "Today's practice done", when to come back; "Practice more" as a quiet link where the
  button was, so nothing starts by mistake.

Gone: the greeting ("Good morning, Hi, Guest"), the two stat boxes (this week's questions and per cent right are on
Progress), the "Today's practice" tag, the dashed frame of the done card, the gold frames of the reward.

Short phones: the picture is a decoration (§12.8), so it gives way first: 160 px from 780 px tall, then smaller (100 vh
- 620 px, at least 64), hidden under a nudge below 760 px and everywhere below 600 px, where the English name goes too.
The card's button stays clear of the bar (and its 28 px fade) on every phone from 320 x 568 to 412 x 915; CI checks it
on 390 x 844 and 360 x 640.

Not taken: the course carousel (one chapter is today's; the others are on Topics), keys and leagues (IOPET has none).

### 12.13 Icons and panels (3.29.0, the owner's UI/UX Phase 1)

The owner's brief (15 Nov 2026): every icon precise and consistent, with Brilliant's drawings as the reference (no
cheap, cartoon or decorative look); and panels that sit in the page, about 5–6 % apart in brightness, with their grey
lines kept faint, on every page.

**Drawings** (chapters, subjects, the stat and achievement pictures, the pack): drawn in a 64 box, by five rules
(written at `FLAT` in `index.html`):

1. A solid is one flat face over its side: the same shape `IC_D` = 4 units lower, in the darker tone of its colour. A
   part 8 units across or less (a bead, a bubble, a pivot) stands `IC_DS` = 2 off. Before: depths of 1.5 to 5.
2. No shine (the white blobs on the flame, star, target, medal, moon, shield, tick, bulb, globe), no gradient, no soft
   ground under a drawing.
3. Colours: the theme's grey body and one accent: the flame (orange) for the course, the streak and what a chapter
   asks; gold for something earned; green only for right and safe. Gold's side is a clear deeper gold (`#D99E0B`), not
   the olive it was. On light, paper is neutral grey (it was the only warm grey in that look).
4. Marks drawn on a solid (letters, a tick, a bull's-eye, the compass needle, the ring on the calendar) are flat.
5. One drawing, one meaning. The achievements had the flag twice, the star three times and the flame twice; now each
   has its own: flag, pencil, trophy, bolt, target, crown, flame, torch, star, medal, sun, moon. The pack is a drawing
   (papers with a passed mark), not the 📝 emoji.

**Line icons** (`li()`, the bottom bar): 24 grid, 2 units of stroke, round ends and joins, at 24 / 20 / 16 px. Fixed:
Settings showed rays round a ring (it read as the sun, the Light look), now a six-tooth cog; the book read as a tablet,
now a closed book with its pages (Course, Terms, the Topics tab); the Progress tab's bars were 2.4, now 2; the ticket's
dotted line was noise at 16 px. Letters used as icons are line icons now: the stepper's − and +, the week's ▲ ▼, the
serif italic "i" on Topics.

**Status marks are solid, things to tap are lines.** Passed: a green disc with a dark tick, the same mark as a right
answer in a set and on Progress (the toothed seal was the one decorated mark). Locked: one solid lock, the same on a
chapter and on a pack. The streak's flame has one rule on Home and on Progress: lit once today's practice is done,
grey until then (Progress showed it lit at 0 days).

**Panels** (3.30.0, the owner: "follow Brilliant's rule, no compromise"): the panel is the page's own colour, and its
border alone shows it. Measured on the owner's phone (3 px to a CSS px) from the owner's Brilliant pictures (Home, You, Premium, in
both looks) and matched to the pixel:

| | Page | Panel | Border | Border width | Inside fill (a button in a panel) |
|---|---|---|---|---|---|
| Light | `#FFFFFF` | `#FFFFFF` | `#E5E5E5` | 7 px at 3x = 2.33 CSS px | `#F2F2F2` |
| Dark | `#141414` | `#141414` | `#2C2C2C` | the same | `#202020` |

A browser draws a border only in whole CSS px (2.34 px comes out as 2), so a panel's border is `--bw-edge` (2 px) and
`--edge-in`, the same colour 0.34 px inside it, makes the 7th pixel: measured 7 px at 3x in both looks, the same as
Brilliant. Every panel, notice and chip carries both (27 rules); the rules of a list stay 1 px (`--line`, the same
colour), as Brilliant's dividers are. Things to press keep their stronger lines (`--line-2`, `--outline`).

Before (3.29.0–3.29.1) a panel was a lighter tone on a grey page (5 L* apart) with a faint edge; 3.30.0 drops the tone
for Brilliant's border. Every page was walked in both looks and checked by script for a rounded box the page's colour
with no border (it would vanish): one was found and fixed, the chapter on the way on Topics, which had its border taken
off in 3.26.0 and was only told by its tone.

Not taken: Brilliant's bottom lip on the course cards it lists (a thicker border at the foot): 3.26.0 took the lip off
IOPET's chapter cards on the owner's word; it waits for the owner's call.

### 12.14 Brilliant's cards, and fewer words (3.31.0)

The owner's word: the lip on the cards (yes), Brilliant's tactics without compromise, and as few words as possible:
no text that says again what a picture, a number, a bar, a colour or a place already says. Words cost a student's
attention, so every word left has a job.

**The course card** (measured on the owner's Brilliant pictures at 3x):

| | Brilliant | IOPET |
|---|---|---|
| Card | 2 px border, a 6 px lip at its foot, 112 px tall | `.path .ch-panel`, the pack card: the same (`--lip`) |
| Press | the card sinks onto its lip | `translateY(4px)`, lip 2 px, the space kept (no jump below) |
| Gap and path | 16 px apart, a 3 px line between | the same (`--line`) |
| Finished | the course colour's tint, its border and lip, a tick in a disc in the corner | the flame: `--done-bg`, `--done-line`, the tick dark on the flame |
| Subject tile | 2 px border; the chosen one in the course colour with its tint | the same, in the flame |

3.26.0 had no tint on a finished chapter; the owner's newer word (Brilliant's tactics) brings it back, in the flame only.

**The chapter page** is Brilliant's course path: each Mark is its point and its name. The point says the number, a tick
(passed) or a lock; the bar under the Mark on the way says how far to its pass; the ring says which Mark is due; what is
behind or ahead is grey. Gone: "MARK 1" (the point says it), the questions and minutes, "Pass at 60 %" (the flag ends the
bar), "Passed, x of y right", the lock's sentence (a tap still says why), "Questions coming soon" (a clock in the point),
"Earns the Mastery badge". The docked button is one word: Start, Continue, or Practice for a passed Mark that is due
again ("Revise" alone read as Mark 2, which is called Revise).

**Words cut elsewhere**:

| Page | Before | After |
|---|---|---|
| Home card | MARK 1, Learn, "12 questions, about 9 min" | the point (1) and Learn |
| Home line | "Practise today to keep your 3-day streak." | "Practise today to keep your streak" (the count is in the pill) |
| Home, done | "Today's practice done" + "Come back tomorrow for a 2-day streak." | "Done for today" |
| Nudges | "Your progress is only on this phone. Create a free account to back it up. Tap here." | "Back up your progress" + a chevron |
| Topics | "Mental Ability: reasoning with letters, numbers and figures." | "Mental Ability" |
| Chapter | "In NMMS, about 7 questions per paper." | "About 7 questions per paper" |
| Progress | "Your weakest chapter", Mark 1, "13 of 16 right to pass", "Practice for 9 min" | "Weakest", the bar with its flag, "Practice". 3.44.0 (the owner's bug, "20/16"): the weakest is a chapter on the go furthest from its pass, else, all passed, the least mastered (its % mastered, no bar); "Up next" only when nothing was started; a bar never shows more than the pass |
| Progress stats | Total XP + Level 4, Day streak + Best 7, 82/175 right, Best run 12 | XP, Streak, Accuracy, Questions |
| Progress | "This week, for your parents" + "Days practised, questions, marks: one WhatsApp message." | "For your parents" + Share |
| Progress | "last 7 days" by the chart (the days are under it); the sentence under the week table | gone; an arrow by this week's count |
| You | "Saved on this phone only" (the backup row says it); "about 2 sets" | gone |
| Achievements | "10 of 12 unlocked" | 10/12 |
| Set done | "5/12 right", "time", "XP earned"; "Mark 1: 5 of 16 to pass"; "1 day streak"; "12 questions, about 2 min" | 5/12, the clock, XP; the flag and 5/16; the flame and 1; gone |
| Mark passed | the two names joined by a dot, "Keep it fresh: come back to it in a few days." | the Hindi name; a line only when a chapter opens |

Kept: the names of things, numbers, the one action, warnings, and the words that say how to earn an achievement.
Not changed: the questions, the packs' own texts (the content's owners write those), the help, privacy and terms pages.

### 12.15 The quiz on Brilliant's rules (3.32.0)

The owner (15 Nov 2026), after the side-by-side: practice is a game, not a test (no A B C D, no clock: both stay in the
full paper, which is the real test); Check in the neutral ink and the choice in the flame; every change animated in an
order, short, as in Brilliant; the right answer's sheet vivid; a wrong one shaken, felt, and given one more try with the
wrong option faded out; Check before a choice lighter still. Studied from the owner's two Brilliant recordings, frame by
frame (50 frames a second), and their screenshots, measured at 3x.

**Why IOPET did not look like Brilliant though it copied it**: Brilliant's loudness follows the moment (an option at rest
is as quiet as a panel; the student's choice is coloured; the next step appears only when it is possible), and five of
IOPET's own rules said the opposite (controls darker than panels, a readable not-ready button, orange for the button to
press, a grey choice, letters and a clock). Those rules are changed here, not only the pixels.

| | Brilliant (measured) | IOPET 3.32.0 |
|---|---|---|
| Bar above the question | grey X, grey dots, no clock | a plain grey X (no ring), one dot a question (3.34.0, §12.17); no count, no clock, no chapter name |
| Where the answers are | the lower third, ~89 px above the buttons | pushed down to the buttons, the free space above them |
| An option at rest | 2 px `#E5E5E5`, regular weight, no letter | the panel's edge (`--edge`), regular, no A B C D |
| The choice | blue border and tint, at once | the flame's border and tint, in one `--t-state` |
| Check | not ready: `#F2F2F2` / `#C2C2C2`, flat; ready: charcoal `#383838` with a 4 px edge | `--off` / `--ink-off`, flat; ready: `--neutral` (light `#363636`, dark `#E6E6E6`) rising in 180 ms |
| Skip | 2 px border and a 2 px lip | the same, `--edge` |
| After Check | the answer changes at ~140 ms, the sheet comes up at ~220 ms (280 ms), its button lights and the XP rises at ~500 ms | the same order; since 3.43.0 on the beats of IOPET's own sound (§7c): `--q-ans` 60, `--q-mark` 60, `--q-sheet` 60, `--q-title` 200, `--q-xp` 270, `--q-go` 340 ms |
| The mark | a ✓ or ✕ on the card's top-right corner | the same (`.opt-mk`), popping in |
| Right | the sheet `#D3F5DD` / `#00350D`, button `#29CC57`, "+15 XP" as green words | Brilliant's green one step brighter since 3.42.0 (§2): `--right-sheet`, `--right` on `--right-lip` with white `--on-right` words; the right option in `--right-sheet` / `--right` with a white ✓ on `--right-lip` (§0 7), the XP as words in `--right-ink` (no pill), no icon by "Correct!" |
| Wrong | "Not quite", Try again; the wrong option fades at ~550 ms (250 ms) and keeps a grey ✕ | the same; a neutral sheet; the option shakes first (owner) |
| The sheet's place | it covers the buttons; nothing on the page moves | the dock is as tall as the sheet (`padding-top:88px`, 76 on a short phone, §5b); the sheet slides up inside it over the buttons it replaces |

**Where a motion ends is the rule itself** (3.33.2, the owner's bug): the faded wrong option's grey line and grey ✕ are
written in its rule; the motion only leads there from the red. A look held by an animation (`forwards`) is lost when
motion is off (Reduce animations, a phone set to less motion): a thin red line and a red ✕ stayed.

**One more try**: a first wrong answer gets "Not quite" and Try again (no "Why?": it would give the answer away). The
wrong option stays out (faded, a grey ✕, not tappable); a second Check shows the result and the right answer; Skip on the
second try shows it too. Only the first answer counts: XP, the right answers that pass a Mark, mastery, the set's score,
the review. Counting the second try would let two guesses out of four pass a Mark.

**The sheet** is one height in every state (the explanation is one tap away, "Why?", on a right, a final wrong or a
skip), so the answers never move when it comes; the page never scrolls under it. Opening "Why?" grows it, on the
student's own tap.

**Not taken**: Brilliant's mascot and its help chat; the progress dots (a set of 12 keeps its line); amber for a miss
(too close to the flame, which is now the choice).

**Next**: practice as a game, built in 3.33.0 (§12.16).

### 12.16 Practice as a game (3.33.0)

The owner (18 Nov 2026): practice should be a game in which the student arranges, settles, matches or fixes the answer;
only then is it a real test of knowing. Picking one of four lets a student eliminate and guess; building the answer does
not.

**Made from the questions as they are.** Nothing new is written and nothing in the bank changes: `gameOf()` reads a
question and makes it a game when it safely can, else it stays a choice. 140 of the 477 NMMS Hindi questions (29 %):

| Game | Made from | The student | Count |
|---|---|---|---|
| Order | "arrange <b>(1) … (2) …</b>" with orders as options (`2, 5, 4, 1, 3`) | puts cards on a ladder in order: a tap picks a card up (the flame), a tap on another swaps them; or drags it onto another | 26 (word sequence, dictionary order) |
| Spell | a code or word of capital letters (coding-decoding, alphabet, word making) | builds it from letter tiles: its letters and 3-4 traps from the wrong options; or exactly the letters the question gives ("arrange UNPKIPM") | 19 |
| Number | a worked-out number (ranking, arithmetic, counting figures, maths operations, alphabet, Venn, directions, calendar, blood relations) | types it on the app's own keys (a phone keyboard would cover the question and move the page) | 95 |

**When a question stays a choice**: it points at its options ("इनमें से", "विकल्प", "which of these"); it is a pattern
to be guessed from examples (series, analogy, missing number, "if 64 × 52 = 17 … then 84 × 37 = ?"), where the options
tell which pattern is meant and a typed answer could be right by another pattern; two options are the same; it is in a
full paper (the real test is four options). A question may say `g:'mcq'` (stay a choice) or `g:'game'` (be a game in any
chapter). CI (`check.js`, 2c) plays every game once, right, and fails if it does not give the question's right option.

**The pieces are the quiz's own**: a card is an option's panel; a tile and a key are Skip's panel with its 2 px lip (a
thing to press); an empty place is a well (`--fill-2`), the next one marked by a flame line under it; the student's own
move is the flame; a grip (six dots) says a card can move, the caret says "type": no line of instructions. Check
rises once the game is complete (a first move for an order; every place filled; a digit typed).

**Motion**: a tile or card glides to its new place (FLIP: measured before and after, transform only, the pop spring,
250 ms); after Check the places light one after another (`--q-step` 40 ms), a wrong one shakes with its ✕, as an
option does (§12.15 timeline). Nothing on the page moves when the sheet comes or on Try again (measured at 320, 360 ×
640, 360 × 790, 412: 0 px). A game that does not fit a short screen starts scrolled by no more than the bar above it,
so the question stays in sight and every key is above the buttons; below 720 px tall the game sits a little closer.

**One more try** (as §12.15): the places found right stay, green and locked; wrong letters go back to the tray, wrong
cards stay to be swapped, a wrong number is shown struck through. A second miss is seen (700 ms), then the answer
settles into place before the student's eyes; Skip shows it the same way. Only the first answer counts. The review shows
the student's own answer as they built it, even when it is none of the four options.

**Not built yet**: match (pairs) and fix-the-mistake need questions written for them (the questions chat); a number
line, a balance or a Venn to fill need drawings that take answers.

### 12.17 The set's dots (3.34.0)

The owner (18 Nov 2026), on Brilliant's lesson bar: the line and its count (10/12) give way to one dot a question, and the
X steps back. The dots say what happened without a word.

| Dot | Means | Look | Motion |
|---|---|---|---|
| Faint | not reached yet | `--fill` (#F3F3F3 light, #222 dark; Brilliant #F2F2F2) | none |
| Ringed | the question now open | `--line-2` (#C7C7C7 / #3D3D3D; Brilliant #CCC) inside a 2 px ring of `--fill`, 3 px from it (a `--bg` gap) | the ring opens in one `--t-state` when the question opens |
| Green | the first answer was right | `--win` | 3.34.2: the green grows out of the dot's middle (scale .15 → 1.08 → 1) over the grey, in `--t-dot` 460 ms on `--ease-dot` (an overshooting curve, smooth at any frame rate), from `--q-ans`; it is opaque within 90 ms. Transform and opacity only, so the graphics chip draws it at the screen's own rate (60 to 144 Hz), even while the page is busy (tested: it went on growing through a 650 ms block of the page) |
| Dark grey | the first answer was wrong, or it was skipped | `--ink3` (#6A6A6A / #8F8F8F; Brilliant #666) | none: at once and still (the owner) |

- **Only the first answer counts**, as everywhere (§12.15): a right second try leaves its dot dark grey.
- **Size, measured on the owner's screenshot**: dots 3.5 % of the screen wide, with two thirds of a dot between them. In
  IOPET: 12 px with 8 px gaps. A set of 12 on a 360 px phone makes them 10 px, and on 320 px 8 px. They shrink (gaps 4 px)
  when a set is long. A set too long for 6 px dots (a pack's) gets one thin piece a question, filling the row.
- **The row** sits centred on the screen, between the X and an empty place of the same width (a grid of 44 px | 1fr | 44 px).
  `role="img"` reads "Question 4 of 12".
- **The X** (3.34.2, the owner): 30 px, fainter, and set 12 px higher and 12 px further left than the dots' line, so the X and the
  dots never read as one row. `--ink-x` is #A3A3A3 light (2.5:1) and #5C5C5C dark (2.75:1). This is below the 3:1 asked of
  controls, the owner's choice: its larger size keeps it findable. The place to tap (44 px) moves with it. 3.34.0 had
  #909090 / #666666 (3.2:1); before that it was `--ink3` (5.4:1).
  Its line is 1.75 (Brilliant's weight; 2 before). 3.34.1, the owner: the X is drawn at 20 px (it was 24); the place to tap stays
  44 px. The owner thought of taking the X away (Android's Back also quits). It stays: an installed app on an iPhone has no Back,
  and Back quits safely only where the browser lets the app catch it.
- **Not taken**: Brilliant joins a run of right answers into one green bar. The owner asked for dots only.
- A full paper keeps its own bar: 90 dots would not fit.
- **The question under the dots (3.38.0, the owner):** 40 px under the header (`.qz>.q-body`; 24 before). It starts
  56 px under the dots, 4 times as far as its own figure is from it (14 px). The dots are where you are; the question
  is what you read. (3.39.0: the room above and below the question and its answers is shared, §12.19.) A long question
  scrolls 16 px sooner on a small phone. The number pad, the tiles and the cards of the games stay clear of the buttons
  at 320 x 568 to 412 x 915.

### 12.18 One navigation mark, two states: the X and the Back (3.35.0, simplified in 3.37.0)

The owner (19 Nov 2026): the practice X and the Back of the page under it are one component in two states, joined by a
morph. 3.37.0 the owner, after a recording of 3.36.0 (its circle came and went, the mark glided, its colour changed): "keep
it simple": the left chevron becomes an arrow (←), the same size, in the same place, everywhere, and the transition between
X and ← is smooth.

**One drawing, twins.**
- **The X** (`close`): FINAL (§0 5). 30 px, a 1.4-unit line (1.75 px), round ends, `--ink-x`, no circle, 12 px higher and
  further left than its place (the button at 12,12 on a page with 24 px sides; its drawing at 19,19).
- **The Back** (`arrow`, ←): the X's twin. The same 30 px, the same line, the same `--ink-x`, no circle, the same place.
  The arrow sits in the X's own 12 x 12 box (`M12 6l-6 6 6 6M6 12h12`): its point at the box's left edge, its shaft the
  box's width, its two arms exactly the X's two right half-strokes (6√2 units, 45°).
- **Every Back** is this one: the 19 page headers (`subHead`), the sign-in pages (`backBtn`), the chapter page, Review.
- **A page header with a title** (Settings, Account, Review answers and the rest): the title stays on the arrow's line,
  beside it (the header 12 px higher, the title 12 px from the button), and the page under it keeps its 16 px (§12.5).
- **Not the Back** (left as they are): the review pager's ‹ › and the paper's "‹ Previous / Next ›" are a pair that step
  through questions; they stay chevrons, at the mark's size and line.

**The morph (in place).**
- **X → ←** (starting from the chapter page, Review, the paper page; or the other way): the X is three strokes: its right
  half (a <) and its two left half-strokes.
  - The < slides left 6 units and is the arrow's head.
  - The two left half-strokes slide 6 units down and up onto the head's two arms, and are let go there (0.5 → 0.75 of
    the time), so no line is drawn twice.
  - The shaft draws out of the point as the point moves (scaleX 0 → 1 from the point).
  - ← → X is the same, backwards.
- **Nothing else moves**: no circle, no glide, no colour change (the two states share size, place and colour). If the
  page left was scrolled so the mark was not in its place, the mark slides back to it (the only case).
- **Not used**: a turn of the whole, a crossfade from one icon to the other, a swap.

**How it is drawn (smoothness).**
- **Strokes**: each stroke is one small SVG drawing, drawn once where it will end, and then only slid (`translate`) or, the
  shaft, stretched (`scaleX`) from where it was (Web Animations). Its last frame is the real icon's own drawing, untouched.
- **Frame rate**: transform and opacity are the properties the graphics chip animates by itself, at the screen's own
  refresh rate (60, 90, 120, 144 or 200 Hz). No frame loop runs, and nothing is drawn when nothing moves.
- **The hand-over**: the overlay and the real mark change places in one frame (two animations started together end
  together). A crossfade of two copies was measured to lighten the mark for about 60 ms, so it is not used. Measured on the
  last frame: the carry-overs differ from the real mark by 1/255, the morph into the X by 7/255, the morph into ← by under
  25/255 on 3 to 5 device pixels at its point. None of it can be seen.
- **Timing (3.38.1)**: 420 ms on the app's own `--ease-std` (`cubic-bezier(.4,0,.2,1)`). It starts gently, makes most
  of its change across the middle 150 to 200 ms, and settles. Measured frame by frame at real speed on a CPU slowed 1x,
  4x and 6x (like a phone): 17 frames in between at 60 Hz, and no frame moves it more than 11 % of the way.
  - **Before (3.35 to 3.38.0)**: 380 ms on `cubic-bezier(.2,0,0,1)`. 60 % of the change came in its first 100 ms and
    the rest in a tail too small to see. On the owner's screen recording (30 frames a second) that was two frames: a
    jump, not a morph.
  - **The lesson**: a morph is judged at real speed, frame by frame, the way the phone shows it; frames slowed 20x hide
    a jump.
- **When there is none**: with Reduce animations or the phone's reduce-motion, there is no morph. There is none either
  where the other screen has no mark (Home, a tab). A morph still running ends with any new drawing.

**Carry-over:** whenever the screen changes (`paint`) and both screens have the mark in their top-left corner, the mark
carries over; it is never drawn again with the page. Between two of the same state it stays, held as its own drawing,
while the page comes in under it: the next question's X, the summary's X after the last question, and the next page's ←
never flicker.

| From | To | The mark |
|---|---|---|
| chapter page ← | the set | morphs into the X, in place |
| the set's X (X, Quit, the phone's Back) | chapter page | morphs into ←, in place |
| a question's X | the next question's X | stays |
| the last question's X | the summary's X | stays (they share the place) |
| summary X | Review answers ← | morphs, in place |
| Review ← | summary | morphs into the X |
| paper page ← | the paper's X | morphs, in place |
| a page's ← | the next page's ← (Settings → Account) | stays |
| a tab | a page with ← | none: ← comes with the page |
| summary X | Home | none |

### 12.19 The question and its answers are one group (3.39.0)

The owner (19 Nov 2026): a short question (one or two lines) left a big gap before its options, which sat at the bottom by
the buttons, and the eye had to travel a long way down to find them. Tiring, and a flaw in the hierarchy.

**Brilliant, measured** (the owner's 163 s screen recording, every quiz screen; 388 x 854 frames):
- The question, its figure, the answer box and the keypad or the choices are one block. Inside it the gaps are small: about
  60 px from the question to its figure, 14 to 27 px between the answer box and the keys or choices.
- The block stands in the middle of the room between the progress bar and Skip / Submit. Its height went from 382 to 554
  px, and its middle stayed at 448 to 453 px every time. The room left over is shared: 95 to 179 px above, 52 to 140 px
  below (above : below about 1.3 to 1.6).
- The answers never wait at the bottom; Skip and Submit do.

**The research behind it:**
- Proximity (Gestalt; Nielsen Norman Group): things that sit close are read as belonging together, and space separates
  groups. A question and its answers belong together; the dots and the buttons are other groups.
- Touch (Steven Hoober, from millions of measured touches): people tap the middle of the screen most surely (about 7 mm
  there, 12 mm at the corners) and prefer it. Answers in the middle are easier to hit than answers by the bottom edge.

**IOPET's rule:**
- The question (`.q-body`, with its figure) and its answers (`.opts`, or a game `.gm`) are one block.
- **Inside the block, space by kinship (3.39.1, the owner's pick out of four: 16/40, 24/48, 32/64, and Brilliant's 48/24).**
  Each step out is about twice the one inside it, so the eye reads three parts, not one lump:
  - the options among themselves: 8 px;
  - the question to its figure: 24 px (with it, yet its own part);
  - the question, or its figure, to the answers: 48 px (32 for a game on a short screen);
  - the block to the dots and the buttons: what is left of the room, about 100 px and more.
  3.39.0 had 10 / 32: it read as one big block. Brilliant's 48 / 24 was not taken: there a figure is often part of the
  answer (a scale, an equation); in IOPET's questions the figure belongs to the question.
- The block stands in the room between the header and the dock. The room left is shared two parts above, one part below
  (the page's own `::before` and `::after`, `flex: 2` and `flex: 1`). The dock keeps its 88 px for the result sheet below
  that, so the block sits a little above the middle, as Brilliant's does.
- **What is typed key by key waits by the thumb (3.39.1, the owner).** The number pad and the letter tiles are tapped
  again and again, so their block stands at the bottom of the room (`.q-thumb`: all the room above it): the keys end 88 px
  over Skip / Check (the room the result sheet needs), in the lower third of the phone. The question stays 48 px over its
  answer box. A one-tap answer (the options) and the cards of an order game stay in the middle (§ above).
- The question is never closer than 40 px to the dots (§12.17).
- A question too long for the room starts 40 px under the dots and the page scrolls, as before.
- **Nothing moves after the question opens.** The block stays put when an option is picked, at Check, and at Try again.
  When Why? makes the result sheet longer, the room above the block is held (`.held`, `--q-held`), so the longer sheet
  takes the room below it. Only if the sheet would cover the answers is the block lifted, just far enough to stay 16 px
  clear, in the same frame. Before 3.39.0 the options jumped 63 px at Why?; now 0 to 29 px, and only when they must.
  3.40.2 (the owner's bug, a video): Why? pressed again and again lifted a number or spelling game 16 px each time, and
  the dock floated up off the bottom (191 px after 10 presses). Held, the room under the block gives and takes
  (`.held::after{flex:1 1 0}`), so the dock stays on the bottom. Folding the reason puts everything back where it was
  before Why? (the keys back by the thumb, §12.19 above); open again, the same one place. Two states, never a climb. The
  held room is kept with the question, so a redraw (a game's answer settling 700 ms after a second miss) does not move
  it either. Measured: 8 presses, the options and every game, 320 x 640, 360 x 791, 412 x 915: folded = where it was,
  open = one place, the dock 0 px off the bottom every time.
- **A tap on the page puts the sheet away** (3.40.2, the owner: a student tapped near the options after a wrong answer,
  expecting the sheet to go down). The tap does what the sheet's own button would, and nothing else:
  - "Not quite": a tap anywhere on the page outside the sheet is Try again. A tap on another option is Try again and
    that option chosen (Check is ready); a tap on the option found wrong is Try again only.
  - Why? open: a tap outside the sheet folds the reason away; the sheet stays. With the reason folded, a tap on the page
    does nothing (Continue is the way on, as before).
  - The X at the top keeps its own tap (it asks to quit). A paper has no sheet, so nothing changes there.
  - An option that cannot be chosen is `aria-disabled`, not `disabled` (a disabled button gets no tap at all, so the
    page could not hear it). It looks and reads the same (checked pixel by pixel, light and dark).
- **A double tap presses one button** (3.40.2). When the dock changes under the finger (Check → Continue, Skip →
  Continue, Try again → Skip | Check), its buttons wait 300 ms (the same wait as after a new screen), so the second tap of
  a quick double tap cannot press the button that has just come into the same place. Before, with motion off, Check
  tapped twice went on to the next question unseen, Skip twice did the same, and Try again twice gave up the second try.
  The options and the page answer at once; a tap after the wait is taken.
- **Measured on IOPET's questions** (light and dark, 320 x 568 to 412 x 915):

| Question | Size | Question to options before | Now |
|---|---|---|---|
| Two lines (relations) | 360 x 760 | 280 px | 32 px |
| Two lines (relations) | 412 x 915 | 467 px | 32 px |
| Three lines + number pad | 360 x 760 | 212 px | 32 px |
| Two lines + figure | 360 x 760 | 161 px | 34 px |

  The games' keys, tiles and cards stay clear of the buttons at every size.
- **Not taken**: the options right under the question with all the room below them (the screen looks top-heavy, and on a
  tall phone the answers end up far from the thumb); the question moved down to the options (the reading would start in
  a different place on every question, low on the screen).
