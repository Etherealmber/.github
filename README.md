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
    └── profile.yml      ← runs the generator
```

> GitHub only renders `profile/README.md` on the organization profile.
> This root `README.md` is the repository's own landing page.

## How the profile keeps itself up to date

Nothing on the profile is typed by hand twice. Every day at **03:17 UTC** — and on any push that changes the generator or the progress file — [`.github/workflows/profile.yml`](.github/workflows/profile.yml) runs [`scripts/update-profile.mjs`](scripts/update-profile.mjs), which rewrites the marked blocks in `profile/README.md` and commits only if something actually changed.

| On the page | Source | Updates |
|---|---|---|
| Version of each product | latest GitHub release, or `package.json` for repos without releases | automatically |
| Commits, merged PRs, releases, closed issues | GitHub API | automatically |
| Progress bars (products, open items, roadmap) | [`profile/progress.json`](profile/progress.json) | when you edit the JSON |
| Everything else | `profile/README.md` | when you edit the file |

The blocks are delimited by markers — `<!-- STATS:START -->`, `<!-- REPOS:START -->`, `<!-- OPEN:START -->`, `<!-- PROGRESS:START -->`, `<!-- ROADMAP:START -->`, and inline `<!--VER:slug-->` — so text outside them is safe to edit freely.

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
