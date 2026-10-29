/* Alcalà — carta.js: pinta la carta desde window.CARTA, pestañas pegajosas y buscador */
(function(){
  var CARTA = window.CARTA || [], ALG = window.ALERGENOS || [], ETQ = window.ETIQUETAS || {};
  /* si el panel (/administracion) ha guardado datos en este navegador, la carta los usa */
  try{
    var D = JSON.parse(localStorage.getItem('alcala.datos') || 'null');
    if(D && D.categorias){
      CARTA = D.categorias.filter(function(c){ return c.visible; }).sort(function(a, b){ return a.orden - b.orden; }).map(function(c){
        return { id: c.id, n: c.n, d: c.d, foto: c.foto, platos: D.platos.filter(function(p){ return p.cat === c.id && p.visible; }).sort(function(a, b){ return a.orden - b.orden; }) };
      }).filter(function(c){ return c.platos.length; });
    }
  }catch(e){}
  var cont = document.getElementById('cartaCont'), tabs = document.getElementById('tabs'), buscar = document.getElementById('buscar');
  if(!cont) return;
  var algNombre = {}; ALG.forEach(function(a){ algNombre[a.id] = a.n; });
  function esc(s){ return String(s || '').replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
  function icono(id){ return '<i title="' + esc(algNombre[id] || id) + '" aria-label="' + esc(algNombre[id] || id) + '"><svg><use href="#alg-' + id + '"/></svg></i>'; }
  function plato(p){
    var precio = '<div class="plato__precio">' + esc(p.p) + ' €' + (p.p2 ? '<small>' + esc(p.e2 || '') + ' ' + esc(p.p2) + ' €</small>' : '') + '</div>';
    var tags = (p.t || []).map(function(t){ return '<span class="tag tag--' + t + '">' + esc(ETQ[t] || t) + '</span>'; }).join('');
    var algs = (p.a || []).length ? '<span class="alg">' + p.a.map(icono).join('') + '</span>' : '';
    return '<article class="plato" data-busca="' + esc((p.n + ' ' + (p.d || '')).toLowerCase()) + '">'
      + '<h3 class="plato__nom">' + esc(p.n) + '</h3>' + precio
      + (p.d ? '<p class="plato__desc">' + esc(p.d) + '</p>' : '')
      + ((tags || algs) ? '<div class="plato__pie">' + tags + algs + '</div>' : '')
      + '</article>';
  }
  var html = '', tabsHtml = '';
  CARTA.forEach(function(c){
    tabsHtml += '<a href="#' + c.id + '" data-tab="' + c.id + '">' + esc(c.n) + '</a>';
    html += '<section class="cat-sec" id="' + c.id + '" data-cat>'
      + '<div class="caja"><div class="cat-sec__cab"><div><h2 class="titular t-l">' + esc(c.n) + '</h2>' + (c.d ? '<p>' + esc(c.d) + '</p>' : '') + '</div>'
      + (c.foto ? '<div class="cat-sec__foto"><img src="../media/carta/' + c.foto + '.webp" alt="" width="800" height="603" loading="lazy"></div>' : '') + '</div>'
      + '<div class="platos">' + c.platos.map(plato).join('') + '</div></div></section>';
  });
  cont.innerHTML = html;
  if(tabs) tabs.insertAdjacentHTML('afterbegin', tabsHtml);

  /* pestaña activa según scroll */
  var secs = [].slice.call(document.querySelectorAll('[data-cat]')), enlaces = tabs ? [].slice.call(tabs.querySelectorAll('[data-tab]')) : [];
  var nav = document.getElementById('nav'); if(nav) nav.classList.add('nav--fondo');
  function activa(){
    var y = scrollY + innerHeight * .35, act = secs[0];
    secs.forEach(function(s){ if(s.offsetTop <= y) act = s; });
    enlaces.forEach(function(a){
      var es = a.dataset.tab === act.id;
      if(es){ if(!a.hasAttribute('aria-current')){ a.setAttribute('aria-current', 'true'); a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } }
      else a.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', activa, { passive: true }); activa();
  enlaces.forEach(function(a){ a.addEventListener('click', function(e){
    e.preventDefault(); var s = document.getElementById(a.dataset.tab); if(!s) return;
    var y = s.offsetTop - (document.getElementById('tabs').offsetHeight + 72) + 2;
    if(window._lenis) window._lenis.scrollTo(y, { duration: 1 }); else scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', '#' + a.dataset.tab);
  }); });
  if(location.hash){ var s0 = document.getElementById(location.hash.slice(1)); if(s0) setTimeout(function(){ scrollTo(0, s0.offsetTop - 130); }, 80); }

  /* buscador */
  if(buscar) buscar.addEventListener('input', function(){
    var q = buscar.value.trim().toLowerCase();
    document.querySelectorAll('.plato').forEach(function(p){ p.style.display = !q || p.dataset.busca.indexOf(q) >= 0 ? '' : 'none'; });
    secs.forEach(function(s){ var hay = [].some.call(s.querySelectorAll('.plato'), function(p){ return p.style.display !== 'none'; }); s.style.display = hay ? '' : 'none'; });
  });
})();
