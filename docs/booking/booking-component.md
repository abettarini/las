# Componente BookingComponent

Il componente BookingComponent è un form completo per la prenotazione di eventi. Permette agli utenti di selezionare un tipo di evento, inserire i propri dati personali, scegliere una data e un orario, e inviare la prenotazione.

## Importazione

```tsx
import BookingComponent from '@/components/booking/booking-components';
```

## Proprietà

Il componente BookingComponent non accetta proprietà esterne, poiché gestisce internamente tutto il flusso di prenotazione.

## Dipendenze

Il componente utilizza le seguenti librerie:

| Libreria | Utilizzo |
|----------|----------|
| React Hook Form | Gestione del form e validazione |
| Zod | Schema di validazione dei dati |
| date-fns | Formattazione e manipolazione delle date |
| Turnstile | Protezione anti-spam (alternativa a reCAPTCHA) |
| Sonner | Notifiche toast per feedback all'utente |

## Utilizzo base

```tsx
import BookingComponent from '@/components/booking/booking-components';

const BookingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Prenotazioni</h1>
      <BookingComponent />
    </div>
  );
};

export default BookingPage;
```

## Funzionalità

Il componente BookingComponent offre le seguenti funzionalità:

- Selezione del tipo di evento da prenotare
- Inserimento dei dati personali (nome, cognome, email, telefono)
- Selezione della data tramite un calendario
- Selezione dell'orario disponibile
- Verifica della disponibilità dell'orario selezionato
- Invio della prenotazione
- Validazione dei dati inseriti
- Protezione anti-spam tramite Turnstile
- Feedback visivo sullo stato della prenotazione (successo, errore)
- Visualizzazione delle informazioni di cancellazione (URL e codice segreto)
- Funzionalità di copia negli appunti per URL e codice segreto
- Notifiche toast per confermare la copia negli appunti

## Configurazione dell'API

Il componente utilizza una variabile di ambiente per determinare l'URL dell'API:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

Questa variabile deve essere definita nei file `.env` e `.env.production`:

```
# .env (sviluppo)
VITE_API_URL=http://localhost:8787

# .env.production (produzione)
VITE_API_URL=https://tsnlas-worker.tsnlastrasigna.workers.dev
```

## Struttura interna

Il componente è strutturato in diverse sezioni:

1. **Schema di validazione**: Definisce i campi richiesti e le regole di validazione
2. **Stati del form**: Gestisce gli stati del form (data selezionata, orario, tipo di evento, ecc.)
3. **Funzioni di utilità**: Funzioni per verificare la disponibilità delle date e degli orari
4. **Gestione dell'invio**: Funzioni per inviare la prenotazione e gestire la risposta
5. **Rendering del form**: Struttura visiva del form con i vari campi e controlli
6. **Gestione della cancellazione**: Visualizzazione e gestione delle informazioni di cancellazione

### Schema di validazione

```tsx
const bookingFormSchema = z.object({
  eventType: z.string().min(1, "Seleziona un tipo di evento"),
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  surname: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  phone: z.string().min(6, "Inserisci un numero di telefono valido"),
  date: z.date({
    required_error: "Seleziona una data",
    invalid_type_error: "Data non valida",
  }),
  time: z.string().min(1, "Seleziona un orario"),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Devi accettare l'informativa sulla privacy per continuare" }),
  }),
  // Campo honey-pot nascosto - dovrebbe rimanere vuoto
  website: z.string().max(0, "Errore di validazione").optional(),
  // Token di Turnstile
  cfTurnstileResponse: z.string().min(1, "Verifica di sicurezza richiesta"),
});
```

## Flusso di prenotazione

1. L'utente seleziona un tipo di evento
2. L'utente inserisce i propri dati personali
3. L'utente seleziona una data dal calendario
4. L'utente seleziona un orario disponibile
5. L'utente accetta l'informativa sulla privacy
6. L'utente completa la verifica Turnstile
7. L'utente invia la prenotazione
8. Il sistema verifica la disponibilità dell'orario selezionato
9. Il sistema crea la prenotazione e mostra un messaggio di conferma
10. Il sistema visualizza l'URL di cancellazione e il codice segreto

