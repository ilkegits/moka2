// Drive headless Edge over the DevTools protocol: one screenshot per frame.
import { spawn } from 'child_process'; import fs from 'fs'; import path from 'path';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const dir = path.resolve('.'); const url = 'file:///' + dir.split(path.sep).join('/') + '/ticket.html';
const prof = path.join(dir, 'prof');
const p = spawn(EDGE, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9337', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank']);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let list; for (let i = 0; i < 50; i++) { try { list = await (await fetch('http://127.0.0.1:9337/json/list')).json(); if (list.find(t => t.type === 'page')) break; } catch {} await sleep(200); }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async e => (await cmd('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await cmd('Emulation.setDeviceMetricsOverride', { width: 520, height: 220, deviceScaleFactor: 2, mobile: false });
await cmd('Page.navigate', { url }); await sleep(1500);
await ev(`document.fonts.ready.then(()=>document.fonts.load('17px "LXGW WenKai"','候补')).then(()=>1)`); await sleep(500);
const mode = process.argv[2] || 'gif';
const shot = async (file, clip) => { const r = await cmd('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 } }); fs.writeFileSync(file, Buffer.from(r.result.data, 'base64')); };
if (mode === 'gif') {
  fs.rmSync('frames', { recursive: true, force: true }); fs.mkdirSync('frames');
  const total = await ev('TOTAL'); const fps = 25; const n = Math.ceil(total * fps);
  for (let f = 0; f <= n; f++) { await ev(`render(${f / fps})`); await shot(`frames/f${String(f).padStart(4, '0')}.png`, { x: 0, y: 0, width: 520, height: 220 }); }
  console.log('frames', n + 1, 'seconds', total.toFixed(2));
} else {
  for (const c of [...'卡写读查']) { await ev(`tile('${c}')`); await sleep(50); await shot(`tile-${c.codePointAt(0).toString(16)}.png`, { x: 0, y: 0, width: 48, height: 48 }); }
  console.log('tiles done');
}
ws.close(); p.kill();
