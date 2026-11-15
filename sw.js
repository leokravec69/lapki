const C='lapki-v4';
const FILES=['./','index.html','manifest.json','icon-180.png','icon-512.png','icon-192.png','icon-maskable.png','help.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='ics').map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(new URL(e.request.url).origin!==location.origin)return;
  if(new URL(e.request.url).pathname.endsWith('/calendar.ics')){e.respondWith(caches.open('ics').then(c=>c.match('calendar.ics')).then(r=>r||new Response('',{status:404})));return}
  e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});
