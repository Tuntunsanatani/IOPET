/* IOPET checks, run by .github/workflows/check.yml on every pull request and every push to main.
   Locally: npm install --no-save acorn playwright && npx playwright install chromium && node .github/scripts/check.js
   1. the app's code is ES5 (it must run on old phones);  2. index.html and sw.js carry the same version, and every file the
   service worker caches is in the repo;  3. the app opens and works in a real browser, dark and light: splash (with the name),
   guest sign-in, course choice, the four tabs, a chapter, one question checked — with no script error on the way;
   2b. the design system keeps itself: tokens exist, and nothing new is written into a rule that should come from a token. */
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
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
(async () => {
  const { chromium } = require('playwright');
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/', browser = await chromium.launch();
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
    const go = await step('splash with the name', async () => { await page.goto(base + 'index.html'); await page.locator('.splash .sp-word').waitFor({ state: 'attached', timeout: 5000 }); })
      && await step('sign-in screen after the splash', async () => {
        await page.locator('.splash').waitFor({ state: 'detached', timeout: 8000 });      // gone, light and all (taps wait until then)
        await page.locator('[data-act=guest]').first().waitFor({ state: 'visible', timeout: 3000 }); await page.waitForTimeout(400);
      })
      && await step('guest and course choice', async () => {
        await click('[data-act=guest]'); await click('[data-act=course-open][data-id=x]'); await click('[data-act=course-open][data-id=x-nmms]'); await click('[data-act=course-open][data-id=x-nmms-hi]', 1500);
        await page.locator('[data-act=tab][data-tab=topics]').first().waitFor({ state: 'visible', timeout: 8000 });
      })
      && await step('the four tabs', async () => { for (const t of ['topics', 'progress', 'profile', 'home']) await click('[data-act=tab][data-tab=' + t + ']'); })
      && await step('a chapter and one question checked', async () => {
        await click('[data-act=tab][data-tab=topics]'); await click('[data-act=chapter][data-ch=cl]'); await click('.chapter [data-act=start].btn', 1200);
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
