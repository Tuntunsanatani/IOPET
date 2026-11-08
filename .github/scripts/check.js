/* IOPET checks, run by .github/workflows/check.yml on every pull request and every push to main.
   Locally: npm install --no-save acorn playwright && npx playwright install chromium && node .github/scripts/check.js
   1. the app's code is ES5 (it must run on old phones);  2. index.html and sw.js carry the same version, and every file the
   service worker caches is in the repo;  3. the app opens and works in a real browser, dark and light: splash (with the name),
   guest sign-in, course choice, the four tabs, a chapter, one question checked — with no script error on the way. */
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
