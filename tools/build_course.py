"""Build course.js: the units and lessons of HSK 2 and up, from the lesson plans in tools/course/.

    python tools/build_course.py 2 3 4        (the levels to put in the app; a plan may wait in tools/course/ unused)

A plan, tools/course/hsk<level>.txt:
    ## Unit title in English | 中文名 | the unit's comic in one sentence
    Lesson title: 词 词 词 词 词 词
Every word of the level (dict/hsk.tsv) must be in exactly one lesson. The comic sentence stays here; the app does not read it.
NUMBERS NEVER MOVE: level L's units are L*100+1 and on, its lessons L*1000+1 and on, in the order of the plan, and people's
progress is saved under those numbers. So once a level is live, never add, drop or reorder its units or lessons; moving a
word from one lesson to another is fine. A level whose comics exist (comics/hsk<level>.js) is listed in SHI_COMIC_LV.
After building, raise the number in index.html's <script src="course.js?v=...">.
"""
import collections, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
levels = sorted(int(a) for a in sys.argv[1:])
if not levels: sys.exit(__doc__)
want = collections.defaultdict(collections.Counter)
for l in open(os.path.join(ROOT, 'dict', 'hsk.tsv'), encoding='utf-8'):
    f = l.rstrip('\r\n').split('\t')
    if len(f) >= 2 and f[0].isdigit(): want[int(f[0])][f[1]] += 1
out, errs = [], []
for lv in levels:
    units, got = [], collections.Counter()
    for ln, raw in enumerate(open(os.path.join(ROOT, 'tools', 'course', f'hsk{lv}.txt'), encoding='utf-8'), 1):
        s = raw.strip()
        if not s or s.startswith('# '): continue
        if s.startswith('##'):
            p = [x.strip() for x in s[2:].split('|')]
            if len(p) < 2 or not p[0] or not p[1]: errs.append(f'hsk{lv} line {ln}: unit needs "## English | 中文"')
            units.append((p[0], p[1] if len(p) > 1 else '', [])); continue
        t, _, w = s.partition(':'); ws = w.split()
        if not units or not ws or ':' in w or '|' in s or '`' in s: errs.append(f'hsk{lv} line {ln}: bad lesson line'); continue
        units[-1][2].append((t.strip(), ws)); got.update(ws)
    if got != want[lv]: errs.append(f'hsk{lv}: words do not match the list (missing {list((want[lv] - got))[:20]}, extra {list((got - want[lv]))[:20]})')
    if len(units) > 99 or sum(len(u[2]) for u in units) > 999: errs.append(f'hsk{lv}: at most 99 units and 999 lessons')
    out.append(f'  {lv}: `\n' + '\n\n'.join(f'## {en}|{zh}\n' + '\n'.join(f'{t}:{" ".join(ws)}' for t, ws in ls) for en, zh, ls in units) + '\n`,')
    print(f'HSK {lv}: {len(units)} units, {sum(len(u[2]) for u in units)} lessons, {sum(got.values())} words')
if errs: sys.exit('\n'.join(errs))
comics = [lv for lv in levels if os.path.exists(os.path.join(ROOT, 'comics', f'hsk{lv}.js'))]
head = '''/* ShiCards: the units and lessons of HSK 2 and up (HSK 1's are in index.html). BUILT by tools/build_course.py from the
   lesson plans in tools/course/: change those, not this file.
   SHI_COURSE[level]: a unit line "## English|中文", then one line per lesson, "Title:word word word".
   Numbers never move once a level is out: level L's units are L*100+1 and on, its lessons L*1000+1 and on, in the
   order written here. The meaning and reading a lesson shows are the word list's (dict/hsk.tsv), or the hand-written
   ones in dict/gloss.tsv. SHI_COMIC_LV: the levels that have a comics file, comics/hsk<level>.js.
   When this file changes, raise the number in index.html's <script src="course.js?v=...">. */
'''
open(os.path.join(ROOT, 'course.js'), 'w', encoding='utf-8', newline='\n').write(head + f'window.SHI_COMIC_LV = {comics};\nwindow.SHI_COURSE = {{\n' + '\n'.join(out) + '\n};\n')
