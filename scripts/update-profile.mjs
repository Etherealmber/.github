#!/usr/bin/env node
/**
 * Regenerates the auto-updating parts of profile/README.md.
 *
 * Blocks are delimited by markers:
 *   <!-- STATS:START -->    ... <!-- STATS:END -->     header badges
 *   <!-- REPOS:START -->    ... <!-- REPOS:END -->     repositories table
 *   <!-- PROGRESS:START --> ... <!-- PROGRESS:END -->  progress overview table
 *   <!-- ROADMAP:START -->  ... <!-- ROADMAP:END -->   roadmap table
 *   <!--VER:slug-->value<!--/VER-->                    inline live version
 *
 * Live data (commits, merged PRs, releases, issues, versions) comes from the
 * GitHub API. Estimates (percentages, readings) come from profile/progress.json —
 * edit that file to move a bar, never the README.
 *
 * Usage: GITHUB_TOKEN=... node scripts/update-profile.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const README_PATH = path.join(ROOT, 'profile', 'README.md');
const PROGRESS_PATH = path.join(ROOT, 'profile', 'progress.json');

const ORG = 'Etherealmber';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

if (!TOKEN) {
  console.warn('::warning::GITHUB_TOKEN is not set — falling back to unauthenticated requests (60/h limit)');
}

/* ------------------------------------------------------------------ repos -- */

const REPOS = [
  {
    slug: 'atlas-commerce',
    what: 'ERP / POS / invoicing core — Cloudflare Workers, D1, R2, React',
    versionFrom: 'package', // no GitHub releases yet; version lives in package.json
    track: true,
  },
  {
    slug: 'atlas-commerce-android',
    what: 'Native Android companion — Kotlin + Jetpack Compose, Android 9+',
    versionFrom: 'release',
    track: true,
  },
  {
    slug: 'atlas-commerce-desktop',
    what: 'Native desktop client — Rust + egui, Windows / macOS / Linux',
    // Releases are published in bursts; when none exist we fall back to the
    // Cargo workspace version so the table never goes blank.
    versionFrom: 'cargo',
    track: true,
  },
  {
    slug: 'afmarbre-main',
    what: 'Client platform — catalogue, quotes, CMS admin on Workers',
    versionFrom: 'package',
    track: true,
  },
  {
    slug: '.github',
    what: 'Organization profile and brand assets (this page)',
    versionFrom: 'none',
    track: true,
  },
];

/* ------------------------------------------------------------------- http -- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET with retries. The search endpoints enforce a low per-minute quota, so a
 * 403/429 here is usually back-pressure, not a permanent failure.
 */
