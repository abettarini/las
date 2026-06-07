# TSN Lastra a Signa — Migrazione Cloudflare Workers → Vercel

**Data:** 2026-06-06  
**Branch:** `feature/vercel`  
**Stato:** Approvato — pronto per implementazione

---

## Contesto

L'applicazione è attualmente composta da:
- **Frontend**: React/Vite SPA su Netlify
- **`tsnlas-worker`**: API Hono su Cloudflare Workers con D1 (SQLite) + KV
- **`reservation-worker`**: worker sperimentale secondario — escluso dalla migrazione

L'obiettivo è eliminare i Cloudflare Workers e portare tutta la logica server-side su Vercel, usando Postgres (Neon) + Prisma al posto di D1/KV.

---

## Decisioni architetturali

| Aspetto | Scelta | Motivazione |
|---|---|---|
| Struttura progetto | Vite SPA + `/api` Vercel Functions nello stesso repo | Minimo refactoring frontend, un solo deploy |
| Database | Neon Postgres + Prisma | Serverless Postgres, Prisma standard, free tier sufficiente |
| KV replacement | Postgres puro (tabella `OAuthState`) | Volume basso, elimina dipendenza da Redis; facile upgrade futuro |
| Framework API | Hono su Vercel (Node.js runtime) | Codice esistente quasi invariato, adapter ufficiale `hono/vercel` |
| `reservation-worker` | Escluso | Sperimentale, non in produzione |
| Email | Resend — invariato | Funziona identico su qualsiasi runtime |
| Turnstile | Invariato | Servizio HTTP esterno, indipendente da CF Workers |
| iCal | `ical-generator` — invariato | Libreria Node.js standard |
| JWT | `jose` — invariato | Già dipendenza, non usa API CF-specifiche |

---

## Struttura repository

```
TsnLas/
├── frontend/               # Vite SPA — invariata
│   ├── src/
│   ├── .env                # VITE_API_URL=http://localhost:3000
│   └── package.json
├── api/                    # Nuovo — sostituisce tsnlas-worker/
│   ├── index.ts            # Vercel Function entry point
│   ├── app.ts              # Hono app (CORS, mount routes)
│   ├── data/
│   │   └── calendars.json  # Spostato da tsnlas-worker/src/data/ — config maxBookings per eventType
│   ├── routes/
│   │   └── turni-router.ts
│   └── services/
│       ├── availability-service.ts
│       ├── booking-service.ts
│       ├── content-service.ts
│       ├── email-service.ts
│       ├── google-auth-service.ts
│       ├── ical-service.ts
│       ├── jwt-service.ts
│       ├── turni-service.ts
│       └── user-service.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json            # Root workspace (frontend + api)
├── vercel.json
└── CLAUDE.md
```

---

## Vercel configuration

**`vercel.json`:**
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index" },
    { "source": "/(.*)",     "destination": "/index.html" }
  ]
}
```

**`api/index.ts`:**
```typescript
import { handle } from 'hono/vercel'
import app from './app'

export const config = { runtime: 'nodejs' }
export default handle(app)
```

---

## Schema Prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                         String    @id @default(uuid())
  email                      String    @unique
  birthDate                  String?
  securityQuestion1          String?
  securityAnswer1            String?
  securityQuestion2          String?
  securityAnswer2            String?
  createdAt                  DateTime  @default(now())
  isVerified                 Boolean   @default(false)
  verificationToken          String?
  verificationTokenExpiresAt DateTime?
  lastLogin                  DateTime?
  name                       String?
  picture                    String?
  googleId                   String?   @unique
  facebookId                 String?
  phone                      String?
  portoArmi                  String?
  scadenzaPortoArmi          String?
  isSocio                    Boolean   @default(false)
  numeroTessera              String?
  quotaAnnuale               Boolean   @default(false)
  privacyConsent             Boolean   @default(false)
  roles                      String    @default("ROLE_USER")
  turni                      Turno[]
}

model Booking {
  id           String   @id @default(uuid())
  eventType    String
  name         String
  surname      String
  email        String
  phone        String
  date         String
  time         String
  seasonId     String
  status       String   @default("pending")
  cancelSecret String?
  notes        String?
  adminNotes   String?
  createdAt    DateTime @default(now())
}

model Content {
  id          Int      @id @default(autoincrement())
  type        String
  date        String
  title       String
  abstract    String
  fullContent String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Turno {
  id        String   @id @default(uuid())
  userId    String
  userName  String
  date      String
  timeSlot  String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])

  @@unique([userId, date, timeSlot])
}

model OAuthState {
  state       String   @id
  redirectUri String
  expiresAt   DateTime
}
```

