# Funzionalità di Cancellazione Prenotazioni

Questa documentazione descrive la funzionalità di cancellazione delle prenotazioni implementata nel sistema.

## Panoramica

Il sistema di cancellazione delle prenotazioni è composto da:

1. **Backend (Service Worker)**: Gestisce la logica di cancellazione e la verifica della secret key
2. **Frontend (React)**: Fornisce l'interfaccia utente per la cancellazione e la visualizzazione delle informazioni necessarie
3. **Pagina di reindirizzamento**: Mantiene la compatibilità con i link esistenti

## Componenti principali

### 1. Backend (Service Worker)

Il service worker implementa:

- Generazione di una secret key casuale (`cancelSecret`) al momento della creazione della prenotazione
- Endpoint per verificare la validità della secret key (`/booking/:id/verify-secret`)
- Endpoint per cancellare una prenotazione con autenticazione tramite secret key (`/booking/:id`)
- Memorizzazione sicura della secret key nel database

#### Generazione della Secret Key

```typescript
function generateCancelSecret(): string {
  // Genera una stringa casuale di 8 caratteri (lettere e numeri)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Esclusi caratteri ambigui come 0, O, 1, I
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```

#### Endpoint di Verifica

```typescript
app.post('/booking/:id/verify-secret', async (c) => {
  try {
    const id = c.req.param('id');
    const { secret } = await c.req.json();

    if (!secret) {
      return c.json({
        success: false,
        message: 'La chiave segreta è richiesta'
      }, 400);
    }

    // Verifica la secret key
    const isSecretValid = await verifyBookingSecret(id, secret, c.env);

    return c.json({
      success: isSecretValid,
      message: isSecretValid
        ? 'La chiave segreta è valida'
        : 'La chiave segreta non è valida'
    });
  } catch (error) {
    // Gestione degli errori
  }
});
```

#### Endpoint di Cancellazione

```typescript
app.delete('/booking/:id', async (c) => {
  try {
    const id = c.req.param('id');
    let secret = c.req.query('secret');

    // Se non è nella query string, prova a ottenerla dal body
    if (!secret) {
      try {
        const body = await c.req.json();
        secret = body.secret;
      } catch (e) {
        // Ignora errori di parsing del body
      }
    }

    // Verifica se la prenotazione esiste
    const existingBooking = await getBooking(id, c.env);

    if (!existingBooking) {
      return c.json({
        success: false,
        message: 'Prenotazione non trovata'
      }, 404);
    }

    // Verifica la secret key se la prenotazione ha una cancelSecret
    if (existingBooking.cancelSecret) {
      // Se non è stata fornita una secret key
      if (!secret) {
        return c.json({
          success: false,
          message: 'È richiesta una chiave segreta per cancellare questa prenotazione',
          requiresSecret: true
        }, 403);
      }

      // Verifica la secret key
      const isSecretValid = await verifyBookingSecret(id, secret, c.env);

      if (!isSecretValid) {
        return c.json({
          success: false,
          message: 'La chiave segreta non è valida',
          requiresSecret: true
        }, 403);
      }
    }

    // Cancella la prenotazione
    await deleteBooking(id, c.env);

    return c.json({
      success: true,
      message: 'Prenotazione cancellata con successo'
    });
  } catch (error) {
    // Gestione degli errori
  }
});
```

### 2. Frontend (React)

Il frontend implementa:

- Visualizzazione dell'URL di cancellazione e della secret key nella pagina di conferma della prenotazione
- Funzionalità di copia negli appunti per URL e secret key
- Notifiche toast per confermare la copia negli appunti
- Pagina dedicata per la cancellazione delle prenotazioni (`CancelBookingPage`)
- Modale per l'inserimento della secret key

#### Visualizzazione delle Informazioni di Cancellazione

