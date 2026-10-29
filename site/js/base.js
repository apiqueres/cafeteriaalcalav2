/* Alcalà Cafetería · Baristas — base.js
   Lo común de todas las páginas: telón de entrada, titulares palabra a palabra, scroll suave (Lenis),
   láminas apiladas con --entra / --cubre, snap suave en escritorio, entradas al asomar,
   barra de arriba, menú de móvil, selector de idioma, cintas y año del pie. */
(function(){
  var REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lim = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };
  var yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();

  /* ---------- titulares: cada palabra en su ventanita ---------- */
  document.querySelectorAll('.titular').forEach(function(t){
    var i = 0;
    [].slice.call(t.childNodes).forEach(function(n){
      if(n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function(trozo){
        if(!trozo) return;
        if(/^\s+$/.test(trozo)){ frag.appendChild(document.createTextNode(' ')); return; }
        var fuera = document.createElement('span'); fuera.className = 'pal';
        var dentro = document.createElement('span'); dentro.textContent = trozo; dentro.style.setProperty('--i', i++);
        fuera.appendChild(dentro); frag.appendChild(fuera);
      });
      t.replaceChild(frag, n);
    });
  });

  /* ---------- scroll suave ---------- */
  var lenis = null;
  if(window.Lenis && !REDUCIR){
    try{ lenis = new Lenis({ lerp: .09 }); window._lenis = lenis; (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0); }
    catch(e){ document.documentElement.style.scrollBehavior = 'smooth'; }
  } else document.documentElement.style.scrollBehavior = REDUCIR ? 'auto' : 'smooth';

  /* ---------- láminas ---------- */
  var laminas = [].slice.call(document.querySelectorAll('.lamina'));
  var avance = document.getElementById('avance'), nav = document.getElementById('nav'), pagina = document.getElementById('pagina');
  var navFondo = false;
  var pendientes = REDUCIR ? [] : [].slice.call(document.querySelectorAll('.rv, .foto, .titular, [data-entra]'));
  function mostrar(el){
    if(el.classList.contains('in')) return; el.classList.add('in');
    if(el.dataset.entra){ var fn = window[el.dataset.entra]; if(typeof fn === 'function') fn(el); }
  }
  if(REDUCIR) [].slice.call(document.querySelectorAll('.rv, .foto, .titular, [data-entra]')).forEach(mostrar);
  window.__mostrarTodo = function(){ pendientes.forEach(mostrar); pendientes.length = 0; };

  function sitioDe(el){
    if(!el) return 0;
    if(el.id === 'inicio') return 0;
    var i = laminas.indexOf(el); if(i < 0 || !pagina) return el.getBoundingClientRect().top + scrollY;
    var y = pagina.offsetTop;
    for(var k = 0; k < i; k++) y += laminas[k].offsetHeight;
    return y;
  }
  window.__sitioDe = sitioDe;

  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if(!a) return;
    var id = a.getAttribute('href').slice(1); var el = id ? document.getElementById(id) : null; if(!el) return;
    e.preventDefault(); var y = sitioDe(el);
    if(lenis){ lenis.scrollTo(y, { duration: 1.3 }); setTimeout(function(){ if(Math.abs(scrollY - y) > 6 && !lenis.isScrolling) scrollTo(0, y); }, 1900); }
    else scrollTo({ top: y, behavior: REDUCIR ? 'auto' : 'smooth' });
  });

  /* snap suave: sólo en escritorio, donde las láminas se apilan */
  var apilado = matchMedia('(min-width:900px) and (min-height:600px)');
  if(lenis) (function(){
    var espera = null, encajando = false, dir = 1;
    function puntos(){ var p = [0]; laminas.forEach(function(l){ if(!l.classList.contains('lamina--libre')) p.push(sitioDe(l)); }); return p; }
    function encajar(){
      if(!apilado.matches || encajando || lenis.isStopped || document.body.style.overflow === 'hidden') return;
      var y = lenis.animatedScroll, P = puntos(), ultimo = P[P.length - 1];
      if(y >= ultimo - 2) return;
      for(var i = 0; i < P.length - 1; i++){
        var a = P[i], b = P[i + 1]; if(y < a - 2 || y >= b) continue;
        var d = y - a, umbral = (b - a) * .1; if(d < 3 || b - y < 3) return;
        var destino = dir > 0 ? (d > umbral ? b : a) : (b - y > umbral ? a : b);
        encajando = true;
        lenis.scrollTo(destino, { duration: .9, easing: function(t){ return 1 - Math.pow(1 - t, 3); }, onComplete: function(){ encajando = false; } });
        setTimeout(function(){ encajando = false; }, 1400);
        return;
      }
    }
    lenis.on('scroll', function(l){ if(l.direction) dir = l.direction; clearTimeout(espera); if(!encajando) espera = setTimeout(encajar, 160); });
  })();

  function actualizar(){
    var H = innerHeight, max = document.documentElement.scrollHeight - H;
    if(avance) avance.style.transform = 'scaleX(' + (max > 0 ? lim(scrollY / max) : 0).toFixed(4) + ')';
    var cajas = laminas.map(function(s){ return s.getBoundingClientRect(); });
    laminas.forEach(function(s, i){
      var entra = lim(1 - cajas[i].top / H), cubre = 0;
      if(!REDUCIR && i < laminas.length - 1 && apilado.matches) cubre = lim(1 - cajas[i + 1].top / H);
      s.style.setProperty('--entra', REDUCIR ? 1 : entra.toFixed(3));
      s.style.setProperty('--cubre', cubre.toFixed(3));
    });
    if(nav && pagina){
      var sobre = pagina.getBoundingClientRect().top <= H * .08;
      if(sobre !== navFondo){ navFondo = sobre; nav.classList.toggle('nav--fondo', sobre); if(window.__hero && window.__hero.pausar) window.__hero.pausar(sobre); }
    }
    for(var k = pendientes.length - 1; k >= 0; k--){
      var el = pendientes[k], r = el.getBoundingClientRect(), lam = el.closest('.lamina');
      var llegada = lam ? cajas[laminas.indexOf(lam)].bottom <= H + 2 && r.top < H : r.top < H * .97;
      if((r.top < H * .9 && r.bottom > 0) || (llegada && r.bottom > 0)){ mostrar(el); pendientes.splice(k, 1); }
    }
  }
  window.__actualizar = actualizar;
  var pedido = false;
  /* en pestañas en segundo plano requestAnimationFrame no se dispara: entonces se calcula directamente */
  function pedir(){ if(document.hidden){ actualizar(); return; } if(!pedido){ pedido = true; requestAnimationFrame(function(){ pedido = false; actualizar(); }); } }
  addEventListener('scroll', pedir, { passive: true }); addEventListener('resize', pedir);
  addEventListener('load', actualizar); addEventListener('pageshow', actualizar);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) actualizar(); });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(actualizar);
  setTimeout(actualizar, 60); setTimeout(actualizar, 600);

  /* ---------- menú de móvil ---------- */
  var menu = document.getElementById('menu'), mb = document.getElementById('menuBtn'), mc = document.getElementById('menuCerrar');
  if(menu && mb){
    [].slice.call(menu.querySelectorAll('a')).forEach(function(a, i){ a.style.setProperty('--i', i); });
    function abrir(v){
      menu.classList.toggle('abierto', v); mb.setAttribute('aria-expanded', v ? 'true' : 'false');
      document.body.style.overflow = v ? 'hidden' : '';
      if(lenis){ v ? lenis.stop() : lenis.start(); }
      if(v && mc) mc.focus(); else if(!v) mb.focus();
    }
    mb.addEventListener('click', function(){ abrir(true); });
    if(mc) mc.addEventListener('click', function(){ abrir(false); });
    menu.addEventListener('click', function(e){ if(e.target.tagName === 'A') abrir(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && menu.classList.contains('abierto')) abrir(false); });
  }

  /* ---------- selector de idioma ---------- */
  [].slice.call(document.querySelectorAll('[data-idiomas]')).forEach(function(caja){
    var btn = caja.querySelector('.idiomas__btn'); if(!btn) return;
    function abrir(v){ caja.classList.toggle('abierto', v); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); }
    btn.addEventListener('click', function(e){ e.stopPropagation(); abrir(!caja.classList.contains('abierto')); });
    document.addEventListener('click', function(e){ if(!caja.contains(e.target)) abrir(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') abrir(false); });
  });

  /* ---------- telón de entrada ---------- */
  var telon = document.getElementById('telon');
  if(telon){
    var t0 = performance.now(), barra = telon.querySelector('.telon__barra i'), carga = 0, cerrado = false;
    var sube = setInterval(function(){ carga += (.92 - carga) * .08; if(barra) barra.style.setProperty('--carga', carga); }, 60);
    var abrirTelon = function(){
      if(cerrado) return; cerrado = true; clearInterval(sube); if(barra) barra.style.setProperty('--carga', 1);
      var espera = Math.max(0, 900 - (performance.now() - t0));
      setTimeout(function(){ telon.classList.add('fuera'); setTimeout(function(){ telon.classList.add('quitado'); }, 1100); }, espera + 200);
    };
    var cargador = document.getElementById('loader');
    if(REDUCIR) abrirTelon();
    else if(cargador){
      if(cargador.classList.contains('hide')) abrirTelon();
      else new MutationObserver(function(){ if(cargador.classList.contains('hide')) abrirTelon(); }).observe(cargador, { attributes: true, attributeFilter: ['class'] });
    } else addEventListener('load', abrirTelon);
    setTimeout(abrirTelon, 4200);
  }

  /* ---------- cintas: se mueven solas y más deprisa con el scroll ---------- */
  var cintas = [].slice.call(document.querySelectorAll('.cinta__pista')).map(function(p, i){
    var uno = p.innerHTML; p.innerHTML = uno + uno + uno + uno; return { el: p, x: 0, dir: i % 2 ? 1 : -1, ancho: 0 };
  });
  var marquee = document.getElementById('reelsMarquee');
  if(cintas.length || marquee){
    var visibles = false, caja = document.querySelector('.cintas');
    if(caja && 'IntersectionObserver' in window) new IntersectionObserver(function(es){ visibles = es[0].isIntersecting; }).observe(caja);
    var ultY = scrollY, velS = 0, ultT = performance.now();
    (function bucle(t){
      var dt = Math.min(.05, (t - ultT) / 1000); ultT = t;
      var dy = scrollY - ultY; ultY = scrollY; velS += (dy - velS) * .12; if(Math.abs(velS) < .01) velS = 0;
      if(!REDUCIR && visibles) cintas.forEach(function(c){
        if(!c.ancho) c.ancho = c.el.scrollWidth / 4;
        c.x += c.dir * (50 + Math.min(Math.abs(velS), 60) * 18) * dt; if(c.x < -c.ancho) c.x += c.ancho; if(c.x > 0) c.x -= c.ancho;
        c.el.style.transform = 'translate3d(' + c.x.toFixed(1) + 'px,0,0)';
      });
      if(marquee && !REDUCIR) marquee.style.transform = velS ? 'skewX(' + Math.max(-5, Math.min(5, velS * -.2)).toFixed(2) + 'deg)' : '';
      requestAnimationFrame(bucle);
    })(performance.now());
  }
})();
