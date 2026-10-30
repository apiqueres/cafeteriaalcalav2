# Alcalá Cafetería · Baristas — web v2

Nueva web de la Cafetería Alcalá de Cullera. Demo visual publicada en GitHub Pages desde la carpeta `site/`.

- `site/` — la web (HTML, CSS y JS propios; Three.js, Lenis y Leaflet autoalojados en `site/lib/`).
- `site/carta/` — carta con platos y precios (datos en `site/js/carta-datos.js`).
- `site/administracion/` — panel de administración funcional en el navegador (sin login ni servidor todavía).
- `imagenes/` — material de origen (fotos, logo, vídeo del hero, texturas).
- `herramientas/` — scripts para vectorizar el logo y generar el modelo 3D.
- `referencia-velvetcullera.md`, `estilo-visual.md`, `arquitectura.md` — documentación del proyecto.

Para verla en local:

```bash
python -m http.server 8765 --directory site
```
