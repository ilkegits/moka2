"""Rebuild moka2 from the live real app (origin/main of C:\\Users\\ilkem\\HANZI).

Overwrites every app file here with the real app's, then makes the changes that keep
the two apps apart on the same site (see AGENTS.md). Experiments made only on moka2
are lost, so run it only when ilkem wants moka2 to start again from the real app.

    python tools/refresh-from-real.py            # then test, commit and push as in AGENTS.md
"""
import io, os, re, shutil, subprocess, sys, tarfile

REAL = r'C:\Users\ilkem\HANZI'
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEEP = {'.git', 'AGENTS.md', 'CLAUDE.md', '.gitignore', os.path.join('tools', 'refresh-from-real.py')}


def git(*a):
    return subprocess.run(['git', '-C', REAL, *a], check=True, capture_output=True).stdout


def sub(s, old, new, count=1):
    n = s.count(old)
    if n != count:
        sys.exit(f'Stopped: expected {count}x {old!r} in the real app, found {n}. The real app changed; update this script.')
    return s.replace(old, new)


git('fetch', '-q', 'origin')
rev = git('rev-parse', 'origin/main').decode().strip()
tar = tarfile.open(fileobj=io.BytesIO(git('-c', 'core.autocrlf=false', 'archive', 'origin/main')))   # the HANZI checkout turns on Windows line endings; keep files as stored
names = {m.name for m in tar.getmembers() if m.isfile()}

# 1. remove app files that the real app no longer has, then write the real app's files (line endings as stored)
for root, dirs, files in os.walk(HERE):
    dirs[:] = [d for d in dirs if d != '.git']
    for f in files:
        rel = os.path.relpath(os.path.join(root, f), HERE).replace(os.sep, '/')
        if rel.replace('/', os.sep) in KEEP or rel.endswith('-qr.png'):
            continue
        if rel not in names:
            os.remove(os.path.join(root, f))
for m in tar.getmembers():
    if not m.isfile() or m.name in ('AGENTS.md', 'CLAUDE.md', '.gitignore', 'tools/refresh-from-real.py'):
        continue
    dst = os.path.join(HERE, m.name)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with open(dst, 'wb') as fh:
        fh.write(tar.extractfile(m).read())

# 2. keep the two apps apart
p = os.path.join(HERE, 'index.html')
s = open(p, encoding='utf-8', newline='').read()
s = sub(s, "const KEY = 'moka.v1';",
        "const KEY = 'moka2.v1';   // moka2 test copy: its own saved data, never the real app's 'moka.v1'\n"
        "try {   // first open: start from a copy of the real app's progress (read only), without its reminder sign-up\n"
        "  if (!localStorage.getItem(KEY)) { const real = JSON.parse(localStorage.getItem('moka.v1')); if (real && Array.isArray(real.decks)) { if (real.prefs) delete real.prefs.remind; localStorage.setItem(KEY, JSON.stringify(real)); } }\n"
        "} catch (e) {}")
s = sub(s, "'shicards.log'", "'shicards2.log'")
s = sub(s, "'shicards.sync'", "'shicards2.sync'")
s = sub(s, "'shicards.remindNote'", "'shicards2.remindNote'", 2)
# accounts (real v4.50+): the same Supabase accounts, but moka2's own table, sign-in storage and sync state
s = sub(s, "const KEYC = 'shicards.cloud';", "const KEYC = 'shicards2.cloud';   // moka2: its own sync state")
s = sub(s, "'shicards.cloudNote'", "'shicards2.cloudNote'", 3)
s = sub(s, "persistSession: true, autoRefreshToken: true }", "persistSession: true, autoRefreshToken: true, storageKey: 'moka2-auth' }")
s = sub(s, "sb.from('saves')", "sb.from('saves2')", 4)
s = sub(s, "https://ilkegits.github.io/moka/#pair=", "https://ilkegits.github.io/moka2/#pair=")
s = sub(s, "for (const k of await caches.keys()) { const c", "for (const k of await caches.keys()) { if (!k.startsWith('moka2-')) continue; const c")
s = sub(s, "<title>ShiHanzi2<", "<title>ShiHanzi<")
# a blue label at the top of every screen, so moka2 never passes for the real app
s = sub(s, '#frame{position:relative;z-index:1}\n', '#frame{position:relative;z-index:1}\n'
        '.m2-tag{position:fixed;top:calc(env(safe-area-inset-top) + 3px);left:50%;transform:translateX(-50%);z-index:9999;padding:2px 8px;border-radius:6px;'
        'background:#1F4FA8;color:#fff;font:700 10px/1.35 system-ui,sans-serif;letter-spacing:.04em;white-space:nowrap;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,.2)}\n')
