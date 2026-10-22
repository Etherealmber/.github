<div align="center">

<img src="https://avatars.githubusercontent.com/u/318825377?v=4&s=240" alt="Etherealmber" width="120" height="120" />

# Etherealmber

**One connected system for Moroccan commerce — built at the edge, owned by the business that runs it.**

<sub>Atlas Commerce · Atlas Shop · Atlas Commerce for Android · Support</sub>

<br />

![Location](https://img.shields.io/badge/based%20in-Morocco-c1272d?style=flat-square)
![Edge](https://img.shields.io/badge/runs%20on-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare&logoColor=white)
![Stack](https://img.shields.io/badge/TypeScript-React%20%C2%B7%20Vite%20%C2%B7%20D1%20%C2%B7%20R2-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/2026-Commerce%20%2B%20Android-2ea44f?style=flat-square)
![Status](https://img.shields.io/badge/2027-Complete%20suite-8b5cf6?style=flat-square)

[What we do](#-what-we-do) · [What we're building](#-what-were-building) · [Roadmap](#-roadmap) · [Contact](#-contact)

</div>

---

## 🏛️ Who we are

**Etherealmber** is a software organization based in Morocco, building a single connected platform for the businesses that keep the country running: wholesalers, shops, warehouses, workshops and family companies.

We build **one product family, not a pile of disconnected tools**. Atlas Commerce is the operational core — stock, checkout, invoicing, purchasing, staff. Everything else we ship connects to it: the shop front reads from it, the Android app moves with it, support sits on top of it. Same data, same rules, one place to look.

No opaque SaaS subscriptions, no dedicated servers, no locked-in vendor. Every deployment lives in the client's own Cloudflare account, and the business owns the database, the backups and the code.

---

## 🎯 What we do

| | |
|---|---|
| **Retail & wholesale operations** | Multi-warehouse stock, bin locations, lots and FEFO expiry, audited movements, transfers, inventory counts, kits/BOM |
| **Checkout & cash** | Fast POS with VR receipts, multi-method payments, refunds and cash drawer balance |
| **Invoicing & receivables** | VAT invoices, due dates, credit notes, status pipeline, CSV exports, Partner API and event webhooks |
| **Purchasing & suppliers** | Bills, receipts, supplier references and price breaks |
| **People & money** | Employees, payroll basics, cash balance, expenses, reports |
| **Scan & OCR** | Native barcode scanning, photo-driven product requests, invoice and quote OCR |
| **AI assistance** | An agent that pre-fills client and product sheets — explicit confirmation before anything executes |
| **Security** | Password + OTP, WebAuthn / passkeys, 60-second single-use QR login, role-based access, audit log |
| **Field work** | Offline-first Android app with roles for owner, admin, stock and terrain |

---

## 🚧 What we're building

We are actively building **Atlas Shop** — the online storefront of the family — and connecting it to every project we run.

- 🛍️ **Atlas Shop** — a shop that talks directly to **Atlas Commerce**. It fetches products, prices, stock availability and images from the ERP, so the catalogue you keep in the back office is the catalogue customers see. No second database to keep in sync.
- 🔗 **One connection layer** — the same Partner API and webhook backbone that Atlas Commerce already exposes (scoped keys, idempotent writes, `stock.*` / `doc.*` events) becomes the shared link across the whole suite: Commerce → Shop → Android → Support.
- 📱 **Atlas Commerce for Android** — the field companion maturing into the daily driver: scanning, receipts, transfers, inventory, alerts.
- 🎫 **A support page is coming** — a public entry point for help, requests and status, connected to the same customer records instead of being a separate inbox.
- 🧩 **One complete, enhanced system** — instead of separate products that happen to share a logo, a single platform where a sale in the shop, a movement in the warehouse and a ticket in support all describe the same business.

---

## 🗺️ Roadmap

| Target | Milestone |
|---|---|
| **End of 2026** | ✅ **Atlas Commerce** finished — the ERP / POS / invoicing core, production-ready |
| **End of 2026** | ✅ **Atlas Commerce for Android** finished — the field app shipped and stable |
| **During 2027** | 🛍️ **Atlas Shop** connected to Atlas Commerce — live catalogue, stock and prices read from the ERP |
| **During 2027** | 🎫 **Support page** launched, wired to the same customer and order data |
| **Before the end of 2027** | 🚀 **The complete, enhanced system** — every project unified into one platform |

Dates are targets, not promises — but they are the dates the work is being planned around.

---

## 📦 The product family

### [Atlas Commerce](https://github.com/Etherealmber/atlas-commerce) — the core

ERP / caisse / facturation for Moroccan commerce: multi-warehouse stock, fast checkout with VR receipts, VAT invoicing with receivables and refunds, purchasing, employees and payroll, cash balance.

`Cloudflare Workers` · `Hono` · `D1` · `R2` · `React + Vite` · `Capacitor` · MIT · v1.4.5-beta

### Atlas Shop — the storefront *(in progress)*

The customer-facing side, reading live data from Atlas Commerce: products, stock, prices, media. Built to sell without creating a second source of truth.

### Atlas Commerce for Android — the field app *(target: end of 2026)*

Offline-first shell with role-aware actions: scan, receive, transfer, count, invoice lookup, alert inbox — designed for a phone in a warehouse, not a desk.

### Support — the front door *(coming)*

Help, requests and status for every business running the suite, connected to the same records as the rest of the platform.

---

## 🧭 How we build

```text
one system        products share data, not just branding
edge-first        Cloudflare Workers · D1 · R2 · Durable Objects
no lock-in        the client owns the account, the data and the deploy
browser-first     heavy work (canvas, WebGPU, OCR) runs on the device
private by default secrets in Wrangler, never in the repo
French terrain    UI written for the field, in the language of the field
```

- 🔒 **Ownership over convenience** — the business owns the database, the backups and the code.
- ⚡ **Fast where it hurts** — one scan, one keypress, one ticket. No wizard that gets in the way.
- 🧩 **Boring infrastructure** — one Worker, one SQLite database, one bucket. Fewer moving parts to break.
- 🇲🇦 **Local reality first** — ICE/IF, VAT, VR receipts, French labels, phone-first usage.

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
- 🔐 **Security** — report privately through a GitHub security advisory; please don't disclose publicly before a fix
- 🤝 **Work with us** — demos and deployments: reach us through GitHub
- 🌍 **Based in** Morocco · working across the country

<div align="center">

<br />

**Thank you for the support.** Every issue, report and piece of feedback is what turns this into a complete system by 2027. 🙏

**Built in Morocco, deployed on the edge.** 🇲🇦

<sub>MIT © 2026 Etherealmber</sub>

</div>
