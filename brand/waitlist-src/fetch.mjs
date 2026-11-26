import fs from 'fs';
const chars = [...'静候佳音卡写读查'];
const out = {};
for (const c of chars) {
  const r = await fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/' + encodeURIComponent(c) + '.json');
  const j = await r.json(); out[c] = j; console.log(c, j.strokes.length);
}
fs.writeFileSync('data/strokes.js', 'window.STROKES=' + JSON.stringify(out) + ';');
