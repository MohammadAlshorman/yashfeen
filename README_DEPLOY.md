# Yashfeen — Deployment Guide

Production-ready build of the Yashfeen bilingual (Arabic/English) health &
wellness platform with a MySQL-backed CMS.

**Stack:** Node.js 20 · React 19 + Vite · Hono + tRPC · Drizzle ORM · MySQL

---

## 1. What is in this package

| Path | Purpose |
| --- | --- |
| `package.json` / `package-lock.json` | Dependencies & scripts (at ZIP root, as required) |
| `src/`, `index.html`, `vite.config.ts` | Frontend source (React, Tailwind, RTL Arabic support) |
| `api/`, `contracts/`, `db/` | Backend source (Hono + tRPC API, CMS, auth, DB schema/seed) |
| `db/migrations/` | SQL migrations applied by `npm run db:setup` |
| `dist/` | **Pre-built production bundle** (`dist/boot.js` server + `dist/public/` frontend) |
| `.env.example` | Environment template — copy to `.env` and fill in |
| `README_DEPLOY.md` | This file |

> The pre-built `dist/` means the site can start immediately. Rebuilding
> on the server (`npm run build`) is optional but recommended after any
> source change.

## 2. Requirements

- **Node.js 20.x** (select it in your hosting panel)
- **MySQL 8** database (MariaDB 10.6+ also works)
- Any Node-capable shared hosting: **Hostinger Web Apps / VPS**, **Namecheap cPanel “Setup Node.js App”**, or similar

## 3. Environment variables

Copy `.env.example` to `.env` (or create the variables in your panel) and set:

| Variable | Example | Notes |
| --- | --- | --- |
| `NODE_ENV` | `production` | Required for production mode |
| `PORT` | `3000` | The app always honours `process.env.PORT` and listens on `0.0.0.0` |
| `DATABASE_URL` | `mysql://user:pass@localhost:3306/yashfeen` | From your hosting MySQL panel |
| `ADMIN_EMAIL` | `you@example.com` | CMS login — **never hard-coded** |
| `ADMIN_PASSWORD` | *strong unique password* | CMS login — **never hard-coded**. Wrap in double quotes if it contains `#` or spaces |
| `SESSION_SECRET` | output of `openssl rand -hex 32` | Signs the HTTP-only session cookie |

## 4. Deploy on Hostinger (Web Apps / Node.js hosting)

1. **Create the MySQL database** — hPanel → *Databases → MySQL Databases* →
   create database + user, note the credentials.
2. **Upload the files** — hPanel → *Files → File Manager* → upload and extract
   `Yashfeen_Production_Ready_Deploy.zip` into your app directory
   (e.g. `public_html` or the app root Hostinger assigns).
3. **Create the Node.js app** — hPanel → *Advanced → Node.js* →
   - Node.js version: **20.x**
   - Application mode: **Production**
   - Application root: the folder you extracted to
   - **Startup file: `dist/boot.js`**
4. **Set environment variables** in the same Node.js screen
   (`DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_ENV=production`).
5. **Install dependencies** — open the terminal (or SSH) in the app root:
   ```bash
   npm install
   ```
6. **Initialize the database** (safe to re-run — it never duplicates data):
   ```bash
   npm run db:setup
   ```
7. *(Optional but recommended)* rebuild fresh assets:
   ```bash
   npm run check && npm run build
   ```
8. **Start / restart** the app from the Node.js panel.
9. Verify: open `https://your-domain/api/health` →
   `{"ok":true,"db":true,...}` means the app **and** the database are live.

## 5. Deploy on Namecheap cPanel (“Setup Node.js App”)

1. **MySQL** — cPanel → *MySQL® Databases* → create database + user, add the
   user to the database (ALL PRIVILEGES).
2. **Upload** — *File Manager* → upload + extract the ZIP into
   e.g. `/home/USER/yashfeen` (outside `public_html` is fine).
3. **Setup Node.js App** → *Create Application*:
   - Node.js version: **20**
   - Application mode: **Production**
   - Application root: `/home/USER/yashfeen`
   - Application URL: your domain / subdomain
   - **Application startup file: `dist/boot.js`**
4. Add the **environment variables** from §3 in the same screen.
5. Run `npm install` from the app’s terminal button (or SSH), then
   `npm run db:setup`, then **Restart** the app.
6. Verify `https://your-domain/api/health`.

## 6. Custom domain

Point your domain’s DNS to the hosting server (A record) or assign the
domain/subdomain to the Node.js app in the panel. Once HTTPS is active the
session cookie is automatically marked `Secure` (detection works behind the
host’s proxy via `x-forwarded-proto`).

## 7. Using the CMS

1. Go to **`/admin`** — you are redirected to `/login`.
2. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you configured.
   - First login creates the admin account in the `users` table automatically.
   - Sessions use a signed, **HTTP-only** cookie (7-day expiry).
3. Manage all content: **Articles, Doctors, Pharmacies, Services, Events,
   Episodes, Stories** — create (lands as *draft*), edit, **publish /
   unpublish**, delete. Published items appear on the public site instantly,
   in both English and Arabic (RTL).
4. The public website needs **no login**; only `/admin` and the CMS API
   mutations are protected.

## 8. Database scripts

| Command | What it does |
| --- | --- |
| `npm run db:setup` | **Idempotent** setup: applies `db/migrations/*` then seeds the 30 sample entries only if they are missing. Safe to re-run on every deploy. |
| `npm run db:migrate` | Applies pending SQL migrations only |
| `npm run db:seed` | Seeds sample content only (skips tables that already have sample rows) |
| `npm run db:generate` | Generates a new migration after editing `db/schema.ts` |
| `npm run db:push` | Pushes schema changes directly (development convenience) |

> The server **never** runs destructive database operations on start or
> restart. Schema/data changes only happen when you run these scripts.

## 9. Useful checks

| Command | Purpose |
| --- | --- |
| `npm run check` | TypeScript type-check (frontend + backend) |
| `npm run build` | Builds `dist/public` (Vite) + `dist/boot.js` (esbuild) |
| `npm start` | Runs the production server (`NODE_ENV=production node dist/boot.js`) |
| `GET /api/health` | JSON status incl. live DB connectivity |

## 10. Security notes

- Admin credentials exist **only** as environment variables — nothing is
  hard-coded or committed.
- `.env` is excluded from this package; only `.env.example` (placeholders)
  is shipped.
- The session cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` on HTTPS.
- All CMS mutations require the admin role, verified server-side per request.
