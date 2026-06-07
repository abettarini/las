# Vercel Migration — Fase 1: Infrastruttura

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare l'infrastruttura base del progetto Vercel: workspace npm, schema Prisma su Neon, `vercel.json`, boilerplate API Hono con health check — deploy preview funzionante end-to-end.

**Architecture:** Root workspace npm con due package (`frontend/`, `api/`). Il package `api/` contiene una Hono app esposta tramite l'adapter `hono/vercel` come singola Vercel Function su Node.js runtime. Il database è Neon Postgres gestito da Prisma. Il frontend resta invariato su Vite.

**Tech Stack:** Hono 4.x + `hono/vercel`, Prisma 6.x + `@prisma/client`, Neon Postgres, Vercel CLI, Node.js 20

---

## File Structure

| File | Ruolo |
|------|-------|
| `package.json` (root) | Workspace npm — dichiara `frontend/` e `api/` come workspaces |
| `vercel.json` | Build command, output dir, rewrite rules `/api/*` → function e `/*` → SPA |
| `api/package.json` | Dipendenze API: hono, prisma, jose, resend, ical-generator |
| `api/tsconfig.json` | TypeScript per Node.js 20, `moduleResolution: bundler` |
| `api/index.ts` | Entry point Vercel Function — `export default handle(app)` |
| `api/app.ts` | Hono app: CORS, mount routes, `GET /api/` health check |
| `api/lib/prisma.ts` | Singleton `PrismaClient` (pattern standard per serverless) |
| `prisma/schema.prisma` | Schema completo: User, Booking, Content, Turno, OAuthState |
| `.env` (root, gitignored) | `DATABASE_URL` locale per `prisma migrate dev` |

---

## Task 1: Branch e root workspace

**Files:**
- Create: `package.json` (root)

- [ ] **Step 1: Crea il branch feature**

```bash
git checkout -b feature/vercel
```

- [ ] **Step 2: Crea il root `package.json`**

Crea `/Users/andrea/Projects/Personal/TsnLas/package.json`:

```json
{
  "name": "tsnlas",
  "version": "0.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "api"
  ]
}
```

- [ ] **Step 3: Verifica che `frontend/` sia già un package npm valido**

```bash
cat frontend/package.json | grep '"name"'
```

Expected output: `"name": "poligono-lastra"` (o simile — conferma che il campo esiste).

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "feat: root npm workspace (frontend + api)"
```

---

## Task 2: Struttura `api/` e dipendenze

**Files:**
- Create: `api/package.json`
- Create: `api/tsconfig.json`

- [ ] **Step 1: Crea la directory `api/`**

```bash
mkdir -p api
```

- [ ] **Step 2: Crea `api/package.json`**

```json
{
  "name": "tsnlas-api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vercel dev",
    "build": "tsc --noEmit"
  },
  "dependencies": {
    "@hono/node-server": "^1.13.7",
    "@prisma/client": "^6.0.0",
    "hono": "^4.7.5",
    "ical-generator": "^8.1.1",
    "jose": "^5.2.3",
    "resend": "^4.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "prisma": "^6.0.0",
    "typescript": "^5.5.2"
  }
}
```

- [ ] **Step 3: Crea `api/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Installa le dipendenze**

```bash
cd api && npm install
```

- [ ] **Step 5: Commit**

```bash
git add api/package.json api/tsconfig.json api/package-lock.json
git commit -m "feat: api package setup con Hono + Prisma + Jose"
```

---

## Task 3: Schema Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env` (root, gitignored)

- [ ] **Step 1: Inizializza Prisma dalla root**

```bash
cd /Users/andrea/Projects/Personal/TsnLas
npx prisma init --datasource-provider postgresql
```

Questo crea `prisma/schema.prisma` e `.env` nella root.

- [ ] **Step 2: Aggiungi `.env` al `.gitignore`**

Se `.gitignore` non esiste nella root, crealo. Aggiungi:

```
.env
.env.local
node_modules/
```

- [ ] **Step 3: Sostituisci `prisma/schema.prisma` con lo schema completo**

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

- [ ] **Step 4: Crea account Neon e ottieni la connection string**

