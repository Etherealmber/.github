# Etherealmber · `.github`

The **organization profile repository** for [Etherealmber](https://github.com/Etherealmber).

```
.github/
├── profile/
│   ├── README.md        ← rendered on https://github.com/Etherealmber
│   └── progress.json    ← the only file you edit by hand
├── scripts/
│   └── update-profile.mjs
└── .github/workflows/
    ├── profile.yml         ← runs the generator
    └── branch-cleanup.yml  ← deletes unused branches
```

> GitHub only renders `profile/README.md` on the organization profile.
> This root `README.md` is the repository's own landing page.

## How the profile keeps itself up to date

Nothing on the profile is typed by hand twice. Every day at **03:17 UTC** — and on any push that changes the generator or the progress file — [`.github/workflows/profile.yml`](.github/workflows/profile.yml) runs [`scripts/update-profile.mjs`](scripts/update-profile.mjs), which rewrites the marked blocks in `profile/README.md` and commits only if something actually changed.

| On the page | Source | Updates |
|---|---|---|
| Version of each product | latest GitHub release, or `package.json` for repos without releases | automatically |
| Commits, merged PRs, releases, closed issues | GitHub API | automatically |
| Latest releases feed (tag, date, highlights) | GitHub Releases API | automatically |
| Progress bars (products, open items, roadmap) | [`profile/progress.json`](profile/progress.json) | when you edit the JSON |
| Everything else | `profile/README.md` | when you edit the file |

The blocks are delimited by markers — `<!-- STATS:START -->`, `<!-- REPOS:START -->`, `<!-- RELEASES:START -->`, `<!-- OPEN:START -->`, `<!-- PROGRESS:START -->`, `<!-- ROADMAP:START -->`, and inline `<!--VER:slug-->` — so text outside them is safe to edit freely.

Release highlights are sanitised before rendering (PR links, `by @user in …`, sizes and checksums are stripped), so commit attribution from other accounts never leaks into the profile.

### Moving a progress bar

Edit `profile/progress.json`:

```json
{ "name": "Atlas Commerce Android", "repo": "atlas-commerce-android", "pct": 95, "reading": "…" }
```

Commit it. The workflow redraws the bar, picks the colour (`≥70` green, `30–69` yellow, `<30` grey) and refreshes the page. Nothing else to touch — no badge URLs, no percentages in three places.

### Running it locally

```bash
export GITHUB_TOKEN=$(gh auth token)
node scripts/update-profile.mjs
```

Add no dependencies — the script uses `fetch` and Node 20+ only.

### Repository list

The repositories table is generated from the `REPOS` array at the top of `scripts/update-profile.mjs`. When a new repo is created (Atlas Shop, the support portal…), add one entry there and it appears on the profile with live stats.

## Branch cleanup

[`branch-cleanup.yml`](.github/workflows/branch-cleanup.yml) keeps the branch list tidy, using the same policy as `atlas-commerce`:

- **On PR close** — the head branch is deleted if the PR was merged, or if it is fully contained in `main`
- **Weekly, Mondays 05:00 UTC** — sweeps every branch that is fully merged into `main` and has no open PR, including leftover `arena/*` session branches
- **Never touched** — `main`, any branch with an open PR, any protected branch, and any unmerged work. Nothing is force-deleted, rebased or rewritten.

Run it by hand from **Actions → Branch cleanup → Run workflow**, with `dry_run` checked to see what it would delete without deleting anything.

---

## Repositories

| Repository | What it is |
|---|---|
| [atlas-commerce](https://github.com/Etherealmber/atlas-commerce) | ERP / POS / invoicing core — Cloudflare Workers, D1, R2, React |
| [atlas-commerce-android](https://github.com/Etherealmber/atlas-commerce-android) | Native Android companion — Kotlin + Jetpack Compose, Android 9+ |
| [atlas-commerce-desktop](https://github.com/Etherealmber/atlas-commerce-desktop) | Native desktop client — Rust + egui, Windows / macOS / Linux |
| [afmarbre-main](https://github.com/Etherealmber/afmarbre-main) | Client platform — catalogue, quotes, CMS admin on Workers |
| [.github](https://github.com/Etherealmber/.github) | Organization profile and brand assets |

Live versions, counts and the full roadmap are on the profile itself: **https://github.com/Etherealmber**

---

MIT © 2026 Etherealmber
