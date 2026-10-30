/* Alcalá — hero.js: logo en 3D de oro viejo sobre la pared de azulejo.
   Three.js (módulos ES por importmap) · GLTFLoader + meshopt · estudio de luz procedural (sin HDRI).
   Fijo de frente con un vaivén muy leve; gira al arrastrar y vuelve solo. Si no hay WebGL o falla el
   GLB, se enseña el logo en imagen. También pone el vídeo de fondo cuando la pantalla es ancha. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const canvas   = document.getElementById('logo3d');
const loaderEl = document.getElementById('loader');
const planB    = document.getElementById('logoPlano');
const REDUCIR  = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOVIL    = matchMedia('(max-width: 640px)').matches;
const ORO      = 0xB8924F;

function fallo(msg){
  console.warn('hero 3D:', msg);
  if(canvas) canvas.style.display = 'none';
  if(planB) planB.hidden = false;
  if(loaderEl) loaderEl.classList.add('hide');
}

/* ---------- vídeo de fondo: sólo en pantallas anchas, sin ahorro de datos y sin «reducir movimiento» ---------- */
(function video(){
  const fondo = document.querySelector('.hero__fondo'); if(!fondo) return;
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
  window.__heroVideo = v;
})();

/* ---------- renderer ---------- */
if(!canvas){ throw new Error('sin canvas'); }
let renderer;
try{
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
}catch(e){ fallo('sin WebGL'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, MOVIL ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace    = THREE.SRGBColorSpace;
renderer.toneMapping         = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
canvas.addEventListener('webglcontextlost', (e)=>{ e.preventDefault(); fallo('contexto perdido'); });

const scene  = new THREE.Scene();
const CAM_Z  = 8;
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, CAM_Z);

/* ---------- estudio procedural: paneles de luz que el oro refleja ---------- */
function estudio(){
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x120608);
  const g = new THREE.PlaneGeometry(100, 100);
  const panel = (hex, x, y, z, i)=>{
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    m.material.color.set(hex).multiplyScalar(i);
    m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m);
  };
  panel(0xFFF4DC,   0,  48,  60, 1.7);   // luz principal cálida arriba (la tira LED del local)
  panel(0xFFFFFF, -70,  10,  40, 1.0);   // panel claro a la izquierda
  panel(0x1A0A0D,  65,  -8,  48, 1.0);   // panel oscuro a la derecha: contraste de espejo
  panel(0xE8C27A, -28,  52,  20, 1.3);   // brillo dorado
  panel(0x3E5663,   0, -60,  30, 0.9);   // rebote azul del azulejo desde abajo
  return s;
}
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(estudio(), 0.035).texture;
pmrem.dispose();

const key = new THREE.DirectionalLight(0xFFF1D6, 1.1); key.position.set(2.5, 3.5, 4); scene.add(key);
const rim = new THREE.PointLight(0xE8C27A, 0.9, 60);   rim.position.set(-4, 2.5, 4); scene.add(rim);
scene.add(new THREE.AmbientLight(0x3A2A20, 0.5));

/* ---------- material: oro viejo (un poco más mate que un oro nuevo) ---------- */
const oroMat = new THREE.MeshStandardMaterial({ color: ORO, metalness: 1.0, roughness: 0.28, envMapIntensity: 1.3 });

/* ---------- interacción ---------- */
let dragging = false, px = 0, py = 0, rotY = 0, rotX = 0, mx = 0, my = 0;
const clamp = (v, a, b)=> Math.max(a, Math.min(b, v));
canvas.addEventListener('pointerdown', e=>{ dragging = true; px = e.clientX; py = e.clientY; try{ canvas.setPointerCapture(e.pointerId); }catch(_){} });
addEventListener('pointermove', e=>{
  mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2;
  if(!dragging) return;
  rotY += (e.clientX - px) * 0.008;
  rotX  = clamp(rotX + (e.clientY - py) * 0.008, -0.9, 0.9);
  px = e.clientX; py = e.clientY;
}, { passive: true });
const soltar = ()=>{ dragging = false; };
addEventListener('pointerup', soltar); addEventListener('pointercancel', soltar); addEventListener('blur', soltar);

