const C='fs2-v39',F=['./','index.html','app.js','fragen.js','fragen2.js','gen.js','hazard.js','fragen3.js','icon-180.png','icon-512.png','manifest.webmanifest','icon.svg','vendor/three.min.js','twingo3d.js','snd/motor.m4a','img/stage0.png','img/stage1.png','img/stage2.png','img/stage3.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
