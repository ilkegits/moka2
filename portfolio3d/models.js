// The monuments as 3D models. Every mesh carries a role (userData.role); a look (styles.js) turns roles into materials.
import * as THREE from 'three';

let DET = 1;   // detail: 1 full, 0 low-poly
const seg = (hi, lo) => (DET ? hi : lo);
const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647);

function tag(m, role, o = {}) { m.userData.role = role; Object.assign(m.userData, o); m.castShadow = true; m.receiveShadow = true; return m; }
function at(m, x = 0, y = 0, z = 0, ry = 0) { m.position.set(x, y, z); m.rotation.y = ry; return m; }
const mesh = (g, role, o) => tag(new THREE.Mesh(g, null), role, o);

// a box standing on y
function box(w, h, d, role, x = 0, y = 0, z = 0, ry = 0) { const g = new THREE.BoxGeometry(w, h, d); g.translate(0, h / 2, 0); return at(mesh(g, role), x, y, z, ry); }
// a cylinder standing on y
function cyl(rt, rb, h, n, role, x = 0, y = 0, z = 0, ry = 0) { const g = new THREE.CylinderGeometry(rt, rb, h, n, 1); g.translate(0, h / 2, 0); return at(mesh(g, role), x, y, z, ry); }
function sph(r, role, x = 0, y = 0, z = 0, n = 32) { return at(mesh(new THREE.SphereGeometry(r, seg(n, 8), seg(Math.round(n * .7), 6)), role), x, y, z); }
function torus(R, r, role, y = 0) { const m = mesh(new THREE.TorusGeometry(R, r, seg(8, 4), seg(64, 16)), role); m.rotation.x = Math.PI / 2; m.position.y = y; return m; }
// a rod between two points
function rod(a, b, r, role, r2 = r) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
  const m = mesh(new THREE.CylinderGeometry(r2, r, len, seg(12, 5), 1), role);
  m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); return m;
}
// a block whose walls lean in as they rise (Tibetan and brick walls)
function batter(wB, dB, wT, dT, h, role, x = 0, y = 0, z = 0) {
  const g = new THREE.BoxGeometry(1, 1, 1), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const top = p.getY(i) > 0; p.setXYZ(i, p.getX(i) * (top ? wT : wB), (p.getY(i) + .5) * h, p.getZ(i) * (top ? dT : dB)); }
  g.computeVertexNormals(); return at(mesh(g, role), x, y, z);
}
/* A Chinese roof: concave, shallow at the eaves and steep at the top, with the corners swept up.
   plan: n = 4 (w x d rectangle, a ridge of length ridge*w) or n = 6/8 (polygon of radius r, round to a point).
   inner > 0 makes an eave skirt that stops at a smaller copy of the outline (a roof between two floors). */
function roof({ n = 4, w = 4, d = 4, r = 2, h = 1, ridge = .45, inner = 0, lift = .35, flare = .12, concave = 1.9, role = 'roof', y = 0, x = 0, z = 0, ry = 0 }) {
  const corners = n === 4 ? [[w / 2, d / 2], [-w / 2, d / 2], [-w / 2, -d / 2], [w / 2, -d / 2]]
    : Array.from({ length: n }, (_, i) => { const a = (i + .5) / n * Math.PI * 2; return [Math.cos(a) * r, Math.sin(a) * r]; });
  const S = seg(10, 2), T = seg(10, 3), out = [];
  for (let i = 0; i < corners.length; i++) { const [ax, az] = corners[i], [bx, bz] = corners[(i + 1) % corners.length];
    for (let s = 0; s < S; s++) { const q = s / S, c = Math.pow(Math.abs(2 * q - 1), 5); out.push([ax + (bx - ax) * q, az + (bz - az) * q, c]); } }
  const rl = ridge * w / 2, target = ([px, pz]) => inner ? [px * inner, pz * inner] : n === 4 ? [Math.max(-rl, Math.min(rl, px * (rl / (w / 2)))), 0] : [0, 0];
  const pos = [], idx = [], N = out.length;
  for (let t = 0; t <= T; t++) { const k = t / T;
    for (const [px, pz, c] of out) { const [tx, tz] = target([px, pz]), fl = 1 + flare * c * Math.pow(1 - k, 2);
      pos.push((px + (tx - px) * k) * fl, h * Math.pow(k, concave) + lift * c * Math.pow(1 - k, 2.4), (pz + (tz - pz) * k) * fl); } }
  for (let t = 0; t < T; t++) for (let i = 0; i < N; i++) { const a = t * N + i, b = t * N + (i + 1) % N, c2 = a + N, d2 = b + N; idx.push(a, c2, b, b, c2, d2); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const grp = new THREE.Group(), m = mesh(g, role, { double: true }); grp.add(m);
  if (n === 4 && !inner) { const rb = box(rl * 2 + .2, .14, .16, 'ridge', 0, h - .03, 0); grp.add(rb);   // the ridge and its curled ends
    [-1, 1].forEach(sx => { const e = box(.12, .3, .14, 'ridge', sx * (rl + .1), h - .02, 0); e.rotation.z = sx * -.35; grp.add(e); }); }
  grp.position.set(x, y, z); grp.rotation.y = ry; return grp;
}
// a round concave roof (Temple of Heaven), optionally a ring that stops at rIn
function roundRoof(R, h, role, y, rIn = 0) {
  const pts = [], T = seg(14, 3); for (let t = 0; t <= T; t++) { const k = t / T; pts.push(new THREE.Vector2(R - (R - rIn) * k, h * Math.pow(k, 1.7))); }
  if (!rIn) pts.push(new THREE.Vector2(0.001, h));
  const g = new THREE.LatheGeometry(pts, seg(64, 10)); const m = mesh(g, role, { double: true }); m.position.y = y; return m;
}
// many copies of one small part
function many(g, role, list, color) {
  const m = new THREE.InstancedMesh(g, null, list.length), o = new THREE.Object3D(), col = new THREE.Color();
  list.forEach((p, i) => { o.position.set(p[0], p[1], p[2]); o.rotation.set(0, p[3] || 0, 0); o.scale.setScalar(p[4] || 1); o.updateMatrix(); m.setMatrixAt(i, o.matrix); if (color) m.setColorAt(i, col.set(color(i))); });
  return tag(m, role, { inst: true });
}
// windows along the front (z+) face of a block
function windowsOn(x0, x1, y0, y1, z, cols, rows, role = 'window', ry = 0, ww = .16, wh = .26) {
  const L = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = x0 + (x1 - x0) * (c + .5) / cols, y = y0 + (y1 - y0) * (r + .5) / rows;
    L.push(ry ? [Math.sin(ry) * z + Math.cos(ry) * x, y, Math.cos(ry) * z - Math.sin(ry) * x, ry] : [x, y, z, 0]); }
  const g = new THREE.BoxGeometry(ww, wh, .06); return many(g, role, L);
}

/* ---------- the stage every monument stands on: a round base, grass, maybe water, trees and tiny people ---------- */
function stage(R, { water = 0, waterRole = 'water', people = 40, trees = 28, keep = 3, seed = 3, ground = 'grass' } = {}) {
  const g = new THREE.Group(), r = rnd(seed);
  g.add(cyl(R + .25, R + .45, .9, seg(96, 14), 'plinth', 0, -.9, 0));
  g.add(cyl(R, R, .06, seg(96, 14), ground, 0, -.06, 0));
  { const top = new THREE.RingGeometry(.01, R, seg(96, 14), seg(24, 4)); top.rotateX(-Math.PI / 2); g.add(at(mesh(top, ground), 0, .003, 0)); }   // fine rings, so the long fan triangles of the cap don't streak
  if (water) {   // the front of the disc is a river or a lake
    const sh = new THREE.Shape(), a = Math.asin(Math.min(1, water / R));
    sh.absarc(0, 0, R, a, Math.PI - a, false); sh.lineTo(Math.cos(a) * R, Math.sin(a) * R);
    const wg = new THREE.ShapeGeometry(sh, seg(48, 8)); wg.rotateX(Math.PI / 2); wg.scale(1, 1, 1);
    const w = mesh(wg, waterRole, { double: true }); w.position.y = .02; g.add(w);
    g.add(box(2 * Math.sqrt(R * R - water * water), .12, .14, 'stone', 0, 0, water));
  }
  const ok = (x, z) => Math.hypot(x, z) > keep && Math.hypot(x, z) < R - .5 && !(water && z > water - .3);
  for (let i = 0, n = 0; i < 400 && n < trees; i++) { const a = r() * Math.PI * 2, d = keep + r() * (R - keep - .6), x = Math.cos(a) * d, z = Math.sin(a) * d; if (!ok(x, z)) continue; n++;
    const s = .6 + r() * .6; g.add(cyl(.05 * s, .07 * s, .5 * s, seg(6, 4), 'trunk', x, 0, z));
    if (r() < .5) g.add(at(mesh(new THREE.ConeGeometry(.42 * s, 1.3 * s, seg(10, 5)), 'tree'), x, .5 * s + .6 * s, z));
    else g.add(sph(.5 * s, 'tree', x, .75 * s, z, 12)); }
  if (people) { const L = []; for (let i = 0, n = 0; i < 600 && n < people; i++) { const a = r() * Math.PI * 2, d = keep - .4 + r() * (R - keep), x = Math.cos(a) * d, z = Math.sin(a) * d; if (!ok(x, z)) continue; n++; L.push([x, 0, z, r() * 6, .9 + r() * .3]); }
    const body = new THREE.CapsuleGeometry(.055, .16, 2, 6); body.translate(0, .14, 0);
    const pal = ['#C9302A', '#2F5D8A', '#E8B44C', '#F2EEE6', '#4E9A72', '#7B4B67', '#2A2A2A', '#E07A3A'];
    g.add(many(body, 'person', L, i => pal[i % pal.length]));
    const head = new THREE.SphereGeometry(.05, 6, 5); head.translate(0, .32, 0); g.add(many(head, 'skin', L)); }
  return g;
}
function boat(x, z, ry, s = 1) {
  const g = new THREE.Group(); g.add(box(1.2 * s, .14 * s, .38 * s, 'boat', 0, 0, 0)); g.add(box(.7 * s, .18 * s, .3 * s, 'cabin', -.1 * s, .14 * s, 0)); g.add(box(.36 * s, .12 * s, .24 * s, 'boat', -.1 * s, .32 * s, 0));
  return at(g, x, .02, z, ry);
}

