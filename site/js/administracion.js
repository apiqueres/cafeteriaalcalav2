/* Alcalà — administracion.js: panel de administración funcional en el navegador.
   Sin servidor todavía: los datos se guardan en localStorage (clave «alcala.datos») y la carta
   pública los lee. Cuando exista el servidor, estas mismas funciones llamarán a la API. */
(function(){
  var CLAVE = 'alcala.datos';
  var ALG = window.ALERGENOS || [], ETQ = window.ETIQUETAS || {};
  var IDIOMAS = [['es','Español'],['va','Valencià'],['en','English'],['fr','Français'],['pl','Polski'],['ru','Русский'],['uk','Українська']];
  var DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  var D = null, vista = 'inicio', sel = null, cat = null, filtro = '', toast = null;

  /* ---------- datos ---------- */
  function semilla(){
    var cats = [], platos = [], n = 1;
    (window.CARTA || []).forEach(function(c, i){
      cats.push({ id: c.id, n: c.n, d: c.d || '', foto: c.foto || '', visible: true, orden: i });
      c.platos.forEach(function(p, j){ platos.push({ id: 'p' + (n++), cat: c.id, n: p.n, d: p.d || '', p: p.p, p2: p.p2 || '', e2: p.e2 || '', a: p.a || [], t: p.t || [], visible: true, orden: j, trad: {} }); });
    });
    return { categorias: cats, platos: platos,
      local: { horario: DIAS.map(function(d){ return { d: d, abre: d === 'Jueves' ? '' : '9:00', cierra: d === 'Jueves' ? '' : '23:00', cerrado: d === 'Jueves' }; }),
        nota: 'En agosto abrimos también los jueves. Cocina abierta todo el día.', tel: '961 72 50 98', email: 'cafeteriaalcala@hotmail.es',
        dir: 'Carrer del Pintor Ferrer Cabrera, 3', cp: '46400 Cullera (València)', ig: 'cafeteriaalcala', tiktok: 'cafeteriaalcala', fb: 'cafeteria.alcala',
        frase: 'Tu punto de encuentro desde 1987.' },
      clips: [1,2,3,4,5,6,7,8,9].map(function(i){ return { id: 'c' + i, video: 'media/reels/reel' + i + '.mp4', poster: 'media/reels/reel' + i + '.webp', destino: 'https://instagram.com/cafeteriaalcala', visible: true }; }),
      registro: [], guardado: null };
  }
  function cargar(){ try{ var j = localStorage.getItem(CLAVE); if(j) return JSON.parse(j); }catch(e){} return semilla(); }
  function guardar(msg){ D.guardado = new Date().toISOString(); try{ localStorage.setItem(CLAVE, JSON.stringify(D)); }catch(e){} if(msg){ D.registro.unshift({ t: D.guardado, m: msg }); D.registro = D.registro.slice(0, 12); try{ localStorage.setItem(CLAVE, JSON.stringify(D)); }catch(e){} aviso(msg); } }
  function aviso(m){ var t = document.getElementById('toast'); if(!t) return; t.textContent = m; t.classList.add('on'); clearTimeout(toast); toast = setTimeout(function(){ t.classList.remove('on'); }, 2400); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
  function fecha(iso){ if(!iso) return 'nunca'; var d = new Date(iso); return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); }
  function catDe(id){ return D.categorias.filter(function(c){ return c.id === id; })[0]; }
  function platosDe(id){ return D.platos.filter(function(p){ return p.cat === id; }).sort(function(a, b){ return a.orden - b.orden; }); }
  /* «traducción automática» de maqueta: hasta que haya DeepL, marca el texto como pendiente de traducir */
  function traducir(p){ IDIOMAS.slice(1).forEach(function(l){ if(!p.trad[l[0]] || !p.trad[l[0]].mano) p.trad[l[0]] = { n: p.n, d: p.d, auto: true }; }); }

  /* ---------- vistas ---------- */
  var V = {};
  V.inicio = function(){
    var vis = D.platos.filter(function(p){ return p.visible; }).length;
    var sinAlg = D.platos.filter(function(p){ return !p.a.length; }).length;
    return '<div class="ad-cab"><div><h1>Hola, Bruno</h1><p>Así está la web ahora mismo.</p></div><a class="btn btn--lleno" href="#carta">Editar la carta</a></div>'
      + '<div class="kpis"><div class="kpi"><b>' + D.categorias.filter(function(c){ return c.visible; }).length + '</b><span>categorías visibles</span></div>'
      + '<div class="kpi"><b>' + vis + '</b><span>platos publicados</span></div><div class="kpi"><b>' + (D.platos.length - vis) + '</b><span>platos ocultos</span></div>'
      + '<div class="kpi"><b>' + esc(fecha(D.guardado)) + '</b><span>último cambio</span></div></div>'
      + '<div class="ad-grid"><section class="tarjeta"><h2>Últimos cambios</h2>' + (D.registro.length ? '<ul class="registro">' + D.registro.map(function(r){ return '<li><span>' + esc(fecha(r.t)) + '</span>' + esc(r.m) + '</li>'; }).join('') + '</ul>' : '<p class="nota">Todavía no has cambiado nada.</p>') + '</section>'
      + '<section class="tarjeta"><h2>Avisos</h2>'
      + (sinAlg ? '<div class="aviso"><b>' + sinAlg + ' platos</b>&nbsp;sin alérgenos marcados. Revísalos antes de publicar.</div>' : '<div class="aviso"><b>Todo en orden.</b>&nbsp;Todos los platos tienen alérgenos.</div>')
      + '<p class="nota" style="margin-top:.9rem">Los cambios se guardan en este navegador. Cuando el servidor esté en marcha, se guardarán en la web de verdad y se traducirán solos.</p>'
      + '<div class="acciones"><a class="btn btn--sin" href="#" data-accion="exportar">Exportar datos</a><a class="btn btn--rojo" href="#" data-accion="restablecer">Restablecer ejemplo</a></div></section></div>';
  };
  V.carta = function(){
    if(!cat || !catDe(cat)) cat = D.categorias[0].id;
    var lista = platosDe(cat).filter(function(p){ return !filtro || (p.n + ' ' + p.d).toLowerCase().indexOf(filtro) >= 0; });
    return '<div class="ad-cab"><div><h1>Carta</h1><p>Cambia un plato y la web se actualiza al momento.</p></div><a class="btn btn--lleno" href="#" data-accion="nuevo">+ Nuevo plato</a></div>'
      + '<div class="ad-grid"><section class="tarjeta"><h2>Platos <label class="buscar-ad"><input type="search" id="buscaAd" placeholder="Buscar…" value="' + esc(filtro) + '"></label></h2>'
      + '<div class="cat-tabs">' + D.categorias.slice().sort(function(a, b){ return a.orden - b.orden; }).map(function(c){ return '<span data-cat="' + c.id + '" class="' + (c.id === cat ? 'on' : '') + (c.visible ? '' : ' oculta') + '">' + esc(c.n) + '</span>'; }).join('') + '</div>'
      + '<div class="lista">' + (lista.length ? lista.map(function(p, i){ var c = catDe(p.cat); return '<div class="fila' + (sel === p.id ? ' activo' : '') + (p.visible ? '' : ' off') + '" data-id="' + p.id + '">'
        + '<span class="orden"><button data-mover="-1" data-id="' + p.id + '" aria-label="Subir">▲</button><button data-mover="1" data-id="' + p.id + '" aria-label="Bajar">▼</button></span>'
        + '<img src="../media/carta/' + esc(c && c.foto || 'cafes') + '.webp" alt="">'
        + '<div class="nom">' + esc(p.n) + '<small>' + esc(p.d || 'Sin descripción') + '</small></div><span class="precio">' + esc(p.p) + ' €</span>'
        + '<span class="interruptor' + (p.visible ? '' : ' off') + '" data-visible="' + p.id + '" title="' + (p.visible ? 'Visible' : 'Oculto') + '"></span></div>'; }).join('') : '<p class="nota">No hay platos en esta categoría.</p>') + '</div></section>'
      + '<section class="tarjeta" id="editor">' + (sel ? editor(D.platos.filter(function(p){ return p.id === sel; })[0]) : '<h2>Editar plato</h2><p class="nota">Elige un plato de la lista o crea uno nuevo.</p>') + '</section></div>';
  };
  function editor(p){
    if(!p) return '';
    var idioma = p._idioma || 'es';
    var tr = idioma === 'es' ? { n: p.n, d: p.d } : (p.trad[idioma] || { n: '', d: '' });
    return '<h2>Editar plato <a class="btn btn--sin" href="../carta/#' + esc(p.cat) + '" target="_blank">Ver en la web ↗</a></h2>'
      + '<div class="idiomas-tabs">' + IDIOMAS.map(function(l){ var t = p.trad[l[0]]; return '<span data-idioma="' + l[0] + '" class="' + (l[0] === idioma ? 'on' : '') + (t && t.auto ? ' auto' : '') + (t && t.mano ? ' mano' : '') + '">' + l[0].toUpperCase() + '</span>'; }).join('') + '</div>'
      + '<p class="nota">' + (idioma === 'es' ? '✦ Al guardar se traduce solo a los otros 6 idiomas. Toca un idioma para corregirlo a mano.' : (tr.auto ? '✦ Traducción automática (pendiente de DeepL en el servidor). Si la corriges, se queda la tuya.' : 'Traducción corregida a mano.')) + '</p>'
      + '<div class="campo"><label>Nombre' + (idioma !== 'es' ? ' (' + idioma.toUpperCase() + ')' : '') + '</label><input id="f-n" value="' + esc(tr.n) + '"></div>'
      + '<div class="campo"><label>Descripción</label><textarea id="f-d">' + esc(tr.d) + '</textarea></div>'
      + (idioma === 'es' ? '<div class="dos"><div class="campo"><label>Precio (€)</label><input id="f-p" value="' + esc(p.p) + '"></div><div class="campo"><label>Categoría</label><select id="f-cat">' + D.categorias.map(function(c){ return '<option value="' + c.id + '"' + (c.id === p.cat ? ' selected' : '') + '>' + esc(c.n) + '</option>'; }).join('') + '</select></div></div>'
      + '<div class="dos"><div class="campo"><label>Segundo precio (€) <span class="op">opcional</span></label><input id="f-p2" value="' + esc(p.p2) + '" placeholder="p. ej. 10,00"></div><div class="campo"><label>Etiqueta del segundo precio</label><input id="f-e2" value="' + esc(p.e2) + '" placeholder="p. ej. 3 variantes, media, botella"></div></div>'
      + '<div class="campo"><label>Etiquetas</label><div class="etiquetas">' + Object.keys(ETQ).map(function(k){ return '<span data-tag="' + k + '" class="' + (p.t.indexOf(k) >= 0 ? 'on' : '') + '">' + esc(ETQ[k]) + '</span>'; }).join('') + '</div></div>'
      + '<div class="campo"><label>Alérgenos <span class="op">marca los que contiene</span></label><div class="alergenos">' + ALG.map(function(a){ var on = p.a.indexOf(a.id) >= 0; return '<label class="' + (on ? 'on' : '') + '"><input type="checkbox" data-alg="' + a.id + '"' + (on ? ' checked' : '') + '>' + esc(a.n) + '</label>'; }).join('') + '</div></div>'
      + '<div class="aviso"><b>' + (p.visible ? 'Visible' : 'Oculto') + '</b>&nbsp;en la web. <a href="#" data-accion="alternar" style="margin-left:auto;text-decoration:underline">' + (p.visible ? 'Ocultar sin borrar' : 'Volver a publicar') + '</a></div>' : '')
      + '<div class="acciones"><a class="btn btn--rojo" href="#" data-accion="borrar">Borrar</a><a class="btn" href="#" data-accion="cancelar">Cancelar</a><a class="btn btn--lleno" href="#" data-accion="guardar">' + (idioma === 'es' ? 'Guardar y traducir' : 'Guardar traducción') + '</a></div>';
  }
  V.categorias = function(){
    return '<div class="ad-cab"><div><h1>Categorías</h1><p>Orden en que salen en la carta. Ocultar una categoría oculta sus platos.</p></div><a class="btn btn--lleno" href="#" data-accion="nuevaCat">+ Nueva categoría</a></div>'
      + '<section class="tarjeta"><div class="lista">' + D.categorias.slice().sort(function(a, b){ return a.orden - b.orden; }).map(function(c){ return '<div class="fila' + (c.visible ? '' : ' off') + '">'
        + '<span class="orden"><button data-movercat="-1" data-id="' + c.id + '" aria-label="Subir">▲</button><button data-movercat="1" data-id="' + c.id + '" aria-label="Bajar">▼</button></span>'
        + '<img src="../media/carta/' + esc(c.foto || 'cafes') + '.webp" alt="">'
        + '<div class="nom"><input class="enlinea" data-catn="' + c.id + '" value="' + esc(c.n) + '"><small><input class="enlinea" data-catd="' + c.id + '" value="' + esc(c.d) + '" placeholder="Frase corta de la categoría"></small></div>'
        + '<span class="precio">' + platosDe(c.id).length + ' platos</span><span class="interruptor' + (c.visible ? '' : ' off') + '" data-visiblecat="' + c.id + '"></span></div>'; }).join('') + '</div>'
      + '<div class="acciones"><a class="btn btn--lleno" href="#" data-accion="guardarCats">Guardar cambios</a></div></section>';
  };
  V.local = function(){
    var L = D.local;
    return '<div class="ad-cab"><div><h1>Horario y local</h1><p>Lo que sale en «Visítanos», en el pie y en Google.</p></div></div>'
      + '<div class="ad-grid"><section class="tarjeta"><h2>Horario</h2><div class="horario-ad">' + L.horario.map(function(h, i){ return '<div class="dia' + (h.cerrado ? ' off' : '') + '"><b>' + h.d + '</b><input data-abre="' + i + '" value="' + esc(h.abre) + '" placeholder="9:00"' + (h.cerrado ? ' disabled' : '') + '><span>a</span><input data-cierra="' + i + '" value="' + esc(h.cierra) + '" placeholder="23:00"' + (h.cerrado ? ' disabled' : '') + '><label><input type="checkbox" data-cerrado="' + i + '"' + (h.cerrado ? ' checked' : '') + '> cerrado</label></div>'; }).join('') + '</div>'
      + '<div class="campo" style="margin-top:1rem"><label>Nota del horario</label><input id="l-nota" value="' + esc(L.nota) + '"></div></section>'
      + '<section class="tarjeta"><h2>Contacto y redes</h2>'
      + '<div class="dos"><div class="campo"><label>Teléfono</label><input id="l-tel" value="' + esc(L.tel) + '"></div><div class="campo"><label>Email</label><input id="l-email" value="' + esc(L.email) + '"></div></div>'
      + '<div class="campo"><label>Dirección</label><input id="l-dir" value="' + esc(L.dir) + '"></div><div class="campo"><label>Código postal y población</label><input id="l-cp" value="' + esc(L.cp) + '"></div>'
      + '<div class="dos"><div class="campo"><label>Instagram</label><input id="l-ig" value="' + esc(L.ig) + '"></div><div class="campo"><label>TikTok</label><input id="l-tiktok" value="' + esc(L.tiktok) + '"></div></div>'
      + '<div class="dos"><div class="campo"><label>Facebook</label><input id="l-fb" value="' + esc(L.fb) + '"></div><div class="campo"><label>Frase de la portada</label><input id="l-frase" value="' + esc(L.frase) + '"></div></div>'
      + '<div class="acciones"><a class="btn btn--lleno" href="#" data-accion="guardarLocal">Guardar</a></div></section></div>';
  };
  V.clips = function(){
    return '<div class="ad-cab"><div><h1>Clips de redes</h1><p>Los vídeos cortos del carrusel de la portada. Vertical, de 4 a 8 segundos, sin sonido.</p></div><a class="btn btn--lleno" href="#" data-accion="subirClip">+ Subir clip</a></div>'
      + '<section class="tarjeta"><div class="clips-ad">' + D.clips.map(function(c, i){ return '<figure class="clip' + (c.visible ? '' : ' off') + '"><img src="../' + esc(c.poster) + '" alt="" loading="lazy"><figcaption>'
        + '<span class="orden"><button data-moverclip="-1" data-id="' + c.id + '">▲</button><button data-moverclip="1" data-id="' + c.id + '">▼</button></span>'
        + '<span class="interruptor' + (c.visible ? '' : ' off') + '" data-visibleclip="' + c.id + '"></span></figcaption></figure>'; }).join('') + '</div>'
      + '<p class="nota" style="margin-top:1rem">Subir un vídeo necesita el servidor (se recorta y comprime allí). De momento se pueden ordenar y ocultar.</p></section>';
  };
  V.idiomas = function(){
    var auto = D.platos.filter(function(p){ return Object.keys(p.trad).length; }).length;
    return '<div class="ad-cab"><div><h1>Idiomas</h1><p>La web está en 7 idiomas. Los textos fijos los traduce el equipo; los platos se traducen solos al guardarlos.</p></div></div>'
      + '<section class="tarjeta"><table class="tabla"><thead><tr><th>Idioma</th><th>Textos de la web</th><th>Platos</th><th></th></tr></thead><tbody>'
      + IDIOMAS.map(function(l, i){ return '<tr><td><b>' + l[0].toUpperCase() + '</b> ' + esc(l[1]) + '</td><td>' + (i === 0 ? 'Original' : (i < 3 ? 'Revisados' : 'Traducidos, pendientes de revisión')) + '</td><td>' + (i === 0 ? D.platos.length + ' originales' : auto + ' automáticos · ' + (D.platos.length - auto) + ' sin traducir') + '</td><td>' + (i ? '<a class="btn btn--sin" href="#" data-accion="retraducir" data-idioma="' + l[0] + '">Traducir todos</a>' : '') + '</td></tr>'; }).join('')
      + '</tbody></table><p class="nota" style="margin-top:1rem">El valenciano no está en DeepL: se traduce con Apertium y lo revisa el equipo.</p></section>';
  };

  /* ---------- pintar ---------- */
  var main = document.getElementById('vista');
  function pintar(){
    var h = (location.hash || '#inicio').slice(1).split('/')[0]; vista = V[h] ? h : 'inicio';
    document.querySelectorAll('.ad-nav a').forEach(function(a){ if(a.getAttribute('href') === '#' + vista) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    main.innerHTML = V[vista]();
    var b = document.getElementById('buscaAd'); if(b && filtro){ b.focus(); b.setSelectionRange(b.value.length, b.value.length); }
  }
  addEventListener('hashchange', pintar);

  /* ---------- acciones ---------- */
  function mover(lista, id, dir){
    var l = lista.slice().sort(function(a, b){ return a.orden - b.orden; }); var i = l.map(function(x){ return x.id; }).indexOf(id); var j = i + dir;
    if(i < 0 || j < 0 || j >= l.length) return; var t = l[i].orden; l[i].orden = l[j].orden; l[j].orden = t;
  }
  function leerEditor(p){
    var idioma = p._idioma || 'es', n = document.getElementById('f-n').value.trim(), d = document.getElementById('f-d').value.trim();
    if(!n){ aviso('El nombre no puede estar vacío.'); return false; }
    if(idioma === 'es'){
      p.n = n; p.d = d; p.p = document.getElementById('f-p').value.trim(); p.cat = document.getElementById('f-cat').value;
      p.p2 = document.getElementById('f-p2').value.trim(); p.e2 = document.getElementById('f-e2').value.trim();
      p.t = [].slice.call(document.querySelectorAll('[data-tag].on')).map(function(e){ return e.dataset.tag; });
      p.a = [].slice.call(document.querySelectorAll('[data-alg]:checked')).map(function(e){ return e.dataset.alg; });
      traducir(p);
    } else p.trad[idioma] = { n: n, d: d, mano: true };
    return true;
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-accion],[data-cat],[data-mover],[data-visible],[data-tag],[data-idioma],.fila[data-id],[data-movercat],[data-visiblecat],[data-moverclip],[data-visibleclip]');
    if(!t) return;
    if(t.tagName === 'INPUT' || e.target.tagName === 'INPUT' || e.target.tagName === 'A' && t.classList.contains('fila')) { if(!t.dataset.accion) return; }
    var acc = t.dataset.accion;
    if(t.dataset.cat){ cat = t.dataset.cat; sel = null; pintar(); return; }
    if(t.dataset.mover){ mover(platosDe(cat), t.dataset.id, +t.dataset.mover); guardar('Orden de platos cambiado'); pintar(); return; }
    if(t.dataset.visible){ var p = D.platos.filter(function(x){ return x.id === t.dataset.visible; })[0]; p.visible = !p.visible; guardar((p.visible ? 'Publicado: ' : 'Oculto: ') + p.n); pintar(); return; }
    if(t.dataset.movercat){ mover(D.categorias, t.dataset.id, +t.dataset.movercat); guardar('Orden de categorías cambiado'); pintar(); return; }
    if(t.dataset.visiblecat){ var c = catDe(t.dataset.visiblecat); c.visible = !c.visible; guardar((c.visible ? 'Categoría visible: ' : 'Categoría oculta: ') + c.n); pintar(); return; }
    if(t.dataset.moverclip){ var l = D.clips; var i = l.map(function(x){ return x.id; }).indexOf(t.dataset.id), j = i + (+t.dataset.moverclip); if(j >= 0 && j < l.length){ var tmp = l[i]; l[i] = l[j]; l[j] = tmp; guardar('Orden de clips cambiado'); } pintar(); return; }
    if(t.dataset.visibleclip){ var cl = D.clips.filter(function(x){ return x.id === t.dataset.visibleclip; })[0]; cl.visible = !cl.visible; guardar(cl.visible ? 'Clip visible' : 'Clip oculto'); pintar(); return; }
    if(t.dataset.tag){ t.classList.toggle('on'); return; }
    if(t.dataset.idioma && !acc){ var ps = D.platos.filter(function(x){ return x.id === sel; })[0]; if(ps){ if(ps._idioma === 'es' || !ps._idioma) leerEditor(ps); ps._idioma = t.dataset.idioma; pintar(); } return; }
    if(t.classList.contains('fila') && t.dataset.id && !acc){ sel = t.dataset.id; var pp = D.platos.filter(function(x){ return x.id === sel; })[0]; if(pp) pp._idioma = 'es'; pintar(); document.getElementById('editor').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if(!acc) return;
    e.preventDefault();
    var p = D.platos.filter(function(x){ return x.id === sel; })[0];
    if(acc === 'nuevo'){ var id = 'p' + Date.now(); D.platos.push({ id: id, cat: cat, n: '', d: '', p: '', p2: '', e2: '', a: [], t: [], visible: true, orden: platosDe(cat).length, trad: {}, _idioma: 'es' }); sel = id; pintar(); document.getElementById('f-n').focus(); }
    else if(acc === 'guardar' && p){ if(leerEditor(p)){ delete p._idioma; guardar('Guardado: ' + p.n); sel = null; pintar(); } }
    else if(acc === 'cancelar'){ if(p && !p.n) D.platos = D.platos.filter(function(x){ return x.id !== p.id; }); sel = null; pintar(); }
    else if(acc === 'borrar' && p){ if(confirm('¿Borrar «' + p.n + '»? Si sólo es temporal, mejor ocúltalo.')){ D.platos = D.platos.filter(function(x){ return x.id !== p.id; }); guardar('Borrado: ' + p.n); sel = null; pintar(); } }
    else if(acc === 'alternar' && p){ p.visible = !p.visible; guardar((p.visible ? 'Publicado: ' : 'Oculto: ') + p.n); pintar(); }
    else if(acc === 'nuevaCat'){ var nn = prompt('Nombre de la nueva categoría'); if(nn){ var cid = nn.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cat' + Date.now(); D.categorias.push({ id: cid, n: nn, d: '', foto: 'cafes', visible: true, orden: D.categorias.length }); guardar('Nueva categoría: ' + nn); pintar(); } }
    else if(acc === 'guardarCats'){ document.querySelectorAll('[data-catn]').forEach(function(i){ catDe(i.dataset.catn).n = i.value.trim() || catDe(i.dataset.catn).n; }); document.querySelectorAll('[data-catd]').forEach(function(i){ catDe(i.dataset.catd).d = i.value.trim(); }); guardar('Categorías guardadas'); pintar(); }
    else if(acc === 'guardarLocal'){ var L = D.local; L.horario.forEach(function(h, i){ h.cerrado = document.querySelector('[data-cerrado="' + i + '"]').checked; h.abre = h.cerrado ? '' : document.querySelector('[data-abre="' + i + '"]').value.trim(); h.cierra = h.cerrado ? '' : document.querySelector('[data-cierra="' + i + '"]').value.trim(); });
      ['nota','tel','email','dir','cp','ig','tiktok','fb','frase'].forEach(function(k){ L[k] = document.getElementById('l-' + k).value.trim(); }); guardar('Datos del local guardados'); pintar(); }
    else if(acc === 'subirClip'){ aviso('La subida de vídeos llega con el servidor.'); }
    else if(acc === 'retraducir'){ D.platos.forEach(traducir); guardar('Platos marcados para traducir a ' + t.dataset.idioma.toUpperCase()); pintar(); }
    else if(acc === 'exportar'){ var blob = new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' }); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'alcala-datos.json'; a.click(); }
    else if(acc === 'restablecer'){ if(confirm('¿Volver a los datos de ejemplo? Se pierden los cambios hechos en este navegador.')){ D = semilla(); guardar('Datos restablecidos'); pintar(); } }
  });
  document.addEventListener('change', function(e){ var c = e.target.closest('[data-cerrado]'); if(c){ var i = c.dataset.cerrado; var fila = c.closest('.dia'); fila.classList.toggle('off', c.checked); fila.querySelectorAll('input[data-abre],input[data-cierra]').forEach(function(x){ x.disabled = c.checked; }); } var a = e.target.closest('[data-alg]'); if(a) a.closest('label').classList.toggle('on', a.checked); });
  document.addEventListener('input', function(e){ if(e.target.id === 'buscaAd'){ filtro = e.target.value.trim().toLowerCase(); pintar(); } });

  D = cargar(); pintar();
})();
