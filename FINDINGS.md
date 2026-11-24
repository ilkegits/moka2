# Findings

| Date | Where | Severity | What | Suggested fix | Status |
|---|---|---|---|---|---|
| 2026-11-24 | tools/build_course.py:1 | low | The course builder stops: the lesson plans in tools/course/ miss words that dict/hsk.tsv now lists twice at a level (点, 过, 花 at HSK 2; dozens at HSK 3 to 7), so course.js can no longer be rebuilt from the plans. course.js itself still works. | Add each missing repeat word to a lesson in its plan, then run `python tools/build_course.py 2 3 4 5 6 7`. | open |
