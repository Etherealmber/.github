<div align="center">

<img src="https://avatars.githubusercontent.com/u/318825377?v=4&s=240" alt="Etherealmber" width="120" height="120" />

# Etherealmber

**Software that runs real businesses — at the edge, without the SaaS tax.**

<sub>ERP / POS for Moroccan merchants · client platforms · small sharp tools</sub>

<br />

![Location](https://img.shields.io/badge/based%20in-Morocco-c1272d?style=flat-square)
![Edge](https://img.shields.io/badge/runs%20on-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare&logoColor=white)
![Stack](https://img.shields.io/badge/TypeScript-React%20%C2%B7%20Vite%20%C2%B7%20D1%20%C2%B7%20R2-3178c6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-3da639?style=flat-square)

[Projects](#-projects) · [How we build](#-how-we-build) · [Contact](#-contact)

</div>

---

## 🏛️ Who we are

**Etherealmber** is a small software organization based in El Jadida, Morocco, building tools for the businesses that keep the country running: wholesalers, shops, warehouses, workshops and family companies.

The work is done through **loxdpy** — the studio behind the org, maintained by **[Haytam · @loxdpsy](https://github.com/loxdpsy)**.

We don't sell subscriptions to a black box. Everything here is **self-hosted, edge-deployed and owned by the business that uses it** — the data sits in the client's own Cloudflare account, the invoices belong to the client, and the code stays small enough to audit.

> Interface et documentation en **français** pour le terrain marocain · UI and docs in French for the Moroccan field, code and APIs in English.

---

## 🚀 Projects

### 🧾 [Atlas Commerce](https://github.com/Etherealmber/atlas-commerce)

**ERP / caisse / facturation souverain pour commerces & grossistes au Maroc.** A complete back-office for Moroccan retail and wholesale: multi-warehouse stock, a fast checkout, VAT invoicing, purchasing, payroll and cash balance — with **no SaaS subscription and no dedicated server**.

| | |
|---|---|
| **Stock** | multi-warehouse, bin locations, lots + FEFO expiry, audited movements, transfers, kits/BOM |
| **Checkout** | VR receipts without VAT, multi-method payments, refunds, cash drawer |
| **Invoicing** | VAT invoices, receivables & due dates, credit notes, CSV export, status pipeline |
| **Scan & OCR** | native barcode scanning, photo-based product requests, invoice/quote OCR |
| **Atlas Agent** | AI that pre-fills a client/product sheet, with explicit confirmation before anything runs |
| **Auth** | password + OTP, WebAuthn / passkeys, 60-second single-use QR login (phone ↔ desktop) |
| **Field app** | offline-first Capacitor Android shell, roles (owner / admin / stock / terrain), OTA updates |

`Cloudflare Workers` · `Hono` · `D1` · `R2` · `React + Vite + TypeScript` · `Capacitor` · MIT · v1.4.5-beta

Also ships a **Partner API v1** (scoped keys, idempotent invoice writes, OpenAPI), **event webhooks** (`stock.*`, `doc.*`, `kit.assembled`, `atlas.alert`) and print-ready **product labels** (QR + CODE128 + price).

---

### 🪨 [afmarbre-main](https://github.com/loxdpsy/afmarbre-main)

The web platform for **A-F Marbre**, a marble and natural-stone studio: public catalogue of slabs and materials, project/atelier pages, services, contact, and a quote-request flow — plus a private **CMS admin** (`/admin`) for products, categories, quotes, media and page content.

- Runs entirely on a **Cloudflare Worker** — KV (CMS content), **D1** (products, quotes), **R2** (media). No runtime dependency on the site builder it started from.
- French-first UI, marble/stone art direction, responsive desktop + mobile.
- Quote submissions handled server-side with validation.

`TanStack Start` · `React` · `TypeScript` · `Tailwind` · `Workers` · `KV` · `D1` · `R2`

---

### 🛠️ [support-page](https://github.com/loxdpsy/support-page)

The support portal at **[support.afmarbre.com](https://support.afmarbre.com/)** — a dedicated Cloudflare Worker on a custom domain, with the main WordPress site left untouched on `afmarbre.com`.

- Support request workflow with **unique reference numbers**, FAQ, contact and showroom details.
- **Cloudflare Turnstile**, validation, honeypot, and email delivery with the customer address as `Reply-To`.
- Light / dark / system theme shared across `*.afmarbre.com` through a first-party `afmarbre_theme` cookie.
- `/health` endpoint for uptime checks.

`Cloudflare Workers` · `Cloudflare Email` · `Turnstile` · vanilla JS

---

### 📐 [archi-convert](https://github.com/loxdpsy/archi-convert)

**Universal Converter** — a zero-install toolbox for architecture and site work, all in the browser.

- **Unit conversion** for lengths, surfaces, volumes and weights.
- **Material estimator** — quantities for slabs, tiles, plaster, concrete and similar site materials.
- **Calculator** for quick on-site arithmetic, plus a **weather** tab for planning pours and deliveries.
- Plain HTML/CSS/JS, no build step, no backend, light/dark themes.

`HTML` · `CSS` · `Vanilla JavaScript`

---

### 🧰 [toolkit](https://github.com/loxdpsy/toolkit)

A file toolkit that runs in the browser, with a thin Worker only where a backend is unavoidable.

- **Format converter** — fully client-side (canvas), no upload.
- **Background remover** — on-device via **WebGPU** when available, automatic fallback, no API key.
- **Image → text (OCR)** — reads real notation, returns LaTeX for formulas.
- **PDF → Word** — same OCR pipeline, Markdown converted to a genuine `.docx` in the browser.
- Backed by a **Worker + D1** (accounts, sessions, conversations, attachments) with the API key kept as a server secret — never exposed to visitors.

`TypeScript` · `Vite` · `Workers` · `D1` · `Mistral OCR` · `WebGPU`

---

### 🤖 A-F Marbre assistant

A **Mistral-powered assistant** at `chat.afmarbre.com`, running on the same Workers + D1 pattern as `toolkit`: private API key held by the Worker, per-client conversations, login and settings. Kept out of the public repos so client keys and data stay private.

---

## 🧭 How we build

```text
edge-first        Cloudflare Workers · D1 · R2 · Durable Objects
no lock-in        client owns the account, the data and the deploy
browser-first     heavy work (canvas, WebGPU, OCR) runs on the device
private by default secrets in Wrangler, never in the repo
French terrain    UI written for the field, in the language of the field
small surface     monolith peeled into routes / repositories / services
```

- 🔒 **Ownership over convenience** — the business owns the database, the backups and the code.
- ⚡ **Fast where it hurts** — one scan, one keypress, one ticket. No wizard that gets in the way.
- 🧩 **Boring infrastructure** — one Worker, one SQLite database, one bucket. Fewer moving parts to break.
- 🇲🇦 **Local reality first** — ICE/IF, VAT, VR receipts, French labels, phone-first usage.
- 📖 **Working in the open** — MIT where we can, READMEs that actually explain the system.

---

## 🛠️ Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
![Vite](https://img.shields.io/badge/Vite-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Workers-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![SQLite](https://img.shields.io/badge/D1%20%2F%20SQLite-003b57?style=for-the-badge&logo=sqlite&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119eff?style=for-the-badge&logo=capacitor&logoColor=white)

---

## 📬 Contact

- 🐛 **Bugs & features** — [open an issue](https://github.com/Etherealmber/atlas-commerce/issues/new)
- 🔐 **Security** — report privately (GitHub security advisory or a direct message to [@loxdpsy](https://github.com/loxdpsy)); please don't disclose publicly before a fix
- 🤝 **Work with us** — demos and deployments: reach the studio on GitHub
- 🌍 **Based in** El Jadida, Morocco · working across the country

<div align="center">

<br />

**Built in Morocco, deployed on the edge.** 🇲🇦

<sub>Etherealmber · studio <a href="https://github.com/loxdpsy">loxdpy</a> · MIT © 2026</sub>

</div>
