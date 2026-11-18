# IOPET: rules for every chat and every person working here

## FINAL: what the owner has locked (read this first)
- The owner tests a change and writes **FINAL**. From then on it is part of IOPET's identity, for life:
  - never change it, not even as a side effect of another change, unless the owner asks for exactly that change;
  - if it has changed by mistake, put it back exactly as it was locked.
- The list of FINAL things is `DESIGN.md` §0. CI (`.github/scripts/check.js`, step 2d) checks every entry on each pull request.
- To change a FINAL thing (only on the owner's request): change the app, `DESIGN.md` §0 and the FINAL list in `check.js`
  together, and say so in the pull request.
- When the owner writes FINAL for something, set its status in §0 and in `check.js` to "FINAL (date)".

## The identity is followed strictly
- `DESIGN.md` is the source of truth for how IOPET looks, reads and moves. Follow it as rules in every update.
- Add nothing new to the look on your own (colours, type, buttons, motion, icons, words). An update does what was asked
  and nothing more. A change to one of these rules needs the owner's request.

## Work
- One file, `index.html`, plain ES5 (old phones). Its `CONFIG.VERSION` and `VERSION` in `sw.js` change together.
- Before a pull request: `node .github/scripts/check.js` (ES5, versions, games, FINAL, design system, the app in a browser).
- Questions and packs are the content chat's work; the UI chat does not change question content.
