"""Build dict/sentences.tsv: up to three short example sentences for every single-character HSK word,
shown on the third page of Hanzi of the day.

Source (not stored in the repo, download it first):
  Tatoeba Mandarin-English pairs, packaged by manythings.org (CC-BY 2.0 France, tatoeba.org)
  https://www.manythings.org/anki/cmn-eng.zip   (unzip it; the file is cmn.txt)

Usage:  python tools/build_sentences.py <cmn.txt> [hsk=dict/hsk.tsv] [out=dict/sentences.tsv]

A sentence is kept only when every character in it appears in the HSK lists (this also drops the
traditional-character ones), and it is 4 to 16 characters long. For each character the easiest
sentences win: the lowest HSK level needed to read all of it, then the length closest to 9.
Output: one line per sentence:  character <TAB> chinese <TAB> english <TAB> tatoeba id
"""
import io, re, sys

src = sys.argv[1]
hsk = sys.argv[2] if len(sys.argv) > 2 else 'dict/hsk.tsv'
out = sys.argv[3] if len(sys.argv) > 3 else 'dict/sentences.tsv'
PER_CHAR = 3
HAN = re.compile(r'[㐀-鿿]')

# each character's level: the lowest HSK level of any word that uses it
lvl, singles = {}, []
for line in io.open(hsk, encoding='utf-8'):
    if not line.strip() or line[0] == '#':
        continue
    lv, h = line.split('\t')[:2]
    lv = int(lv)
    for c in h:
        if HAN.match(c) and lv < lvl.get(c, 99):
            lvl[c] = lv
    if len(h) == 1 and HAN.match(h):
        singles.append(h)

seen, cands = set(), {}
for line in io.open(src, encoding='utf-8'):
    parts = line.rstrip('\n').split('\t')
    if len(parts) < 3:
        continue
    en, zh, attr = parts[0].strip(), parts[1].strip(), parts[2]
    if zh in seen:
        continue
    seen.add(zh)
    han = HAN.findall(zh)
    if not 4 <= len(han) <= 16 or any(c not in lvl for c in han) or len(en) > 70:
        continue
    m = re.search(r'#(\d+)', attr)
    hard = max(lvl[c] for c in han)
    for c in set(han):
        cands.setdefault(c, []).append((hard, abs(len(han) - 9), zh, en, m.group(1) if m else ''))

n = 0
with io.open(out, 'w', encoding='utf-8', newline='\n') as o:
    o.write('# Example sentences from Tatoeba (tatoeba.org, CC-BY 2.0 FR) via manythings.org. Built by tools/build_sentences.py\n')
    for c in sorted(set(singles), key=lambda c: (lvl[c], c)):
        for hard, _, zh, en, sid in sorted(cands.get(c, []))[:PER_CHAR]:
            o.write(f'{c}\t{zh}\t{en}\t{sid}\n')
            n += 1
print(f'{n} sentences for {len(set(singles))} characters -> {out}')
