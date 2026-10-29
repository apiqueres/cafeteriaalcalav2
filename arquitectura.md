# Alcalà Cafetería · Baristas — estructura de la web y arquitectura

Decidido el 29-10-2026 con el brief del cliente. Complementa `estilo-visual.md` y `referencia-velvetcullera.md`.

## 1. Qué necesita el cliente

- Landing con presentación corta del local.
- **La carta online es lo importante.** Editable por el cliente desde un panel con login, con alérgenos (14 iconos oficiales) y en 7 idiomas con traducción automática.
- Contacto directo: llamar, WhatsApp, cómo llegar, mapa.
- Redes sociales muy presentes: clips propios estilo reels que enlazan a Instagram y TikTok.
- 7 idiomas: ES, VA, EN, FR, PL, RU, UK.
- Alojado en VPS propio.

## 2. Páginas

### Portada `/` (y `/va/`, `/en/`, `/fr/`, `/pl/`, `/ru/`, `/uk/`)
1. Telón de carga con el logo.
2. **Hero**: vídeo de la pared de azulejo + logo 3D de oro viejo. h1, botones "Ver la carta" y "Cómo llegar".
3. **Presentación** (lámina burdeos): "Cafetería · Baristas en Cullera". Dos párrafos, foto del interior. Tres etiquetas: café de especialidad, desayunos y brunch, terraza.
4. **Carta destacada** (lámina azulejo): rejilla con 6 u 8 categorías con su foto y botón "Ver toda la carta". Los datos salen del panel.
5. **Redes** (lámina hueso): carrusel infinito de clips verticales 9:16 con poster, cada uno enlaza al perfil. Botones "@alcala en Instagram" y "en TikTok". Se inclina con el scroll como en Velvet.
6. **Visítanos** (lámina burdeos con la pintura de la terraza al fondo): horario, dirección, botones Llamar, WhatsApp y Cómo llegar. Mapa Leaflet con el local marcado.
7. Cintas de texto (CAFÉ DE ESPECIALIDAD · DESAYUNOS · BRUNCH · TERRAZA · COCTELES) y footer con la pintura de la playa, enlaces, legales.

### Carta `/carta/` (y por idioma)
- Cabecera con buscador y pestañas de categoría pegajosas (sticky) que se desplazan en móvil.
- Lista por categoría: nombre, descripción corta, precio, iconos de alérgenos, etiquetas (vegano, picante, nuevo, recomendado). Foto opcional por plato.
- Leyenda de alérgenos al final y aviso legal.
- Se genera en el servidor en cada idioma para que Google la indexe, con JSON-LD `Menu`.
- Botón flotante "Pedir mesa por WhatsApp" y "Llamar".

### Panel `/administracion/`
- Login con usuario y contraseña (sesión con cookie segura, límite de intentos).
- **Categorías**: nombre, foto, orden, visible sí/no.
- **Platos**: nombre, descripción, precio (o varios precios: tapa/ración, copa/botella), categoría, alérgenos (14 casillas), etiquetas, foto, visible sí/no, orden por arrastre.
- Al guardar, se traducen nombre y descripción con DeepL a los otros 6 idiomas. Pestañas por idioma para corregir a mano; lo corregido a mano no se vuelve a sobrescribir.
- **Datos del local**: horario por día, teléfono, WhatsApp, dirección, Instagram, TikTok, texto de presentación.
- **Clips de redes**: subir mp4 vertical, se genera el poster solo, orden, enlace destino.
- Pensado para usarse desde el móvil del cliente.

### Legales
- `/aviso-legal/`, `/privacidad/`, `/cookies/`. Sin cookies de terceros (no hay Analytics de Google ni embeds), así que no hace falta banner de consentimiento. Solo la cookie de sesión del panel.

## 3. Arquitectura técnica

```
Internet → Caddy (HTTPS automático, Brotli, caché de estáticos)
             ├── /            → ficheros estáticos (portada por idioma, css, js, media)
             ├── /carta/*     → Node (render en servidor, caché 60 s)
             ├── /administracion/*     → Node (panel)
             └── /api/*       → Node (JSON público de la carta, login, subida de fotos)
Node 22 + Fastify + SQLite (better-sqlite3) + sharp (fotos a WebP) + DeepL API
PM2 para mantener el proceso vivo. Copia de seguridad diaria de la base SQLite.
```

Por qué así:
- **Portada estática**: misma velocidad que Velvet, sin depender de Node para lo que más visitas recibe.
- **SQLite**: una carta de cafetería son unos cientos de filas. Cero administración, un solo fichero de copia de seguridad.
- **Render en servidor de la carta**: SEO de "carta cafetería Cullera" y funciona sin JavaScript.
- **Caddy**: HTTPS gratis con Let's Encrypt sin configurar nada, Brotli incluido.
- **Sin framework de front**: HTML, CSS y JS propios como Velvet. Three.js, Lenis y Leaflet autoalojados.

## 4. Modelo de datos

```
categorias   id, slug, orden, visible, foto, nombre_{es,va,en,fr,pl,ru,uk}
platos       id, categoria_id, orden, visible, foto, precio, precio2, etiqueta_precio2,
             alergenos (bitmask 14 bits), etiquetas (vegano, vegetariano, sin gluten, picante, nuevo, recomendado),
             nombre_{7}, descripcion_{7}, traducido_a_mano_{7}
local        clave, valor (horario, telefono, whatsapp, direccion, lat, lng, instagram, tiktok, textos)
clips        id, orden, video, poster, destino
usuarios     id, usuario, hash_contrasena
```

