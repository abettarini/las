# Documentazione per la configurazione dell'autenticazione con Google

## Indice
1. [Panoramica](#panoramica)
2. [Prerequisiti](#prerequisiti)
3. [Configurazione Google Cloud Platform](#configurazione-google-cloud-platform)
4. [Configurazione del backend (Cloudflare Worker)](#configurazione-del-backend-cloudflare-worker)
5. [Configurazione del frontend](#configurazione-del-frontend)
6. [Flusso di autenticazione](#flusso-di-autenticazione)
7. [Risoluzione dei problemi](#risoluzione-dei-problemi)
8. [Considerazioni sulla sicurezza](#considerazioni-sulla-sicurezza)
9. [Riferimenti](#riferimenti)

## Panoramica

Questa documentazione descrive come configurare l'autenticazione con Google OAuth 2.0 per l'applicazione TSN Lastra a Signa. L'implementazione utilizza il protocollo OAuth 2.0 per consentire agli utenti di accedere all'applicazione utilizzando il loro account Google, senza la necessità di creare credenziali separate.

L'autenticazione con Google offre diversi vantaggi:
- Esperienza di login semplificata per gli utenti
- Maggiore sicurezza grazie all'autenticazione a due fattori di Google
- Accesso a informazioni verificate come email e profilo utente
- Riduzione del carico di gestione delle password

## Prerequisiti

Prima di iniziare, assicurati di avere:

- Un account Google Cloud Platform (GCP)
- Accesso al progetto Cloudflare Workers
- Accesso al repository del frontend
- Node.js e npm installati localmente per lo sviluppo

## Configurazione Google Cloud Platform

### 1. Creazione di un progetto Google Cloud

1. Vai alla [Console Google Cloud](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona un progetto esistente
3. Prendi nota dell'ID progetto, che sarà necessario in seguito

### 2. Configurazione delle credenziali OAuth

1. Nel menu laterale, vai su "APIs & Services" > "Credentials"
2. Clicca su "Create Credentials" e seleziona "OAuth client ID"
3. Seleziona "Web application" come tipo di applicazione
4. Inserisci un nome per il client OAuth (es. "TSN Lastra a Signa Web App")
5. Configura gli URI di reindirizzamento autorizzati:
   - Per sviluppo: `http://localhost:8787/auth/google/callback`
   - Per produzione: `https://api.tsnlastrasigna.it/auth/google/callback`
6. Clicca su "Create"
7. Annota il "Client ID" e il "Client Secret" generati

### 3. Configurazione delle API Google

1. Nel menu laterale, vai su "APIs & Services" > "Library"
2. Cerca e abilita le seguenti API:
   - Google OAuth 2.0
   - Google People API (per accedere alle informazioni del profilo)

### 4. Configurazione del consenso OAuth

1. Nel menu laterale, vai su "APIs & Services" > "OAuth consent screen"
2. Seleziona il tipo di utente ("External" per tutti gli utenti con un account Google)
3. Compila le informazioni richieste:
   - Nome app: "TSN Lastra a Signa"
   - Email di supporto utente
   - Logo dell'app (opzionale)
   - Domini autorizzati (includi il dominio della tua applicazione)
4. Nella sezione "Scopes", aggiungi i seguenti scope:
   - `openid`
   - `email`
   - `profile`
5. Nella sezione "Test users", aggiungi gli indirizzi email per il test durante lo sviluppo
6. Clicca su "Save and Continue" e completa la configurazione

## Configurazione del backend (Cloudflare Worker)

### 1. Aggiornamento dello schema del database

Crea una nuova migrazione per aggiungere i campi necessari per l'autenticazione Google:

```sql
-- Migration: Add social login columns
-- Description: Adds columns for social login integration (Google, Facebook)

ALTER TABLE users ADD COLUMN name TEXT;
ALTER TABLE users ADD COLUMN picture TEXT;
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN facebook_id TEXT;

-- Make birth_date and security questions optional for social login
ALTER TABLE users ALTER COLUMN birth_date DROP NOT NULL;
ALTER TABLE users ALTER COLUMN security_question1 DROP NOT NULL;
ALTER TABLE users ALTER COLUMN security_answer1 DROP NOT NULL;
ALTER TABLE users ALTER COLUMN security_question2 DROP NOT NULL;
ALTER TABLE users ALTER COLUMN security_answer2 DROP NOT NULL;

-- Add indexes for social IDs
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_facebook_id ON users(facebook_id);
```

### 2. Configurazione delle variabili d'ambiente

Aggiungi le seguenti variabili d'ambiente al file `.dev.vars` per lo sviluppo locale:

```
# Configurazione Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Per l'ambiente di produzione, aggiungi questi segreti tramite la dashboard di Cloudflare Workers o utilizzando Wrangler:

```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

### 3. Aggiornamento del file di configurazione

Assicurati che il file `worker-configuration.d.ts` includa le nuove variabili d'ambiente:

```typescript
declare namespace Cloudflare {
  interface Env {
    // ... altre variabili d'ambiente
    
    // Autenticazione Google
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }
}
```

### 4. Implementazione dei servizi di autenticazione

* Creato il file `jwt-service.ts` nella cartella `src/services` nel progetto backend per la generazione di JWT
* Creato il file `google-auth-service.ts` nella cartella `src/services` nel progetto backend per la gestione dell'autenticazione con Google
* Creato il file `user-service-social.ts` nella cartella `src/services` nel progetto backend per la gestione dell'integrazione sociale
* Aggiornato il file `index.ts` nel progetto backend per includere le rotte relative all'autenticazione con Google

## Configurazione del frontend

* Creato il file `google-auth-service.ts` nella cartella `src/services` nel progetto frontend
* Creato il file `GoogleLoginButton.tsx` nella cartella `src/components` per il pulsante di login Google
* Creato il file `GoogleCallback.tsx` nella cartella `src/pages` per gestire il callback dopo l'autenticazione con Google:
* Aggiornato il file `auth-context.tsx` per utilizzare il nuovo servizio di autenticazione
* Aggiornato il file `LoginPage.tsx` per utilizzare il pulsante di login Google
* Aggiornato il file `App.tsx` per includere la rotta per il callback di Google

## Flusso di autenticazione

Il flusso di autenticazione con Google segue questi passaggi:

1. **Inizializzazione**: L'utente clicca sul pulsante "Accedi con Google" nella pagina di login.

2. **Reindirizzamento a Google**: L'applicazione reindirizza l'utente all'URL di autorizzazione Google, includendo:
   - Client ID
   - URI di reindirizzamento
   - Scope richiesti (`openid`, `email`, `profile`)
   - Parametro `state` per protezione CSRF

3. **Autenticazione Google**: L'utente si autentica con Google e concede le autorizzazioni richieste.

4. **Callback**: Google reindirizza l'utente all'URI di callback specificato, includendo:
   - Codice di autorizzazione
   - Parametro `state` (lo stesso inviato nella richiesta)

5. **Scambio del codice**: Il backend scambia il codice di autorizzazione con i token Google:
   - Access token (per accedere alle API Google)
   - ID token (contiene informazioni sull'utente)
   - Refresh token (per rinnovare l'access token)

6. **Recupero del profilo**: Il backend utilizza l'access token per recuperare le informazioni del profilo utente da Google.

7. **Creazione/aggiornamento utente**: Il backend crea un nuovo utente o aggiorna un utente esistente con le informazioni del profilo.

8. **Generazione JWT**: Il backend genera un JWT (JSON Web Token) per l'utente autenticato.

9. **Risposta al frontend**: Il backend restituisce il JWT e le informazioni dell'utente al frontend.

10. **Salvataggio della sessione**: Il frontend salva il JWT e le informazioni dell'utente nella sessione del browser.

11. **Reindirizzamento**: L'utente viene reindirizzato alla pagina principale dell'applicazione.

## Risoluzione dei problemi

### Problemi comuni e soluzioni

#### 1. Errore "redirect_uri_mismatch"

**Problema**: Google restituisce un errore indicando che l'URI di reindirizzamento non corrisponde a quelli autorizzati.

**Soluzione**:
- Verifica che l'URI di reindirizzamento specificato nella richiesta corrisponda esattamente a uno degli URI autorizzati nella console Google Cloud.
- Assicurati di includere il protocollo (http/https) e la porta (se necessaria).
- Verifica che non ci siano spazi o caratteri speciali nell'URI.

#### 2. Token non valido o scaduto

**Problema**: Il token JWT viene rifiutato dal backend.

**Soluzione**:
- Verifica che il token non sia scaduto (controlla il campo `exp` nel payload).
- Assicurati che il segreto JWT utilizzato per la verifica corrisponda a quello utilizzato per la firma.
- Verifica che il token non sia stato manipolato.

#### 3. Errore CORS

**Problema**: Richieste bloccate a causa di problemi CORS.

**Soluzione**:
- Assicurati che il backend includa gli header CORS appropriati nelle risposte.
- Verifica che l'origine della richiesta sia inclusa negli header `Access-Control-Allow-Origin`.
- Per le richieste preflight (OPTIONS), assicurati che il backend risponda correttamente.

### Strumenti di debug

1. **Console del browser**: Utilizza la console del browser per visualizzare gli errori JavaScript e le richieste di rete.

2. **Cloudflare Workers Logs**: Utilizza i log di Cloudflare Workers per visualizzare gli errori del backend.

3. **Google OAuth Playground**: Utilizza [OAuth Playground](https://developers.google.com/oauthplayground/) per testare il flusso OAuth e verificare i token.

## Considerazioni sulla sicurezza

### 1. Protezione CSRF

L'implementazione utilizza un parametro `state` casuale per proteggere contro attacchi CSRF (Cross-Site Request Forgery). Questo parametro viene generato dal backend, salvato nel KV store e verificato quando Google reindirizza l'utente all'URI di callback.

### 2. Sicurezza dei token

I token JWT e Google sono salvati nella sessione del browser (`sessionStorage`), che è accessibile solo dal dominio che li ha creati. Questo protegge i token da accessi non autorizzati da altri domini.

### 3. HTTPS

In produzione, tutte le comunicazioni devono utilizzare HTTPS per proteggere i dati sensibili durante la trasmissione.

### 4. Scadenza dei token

I token JWT hanno una scadenza configurabile (attualmente 7 giorni). Dopo la scadenza, l'utente deve autenticarsi nuovamente.

### 5. Revoca dei token

In caso di compromissione, i token possono essere revocati implementando una lista di token revocati nel backend.

## Riferimenti

- [Documentazione Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Documentazione Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Documentazione JWT](https://jwt.io/introduction)
- [Documentazione React Router](https://reactrouter.com/en/main)

---

## Appendice: Comandi utili

### Sviluppo locale

Avvia il worker Cloudflare:
```bash
cd tsnlas-worker
npm run dev
```

Avvia il frontend:
```bash
cd frontend
npm run dev
```

### Deployment

Pubblica il worker Cloudflare:
```bash
cd tsnlas-worker
npm run deploy
```

Pubblica il frontend:
```bash
cd frontend
npm run build
# Carica i file generati nella cartella dist sul tuo hosting
```