```tsx
{/* Informazioni per la cancellazione */}
<div className="mt-6 mb-6 max-w-md mx-auto">
  <h3 className="text-lg font-semibold mb-2 text-gray-800">Informazioni per la cancellazione</h3>
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
    {cancelUrl && (
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Link per annullare la prenotazione:</p>
        <div className="flex items-center">
          <input 
            type="text" 
            value={cancelUrl} 
            readOnly 
            className="flex-1 text-sm bg-white border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none"
          />
          <button 
            onClick={() => copyToClipboard(cancelUrl, 'url')}
            className={`${urlCopied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-r-md p-2 transition-colors duration-200`}
            title={urlCopied ? "Copiato!" : "Copia negli appunti"}
          >
            {/* Icona di copia o di conferma */}
          </button>
        </div>
      </div>
    )}
    
    {cancelSecret && (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Codice segreto per la cancellazione:</p>
        <div className="flex items-center">
          <input 
            type="text" 
            value={cancelSecret} 
            readOnly 
            className="flex-1 text-sm bg-white border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none font-mono"
          />
          <button 
            onClick={() => copyToClipboard(cancelSecret, 'secret')}
            className={`${secretCopied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-r-md p-2 transition-colors duration-200`}
            title={secretCopied ? "Copiato!" : "Copia negli appunti"}
          >
            {/* Icona di copia o di conferma */}
          </button>
        </div>
      </div>
    )}
    
    <p className="text-xs text-gray-500 mt-3">
      Conserva queste informazioni per poter annullare la prenotazione in caso di necessità.
      Il codice segreto ti sarà richiesto al momento della cancellazione.
    </p>
  </div>
</div>
```

#### Funzionalità di Copia negli Appunti con Toast

```tsx
// Funzione per copiare il testo negli appunti
const copyToClipboard = (text: string, type: 'url' | 'secret') => {
  navigator.clipboard.writeText(text)
    .then(() => {
      // Feedback visivo
      if (type === 'url') {
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 2000);
        toast.success('Link di cancellazione copiato negli appunti', {
          description: 'Puoi utilizzare questo link per accedere alla pagina di cancellazione',
          duration: 3000,
        });
      } else {
        setSecretCopied(true);
        setTimeout(() => setSecretCopied(false), 2000);
        toast.success('Codice segreto copiato negli appunti', {
          description: 'Conserva questo codice, ti servirà per confermare la cancellazione',
          duration: 3000,
        });
      }
    })
    .catch(err => {
      console.error('Errore durante la copia negli appunti:', err);
      toast.error('Impossibile copiare negli appunti', {
        description: 'Prova a selezionare e copiare il testo manualmente',
      });
    });
};
```

### 3. Pagina di Cancellazione

La pagina di cancellazione (`CancelBookingPage`) implementa:

- Caricamento dei dettagli della prenotazione
- Visualizzazione delle informazioni della prenotazione
- Modale per l'inserimento della secret key
- Gestione della cancellazione
- Feedback visivo sullo stato della cancellazione

#### Gestione della Cancellazione

```tsx
// Gestisce la cancellazione della prenotazione
const handleConfirmCancel = async () => {
  if (!secret.trim()) {
    setSecretError('Inserisci il codice segreto.');
    return;
  }

  setCancelling(true);
  setSecretError(null);

  try {
    const response = await cancelBooking(bookingId!, secret.trim());

    if (!response.success) {
      if (response.requiresSecret) {
        setSecretError(response.message || 'Il codice segreto non è valido.');
        setCancelling(false);
        return;
      } else {
        setError(response.message || 'Impossibile annullare la prenotazione.');
        setShowModal(false);
        setCancelling(false);
        return;
      }
    }

    // Mostra il messaggio di successo
    setSuccess(true);
    setShowModal(false);
    setCancelling(false);
  } catch (error) {
    console.error('Errore durante l\'annullamento della prenotazione:', error);
    setError('Si è verificato un errore durante l\'annullamento della prenotazione.');
    setShowModal(false);
    setCancelling(false);
  }
};
```

### 4. Servizio di Prenotazione

Il servizio di prenotazione (`booking-service.ts`) implementa:

- Funzione per ottenere i dettagli di una prenotazione
- Funzione per verificare la validità della secret key
- Funzione per cancellare una prenotazione

#### Funzione di Cancellazione

```typescript
/**
 * Annulla una prenotazione
 * @param id - ID della prenotazione
 * @param secret - Secret key per l'autorizzazione
 * @returns Risposta API con l'esito dell'annullamento
 */
export async function cancelBooking(id: string, secret: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_URL}/booking/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secret })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore durante l\'annullamento della prenotazione:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'annullamento della prenotazione'
    };
  }
}
```

## Flusso di cancellazione

1. **Creazione della prenotazione**:
   - L'utente compila il form di prenotazione e lo invia
   - Il service worker genera una `cancelSecret` casuale
   - Il service worker restituisce la `cancelSecret` e l'URL di cancellazione nella risposta

2. **Visualizzazione delle informazioni di cancellazione**:
   - Il frontend mostra l'URL di cancellazione e la `cancelSecret` nella pagina di conferma
   - L'utente può copiare queste informazioni negli appunti

3. **Accesso alla pagina di cancellazione**:
   - L'utente accede alla pagina di cancellazione tramite l'URL fornito
   - Il frontend carica i dettagli della prenotazione
   - L'utente visualizza le informazioni della prenotazione

4. **Cancellazione della prenotazione**:
   - L'utente clicca sul pulsante "Annulla Prenotazione"
   - Si apre una modale che richiede l'inserimento della `cancelSecret`
   - L'utente inserisce la `cancelSecret` e conferma
   - Il frontend invia la richiesta di cancellazione al service worker
   - Il service worker verifica la `cancelSecret` e cancella la prenotazione
   - Il frontend mostra un messaggio di conferma

## Note sulla sicurezza

- La `cancelSecret` non viene mai esposta pubblicamente (viene rimossa dalla risposta dell'endpoint GET `/booking/:id`)
- La `cancelSecret` viene generata casualmente con caratteri non ambigui
- La `cancelSecret` è necessaria per autorizzare la cancellazione
- La pagina di cancellazione richiede l'ID della prenotazione e la `cancelSecret`
- La `cancelSecret` viene verificata lato server prima di procedere con la cancellazione

## Compatibilità con i link esistenti

Per mantenere la compatibilità con i link esistenti (ad esempio quelli inviati via email o nel feed iCal), è stata creata una pagina di reindirizzamento:

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reindirizzamento - TSN Lastra a Signa</title>
    <link rel="icon" href="/assets/favicon.ico" type="image/x-icon">
    <style>
        /* Stili CSS */
    </style>
</head>
<body>
    <div class="container">
        <div class="loader"></div>
        <h1>Reindirizzamento in corso...</h1>
        <p>Stai per essere reindirizzato alla nuova pagina di annullamento prenotazioni.</p>
    </div>
    
    <script>
        // Ottieni l'ID della prenotazione dalla query string
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('id');
        
        // Reindirizza alla nuova pagina
        setTimeout(function() {
            window.location.href = `/annulla-prenotazione${bookingId ? `?id=${bookingId}` : ''}`;
        }, 1500);
    </script>
</body>
</html>
```

## Dipendenze

- **Sonner**: Libreria per le notifiche toast
- **React Hook Form**: Gestione del form e validazione
- **Zod**: Schema di validazione dei dati
- **date-fns**: Formattazione e manipolazione delle date

## Configurazione

Il sistema utilizza la variabile d'ambiente `VITE_API_URL` per determinare l'URL dell'API:

```
# .env (sviluppo)
VITE_API_URL=http://localhost:8787

# .env.production (produzione)
VITE_API_URL=https://tsnlas-worker.tsnlastrasigna.workers.dev
```