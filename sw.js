// MAFRA.ON — service worker (instalação como app + casca offline)
const CACHE='mafraon-v231';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png'])));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'reload'}).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put('./index.html',cp)); return r; })
      .catch(()=>caches.match('./index.html')));
  }
});
// ===== Web Push (avisos) =====
self.addEventListener('push',e=>{
  let d={};
  try{ d=e.data?e.data.json():{}; }catch(_){ d={ title:'MAFRA.ON', body:(e.data&&e.data.text&&e.data.text())||'' }; }
  const title=d.title||'MAFRA.ON';
  const opts={ body:d.body||'', icon:'./icon-192.png', badge:'./icon-192.png', data:{ chamado_id:d.chamado_id||null } };
  if(d.tag) opts.tag=d.tag;
  e.waitUntil(self.registration.showNotification(title, opts));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){ if('focus' in c){ return c.focus(); } }
    if(self.clients.openWindow) return self.clients.openWindow('./');
  }));
});
