export type MenuItem = {
    title: string
    href?: string
    image?: string
    heading?: string
    description?: string
    submenu?: MenuItem[]
};

const struttura: MenuItem[] = [
    {
      title: "Dove siamo",
      href: "/struttura/dove-siamo",
      description:
        "Indicazioni per raggiungere la nostra struttura.",
    },
    {
      title: "Orari",
      href: "/struttura/orari",
      description:
        "Orari di apertura/chiusura segreteria e di inizio e termine spari.",
    },
    {
      title: "Impianti",
      href: "/struttura/impianti",
      description:
        "Dai un'occhiata ai nostri impianti.",
    }
];
  
const chisiamo: MenuItem[] = [
      {
          title: "Storia",
          href: "/chisiamo/storia",
          description: "Informazioni sulla storia della struttura."
      },
      {
          title: "Statuto sezione e MOG",
          href: "/chisiamo/statuto-sezione-mog",
          description: "Lo statuto della sezione e il MOG."
      },
      {
          title: "Consiglio direttivo",
          href: "/chisiamo/consiglio-direttivo",
          description: "Elenco dei membri del consiglio direttivo e organigramma"
      },
      {
          title: "Bilanci",
          href: "/chisiamo/bilanci",
          description: "Bilanci annuali della struttura."
      },
];
  
const iscrizioni: MenuItem[] = [
    {
        title: "Iscrizioni",
        href: "/iscrizioni",
        description: "Informazioni sulle iscrizioni."
    },
    {
        title: "Documenti",
        href: "/iscrizioni/documenti",
        description: "Documenti e fac-simili necessari per l'iscrizione."
    },
    {
        title: "Test",
        href: "/quiz",
        description: "Procedura a quiz di test per l'iscrizione."
    }
];

const attivitaIstituzionale: MenuItem[] = [
    {
        title: "Attività certificatoria",
        href: "/attivita-istituzionale/certificazioni",
        description: "regolamentata dal D.L.66 del 15 marzo 2010"
    },
    {
        title: "Attività sportive",
        href: "/attivita-istituzionale/sportive",
        description: "il poligono dispone di un campo allestito per il tiro rapido sportivo nel quale vengono disputate gare interne e nazionali."
    },
    {
        title: "Allenamento caccia",
        href: "/attivita-istituzionale/caccia",
        description: "Rilascio certificazione per la caccia di selezione."
    }
];

const mainMenu: MenuItem[] = [
    {title: 'Attività Istituzionale', image: "/assets/logo-uits.jpeg", href: '/', description: 'Attività istituzionali.', heading: 'UITS', submenu: attivitaIstituzionale},
    {title: 'Struttura', submenu: struttura},
    {title: 'Servizi', href: '/#servizi'},
    {title: 'News', href: '/#news'},
    {title: 'Iscrizioni', submenu: iscrizioni},
    {title: 'Chi siamo', submenu: chisiamo},
    {title: 'Contatti e FAQ', href: '/#contatti'}
];

export default mainMenu;
