"""Build dict/pinyin.tsv, the sound for every cell of the HSK 1 pinyin chart.

For each syllable and tone (ma1, ma2, ...) it picks one common character that has only that
reading, so the phone's Chinese voice says exactly that sound when you tap it.
Characters on the HSK lists come first (lowest level first), then the rest by how common they are.

Sources (already in the repo): dict/hsk.tsv and dict/zh-en.tsv (CC-CEDICT, CC BY-SA 4.0, ranked by jieba frequency).

Usage:  python -X utf8 tools/build_pinyin.py [out=dict/pinyin.tsv]
Output: syllable+tone number <TAB> character <TAB> short meaning
"""
import io, re, sys, unicodedata

out = sys.argv[1] if len(sys.argv) > 1 else 'dict/pinyin.tsv'
MARKS = {'̄': 1, '́': 2, '̌': 3, '̀': 4}


def numbered(p):
    """'mǎ' -> ('ma', 3); 'lǜ' -> ('lü', 4); neutral or several syllables -> None"""
    p = p.strip().lower()
    if not p or ' ' in p or not re.fullmatch(r"[a-zǜ-̌]+", unicodedata.normalize('NFD', p)):
        return None
    d = unicodedata.normalize('NFD', p)
    tone = next((MARKS[c] for c in d if c in MARKS), 0)
    base = unicodedata.normalize('NFC', ''.join(c for c in d if c not in MARKS))
    return (base, tone) if tone else None


def short(e):
    e = re.sub(r'\([^)]*\)', '', e.split(';')[0]).strip()
    return e[:40]


skip = re.compile(r'(variant of|surname|used in|see |abbr|old |archaic|erhua)', re.I)
readings, meaning, order = {}, {}, []
for l in io.open('dict/zh-en.tsv', encoding='utf-8'):
    if l.startswith('#'):
        continue
    f = l.rstrip('\n').split('\t')
    if len(f) < 3 or len(f[0]) != 1:
        continue
    h, p, e = f
    if h not in readings:
        readings[h] = set()
        order.append(h)
    if skip.match(e):
        continue
    readings[h].add(p.lower())
    meaning.setdefault(h, short(e))

hsk = {}
for l in io.open('dict/hsk.tsv', encoding='utf-8'):
    if l.startswith('#'):
        continue
    f = l.rstrip('\n').split('\t')
    if len(f) > 2 and len(f[1]) == 1 and f[1] not in hsk:
        hsk[f[1]] = (int(f[0]), f[2], short(f[3]) if len(f) > 3 else '')

rank = {h: i for i, h in enumerate(order)}
best = {}
# first the everyday HSK 1-2 characters in their HSK reading, even when they have a rarer second one
# (a voice reading 好 on its own says hao3, the reading learners need)
for h, (lv, p, e) in sorted(hsk.items(), key=lambda x: (x[1][0], rank.get(x[0], 1e9))):
    n = lv <= 2 and numbered(p)
    if any(not numbered(r) for r in readings.get(h, ())):   # 吗 also reads ma: a voice may say that
        continue
    if n and n not in best:
        best[n] = (h, e or meaning.get(h, ''))
# then common characters with only one reading
for h in sorted(readings, key=lambda h: (hsk.get(h, (99,))[0], rank[h])):
    r = readings[h]
    if len(r) != 1 or rank[h] > 8000 or not meaning.get(h):
        continue
    n = numbered(next(iter(r)))
    if not n or n in best:
        continue
    best[n] = (h, meaning[h])

with io.open(out, 'w', encoding='utf-8', newline='\n') as w:
    w.write('# One common single-reading character per pinyin syllable and tone, for the pinyin chart. '
            'From CC-CEDICT (CC BY-SA 4.0) and the HSK lists. Built by tools/build_pinyin.py\n')
    for (s, t), (h, e) in sorted(best.items()):
        w.write(f'{s}{t}\t{h}\t{e}\n')
print(len(best), 'syllable-tones written to', out)
