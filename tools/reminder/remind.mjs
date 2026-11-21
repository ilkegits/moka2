// ShiCards daily reminder sender. Runs in the private repo ilkegits/shicards-log on a schedule (remind.yml).
// Each phone that switched the reminder on keeps a note at remind/<device>.json:
//   { on, hour, tz, sub, done, streak, waiting, waitingDay }
// done = the last day it practised (its own date), sub = its Web Push sign-up.
// A phone gets one notification a day, in the hours after its chosen time, only if it has not practised that day.
// remind-sent.json remembers which day each phone was last reminded. DRY=1 prints what it would send.
import fs from 'node:fs';

const DRY = !!process.env.DRY;
const webpush = DRY ? null : (await import('web-push')).default;
if (!DRY) webpush.setVapidDetails('https://ilkegits.github.io/moka/', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);

const DIR = process.env.REMIND_DIR || 'remind', SENT = process.env.REMIND_SENT || 'remind-sent.json';
const now = process.env.NOW ? new Date(process.env.NOW) : new Date();
if (!fs.existsSync(DIR)) { console.log('no reminder notes yet'); process.exit(0); }
const sent = fs.existsSync(SENT) ? JSON.parse(fs.readFileSync(SENT, 'utf8')) : {};
let changed = false;

function local(t, tz) {   // the date and hour on the phone's clock
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
    .formatToParts(t).map(x => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: +p.hour };
}
export function message(r, today, yesterday) {
  const n = r.waitingDay === today ? r.waiting : 0;
  const cards = n ? `${n === 1 ? '1 card' : n + ' cards'}, about ${Math.max(1, Math.round(n * 10 / 60))} min.` : 'Your cards are ready.';
  const streak = r.done === yesterday && r.streak > 0 ? ` Keep your ${r.streak} day streak going.` : r.done ? ' One round makes him happy again.' : '';
  return { title: r.done === yesterday ? 'Shi Shi is waiting for you 🦁' : 'Shi Shi misses you 🦁', body: cards + streak };
}

for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const id = f.slice(0, -5);
  let r; try { r = JSON.parse(fs.readFileSync(`${DIR}/${f}`, 'utf8')); } catch { console.log(id, 'unreadable note'); continue; }
  if (!r.on || !r.sub?.endpoint) { console.log(id, 'reminder off'); continue; }
  const tz = r.tz || 'UTC', { day: today, hour } = local(now, tz), { day: yesterday } = local(new Date(now - 864e5), tz);
  if (hour < r.hour || hour > r.hour + 2) { console.log(id, `not time yet (${hour}:00 there, reminder at ${r.hour}:00)`); continue; }
  if (r.done === today) { console.log(id, 'already practised today'); continue; }
  if (sent[id] === today) { console.log(id, 'already reminded today'); continue; }
  const msg = message(r, today, yesterday);
  if (DRY) { console.log(id, 'WOULD SEND', JSON.stringify(msg)); continue; }
  try {
    await webpush.sendNotification(r.sub, JSON.stringify(msg), { TTL: 3 * 3600, urgency: 'normal' });
    sent[id] = today; changed = true; console.log(id, 'sent');
  } catch (e) {
    console.log(id, 'failed', e.statusCode || e.message);
    if (e.statusCode === 404 || e.statusCode === 410) { sent[id] = 'gone'; changed = true; }   // the phone dropped the sign-up
  }
}
if (changed) fs.writeFileSync(SENT, JSON.stringify(sent, null, 1) + '\n');
