/* Alcalà — hero.js: vídeo de fondo de la pared de azulejo.
   Sólo en pantallas anchas, sin ahorro de datos y sin «reducir movimiento»; en móvil queda la foto.
   (La versión con el logo en 3D está guardada en hero-3d.js por si se vuelve a querer.) */
(function(){
  const fondo = document.querySelector('.hero__fondo'); if(!fondo) return;
  const MOVIL = matchMedia('(max-width: 640px)').matches;
  const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ahorro = navigator.connection && navigator.connection.saveData;
  if(MOVIL || REDUCIR || ahorro) return;
  const v = document.createElement('video');
  v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'metadata';
  v.setAttribute('aria-hidden', 'true'); v.style.opacity = '0'; v.style.transition = 'opacity 1.2s ease';
  v.innerHTML = '<source src="media/hero.webm" type="video/webm"><source src="media/hero.mp4" type="video/mp4">';
  v.addEventListener('playing', ()=>{ v.style.opacity = '1'; }, { once: true });
  fondo.appendChild(v);
  const p = v.play(); if(p && p.catch) p.catch(()=>{});
  document.addEventListener('visibilitychange', ()=>{ if(document.hidden) v.pause(); else { const q = v.play(); if(q && q.catch) q.catch(()=>{}); } });
  window.__hero = { pausar(x){ if(x) v.pause(); else { const q = v.play(); if(q && q.catch) q.catch(()=>{}); } } };
})();