## Gestione della cancellazione

Il componente gestisce le informazioni necessarie per la cancellazione della prenotazione:

1. Dopo la conferma della prenotazione, il componente mostra:
   - L'URL per accedere alla pagina di cancellazione
   - Il codice segreto necessario per autorizzare la cancellazione

2. L'utente può copiare facilmente queste informazioni negli appunti:
   - Pulsanti dedicati con icone per la copia
   - Feedback visivo quando la copia è avvenuta con successo
   - Notifiche toast che confermano l'operazione

### Esempio di gestione delle informazioni di cancellazione

```tsx
// Stato per memorizzare l'URL di cancellazione e la secret key
const [cancelUrl, setCancelUrl] = useState<string | null>(null);
const [cancelSecret, setCancelSecret] = useState<string | null>(null);

// Stato per il feedback di copia
const [urlCopied, setUrlCopied] = useState<boolean>(false);
const [secretCopied, setSecretCopied] = useState<boolean>(false);

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

## Gestione degli errori

Il componente gestisce i seguenti errori:

- Errori di validazione del form
- Errori di disponibilità dell'orario
- Errori di comunicazione con l'API
- Errori durante la creazione della prenotazione
- Errori durante la copia negli appunti

### Esempio di gestione degli errori

```tsx
try {
  // Verifica la disponibilità dell'orario prima di inviare la prenotazione
  const isAvailable = await checkTimeAvailability(formattedDate, data.time);

  if (!isAvailable) {
    setSubmitError('L\'orario selezionato non è più disponibile. Seleziona un altro orario.');
    return;
  }

  // Invia i dati al service worker di Cloudflare
  const response = await fetch(`${apiUrl}/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Si è verificato un errore durante l\'invio della prenotazione');
  }

  // Gestisci la risposta di successo
  setSubmitSuccess(true);
  setBookingId(result.bookingId);

  // Salva l'URL di cancellazione e la secret key
  if (result.cancelUrl) {
    setCancelUrl(result.cancelUrl);
  }

  if (result.cancelSecret) {
    setCancelSecret(result.cancelSecret);
  }

} catch (error) {
  console.error('Errore durante l\'invio della prenotazione:', error);
  setSubmitError(error instanceof Error ? error.message : 'Si è verificato un errore sconosciuto');
}
```

## Esempi

### Esempio 1: Integrazione in una pagina

```tsx
import BookingComponent from '@/components/booking/booking-components';

const BookingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Prenotazioni</h1>
      <p className="mb-6">
        Utilizza il form sottostante per prenotare un evento presso il nostro poligono.
        Seleziona il tipo di evento, inserisci i tuoi dati e scegli una data e un orario disponibili.
      </p>
      <BookingComponent />
    </div>
  );
};

export default BookingPage;
```

### Esempio 2: Utilizzo con un layout personalizzato

```tsx
import BookingComponent from '@/components/booking/booking-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookingWithCustomLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Prenota un evento</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingComponent />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingWithCustomLayout;
```

## Note

- Il componente utilizza React Hook Form per la gestione del form
- Il componente utilizza Zod per la validazione dei dati
- Il componente utilizza Turnstile per la protezione anti-spam
- Il componente utilizza date-fns per la gestione delle date
- Il componente utilizza Sonner per le notifiche toast
- Il componente è responsive e si adatta a diverse dimensioni di schermo
- Il componente utilizza variabili di ambiente per la configurazione dell'API
- Il componente include un campo honey-pot nascosto per la protezione anti-spam
- Il componente mostra un messaggio di conferma dopo l'invio della prenotazione
- Il componente visualizza e permette di copiare le informazioni di cancellazione
- Il componente gestisce gli errori di validazione e di comunicazione con l'API