# TSN Lastra a Signa - Frontend

Questo progetto è il frontend del sito web del Tiro a Segno Nazionale di Lastra a Signa, sviluppato con React e Vite.

## Configurazione dell'ambiente

Il progetto utilizza variabili di ambiente per gestire le configurazioni specifiche per ogni ambiente. Queste variabili sono definite nei seguenti file:

- `.env`: Variabili di ambiente per lo sviluppo locale
- `.env.production`: Variabili di ambiente per la produzione
- `.env.example`: Esempio di configurazione (non utilizzato direttamente)

**Nota**: I file `.env` e `.env.production` non sono inclusi nel repository per motivi di sicurezza. È necessario crearli manualmente utilizzando `.env.example` come modello.

### Variabili di ambiente disponibili

- `VITE_API_URL`: URL base dell'API (Cloudflare Worker)
  - Sviluppo: `http://localhost:8787`
  - Produzione: `https://tsnlas-worker.tsnlastrasigna.workers.dev`

### Indicatore di ambiente

L'applicazione mostra automaticamente un ribbon "SVILUPPO" nell'angolo superiore destro quando è in esecuzione in ambiente di sviluppo. Questo aiuta a distinguere facilmente l'ambiente di sviluppo da quello di produzione.

Il ribbon viene mostrato solo quando `import.meta.env.MODE !== 'production'`.

### Come utilizzare le variabili di ambiente

Nel codice, puoi accedere alle variabili di ambiente utilizzando `import.meta.env`:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Aggiungere nuove variabili di ambiente

Per aggiungere una nuova variabile di ambiente:

1. Aggiungi la variabile ai file `.env` e `.env.production`
2. Assicurati che il nome della variabile inizi con `VITE_` per renderla accessibile nel codice
3. Riavvia il server di sviluppo se è in esecuzione


## Dipendenze

### Sonner (Toast Notifications)

Il progetto utilizza la libreria Sonner per le notifiche toast. Se non è già installata, esegui:

```bash
npm install sonner
```

Per utilizzare i toast nel codice:

```typescript
import { toast } from '../components/ui/sonner';

// Esempio di utilizzo
toast.success('Operazione completata con successo');
toast.error('Si è verificato un errore');
toast.info('Informazione importante');
```


## Struttura

Menu

Home
Struttura
    Dove Siamo
    Orari
    Impianti
Chi Siamo
    Storia
    Statuto
    Direttivo
    Istruttori
Amministrazione Trasparente
    Consiglio
    Statuto
    Bilanci
    Mog
Iscrizione
    Informazioni
        Militari
        Obiettori di coscienza
        Maggiorenni con porto D'armi
        Maggiorenni senza porto D'Armi
    Documenti
    Minorenni
        Dai 14 ai 17 anni compiuti
    Corso DIMA
    Test
Servizi
    Noleggio Armi
    Tutoraggio
    Taratura Carabine
    Corsi di tiro dinamico Difensivo


Footer
Amministrazione Trasparente
    Consiglio
    Statuto
    Bilanci
    Mog