1. Vai su [neon.tech](https://neon.tech) → crea account
2. Crea progetto: nome `tsnlas-db`, region `eu-west-1` (Frankfurt)
3. Dal dashboard copia la connection string formato:
   ```
   postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require
   ```

- [ ] **Step 5: Configura `.env`**

Apri `.env` (creato da `prisma init`) e imposta:

```
DATABASE_URL="postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require"
```

- [ ] **Step 6: Esegui la prima migrazione**

```bash
npx prisma migrate dev --name initial-schema
```

Expected output:
```
✔ Generated Prisma Client
✔ Applied migration `20260607000000_initial_schema`
```

- [ ] **Step 7: Verifica le tabelle su Neon**

```bash
npx prisma studio
```

Si apre il browser. Verifica che esistano le tabelle: `User`, `Booking`, `Content`, `Turno`, `OAuthState`. Chiudi il browser e interrompi Prisma Studio con `Ctrl+C`.

- [ ] **Step 8: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: schema Prisma completo con migrazione iniziale"
```

> **Non committare `.env`** — contiene la connection string.

---

## Task 4: Singleton PrismaClient

**Files:**
- Create: `api/lib/prisma.ts`

- [ ] **Step 1: Crea `api/lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

Il pattern `globalThis` evita di aprire N connessioni durante i hot-reload in dev (problema classico con serverless + Prisma).

- [ ] **Step 2: Verifica che TypeScript compili senza errori**

```bash
cd api && npx tsc --noEmit
```

Expected: nessun output (zero errori).

- [ ] **Step 3: Commit**

```bash
git add api/lib/prisma.ts
git commit -m "feat: singleton PrismaClient per serverless"
```

---

## Task 5: Hono app e health check

**Files:**
- Create: `api/app.ts`
- Create: `api/index.ts`

- [ ] **Step 1: Crea `api/app.ts`**

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono().basePath('/api')

app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5174',
      'https://tsnlas.netlify.app',
      'https://tsnlastrasigna.it',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.get('/', (c) => c.json({ status: 'ok', service: 'tsnlas-api' }))

export default app
```

- [ ] **Step 2: Crea `api/index.ts`**

```typescript
import { handle } from 'hono/vercel'
import app from './app'

export const config = { runtime: 'nodejs' }
export default handle(app)
```

- [ ] **Step 3: Verifica TypeScript**

```bash
cd api && npx tsc --noEmit
```

Expected: nessun output.

- [ ] **Step 4: Commit**

```bash
git add api/app.ts api/index.ts
git commit -m "feat: Hono app con health check GET /api/"
```

---

## Task 6: `vercel.json` e collegamento Vercel

**Files:**
- Create: `vercel.json` (root)

- [ ] **Step 1: Crea `vercel.json`**

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

- [ ] **Step 2: Installa Vercel CLI globalmente (se non presente)**

```bash
npm i -g vercel
vercel --version
```

Expected: `Vercel CLI X.Y.Z`

- [ ] **Step 3: Collega il repo a Vercel**

```bash
vercel link
```

Segui il wizard:
- Seleziona il tuo account
- Progetto: crea nuovo → nome `tsnlas`
- Root directory: `.` (root del repo)

- [ ] **Step 4: Configura `DATABASE_URL` su Vercel (preview)**

```bash
vercel env add DATABASE_URL preview
```

Incolla la stessa connection string Neon usata nel `.env` locale.

- [ ] **Step 5: Commit**

```bash
git add vercel.json
git commit -m "feat: vercel.json con rewrite SPA + API"
```

---

## Task 7: Verifica deploy preview end-to-end

- [ ] **Step 1: Esegui il deploy preview**

```bash
vercel deploy
```

Expected: URL tipo `https://tsnlas-abc123.vercel.app`

- [ ] **Step 2: Verifica health check API**

```bash
curl https://tsnlas-abc123.vercel.app/api/
```

Expected:
```json
{"status":"ok","service":"tsnlas-api"}
```

- [ ] **Step 3: Verifica che il frontend si carichi**

Apri `https://tsnlas-abc123.vercel.app` nel browser. Deve caricare la SPA React (la homepage del sito). Controlla che non ci siano errori nella console del browser relativi al bundle JS.

- [ ] **Step 4: Verifica connessione DB nella Function**

Aggiungi temporaneamente un endpoint di diagnostica in `api/app.ts`:

```typescript
import { prisma } from './lib/prisma'

app.get('/healthz', async (c) => {
  const count = await prisma.user.count()
  return c.json({ status: 'ok', userCount: count })
})
```

Redeploy:
```bash
vercel deploy
```

Testa:
```bash
curl https://tsnlas-abc123.vercel.app/api/healthz
```

Expected: `{"status":"ok","userCount":0}`

- [ ] **Step 5: Rimuovi l'endpoint di diagnostica**

Rimuovi il blocco `app.get('/healthz', ...)` e l'import `prisma` da `api/app.ts` (verranno aggiunti correttamente nelle fasi successive).

- [ ] **Step 6: Commit finale Fase 1**

```bash
git add api/app.ts
git commit -m "chore: rimuovi endpoint diagnostica temporaneo"
```

---

## Self-Review

**Spec coverage:**
- ✅ Branch `feature/vercel` — Task 1
- ✅ Root `package.json` con workspace npm — Task 1, 2
- ✅ Creazione account Neon + database — Task 3
- ✅ Schema Prisma completo + `prisma migrate dev` — Task 3
- ✅ `vercel.json` + collegamento repo a Vercel — Task 6
- ✅ `api/` boilerplate: Hono + `hono/vercel` adapter + `GET /api/` health check — Task 4, 5
- ✅ Verifica deploy preview end-to-end (frontend statico + API health) — Task 7

**Prerequisiti non coperti dal piano (manuali):**
- Account Vercel: deve esistere prima del Task 6
- Account Neon: creato durante il Task 3 (step 4, manuale)
- `git` inizializzato: il repo esiste già

**Nessun placeholder rilevato.** Ogni step ha codice completo o comandi esatti.
