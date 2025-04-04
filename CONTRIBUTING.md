# Contribuire al progetto

Grazie per il tuo interesse a contribuire al progetto! Questo documento fornisce linee guida per contribuire al codice e alla documentazione.

## Contribuire alla documentazione

### Documentazione dei componenti

La documentazione di tutti i componenti si trova nella cartella `/docs`. Ogni componente deve avere il suo file markdown dedicato che descrive il suo utilizzo, le proprietà accettate e fornisce esempi.

#### Struttura della documentazione

La documentazione è organizzata in sottocartelle che rispecchiano la struttura del codice:

- `/docs/ui/`: Componenti UI di base
- `/docs/booking/`: Componenti relativi alle prenotazioni
- `/docs/navigation/`: Componenti di navigazione
- `/docs/form/`: Componenti per i form

Un indice completo di tutti i componenti documentati è disponibile nel file `/docs/INDEX.md`.

#### Creare la documentazione per un nuovo componente

1. Identifica la categoria del componente (ui, booking, navigation, form, ecc.)
2. Crea un nuovo file markdown nella cartella appropriata (es. `/docs/ui/my-component.md`)
3. Segui il formato descritto in `/docs/README.md`
4. Assicurati di includere:
   - Una descrizione del componente
   - Come importarlo
   - Le proprietà accettate
   - Esempi di utilizzo
   - Eventuali note o avvertenze
5. Aggiungi il componente all'indice in `/docs/INDEX.md`

#### Aggiornare la documentazione esistente

1. Trova il file markdown del componente che vuoi aggiornare
2. Apporta le modifiche necessarie
3. Assicurati che gli esempi siano aggiornati e funzionanti
4. Se necessario, aggiorna la descrizione del componente nell'indice

#### Linee guida per la documentazione

- Usa un linguaggio chiaro e conciso
- Fornisci esempi pratici e realistici
- Documenta tutte le proprietà del componente
- Includi note su eventuali limitazioni o comportamenti particolari
- Mantieni la documentazione aggiornata quando il componente cambia
- Segui il formato standard descritto in `/docs/README.md`
- Usa tabelle per documentare le proprietà
- Organizza gli esempi in sezioni separate
- Includi screenshot o GIF animate quando appropriato

### Documentazione del codice

Oltre alla documentazione in markdown, è importante documentare il codice stesso:

1. Aggiungi commenti JSDoc a tutte le funzioni e i componenti
2. Documenta le interfacce e i tipi
3. Aggiungi commenti inline per spiegare parti complesse del codice

## Contribuire al codice

### Ambiente di sviluppo

1. Clona il repository
2. Installa le dipendenze: `npm install`
3. Copia `.env.example` in `.env` e configura le variabili di ambiente
4. Avvia il server di sviluppo: `npm run dev`

### Linee guida per il codice

1. Segui le convenzioni di stile esistenti
2. Scrivi test per le nuove funzionalità
3. Assicurati che il codice passi il linting: `npm run lint`
4. Assicurati che il codice passi i test: `npm run test`

### Processo di pull request

1. Crea un fork del repository
2. Crea un branch per la tua feature: `git checkout -b feature/my-feature`
3. Apporta le modifiche necessarie
4. Esegui i test e il linting
5. Commit delle modifiche: `git commit -m "Aggiungi la mia feature"`
6. Push del branch: `git push origin feature/my-feature`
7. Apri una pull request

## Risorse utili

- [Documentazione di React](https://reactjs.org/docs/getting-started.html)
- [Documentazione di Vite](https://vitejs.dev/guide/)
- [Documentazione di Tailwind CSS](https://tailwindcss.com/docs)
- [Documentazione di shadcn/ui](https://ui.shadcn.com/docs)# Contribuire al progetto

Grazie per il tuo interesse a contribuire al progetto! Questo documento fornisce linee guida per contribuire al codice e alla documentazione.

## Contribuire alla documentazione

### Documentazione dei componenti

La documentazione di tutti i componenti si trova nella cartella `/docs`. Ogni componente deve avere il suo file markdown dedicato che descrive il suo utilizzo, le proprietà accettate e fornisce esempi.

#### Creare la documentazione per un nuovo componente

1. Identifica la categoria del componente (ui, booking, navigation, form, ecc.)
2. Crea un nuovo file markdown nella cartella appropriata (es. `/docs/ui/my-component.md`)
3. Segui il formato descritto in `/docs/README.md`
4. Assicurati di includere:
   - Una descrizione del componente
   - Come importarlo
   - Le proprietà accettate
   - Esempi di utilizzo
   - Eventuali note o avvertenze

#### Aggiornare la documentazione esistente

1. Trova il file markdown del componente che vuoi aggiornare
2. Apporta le modifiche necessarie
3. Assicurati che gli esempi siano aggiornati e funzionanti

### Documentazione del codice

Oltre alla documentazione in markdown, è importante documentare il codice stesso:

1. Aggiungi commenti JSDoc a tutte le funzioni e i componenti
2. Documenta le interfacce e i tipi
3. Aggiungi commenti inline per spiegare parti complesse del codice

## Contribuire al codice

### Ambiente di sviluppo

1. Clona il repository
2. Installa le dipendenze: `npm install`
3. Copia `.env.example` in `.env` e configura le variabili di ambiente
4. Avvia il server di sviluppo: `npm run dev`

### Linee guida per il codice

1. Segui le convenzioni di stile esistenti
2. Scrivi test per le nuove funzionalità
3. Assicurati che il codice passi il linting: `npm run lint`
4. Assicurati che il codice passi i test: `npm run test`

### Processo di pull request

1. Crea un fork del repository
2. Crea un branch per la tua feature: `git checkout -b feature/my-feature`
3. Apporta le modifiche necessarie
4. Esegui i test e il linting
5. Commit delle modifiche: `git commit -m "Aggiungi la mia feature"`
6. Push del branch: `git push origin feature/my-feature`
7. Apri una pull request

## Risorse utili

- [Documentazione di React](https://reactjs.org/docs/getting-started.html)
- [Documentazione di Vite](https://vitejs.dev/guide/)
- [Documentazione di Tailwind CSS](https://tailwindcss.com/docs)
- [Documentazione di shadcn/ui](https://ui.shadcn.com/docs)