/* ---------- modelo ---------- */
const group = new THREE.Group(); scene.add(group);
const baseSize = new THREE.Vector3();
let baseScale = 1, baseY = 0;
const FILL = MOVIL ? 0.62 : 0.40;      // fracción de la pantalla que ocupa el logo
const ENTRADA = { t0: null, dur: REDUCIR ? 500 : 1800 };
canvas.style.opacity = '0';
const easeOutExpo  = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

function fit(){
  if(baseSize.x === 0) return;
  const fov  = camera.fov * Math.PI / 180;
  const visH = 2 * CAM_Z * Math.tan(fov / 2);
  const visW = visH * camera.aspect;
  baseScale  = Math.min(visW * FILL / baseSize.x, visH * FILL / baseSize.y);
  baseY      = visH * (MOVIL ? 0.14 : 0.10);   // un poco por encima del centro: abajo va el texto
  group.scale.setScalar(baseScale);
  group.position.y = baseY;
}

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
loader.load('media/3d/logo.glb?v=4', (gltf)=>{
  const model = gltf.scene;
  model.traverse(o=>{ if(o.isMesh){ o.material = oroMat; o.frustumCulled = false; } });
  const box = new THREE.Box3().setFromObject(model);
  model.position.sub(box.getCenter(new THREE.Vector3()));
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  model.scale.setScalar(1 / maxDim);
  baseSize.copy(size).multiplyScalar(1 / maxDim);
  group.add(model);
  fit();
  ENTRADA.t0 = performance.now() + 120;
  if(loaderEl) loaderEl.classList.add('hide');
}, undefined, (err)=>{ fallo('GLB: ' + (err && err.message || err)); });

/* ---------- bucle ---------- */
let pausado = false, oculto = false;
window.__hero = { pausar(v){ pausado = !!v; if(!pausado) pedir(); } };
document.addEventListener('visibilitychange', ()=>{ oculto = document.hidden; if(!oculto) pedir(); });
let pedido = false;
function pedir(){ if(!pedido){ pedido = true; requestAnimationFrame(tick); } }
function tick(t){
  pedido = false;
  if(pausado || oculto) return;
  if(!dragging){ rotY += (0 - rotY) * 0.07; rotX += (0 - rotX) * 0.07; }
  let giro = 0, cabeceo = 0, flota = 0;
  if(ENTRADA.t0 !== null){
    const p = clamp((t - ENTRADA.t0) / ENTRADA.dur, 0, 1);
    canvas.style.opacity = String(clamp(p * 2.2, 0, 1));
    if(!REDUCIR){
      giro    = (1 - easeOutExpo(p)) * -0.9;                       // llega girado un poco y se pone de frente
      cabeceo = (1 - easeOutCubic(p)) * 0.35;
      group.scale.setScalar(baseScale * (0.86 + 0.14 * easeOutExpo(p)));
      group.position.y = baseY - (1 - easeOutCubic(p)) * 0.6;
      const brillo = Math.sin(clamp((p - 0.5) / 0.5, 0, 1) * Math.PI);  // destello al asentarse
      oroMat.envMapIntensity = 1.3 + brillo * 0.9;
    }
    if(p >= 1){ ENTRADA.t0 = null; canvas.style.opacity = '1'; group.scale.setScalar(baseScale); group.position.y = baseY; oroMat.envMapIntensity = 1.3; }
  } else if(!REDUCIR){
    flota = Math.sin(t * 0.0009) * 0.02;                            // vaivén muy leve
    group.position.y = baseY + flota;
  }
  const sigueX = REDUCIR || MOVIL ? 0 : my * 0.06, sigueY = REDUCIR || MOVIL ? 0 : mx * 0.10;   // sigue al ratón
  group.rotation.set(rotX + cabeceo + sigueX, rotY + giro + sigueY, 0);
  renderer.render(scene, camera);
  pedir();
}
pedir();

addEventListener('resize', ()=>{
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); fit(); pedir();
});