/* ---------- 1 Shanghai: the Oriental Pearl Tower ---------- */
function pearl() {
  const g = new THREE.Group(), A = [Math.PI / 2, Math.PI / 2 + 2.094, Math.PI / 2 + 4.189];
  g.add(cyl(1.7, 1.9, .45, seg(48, 8), 'glass'));
  A.forEach(a => {
    g.add(rod([Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6], [Math.cos(a) * .5, 4.3, Math.sin(a) * .5], .34, 'concrete', .28));
    const b = a + Math.PI / 3; g.add(rod([Math.cos(b) * .62, 0, Math.sin(b) * .62], [Math.cos(b) * .62, 10.6, Math.sin(b) * .62], .27, 'concrete'));
    g.add(sph(.5, 'pearl', Math.cos(b) * 2.3, .5, Math.sin(b) * 2.3, 20));
  });
  const ball = (r, y) => { g.add(sph(r, 'pearl', 0, y, 0, 48)); [-.55, -.25, .25, .55].forEach(q => g.add(torus(r * Math.sqrt(1 - q * q) * 1.003, .025, 'glassBand', y + r * q)));
    g.add(torus(r * 1.04, .07, 'concrete', y)); };
  ball(1.85, 4.6);
  [6.9, 7.45, 8.0, 8.55, 9.1].forEach((y, i) => g.add(sph(.36, 'pearl', i % 2 ? .22 : -.22, y, i % 2 ? -.12 : .12, 20)));
  ball(1.25, 10.3);
  g.add(cyl(.22, .26, 1.3, seg(16, 6), 'concrete', 0, 11.5));
  g.add(sph(.52, 'pearl', 0, 13.2, 0, 24)); g.add(torus(.58, .04, 'concrete', 13.2));
  g.add(cyl(.03, .15, 3.2, seg(12, 5), 'steel', 0, 13.6)); [14.1, 14.8, 15.5].forEach((y, i) => g.add(cyl(.2 - i * .04, .2 - i * .04, .08, 12, 'steel', 0, y)));
  g.add(sph(.08, 'light', 0, 16.85, 0, 8));
  return g;
}
/* ---------- 2 Hangzhou: the Leifeng Pagoda ---------- */
function leifeng() {
  const g = new THREE.Group(), n = 8, rot = Math.PI / 8;
  g.add(cyl(4.0, 4.3, .5, n, 'stone', 0, 0, 0, rot)); g.add(cyl(3.4, 3.5, .45, n, 'stone', 0, .5, 0, rot));
  let y = .95;
  for (let i = 0; i < 5; i++) {
    const r = 2.45 - i * .26, h = 1.35;
    if (i) g.add(cyl(r + .42, r + .42, .1, n, 'stone', 0, y, 0, rot));
    g.add(cyl(r, r, h, n, 'wallRed', 0, y, 0, rot));
    for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + rot; g.add(cyl(.075, .075, h, seg(8, 4), 'column', Math.cos(a) * r, y, Math.sin(a) * r));
      const fa = a + Math.PI / n, fr = r * Math.cos(Math.PI / n) + .01; g.add(box(.5, .78, .05, k % 2 ? 'lattice' : 'door', Math.cos(fa) * fr, y + .12, Math.sin(fa) * fr, Math.PI / 2 - fa));
      if (i) g.add(cyl(.03, .03, .32, 4, 'stone', Math.cos(a) * (r + .4), y + .1, Math.sin(a) * (r + .4))); }
    g.add(cyl(r + .14, r, .22, n, 'band', 0, y + h, 0, rot));
    const top = i === 4;
    g.add(roof({ n, r: r + 1.05, h: top ? 1.9 : .62, inner: top ? 0 : r / (r + 1.05), lift: .42, role: 'roofBronze', y: y + h + .12, ry: rot }));
    y += h + (top ? 0 : .52);
  }
  g.add(cyl(.05, .09, 2.4, 8, 'gold', 0, y + 1.6)); [0, .32, .62, .9].forEach((d, i) => g.add(cyl(.26 - i * .04, .26 - i * .04, .07, 16, 'gold', 0, y + 2.1 + d)));
  g.add(sph(.17, 'gold', 0, y + 3.2, 0, 12)); g.add(sph(.1, 'gold', 0, y + 3.5, 0, 10));
  return g;
}
/* ---------- 3 Wuhan: the Yellow Crane Tower ---------- */
function crane() {
  const g = new THREE.Group();
  g.add(batter(10, 10, 9.4, 9.4, .7, 'stone')); g.add(batter(8.6, 8.6, 8.2, 8.2, .45, 'stone', 0, .7));
  [0, 1, 2].forEach(i => g.add(box(2.4, .16, .5, 'stone', 0, i * .2, 5.0 + .5 - i * .45 + 0)));   // steps at the front
  let y = 1.15;
  for (let i = 0; i < 5; i++) {
    const w = 5.4 - i * .62, h = 1.3, top = i === 4;
    g.add(box(w, h, w, 'wallRed', 0, y));
    for (let s = 0; s < 4; s++) { const ry = s * Math.PI / 2, nc = Math.max(3, Math.round(w / .62));
      for (let c = 0; c <= nc; c++) { const u = -w / 2 + w * c / nc; g.add(cyl(.07, .07, h, seg(8, 4), 'column', Math.cos(ry) * u + Math.sin(ry) * w / 2, y, Math.cos(ry) * w / 2 - Math.sin(ry) * u)); }
      const lat = box(w * .7, h * .62, .04, 'lattice', 0, y + .22, 0, ry); lat.position.set(Math.sin(ry) * (w / 2 + .01), y + .22, Math.cos(ry) * (w / 2 + .01)); g.add(lat);
      // a wing on every side under its own little roof: the tower's cross plan
      if (!top) { const wing = new THREE.Group(); wing.add(box(w * .42, h * .8, .7, 'wallRed', 0, 0, w / 2 + .35)); wing.add(box(w * .3, h * .5, .02, 'lattice', 0, .1, w / 2 + .71));
        wing.add(roof({ w: w * .42 + .9, d: 1.5, h: .55, ridge: .5, lift: .32, role: 'roofGold', y: h * .8 + .02, z: w / 2 + .45 }));
        wing.position.y = y; wing.rotation.y = ry; g.add(wing); } }
    g.add(box(w + .24, .2, w + .24, 'band', 0, y + h));
    g.add(roof(top ? { w: w + 2.0, d: w + 2.0, h: 2.0, ridge: .38, lift: .55, role: 'roofGold', y: y + h + .16 }
      : { w: w + 1.9, d: w + 1.9, h: .7, inner: w / (w + 1.9), lift: .5, role: 'roofGold', y: y + h + .16 }));
    y += h + (top ? 0 : .62);
  }
  g.add(cyl(.05, .05, .5, 8, 'gold', 0, y + 2.1)); g.add(sph(.32, 'gold', 0, y + 2.75, 0, 16)); g.add(sph(.2, 'gold', 0, y + 3.15, 0, 12)); g.add(cyl(.02, .04, .4, 6, 'gold', 0, y + 3.3));
  return g;
}
/* ---------- 4 Guangzhou: the Canton Tower ---------- */
function canton() {
  const g = new THREE.Group(), H = 12.5, rB = 2.5, rT = 1.65, tw = 2.36, N = seg(24, 12);
  g.add(cyl(3.3, 3.5, .35, seg(48, 10), 'stone'));
  g.add(cyl(.62, .7, H + .4, seg(24, 8), 'concrete', 0, .3));
  for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2;
    g.add(rod([Math.cos(a) * rB, .3, Math.sin(a) * rB], [Math.cos(a + tw) * rT, H, Math.sin(a + tw) * rT], .055, 'steel'));
    if (i % 2 === 0) g.add(rod([Math.cos(a) * rB, .3, Math.sin(a) * rB], [Math.cos(a - tw * .6) * rT, H, Math.sin(a - tw * .6) * rT], .03, 'steel2')); }
  const hw = t => Math.sqrt((1 - t) * (1 - t) * rB * rB + t * t * rT * rT + 2 * t * (1 - t) * rB * rT * Math.cos(tw));
  for (let j = 1; j < seg(28, 10); j++) { const t = j / seg(28, 10); g.add(torus(hw(t), .035, 'steel', .3 + (H - .3) * t)); }
  g.add(cyl(rT + .15, rT + .05, .5, seg(48, 10), 'glass', 0, H)); g.add(cyl(rT * .8, rT + .15, .35, seg(48, 10), 'concrete', 0, H + .5));
  g.add(cyl(.22, .3, 3.0, seg(16, 6), 'concrete', 0, H + .85)); g.add(cyl(.02, .1, 3.4, 8, 'steel', 0, H + 3.85)); g.add(sph(.07, 'light', 0, H + 7.3, 0, 8));
  return g;
}
/* ---------- 5 Chongqing: Hongya Cave ---------- */
function hongya() {
  const g = new THREE.Group(), r = rnd(11);
  g.add(box(14.5, 11.5, 3.2, 'rock', 0, 0, -4.4)); for (let i = 0; i < 9; i++) g.add(box(1.6 + r() * 2.4, 1.2 + r() * 3, 1.2, 'rock', -6.5 + r() * 13, r() * 9, -2.6 - r() * .4));
  g.add(box(14.6, .2, 3.4, 'grass', 0, 11.5, -4.4));
  [[-5.6, 1.2, 2.2], [-3.9, 1.0, 3.4], [3.6, 1.1, 2.8], [5.4, 1.3, 1.8]].forEach(([x, w, h]) => { g.add(box(w, h, w, 'concrete', x, 11.7, -4.6)); g.add(windowsOn(x - w / 2 + .1, x + w / 2 - .1, 11.8, 11.6 + h, -4.6 + w / 2 + .01, 4, Math.round(h / .45), 'windowLit', 0, .12, .18)); });
  for (let x = -5; x <= 5; x += .9) g.add(cyl(.09, .09, 1.25, seg(8, 4), 'wood', x, 0, -.1));
  for (let x = -5; x < 5; x += 1.8) g.add(rod([x, .1, -.1], [x + .9, 1.15, -.1], .04, 'wood')), g.add(rod([x + .9, .1, -.1], [x + 1.8, 1.15, -.1], .04, 'wood'));
  let y = 1.2;
  for (let i = 0; i < 6; i++) {
    const w = 11.4 - i * 1.15, d = 2.3, h = 1.3, z = -.9 - i * .42;
    g.add(box(w, h, d, 'plaster', 0, y, z));
    for (let x = -w / 2; x <= w / 2 + .01; x += w / Math.round(w / 1.1)) g.add(box(.1, h, .08, 'wood', x, y, z + d / 2 + .02));
    g.add(windowsOn(-w / 2 + .2, w / 2 - .2, y + .25, y + h - .15, z + d / 2 + .03, Math.round(w / .42), 2, 'windowLit', 0, .2, .32));
    g.add(box(w, .12, .5, 'wood', 0, y - .02, z + d / 2 + .2));   // the walkway in front of each floor
    g.add(roof({ w: w + .7, d: d + .9, h: .55, ridge: .9, lift: .22, role: 'roofGrey', y: y + h, z }));
    for (let k = 0; k < Math.round(w / 3); k++) { const gx = -w / 2 + w * (k + .5) / Math.round(w / 3) + (r() - .5) * .6;   // little gables along the roofs
      g.add(box(.9, .5, .8, 'plaster', gx, y + h + .25, z + .3)); g.add(roof({ w: 1.5, d: 1.3, h: .55, ridge: .3, lift: .25, role: 'roofGrey', y: y + h + .75, x: gx, z: z + .3, ry: Math.PI / 2 })); }
    for (let x = -w / 2 + .4; x < w / 2; x += .9) g.add(sph(.09, 'lantern', x, y + h - .12, z + d / 2 + .45, 10));
    y += h + .55;
  }
  [[-1.3, 1.0], [1.3, 1.0]].forEach(([x, s]) => { g.add(box(1.1 * s, 1.0, 1.1 * s, 'plaster', x, y, -3.6)); g.add(roof({ n: 4, w: 1.9, d: 1.9, h: 1.1, ridge: .02, lift: .3, role: 'roofGrey', y: y + 1.0, x, z: -3.6 })); });
  g.add(box(1.4, 1.6, 1.4, 'plaster', 0, y, -3.4)); g.add(roof({ w: 2.4, d: 2.4, h: .6, inner: .58, lift: .3, role: 'roofGrey', y: y + 1.6, z: -3.4 }));
  g.add(box(.9, .9, .9, 'plaster', 0, y + 2.0, -3.4)); g.add(roof({ w: 1.7, d: 1.7, h: 1.2, ridge: .02, lift: .32, role: 'roofGrey', y: y + 2.9, z: -3.4 }));
  return g;
}
/* ---------- 6 Lhasa: the Potala Palace ---------- */
function potala() {
  const g = new THREE.Group();
  const hill = new THREE.LatheGeometry([[9.2, 0], [8.2, .7], [6.5, 1.6], [5.2, 2.3], [4.2, 2.7], [.01, 2.8]].map(p => new THREE.Vector2(...p)), seg(48, 10));
  const hm = mesh(hill, 'rock'); hm.scale.set(1, 1, .62); g.add(hm);
  g.add(batter(12.2, 4.4, 11.4, 4.0, 2.4, 'white', 0, 1.7, .3));
  g.add(windowsOn(-5.3, 5.3, 2.0, 3.9, 2.32 + .3, 26, 3, 'windowDark', 0, .17, .26));
  g.add(box(11.4, .3, 4.0, 'maroon', 0, 4.1, .3));
  const block = (x, w, d, h, y0, z, role, cols, rows) => { g.add(batter(w, d, w - .4, d - .3, h, role, x, y0, z)); g.add(box(w - .4, .32, d - .3, 'maroon', x, y0 + h, z));
    g.add(windowsOn(x - w / 2 + .45, x + w / 2 - .45, y0 + .3, y0 + h - .25, z + d / 2 - .1, cols, rows, 'windowDark', 0, .17, .26)); };
  block(-3.6, 4.4, 3.8, 3.0, 4.1, .1, 'white', 9, 4);
  block(3.7, 4.6, 3.9, 3.5, 4.1, 0, 'white', 9, 5);
  block(0, 3.6, 3.4, 5.4, 4.1, .25, 'redPalace', 7, 7);
  g.add(box(.9, 4.6, .06, 'redPalace2', 0, 4.5, 1.92));   // the middle strip of the Red Palace
  [-1.0, 0, 1.0].forEach((x, i) => { g.add(box(.8, .45, .8, 'redPalace', x, 9.82, -.2)); g.add(roof({ w: 1.25, d: 1.25, h: .55, ridge: i === 1 ? .35 : .05, lift: .22, role: 'gold', y: 10.27, x, z: -.2 })); });
  [-1.6, 1.6].forEach(x => g.add(cyl(.14, .16, .7, 12, 'gold', x, 9.82, .9)));
  [-1, 1].forEach(sx => {   // white wings stepping down the hill on both sides, with dark windows and maroon trims
    [[7.3, 2.6, 2.0, .35, 1.1], [9.0, 1.9, 1.4, 0, 1.6]].forEach(([x, w, h, y0, z]) => { g.add(batter(w, 2.6, w - .3, 2.3, h, 'white', sx * x, y0, z)); g.add(box(w - .3, .2, 2.3, 'maroon', sx * x, y0 + h, z));
      g.add(windowsOn(sx * x - w / 2 + .35, sx * x + w / 2 - .35, y0 + .3, y0 + h - .2, z + 1.2, Math.round(w / .5), Math.max(1, Math.round(h / .7)), 'windowDark', 0, .15, .22)); });
    g.add(batter(.6, .7, .4, .5, 1.4, 'white', sx * 10.2, 0, 1.6));   // the round end towers
  });
  const rr = rnd(29); for (let k = 0; k < 16; k++) { const a = (rr() - .5) * 2.4, R = 6.4 + rr() * 2.4;   // rocks on the hill
    const m = box(.5 + rr() * .9, .3 + rr() * .5, .5 + rr() * .7, 'rock', Math.sin(a) * R, .1 + (9.2 - R) * .25, Math.cos(a) * R * .62, rr() * 3); m.rotation.x = (rr() - .5) * .4; g.add(m); }
  [[-1, 1], [1, -1]].forEach(([sx]) => { const z = 2.6; let px = sx * 6.6, py = .1;   // zigzag stairs up the hill
    for (let k = 0; k < 3; k++) { const nx = sx * (k % 2 ? 6.4 : 4.6), ny = py + .55; g.add(rod([px, py, z + .9 - k * .3], [nx, ny, z + .6 - k * .3], .16, 'white')); px = nx; py = ny; } });
  return g;
}
/* ---------- 7 Xi'an: the Big Wild Goose Pagoda ---------- */
function goose() {
  const g = new THREE.Group();
  g.add(batter(7.4, 7.4, 7.0, 7.0, 1.4, 'brick2')); g.add(box(7.2, .12, 7.2, 'stone', 0, 1.4));
  let y = 1.52;
  for (let i = 0; i < 7; i++) {
    const w = 4.6 - i * .36, h = 1.32 - i * .05;
    g.add(batter(w, w, w - .14, w - .14, h, 'brick', 0, y));
    for (let s = 0; s < 4; s++) { const ry = s * Math.PI / 2, dx = Math.sin(ry) * (w / 2 - .02), dz = Math.cos(ry) * (w / 2 - .02);
      g.add(box(.42, .62, .06, 'door', dx, y + .2, dz, ry));
      [-.3, .3].forEach(u => g.add(box(.09, h, .05, 'brick2', dx + Math.cos(ry) * u * w, y, dz - Math.sin(ry) * u * w, ry))); }
    g.add(box(w + .5, .12, w + .5, 'brick2', 0, y + h)); g.add(box(w + .3, .1, w + .3, 'brick', 0, y + h + .12)); g.add(box(w + .1, .08, w + .1, 'brick2', 0, y + h + .22));
    y += h + .3;
  }
  g.add(batter(2.3, 2.3, .4, .4, .9, 'brick2', 0, y)); g.add(cyl(.04, .06, 1.6, 8, 'gold', 0, y + .9));
  [0, .3, .55].forEach((d, i) => g.add(cyl(.22 - i * .05, .22 - i * .05, .07, 14, 'gold', 0, y + 1.2 + d))); g.add(sph(.15, 'gold', 0, y + 2.1, 0, 12));
  return g;
}
/* ---------- 8 Beijing: the Temple of Heaven ---------- */
function heaven() {
  const g = new THREE.Group();
  const terr = [[6.4, 0], [5.3, .5], [4.2, 1.0]];
  terr.forEach(([R, y]) => { g.add(cyl(R, R + .05, .5, seg(96, 14), 'marble', 0, y));
    const n = seg(Math.round(R * 9), 20), L = []; for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2; L.push([Math.cos(a) * (R - .08), y + .5, Math.sin(a) * (R - .08)]); }
    g.add(many(new THREE.CylinderGeometry(.045, .05, .34, 6).translate(0, .17, 0), 'marble', L)); g.add(torus(R - .08, .035, 'marble', y + .78)); });
  [0, 1, 2].forEach(i => g.add(box(1.4, .5, 1.0, 'marble', 0, i * .5, 6.6 - i * 1.1)));   // the steps up the front
  let y = 1.5;
  g.add(cyl(2.8, 2.8, 1.9, seg(48, 10), 'wallRed', 0, y));
  for (let k = 0; k < seg(24, 10); k++) { const a = k / seg(24, 10) * Math.PI * 2; g.add(cyl(.09, .09, 1.9, 8, 'column', Math.cos(a) * 2.82, y, Math.sin(a) * 2.82)); }
  g.add(cyl(2.88, 2.85, .3, seg(48, 10), 'band', 0, y + 1.9));
  g.add(roundRoof(3.9, .8, 'roofBlue', y + 2.15, 2.4));
  g.add(cyl(2.3, 2.3, .9, seg(48, 10), 'wallRed', 0, y + 2.75)); g.add(cyl(2.38, 2.35, .26, seg(48, 10), 'band', 0, y + 3.65));
  g.add(roundRoof(3.25, .75, 'roofBlue', y + 3.88, 1.8));
  g.add(cyl(1.75, 1.75, .85, seg(48, 10), 'wallRed', 0, y + 4.45)); g.add(cyl(1.83, 1.8, .26, seg(48, 10), 'band', 0, y + 5.3));
  g.add(roundRoof(2.7, 1.9, 'roofBlue', y + 5.52));
  g.add(cyl(.12, .2, .5, 12, 'gold', 0, y + 7.3)); g.add(sph(.38, 'gold', 0, y + 8.0, 0, 18));
  return g;
}

