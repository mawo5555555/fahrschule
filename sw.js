const C='fs2-v35',F=['./','index.html','app.js','fragen.js','fragen2.js','gen.js','hazard.js','manifest.webmanifest','icon.svg','vendor/three.min.js','twingo3d.js','snd/motor.m4a','img/stage0.png','img/stage1.png','img/stage2.png','img/stage3.png','img/stage0_low1.png','img/stage0_low2.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
