# Referencia: cómo está hecha velvetcullera.com

Análisis del 29-10-2026. Sirve de guía técnica para construir una web del mismo estilo.

## 1. Stack

- HTML estático, sin framework ni bundler. Un `index.html` por idioma (`/`, `/va/`, `/en/`, `/pl/`, `/ru/`, `/uk/`, `/fr/`).
- CSS propio en un solo fichero (`v2.css`, 37 KB) más dos pequeños (`ayudas.css`, `idiomas.css`).
- JS propio en ficheros pequeños con comentarios en castellano: `v2.js` (20 KB), `hero.js` (7 KB), `trigo3d.js` (14 KB), `semillas.js` (5 KB), `idiomas.js`, `ayudas.js`.
- Librerías autoalojadas en `/lib/`: Three.js r160 (módulos ES + importmap), Lenis (scroll suave), Leaflet (mapa con teselas de OpenStreetMap).
- Fuente: Bricolage Grotesque variable (400-800, ancho 75-100 %), servida desde la propia web en dos woff2 por rango unicode, con `font-display: swap` y `preload` de la latina.
- Servidor con Brotli para todo. Caché rota con `?v=N` en cada fichero.
- Páginas secundarias: `carta.html` (sin 3D, con alérgenos) y `velvet-kids.html` (sin 3D, mismas láminas).

## 2. Tokens de diseño (`:root`)

| Token | Valor |
|---|---|
| `--verde` | #103029 (fondo principal) |
| `--verde-2` | #17443B |
| `--teal` | #2C7C7D (degradado del hero) |
| `--oro` | #C6AA2E (logo 3D, estrellas) |
| `--amarillo` | #E7BF49 (loma, cintas, lámina "experiencia", telón) |
| `--hueso` / `--hueso-2` | #EEF0E6 / #DFE4D4 (láminas claras) |
| `--blanco` | #FBFCF7 |
| Radios | foto 6px, tarjeta 14px, lámina 28px (solo esquinas superiores) |
| `--lado` | clamp(1.2rem, 4.2vw, 4rem) (margen lateral) |
| `--u` | 1rem; en pantallas grandes `min(1vw, 1.86vh)` para que todo escale con el alto de la ventana |
| Easings | `--suave` cubic-bezier(.2,.7,.2,1), `--rebote` (.34,1.45,.64,1), `--telon` (.77,0,.18,1) |
| Cursor | SVG de un grano de café en data-URI, solo con `hover:hover and pointer:fine` |

Contenedor `.caja`: max-width 1560px, padding lateral `--lado`.

## 3. Estructura de la portada (de arriba abajo)

1. **Telón de entrada** (`#telon`): capa fija amarilla con el logo webp, barra de carga falsa (se acerca al 92 % y salta al 100 % cuando el GLB termina) y frase. Se abre con `clip-path` en 1 s y se elimina. Tope de 4,2 s aunque el 3D no cargue.
2. **Barra de progreso** (`#avance`): 4px amarilla, fija arriba, `scaleX` según scroll. Oculta en móvil.
3. **Nav fija** (`#nav`): logo webp, 3 enlaces, selector de idioma (globo + lista), botón CTA "Carta", hamburguesa. Transparente sobre el hero y con fondo verde cuando la página sube sobre él (clase `nav--fondo`).
4. **Hero** (`#inicio`, sticky, 100svh, degradado radial teal): h1 solo para lectores de pantalla y SEO, canvas `trigo3d` (trigal), canvas `logo3d` (logo dorado), SVG de la loma amarilla, spinner.
5. **`<main class="pagina">`** con 8 láminas (`.lamina`), cada una 100svh en escritorio:
   - `#experiencia` (amarilla): titular + foto vertical + 3 párrafos.
   - `#matcha` (hueso): texto + foto vertical + rejilla de 6 productos con foto cuadrada.
   - `#nosotros` (verde): texto + foto + 4 etiquetas (pet friendly, chill, familia, trabajar).
   - `#kids` (verde): ceja + titular + texto + botón + foto con marco.
   - `#resenas` (hueso): nota 4,7 que cuenta desde 0, 5 granos de café como estrellas, baraja de 18 tarjetas de Google con arrastre, flechas y autoavance cada 6 s.
   - `#visitanos` (verde): horario en `<dl>`, dirección, botón "Cómo llegar" (Google Maps dir API), WhatsApp, mapa Leaflet con ruta dibujada que se anima (`@keyframes ruta`).
   - `#preguntas` (hueso): FAQ con `<details>` nativos, 9 preguntas, también en JSON-LD `FAQPage`.
   - `#reels` (verde): carrusel infinito de 9 vídeos verticales 9:16 (poster jpg, `preload=none`, mp4 solo se asigna al entrar en vista), cada uno enlaza a Instagram. Se inclina con `skewX` según velocidad de scroll.
6. **Cintas** (`.cintas`): dos marquesinas amarillas con texto repetido 4 veces, velocidad que sube con la velocidad del scroll, direcciones opuestas.
7. **Footer** (`.pie`): titular grande, logo, 3 columnas de enlaces, carteles de subvenciones que se abren en `<dialog>`, legales.
8. **Menú móvil** (`#menu`): pantalla completa verde, se abre con `clip-path: circle()` desde la hamburguesa, enlaces entran escalonados con `--i`.

## 4. Sistema de scroll (lo que da la sensación "premium")

