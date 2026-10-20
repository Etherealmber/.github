<div align="center">

<img src="https://raw.githubusercontent.com/Etherealmber/atlas-commerce/main/public/logo-mark.svg" alt="loxdpy" width="110" height="110" />

# loxdpy · Etherealmber

**Software that runs real businesses — at the edge, without the SaaS tax.**

<sub>ERP / POS for Moroccan merchants · client platforms · small sharp tools</sub>

<br />

![Location](https://img.shields.io/badge/based%20in-Morocco-c1272d?style=flat-square)
![Edge](https://img.shields.io/badge/runs%20on-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare&logoColor=white)
![Stack](https://img.shields.io/badge/TypeScript-React%20%C2%B7%20Vite%20%C2%B7%20D1%20%C2%B7%20R2-3178c6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-3da639?style=flat-square)

[**Atlas Commerce**](https://github.com/Etherealmber/atlas-commerce) · [Projects](#-projects) · [Stack](#-how-we-build) · [Contact](#-contact)

</div>

---

## 👋 Who we are

**loxdpy** is a one-person studio based in El Jadida, Morocco, building software for the kind of businesses that keep the country running: wholesalers, shops, warehouses, workshops and family companies.

We don't sell subscriptions to a black box. Everything here is **self-hosted, edge-deployed and owned by the business that uses it** — the data lives in the client's own Cloudflare account, the invoices belong to the client, and the code is small enough to audit.

> **loxdpy** — GitHub [@loxdpsy](https://github.com/loxdpsy) · Org: **Etherealmber**
> Interface et documentation en **français** pour le terrain marocain · UI/docs in French for the Moroccan field, code and APIs in English.

---

## 🚀 Projects

### [Atlas Commerce](https://github.com/Etherealmber/atlas-commerce) · flagship

> **ERP / Caisse / Facturation souverain pour commerces & grossistes au Maroc**

A complete back-office for Moroccan retail and wholesale: multi-warehouse stock, a fast checkout with VR receipts, VAT invoicing with receivables and refunds, purchasing, quotes, employees & payroll, cash balance — with **no opaque SaaS subscription and no dedicated server**.

| What it does | How |
|---|---|
| **Stock** | multi-warehouse, bin locations, lots + FEFO expiry, audited movements, rolling inventory, transfers, kits/BOM |
| **Checkout** | VR receipts without VAT, multi-method payments, refunds, cash drawer balance |
| **Invoicing** | VAT invoices, receivables & due dates, credit notes, CSV exports, status pipeline + journal |
| **Scan & OCR** | native barcode scanning, photo-driven product requests, invoice/quote OCR |
| **Atlas Agent (AI)** | "create a client named X" opens a pre-filled form — explicit confirmation before anything runs |
| **Auth** | password + OTP, WebAuthn / passkeys, 60-second single-use QR login (phone ↔ desktop) |
| **Field app** | offline-first Capacitor Android shell, roles (owner / admin / stock / terrain), OTA updates |

<sub>`Cloudflare Workers` · `Hono` · `D1 (SQLite)` · `R2` · `React + Vite + TypeScript` · `Capacitor Android` · MIT © 2026 loxdpsy · v1.4.5-beta</sub>

Also shipping a **Partner API v1** (scoped API keys, idempotent invoice writes, OpenAPI), **event webhooks** (`stock.*`, `doc.*`, `kit.assembled`, `atlas.alert`), and print-ready **product labels** (QR + CODE128 + price).

---

### Client & side builds

| Project | What it is | Stack |
|---|---|---|
| [**afmarbre-main**](https://github.com/loxdpsy/afmarbre-main) | Web platform for **A-F Marbre**, a marble & natural-stone studio — catalogue and presentation site | TanStack Start · React · TypeScript · Tailwind |
| [**support-page**](https://github.com/loxdpsy/support-page) | Premium support portal at **support.afmarbre.com** — custom-domain Worker, tickets with unique references, Turnstile + honeypot, email routing, shared light/dark theme across `*.afmarbre.com` | Cloudflare Workers · Cloudflare Email |
| [**archi-convert**](https://github.com/loxdpsy/archi-convert) | Unit converter and **material estimator for architecture work** — quantities and conversions on site | JavaScript · Cloudflare Workers |
| [**toolkit**](https://github.com/loxdpsy/toolkit) | Browser-first file tools: format converter, **background remover (WebGPU)**, image → text OCR, PDF → Word | TypeScript · Vite · Workers · Mistral OCR |

There's also a **Mistral-powered assistant** living on Workers + D1 (`chat.afmarbre.com`) — kept private per client, API keys never exposed to the browser.

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

**Principles**

- 🔒 **Ownership over convenience** — the merchant owns the database, the backups and the code.
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
- 🔐 **Security** — report privately (GitHub security advisory or direct message to [@loxdpsy](https://github.com/loxdpsy)); please don't disclose publicly before a fix
- 🤝 **Work with us** — demos and internal deployments: reach the owner on GitHub
- 🌍 **Based in** El Jadida, Morocco · working across the country

<div align="center">

<br />

**Built in Morocco, deployed on the edge.** 🇲🇦

<sub>MIT © 2026 loxdpsy · <a href="https://github.com/Etherealmber/.github">source of this profile</a></sub>

</div>