**Note schema:**
- `roles` rimane stringa comma-separated — nessuna rottura su `convertRolesToArray()`
- `date`/`time` in `Booking` rimangono `String` — preserva logica parsing esistente
- `OAuthState` rimpiazza `KV_USER.put('auth:state:${state}', ...)` con TTL di 30 min
- Cleanup stati OAuth scaduti: `DELETE WHERE expiresAt < NOW()` prima di ogni insert
- In `turni-service`, il lookup `KV_USER.get('user:${userId}')` diventa `prisma.user.findUnique()`

---

## Mapping servizi

| Service | Cosa cambia | Cosa rimane identico |
|---|---|---|
| `availability-service` | `env.DB.prepare()` → `prisma.booking.count/findMany()` | Logica overlap, `maxBookings` da `calendars.json` |
| `booking-service` | Tutte le query D1 → Prisma CRUD | `cancelSecret`, `getEventTypeLabel()`, paginazione |
| `user-service` | D1 → Prisma, token in DB invece di KV | Logica JWT, `convertRolesToArray()`, login stats |
| `google-auth-service` | `KV_USER.put/get('auth:state:...')` → `prisma.oAuthState` | URL generation, callback flow |
| `turni-service` | `KV_USER.get('user:...')` → `prisma.user.findUnique()` | Logica turni, filtri data |
| `email-service` | — | Tutto invariato |
| `jwt-service` | — | Tutto invariato |
| `ical-service` | — | Tutto invariato |

---

## Variabili d'ambiente

Sostituiscono i binding Cloudflare Workers:

