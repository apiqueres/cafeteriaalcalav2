/* Alcalà — portada.js: carrusel de clips de redes.
   Los clips salen de window.CLIPS (los pondrá el servidor desde el panel); mientras no haya vídeo,
   se enseña el póster. El mp4 sólo se asigna cuando el carrusel entra en pantalla. */
(function(){
  var track = document.getElementById('reelsTrack'), sec = document.getElementById('redes');
  if(!track) return;
  var clips = window.CLIPS || [];
  var GLYPH = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>';
  var TXT = (window.I18N && window.I18N.verEn) || 'Ver en Instagram';
  function make(c, dupe){
    var a = document.createElement('a');
    a.className = 'reel'; a.href = c.destino; a.target = '_blank'; a.rel = 'noopener';
    if(dupe) a.setAttribute('aria-hidden', 'true'); else a.setAttribute('aria-label', TXT);
    var media = c.video
      ? '<video muted loop playsinline preload="none" poster="' + c.poster + '" data-src="' + c.video + '"></video>'
      : '<img src="' + c.poster + '" alt="" loading="lazy" width="384" height="848">';
    a.innerHTML = media + '<span class="reel__ring"></span><span class="reel__ig">' + GLYPH + '</span>'
      + '<span class="reel__ov"><span>' + TXT + '</span><span>↗</span></span>';
    return a;
  }
  var frag = document.createDocumentFragment();
  clips.forEach(function(c){ frag.appendChild(make(c, false)); });
  clips.forEach(function(c){ frag.appendChild(make(c, true)); });   // 2ª copia: bucle sin costuras
  track.appendChild(frag);

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if(reduce || saveData) sec.classList.add('reels--still');

  var vids = [].slice.call(track.querySelectorAll('video'));
  if(!vids.length || saveData) return;
  function ensure(v){ if(!v.getAttribute('src') && v.dataset.src) v.setAttribute('src', v.dataset.src); }
  function play(v){ ensure(v); var p = v.play(); if(p && p.catch) p.catch(function(){}); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting) vids.forEach(play); else vids.forEach(function(v){ v.pause(); }); });
    }, { threshold: .15 }).observe(sec);
  } else vids.forEach(play);
})();