async function api(route, attempt = 1) {
  const url = route.startsWith('http') ? route : `https://api.github.com${route}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      'User-Agent': 'etherealmber-profile-bot',
    },
  });

  const retryable = res.status === 403 || res.status === 429 || res.status >= 500;
  if (retryable && attempt <= 4) {
    const retryAfter = Number(res.headers.get('retry-after'));
    const reset = Number(res.headers.get('x-ratelimit-reset'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : Number.isFinite(reset) && reset > 0
        ? Math.min(Math.max(reset * 1000 - Date.now() + 1000, 2000), 30000)
        : 2000 * attempt;
    console.warn(`  ↻ ${route} → HTTP ${res.status}, retrying in ${Math.round(waitMs / 1000)}s (attempt ${attempt}/4)`);
    await sleep(waitMs);
    return api(route, attempt + 1);
  }

  return res;
}

async function json(route, fallback = null) {
  const res = await api(route);
  if (!res.ok) {
    if (res.status === 404) return fallback;
    throw new Error(`${route} → HTTP ${res.status}`);
  }
  return res.json();
}

async function totalCount(q) {
  const res = await api(`/search/issues?q=${encodeURIComponent(q)}&per_page=1`);
  if (!res.ok) {
    console.warn(`  ⚠ search "${q}" → HTTP ${res.status}; count left blank`);
    return null;
  }
  const body = await res.json();
  return body.total_count ?? 0;
}

async function commitCount(slug) {
  const res = await api(`/repos/${ORG}/${slug}/commits?per_page=1`);
  if (!res.ok) return null;
  const link = res.headers.get('link') || '';
  const last = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (last) return Number(last[1]);
  const body = await res.json();
  return Array.isArray(body) ? body.length : null;
}

async function latestReleaseInfo(slug) {
  const rel = await json(`/repos/${ORG}/${slug}/releases/latest`);
  if (!rel || !rel.tag_name) return null;
  return {
    tag: rel.tag_name,
    name: rel.name || rel.tag_name,
    publishedAt: rel.published_at || rel.created_at,
    url: rel.html_url,
    body: rel.body || '',
  };
}

async function latestRelease(slug) {
  const info = await latestReleaseInfo(slug);
  return info ? info.tag.replace(/^v/, '') : null;
}

async function releasesCount(slug) {
  const list = await json(`/repos/${ORG}/${slug}/releases?per_page=100`, []);
  return Array.isArray(list) ? list.length : 0;
}

/**
 * The web app ships its human-facing version in src/version.ts and
 * package.json is often bumped later (or not at all), so read the source of
 * truth: APP_VERSION first, then DISPLAY_VERSION, then package.json.
 */
const SOURCE_VERSION_FILES = [
  ['src/version.ts', /APP_VERSION\s*=\s*['"]([^'"]+)['"]/],
  ['src/version.ts', /DISPLAY_VERSION\s*=\s*['"]([^'"]+)['"]/],
  ['src/version.ts', /WHATS_NEW_VERSION\s*=\s*['"]([^'"]+)['"]/],
];

async function sourceVersion(slug) {
  for (const [file, re] of SOURCE_VERSION_FILES) {
    const body = await json(`/repos/${ORG}/${slug}/contents/${file}`);
    if (body && body.content) {
      const match = Buffer.from(body.content, 'base64').toString('utf8').match(re);
      if (match) return match[1];
    }
  }
  const pkg = await json(`/repos/${ORG}/${slug}/contents/package.json`);
  if (pkg && pkg.content) {
    try {
      return JSON.parse(Buffer.from(pkg.content, 'base64').toString('utf8')).version || null;
    } catch { /* ignore */ }
  }
  return null;
}

async function packageVersion(slug) {
  const file = await json(`/repos/${ORG}/${slug}/contents/package.json`);
  if (!file || !file.content) return null;
  try {
    const parsed = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    return parsed.version || null;
  } catch {
    return null;
  }
}

async function collect() {
  const out = {};
  for (const repo of REPOS) {
    const { slug, versionFrom } = repo;
    const stat = { commits: null, mergedPRs: null, releases: null, closedIssues: null, version: null, latest: null };

    stat.commits = await commitCount(slug);
    if (repo.track) {
      stat.mergedPRs = await totalCount(`repo:${ORG}/${slug} is:pr is:merged`);
      await sleep(1200); // stay well inside the search quota
      stat.closedIssues = await totalCount(`repo:${ORG}/${slug} is:issue is:closed`);
      await sleep(1200);
      stat.releases = await releasesCount(slug);
    }

    if (versionFrom === 'release') {
      stat.latest = await latestReleaseInfo(slug);
      stat.version = stat.latest ? stat.latest.tag.replace(/^v/, '') : null;
    } else if (versionFrom === 'package') {
      stat.version = (await sourceVersion(slug)) || (await packageVersion(slug));
    } else if (versionFrom === 'cargo') {
      const cargo = await json(`/repos/${ORG}/${slug}/contents/Cargo.toml`);
      if (cargo && cargo.content) {
        const text = Buffer.from(cargo.content, 'base64').toString('utf8');
        const ws = text.match(/\[workspace\.package\][\s\S]{0,200}?version\s*=\s*"([^"]+)"/);
        const any = ws || text.match(/^version\s*=\s*"([^"]+)"/m);
        if (any) stat.version = any[1];
      }
    }

    out[slug] = stat;
    console.log(
      `  ${slug.padEnd(24)} commits=${stat.commits} prs=${stat.mergedPRs} releases=${stat.releases} version=${stat.version ?? '—'}`,
    );
  }
  return out;
}

/* ------------------------------------------------------------------ render -- */

const BLOCK = '\u2588';
const LIGHT = '\u2591';

function bar(pct) {
  const filled = Math.max(0, Math.min(10, Math.round(Number(pct) / 10)));
  return BLOCK.repeat(filled) + LIGHT.repeat(10 - filled);
}

function accent(pct) {
  const n = Number(pct);
  if (n >= 70) return '2ea44f'; // green
  if (n >= 30) return 'fbca04'; // yellow
  return '9e9e9e'; // grey
}

function barBadge(pct) {
  return `![${pct}%](https://img.shields.io/badge/${encodeURIComponent(bar(pct))}-${pct}%25-${accent(pct)}?style=flat-square)`;
}

function plainBadge(label, value, color, logo) {
  const l = encodeURIComponent(label).replace(/-/g, '--').replace(/_/g, '__');
  const v = encodeURIComponent(value).replace(/-/g, '--').replace(/_/g, '__');
  const logoQs = logo ? `&logo=${logo}&logoColor=white` : '';
  return `![${label}](https://img.shields.io/badge/${l}-${v}-${color}?style=flat-square${logoQs})`;
}

const STATUS_EMOJI = {
  done: '🟢',
  'in progress': '🟡',
  ongoing: '🟡',
  partial: '🟡',
  'backend only': '🟡',
  early: '🟡',
  planned: '⚪',
  'not started': '⚪',
};

function statusCell(status) {
  const emoji = STATUS_EMOJI[status] || '⚪';
  return `${emoji} ${status}`;
}

function fmt(n) {
  return n === null || n === undefined ? '—' : n.toLocaleString('en-US');
}

function versionBadge(repo, stats) {
  const { slug, versionFrom } = repo;
  const v = stats.version;
  if (!v) return '`—`';

  if (versionFrom === 'release') {
    const badge = `https://img.shields.io/github/v/release/${ORG}/${slug}?style=flat-square&label=release`;
    return `[![${v}](https://img.shields.io/badge/v${encodeURIComponent(v)}-${encodeURIComponent(v)}%20latest-2ea44f?style=flat-square)](https://github.com/${ORG}/${slug}/releases)`;
  }

  // The badge must read the same file the version came from, otherwise it
  // disagrees with the heading (package.json lags behind src/version.ts).
  const file = versionFrom === 'cargo' ? 'Cargo.toml' : 'src/version.ts';
  const label = versionFrom === 'cargo' ? 'version' : 'app%20version';
  const raw = `https%3A%2F%2Fraw.githubusercontent.com%2F${ORG}%2F${slug}%2Fmain%2F${file}`;
  return `![${v}](https://img.shields.io/badge/version-${encodeURIComponent(v)}-8250df?style=flat-square)`;
}

function renderStats(stats) {
  const tracked = REPOS.filter((r) => r.track);
  const sum = (key) => {
    const known = tracked.map((r) => stats[r.slug][key]).filter((v) => typeof v === 'number');
    return known.length ? known.reduce((a, b) => a + b, 0) : null;
  };

  const commits = sum('commits');
  const prs = sum('mergedPRs');
  const releases = sum('releases');
  const issues = sum('closedIssues');
  const repos = REPOS.length;

  return [
    plainBadge('repositories', repos, '24292f', 'github'),
    plainBadge('commits', commits, '24292f'),
    plainBadge('merged PRs', prs, '2ea44f'),
    plainBadge('releases', releases, '2ea44f'),
    plainBadge('closed issues', issues, '24292f'),
    plainBadge('license', 'MIT', '3da639'),
    plainBadge('based in', 'Morocco', 'c1272d'),
    '',
    `<sub>🔄 Auto-refreshed from the GitHub API — last update **${new Date().toISOString().slice(0, 10)}**. No manual edits needed.</sub>`,
  ].join('\n');
}

function renderRepos(stats) {
  const rows = REPOS.map((repo) => {
    const s = stats[repo.slug];
    const bits = [plainBadge(`${fmt(s.commits)} commits`, `${fmt(s.mergedPRs)} PRs`, (s.mergedPRs || 0) > 0 ? '2ea44f' : '9e9e9e')];
    if ((s.releases || 0) > 0) {
      bits.push(plainBadge('releases', fmt(s.releases), '2ea44f'));
    } else if (repo.slug === '.github') {
      bits.push(plainBadge('profile', 'live', '2ea44f'));
    }
    const delivery = bits.join(' ');

    const name =
      repo.slug === '.github'
        ? `[**\\.github**](https://github.com/${ORG}/.github)`
        : `[**${repo.slug}**](https://github.com/${ORG}/${repo.slug})`;

    return `| ${name} | ${repo.what} | ${versionBadge(repo, s)} | ${delivery} |`;
  });

  return [
    '| Repository | What it is | Version | Delivery |',
    '|---|---|---|---|',
    ...rows,
  ].join('\n');
}

function renderProgress(progress, stats) {
  const rows = progress.products.map((p) => {
    const reading = p.repo
      ? p.reading.replace('{{version}}', stats[p.repo]?.version || '—')
      : p.reading;
    return `| **${p.name}** | ${barBadge(p.pct)} **${p.pct} %** | ${reading} |`;
  });

  return ['| Product | Progress | Reading |', '|---|---|---|', ...rows].join('\n');
}

function renderReleases(stats) {
  const rows = REPOS.filter((r) => stats[r.slug].latest).map((repo) => {
    const rel = stats[repo.slug].latest;
    const date = rel.publishedAt ? new Date(rel.publishedAt).toISOString().slice(0, 10) : '—';
    const SKIP = /^(#|bump workspace|\*\*(version|taille|size|sha|t[ée]l[ée]chargement|miroir|assets?|checksums?)|full changelog|what'?s changed)/i;
    const notes = rel.body
      .split('\n')
      .map((l) =>
        l
          .replace(/^[-*]\s*/, '') // bullet
          .replace(/\s+by\s+@[\w-]+\s+in\s+https?:\/\/\S+/gi, '') // "by @user in <PR url>"
          .replace(/\(https?:\/\/\S+\)/g, '') // markdown links
          .replace(/https?:\/\/\S+/g, '') // bare urls
          .replace(/`/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim(),
      )
      .filter((l) => l && !SKIP.test(l))
      .map((l) => (l.length > 110 ? `${l.slice(0, 107)}…` : l));
    const first = notes.slice(0, 2).join(' · ') || '—';
    return `| [**${repo.slug}**](https://github.com/${ORG}/${repo.slug}/releases) | [\`${rel.tag}\`](${rel.url}) | ${date} | ${first} |`;
  });

  return ['| Product | Latest | Published | Highlights |', '|---|---|---|---|', ...rows].join('\n');
}

function renderOpenItems(progress) {
  const rows = (progress.openItems || []).map(
    (o) => `| **${o.item}** | ${barBadge(o.pct)} ${statusCell(o.status)} | ${o.notes} |`,
  );
  return ['| Item | Status | Notes |', '|---|---|---|', ...rows].join('\n');
}

function renderRoadmap(progress) {
  const rows = progress.roadmap.map((r) => {
    const note = r.repo ? ` _(live: \`${statsForRoadmap[r.repo]}\`)_` : '';
    return `| **${r.quarter}** | **${r.milestone}** | ${r.scope}${note} | ${statusCell(r.status)} | ${barBadge(r.pct)} |`;
  });

  return [
    '| Quarter | Milestone | Scope | Status | Progress |',
    '|---|---|---|---|---|',
    ...rows,
  ].join('\n');
}

let statsForRoadmap = {};

/* ------------------------------------------------------------------ blocks -- */

function replaceBlock(source, name, body) {
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(source)) throw new Error(`Marker block "${name}" not found in profile/README.md`);
  return source.replace(re, (_m, open, close) => `${open}\n${body}\n${close}`);
}

function replaceVersions(source, stats) {
  return source.replace(/<!--VER:([\w.-]+)-->[\s\S]*?<!--\/VER-->/g, (_m, slug) => {
    const v = stats[slug]?.version;
    return `<!--VER:${slug}-->${v ? '`' + v + '`' : '—'}<!--/VER-->`;
  });
}

/* -------------------------------------------------------------------- main -- */

const progress = JSON.parse(await readFile(PROGRESS_PATH, 'utf8'));

console.log('Fetching live repository stats…');
const stats = await collect();

statsForRoadmap = Object.fromEntries(
  Object.entries(stats).map(([slug, s]) => [slug, s.version || '—']),
);

let readme = await readFile(README_PATH, 'utf8');
const before = readme;

readme = replaceBlock(readme, 'STATS', renderStats(stats));
readme = replaceBlock(readme, 'REPOS', renderRepos(stats));
readme = replaceBlock(readme, 'RELEASES', renderReleases(stats));
readme = replaceBlock(readme, 'OPEN', renderOpenItems(progress));
readme = replaceBlock(readme, 'PROGRESS', renderProgress(progress, stats));
readme = replaceBlock(readme, 'ROADMAP', renderRoadmap(progress));
readme = replaceVersions(readme, stats);

if (readme === before) {
  console.log('✓ profile/README.md is already up to date');
} else {
  await writeFile(README_PATH, readme);
  console.log('✓ profile/README.md updated');
}
