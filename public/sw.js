// Service worker mínimo (requisito de instalação PWA). Rede primeiro, cache como reserva.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // originais grandes (.jpg em /papeis/) não vão para o cache; miniaturas e app sim
  if (/\/papeis\/.+\.jpg$/.test(new URL(e.request.url).pathname)) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const c = r.clone(); caches.open('v3').then((k) => k.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request))
  );
});
