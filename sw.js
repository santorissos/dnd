// Offline podpora: pri pripojení berie vždy čerstvé súbory, bez pripojenia použije uložené.
const C="kronika-v1",F=["./","index.html","style.css","app.js","dm.js","rules.js","spells.js","art.js","data.js","icon.svg","manifest.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x))))));
self.addEventListener("fetch",e=>{if(e.request.method!="GET"||new URL(e.request.url).origin!=location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
