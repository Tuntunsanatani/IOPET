/* IOPET — the small helper behind the installed app (3.7.1).

   It lets the app open without internet and keeps it up to date. It looks only at the app's own files, at this same address:
   sign-in and the backup in the cloud go straight to Google, past it — it never sees, keeps or changes any of them.

   The app itself (index.html): every time it is opened, the newest copy is asked for. With no internet, or when the internet is too
   slow to answer within WAIT_MS, the copy kept on the phone opens at once, and the new one, when it arrives, is kept for the next
   time. So a new version reaches every phone the next time the app is opened, and nobody stays stuck on an old one.
   The pictures (icons), the font and the manifest: kept on the phone, renewed with every new version of this file. */
'use strict';
var VERSION = '3.9.1';
var CACHE = 'iopet-' + VERSION;
var FILES = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'maskable-192.png', 'maskable-512.png',
  'mukta-400.woff2', 'mukta-600.woff2', 'mukta-700.woff2', 'mukta-hi-400.woff2', 'mukta-hi-600.woff2', 'mukta-hi-700.woff2'];   // 3.9.0 the font
var WAIT_MS = 3000;

self.addEventListener('install', function (e) {
  /* 'no-cache': ask the server whether the copy the browser already has is still the newest (it usually is, and then nothing
     is downloaded twice) */
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'no-cache' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('iopet-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function appUrl() { return new URL('./', self.location.href).href; }
function isApp(url) {
  var p = new URL('./', self.location.href).pathname;
  return url.pathname === p || url.pathname === p + 'index.html';
}
function kept() { return caches.open(CACHE).then(function (c) { return c.match(appUrl(), { ignoreVary: true }); }); }
/* a page may not be answered with a redirect: the same page, without it */
function plain(r) {
  if (!r.redirected) return r;
  return r.blob().then(function (b) { return new Response(b, { status: r.status, statusText: r.statusText, headers: r.headers }); });
}

function openApp(e) {
  var saved = null;
  var net = fetch(new Request(appUrl(), { cache: 'no-cache', credentials: 'same-origin' })).then(function (r) {
    if (!r || !r.ok || r.type !== 'basic') throw new Error('no app at this address');
    var copy = r.clone();
    saved = caches.open(CACHE).then(function (c) { return c.put(appUrl(), copy); });
    return r;
  });
  e.waitUntil(net.then(function () { return saved; }).catch(function () {}));          // a late answer is still kept for next time
  return new Promise(function (resolve) {
    var done = false;
    function give(r) { if (!done && r) { done = true; resolve(r); } }
    var timer = setTimeout(function () { kept().then(give); }, WAIT_MS);
    net.then(function (r) { clearTimeout(timer); give(plain(r)); }, function () {
      clearTimeout(timer);
      kept().then(function (r) {
        if (r) give(r);
        else if (!done) { done = true; resolve(fetch(e.request)); }                    // nothing kept yet: the browser's own "no internet" page
      });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request, url;
  if (req.method !== 'GET') return;
  url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                // sign-in, the cloud backup: not ours
  if (req.mode === 'navigate') {
    if (isApp(url)) e.respondWith(openApp(e));
    return;
  }
  if (isApp(url)) return;
  e.respondWith(caches.match(req, { ignoreSearch: true, ignoreVary: true }).then(function (hit) { return hit || fetch(req); }));
});
