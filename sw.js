/* ShiCards offline helper.
   - The app page itself: try the internet first (so updates arrive), fall back to the saved copy.
   - Fonts, libraries, icons, stroke data: use the saved copy, fetch once if missing.
   - Pinyin lookups are never cached here (the app caches them itself). */
const CACHE = 'moka2-v348';   // moka2 test copy: its own caches
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/logo.svg', './icons/seal.svg', './mascots/shi-shi.svg',
  'https://cdn.jsdelivr.net/npm/hanzi-writer@3.7.2/dist/hanzi-writer.min.js',
  'https://cdn.jsdelivr.net/npm/pinyin-pro@3.26.0/dist/index.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('moka2-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'inputtools.google.com' || url.pathname.endsWith('/version.json')) return;

  if (req.mode === 'navigate') {
    // Only the app itself is kept for offline use. Other pages on the site (the waiting list, brand pages) load from the network
    // and must never be saved as the app's index.html.
    const home = new URL('./', self.registration.scope).pathname;
    if (url.pathname !== home && url.pathname !== home + 'index.html') return;
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  const cacheable = url.origin === location.origin || /(^|\.)(jsdelivr\.net|googleapis\.com|gstatic\.com|fontshare\.com)$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});

/* Daily reminder from Shi Shi: the scheduled job in the log repo sends { title, body }; tapping it opens the app on Home. */
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  const dot = self.navigator.setAppBadge ? self.navigator.setAppBadge().catch(() => {}) : null;   // the app icon's dot: today's round is still open
  e.waitUntil(Promise.all([dot, self.registration.showNotification(d.title || 'Shi Shi is waiting for you 🦁', {
    body: d.body || 'A quick round keeps your streak going.', icon: './icons/icon-192.png', tag: 'shicards-daily', renotify: true, data: { url: './#/' },
  })]));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => x.url.includes('/moka2/')) || cs[0];
    return c ? c.focus() : self.clients.openWindow(e.notification.data?.url || './');
  }));
});
