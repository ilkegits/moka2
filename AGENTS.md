# moka2: ShiHanzi

## Which app ilkem means (read this first)

ilkem's requests are for **ShiHanzi**, unless ilkem names ShiHanzi2.

| App | Repo | Folder on ilkem's PC | Live at | Other names ilkem uses |
|---|---|---|---|---|
| **ShiHanzi**: where ilkem's requests go | `ilkegits/moka2` | `C:\Users\ilkem\moka2` | https://ilkegits.github.io/moka2/ | ShiCards, Shihanzi, moka2 |
| ShiHanzi2: only when named | `ilkegits/moka` | `C:\Users\ilkem\HANZI` | https://ilkegits.github.io/moka/ | ShiCards2, Shihanzi2, moka |

- The trap: the repo called `moka` (folder `HANZI`) is ShiHanzi**2**. The repo called `moka2` is ShiHanzi, without the 2.
- A request that does not name an app goes to ShiHanzi (`moka2`), even when the session was opened in the `moka` repo or the `HANZI` folder. Clone or open `ilkegits/moka2` and make the change there.
- Change ShiHanzi2 only when ilkem says ShiHanzi2 (or ShiCards2) for that request. If `moka2` can't be reached from where you are, say so and stop; never make the change in ShiHanzi2 instead.
- ilkem dictates, so the names can come through garbled. Read any of them as ShiHanzi unless a "2" is clearly there.
- Why this is written down: on 2026-11-25, v4.70 to v4.73 (word bank + and Add card fixes) were asked for ShiHanzi but shipped to ShiHanzi2.

## This repo

This folder is ShiHanzi (it began as a test copy of ShiCards), live at
https://ilkegits.github.io/moka2/ (GitHub repo `ilkegits/moka2`, Pages from `main`).
ShiHanzi2 is `C:\Users\ilkem\HANZI` (repo `ilkegits/moka`, https://ilkegits.github.io/moka/).
ilkem's requests go here (see the table above). Moving a change over to ShiHanzi2 is a separate step, done only when ilkem asks.

## Keep the two apps apart

Both apps live on the same website (`ilkegits.github.io`), so they share the phone's saved data and caches. Never undo these:

- Saved progress: `moka2.v1` (the real app uses `moka.v1`). On first open, moka2 copies the real progress once, read only, without the reminder sign-up. Never write to `moka.v1` from here.
- Log, sync and reminder note: `shicards2.log`, `shicards2.sync`, `shicards2.remindNote`.
- Offline caches: named `moka2-vNN`, and moka2 only ever deletes caches that start with `moka2-`.
- Accounts: the same Supabase project and accounts as the real app (one login for both), but moka2's save is in its own table `saves2` (`tools/cloud/schema-moka2.sql`, already run), its sign-in in its own storage key `moka2-auth`, and its sync state in `shicards2.cloud` / `shicards2.cloudNote`. Supabase's redirect allow-list has `https://ilkegits.github.io/moka2/**`. Delete account removes the shared account, so it says so.
- `manifest.webmanifest` id `/moka2/`, home-screen name `moka2`, icons with a blue "2" badge.

## Start again from the real app

`python tools/refresh-from-real.py` rebuilds moka2 from the live real app (`origin/main` of HANZI, not the local checkout, which is often behind) and makes all the changes above again. It wipes experiments made only on moka2, so run it only when ilkem asks for moka2 to catch up with the real app. It stops with a message if the real app has changed in a way the script does not know about.

## Ship without asking

Same standing rule as the real app: when a change is finished and verified, commit it and push it live. Do not ask first, and never offer "commit?" or "push?" as a question or button.

1. Bump `APP_VERSION` in `index.html`, `"version"` in `version.json` (same number, short notes), and `CACHE` in `sw.js` (`moka2-vNN`). Test versions add a third number to the real version they started from (3.45.1, 3.45.2, …), so they never look like a real release.
2. Commit with explicit paths.
3. Push: `git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin main`
4. Wait until `gh api repos/ilkegits/moka2/pages/builds/latest` reports `built` for the pushed commit, then confirm the live `version.json` shows the new version.

Still ask before force-pushes, rewriting history, or publishing anywhere other than this repo.
