// Alcalá — extruye el logo (SVG) con Three.js en Node y exporta un GLB sin materiales.
// Respeta los agujeros del SVG (fill-rule evenodd), cosa que el relleno de curvas de Blender no hacía bien aquí.
// Uso:  node herramientas/logo-glb.mjs herramientas/logo.svg herramientas/logo-raw.glb
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const NM = process.env.THREE_NM || path.join(process.env.TEMP || '/tmp', 'claude-npm', 'node_modules');

// polyfills mínimos para que SVGLoader y GLTFExporter funcionen fuera del navegador
const { DOMParser } = require(path.join(NM, '@xmldom/xmldom'));
globalThis.DOMParser = DOMParser;
globalThis.self = globalThis;
if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob){ blob.arrayBuffer().then(b => { this.result = b; this.onloadend && this.onloadend(); }); }
    readAsDataURL(blob){ blob.arrayBuffer().then(b => { this.result = 'data:application/octet-stream;base64,' + Buffer.from(b).toString('base64'); this.onloadend && this.onloadend(); }); }
  };
}

const THREE = await import(path.join(NM, 'three', 'build', 'three.module.js').replace(/\\/g, '/').replace(/^([A-Za-z]):/, 'file:///$1:'));
const { SVGLoader } = await import('file:///' + path.join(NM, 'three', 'examples', 'jsm', 'loaders', 'SVGLoader.js').replace(/\\/g, '/'));
const { GLTFExporter } = await import('file:///' + path.join(NM, 'three', 'examples', 'jsm', 'exporters', 'GLTFExporter.js').replace(/\\/g, '/'));
const { mergeGeometries, mergeVertices, toCreasedNormals } = await import('file:///' + path.join(NM, 'three', 'examples', 'jsm', 'utils', 'BufferGeometryUtils.js').replace(/\\/g, '/'));

const [svgPath, outPath] = process.argv.slice(2);
const PROFUNDIDAD = 0.07;   // grosor total respecto al ancho
const BISEL = 0.006;        // tamaño del bisel respecto al ancho

const svg = fs.readFileSync(svgPath, 'utf8');
const data = new SVGLoader().parse(svg);
const shapes = [];
for (const p of data.paths) shapes.push(...SVGLoader.createShapes(p));
console.log('LOGO3D formas:', shapes.length, 'con agujeros:', shapes.filter(s => s.holes.length).length);

// tamaño del dibujo para escalar el relieve
const box2 = new THREE.Box2();
for (const s of shapes) for (const v of s.getPoints(8)) box2.expandByPoint(v);
const ancho = Math.max(box2.max.x - box2.min.x, box2.max.y - box2.min.y);

const geos = shapes.map(s => new THREE.ExtrudeGeometry(s, {
  depth: ancho * PROFUNDIDAD, bevelEnabled: true,
  bevelThickness: ancho * BISEL, bevelSize: ancho * BISEL, bevelSegments: 1, curveSegments: 3,
}));
let geo = mergeGeometries(geos, false);
geo.deleteAttribute('uv');
// normales suaves sólo en los cantos del bisel (ángulo < 40°); las caras planas se quedan duras.
// Así se sueldan los vértices y el simplificador puede trabajar sin estropear el sombreado.
geo = toCreasedNormals(geo, Math.PI * 40 / 180);
geo = mergeVertices(geo, 1e-4);

// el SVG tiene la Y hacia abajo: se voltea; se centra y se normaliza a 1 de ancho
geo.scale(1, -1, 1);
geo.computeBoundingBox();
const c = geo.boundingBox.getCenter(new THREE.Vector3());
geo.translate(-c.x, -c.y, -c.z);
const size = geo.boundingBox.getSize(new THREE.Vector3());
const k = 1 / Math.max(size.x, size.y, size.z);
geo.scale(k, k, k);
geo.computeBoundingBox();
// volteada la Y, los triángulos quedan al revés: se corrige el orden de los índices
if (geo.index) { const a = geo.index.array; for (let i = 0; i < a.length; i += 3) { const t = a[i + 1]; a[i + 1] = a[i + 2]; a[i + 2] = t; } }
{ const n = geo.attributes.normal.array; for (let i = 1; i < n.length; i += 3) n[i] = -n[i]; }   // y de las normales también volteada

const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial());
mesh.name = 'logo';
const s = geo.boundingBox.getSize(new THREE.Vector3());
console.log('LOGO3D vertices:', geo.attributes.position.count, 'triangulos:', geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3, 'dims:', s.toArray().map(v => v.toFixed(3)).join(' x '));

const exporter = new GLTFExporter();
exporter.parse(mesh, (glb) => {
  fs.writeFileSync(outPath, Buffer.from(glb));
  console.log('LOGO3D exportado', outPath, Math.round(glb.byteLength / 1024), 'KB');
}, (err) => { console.error(err); process.exit(1); }, { binary: true });
