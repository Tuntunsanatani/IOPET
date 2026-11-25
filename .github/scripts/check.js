/* IOPET checks, run by .github/workflows/check.yml on every pull request and every push to main.
   Locally: npm install --no-save acorn playwright && npx playwright install chromium && node .github/scripts/check.js
   1. the app's code is ES5 (it must run on old phones);  2. index.html and sw.js carry the same version, and every file the
   service worker caches is in the repo;  3. the app opens and works in a real browser, dark and light: splash (with the name),
   the terms box (it holds the ways in until ticked), guest sign-in, course choice, the four tabs, Home's button on two phones, a chapter, one question
   checked — with no script error on the way;
   2b. the design system keeps itself: tokens exist, and nothing new is written into a rule that should come from a token;
   2c. every question that becomes a game (3.33.0) gives, played right, its own right option;
   2d. what the owner has locked as FINAL (DESIGN.md §0) is still exactly as locked. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..', '..'), SHOTS = path.join(ROOT, 'ci-shots');
let failed = 0;
const ok = m => console.log('ok    ' + m), bad = m => { failed++; console.log('FAIL  ' + m); };

// 1. ES5
const acorn = require('acorn');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) bad('no <script> in index.html');
scripts.forEach((src, i) => { try { acorn.parse(src, { ecmaVersion: 5 }); ok('index.html script ' + (i + 1) + ' is ES5'); } catch (e) { bad('index.html script ' + (i + 1) + ' is not ES5: ' + e.message); } });
try { acorn.parse(sw, { ecmaVersion: 5 }); ok('sw.js is ES5'); } catch (e) { bad('sw.js is not ES5: ' + e.message); }

// 2. versions and cached files
const vApp = (html.match(/VERSION:\s*'([^']+)'/) || [])[1], vSw = (sw.match(/var VERSION = '([^']+)'/) || [])[1];
if (vApp && vApp === vSw) ok('version ' + vApp + ' in index.html and sw.js'); else bad('version: index.html ' + vApp + ', sw.js ' + vSw + ' (installed apps update only when sw.js changes)');
const cached = (((sw.match(/var FILES = \[([\s\S]*?)\];/) || [])[1] || '').match(/'[^']+'/g) || []).map(f => f.slice(1, -1)).filter(f => f !== './');
const missing = cached.filter(f => !fs.existsSync(path.join(ROOT, f)));
if (!cached.length) bad('sw.js: the FILES list was not found'); else if (missing.length) bad('sw.js caches files that are not in the repo: ' + missing.join(', ')); else ok(cached.length + ' files cached by sw.js are all in the repo');
try {
  const mf = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
  const gone = (mf.icons || []).map(i => i.src).filter(s => !fs.existsSync(path.join(ROOT, s)));
  if (gone.length) bad('manifest icons missing: ' + gone.join(', ')); else ok('manifest.webmanifest is valid JSON, its icons exist');
} catch (e) { bad('manifest.webmanifest: ' + e.message); }

// 2c. PRACTICE AS A GAME (3.33.0, DESIGN.md §12.16): a question becomes a game by itself, so every one of them is played here once,
//   right: the order the cards end in, the word the letters make, the number typed must each BE the question's right option
//   (and no first order may be the answer already). A question written later that would make a wrong game fails here.
(function games() {
  const vm = require('vm'), a = html.indexOf('var TOPICS = ['), b = html.indexOf('var BANK = {'), c = html.indexOf('\n};', b),
    g0 = html.indexOf('var GAME_NUM_CH'), g1 = html.indexOf('/* the tiles that changed place glide');
  if (a < 0 || b < 0 || c < 0 || g0 < 0 || g1 < 0) { bad('games: the bank or the game code was not found'); return; }
  const box = { has: (o, k) => Object.prototype.hasOwnProperty.call(o, k) };
  try { vm.runInNewContext(html.slice(a, c + 3) + '\n' + html.slice(g0, g1) + '\nthis.TOPICS = TOPICS; this.BANK = BANK;', box); }
  catch (e) { bad('games: the bank or the game code does not run: ' + e.message); return; }
  const n = { order: 0, spell: 0, num: 0 }, wrong = [];
  box.TOPICS.forEach(t => (box.BANK[t.id] || []).forEach(q => {
    const g = box.gameOf(q, t), it = { q: q };
    if (!g) return;
    n[g.t]++; box.gStart(it, t);
    if (g.t === 'order' && it.at.join() === g.ans.join()) wrong.push(q.id + ' starts in its right order');
    if (g.t === 'num') it.typed = g.ans; else if (g.t === 'order') { it.at = g.ans.slice(); it.moved = true; } else box.gSolve(it);
    const r = box.gAnswer(it);
    if (r[0] !== q.a) wrong.push(q.id + ': played right, it gives option ' + r[0] + ' (' + r[1] + '), not ' + q.a);
  }));
  if (wrong.length) bad('games: ' + wrong.join('; ')); else ok('games: ' + n.order + ' order, ' + n.spell + ' spell, ' + n.num + ' number; each, played right, gives its right option');
})();

// 2d. FINAL — WHAT THE OWNER HAS LOCKED (DESIGN.md §0, CLAUDE.md). The owner tests a change and writes FINAL: from then on it is
//   never changed again, by any chat or person, unless the owner asks for exactly that change. Each entry below is checked on
//   every pull request; a rule written later that undoes it (even by accident) fails here. To change a FINAL thing, the owner
//   must ask for it: then change the app, this list and DESIGN.md §0 together, and say so in the pull request.
(function finals() {
  const css = ((html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m => ({ sel: m[1].trim().replace(/^@[^{]*\{\s*/, ''), body: m[2].replace(/\s+/g, '') }));
  const rule = sel => rules.filter(r => r.sel === sel).map(r => r.body).join(';');
  const root = rule(':root'), light = rule('[data-theme="light"]');
  const BTN = /(^|[\s,>+~])[^,]*(\.btn|\.q-skip|\.au-go|\.sign-out|\.qr-go)(?![\w-])/;
  const FINAL = [
    { what: 'action buttons: the words one weight lighter (600) with a little space between the letters (.03em)', since: '3.33.1', status: 'FINAL, the owner, 18 Nov 2026',
      test: () => {
        const e = [];
        if (!/(^|;)--fw-btn:600(;|$)/.test(root) || !/(^|;)--ls-btn:\.03em(;|$)/.test(root)) e.push(':root must hold --fw-btn:600 and --ls-btn:.03em');
        if (/--fw-btn|--ls-btn/.test(light)) e.push('the light look must not redefine --fw-btn / --ls-btn');
        for (const sel of ['.btn', '.btn-sec,.btn-line,.q-skip', '.au-go', '.sign-out'])
          if (!rule(sel).includes('font-weight:var(--fw-btn);letter-spacing:var(--ls-btn)')) e.push(sel + ' must use font-weight:var(--fw-btn);letter-spacing:var(--ls-btn)');
        for (const r of rules) if (BTN.test(r.sel)) {
          for (const m of r.body.matchAll(/(?:^|;)font-weight:([^;]+)/g)) if (m[1] !== 'var(--fw-btn)') e.push(r.sel + ' sets font-weight:' + m[1]);
          for (const m of r.body.matchAll(/(?:^|;)letter-spacing:([^;]+)/g)) if (m[1] !== 'var(--ls-btn)') e.push(r.sel + ' sets letter-spacing:' + m[1]);
        }
        return e;
      } },
    { what: 'Skip: its word the ink at 75 % (--ink-skip), so it never calls louder than Check', since: '3.33.1, 75 % in 3.33.3', status: 'FINAL, the owner, 18 Nov 2026',
      test: () => {
        const e = [];
        if (!/(^|;)--ink-skip:rgba\(242,242,242,\.75\)(;|$)/.test(root)) e.push(':root must hold --ink-skip:rgba(242,242,242,.75)');
        if (!/(^|;)--ink-skip:rgba\(20,20,20,\.75\)(;|$)/.test(light)) e.push('the light look must hold --ink-skip:rgba(20,20,20,.75)');
        if (!/(^|;)color:var\(--ink-skip\)(;|$)/.test(rule('.q-skip'))) e.push('.q-skip must be color:var(--ink-skip)');
        if (!/(^|;)color:var\(--ink-skip\)(;|$)/.test(rule('.qz .q-dock .q-skip'))) e.push('.qz .q-dock .q-skip must be color:var(--ink-skip)');
        for (const r of rules) if (/\.q-skip(?![\w-])/.test(r.sel) && !/:not\(\.q-skip\)/.test(r.sel)) {
          for (const m of r.body.matchAll(/(?:^|;)color:([^;]+)/g)) if (m[1] !== 'var(--ink-skip)') e.push(r.sel + ' sets color:' + m[1]);
          if (/-webkit-text-fill-color:/.test(r.body)) e.push(r.sel + ' sets -webkit-text-fill-color');
        }
        return e;
      } },
    { what: 'action buttons: their words at 88 % of their colour (--btn-ink), Skip apart', since: '3.33.3', status: 'FINAL, the owner, 18 Nov 2026',
      test: () => {
        const e = [], SEL = '.btn:not([disabled]):not(.q-skip),.au-go:not(.off),.sign-out';
        if (!/(^|;)--btn-ink:88%(;|$)/.test(root)) e.push(':root must hold --btn-ink:88%');
        if (/--btn-ink/.test(light)) e.push('the light look must not redefine --btn-ink');
        if (!rule(SEL).includes('-webkit-text-fill-color:color-mix(insrgb,currentColorvar(--btn-ink),transparent)')) e.push(SEL + ' must set -webkit-text-fill-color:color-mix(in srgb,currentColor var(--btn-ink),transparent)');
        for (const r of rules) if (r.sel !== SEL && BTN.test(r.sel) && /-webkit-text-fill-color:/.test(r.body)) e.push(r.sel + ' sets -webkit-text-fill-color');
        return e;
      } }
    ,{ what: 'the set\'s dots in practice: one dot a question (right green growing in, wrong or skipped dark grey at once, the open one ringed, the rest faint)', since: '3.34.0, 3.34.2', status: 'FINAL, the owner, 18 Nov 2026',
      test: () => {
        const e = [], has = (sel, decl) => { if (!rule(sel).includes(decl.replace(/\s+/g, ''))) e.push(sel + ' must hold ' + decl); };
        has('.q-dots', 'display:flex;align-items:center;justify-content:center;gap:var(--qg);height:44px;min-width:0');
        has('.q-dots .qd', 'position:relative;flex:none;display:block;width:var(--qd);height:var(--qd);border-radius:50%;background:var(--fill)');
        has('.q-dots .qd.cur', 'background:var(--line-2)');
        has('.q-dots .qd.ok', 'background:var(--win)');
        has('.q-dots .qd.miss', 'background:var(--ink3)');
        has('.q-dots .qd.at', 'box-shadow:0 0 0 var(--qr) var(--bg),0 0 0 var(--qs) var(--fill)');
        has('.q-dots .qd.ok-in::after', 'animation:qd-fill var(--t-dot) var(--ease-dot) var(--q-ans) backwards,qd-show var(--t-dot-in) linear var(--q-ans) backwards');
        has('.qz .q-header', 'display:grid;grid-template-columns:44px minmax(0,1fr) 44px;column-gap:8px;align-items:center');
        if (!/(^|;)--t-dot:460ms(;|$)/.test(root) || !/(^|;)--t-dot-in:90ms(;|$)/.test(root) || !/(^|;)--ease-dot:cubic-bezier\(\.2,1\.55,\.36,1\)(;|$)/.test(root)) e.push(':root must hold --t-dot:460ms, --t-dot-in:90ms, --ease-dot:cubic-bezier(.2,1.55,.36,1)');
        for (const r of rules) if (/\.qd\.miss|\.qd\.cur(?![\w-])/.test(r.sel) && /animation/.test(r.body)) e.push(r.sel + ' moves: a wrong, skipped or waiting dot must not');
        const js = scripts.join('\n');
        for (const line of ["qDots(fresh) + '<span class=\"q-hd-sp\" aria-hidden=\"true\"></span></div>'",
                            "var c = it.pick === null ? (k === S.i ? 'cur' : '') : it.pick === it.q.a ? 'ok' : 'miss';",
                            "d = Math.min(12, Math.floor((room - (n - 1) * g) / n));"])
          if (!js.includes(line)) e.push('the app must keep: ' + line);
        if (/class="q-counter/.test(js.slice(js.indexOf('SCREENS.practice = function'), js.indexOf('function qStage(')))) e.push('the practice bar must not show a count again');
        return e;
      } },
    { what: 'the practice X: 30 px, faint (--ink-x), 12 px higher and further left than the dots', since: '3.34.2', status: 'FINAL, the owner, 18 Nov 2026',
      test: () => {
        const e = [];
        if (!rule('.qz .q-header .icon-btn').includes('border:0;background:none;color:var(--ink-x);position:relative;top:-12px;left:-12px')) e.push('.qz .q-header .icon-btn must be color:var(--ink-x);position:relative;top:-12px;left:-12px');
        if (!rule('.qz .q-header .icon-btn .li').includes('width:30px;height:30px;stroke-width:1.4')) e.push('.qz .q-header .icon-btn .li must be width:30px;height:30px;stroke-width:1.4');
        if (!/(^|;)--ink-x:#5C5C5C(;|$)/.test(root) || !/(^|;)--ink-x:#A3A3A3(;|$)/.test(light)) e.push('--ink-x must be #5C5C5C (dark) and #A3A3A3 (light)');
        return e;
      } },
    { what: 'the question\'s words at 450 (--fw-q), its own Hindi file (noto-hi-450, Noto Sans 2.015)', since: '3.38.3', status: 'FINAL, the owner, 19 Nov 2026',
      test: () => {
        const e = [], js = scripts.join('\n'), sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
        if (!/(^|;)--fw-q:450(;|$)/.test(root)) e.push(':root must hold --fw-q:450');
        if (/--fw-q/.test(light)) e.push('the light look must not redefine --fw-q');
        if (!rule('.q-text').includes('font-size:var(--fs-xl);font-weight:var(--fw-q);line-height:1.6')) e.push('.q-text must be font-size:var(--fs-xl);font-weight:var(--fw-q);line-height:1.6');
        if (!rule('.rv-q').includes('font-weight:var(--fw-q)')) e.push('.rv-q must be font-weight:var(--fw-q)');
        for (const r of rules) for (const part of r.sel.split(',')) if (/\.(q-text|rv-q)$/.test(part.trim()))
          for (const m of r.body.matchAll(/(?:^|;)font-weight:([^;]+)/g)) if (m[1] !== 'var(--fw-q)') e.push(r.sel + ' sets font-weight:' + m[1]);
        if (!/@font-face\{font-family:'IOPET Sans';font-style:normal;font-weight:450;font-display:swap;src:url\(noto-hi-450\.woff2\) format\('woff2'\);unicode-range:U\+0900-097F/.test(html)) e.push('the @font-face for weight 450 (noto-hi-450.woff2, the Devanagari range) must stay');
        if (!/@font-face\{font-family:'IOPET Sans';font-style:normal;font-weight:450;font-display:swap;src:url\(pjs-500\.woff2\) format\('woff2'\);unicode-range:U\+0000-00FF/.test(html)) e.push('the English face must also be given at 450 (pjs-500.woff2): without it the English, numbers and spaces of a question are drawn in the phone\'s own font');
        const wts = f => [...html.matchAll(/@font-face\{font-family:'IOPET Sans';[^}]*?font-weight:([^;]+);[^}]*?src:url\(([a-z]+)-/g)].filter(m => m[2] === f).map(m => m[1]).sort().join(',');
        if (wts('pjs') !== wts('noto')) e.push('every weight must have both an English and a Hindi face (English: ' + wts('pjs') + '; Hindi: ' + wts('noto') + ')');
        if (!fs.existsSync(path.join(ROOT, 'noto-hi-450.woff2'))) e.push('noto-hi-450.woff2 must be in the repo');
        if (!sw.includes("'noto-hi-450.woff2'")) e.push('sw.js must cache noto-hi-450.woff2');
        if (!js.includes("['400', '450', '600', '700'].forEach(function (w) { document.fonts.load(")) e.push('the splash must wait for the 450 face with the others');
        return e;
      } },
    { what: 'the right option\'s mark: a white tick on the deeper green circle (black on green was harsh)', since: '3.41.0, 3.42.0', status: 'FINAL, the owner, 20 Nov 2026',
      test: () => {
        const e = [];
        if (rule('.qz .opt-btn.correct .opt-mk') !== 'background:var(--right-lip);color:var(--on-right)') e.push('.qz .opt-btn.correct .opt-mk must be exactly background:var(--right-lip);color:var(--on-right)');
        if (!/(^|;)--on-right:#FFFFFF(;|$)/.test(root) || /--on-right/.test(light)) e.push('--on-right must be #FFFFFF in :root and not redefined by the light look');
        if (!/(^|;)--right-lip:#1C9E42(;|$)/.test(root) || !/(^|;)--right-lip:#18B348(;|$)/.test(light)) e.push('--right-lip must be #1C9E42 (dark) and #18B348 (light)');
        if (!rule('.qz .opt-mk').includes('width:24px;height:24px;border-radius:50%')) e.push('.qz .opt-mk must stay a 24 px circle');
        if (!rule('.qz .opt-mk .li').includes('width:14px;height:14px;stroke-width:3.2')) e.push('.qz .opt-mk .li must stay 14 px, stroke 3.2');
        for (const r of rules) if (r.sel !== '.qz .opt-btn.correct .opt-mk' && /\.correct[^,]*\.opt-mk/.test(r.sel) && /(^|;)(color|background)[:-]/.test(r.body)) e.push(r.sel + ' must not repaint the right option\'s mark');
        return e;
      } }
,
    { what: 'the right answer\'s green: Brilliant\'s green one step brighter, on the sheet, Continue, the right option and a game\'s right answer', since: '3.42.0', status: 'FINAL, the owner, 20 Nov 2026',
      test: () => {
        const e = [];
        const want = { root: { '--right': '#2FEB64', '--right-lip': '#1C9E42', '--right-sheet': '#0E4520', '--right-ink': '#6CF294', '--on-right': '#FFFFFF' },
                       light: { '--right': '#2DE060', '--right-lip': '#18B348', '--right-sheet': '#CFF8DB', '--right-ink': '#0E7C3A' } };
        for (const [k, v] of Object.entries(want.root)) if (!new RegExp('(^|;)' + k + ':' + v + '(;|$)').test(root)) e.push(':root must hold ' + k + ':' + v);
        for (const [k, v] of Object.entries(want.light)) if (!new RegExp('(^|;)' + k + ':' + v + '(;|$)').test(light)) e.push('the light look must hold ' + k + ':' + v);
        const has = (sel, body) => { if (rule(sel) !== body) e.push(sel + ' must be exactly ' + body); };
        has('.qz .q-result.ok', 'background:var(--right-sheet)');
        has('.qz .qr-go.ok', 'background:var(--right);color:var(--on-right);box-shadow:04px0var(--right-lip)');
        has('.qz .qr-go.ok:active', 'box-shadow:01px0var(--right-lip)');
        has('.qz .opt-btn.correct', 'border-color:var(--right);background:var(--right-sheet);box-shadow:inset000.34pxvar(--right);opacity:1');
        has('.gm .ok', 'border-color:var(--right);background:var(--right-sheet);box-shadow:inset000.34pxvar(--right)');
        if (!rule('.qz .fb-xp').includes('color:var(--right-ink)')) e.push('.qz .fb-xp must be color:var(--right-ink)');
        return e;
      } },
    { what: 'the full paper in the quiz\'s look: the question and options as in a set; one dot a question in a row that scrolls and opens any question; the quiet time whose figures turn over; Skip and Next; the Submit sheet', since: '3.50.0', status: 'FINAL, the owner, 25 Nov 2026',
      test: () => {
        const e = [], js = scripts.join('\n'), has = (sel, decl) => { if (!rule(sel).includes(decl.replace(/\s+/g, ''))) e.push(sel + ' must hold ' + decl); };
        has('.p-dots', 'order:-2;display:flex;margin-top:4px;padding:0 12px;overflow-x:auto;overflow-y:hidden');
        has('.pd', 'flex:none;display:flex;align-items:center;justify-content:center;width:24px;height:var(--tap);background:none');
        has('.pd i', 'display:block;width:12px;height:12px;border-radius:50%;background:var(--fill)');
        has('.pd.on i', 'background:var(--primary)');
        has('.pd.at i', 'background:var(--line-2);box-shadow:0 0 0 3px var(--bg),0 0 0 5px var(--fill)');
        has('.pd.at.on i', 'background:var(--primary)');
        has('.p-timer', 'display:inline-flex;align-items:center;height:36px;font-family:var(--font-display);font-size:var(--fs-xl);font-weight:700;line-height:1;color:var(--ink);opacity:.65;letter-spacing:var(--ls-xl);font-variant-numeric:tabular-nums');
        if (/background|border-radius|padding/.test(rule('.p-timer'))) e.push('.p-timer must have no capsule (no background, corners or padding)');
        has('.qz.paper .p-timer', 'position:relative;top:-12px');
        has('.tm-d i.out', 'animation:tm-out var(--t-pop) var(--ease-std) forwards');
        has('.tm-d i.in', 'animation:tm-in var(--t-pop) var(--ease-pop)');
        has('.qz .q-result.p-end', 'background:var(--miss-sheet)');
        for (const line of ["'<div class=\"page bg-practice practice qz paper\">",
                            "'<div class=\"q-dock\"><button type=\"button\" class=\"btn q-skip\" data-act=\"p-skip\">Skip</button>'",
                            "'<button type=\"button\" class=\"btn btn-primary btn-check' + (S.ckRise && chosen ? ' rise' : '') + '\" data-act=\"p-next\"' + (chosen ? '' : ' disabled') + '>Next</button></div>'",
                            "'<button type=\"button\" class=\"btn qr-go plain\" data-act=\"p-submit-yes\">Submit</button></div></div>'",
                            "(miss ? miss + ' not answered' : 'All ' + n + ' answered')",
                            "if (S.i < S.items.length - 1 && !S.pSeen) { paperMove(S.i + 1); return; }",
                            "'<i class=\"out\" aria-hidden=\"true\">' + was.charAt(k) + '</i><i class=\"in\">' + t.charAt(k) + '</i>'"])
          if (!js.includes(line)) e.push('the app must keep: ' + line);
        const ph = js.slice(js.indexOf('function paperHtml()'), js.indexOf('function paperDots()'));
        if (/opt-key|q-progress|q-card|p-count|Previous/.test(ph)) e.push('the paper must not bring back the (1)-(4) keys, the bar, the card, the count or Previous');
        return e;
      } }
  ];
  for (const f of FINAL) { const e = f.test(); if (e.length) bad('FINAL (' + f.since + ', ' + f.status + ') ' + f.what + ': ' + e.join('; ')); else ok('FINAL holds: ' + f.what + ' (' + f.since + ', ' + f.status + ')'); }
})();

// 2b. THE DESIGN SYSTEM KEEPS ITSELF (3.21.0, DESIGN.md §10). The style sheet is read rule by rule:
//   - a token that is used must exist (a mistyped var(--name) draws nothing and says nothing), and a token of the light
//     look must be one of the dark look's;
//   - whatever is written into a rule instead of coming from the system is DESIGN DEBT: a space off the 4 pt grid, a colour,
//     a corner, a time or a curve that is not a token, a text size outside the scale. Every such line that exists today is
//     listed in .github/design-debt.txt. A line that is not on the list fails the check, so the list can only get
//     shorter: the app cannot drift, whoever changes it.
//   The splash, the celebrations, the sparks and the loading marks are moves made by hand (DESIGN.md §7, "celebrate"):
//   their times and curves are their own. "node .github/scripts/check.js --write-debt" writes the list again (after a
//   clean-up, or for a line that must stay: say why in the pull request); "--design" runs the checks without the browser.
const DEBT_FILE = path.join(ROOT, '.github', 'design-debt.txt');
function designDebt() {
  const css = ((html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '').replace(/\/\*[\s\S]*?\*\//g, ''), rules = [];
  (function walk(s, at) {
    let i = 0;
    while (i < s.length) {
      const o = s.indexOf('{', i); if (o < 0) break;
      const sel = s.slice(i, o).trim().replace(/\s+/g, ' ');
      let d = 1, j = o + 1; while (j < s.length && d) { if (s[j] === '{') d++; else if (s[j] === '}') d--; j++; }
      const body = s.slice(o + 1, j - 1);
      if (/^@(media|supports)/.test(sel)) walk(body, sel + ' ');
      else if (!/^@/.test(sel)) rules.push({ sel: at + sel, decls: body.split(';').map(x => x.trim()).filter(Boolean).map(x => { const k = x.indexOf(':'); return [x.slice(0, k).trim(), x.slice(k + 1).trim().replace(/\s+/g, ' ')]; }) });
      i = j;
    }
  })(css, '');
  const isTokens = r => /(^| )(:root|\[data-theme="light"\]|html\.on-splash)$/.test(r.sel);
  const byHand = /\.(sp-|cele|sk-|spark|xp-fly|skel|spin\b|ripple|lock-mid)|\.screen\.sp-out|\.screen\[data-screen="splash"\]|\.splash\b/;
  const defined = new Set(), dark = new Set(), light = new Set(), used = new Map(), debt = [];
  const inScript = new Set((scripts.join('\n').match(/--[a-z][a-z0-9-]*/g) || []));          // set by the app itself (style="--i:3")
  for (const r of rules) for (const [prop, val] of r.decls) {
    if (prop.startsWith('--')) { defined.add(prop); if (/(^| ):root$/.test(r.sel)) dark.add(prop); if (r.sel === '[data-theme="light"]') light.add(prop); }
    for (const m of val.matchAll(/var\((--[\w-]+)/g)) if (!used.has(m[1])) used.set(m[1], r.sel);
    if (isTokens(r)) continue;
    const add = kind => debt.push(kind + '  ' + r.sel + ' { ' + prop + ':' + val + ' }');
    if (/^(margin|padding)(-(top|right|bottom|left))?$|^(grid-|row-|column-)?gap$/.test(prop) &&
        [...val.matchAll(/(-?\d*\.?\d+)px/g)].some(m => { const v = Math.abs(parseFloat(m[1])); return v > 2 && v % 4 !== 0; })) add('offGrid ');
    if (!/mask/.test(prop) && !prop.startsWith('--') && /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(/.test(val)) add('rawColor');
    if (/^border(-(top|bottom)-(left|right))?-radius$/.test(prop) && /\d+px/.test(val.replace(/calc\([^()]*var\([^)]*\)[^()]*\)/g, '').replace(/var\([^)]*\)/g, ''))) add('rawRadius');   // (a sum made from a token is the system's)
    if (/^(transition|animation)(-duration|-delay)?$/.test(prop) && !byHand.test(r.sel)) {
      const v = val.replace(/var\([^)]*\)/g, '').replace(/cubic-bezier\([^)]*\)/g, 'CB');
      if ((v.match(/(^|[ ,])\d*\.?\d+m?s\b/g) || []).some(t => parseFloat(t.replace(/^[ ,]/, '')) > 0)) add('rawTime ');     // (0s is no time)
      if (/CB|\bease(-in|-out|-in-out)?\b/.test(v)) add('rawEase ');
    }
    if (prop === 'font-size' && /^\d*\.?\d+px$/.test(val)) add('rawSize ');
  }
  const undef = [...used].filter(([t]) => !defined.has(t) && !inScript.has(t)), lightOnly = [...light].filter(t => !dark.has(t));
  return { debt: debt.sort(), undef, lightOnly };
}
{
  const d = designDebt(), count = k => d.debt.filter(x => x.startsWith(k)).length;
  const head = '# IOPET design debt (see .github/scripts/check.js, 2b, and DESIGN.md §10). Written by: node .github/scripts/check.js --write-debt\n' +
    '# Every line is something written into a rule that is not from the system. A line that is not here fails the check.\n';
  if (process.argv.includes('--write-debt')) { fs.writeFileSync(DEBT_FILE, head + d.debt.join('\n') + '\n'); console.log('wrote ' + d.debt.length + ' lines to .github/design-debt.txt'); process.exit(0); }
  if (d.undef.length) bad('design: tokens that are used but do not exist: ' + d.undef.map(([t, sel]) => t + ' (in ' + sel + ')').join(', ')); else ok('design: every token that is used exists');
  if (d.lightOnly.length) bad('design: tokens of the light look that the dark look does not have: ' + d.lightOnly.join(', ')); else ok('design: the light look only redefines tokens of the dark look');
  let listed = null;
  try { listed = fs.readFileSync(DEBT_FILE, 'utf8').split('\n').filter(l => l && l[0] !== '#'); } catch (e) { bad('design: .github/design-debt.txt is missing (node .github/scripts/check.js --write-debt)'); }
  if (listed) {
    const left = listed.slice(), fresh = [];
    for (const x of d.debt) { const i = left.indexOf(x); if (i < 0) fresh.push(x); else left.splice(i, 1); }
    if (fresh.length) bad('design: ' + fresh.length + ' new line(s) outside the system (DESIGN.md §10). Use a token or a value of the scale; a line that must stay goes on the list with --write-debt, with the reason in the pull request:\n      ' + fresh.slice(0, 25).join('\n      ') + (fresh.length > 25 ? '\n      … and ' + (fresh.length - 25) + ' more' : ''));
    else ok('design: nothing new outside the system; debt left: ' + ['offGrid', 'rawColor', 'rawRadius', 'rawTime', 'rawEase', 'rawSize'].map(k => k + ' ' + count(k)).join(', ') + (left.length ? ' (' + left.length + ' listed line(s) are gone: --write-debt shortens the list)' : ''));
  }
  if (process.argv.includes('--design')) { console.log(failed ? '\n' + failed + ' check(s) failed' : '\nstatic checks passed'); process.exit(failed ? 1 : 0); }
}

// 3. in a browser
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
(async () => {
  const { chromium } = require('playwright');
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/', browser = await chromium.launch();
  /* 3.24.0 Phase 15: the geometry of the system, measured on every page the walk below opens (DESIGN.md §12). A page breaks it
     when a button is not 48 px high with round ends (Brilliant's, 3.40.0 / 3.40.1; 44 for the small button inside a card),
     a docked button is not 20 px over the bottom, a block of the page does
     not stand 24 px from both sides, the top-left mark is not at 12,12 (the X's place; 3.37.0), or a page's header is not 16 px over its first
     block. Each rule was measured on all 74 states of the app before it was written down. */
  const GEO = `(function () {
    var out = [], vw = innerWidth, vh = innerHeight, cs = function (e) { return getComputedStyle(e); };
    function shown(e) { var r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= vh) return false;
      for (var p = e; p && p !== document.documentElement; p = p.parentElement) { var s = cs(p); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; } return true; }
    function name(e) { return '"' + (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 22) + '"'; }
    var root = document.querySelector('#modal.open') || document.querySelector('#screens > .screen') || document.body;
    Array.prototype.forEach.call(root.querySelectorAll('.btn'), function (b) {
      if (!shown(b)) return; var r = b.getBoundingClientRect(), want = b.classList.contains('sh-btn') ? 44 : 48, corner = '999px';
      if (Math.round(r.height) !== want) out.push('button ' + name(b) + ' is ' + Math.round(r.height) + ' px high, not ' + want);
      if (cs(b).borderTopLeftRadius !== corner) out.push('button ' + name(b) + ' has ' + cs(b).borderTopLeftRadius + ' corners, not ' + corner);
    });
    var page = root.querySelector('.page'), blocks = page ? Array.prototype.slice.call(page.children) : [];
    Array.prototype.forEach.call(root.querySelectorAll('.au-sheet .au-iw, .au-sheet .btn, .au-dock'), function (e) { blocks.push(e); });
    blocks.forEach(function (e) {
      if (!shown(e) || parseFloat(cs(e).marginLeft) < 0) return;            // a gutter wrapper (margin -4 px): its chips stand on the line
      var r = e.getBoundingClientRect(); if (r.width < vw * 0.5 || r.width > vw - 2) return;
      var l = Math.round(r.left), g = Math.round(vw - r.right);
      if (l !== 24 || g !== 24) out.push(String(e.className).split(' ')[0] + ' ' + name(e) + ' stands ' + l + ' / ' + g + ' px from the sides, not 24');
    });
    var back = root.querySelector('.sub-header [data-act=back], .au-top [data-act=back], .sm-top [data-act=home]');
    if (back && shown(back)) { var br = back.getBoundingClientRect(); if (Math.round(br.left) !== 12 || Math.round(br.top) !== 12) out.push('the top-left mark stands at ' + Math.round(br.left) + ',' + Math.round(br.top) + ', not 12,12 (the place of the X, 3.37.0)'); }
    var sh = root.querySelector('.sub-header');
    if (sh && shown(sh)) { var n = sh.nextElementSibling; while (n && !shown(n)) n = n.nextElementSibling;
      if (n && !n.classList.contains('sub')) { var gap = Math.round(n.getBoundingClientRect().top - sh.getBoundingClientRect().bottom); if (gap !== 16) out.push('the header is ' + gap + ' px over the first block, not 16'); } }
    var chk = root.querySelector('.btn-check[disabled]');
    if (chk && shown(chk)) { var t = document.createElement('i'); t.style.background = 'var(--off)'; document.body.appendChild(t);
      var want = cs(t).backgroundColor; t.remove(); if (cs(chk).backgroundColor !== want) out.push('the not-ready Check is ' + cs(chk).backgroundColor + ', not the one not-ready grey ' + want); }
    Array.prototype.forEach.call(root.querySelectorAll('.q-dock .btn, .sm-dock .btn'), function (b) {
      if (!shown(b)) return; var off = Math.round(vh - b.getBoundingClientRect().bottom), want = 20; if (off !== want) out.push('docked button ' + name(b) + ' is ' + off + ' px over the bottom, not ' + want); });
    return out;
  })()`;
  for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme, serviceWorkers: 'block' });
    const page = await ctx.newPage(), errs = [];
    page.on('pageerror', e => errs.push('script error: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    const step = async (name, fn) => {
      try { await fn(); ok(theme + ': ' + name); return true; } catch (e) {
        bad(theme + ': ' + name + ' — ' + String(e.message).split('\n')[0]);
        try { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, theme + '-' + name.replace(/\W+/g, '-') + '.png') }); } catch (e2) { /* no picture */ }
        return false;
      }
    };
    const click = async (sel, wait) => { await page.locator(sel).first().click({ timeout: 8000 }); await page.waitForTimeout(wait || 700); };
    const geo = async where => { const bad = await page.evaluate(GEO); if (bad.length) throw new Error(where + ': ' + bad.join('; ')); };
    const go = await step('splash with the name', async () => { await page.goto(base + 'index.html'); await page.locator('.splash .sp-word').waitFor({ state: 'attached', timeout: 5000 }); })
      && await step('sign-in screen after the splash', async () => {
        await page.locator('.splash').waitFor({ state: 'detached', timeout: 8000 });      // gone, light and all (taps wait until then)
        await page.locator('[data-act=guest]').first().waitFor({ state: 'visible', timeout: 3000 }); await page.waitForTimeout(400);
        await geo('the sign-in page');
      })
      && await step('the terms line stands above the ways in, with no box (3.46.0)', async () => {
        if (await page.locator('.au-cb').count()) throw new Error('a terms box is back: the line above the ways in is the agreement');
        const t = await page.evaluate(() => { const l = document.querySelector('.au-terms'), g = document.querySelector('.au-g'); return l && g ? { above: l.getBoundingClientRect().bottom <= g.getBoundingClientRect().top, links: l.querySelectorAll('[data-to=terms],[data-to=privacy]').length } : null; });
        if (t && (!t.above || t.links !== 2)) throw new Error('the terms line must stand above Continue with Google and name both pages');
      })
      && await step('guest and course choice', async () => {
        await click('[data-act=guest]'); await click('[data-act=course-open][data-id=x]'); await click('[data-act=course-open][data-id=x-nmms]'); await click('[data-act=course-open][data-id=x-nmms-hi]', 1500);
        await page.locator('[data-act=tab][data-tab=topics]').first().waitFor({ state: 'visible', timeout: 8000 });
      })
      && await step('the four tabs, each in the system', async () => { for (const t of ['topics', 'progress', 'profile', 'home']) { await click('[data-act=tab][data-tab=' + t + ']'); await geo('the ' + t + ' tab'); } })
      && await step("Home's one button clear of the bar, on a tall phone and a short one", async () => {   // 3.28.0: the card is at the bottom
        const vp = page.viewportSize();
        for (const [w, h] of [[390, 844], [360, 640]]) {
          await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
          const m = await page.evaluate(() => { const b = document.querySelector('.hm-card .btn, .hm-more .link'), n = document.querySelector('.bottom-nav'); return b && n ? [b.getBoundingClientRect().bottom, n.getBoundingClientRect().top] : null; });
          if (!m) throw new Error('Home has no button');
          if (m[0] > m[1] - 28) throw new Error(w + 'x' + h + ': the button ends at ' + Math.round(m[0]) + ' px, the bar (with its 28 px fade) starts at ' + Math.round(m[1] - 28));
        }
        await page.setViewportSize(vp); await page.waitForTimeout(300);
      })
      && await step('the pages behind the You tab, each in the system', async () => {
        await click('[data-act=tab][data-tab=profile]');
        for (const way of [['account'], ['account', 'privacy'], ['account', 'terms'], ['notifications'], ['settings'], ['help']]) {
          for (const to of way) await click('[data-act=go][data-to=' + to + ']');
          await geo('the ' + way[way.length - 1] + ' page');
          for (let i = 0; i < way.length; i++) await click('[data-act=back]');
        }
      })
      && await step('a chapter and one question checked', async () => {
        await click('[data-act=tab][data-tab=topics]'); await click('[data-act=chapter][data-ch=cl]'); await geo('a chapter'); await click('.chapter [data-act=start].btn', 1200); await geo('a question before a choice');
        await click('[data-act=pick][data-i="0"]', 400); await click('[data-act=check]', 900);
        await page.locator('#fb').first().waitFor({ state: 'visible', timeout: 5000 });   // the answer's result (3.12.0: the result panel)
      });
    if (errs.length) bad(theme + ': errors in the page:\n      ' + errs.join('\n      ')); else if (go) ok(theme + ': no script errors');
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(failed ? '\n' + failed + ' check(s) failed' : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.log('FAIL  ' + e.stack); process.exit(1); });
