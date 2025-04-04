# Componente Ribbon

> **Nota**: La documentazione di questo componente è stata spostata nella cartella `/docs/ui/ribbon.md`.

Per visualizzare la documentazione completa, consulta il file `/docs/ui/ribbon.md`.

## Importazione

```tsx
import { Ribbon, EnvironmentRibbon } from '@/components/ui/ribbon';
```

## Utilizzo base

```tsx
// Ribbon con colori personalizzati
<Ribbon
  text="STAGING"
  backgroundColor="#f59e0b"
  color="white"
/>

// Ribbon per ambiente di sviluppo
<EnvironmentRibbon />
```# Componente Ribbon

Il componente Ribbon è un'etichetta che viene mostrata nell'angolo superiore destro dell'applicazione. È particolarmente utile per indicare l'ambiente in cui l'applicazione è in esecuzione (sviluppo, staging, produzione, ecc.).

## Utilizzo base

```tsx
import { Ribbon } from './components/ui/ribbon';

// Ribbon con colori personalizzati
<Ribbon 
  text="STAGING" 
  backgroundColor="#f59e0b" 
  color="white" 
/>
```

## EnvironmentRibbon

Il componente `EnvironmentRibbon` è una versione specializzata del Ribbon che mostra automaticamente un'etichetta "SVILUPPO" quando l'applicazione è in esecuzione in un ambiente di sviluppo (non production).

```tsx
import { EnvironmentRibbon } from './components/ui/ribbon';

// Aggiungilo all'inizio dell'applicazione
<EnvironmentRibbon />
```

Il componente `EnvironmentRibbon` utilizza `import.meta.env.MODE` per determinare l'ambiente corrente. Se `MODE` è diverso da `'production'`, il ribbon viene mostrato.

## Personalizzazione

Il componente Ribbon accetta le seguenti proprietà:

- `text`: Il testo da mostrare nel ribbon
- `color`: Il colore del testo (default: bianco)
- `backgroundColor`: Il colore di sfondo (default: rosso)

## Esempi

```tsx
// Ribbon per ambiente di sviluppo (rosso)
<Ribbon text="SVILUPPO" backgroundColor="#e53e3e" />

// Ribbon per ambiente di staging (arancione)
<Ribbon text="STAGING" backgroundColor="#f59e0b" />

// Ribbon per ambiente di test (blu)
<Ribbon text="TEST" backgroundColor="#3b82f6" />

// Ribbon personalizzato
<Ribbon 
  text="BETA" 
  backgroundColor="#8b5cf6" 
  color="#ffffff" 
/>
```