```
DATABASE_URL           # Neon connection string (include ?sslmode=require)
JWT_SECRET
EMAIL_SECRET
TURNSTILE_SECRET_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
RESEND_FROM_NAME
FRONTEND_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Configurate sia in locale (`.env` nella root) che nel dashboard Vercel (preview + production).

---

## Fasi di migrazione

### Fase 1 — Infrastruttura
- Creazione branch `feature/vercel`
- Root `package.json` con workspace npm (`frontend/`, `api/`)
- Creazione account Neon + database `tsnlas-db`
- Schema Prisma completo + `prisma migrate dev`
- `vercel.json` + collegamento repo a Vercel
- `api/` boilerplate: Hono + `hono/vercel` adapter + `GET /api/` health check
- Verifica deploy preview end-to-end (frontend statico + API health)

### Fase 2 — Auth *(sblocca tutte le fasi successive)*
**Scope:** tutto ciò che riguarda autenticazione e gestione utenti

Endpoint da portare:
- `POST /auth/register`
- `POST /auth/verify-email`
- `POST /auth/login`
- `POST /auth/verify-token`
- `GET  /auth/verify`
- `GET  /auth/google/login`
- `GET  /auth/google/callback`
- `GET  /me/bookings`
- `PUT  /me/profile`
- `PUT  /user/settings`

Servizi: `user-service`, `jwt-service`, `google-auth-service`, `email-service`

Test di accettazione:
1. Registrazione → email verifica → click link → account verificato
2. Login magic link → email con token → click link → sessione attiva
3. Google OAuth → redirect → callback → utente creato/aggiornato → sessione attiva
4. `GET /auth/verify` con token valido → dati utente completi
5. `PUT /me/profile` → aggiornamento persistito

### Fase 3 — Booking system
**Scope:** prenotazioni, disponibilità, iCal

Endpoint da portare:
- `POST /booking`
- `GET  /booking/:id`
- `PUT  /booking/:id`
- `DELETE /booking/:id`
- `POST /booking/:id/verify-secret`
- `POST /booking/check-availability`
- `GET  /bookings` (endpoint pubblico paginato, senza guard auth)
- `GET  /calendar/ical`

Servizi: `booking-service`, `availability-service`, `ical-service`

Test di accettazione:
1. Prenotazione con Turnstile valido → email conferma → `cancelSecret` generato
2. Prenotazione su slot pieno → 409 Conflict
3. Cancellazione con secret valido → email cancellazione
4. `GET /calendar/ical` → file `.ics` valido con le prenotazioni

### Fase 4 — Admin
**Scope:** pannello amministrazione

Endpoint da portare:
- `GET /admin/users` + `GET /admin/users/:id` + `PUT /admin/users/:id` + `PUT /admin/users/:id/roles`
- `GET /admin/bookings` + `GET /admin/bookings/:id` + `PUT /admin/bookings/:id` + `PUT /admin/bookings/:id/status` + `DELETE /admin/bookings/:id`
- `GET /admin/bookings/stats`
- `GET /admin/stats`
- `GET /users/directors`

Test di accettazione:
1. Accesso con `ROLE_USER` → 403
2. Accesso con `ROLE_ADMIN` → lista utenti paginata con filtri
3. Aggiornamento ruoli utente → persistito
4. Statistiche prenotazioni → dati corretti per periodo

### Fase 5 — Turni e Contenuti
**Scope:** sistema turni direttori + CMS news/eventi

Endpoint da portare:
- `GET  /turni` + `POST /turni` + `DELETE /turni/:id` + `GET /turni/user/:userId`
- `GET  /contents` + `GET /contents/:id`
- `POST /contents` + `PUT /contents/:id` + `DELETE /contents/:id` (admin)

Servizi: `turni-service`, `content-service`

Test di accettazione:
1. Direttore crea turno → persistito, lookup nome da `users` table (non KV)
2. Doppia iscrizione stesso slot → errore constraint `@@unique`
3. CRUD contenuti admin → list/create/update/delete funzionanti

### Fase 6 — Frontend update
**Scope:** collegare il frontend alla nuova API Vercel

Modifiche:
- `frontend/.env`: `VITE_API_URL` → URL preview Vercel (poi production)
- `frontend/.env.production`: aggiornato con dominio definitivo
- `api/app.ts`: aggiungere origini Vercel all'allowlist CORS
- Verifica che tutti i `fetch` del frontend usino `VITE_API_URL` (nessun hardcode)

Test di accettazione:
1. Login end-to-end dal frontend connesso alla nuova API
2. Prenotazione completa dal form
3. Admin dashboard funzionante
4. Nessuna chiamata residua verso `workers.dev` o `localhost:8787`

### Fase 7 — Cutover production
**Scope:** messa in produzione e deprecazione CF Workers

Passi:
1. Merge `feature/vercel` → `main`
2. Configurazione variabili d'ambiente production su Vercel dashboard
3. Migrazione dati D1 → Neon (export SQLite → import Postgres) se ci sono dati produttivi
4. Aggiornamento DNS se il dominio `tsnlastrasigna.it` si sposta da Netlify a Vercel
5. Smoke test production: auth, booking, admin, iCal
6. Mettere in pausa (non eliminare) `tsnlas-worker` su Cloudflare per almeno 2 settimane

---

## Strategia di rollback

I CF Workers restano attivi in produzione per tutta la durata dello sviluppo sul branch `feature/vercel`. Il cutover avviene cambiando `VITE_API_URL` nel frontend — sufficiente per tornare indietro in minuti se necessario.

---

## Fuori scope

- Conversione del frontend da Vite a Next.js
- `reservation-worker` (sperimentale, non in produzione)
- Autenticazione Facebook (campo `facebookId` mappato ma flow non implementato — situazione invariata rispetto all'attuale)
- Redis/Upstash (rimandato, Postgres è sufficiente per il volume attuale)