- **Lenis** con `lerp: .1` para scroll suave. Se para cuando se abre un menú o dialog.
- **Láminas apiladas** solo en escritorio (`min-width:900px and min-height:600px`): cada `.lamina` es `position: sticky; top: 0; height: 100svh`. Al llegar la siguiente, la de debajo se encoge (`scale(1 - --cubre * .07)`) y se oscurece. En móvil son secciones normales (`position: relative`).
- **Snap suave**: al soltar la rueda, si has bajado más del 10 % de la pantalla salta a la siguiente lámina, si no vuelve. Desactivado desde reels en adelante.
- Dos variables CSS por lámina actualizadas en cada frame: `--entra` (0 a 1 cuando asoma) y `--cubre` (0 a 1 cuando la tapa la siguiente). Con ellas se mueve la foto por dentro (parallax) y se encoge la lámina.
- **Entradas**: elementos con `.rv`, `.foto`, `.titular` reciben la clase `in` una sola vez al asomar. Retardo por elemento con `--d`.
- **Titulares palabra a palabra**: JS envuelve cada palabra en `<span class="pal"><span style="--i:n">` y CSS las sube escalonadas.
- Un solo `requestAnimationFrame` para todo el scroll, con `scroll` pasivo y `ResizeObserver`.
- `prefers-reduced-motion` respetado en todo: sin Lenis, sin snap, sin trigal, sin semillas, sin telón, todo visible de inicio.

## 5. Hero 3D

### Logo (`hero.js`)
- Three.js, canvas `#logo3d`, `alpha: true`, `pixelRatio` máximo 2, tone mapping ACES.
- GLB de una sola malla: 5.650 vértices, 7.640 triángulos, sin texturas. 311 KB, 178 KB con Brotli. Exportado con Verge3D desde Blender.
- Material `MeshStandardMaterial` oro (metalness 1, roughness 0.18). Reflejos de un entorno procedural: 4 planos de color en una escena auxiliar pasados por `PMREMGenerator`. Sin HDRI.
- Fijo de frente. Con click y arrastre gira (límite ±1 rad en X) y al soltar vuelve con muelle (`0.08` por frame).
- Animación de entrada de 2,1 s: canvas de opacidad 0 a 1, sube desde abajo, una vuelta completa en Y con `easeOutExpo`, escala con `easeOutBack`, destello de `envMapIntensity` al asentarse.
- `fit()` escala el modelo al 44 % de la pantalla y lo sube un 12 % para dejar sitio al trigal.
- Al cargar, quita el spinner, lo que dispara la apertura del telón.

### Trigal (`trigo3d.js`)
- Una espiga modelada por código (tallo + granos en pisos + barbas + 2 hojas), colores por vértice, fusionada con `mergeGeometries`.
- Repetida con `InstancedMesh` a lo largo del borde de la loma amarilla (lee el `path` SVG con `getPointAtLength`).
- Viento y ratón doblan las espigas en el shader (vertex shader modificado, no en CPU).
- Baja la calidad sola en móvil (canvas a 0,75x) y tiene plan B en DOM (`__trigoViejo`, divs `.wstem`/`.wheat` con CSS `sway`) si WebGL falla.
- Se pausa (`pausar(true)`) cuando la página tapa el hero.

### Semillas (`semillas.js`)
- Canvas 2D fijo encima de todo (`z-index: 40`, `pointer-events: none`). Al hacer scroll del hero a la primera lámina caen 56 granos (26 en móvil) dibujados una vez en un canvas de 96x160 y copiados. Atado al scroll: al subir vuelven. Solo pinta durante la transición.

## 6. Rendimiento

| | |
|---|---|
| HTML | 41 KB (Brotli) |
| Total 3D transferido | ~380 KB |
| Load en escritorio | 865 ms |
| Load en móvil emulado | 477 ms (hasta el load; el GLB sigue después) |

Trucos: todo lazy (`loading=lazy` en fotos, vídeos sin `src` hasta entrar en vista), WebP con `width`/`height` declarados, fuente con `preload`, JS de módulo no bloqueante, Brotli, sin terceros salvo las teselas de OSM.

## 7. SEO y accesibilidad

- `title`, `description`, canonical, Open Graph completo con imagen, `theme-color`.
- `hreflang` para 7 idiomas + `x-default`. Redirección automática por idioma del navegador solo al llegar desde fuera, nunca para robots, sin cookies ni localStorage.
- JSON-LD: `WebSite`, `CafeOrCoffeeShop` + `Bakery`, `FAQPage`.
- h1 real (oculto visualmente), h2 por sección, `aria-label` en secciones, canvas `aria-hidden`, `role="dialog"` en el menú, `aria-live` en el contador de reseñas, `<details>` nativos, foco gestionado en el dialog.
- Fuente autoalojada "para no enviar la IP a Google" (comentario literal del CSS).

## 8. Qué copiar y qué mejorar

Copiar tal cual: telón con barra ligada a la carga real, láminas sticky con `--entra`/`--cubre`, titulares por palabra, baraja de reseñas, reels con poster y carga diferida, mapa Leaflet con ruta animada, FAQ con `<details>` + JSON-LD, hreflang por carpeta, entorno procedural para el metal.

Mejorar: GLB sin `TANGENT`/`TEXCOORD_0` y con meshopt o Draco (de 311 KB a ~60 KB), `<link rel="preload" as="fetch">` del GLB, build de Three.js con tree-shaking, `fetchpriority="high"` en el logo webp del telón, fallback del logo 3D a la imagen webp si WebGL falla.