/* ---------- shared parts for the second set ---------- */
// a pointed (Islamic) arch, as a thin panel facing z+; role door = a dark recess
function arch(w, h, role, x = 0, y = 0, z = 0, ry = 0, depth = .08) {
  const s = new THREE.Shape(), k = Math.min(w * .62, h * .45);
  s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - k); s.quadraticCurveTo(-w / 2, h - k * .25, 0, h); s.quadraticCurveTo(w / 2, h - k * .25, w / 2, h - k); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: seg(8, 2) });
  return at(mesh(g, role), x, y, z, ry);
}
// a round-topped (Romanesque) window, facing z+
function roundWin(w, h, role, x = 0, y = 0, z = 0, ry = 0, depth = .06) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
  return at(mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: seg(8, 2) }), role), x, y, z, ry);
}
// an onion dome of radius r standing on y, with a cross or a crescent on top
function onion(r, role, x, y, z, top = 'cross') {
  const P = [[1, 0], [1.28, .32], [1.36, .72], [1.22, 1.15], [.86, 1.55], [.42, 1.92], [.14, 2.25], [.04, 2.55]].map(([a, b]) => new THREE.Vector2(a * r, b * r));
  const g = new THREE.Group(); g.add(at(mesh(new THREE.LatheGeometry(P, seg(32, 8)), role, { double: true }), 0, 0, 0));
  g.add(cyl(.03 * r + .015, .03 * r + .015, .5 * r, 8, 'gold', 0, 2.5 * r));
  if (top === 'cross') { g.add(box(.05, .6 * r, .05, 'gold', 0, 2.9 * r)); g.add(box(.32 * r, .05, .05, 'gold', 0, 3.25 * r)); }
  else { const c = mesh(new THREE.TorusGeometry(.16 * r + .05, .025, 6, 16, Math.PI * 1.4), 'gold'); c.position.set(0, 3.25 * r, 0); c.rotation.z = Math.PI * .8; g.add(c); g.add(sph(.06, 'gold', 0, 2.95 * r, 0, 8)); }
  return at(g, x, y, z);
}
// rooms of windows round a cylinder, facing out
function ringWins(R, y0, y1, n, rows, role = 'windowDark', ww = .16, wh = .24) {
  const L = []; for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) { const a = (i + (r % 2) * .5) / n * Math.PI * 2, y = rows > 1 ? y0 + (y1 - y0) * r / (rows - 1) : y0;
    L.push([Math.sin(a) * R, y, Math.cos(a) * R, a]); }
  return many(new THREE.BoxGeometry(ww, wh, .1), role, L);
}

