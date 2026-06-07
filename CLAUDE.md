# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TSN Lastra a Signa — website and booking system for a shooting sports club. The project has three sub-packages:

| Directory | Role |
|-----------|------|
| `frontend/` | React/Vite SPA deployed on Netlify |
| `tsnlas-worker/` | Primary Cloudflare Worker (Hono API, auth, bookings, admin) |
| `reservation-worker/` | Secondary Cloudflare Worker (experimental reservation flow, shares same D1 DB) |

## Commands

### Frontend (`frontend/`)
```bash
npm run dev        # Vite dev server on :5174
npm run build      # Production build
npm run lint       # ESLint
```

### tsnlas-worker (`tsnlas-worker/`)
```bash
npm run dev        # wrangler dev on :8787
npm run deploy     # Deploy to Cloudflare
npm test           # vitest (runs inside Workers runtime via @cloudflare/vitest-pool-workers)
```

### reservation-worker (`reservation-worker/`)
```bash
npm run dev        # wrangler dev
npm run deploy     # Deploy to Cloudflare
```

### DB Migrations (run from `tsnlas-worker/`)
```bash
wrangler d1 execute tsnlas-db --file=./migrations/<filename>.sql
```
Migrations are numbered `0001`–`0013`. Run them in order on a fresh DB.

## Architecture

### Frontend
- **React 18** + **React Router v7** + **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- All pages are lazy-loaded via `React.lazy` in `App.tsx`
- `AuthProvider` (`src/context/auth-context.tsx`) holds the authenticated user state and JWT token globally; all service calls include the `Authorization: Bearer <token>` header
- Auth flow: email-based magic link OR Google OAuth; session stored in `sessionStorage`
- CORS-allowed origins: `localhost:5174`, `tsnlas.netlify.app`, `tsnlastrasigna.it`
- `VITE_API_URL` env var points to the worker (default `http://localhost:8787`)

### tsnlas-worker (Hono)
Entry point: `src/index.ts` — a single Hono app that defines all routes inline plus mounts `turni-router`.

**Bindings:**
- `DB` — Cloudflare D1 (SQLite): `bookings`, `users`, `contents`, `turni` tables
- `KV_BOOKING` — booking availability cache
- `KV_USER` — auth state cache (OAuth state, verification tokens)
- Secrets: `JWT_SECRET`, `EMAIL_SECRET`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`

**Route groups:**
- `POST /booking`, `GET/PUT/DELETE /booking/:id` — public booking CRUD with Cloudflare Turnstile verification and honey-pot spam protection
- `POST /auth/register|login|verify-email|verify-token`, `GET /auth/verify|google/login|google/callback` — authentication (magic link + Google OAuth)
- `GET/PUT /me/bookings`, `/me/profile`, `/user/settings` — authenticated user endpoints
- `GET/POST/PUT/DELETE /admin/*` — admin-only endpoints, guarded by the `isAdmin` middleware (checks `ROLE_ADMIN` in JWT payload)
- `GET /turni/*` — shift management, delegated to `src/routes/turni-router.ts`
- `GET /contents`, `POST/PUT/DELETE /contents/:id` — CMS for news/events

**Auth middleware pattern:** `isAuthenticated` and `isAdmin` are plain async functions passed as Hono middleware. They call `verifyJWT` → `getUserById` → role check, then set `c.set('user', user)` for downstream handlers.

**Email:** Sent via `Resend` SDK (transactional only). Templates are inline HTML in `src/services/email-service.ts`. Preview HTMLs live at the repo root.

**iCal:** `GET /calendar/ical` generates `.ics` from D1 bookings via `ical-generator`.

### User roles
`ROLE_USER` (default), `ROLE_ADMIN`, `ROLE_DIRECTOR`. Stored as a JSON-serialised array in the `users` table `roles` column.

### Turni (shifts)
Managed by `turni-router.ts` + `turni-service.ts`. Stored in the `turni` D1 table (migration `0013`). Directors (`ROLE_DIRECTOR`) can manage shifts; regular users can view theirs at `/account/turni`.