## 5. Idiomas

- Carpeta por idioma con `hreflang` y `x-default`, como Velvet. Redirección automática por idioma del navegador solo al llegar desde fuera y nunca para robots.
- Textos fijos de la web en un JSON por idioma (`i18n/es.json`...). Los traduzco yo y el cliente revisa ES y VA.
- La carta se traduce con DeepL al guardar. VA no está en DeepL: se traduce desde ES con Apertium (gratuito, bueno para ES→VA) o lo corrige el cliente a mano.

## 6. Rendimiento objetivo

- Portada: menos de 1 s de carga, menos de 1,5 MB en total con el vídeo recomprimido, 3D y fuentes.
- Logo GLB menos de 100 KB. Vídeo ~1 MB WebM. Clips de redes ~1,5 MB cada uno, cargados solo al entrar en vista.
- Fotos de carta a 800 px WebP (menos de 60 KB cada una).
- Lighthouse móvil 90 o más en rendimiento, 100 en accesibilidad y SEO.

## 7. Fases

1. **Base**: estructura del proyecto, tokens CSS, fuentes, nav, footer, menú móvil, sistema de láminas y scroll.
2. **Hero 3D**: vector del logo, extrusión en Blender, GLB, Three.js, vídeo recomprimido, telón.
3. **Portada completa** en castellano con contenido real.
4. **Servidor**: Fastify, SQLite, modelo de datos, API pública.
5. **Panel de administración** con login, categorías, platos, alérgenos, fotos, traducción.
6. **Carta pública** renderizada en servidor con JSON-LD.
7. **Idiomas**: textos fijos a 6 idiomas, carpetas, hreflang, redirección.
8. **Despliegue**: Caddy, PM2, copia de seguridad, dominio, pruebas en móvil real, Lighthouse.

## 8. Lo que falta por recibir

- Logo en vector (SVG, AI, PDF). Si no, lo vectorizo del webp.
- Fotos reales del local: barra, café, terraza, equipo, platos.
- Clips verticales para la sección de redes (de 5 a 9, mp4 o mov, 9:16). Usuarios de Instagram y TikTok.
- Datos del local: horario, teléfono, WhatsApp, dirección exacta, si reservan.
- Acceso al VPS: sistema (Ubuntu, Debian...), si ya tiene algo instalado, y el dominio.
- Cuenta de DeepL API Free (la crea el cliente o tú; la clave va en el servidor).

## 9. Herramientas (carpeta `herramientas/`)

Flujo del logo 3D, reproducible cuando llegue el logo en vector oficial:

```bash
# 1) vectorizar (sólo si no hay SVG oficial; potracer toma True como fondo, el script ya lo invierte)
python herramientas/logo-svg.py imagenes/logo-blanco.webp herramientas/logo.svg
# 2) extruir con Three.js en Node (respeta los agujeros del SVG; Blender los rellenaba al revés)
THREE_NM=<ruta>/node_modules node herramientas/logo-glb.mjs herramientas/logo.svg herramientas/logo-raw.glb
# 3) soldar, simplificar y comprimir con meshopt
npx gltf-transform optimize herramientas/logo-raw.glb site/media/3d/logo.glb --compress meshopt --no-join --simplify true --simplify-ratio 0.45 --simplify-error 0.0005
```

Resultado actual: 11.566 vértices, 75 KB. Dependencias de Node (en una carpeta aparte, no en el sitio): `three@0.170.0`, `@xmldom/xmldom`, `@gltf-transform/cli`.

Vídeo del hero: `hero-loop.mp4` (7,4 MB) recomprimido con el ffmpeg de `imageio_ffmpeg` a 1280 px sin audio: `site/media/hero.webm` (357 KB, VP9 crf 34) y `site/media/hero.mp4` (417 KB, H.264 crf 26). Sólo se carga en pantallas de más de 640 px.

## 10. Estado del panel y del mapa (29-10-2026, tarde)

- **Panel** en `site/administracion/` (`js/administracion.js`): funcional sin servidor. Guarda en `localStorage` (clave `alcala.datos`) categorías, platos (con alérgenos, etiquetas, dos precios, visible, orden y traducciones pendientes), horario, contacto y clips. La carta pública (`js/carta.js`) lee esos datos si existen. Sin login todavía. Cuando haya servidor, las mismas acciones pasarán a llamar a la API y el «✦ traducido automáticamente» lo hará DeepL de verdad.
- **Mapa**: ya no es Leaflet. Es una ilustración generada con Higgsfield (GPT Image 2.5) a partir de teselas reales de la zona (`imagenes/mapa-1900.png`, alternativa en `mapa-1900-alt.png`): plano de 1900 en blanco roto y negro con la taza de café en color como marcador. El enlace del mapa abre «cómo llegar» en Google Maps. La posición del local en la imagen es 45,6 % / 73,7 % (variable en `portada.css`).
- **Telón**: logo por piezas (`media/logo-partes.svg`, generado desde `logo.svg`): letras una a una, raya, subtítulo y marco con zoom, 2,5 s, sólo la primera vez por sesión.
- **Hero**: logo liso en SVG como máscara CSS; Three.js queda en `site/lib/three/` sin usar, por si se recupera el 3D (`js/hero-3d.js`).