/* the Great Wall's cut-out for the map, cards and shop: one watchtower with a stretch of wall each side, no hill under it
   (on the map the wall itself runs on across the country from here) */
function wallIcon() {
  const g = new THREE.Group(), t = new THREE.Group();
  t.add(box(1.7, 2.3, 1.7, 'wallGrey')); t.add(box(1.84, .16, 1.84, 'stone', 0, 2.3, 0));
  for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2; t.add(arch(.36, .6, 'door', Math.sin(a) * .86, .9, Math.cos(a) * .86, a, .04)); [-.45, .45].forEach(u => t.add(arch(.22, .4, 'door', Math.sin(a) * .86 + Math.cos(a) * u, 1.05, Math.cos(a) * .86 - Math.sin(a) * u, a, .04))); }
  const L = []; for (let s = 0; s < 4; s++) for (let j = 0; j < 5; j++) { const a = s * Math.PI / 2, u = -.7 + j * .35; L.push([Math.sin(a) * .84 + Math.cos(a) * u, 2.46, Math.cos(a) * .84 - Math.sin(a) * u, a]); }
  t.add(many(new THREE.BoxGeometry(.18, .28, .16).translate(0, .14, 0), 'wallGrey', L));
  t.add(box(1.0, .62, .8, 'wallGrey', 0, 2.46, 0)); t.add(roof({ w: 1.4, d: 1.15, h: .5, ridge: .5, lift: .2, role: 'roofGrey', y: 3.08 }));
  g.add(t);
  [-1, 1].forEach(sx => {   // the wall going off each side, a walkway with battlements on both edges
    g.add(box(3.2, 1.25, .95, 'wallGrey', sx * 2.45, 0, 0));
    const M = []; for (let j = 0; j < 7; j++) { const x = sx * (1.05 + j * .46); M.push([x, 1.25, .4, 0], [x, 1.25, -.4, 0]); }
    g.add(many(new THREE.BoxGeometry(.2, .24, .14).translate(0, .12, 0), 'wallGrey', M)); });
  return g;
}

/* ---------- 9 Badaling: the Great Wall, snaking over green hills from watchtower to watchtower ---------- */
function greatwall() {
  const g = new THREE.Group(), R = 9.4, r = rnd(41);
  const bumps = [[-5.2, -3.0, 3.0, 2.3], [-.6, 1.0, 3.3, 2.2], [3.6, -2.6, 4.0, 2.3], [7.4, -.8, 2.3, 1.8], [-7.2, 2.6, 1.3, 2.0], [1.8, 5.6, 1.1, 2.2], [-3.4, 5.4, .9, 1.9], [5.8, 4.4, 1.0, 1.7], [-1.8, -6.4, 1.6, 2.2]];
  const H = (x, z) => bumps.reduce((a, [bx, bz, h, rr]) => a + h * Math.exp(-((x - bx) ** 2 + (z - bz) ** 2) / (rr * rr)), 0) * Math.max(0, 1 - Math.pow(Math.hypot(x, z) / R, 8));
  const N = seg(110, 26), pg = new THREE.PlaneGeometry(2 * R, 2 * R, N, N); pg.rotateX(-Math.PI / 2);
  const p = pg.attributes.position;
  for (let i = 0; i < p.count; i++) { let x = p.getX(i), z = p.getZ(i); const d = Math.hypot(x, z); if (d > R) { x *= R / d; z *= R / d; } p.setXYZ(i, x, H(x, z) + .015, z); }
  pg.computeVertexNormals(); g.add(mesh(pg, 'hill'));
  // the wall: along a curve over the ridges, a walkway with crenellations on the outer side and a low parapet inside
  const curve = new THREE.CatmullRomCurve3([[-9.2, -3.4], [-7.2, -3.4], [-5.2, -3.0], [-3.2, -1.2], [-.6, 1.0], [1.4, -.6], [3.6, -2.6], [5.6, -2.2], [7.4, -.8], [9.2, .4]].map(([x, z]) => new THREE.Vector3(x, 0, z)));
  const M = seg(160, 40), S = curve.getSpacedPoints(M).filter(v => Math.hypot(v.x, v.z) < R - .3).map(v => new THREE.Vector3(v.x, H(v.x, v.z), v.z));
  const up = new THREE.Vector3(0, 1, 0), mer = [], par = [], walkers = [];
  for (let i = 0; i < S.length - 1; i++) {
    const a = S[i], b = S[i + 1], d = b.clone().sub(a), len = d.length(), m = a.clone().add(b).multiplyScalar(.5);
    const w = mesh(new THREE.BoxGeometry(.78, 1.5, len + .04), 'wallGrey'); w.position.copy(m); w.lookAt(b); g.add(w);   // reaches down into the hill
    const side = new THREE.Vector3().crossVectors(up, d).normalize();
    if (i % 2 === 0) { const q = m.clone().addScaledVector(side, .33); mer.push([q.x, q.y + .75, q.z, Math.atan2(d.x, d.z)]); }
    const q2 = m.clone().addScaledVector(side, -.35); par.push([q2.x, q2.y + .75, q2.z, Math.atan2(d.x, d.z), 1]);
    if (r() < .07) walkers.push([m.x + side.x * (r() - .5) * .3, m.y + .75, m.z + side.z * (r() - .5) * .3, r() * 6]);
  }
  g.add(many(new THREE.BoxGeometry(.12, .26, .22).translate(0, .13, 0), 'wallGrey', mer));
  g.add(many(new THREE.BoxGeometry(.08, .14, .2).translate(0, .07, 0), 'wallGrey', par));
  // watchtowers on the high points
  const towers = []; for (let i = 3; i < S.length - 3; i++) { const h = S[i].y; if (h >= S[i - 3].y && h >= S[i + 3].y && h > 1.2 && (!towers.length || i - towers.at(-1) > 10)) towers.push(i); }
  [Math.round(S.length * .06), Math.round(S.length * .94)].forEach(i => { if (!towers.some(t => Math.abs(t - i) < 10)) towers.push(i); });
  towers.forEach((i, k) => {
    const c = S[i], d = S[Math.min(S.length - 1, i + 1)].clone().sub(S[Math.max(0, i - 1)]), ry = Math.atan2(d.x, d.z), t = new THREE.Group();
    t.add(box(1.5, 2.5, 1.5, 'wallGrey', 0, -.8, 0)); t.add(box(1.62, .14, 1.62, 'stone', 0, 1.7, 0));
    for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2; t.add(arch(.32, .55, 'door', Math.sin(a) * .76, .75, Math.cos(a) * .76, a, .04)); [-.38, .38].forEach(u => t.add(arch(.2, .38, 'door', Math.sin(a) * .76 + Math.cos(a) * u, .85, Math.cos(a) * .76 - Math.sin(a) * u, a, .04)).length); }
    const L = []; for (let s = 0; s < 4; s++) for (let j = 0; j < 5; j++) { const a = s * Math.PI / 2, u = -.62 + j * .31; L.push([Math.sin(a) * .74 + Math.cos(a) * u, 1.84, Math.cos(a) * .74 - Math.sin(a) * u, a]); }
    t.add(many(new THREE.BoxGeometry(.16, .26, .14).translate(0, .13, 0), 'wallGrey', L));
    if (k % 2 === 0) { t.add(box(.86, .55, .7, 'wallGrey', 0, 1.84, 0)); t.add(roof({ w: 1.2, d: 1.0, h: .42, ridge: .5, lift: .18, role: 'roofGrey', y: 2.39 })); }
    at(t, c.x, c.y, c.z, ry); g.add(t);
  });
  if (walkers.length) { const body = new THREE.CapsuleGeometry(.055, .16, 2, 6); body.translate(0, .14, 0); const pal = ['#C9302A', '#2F5D8A', '#E8B44C', '#F2EEE6', '#4E9A72'];
    g.add(many(body, 'person', walkers, i => pal[i % pal.length])); const hd = new THREE.SphereGeometry(.05, 6, 5); hd.translate(0, .32, 0); g.add(many(hd, 'skin', walkers)); }
  // woods on the slopes, kept off the wall
  for (let i = 0, n = 0; i < 900 && n < seg(70, 30); i++) { const a = r() * Math.PI * 2, dd = Math.sqrt(r()) * (R - .7), x = Math.cos(a) * dd, z = Math.sin(a) * dd;
    if (S.some(v => (v.x - x) ** 2 + (v.z - z) ** 2 < 1.1)) continue; n++; const s = .5 + r() * .5, y = H(x, z);
    if (r() < .55) g.add(sph(.48 * s, 'tree', x, y + .55 * s, z, 10)); else g.add(at(mesh(new THREE.ConeGeometry(.4 * s, 1.2 * s, seg(8, 5)), 'tree'), x, y + .6 * s, z)); }
  return g;
}

