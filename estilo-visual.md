# Alcalà Cafetería · Baristas — propuesta de estilo visual

Propuesta del 29-10-2026 a partir del material de `imagenes/` y de la referencia de Velvet Cullera.

## 1. Lo que dice el material

- **Logo**: cuadrado con dos esquinas opuestas redondeadas (arriba-derecha y abajo-izquierda), marco fino, "ALCALÁ" en mayúsculas condensadas con el acento como un punto, raya y "CAFETERIA · BARISTAS" debajo. En el rótulo exterior va burdeos sobre blanco; en `logo-blanco.webp` va blanco sobre transparente.
- **Local real** (`interior.webp`): azulejo gris-azul brillante en espiga, bancos de arcos en terracota, sillas de madera clara tipo Wishbone, mesas negras, plantas con tira LED cálida encima, suelo de barro, y el nombre **ALCALÁ en letras doradas sobre el azulejo**.
- **Vídeo Higgsfield** (`hero-loop.mp4`): 5 s, 1464x628, 7,4 MB. Plano fijo de la pared de azulejo con plantas, acercamiento lento de cámara y brillo que recorre el azulejo. La pared sale vacía, sin el rótulo.
- **Pinturas** (`paint-*.jpg`): versiones "al óleo" del interior, de la terraza con el castillo de Cullera al atardecer y de la playa con torre de socorrista. Muy cálidas, naranja y oro.
- **Texturas**: papel hueso (`paper-texture.jpg`) y azulejo azul (`tile-texture.jpg`).
- **Carta**: 16 fotos de categoría, todas con el mismo fondo de azulejo azul y luz dorada. Serie coherente.

## 2. Concepto

**"El rótulo dorado sobre el azulejo."** La portada reproduce la pared del local: el vídeo de la pared de azulejo de fondo y, delante, el logo en 3D de oro viejo, flotando justo donde en el local está el rótulo real. Quien conoce el local lo reconoce al instante. El resto de la web alterna burdeos profundo, papel hueso y azulejo, con el oro solo en detalles.

## 3. Paleta

| Token | Hex | Uso |
|---|---|---|
| `--burdeos` | #6B1A2B | Color de marca. Fondos de nav, hero inferior, footer, botones |
| `--burdeos-2` | #4A0F1D | Burdeos profundo para degradados y sombras |
| `--hueso` | #F3EEE4 | Blanco roto. Fondo de láminas claras, con textura de papel |
| `--hueso-2` | #E8E1D3 | Hueso oscurecido para bordes y rayas |
| `--oro` | #B8924F | Oro viejo. Logo 3D, iconos, estrellas, subrayados |
| `--oro-claro` | #D9BC7E | Brillos del oro |
| `--azulejo` | #5E7B8A | Azul gris del azulejo. Lámina de carta y detalles |
| `--azulejo-2` | #3E5663 | Azulejo en sombra |
| `--terracota` | #C7703F | Acento de los bancos. Muy poco: etiquetas, un botón secundario |
| `--carbon` | #1C1818 | Texto sobre hueso |

Regla: burdeos y hueso llevan el 85 % de la web. Oro al 10 % y solo como metal (nunca fondos grandes). Azulejo y terracota para una lámina cada uno.

## 4. Tipografía

- **Titulares**: condensada bold en mayúsculas, como el logo. Candidata: **Oswald** (variable 200-700, licencia OFL) o **Big Shoulders Display** si se quiere más carácter. Tracking ligeramente abierto.
- **Cuerpo**: una sans humanista limpia, **Figtree** o **Inter**, 400 y 600.
- **Detalle elegante**: una serif itálica para cejas y citas de reseñas, **Instrument Serif** italic. Es lo que aporta el "dorado viejo elegante" sin recargar.
- Autoalojadas en woff2 con `font-display: swap` y `preload`, como Velvet.

## 5. Lenguaje de formas

- **Esquinas del logo**: todas las fotos y tarjetas usan `border-radius: 28px 0 28px 0` (arriba-izquierda y abajo-derecha redondeadas, el espejo del logo). Es la firma visual de la web.
- **Arcos** de los bancos: máscaras de foto en arco en la lámina "Nosotros" y en las tarjetas de reseñas.
- **Marco fino**: botones y tarjetas con borde de 1,5 px en lugar de relleno, como el marco del logo.
- **Rayas doradas** cortas bajo los h3, como la raya del logo.

## 6. Texturas y luz

- Láminas hueso con `paper-texture.jpg` en `mix-blend-mode: multiply` al 35 %.
- Lámina de carta con `tile-texture.jpg` como fondo y las 16 fotos de categoría encima.
- Degradado cálido dorado (como la tira LED) en los bordes superiores de las láminas burdeos.
- Las pinturas al óleo van en "Visítanos" (terraza con castillo) y en el footer (playa), con un velo burdeos al 20 % para que no compitan con el texto.

