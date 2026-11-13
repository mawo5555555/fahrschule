const C='fs2-v29',F=['./','index.html','app.js','fragen.js','fragen2.js','gen.js','hazard.js','manifest.webmanifest','icon.svg','vendor/three.min.js','twingo3d.js','img/stage0.png','img/stage1.png','img/stage2.png','img/stage3.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
