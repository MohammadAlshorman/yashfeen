# Yashfeen — Health & Wellness, Jordan

A bilingual (Arabic RTL / English) health & wellness platform with a
MySQL-backed CMS.

**Stack:** Node.js 20 · React 19 + TypeScript · Vite · Tailwind CSS ·
Hono + tRPC · Drizzle ORM · MySQL

## Quick start (production)

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET
npm run db:setup       # idempotent: creates tables + seeds sample content
npm start              # serves API + frontend from dist/boot.js
```

Then open `http://localhost:3000` — the CMS lives at `/admin`.

## Development

```bash
npm run dev            # Vite dev server (API proxied through Hono)
npm run check          # TypeScript type-check
npm run build          # build dist/public (frontend) + dist/boot.js (server)
```

## Deployment

See **README_DEPLOY.md** for Hostinger / Namecheap cPanel step-by-step
instructions, environment variables, database initialization, custom
domains, and CMS usage.