/* ---------- 10 Harbin: St. Sophia Cathedral, red brick with green onion domes ---------- */
function sophia() {
  const g = new THREE.Group(), B = 'brickRed', G = 'copper';
  g.add(box(10, .3, 13, 'stone', 0, 0, .4));   // the square
  g.add(box(4.4, 4.6, 9.2, B, 0, .3, -.8)); g.add(box(9.6, 4.6, 4.4, B, 0, .3, -1.2)); g.add(cyl(2.2, 2.2, 4.6, seg(32, 8), B, 0, .3, -5.3));
  g.add(roof({ w: 4.8, d: 9.6, h: 1.0, ridge: .9, lift: .05, flare: 0, concave: 1, role: G, y: 4.9, z: -.8 })); g.add(roof({ w: 10, d: 4.8, h: 1.0, ridge: .9, lift: .05, flare: 0, concave: 1, role: G, y: 4.9, z: -1.2 }));
  g.add(box(4.6, .22, 9.4, 'white', 0, 4.7, -.8)); g.add(box(9.8, .22, 4.6, 'white', 0, 4.7, -1.2));
  // tall round-topped windows on the arms
  [[0, 3.8, 0], [4.85, -1.2, Math.PI / 2], [-4.85, -1.2, -Math.PI / 2]].forEach(([x, z, ry]) => [-1, 0, 1].forEach(u => {
    const ox = Math.cos(ry) * u * 1.15, oz = -Math.sin(ry) * u * 1.15; g.add(roundWin(.62, 2.0, 'windowDark', x + ox, 1.6, z + oz, ry)); g.add(roundWin(.82, 2.2, 'white', x + ox - Math.sin(ry) * .02, 1.5, z + oz - Math.cos(ry) * .02, ry, .03)); }));
  // the drum and the great dome
  g.add(cyl(2.15, 2.15, 2.6, seg(32, 8), B, 0, 5.4, -1.2)); g.add(cyl(2.3, 2.3, .22, seg(32, 8), 'white', 0, 8.0, -1.2));
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.add(roundWin(.5, 1.5, 'windowDark', Math.sin(a) * 2.13, 5.9, -1.2 + Math.cos(a) * 2.13, a)); }
  g.add(onion(2.0, G, 0, 8.2, -1.2));
  // four small domes at the corners of the cross
  [[-2.6, -3.8], [2.6, -3.8], [-2.6, 1.4], [2.6, 1.4]].forEach(([x, z]) => { g.add(cyl(.55, .55, 1.0, seg(16, 6), B, x, 4.9, z)); g.add(onion(.5, G, x, 5.9, z)); });
  // the bell tower over the door, with a green tent roof
  g.add(box(3.0, 7.6, 3.0, B, 0, .3, 4.2)); g.add(box(3.2, .24, 3.2, 'white', 0, 7.9, 4.2)); g.add(box(3.2, .24, 3.2, 'white', 0, 4.9, 4.2));
  g.add(roundWin(1.3, 2.4, 'door', 0, .3, 5.71)); g.add(roundWin(1.7, 2.7, 'white', 0, .3, 5.69, 0, .03));
  [0, Math.PI / 2, -Math.PI / 2].forEach(a => { g.add(roundWin(.55, 1.6, 'windowDark', Math.sin(a) * 1.51, 5.6, 4.2 + Math.cos(a) * 1.51, a)); });
  const tent = mesh(new THREE.ConeGeometry(2.3, 3.0, 4, 1), G); tent.rotation.y = Math.PI / 4; tent.position.set(0, 8.14 + 1.5, 4.2); g.add(tent);
  g.add(cyl(.42, .42, .8, seg(16, 6), B, 0, 10.4, 4.2)); g.add(onion(.42, G, 0, 11.2, 4.2));
  g.add(box(2.0, 1.4, 1.2, B, 0, .3, 6.2)); g.add(roof({ w: 2.4, d: 1.6, h: .5, ridge: .6, lift: .02, flare: 0, concave: 1, role: G, y: 1.7, z: 6.2, ry: Math.PI / 2 }));
  return g;
}

/* ---------- 11 Fujian: the tulou, round earth houses of the Hakka in the tea hills ---------- */
function tulou() {
  const g = new THREE.Group(), r = rnd(53);
  const round = (R, t, h, x, z, floors) => {
    const q = new THREE.Group();
    q.add(mesh(new THREE.LatheGeometry([[R - t, 0], [R, 0], [R, h], [R - t, h], [R - t, 0]].map(p => new THREE.Vector2(...p)), seg(64, 12)), 'earth', { double: true }));
    q.add(mesh(new THREE.LatheGeometry([[R - t - .02, 0], [R - t - .02, h]].map(p => new THREE.Vector2(...p)), seg(64, 12)), 'wood', { double: true }));
    for (let f = 1; f < floors; f++) { const y = h * f / floors; const ring = torus(R - t - .14, .06, 'wood', y); q.add(ring); }
    const rr = R - t * .45, L2 = pts => mesh(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg(72, 12)), 'tileGrey', { double: true });   // two slopes, so the ridge stays sharp
    q.add(L2([[R + .4, h - .12], [rr, h + .5]])); q.add(L2([[rr, h + .5], [R - t - .3, h]])); q.add(torus(rr, .07, 'ridge', h + .5));
    q.add(ringWins(R + .01, h * .55, h * .82, Math.round(R * 6), 2, 'windowDark', .14, .2));
    q.add(arch(.7, 1.0, 'door', 0, 0, R - .02, 0, .06));
    q.add(box(R * .7, .6, R * .5, 'plaster', 0, 0, -R * .1)); q.add(roof({ w: R * .85, d: R * .65, h: .4, ridge: .5, lift: .15, role: 'roofGrey', y: .6, z: -R * .1 }));
    return at(q, x, 0, z, r() * .5 - .25);
  };
  g.add(round(3.0, 1.2, 3.0, 0, -.8, 4));
  g.add(round(2.0, .9, 2.4, -5.3, 1.6, 3));
  g.add(round(1.9, .9, 2.3, 3.4, 3.8, 3));
  g.add(round(1.8, .85, 2.2, -4.4, -4.8, 3));
  // the square one, behind
  const sq = new THREE.Group(), W = 3.8, T = 1.1, h = 2.6;
  [[0, -(W - T) / 2, W, T], [0, (W - T) / 2, W, T], [-(W - T) / 2, 0, T, W - 2 * T], [(W - T) / 2, 0, T, W - 2 * T]].forEach(([x, z, w, d]) => sq.add(box(w, h, d, 'earth', x, 0, z)));
  sq.add(roof({ w: W + .7, d: W + .7, h: .55, inner: .5, lift: .14, role: 'tileGrey', y: h - .1 }));
  sq.add(windowsOn(-1.4, 1.4, 1.2, 1.8, W / 2 + .01, 6, 2, 'windowDark', 0, .14, .2)); sq.add(arch(.6, .9, 'door', 0, 0, W / 2 - .02, 0, .06));
  g.add(at(sq, 4.9, 0, -3.0, -.3));
  // tea terraces climbing behind
  [[-1.5, -7.2, 6.5, 2.2], [3.2, -7.4, 4.4, 1.8], [-6.4, .2, 1.6, 2.6], [7.2, -.6, 1.6, 2.4]].forEach(([x, z, rx, rz]) => {
    for (let k = 0; k < 4; k++) { const s = 1 - k * .22, c = cyl(1, 1.04, .32, seg(32, 8), k % 2 ? 'tea' : 'tea2', x, k * .32, z); c.scale.set(rx * s, 1, rz * s); g.add(c); } });
  return g;
}

/* ---------- 12 Dali: the Three Pagodas of Chongsheng Temple, white over the lake ---------- */
function dali() {
  const g = new THREE.Group();
  g.add(box(3.6, .4, 3.6, 'stone', 0, 0, 0)); g.add(box(2.9, .5, 2.9, 'stone', 0, .4, 0));
  g.add(box(1.75, 3.2, 1.75, 'white', 0, .9, 0)); g.add(arch(.5, .9, 'door', 0, 1.0, .88, 0, .04));
  let y = 4.1; const T = 15;
  for (let i = 0; i < T; i++) {
    const t = i / (T - 1), w = 1.75 * (1 + .2 * Math.sin(Math.PI * Math.min(1, t * 1.6))) * (1 - .5 * Math.pow(t, 1.7)), h = .6 - t * .16;
    g.add(box(w + .55, .1, w + .55, 'white', 0, y - .02)); g.add(box(w + .32, .08, w + .32, 'plaster', 0, y - .1));
    g.add(box(w, h, w, 'white', 0, y + .08)); if (i % 2 === 0) g.add(box(.18, h * .55, .04, 'door', 0, y + .08 + h * .2, w / 2 + .01));
    y += h + .08;
  }
  g.add(box(.9, .14, .9, 'white', 0, y)); g.add(cyl(.32, .44, .5, 8, 'bronze', 0, y + .14)); g.add(sph(.28, 'gold', 0, y + .82, 0, 14)); g.add(cyl(.03, .05, 1.0, 6, 'gold', 0, y + .9)); g.add(sph(.12, 'gold', 0, y + 1.9, 0, 10));
  // the two smaller octagonal pagodas behind
  [-1, 1].forEach(sx => { const x = sx * 5.0, z = -2.6; g.add(cyl(1.3, 1.4, .5, 8, 'stone', x, 0, z, Math.PI / 8)); g.add(cyl(.8, .82, 1.6, 8, 'white', x, .5, z, Math.PI / 8));
    let yy = 2.1; for (let i = 0; i < 10; i++) { const t = i / 9, rr = .8 * (1 + .12 * Math.sin(Math.PI * t)) * (1 - .45 * Math.pow(t, 1.6)), h = .44 - t * .08;
      g.add(cyl(rr + .3, rr + .3, .08, 8, 'white', x, yy, z, Math.PI / 8)); g.add(cyl(rr, rr, h, 8, 'white', x, yy + .08, z, Math.PI / 8)); yy += h + .08; }
    g.add(cyl(.04, .06, .8, 6, 'gold', x, yy, z)); g.add(sph(.14, 'gold', x, yy + .45, z, 10)); });
  return g;
}