## 7. Portada

1. **Telón** hueso con el logo burdeos y barra de carga ligada al GLB, como Velvet.
2. **Hero**: vídeo de la pared de azulejo en bucle (recomprimido a ~1 MB en WebM + MP4, poster `hero-tiles.jpg`, en móvil solo el poster). Encima, degradado burdeos del 0 % arriba al 90 % abajo. Delante, **logo 3D en oro viejo** con entrada animada y giro al arrastrar. Abajo, h1 y dos botones: "Ver la carta" y "Reservar".
3. **Láminas** sticky apiladas en escritorio, como Velvet, pero con easings más suaves y sin rebote: aquí el tono es elegante, no juguetón.
4. **Semillas**: en vez de granos de trigo cayendo, granos de café dorados cayendo al pasar del hero a la primera lámina (mismo script, otro dibujo).

## 8. Logo 3D: cómo hacerlo

### Opción recomendada: extruir el logo, no generarlo con IA

Tripo AI y similares funcionan bien con objetos orgánicos pero destrozan las letras: salen gordas, con bordes ondulados y el texto ilegible. El logo es tipografía plana, así que lo correcto es **extruirlo desde el vector**, que es exactamente como está hecho el de Velvet (Blender + exportador GLB).

Pasos:
1. **Vector del logo**. Si el cliente tiene el logo en SVG, AI o PDF, ese. Si no, se vectoriza `logo-blanco.webp` (600 px, letras geométricas, vectoriza bien) o se recompone el texto con la fuente.
2. **Blender**: importar SVG, extruir 0,08 de la altura, bisel pequeño de 2 segmentos (es lo que hace que el oro brille en los cantos), fusionar en una sola malla, decimar si pasa de 10.000 triángulos.
3. **Exportar GLB** sin materiales ni UVs ni tangentes (el material se pone en Three.js por código, como Velvet).
4. **Optimizar**:
   ```bash
   npx @gltf-transform/cli optimize logo.glb logo.min.glb --compress meshopt --no-join
   ```
   Objetivo: menos de 100 KB.
5. **Web**: Three.js como Velvet. Material `MeshStandardMaterial` con color #B8924F, metalness 1, roughness 0.28 (un poco más mate que Velvet para que sea oro viejo, no oro nuevo), entorno procedural con un panel cálido más y un panel oscuro más para contraste.

Esto puedo hacerlo yo directamente con Blender desde aquí en cuanto tenga el vector.

### Dónde sí usar Tripo AI

Para un **objeto de atrezzo** que flote cerca del logo o aparezca en otra lámina: una taza de café con latte art, un portafiltro, un croissant. Son formas orgánicas y ahí Tripo rinde.

Flujo con Tripo:
1. Image-to-3D a partir de una foto del objeto real (mejor que text-to-3D, mantiene la identidad). Fondo liso, objeto centrado.
2. Exportar **GLB** con textura (no FBX ni OBJ).
3. Optimizar:
   ```bash
   npx @gltf-transform/cli optimize taza.glb taza.min.glb --compress meshopt --texture-compress webp --texture-size 1024 --simplify --simplify-ratio 0.5
   ```
   Objetivo: menos de 600 KB con textura incluida.
4. Cargar con `GLTFLoader` + `MeshoptDecoder` en Three.js. Mismo entorno de luz que el logo para que casen.

### Qué no hacer
- No cargar el GLB tal cual sale de Tripo (suelen ser de 5 a 20 MB).
- No usar texturas de 4K; a 1024 no se nota en pantalla.
- No poner dos objetos 3D pesados en el hero; uno es el logo, el otro, si lo hay, va después en el scroll y se carga en diferido.

## 9. Vídeo del hero

`hero-loop.mp4` pesa 7,4 MB. Hay que recomprimirlo:
- WebM VP9 a 1280 px de ancho, ~900 KB, y MP4 H.264 de respaldo, ~1,2 MB.
- `preload="metadata"`, `muted autoplay loop playsinline`, poster `hero-tiles.jpg` en WebP.
- En móvil se sirve solo el poster (`<source media>` o JS), como hace Velvet con los reels.
- Con `prefers-reduced-motion` el vídeo no arranca.

## 10. Pendiente de confirmar con el cliente

- Logo en vector (SVG, AI o PDF).
- Fotos reales del local además de `interior.webp`: barra, café, equipo, terraza, platos. Las categorías de carta con IA valen, pero el "Nosotros" necesita fotos reales.
- Si tienen reseñas de Google y cuántas, horario, dirección exacta, Instagram, teléfono y si reservan.
- Idiomas: por Cullera, mínimo castellano, valenciano e inglés.
