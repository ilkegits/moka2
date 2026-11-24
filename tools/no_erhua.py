"""Standard Mandarin, no Beijing "r" (儿化 erhua): 哪儿 becomes 哪里, 一点儿 becomes 一点, 好玩儿 becomes 好玩.

    python tools/no_erhua.py

Rewrites dict/hsk.tsv, dict/gloss.tsv, dict/sentences.tsv and the lesson plans in tools/course/ in place, and prints what
changed. Safe to run again. Run it after tools/build_hsk.py or tools/build_sentences.py, then rebuild course.js with
tools/build_course.py. Real 儿 words stay (儿子, 女儿, 儿童, 婴儿, 幼儿园): only a word whose reading ends in a bare "r" changes.
A word listed twice that way (这儿 and 这里) keeps the plain one, at the lower of the two levels.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
SPECIAL = {'这儿': ('这里', 'zhè lǐ'), '那儿': ('那里', 'nà li'), '哪儿': ('哪里', 'nǎ lǐ')}
# erhua inside example sentences: the place words, then a few more seen in them (热点儿, 事儿, 一会儿, 鸟儿)
TEXT = [('这儿', '这里'), ('那儿', '那里'), ('哪儿', '哪里')]
TEXT_SUFFIX = re.compile(r'(?<=[点会事鸟对管铃玩块孩伙活法偷准伴闷盹谱缘哨棍眼远条])儿')


def plain(h, p):
    if h in SPECIAL: return SPECIAL[h]
    return h[:-1], re.sub(r'\s*r$', '', p)


def text(s):
    for a, b in TEXT: s = s.replace(a, b)
    return TEXT_SUFFIX.sub('', s)


def read(path): return open(path, encoding='utf-8').read().split('\n')
def write(path, lines): open(path, 'w', encoding='utf-8', newline='\n').write('\n'.join(lines))


# --- dict/hsk.tsv ---
lines = read(P('dict', 'hsk.tsv'))
rows = [l.split('\t') if l and l[0] != '#' else None for l in lines]
is_r = lambda r: r and len(r[1]) > 1 and r[1].endswith('儿') and r[2].endswith(' r')
lowest = {}
for r in rows:
    if r and not is_r(r): lowest.setdefault(r[1], int(r[0]))
rename, drop = {}, {}   # level -> {old: new}, level -> {words gone from that level}
meaning = {r[1]: r[3] for r in rows if r and not is_r(r) and len(r) > 3}
out = []
for l, r in zip(lines, rows):
    if not is_r(r): out.append(l); continue
    lv, (h, p) = int(r[0]), plain(r[1], r[2])
    if h in lowest and lowest[h] <= lv:
        drop.setdefault(lv, set()).add(r[1]); print(f'HSK {lv}: {r[1]} dropped, {h} is already in HSK {lowest[h]}'); continue
    if h in lowest:   # the plain word sits at a higher level: it moves down to this one
        drop.setdefault(lowest[h], set()).add(h); print(f'HSK {lowest[h]}: {h} moves to HSK {lv}')
    e = r[3] if len(r) > 3 else ''
    m = re.match(r'^erhua variant of ([^;\s]+)(?:; (.+))?$', e)
    if m: e = m.group(2) or meaning.get(m.group(1), e)
    rename.setdefault(lv, {})[r[1]] = h; print(f'HSK {lv}: {r[1]} -> {h} ({p})')
    out.append('\t'.join([r[0], h, p, e] + r[4:])); lowest[h] = lv
gone = {(lv, w) for lv, ws in drop.items() for w in ws}
out = [l for l in out if not (l and l[0] != '#' and (int(l.split('\t')[0]), l.split('\t')[1]) in gone)]
write(P('dict', 'hsk.tsv'), out)

# --- dict/gloss.tsv: hand-written meanings follow the word to its plain form ---
lines = read(P('dict', 'gloss.tsv'))
have = {l.split('\t')[0] for l in lines if l and l[0] != '#'}
out = []
for l in lines:
    c = l.split('\t')
    if l and l[0] != '#' and len(c[0]) > 1 and c[0].endswith('儿') and len(c) > 1 and c[1].endswith('r') and not c[1].endswith('ér'):
        h, p = plain(c[0], c[1])
        if h in have: print(f'gloss: {c[0]} dropped'); continue
        out.append('\t'.join([h, p] + c[2:])); have.add(h); print(f'gloss: {c[0]} -> {h}')
    else: out.append(l)
write(P('dict', 'gloss.tsv'), out)

# --- dict/sentences.tsv ---
lines = read(P('dict', 'sentences.tsv')); n = 0
for i, l in enumerate(lines):
    c = l.split('\t')
    if l and l[0] != '#' and len(c) > 1:
        t = text(c[1])
        if t != c[1]: c[1] = t; lines[i] = '\t'.join(c); n += 1
write(P('dict', 'sentences.tsv'), lines); print(f'sentences: {n} changed')

# --- tools/course/hsk*.txt: lesson words follow the list ---
for lv in range(2, 8):
    path = P('tools', 'course', f'hsk{lv}.txt')
    if not os.path.exists(path): continue
    lines = read(path)
    for i, l in enumerate(lines):
        if l.startswith('#') or ':' not in l: continue
        title, words = l.split(':', 1)
        ws = [rename.get(lv, {}).get(w, w) for w in words.split() if w not in drop.get(lv, set())]
        new = f'{title}: {" ".join(ws)}'
        if new != l: lines[i] = new; print(f'plan HSK {lv}: {title}')
    write(path, lines)

# --- course.js: the same swaps, since tools/build_course.py stops on older plan mismatches (see FINDINGS.md) ---
listed = {l.split('	')[1] for l in read(P('dict', 'hsk.tsv')) if l and l[0] != '#'}
ALL = lambda w: w[:-1] if w.endswith('儿') and w not in listed and w[:-1] in listed else w
lines = read(P('course.js')); n = 0
for i, l in enumerate(lines):
    if ':' not in l or l.lstrip().startswith(('/*', '*', '//', '##')): continue
    title, words = l.split(':', 1)
    if all(ALL(w) == w for w in words.split()): continue
    lines[i] = title + ':' + ' '.join(ALL(w) for w in words.split()); n += 1
write(P('course.js'), lines); print(f'course.js: {n} lessons changed')