/* ---------- 13 Dunhuang: the Mogao Caves, the Nine-storey Pagoda against the sand cliff ---------- */
function mogao() {
  const g = new THREE.Group(), r = rnd(61);
  const cs = new THREE.Shape(); cs.moveTo(-8.6, 0); let cx = -8.6;
  cs.lineTo(-8.6, 4.4); while (cx < 8.6) { cx = Math.min(8.6, cx + .5 + r() * .9); cs.lineTo(cx, 5.4 + r() * 1.3 - Math.pow(Math.abs(cx) / 8.6, 3) * 1.4); }
  cs.lineTo(8.6, 0); cs.lineTo(-8.6, 0);
  const cg = new THREE.ExtrudeGeometry(cs, { depth: 3.4, bevelEnabled: true, bevelThickness: .25, bevelSize: .25, bevelSegments: 2, curveSegments: 2 }); cg.translate(0, 0, -7.2);
  g.add(mesh(cg, 'sand2'));
  for (let i = 0; i < 9; i++) { const x = -7.6 + i * 1.9 + r() * .6, b = box(1.1 + r() * 1.2, 4 + r() * 1.6, .5, 'sand2', x, 0, -3.65 - r() * .15, (r() - .5) * .2); g.add(b); }   // buttresses that break up the face
  // cave doors in rows along the cliff, with walkways and ladders
  [.6, 2.4, 4.2].forEach((yy, row) => {
    for (let x = -7.6; x < 7.6; x += .7 + r() * .6) { if (Math.abs(x) < 3.3) continue; g.add(box(.3 + r() * .14, .45 + r() * .2, .1, 'door', x, yy + (r() - .5) * .3, -3.32)); }
    g.add(box(15.8, .08, .45, 'wood', 0, yy - .1, -3.1)); g.add(box(15.8, .2, .03, 'wood', 0, yy, -2.9));
    if (row < 2) [-5.6, 5.2].forEach(x => g.add(rod([x, yy - .1, -3.0], [x + .8, yy + 1.7, -3.0], .03, 'wood')));
  });
  // the Nine-storey Pagoda (Jiucenglou), red columns and grey tiles stepping up the cliff
  let y = 0; const F = 9;
  g.add(box(7.4, .3, 3.2, 'stone', 0, 0, -2.2));
  for (let i = 0; i < F; i++) {
    const w = 6.4 - i * .46, h = i === F - 1 ? 1.05 : .86, z = -2.3 - i * .1, d = 2.4 - i * .06;
    g.add(box(w, h, d, 'plaster', 0, y + .3, z));
    const n = Math.max(3, Math.round(w / .7)); for (let c = 0; c <= n; c++) g.add(box(.1, h, .1, 'column', -w / 2 + w * c / n, y + .3, z + d / 2));
    g.add(windowsOn(-w / 2 + .3, w / 2 - .3, y + .45, y + .3 + h - .12, z + d / 2 + .02, n, 1, 'lattice', 0, w / n * .6, h * .55));
    y += h;
    if (i < F - 1) g.add(roof({ w: w + 1.1, d: d + 1.0, h: .5, inner: .82, lift: .28, role: 'roofGrey', y: y + .3 - .06, z }));
    else { g.add(roof({ w: w + 1.4, d: d + 1.2, h: 1.5, ridge: .35, lift: .36, role: 'roofGrey', y: y + .3, z })); g.add(sph(.18, 'gold', 0, y + 1.95, z, 10)); }
  }
  // poplars and a camel
  [[-7.4, 2.4], [-6.6, 3.6], [6.8, 2.2], [7.6, 3.4], [-3.6, 4.4], [4.4, 4.8]].forEach(([x, z]) => { g.add(cyl(.05, .07, .6, 6, 'trunk', x, 0, z)); const t = sph(1, 'tree', x, 1.3, z, 10); t.scale.set(.32, .9, .32); g.add(t); });
  const camel = new THREE.Group(); camel.add(box(.9, .4, .3, 'camel', 0, .55, 0)); camel.add(sph(.18, 'camel', -.15, .98, 0, 8)); camel.add(sph(.18, 'camel', .2, .98, 0, 8)); camel.add(rod([.45, .8, 0], [.7, 1.2, 0], .07, 'camel')); camel.add(box(.22, .14, .14, 'camel', .78, 1.16, 0));
  [[-.35, -.1], [-.35, .1], [.35, -.1], [.35, .1]].forEach(([x, z]) => camel.add(box(.08, .55, .08, 'camel', x, 0, z))); g.add(at(camel, 2.6, 0, 3.4, -.4));
  return g;
}

/* ---------- 14 Kashgar: the Id Kah Mosque, a yellow gate between two minarets ---------- */
function idkah() {
  const g = new THREE.Group(), Y = 'yellowWall';
  g.add(box(14.6, .14, 7.2, 'stone', 0, 0, 1.0));   // the square
  g.add(box(14.6, 2.2, 3.0, Y, 0, .14, -2.2)); g.add(box(14.8, .26, 3.1, 'white', 0, 2.34, -2.2));
  for (let x = -6.6; x <= 6.65; x += 1.1) if (Math.abs(x) > 2.6) { g.add(arch(.62, 1.35, 'door', x, .35, -.69, 0, .04)); g.add(arch(.8, 1.55, 'white', x, .27, -.7, 0, .02)); }
  // the gate (pishtaq): a tall yellow block with a deep pointed arch framed in white
  g.add(box(4.6, 5.6, 1.8, Y, 0, .14, -.6)); g.add(box(4.8, .3, 1.9, 'white', 0, 5.74, -.6));
  g.add(arch(2.5, 4.0, 'white', 0, .14, .31, 0, .03)); g.add(arch(2.1, 3.7, 'archBlue', 0, .14, .33, 0, .03)); g.add(arch(1.0, 1.8, 'door', 0, .14, .37, 0, .03));
  [-1.95, 1.95].forEach(x => { g.add(box(.14, 5.3, .06, 'white', x, .3, .31)); });
  g.add(windowsOn(-1.6, 1.6, 4.4, 5.3, .32, 5, 1, 'white', 0, .34, .5));
  // the two minarets: banded columns with little domed lanterns
  [-2.75, 2.75].forEach(x => { const z = -.2;
    g.add(box(1.0, 1.4, 1.0, Y, x, .14, z)); g.add(cyl(.38, .46, 7.0, seg(20, 8), Y, x, 1.54, z));
    [2.6, 4.4, 6.2, 8.2].forEach(yy => g.add(cyl(.45, .43, .16, seg(20, 8), 'white', x, yy, z)));
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; g.add(cyl(.04, .04, .7, 6, 'white', x + Math.sin(a) * .36, 8.54, z + Math.cos(a) * .36)); }
    g.add(cyl(.5, .5, .14, seg(20, 8), 'white', x, 9.24, z)); g.add(onion(.36, 'domeGreen', x, 9.38, z, 'moon'));
  });
  g.add(cyl(1.4, 1.4, .8, seg(24, 8), Y, 0, 2.3, -3.0)); g.add(onion(1.25, 'domeGreen', 0, 3.1, -3.0, 'moon'));   // the dome behind the gate
  // poplars and white mulberry along the square
  [[-7.2, 1.6], [-7.0, 3.6], [7.2, 1.4], [7.0, 3.4], [-5.6, 4.8], [5.6, 4.8]].forEach(([x, z]) => { g.add(cyl(.05, .07, .7, 6, 'trunk', x, .14, z)); const t = sph(1, 'tree', x, 1.6, z, 10); t.scale.set(.36, 1.1, .36); g.add(t); });
  return g;
}

/* ---------- shared parts for the third set ---------- */
// a height field over the disc of radius R; only the squares where keep() holds at a corner are built, so flat ground left out shows the stage
function field(R, H, role, keep = (x, z, y) => y > .05, N = seg(110, 26)) {
  const pos = [], ok = [], idx = [];
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) { let x = -R + 2 * R * i / N, z = -R + 2 * R * j / N; const d = Math.hypot(x, z); if (d > R) { x *= R / d; z *= R / d; }
    const y = H(x, z); pos.push(x, y, z); ok.push(keep(x, z, y)); }
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; if (ok[a] || ok[b] || ok[c] || ok[d]) idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return mesh(g, role);
}
const bumpsH = (bumps, R) => (x, z) => bumps.reduce((a, [bx, bz, h, rr]) => a + h * Math.exp(-((x - bx) ** 2 + (z - bz) ** 2) / (rr * rr)), 0) * Math.max(0, 1 - Math.pow(Math.hypot(x, z) / R, 8));
function woods(g, r, n, R, H, skip = () => false, y0 = .3) {   // trees on the slopes
  for (let i = 0, k = 0; i < 1500 && k < n; i++) { const a = r() * Math.PI * 2, dd = Math.sqrt(r()) * (R - .7), x = Math.cos(a) * dd, z = Math.sin(a) * dd, y = H(x, z);
    if (y < y0 || skip(x, z)) continue; k++; const s = .45 + r() * .45;
    if (r() < .5) g.add(sph(.48 * s, 'tree', x, y + .5 * s, z, 10)); else g.add(at(mesh(new THREE.ConeGeometry(.4 * s, 1.2 * s, seg(8, 5)), 'tree'), x, y + .55 * s, z)); }
}
function crowd(g, L) {   // tiny people at [x, y, z, turn]
  if (!L.length) return; const body = new THREE.CapsuleGeometry(.055, .16, 2, 6); body.translate(0, .14, 0); const pal = ['#C9302A', '#2F5D8A', '#E8B44C', '#F2EEE6', '#4E9A72', '#E07A3A'];
  g.add(many(body, 'person', L, i => pal[i % pal.length])); const hd = new THREE.SphereGeometry(.05, 6, 5); hd.translate(0, .32, 0); g.add(many(hd, 'skin', L));
}

