// Six looks for the same models: each turns roles into materials, and sets the sky, the light and the camera effects.
import * as THREE from 'three';

// the real colours of every part
const BASE = {
  stone: '#E3DACB', marble: '#F2EEE6', concrete: '#E9E5EC', glass: '#9FB9C9', glassBand: '#FFF0F6', pearl: '#D9478C', light: '#FF3B30',
  wallRed: '#A7322A', column: '#B8322A', lattice: '#7A2A1E', door: '#3A1A12', band: '#2E6E6A', gold: '#E2AE45', ridge: '#5A4632',
  roofGold: '#E8B23A', roofBronze: '#7C5E3C', roofGrey: '#5E5C60', roofBlue: '#2B4F96', brick: '#C9A06E', brick2: '#A27C50',
  plaster: '#EFE6D4', wood: '#7A5232', rock: '#9C8C7C', white: '#F4F0E6', redPalace: '#8E2A26', redPalace2: '#A8402F', maroon: '#4E1C18',
  steel: '#C8D0DA', steel2: '#9AA6B4', window: '#3A4A5A', windowLit: '#5A4232', windowDark: '#2A221C', lantern: '#D9321F',
  hill: '#8DBA5C', wallGrey: '#B2A690', brickRed: '#A4553C', copper: '#4F9A7C', earth: '#CB9A62', tea: '#5E9440', tea2: '#79AC52', hillBlue: '#7E9A8E', tileGrey: '#7E7C7A',
  sand: '#E2C595', sand2: '#C9A274', camel: '#B98A56', yellowWall: '#E8C37A', archBlue: '#3E7FA6', domeGreen: '#3F9A70', bronze: '#8A6A3E',
  cloud: '#FFFFFF', glassTeal: '#5A9E9A', sea: '#22DADA', shallow: '#8FF0E6', gilt: '#F0BE4E', cliff: '#B8A58A', beachSand: '#FFF9EE', foam: '#FFFFFF', palm: '#3E8B3A', palmTrunk: '#8A6A48', thatch: '#C9A363',
  umbRed: '#D8392E', umbYellow: '#F2C230', umbBlue: '#2F7FC1', sail: '#FBF7EE',
  grass: '#8DB26A', plinth: '#D8CDBB', water: '#6FA2B8', lake: '#7DB0B0', tree: '#4F7F45', trunk: '#6A4A34', person: '#ffffff', skin: '#E7C3A0', boat: '#F2EEE6', cabin: '#C9302A',
};
const GLOW = { window: '#FFE7A8', windowLit: '#FFC46E', windowDark: '#FFC46E', lantern: '#FF5A3A', pearl: '#FF4FA8', light: '#FF3B30', glassBand: '#FFE0F0', glass: '#FFD58A', cabin: '#FFC46E' };
const col = c => new THREE.Color(c);
const mix = (a, b, t) => col(a).lerp(col(b), t);

function gradientTex(stops, w = 4, h = 256) {   // a vertical sky gradient
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, h);
  stops.forEach(([o, s]) => g.addColorStop(o, s)); x.fillStyle = g; x.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function toonRamp(n) { const d = new Uint8Array(n * 4); for (let i = 0; i < n; i++) { const v = Math.round(60 + 195 * i / (n - 1)); d.set([v, v, v, 255], i * 4); }
  const t = new THREE.DataTexture(d, n, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; }

function sun(color, int, pos, shadow = true, radius = 4) {
  const l = new THREE.DirectionalLight(color, int); l.position.set(...pos); l.castShadow = shadow;
  Object.assign(l.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 80 }); l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -.0004; l.shadow.normalBias = .02; l.shadow.radius = radius;
  return l;
}

const cache = new Map();
const matFor = (style, role) => { const k = style.id + ':' + role; if (!cache.has(k)) cache.set(k, style.material(role)); return cache.get(k); };

