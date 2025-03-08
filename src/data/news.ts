import { Content } from "../components/news/news-list";
import { NewsItem } from "../components/NewsCard";

// Sample news data
export const news: NewsItem[] = [
    {
      type: "news",
      title: "Nuovo corso base di tiro per principianti",
      date: "2024-01-15",
      excerpt: "Inizia il nuovo anno con il nostro corso base di tiro. Impara le tecniche fondamentali e le norme di sicurezza con i nostri istruttori qualificati.",
    },
    {
      type: "event",
      title: "Gara sociale di tiro sportivo",
      date: "2024-02-01",
      excerpt: "Partecipa alla nostra prossima gara sociale. Un'occasione per metterti alla prova e incontrare altri appassionati.",
    },
    {
      type: "target",
      title: "Aggiornamento strutture del poligono",
      date: "2024-01-20",
      excerpt: "Abbiamo rinnovato le nostre strutture con nuovi bersagli elettronici e sistemi di illuminazione all'avanguardia.",
    }
  ]

export const contents: Content[] = [
  {
    id: 1,
    type: 'article',
    date: '2023-05-15',
    title: 'Le nuove frontiere dell\'intelligenza artificiale',
    abstract: 'Un\'analisi approfondita sugli ultimi sviluppi nel campo dell\'IA e le sue applicazioni future.',
    fullContent: 'Qui ci sarebbe il contenuto completo dell\'articolo sull\'intelligenza artificiale...'
  },
  {
    id: 2,
    type: 'video',
    date: '2023-05-10',
    title: 'Tutorial: Creare un\'app React da zero',
    abstract: 'Guida passo-passo per principianti su come costruire la tua prima applicazione React.',
    fullContent: 'Qui ci sarebbe la trascrizione completa del video tutorial su React...'
  },
  {
    id: 3,
    type: 'book',
    date: '2023-05-01',
    title: 'Il futuro sostenibile: Energie rinnovabili',
    abstract: 'Un libro che esplora le tecnologie e le strategie per un futuro energetico più verde.',
    fullContent: 'Qui ci sarebbe un estratto o una sintesi del libro sulle energie rinnovabili...'
  },
  {
    id: 4,
    type: 'article',
    date: '2023-05-20',
    title: 'La rivoluzione del 5G: Opportunità e sfide',
    abstract: 'Esplorazione delle potenzialità e delle sfide legate all\'implementazione della tecnologia 5G.',
    fullContent: 'Approfondimento sulle implicazioni del 5G per le telecomunicazioni e l\'industria...'
  },
  {
    id: 5,
    type: 'video',
    date: '2023-05-18',
    title: 'Machine Learning: Concetti fondamentali',
    abstract: 'Introduzione ai concetti chiave del machine learning e alle sue applicazioni pratiche.',
    fullContent: 'Video tutorial sui principi base del machine learning e esempi di implementazione...'
  },
  {
    id: 6,
    type: 'book',
    date: '2023-05-12',
    title: 'Cybersecurity: Proteggere l\'era digitale',
    abstract: 'Guida completa alle migliori pratiche di sicurezza informatica per aziende e individui.',
    fullContent: 'Panoramica dettagliata sulle minacce cyber attuali e strategie di difesa...'
  },
  {
    id: 7,
    type: 'article',
    date: '2023-05-25',
    title: 'Blockchain oltre le criptovalute',
    abstract: 'Esplorazione delle applicazioni della blockchain in settori diversi dalle criptovalute.',
    fullContent: 'Analisi approfondita dei casi d\'uso della blockchain in supply chain, sanità, e altro...'
  },
  {
    id: 8,
    type: 'video',
    date: '2023-05-22',
    title: 'Data Science: Dall\'analisi alle decisioni',
    abstract: 'Come la data science sta trasformando il processo decisionale nelle aziende moderne.',
    fullContent: 'Video corso sulle tecniche di data science e loro applicazione nel business...'
  },
  {
    id: 9,
    type: 'book',
    date: '2023-05-16',
    title: 'L\'era quantistica: Preparasi al futuro',
    abstract: 'Guida accessibile al mondo del computing quantistico e alle sue potenziali applicazioni.',
    fullContent: 'Esplorazione dettagliata dei principi del quantum computing e delle sue implicazioni future...'
  },
  {
    id: 10,
    type: 'article',
    date: '2023-05-30',
    title: 'IoT: Connettere il mondo fisico al digitale',
    abstract: 'Come l\'Internet of Things sta rivoluzionando industrie e vita quotidiana.',
    fullContent: 'Analisi approfondita delle applicazioni IoT in smart home, industria 4.0, e città intelligenti...'
  },
  {
    id: 11,
    type: 'video',
    date: '2023-05-28',
    title: 'UX Design: Creare esperienze memorabili',
    abstract: 'Principi e pratiche per progettare interfacce utente intuitive e coinvolgenti.',
    fullContent: 'Tutorial video sulle migliori pratiche di UX design con esempi pratici e case studies...'
  },
  {
    id: 12,
    type: 'book',
    date: '2023-05-23',
    title: 'Etica dell\'IA: Navigare le sfide morali',
    abstract: 'Esplorazione delle questioni etiche sollevate dallo sviluppo e dall\'uso dell\'intelligenza artificiale.',
    fullContent: 'Discussione approfondita sui dilemmi etici dell\'IA e proposte per un\'IA responsabile...'
  },
  {
    id: 13,
    type: 'article',
    date: '2023-06-01',
    title: 'Edge Computing: Potenza di calcolo al margine',
    abstract: 'Come l\'edge computing sta cambiando il panorama dell\'elaborazione dati e dell\'IoT.',
    fullContent: 'Analisi dettagliata dei vantaggi dell\'edge computing in termini di latenza e sicurezza...'
  },
  {
    id: 14,
    type: 'video',
    date: '2023-05-31',
    title: 'DevOps: Unire sviluppo e operazioni',
    abstract: 'Guida pratica all\'implementazione di una cultura e di pratiche DevOps efficaci.',
    fullContent: 'Video corso sulle metodologie DevOps, strumenti e best practices per team di sviluppo...'
  },
  {
    id: 15,
    type: 'book',
    date: '2023-05-26',
    title: 'Realtà Aumentata: Fondere digitale e fisico',
    abstract: 'Esplorazione delle applicazioni attuali e future della realtà aumentata.',
    fullContent: 'Panoramica completa sulla tecnologia AR, casi d\'uso e previsioni future...'
  }
]