/* ---------- 15 Sichuan: the Golden Summit of Mount Emei, the gold Puxian on its cliff over a sea of clouds ---------- */
function emei() {
  const g = new THREE.Group(), r = rnd(71), R = 9.2, cx = .3, cz = .2;
  const H = bumpsH([[-4.6, -4.8, 5.4, 2.6], [2.8, -5.8, 4.6, 2.4], [-7.2, .4, 2.6, 2.0], [7.0, -1.8, 3.0, 2.2], [0, -2.6, 4.6, 2.6], [-3.6, 4.6, 1.0, 1.8], [5.2, 3.8, 1.2, 1.8]], R);
  g.add(field(R, H, 'hill'));
  // the summit: three ragged layers of cliff, each a little smaller, so the rock shows ledges; its top at T
  const T = 5.2, ring = (sx, sz, jit) => Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2, k = 1 + (r() - .5) * jit; return [cx + Math.cos(a) * sx * k, cz + Math.sin(a) * sz * k]; });
  const slab = (pts, y0, y1, role = 'cliff') => { const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
    const eg = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: true, bevelThickness: .15, bevelSize: .2, bevelSegments: 1, curveSegments: 2 }); eg.rotateX(-Math.PI / 2); eg.translate(0, y0, 0); g.add(mesh(eg, role)); };
  const L0 = ring(3.9, 3.3, .22), L1 = ring(3.45, 2.95, .18), out = ring(3.1, 2.6, .1);
  slab(L0, -.2, 1.9); slab(L1, 1.9, 3.7); slab(out, 3.7, T - .15);
  [[L0, 1.9 + .15, 3.45 / 3.9], [L1, 3.7 + .15, 3.1 / 3.45]].forEach(([L, y, k]) => L.forEach(([x, z], i) => { if (r() < .55) return; const t = .5 + r() * .5;   // shrubs on the ledges
    const px = cx + (x - cx) * (k + (1 - k) * t), pz = cz + (z - cz) * (k + (1 - k) * t); g.add(sph(.22 + r() * .16, 'tree', px, y + .12, pz, 8)); }));
  [L0, L1, out].forEach((L, li) => L.forEach(([x, z], i) => { if (r() < .5) return; const [nx, nz] = L[(i + 1) % L.length], mx = (x + nx) / 2, mz = (z + nz) / 2, dx = mx - cx, dz = mz - cz, d = Math.hypot(dx, dz);   // cracks and ribs in the faces
    const y0 = [-.2, 1.9, 3.7][li], h = [2.1, 1.8, 1.35][li] * (.5 + r() * .45); g.add(box(.3 + r() * .4, h, .3, 'rock', mx + dx / d * .2, y0 + r() * .3, mz + dz / d * .2, Math.atan2(dx, dz))); }));
  const top = new THREE.ShapeGeometry(new THREE.Shape(out.map(([x, z]) => new THREE.Vector2(cx + (x - cx) * 1.02, -(cz + (z - cz) * 1.02))))); top.rotateX(-Math.PI / 2);
  g.add(at(mesh(top, 'stone'), 0, T + .06, 0));
  const posts = []; out.forEach(([x, z], i) => { const [nx, nz] = out[(i + 1) % out.length]; for (let k = 0; k < 3; k++) { const t = k / 3, px = cx + (x + (nx - x) * t - cx) * .96, pz = cz + (z + (nz - z) * t - cz) * .96; posts.push([px, T + .06, pz]); } });
  g.add(many(new THREE.CylinderGeometry(.025, .025, .26, 5).translate(0, .13, 0), 'white', posts));
  posts.forEach((p, i) => { const q = posts[(i + 1) % posts.length]; g.add(rod([p[0], T + .3, p[2]], [q[0], T + .3, q[2]], .02, 'white')); });
  // the Ten-directional Puxian: four elephants under a lotus, and a figure with heads on every side, all gilded
  const sx = cx + .15, sz = cz - .45, Y = T + .06, P = new THREE.Group();
  P.add(box(3.0, .45, 3.0, 'stone')); P.add(box(2.4, .55, 2.4, 'white', 0, .45)); [0, 1, 2].forEach(i => P.add(box(1.1, .15, .45, 'stone', 0, i * .15, 1.7 - i * .22)));
  for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2, e = new THREE.Group();
    const bd = sph(.4, 'gilt', 0, .62, 0, 16); bd.scale.set(.85, .8, 1.15); e.add(bd);
    [[-.2, -.26], [.2, -.26], [-.2, .26], [.2, .26]].forEach(([x, z]) => e.add(cyl(.1, .11, .45, 8, 'gilt', x, 0, z)));
    e.add(sph(.26, 'gilt', 0, .84, .46, 14)); e.add(rod([0, .76, .68], [0, .1, .8], .055, 'gilt', .08));
    [-.22, .22].forEach(x => { const ear = sph(.2, 'gilt', x, .86, .38, 10); ear.scale.set(.35, 1, .9); e.add(ear); e.add(rod([x * .45, .68, .62], [x * .8, .55, .9], .02, 'white', .035)); });
    e.position.set(Math.sin(a) * .7, 1.0, Math.cos(a) * .7); e.rotation.y = a; e.scale.setScalar(1.25); P.add(e); }
  P.add(cyl(1.0, .8, .32, seg(24, 8), 'gilt', 0, 2.25));
  const PL = []; for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; PL.push([Math.sin(a) * 1.0, 2.5, Math.cos(a) * 1.0, a]); }   // the petals of the lotus
  P.add(many(new THREE.SphereGeometry(.22, 8, 6).scale(1, 1.5, .6).translate(0, .12, 0), 'gilt', PL));
  P.add(cyl(.5, .8, 2.1, seg(20, 8), 'gilt', 0, 2.6));
  const sho = sph(.6, 'gilt', 0, 4.75, 0, 18); sho.scale.set(1, .45, 1); P.add(sho);
  for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2, f = [Math.sin(a), Math.cos(a)], sd = [Math.cos(a), -Math.sin(a)];   // two arms on every side, the hands together at the chest
    [-1, 1].forEach(u => { const sh = [f[0] * .25 + sd[0] * u * .5, 4.7, f[1] * .25 + sd[1] * u * .5], el = [f[0] * .55 + sd[0] * u * .42, 3.95, f[1] * .55 + sd[1] * u * .42], hd = [f[0] * .66 + sd[0] * u * .06, 4.3, f[1] * .66 + sd[1] * u * .06];
      P.add(rod(sh, el, .1, 'gilt', .09)); P.add(rod(el, hd, .08, 'gilt', .07)); });
    P.add(sph(.09, 'gilt', f[0] * .68, 4.35, f[1] * .68, 8)); }
  const head = (x, y, z, rr) => { P.add(sph(rr, 'gilt', x, y, z, 14)); P.add(cyl(rr * .55, rr * .8, rr * .9, 8, 'gilt', x, y + rr * .6, z)); };
  P.add(cyl(.3, .36, .3, 12, 'gilt', 0, 4.9));
  for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2; head(Math.sin(a) * .2, 5.4, Math.cos(a) * .2, .25); }
  for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2 + Math.PI / 4; head(Math.sin(a) * .13, 5.95, Math.cos(a) * .13, .19); }
  head(0, 6.4, 0, .16); P.add(sph(.09, 'gilt', 0, 6.78, 0, 8));
  g.add(at(P, sx, Y, sz));
  // the little Golden Hall in front, bronze gilt under a double roof
  const hx = cx - 2.0, hz = cz + 1.25, hall = new THREE.Group();
  hall.add(box(1.7, .18, 1.3, 'stone')); hall.add(box(1.25, .62, .85, 'gilt', 0, .18)); hall.add(box(.4, .44, .04, 'door', 0, .18, .44));
  hall.add(roof({ w: 1.75, d: 1.35, h: .3, inner: .62, lift: .16, role: 'gilt', y: .8 })); hall.add(box(.9, .3, .6, 'gilt', 0, 1.0)); hall.add(roof({ w: 1.4, d: 1.0, h: .45, ridge: .45, lift: .18, role: 'gilt', y: 1.3 }));
  g.add(at(hall, hx, Y, hz, -.35));
  crowd(g, Array.from({ length: 24 }, () => { const a = r() * Math.PI * 2, d = 1.85 + r() * .8; return [cx + Math.cos(a) * d * 1.05, Y, cz + Math.sin(a) * d * .85, r() * 6]; }).filter(([x, , z]) => Math.hypot(x - hx, z - hz) > .95));
  // forest on the slopes, kept off the rock
  const inRock = (x, z) => ((x - cx) / 4.3) ** 2 + ((z - cz) / 3.7) ** 2 < 1;
  woods(g, r, seg(90, 30), R, H, inRock);
  // the sea of clouds: billows of small puffs below the summit, filling the valleys
  for (let i = 0, n = 0; i < 1200 && n < seg(34, 14); i++) { const a = r() * Math.PI * 2, d = 4.2 + r() * (R - 4.8), x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d * .92;
    if (Math.hypot(x, z) > R - .7 || inRock(x, z)) continue; const y = 1.1 + r() * 1.2; if (H(x, z) > y + .3) continue; n++;
    const c = new THREE.Group(), k = 4 + Math.floor(r() * 4);
    for (let j = 0; j < k; j++) { const pr = .28 + r() * .32, p = sph(pr, 'cloud', (r() - .5) * 1.3, (r() - .3) * .25, (r() - .5) * .9, 12); p.scale.y = .72; c.add(p); }
    c.rotation.y = r() * 3; g.add(at(c, x, y, z, r() * 3)); }
  return g;
}

/* ---------- 16 Taipei: Taipei 101, a stalk of green glass bamboo in eight flared sections ---------- */
function taipei() {
  const g = new THREE.Group(), r = rnd(79), G = 'glassTeal', R = 9.0;
  const H = bumpsH([[-5.4, -5.8, 3.2, 2.6], [-1.0, -7.6, 2.4, 2.2], [3.8, -6.8, 2.0, 2.0]], R);
  g.add(field(R, H, 'hill'));
  g.add(box(6.6, .12, 6.0, 'stone', 0, 0, .3));
  g.add(box(6.0, 1.1, 3.4, 'concrete', 0, .12, -.9)); g.add(box(5.8, .4, .04, G, 0, .45, .82)); g.add(box(6.1, .1, 3.5, 'steel2', 0, 1.2, -.9));
  let y = .12;
  // the trunk, leaning in as it rises, with a gold ruyi coin on every face
  const tH = 3.4, wB = 2.7, wT = 2.25;
  g.add(batter(wB, wB, wT, wT, tH, G, 0, y, 0));
  for (let k = 1; k < 9; k++) { const t = k / 9, w = wB + (wT - wB) * t; g.add(box(w + .03, .03, w + .03, 'steel2', 0, y + t * tH, 0)); }
  for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2, t = .72, w = wB + (wT - wB) * t, o = w / 2 + .05, coin = new THREE.Group();
    const disc = mesh(new THREE.CylinderGeometry(.36, .36, .06, seg(24, 8)), 'gold'); disc.rotation.x = Math.PI / 2; coin.add(disc); coin.add(box(.16, .16, .08, G, 0, -.08, 0));
    coin.position.set(Math.sin(a) * o, y + t * tH, Math.cos(a) * o); coin.rotation.y = a; g.add(coin); }
  y += tH;
  // the eight sections of eight floors, each flaring out like a stack of bowls
  for (let i = 0; i < 8; i++) { const h = 1.08, w0 = 1.78, w1 = 2.32;
    g.add(batter(w0, w0, w1, w1, h, G, 0, y, 0));
    for (let k = 1; k < 4; k++) { const t = k / 4, w = w0 + (w1 - w0) * t; g.add(box(w + .03, .025, w + .03, 'steel2', 0, y + t * h, 0)); }
    g.add(box(w1 + .08, .07, w1 + .08, 'steel', 0, y + h, 0));
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([qx, qz]) => g.add(rod([qx * w0 / 2, y + .1, qz * w0 / 2], [qx * w1 / 2, y + h, qz * w1 / 2], .035, 'steel')));
    y += h + .07; }
  g.add(batter(1.55, 1.55, 1.25, 1.25, .8, G, 0, y, 0)); y += .8;
  g.add(box(1.0, .45, 1.0, 'steel2', 0, y)); y += .45; g.add(box(.7, .35, .7, 'steel', 0, y)); y += .35;
  g.add(cyl(.18, .26, .5, seg(12, 6), 'steel2', 0, y)); g.add(cyl(.03, .14, 3.0, seg(12, 5), 'steel', 0, y + .5)); g.add(sph(.07, 'light', 0, y + 3.55, 0, 8));
  // a few lower buildings round the plaza
  [[-4.6, -1.8, 1.5, 2.6], [-3.9, 2.6, 1.4, 1.6], [4.4, -2.4, 1.7, 3.0], [4.8, 1.4, 1.3, 1.9], [-6.0, .6, 1.2, 1.3], [2.6, -4.6, 1.6, 2.2], [-2.6, -4.6, 1.5, 1.8]].forEach(([x, z, w, h], i) => {
    const b = new THREE.Group(); b.add(box(w, h, w, i % 2 ? 'plaster' : 'concrete'));
    [0, Math.PI / 2].forEach(ry => b.add(windowsOn(-w / 2 + .12, w / 2 - .12, .25, h - .15, w / 2 + .01, Math.round(w / .3), Math.round(h / .38), 'window', ry, .14, .2)));
    g.add(at(b, x, 0, z)); });
  woods(g, r, seg(36, 16), R, H, () => false, .4);
  return g;
}

