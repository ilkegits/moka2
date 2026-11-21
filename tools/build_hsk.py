"""Build dict/hsk.tsv, the HSK word lists ShiCards offers for picking the words you know.

Source (not stored in the repo, download it first):
  complete-hsk-vocabulary (MIT, Yanis Zafiropulos)
  https://cdn.jsdelivr.net/gh/drkameleon/complete-hsk-vocabulary@main/complete.min.json
  Its meanings come from CC-CEDICT (CC BY-SA 4.0, mdbg.net).

Usage:  python tools/build_hsk.py <complete.min.json> [out=dict/hsk.tsv]

Uses the HSK 3.0 lists of the 2026 syllabus ("t" levels; 7 stands for the 7-9 band).
Output: one line per word, by level, most common first:  level <TAB> simplified <TAB> pinyin <TAB> meanings
"""
import io, json, re, sys

src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else 'dict/hsk.tsv'
MAX_CHARS = 90

words = json.load(io.open(src, encoding='utf-8'))
rows = []
for w in words:
    lv = [int(l[1:]) for l in w.get('l', []) if re.fullmatch(r't[1-7]', l)]
    if not lv:
        continue
    forms = [f for f in w.get('f', []) if f.get('m')] or w.get('f', [])
    if not forms:
        continue
    # the everyday reading is the one with the most real meanings (个 gè, not gě "used in 自个儿"; 说 shuō, not shuì)
    real = lambda f: [m for m in f.get('m', []) if not re.match(r'(surname|variant of|old variant|used in|see |abbr)', m, re.I)]
    f = max(forms, key=lambda f: len(real(f)))
    py = re.sub(r'\s+', ' ', f['i']['y']).strip()
    keep = []
    for m in f.get('m', []):
        m = re.sub(r'\s+', ' ', m).strip(' ;,')
        if not m or re.match(r'(surname|variant of|old variant|used in)', m, re.I):
            continue
        if keep and len('; '.join(keep + [m])) > MAX_CHARS:
            break
        keep.append(m)
    rows.append((min(lv), w.get('q', 10 ** 9), w['s'], py, '; '.join(keep)))

rows.sort(key=lambda r: (r[0], r[1]))
seen = set()
with io.open(out, 'w', encoding='utf-8', newline='\n') as o:
    o.write('# HSK 3.0 word lists, 2026 syllabus (levels 1-6, 7 = 7-9). From complete-hsk-vocabulary (MIT); meanings CC-CEDICT (CC BY-SA 4.0). Built by tools/build_hsk.py\n')
    n = 0
    for lv, _, s, py, m in rows:
        if s in seen:
            continue
        seen.add(s)
        o.write(f'{lv}\t{s}\t{py}\t{m}\n'); n += 1
print(n, 'words ->', out)