export const STYLES = [
  {
    id: 'clay', name: 'Clay miniature', zh: '泥塑', blurb: 'Soft matte clay on a little round base, pastel colours, a shallow focus like a photo of a scale model.',
    detail: 1, ao: true, tilt: true, edges: null,
    bg: () => gradientTex([[0, '#CFE0EC'], [.6, '#F1E6DA'], [1, '#F6D9C4']]),
    material: role => { const c = mix(BASE[role] || '#ccc', '#FFF6EC', role === 'person' ? 0 : .32); return new THREE.MeshStandardMaterial({ color: c, roughness: .92, metalness: 0 }); },
    lights: () => [new THREE.HemisphereLight('#EAF2FF', '#C9B8A6', 1.5), sun('#FFF1DE', 2.2, [10, 18, 9], true, 8)],
    exposure: 1.0,
  },
  {
    id: 'golden', name: 'Golden hour', zh: '黄昏', blurb: 'Real colours and materials in a low evening sun: long shadows, warm haze, glinting gold.',
    detail: 1, ao: true, bloom: [.25, .6, .9], fog: ['#F2C29A', 1.1, 3.2], edges: null,
    bg: () => gradientTex([[0, '#5E7BB0'], [.45, '#E8A27A'], [.8, '#F6C892'], [1, '#F7D9B0']]),
    material: role => { const metal = ['gold', 'steel', 'steel2'].includes(role), gilt = role === 'gilt', glossy = ['pearl', 'glass', 'water', 'lake', 'roofGold', 'roofBlue'].includes(role);
      return new THREE.MeshStandardMaterial({ color: col(role === 'pearl' ? '#F07FBA' : BASE[role] || '#ccc'), roughness: metal ? .32 : gilt ? .34 : glossy ? .22 : .78, metalness: metal ? .85 : gilt ? .5 : glossy ? .15 : 0,
        emissive: col(role === 'light' ? '#FF3B30' : role === 'gilt' ? '#5A3800' : role === 'cloud' ? '#806A60' : role === 'sea' ? '#0E6668' : role === 'shallow' ? '#2E7A70' : role === 'beachSand' ? '#6A5E50' : '#000'), emissiveIntensity: role === 'light' ? 2 : 1 }); },
    lights: () => [new THREE.HemisphereLight('#8AA6D6', '#B07A50', .7), sun('#FFB36B', 3.6, [-16, 7, 10], true, 2)],
    exposure: 1.05,
  },
  {
    id: 'lowpoly', name: 'Low poly', zh: '低多边形', blurb: 'Few, flat facets and bright colours, like a mobile game board.',
    detail: 0, edges: null,
    bg: () => gradientTex([[0, '#7FC4EE'], [1, '#D8F0FA']]),
    material: role => { const c = col(BASE[role] || '#ccc'); const hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, Math.min(1, hsl.s * 1.25), Math.min(.9, hsl.l * 1.05));
      return new THREE.MeshStandardMaterial({ color: c, roughness: .85, flatShading: true }); },
    lights: () => [new THREE.HemisphereLight('#FFFFFF', '#88A0B0', 1.6), sun('#FFFFFF', 2.4, [12, 20, 6], true, 1)],
    exposure: 1.0,
  },
  {
    id: 'ink', name: 'Ink cartoon', zh: '水墨卡通', blurb: 'Cel shading in three tones with crisp ink outlines on paper, like a hand-drawn storybook.',
    detail: 1, edges: { color: '#1E1712', angle: 28 },
    bg: () => gradientTex([[0, '#F4ECDC'], [1, '#EADFC8']]),
    material: role => { const c = mix(BASE[role] || '#ccc', '#F4ECDC', .12); return new THREE.MeshToonMaterial({ color: c, gradientMap: toonRamp(3) }); },
    lights: () => [new THREE.AmbientLight('#FFFFFF', .9), sun('#FFFFFF', 2.4, [8, 16, 12], true, 1)],
    exposure: 1.0,
  },
  {
    id: 'porcelain', name: 'Blue and white porcelain', zh: '青花瓷', blurb: 'Glazed white china with cobalt blue roofs and trims, like a Ming dynasty figurine.',
    detail: 1, ao: true, edges: { color: '#1E4FA0', angle: 32, opacity: .55 },
    bg: () => gradientTex([[0, '#F3F1EA'], [1, '#DCE3EA']]),
    material: role => { const blue = /roof|gold|band|door|lattice|window|lantern|maroon|redPalace2|ridge|pearl|cabin|light/.test(role), water = /water|lake/.test(role);
      return new THREE.MeshPhysicalMaterial({ color: col(blue ? '#2456A8' : water ? '#B9CCE0' : role === 'grass' ? '#EEF1EC' : role === 'tree' ? '#C9D8E8' : '#F8F6F0'),
        roughness: .18, metalness: 0, clearcoat: 1, clearcoatRoughness: .08 }); },
    lights: () => [new THREE.HemisphereLight('#FFFFFF', '#BFC8D4', 1.4), sun('#FFFFFF', 2.0, [10, 18, 12], true, 6)],
    env: true, exposure: .95,
  },
  {
    id: 'neon', name: 'Neon night', zh: '霓虹夜', blurb: 'Dark night with glowing outlines and lit windows, like the city skylines on the river at night.',
    detail: 1, bloom: [.55, .35, .3], edges: { color: '#55E0FF', angle: 30, byRole: true },
    bg: () => gradientTex([[0, '#05060F'], [.7, '#121436'], [1, '#2A1A3E']]),
    material: role => { const g = GLOW[role]; return new THREE.MeshStandardMaterial({ color: col(/water|lake/.test(role) ? '#0C1630' : '#0E1120'), roughness: /water|lake/.test(role) ? .15 : .55, metalness: .4,
      emissive: col(g || '#000'), emissiveIntensity: g ? (/pearl|glass/.test(role) ? .7 : 1.3) : 0 }); },
    lineColor: role => /roof|ridge/.test(role) ? '#FF5AC8' : /gold|band/.test(role) ? '#FFD45A' : /steel/.test(role) ? '#B46AFF' : /tree|trunk|grass|plinth/.test(role) ? '#2E8A6A' : '#55E0FF',
    lights: () => [new THREE.HemisphereLight('#3A4A9A', '#1A1020', .6), sun('#8AA0FF', .8, [-10, 14, 8], false)],
    exposure: 1.0,
  },
];

// dress a model in a look: materials, outlines, shadows
export function dress(group, style) {
  const lines = [];
  group.traverse(o => {
    if (!o.isMesh) return;
    const role = o.userData.role; let m = matFor(style, role);
    if (o.userData.double) { const k = style.id + ':' + role + ':2'; if (!cache.has(k)) { const c = m.clone(); c.side = THREE.DoubleSide; cache.set(k, c); } m = cache.get(k); }
    if (o.isInstancedMesh && o.instanceColor && style.id !== 'porcelain' && style.id !== 'neon') { const k = style.id + ':' + role + ':ic'; if (!cache.has(k)) { const c = m.clone(); c.color.set('#ffffff'); cache.set(k, c); } m = cache.get(k); }
    o.material = m;
    if (style.edges && !o.isInstancedMesh && !/person|skin|tree|grass|water|lake/.test(role)) {
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, style.edges.angle),
        new THREE.LineBasicMaterial({ color: style.lineColor ? style.lineColor(role) : style.edges.color, transparent: !!style.edges.opacity, opacity: style.edges.opacity || 1 }));
      lines.push([o, e]);
    }
  });
  lines.forEach(([o, e]) => o.add(e));
  return group;
}
