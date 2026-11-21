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
- `manifest.webmanifest` id `/moka2/`, home-screen name `moka2`, icons with a blue "2" badge.

## Ship without asking

Same standing rule as the real app: when a change is finished and verified, commit it and push it live. Do not ask first, and never offer "commit?" or "push?" as a question or button.

1. Bump `APP_VERSION` in `index.html`, `"version"` in `version.json` (same number, short notes), and `CACHE` in `sw.js` (`moka2-vNN`).
2. Commit with explicit paths.
3. Push: `git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin main`
4. Wait until `gh api repos/ilkegits/moka2/pages/builds/latest` reports `built` for the pushed commit, then confirm the live `version.json` shows the new version.

Still ask before force-pushes, rewriting history, or publishing anywhere other than this repo.
