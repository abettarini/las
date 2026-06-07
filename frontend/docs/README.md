# Documentazione dei Componenti

Questa cartella contiene la documentazione di tutti i componenti utilizzati nell'applicazione. Ogni componente ha il suo file markdown dedicato che descrive il suo utilizzo, le proprietà accettate e fornisce esempi.

## Indice dei Componenti

Per un elenco completo di tutti i componenti documentati, consulta il file [INDEX.md](./INDEX.md).

## Struttura della documentazione

La documentazione è organizzata in sottocartelle che rispecchiano la struttura del codice:

- `ui/`: Componenti UI di base
- `booking/`: Componenti relativi alle prenotazioni
- `navigation/`: Componenti di navigazione
- `form/`: Componenti per i form
- ecc.

## Formato della documentazione

Ogni file di documentazione segue questo formato:

```markdown
# Nome del Componente

Breve descrizione del componente e del suo scopo.

## Importazione

```tsx
import { ComponentName } from '@/components/path/to/component';
```

## Proprietà

| Nome | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| prop1 | string | - | Descrizione della proprietà |
| prop2 | number | 0 | Descrizione della proprietà |
| ... | ... | ... | ... |

## Utilizzo base

```tsx
<ComponentName prop1="value" prop2={42} />
```

## Esempi

### Esempio 1: Titolo dell'esempio

```tsx
<ComponentName prop1="value" prop2={42} />
```

### Esempio 2: Titolo dell'esempio

```tsx
<ComponentName prop1="value" prop2={42} />
```

## Note

Eventuali note o avvertenze sull'utilizzo del componente.
```

## Come contribuire alla documentazione

### Aggiungere un nuovo componente

1. Crea un nuovo file markdown nella cartella appropriata (es. `ui/my-component.md`)
2. Segui il formato descritto sopra
3. Assicurati di includere esempi di utilizzo
4. Aggiungi il componente all'indice in [INDEX.md](./INDEX.md)

### Aggiornare un componente esistente

1. Trova il file markdown del componente che vuoi aggiornare
2. Apporta le modifiche necessarie
3. Assicurati che gli esempi siano aggiornati e funzionanti
4. Se necessario, aggiorna la descrizione del componente nell'indice

### Linee guida per la documentazione

- Usa un linguaggio chiaro e conciso
- Fornisci esempi pratici e realistici
- Documenta tutte le proprietà del componente
- Includi note su eventuali limitazioni o comportamenti particolari
- Mantieni la documentazione aggiornata quando il componente cambia

Per maggiori informazioni su come contribuire al progetto, consulta il file [CONTRIBUTING.md](../CONTRIBUTING.md) nella root del progetto.