s = sub(s, '<body>\n', '<body>\n<div class="m2-tag" aria-hidden="true">moka2 · test copy</div>\n')
s = sub(s, 'apple-mobile-web-app-title" content="ShiHanzi2"', 'apple-mobile-web-app-title" content="ShiHanzi"')
if s.count('localStorage') != 16 or re.search(r"indexedDB", s) or re.findall(r"sessionStorage\.\w+\('([^']+)'", s) != ['shicards2.cloudNote'] * 3:   # the real app's 13 uses (v4.65) plus the 3 in the first-open copy above; sessionStorage only for the sign-in note
    sys.exit('Stopped: the real app saves data in a new place. Give moka2 its own name for it, then update this script.')
open(p, 'w', encoding='utf-8', newline='').write(s)

p = os.path.join(HERE, 'sw.js')
s = open(p, encoding='utf-8', newline='').read()
nn = re.search(r"const CACHE = 'moka-v(\d+)';", s)
if not nn:
    sys.exit('Stopped: sw.js has no moka-vNN cache name.')
s = s.replace(nn.group(0), f"const CACHE = 'moka2-v{nn.group(1)}';   // moka2 test copy: its own caches")
s = sub(s, "ks.filter(k => k !== CACHE)", "ks.filter(k => k.startsWith('moka2-') && k !== CACHE)")
s = sub(s, "x.url.includes('/moka/')", "x.url.includes('/moka2/')")
open(p, 'w', encoding='utf-8', newline='').write(s)

p = os.path.join(HERE, 'manifest.webmanifest')
s = open(p, encoding='utf-8', newline='').read()
s = sub(s, '"id": "/moka/"', '"id": "/moka2/"')
s = sub(s, '"name": "ShiHanzi2"', '"name": "ShiHanzi"')
s = sub(s, '"short_name": "ShiHanzi2"', '"short_name": "ShiHanzi"')
open(p, 'w', encoding='utf-8', newline='').write(s)

p = os.path.join(HERE, 'version.json')
ver = re.search(r'"version":\s*"([^"]+)"', open(p, encoding='utf-8').read()).group(1)
open(p, 'w', encoding='utf-8', newline='\n').write(f'{{"version": "{ver}", "notes": "moka2: a test copy of ShiHanzi {ver} with its own saved progress"}}\n')

# 3. a blue "2" badge on the home-screen icons
magick = shutil.which('magick') or r'C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe'
for f in ['icon-192.png', 'icon-512.png', 'icon-maskable.png', 'apple-touch-icon.png', 'favicon-64.png']:
    fp = os.path.join(HERE, 'icons', f)
    w = int(subprocess.run([magick, 'identify', '-format', '%w', fp], check=True, capture_output=True, text=True).stdout)
    cx, r, bw, fs = round(w * .71), round(w * .15), max(2, round(w * .022)), round(w * .22)
    subprocess.run([magick, fp, '-fill', '#1F4FA8', '-stroke', 'white', '-strokewidth', str(bw),
                    '-draw', f'circle {cx},{cx} {cx + r},{cx}', '-stroke', 'none', '-fill', 'white', '-font', 'Arial-Bold',
                    '-pointsize', str(fs), '-gravity', 'NorthWest', '-annotate', f'+{round(cx - fs * .28)}+{round(cx - fs * .52)}', '2', fp], check=True)

print(f'moka2 rebuilt from the real app {ver} ({rev[:7]})')
