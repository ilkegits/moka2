# moka2: the ShiCards test copy

This folder is a second copy of ShiCards for trying ideas on ilkem's phone, live at
https://ilkegits.github.io/moka2/ (GitHub repo `ilkegits/moka2`, Pages from `main`).
The real app is `C:\Users\ilkem\HANZI` (repo `ilkegits/moka`, https://ilkegits.github.io/moka/).
Changes asked for "on moka2" go here only. Moving a change to the real app is a separate step, done only when ilkem asks.

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
