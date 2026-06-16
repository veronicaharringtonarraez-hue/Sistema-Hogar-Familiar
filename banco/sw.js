/* Service worker de ChildBank: instalación + uso sin conexión */
const CACHE = "childbank-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/childbank-512.png",
  "./app/data.js",
  "./app/tweaks-panel.jsx",
  "./app/store.jsx",
  "./app/components.jsx",
  "./app/screens.jsx",
  "./app/parent.jsx",
  "./app/app.jsx",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Red primero, con respaldo en caché (para abrir sin conexión).
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((r) => r || caches.match("./index.html"))
      )
  );
});