/* ---------- 17 Hainan: Yalong Bay at Sanya, a tropical beach of white sand, palms and turquoise water ---------- */
function palm(x, y0, z, h, lean, ry, r) {
  const grp = new THREE.Group(), pts = [0, .33, .66, 1].map(t => new THREE.Vector3(lean * t * t, h * t, 0)), cv = new THREE.CatmullRomCurve3(pts);
  grp.add(mesh(new THREE.TubeGeometry(cv, seg(12, 4), .075, seg(8, 5), false), 'palmTrunk'));
  for (let k = 1; k < 6; k++) { const p = cv.getPoint(k / 6), ring = mesh(new THREE.TorusGeometry(.08, .018, 4, 10), 'palmTrunk'); ring.position.set(p.x, p.y, 0); ring.rotation.x = Math.PI / 2; grp.add(ring); }
  const tp = pts[3], L = 1.3;
  for (let k = 0; k < 9; k++) {
    const fg = new THREE.PlaneGeometry(L, .34, seg(8, 3), 2); fg.translate(L / 2, 0, 0); fg.rotateX(-Math.PI / 2);
    const p = fg.attributes.position; for (let i = 0; i < p.count; i++) { const u = p.getX(i) / L, zz = p.getZ(i) * (1 - .85 * u) * (u < .1 ? u * 10 : 1); p.setXYZ(i, p.getX(i), .3 * u - .75 * u * u - Math.abs(zz) * .5, zz); }
    fg.computeVertexNormals(); const f = mesh(fg, 'palm', { double: true }); f.position.set(tp.x, tp.y, 0); f.rotation.y = k / 9 * Math.PI * 2 + r() * .4; f.rotation.z = (r() - .3) * .3; grp.add(f);
  }
  [0, 2.1, 4.2].forEach(a => grp.add(sph(.07, 'trunk', tp.x + Math.cos(a) * .1, tp.y - .1, Math.sin(a) * .1, 8)));
  return at(grp, x, y0, z, ry);
}
function beach() {   // a cartoon desert island on purpose: a small round beach of white sand, pale shallows round it and two big palms
  const g = new THREE.Group(), r = rnd(83), R = 6.8;
  const edge = (x, z) => { const a = Math.atan2(z, x); return 2.9 + .45 * Math.sin(2 * a + 1) + .25 * Math.sin(3 * a + .4); };   // the island's outline, radius by direction
  const k = (x, z) => Math.hypot(x, z) / edge(x, z);   // 0 in the middle, 1 at the water line
  const sandH = (x, z) => { const q = k(x, z); return q < 1 ? .06 + .5 * (1 - q * q) : .06 - (q - 1) * 1.6; };
  g.add(field(R, sandH, 'beachSand', (x, z) => k(x, z) < 1.06));
  const ring = (s, y) => { const N = seg(96, 24), pts = []; for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, e = edge(Math.cos(a), Math.sin(a)) * s; pts.push([Math.cos(a) * e, Math.sin(a) * e]); } return pts; };
  { const N = seg(160, 40), Mr = 6, pos = [], idx = [];   // the shallows: a band round the island in short pieces (one big flat shape streaks in the light)
    for (let i = 0; i < N; i++) { const t = i / N * Math.PI * 2, e = edge(Math.cos(t), Math.sin(t)); for (let j = 0; j <= Mr; j++) { const q = (.9 + .65 * j / Mr) * e; pos.push(Math.cos(t) * q, .012, Math.sin(t) * q); } }
    for (let i = 0; i < N; i++) for (let j = 0; j < Mr; j++) { const p = i * (Mr + 1) + j, q = ((i + 1) % N) * (Mr + 1) + j; idx.push(p, q, p + 1, p + 1, q, q + 1); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setIndex(idx); sg.computeVertexNormals(); g.add(mesh(sg, 'shallow', { double: true })); }
  { const pts = ring(1.01).map(([x, z]) => new THREE.Vector3(x, .05, z));   // a line of foam where the sand meets the water
    g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), pts.length * 2, .07, 6, true), 'foam')); }
  // two big palms, leaning out over the water
  [[-.9, .5, 2.3, .8, Math.PI * .85], [.8, -.5, 2.0, .7, -Math.PI * .15]].forEach(([x, z, h, lean, ry]) => {
    const p = palm(x, sandH(x, z) - .05, z, h, lean, ry, r); p.scale.setScalar(1.8); g.add(p); });
  return g;
}

export const MONUMENTS = [
  { id: 'pearl', name: 'Oriental Pearl Tower', zh: '东方明珠', city: 'Shanghai', czh: '上海', build: pearl, stage: { R: 7.5, water: 4.6, seed: 2 }, boats: [[-3, 6, .2], [3.2, 5.6, -.1]] },
  { id: 'leifeng', name: 'Leifeng Pagoda', zh: '雷峰塔', city: 'Hangzhou', czh: '杭州', build: leifeng, stage: { R: 7.5, water: 4.8, waterRole: 'lake', keep: 4.5, seed: 5 }, boats: [[2.2, 6.1, .6, .7]] },
  { id: 'crane', name: 'Yellow Crane Tower', zh: '黄鹤楼', city: 'Wuhan', czh: '武汉', build: crane, stage: { R: 8.2, keep: 5.4, seed: 7 } },
  { id: 'canton', name: 'Canton Tower', zh: '广州塔', city: 'Guangzhou', czh: '广州', build: canton, stage: { R: 7.2, water: 4.4, keep: 3.6, seed: 9 }, boats: [[-2.6, 5.6, -.15], [2.8, 6.0, .1]] },
  { id: 'hongya', name: 'Hongya Cave', zh: '洪崖洞', city: 'Chongqing', czh: '重庆', build: hongya, stage: { R: 8.4, water: 2.2, keep: 7.4, people: 30, trees: 8, seed: 13 }, boats: [[-3.4, 4.6, .1], [3.6, 5.6, -.2]] },
  { id: 'potala', name: 'Potala Palace', zh: '布达拉宫', city: 'Lhasa', czh: '拉萨', build: potala, stage: { R: 9.6, keep: 8.0, trees: 10, seed: 17 } },
  { id: 'goose', name: 'Big Wild Goose Pagoda', zh: '大雁塔', city: "Xi'an", czh: '西安', build: goose, stage: { R: 7.4, keep: 4.6, seed: 19 } },
  { id: 'heaven', name: 'Temple of Heaven', zh: '天坛', city: 'Beijing', czh: '北京', build: heaven, stage: { R: 8.2, keep: 6.8, trees: 30, seed: 23 } },
  { id: 'wall', name: 'Great Wall', zh: '长城', city: 'Badaling', czh: '八达岭', build: greatwall, icon: wallIcon, stage: { R: 9.6, keep: 9.5, trees: 0, people: 0, seed: 29 } },
  { id: 'sophia', name: 'St. Sophia Cathedral', zh: '圣索菲亚教堂', city: 'Harbin', czh: '哈尔滨', build: sophia, stage: { R: 9.0, keep: 7.4, trees: 18, people: 50, seed: 31 } },
  { id: 'tulou', name: 'Fujian Tulou', zh: '福建土楼', city: 'Yongding', czh: '永定', build: tulou, stage: { R: 9.4, keep: 8.6, trees: 14, people: 20, seed: 37 } },
  { id: 'dali', name: 'Three Pagodas', zh: '崇圣寺三塔', city: 'Dali', czh: '大理', build: dali, stage: { R: 8.6, water: 4.6, waterRole: 'lake', keep: 4.6, trees: 22, seed: 43 } },
  { id: 'mogao', name: 'Mogao Caves', zh: '莫高窟', city: 'Dunhuang', czh: '敦煌', build: mogao, stage: { R: 9.6, keep: 9.4, trees: 0, people: 24, ground: 'sand', seed: 47 } },
  { id: 'idkah', name: 'Id Kah Mosque', zh: '艾提尕尔清真寺', city: 'Kashgar', czh: '喀什', build: idkah, stage: { R: 9.4, keep: 8.4, trees: 10, people: 60, ground: 'sand', seed: 53 } },
  { id: 'emei', name: 'Golden Summit of Mount Emei', zh: '峨眉山金顶', city: 'Emei Shan', czh: '峨眉山', build: emei, stage: { R: 9.4, keep: 9.5, trees: 0, people: 0, seed: 59 } },
  { id: 'taipei', name: 'Taipei 101', zh: '台北101', city: 'Taipei', czh: '台北', build: taipei, stage: { R: 9.2, keep: 3.6, trees: 22, people: 50, seed: 61 } },
  { id: 'beach', name: 'Yalong Bay', zh: '亚龙湾', city: 'Sanya', czh: '三亚', build: beach, stage: { R: 7.2, ground: 'sea', keep: 7.1, trees: 0, people: 0, seed: 67 }, noAo: true },   // noAo: the shading pass leaves a dark block in the middle of this open, flat scene
];

// the whole diorama for one monument; detail 0 builds the low-poly version
export function diorama(M, detail = 1, icon = false) {   // icon: the monument's own cut-out model, where it has one (M.icon)
  DET = detail;
  const g = new THREE.Group(), mon = (icon && M.icon || M.build)();
  mon.userData.monument = true; g.add(mon); g.add(stage(M.stage.R, M.stage));
  (M.boats || []).forEach(([x, z, ry, s]) => g.add(boat(x, z, ry, s || 1)));
  if (M.extra) g.add(M.extra());
  DET = 1; return g;
}
