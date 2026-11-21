"""Build dict/zh-en.tsv, the compact Chinese-English dictionary ShiCards uses for quick add.

Sources (not stored in the repo, download them first):
  CC-CEDICT  https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz   (CC BY-SA 4.0)
  jieba word frequencies  https://cdn.jsdelivr.net/gh/fxsjy/jieba@v0.42.1/jieba/dict.txt  (MIT)

Usage:  python tools/build_dict.py <cedict .txt or .txt.gz> <jieba dict.txt> [out=dict/zh-en.tsv]

Output: one line per word, most common first:  simplified <TAB> pinyin with tone marks <TAB> meanings ("; " between them)
"""
import gzip, io, re, sys, unicodedata

src, freqsrc = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else 'dict/zh-en.tsv'

# Every CC-CEDICT word is kept (any length, however rare), so quick add can tell a real word from
# characters strung together; jieba frequency only decides the order.
MAX_DEFS = 4
MAX_CHARS = 110     # total length of the meanings shown

freq = {}
for line in io.open(freqsrc, encoding='utf-8'):
    p = line.split()
    if len(p) >= 2 and p[1].isdigit():
        freq[p[0]] = max(freq.get(p[0], 0), int(p[1]))

MARKS = {'a': 'āáǎà', 'e': 'ēéěè', 'i': 'īíǐì', 'o': 'ōóǒò', 'u': 'ūúǔù', 'ü': 'ǖǘǚǜ'}
def syl(s):
    m = re.fullmatch(r"([a-zü:]+)([1-5])", s, re.I)
    if not m:
        return s.replace('u:', 'ü')
    base, tone = m.group(1).lower().replace('u:', 'ü').replace('v', 'ü'), int(m.group(2))
    if tone == 5:
        return base
    if 'a' in base: i = base.index('a')
    elif 'e' in base: i = base.index('e')
    elif 'ou' in base: i = base.index('o')
    else:
        i = max(base.rfind(v) for v in 'aeiouü')
        if i < 0: return base
    return base[:i] + MARKS[base[i]][tone - 1] + base[i + 1:]
def pinyin(p):
    return ' '.join(syl(s) for s in p.split())

HAN = re.compile(r'^[㐀-鿿豈-﫿]+$')
SKIP_DEF = re.compile(r'^(surname |(old |archaic |Japanese |Korean )?variant of|see also |abbr\. for |used in |CL:|Taiwan pr\.|also pr\.|also written)', re.I)
REF = re.compile(r'[㐀-鿿]+\|([㐀-鿿]+)\[[^\]]*\]|([㐀-鿿]+)\[[^\]]*\]')

def clean(d):
    d = REF.sub(lambda m: m.group(1) or m.group(2), d)
    d = re.sub(r'\s*[(（]?\bCL:[^)）/;]*[)）]?', '', d)       # drop measure-word notes
    d = re.sub(r'\s+', ' ', d).strip(' ,;')
    return d

entries = []  # (rank key, simp, py, defs)
raw = gzip.open(src, 'rt', encoding='utf-8') if src.endswith('.gz') else io.open(src, encoding='utf-8')
for line in raw:
    if line.startswith('#'):
        continue
    m = re.match(r'^(\S+) (\S+) \[([^\]]*)\] /(.*)/\s*$', line)
    if not m:
        continue
    trad, simp, py, defs = m.groups()
    if not HAN.match(simp):
        continue
    f = freq.get(simp, 0)
    every = [clean(d) for d in defs.split('/') if d]
    ds = [d for d in every if d and not SKIP_DEF.match(d)] or [d for d in every if d][:1]   # "variant of …" words stay, with that note
    ds = [d if len(d) < 90 else d[:86].rsplit(' ', 1)[0] + ' …' for d in ds]                # long meanings are shortened, not dropped
    if not ds:
        continue
    proper = py[:1].isupper()
    keep = []
    for d in ds[:MAX_DEFS]:
        if keep and len('; '.join(keep + [d])) > MAX_CHARS:
            break
        keep.append(d)
    entries.append((-f, proper, len(simp), simp, pinyin(py).lower(), '; '.join(keep)))

entries.sort(key=lambda e: (e[0], e[1], e[2]))
seen = set()
with io.open(out, 'w', encoding='utf-8', newline='\n') as w:
    w.write('# CC-CEDICT (CC BY-SA 4.0, mdbg.net) ranked with jieba word frequencies (MIT). Built by tools/build_dict.py\n')
    n = 0
    for _, _, _, simp, py, ds in entries:
        k = (simp, py)
        if k in seen:
            continue
        seen.add(k)
        w.write(f'{simp}\t{py}\t{ds}\n'); n += 1
print(n, 'entries ->', out)
