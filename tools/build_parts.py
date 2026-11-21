"""Build dict/parts.tsv: which strokes make up each part of a character, for the writing hint (part by part)
and for naming the part you got wrong (晴 written with 氵 instead of 日).

Source (not stored in the repo, download it first):
  Make Me a Hanzi dictionary.txt (Arphic Public License / LGPL, Shaunak Kishore)
  https://cdn.jsdelivr.net/gh/skishore/makemeahanzi@master/dictionary.txt

Usage:  python tools/build_parts.py <dictionary.txt> [hsk=dict/hsk.tsv] [out=dict/parts.tsv]

Output, one character per line:
  char <TAB> layout and top-level parts <TAB> hint groups
  晴	⿰日青	日0-3;龶4-7;月8-11
A hint group is a part and its strokes (0-based, in writing order). A part with more than SPLIT strokes is split into its
own parts when the data allows (青 -> 龶 + 月). A part the data can't name is written as ？.
Then one line per part used:  @ <TAB> part <TAB> pinyin <TAB> short meaning
"""
import io, json, re, sys

src = sys.argv[1]
hsk = sys.argv[2] if len(sys.argv) > 2 else 'dict/hsk.tsv'
out = sys.argv[3] if len(sys.argv) > 3 else 'dict/parts.tsv'
SPLIT = 5
OPS = {'⿰': 2, '⿱': 2, '⿲': 3, '⿳': 3, '⿴': 2, '⿵': 2, '⿶': 2, '⿷': 2, '⿸': 2, '⿹': 2, '⿺': 2, '⿻': 2}

D = {}
for line in io.open(src, encoding='utf-8'):
    line = line.strip()
    if line:
        e = json.loads(line)
        D[e['character']] = e


def parse(s, i=0):
    """IDS string -> tree: a leaf is a one-character string, a node is (op, [children])"""
    c = s[i]
    if c in OPS:
        kids, j = [], i + 1
        for _ in range(OPS[c]):
            k, j = parse(s, j)
            kids.append(k)
        return (c, kids), j
    return c, i + 1


def leaf_name(t):
    return t if isinstance(t, str) else '？'


def groups(ch, strokes=None, depth=0):
    """[(part, [stroke indices])] for character ch; strokes maps its own stroke numbers onto the outer character's"""
    e = D.get(ch)
    if not e or not e.get('matches') or not e.get('decomposition') or e['decomposition'] in ('？',):
        return None
    m = e['matches']
    strokes = strokes if strokes is not None else list(range(len(m)))
    if len(strokes) != len(m):
        return None
    try:
        tree, _ = parse(e['decomposition'])
    except IndexError:
        return None
    if isinstance(tree, str):
        return None
    by = {}
    last = None
    for k, path in enumerate(m):
        key = path[0] if path else last          # a stroke the data didn't place goes with the one before it
        if key is None:
            key = 0
        last = key
        by.setdefault(key, []).append(k)
    out = []
    for key in sorted(by, key=lambda q: by[q][0]):
        own = by[key]
        sub = tree[1][key] if key < len(tree[1]) else '？'
        mine = [strokes[k] for k in own]
        if len(own) > SPLIT and depth < 2:
            deeper = None
            if isinstance(sub, str) and sub != '？':
                deeper = groups(sub, mine, depth + 1)
            elif not isinstance(sub, str):     # a nested part inside this entry: split by the second step of each path
                seconds = {}
                for k in own:
                    p = m[k]
                    seconds.setdefault(p[1] if p and len(p) > 1 else -1, []).append(strokes[k])
                if len(seconds) > 1:
                    deeper = [(leaf_name(sub[1][q]) if 0 <= q < len(sub[1]) else '？', v) for q, v in sorted(seconds.items(), key=lambda kv: kv[1][0])]
            if deeper and len(deeper) > 1:
                out += deeper
                continue
        out.append((leaf_name(sub), mine))
    return out


def ranges(ix):
    ix = sorted(ix)
    r, a = [], ix[0]
    for p, q in zip(ix, ix[1:] + [None]):
        if q != p + 1:
            r.append(f'{a}-{p}' if p > a else f'{a}')
            a = q
    return ','.join(r)


def short(defn):
    d = re.split(r'[;,]', defn or '')[0].strip()
    return re.sub(r'\s+', ' ', d)[:28]


chars = set()
for line in io.open(hsk, encoding='utf-8'):
    if line.startswith('#'):
        continue
    p = line.rstrip('\n').split('\t')
    if len(p) > 1:
        chars.update(c for c in p[1] if '一' <= c <= '鿿')

rows, used = [], set()
for ch in sorted(chars):
    g = groups(ch)
    if not g:
        continue
    e = D[ch]
    tree, _ = parse(e['decomposition'])
    top = tree[0] + ''.join(leaf_name(t) for t in tree[1]) if not isinstance(tree, str) else ''
    rows.append(f"{ch}\t{top}\t{';'.join(n + ranges(ix) for n, ix in g)}")
    used.update(n for n, _ in g)
    used.update(top)

meta = []
for c in sorted(used - {'？'}):
    e = D.get(c)
    if e:
        meta.append(f"@\t{c}\t{(e.get('pinyin') or [''])[0]}\t{short(e.get('definition'))}")

with io.open(out, 'w', encoding='utf-8', newline='\n') as o:
    o.write('# Character parts and their strokes, from Make Me a Hanzi (Arphic Public License / LGPL). Built by tools/build_parts.py\n')
    o.write('\n'.join(rows + meta) + '\n')
print(len(rows), 'characters,', len(meta), 'parts ->', out)
