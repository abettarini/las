// src/components/Iscrizioni.tsx
import { ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface TOCItem {
    title: string;
    level: number;
    id: string;
}

const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
const Iscrizioni: React.FC = () => {
    const location = useLocation();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [headings, setHeadings] = useState<TOCItem[]>([]);

    useEffect(() => {

        const content = document.getElementById('main-content');
        if (content) {
            const headingElements = Array.from(content.querySelectorAll('h2, h3, h4')) as HTMLHeadingElement[];
            setHeadings(
                headingElements.map((heading) => ({
                    title: heading.innerText,
                    id: heading.id,
                    level: parseInt(heading.tagName[1]),
                }))
            );
            const handleScroll = () => {
                setShowScrollTop(content.scrollY > 300);
            };
          
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }

      }, []);

    useEffect(() => {
      if (location.hash) {
        scrollToSection(location.hash.substring(1));
      } else {
        // Scroll to the top of the page when there's no hash
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    }, [location]);

  return (
    <div className="mx-auto py-8 flex">
        <aside className="top-16 left-0 h-[calc(100vh-4rem)] w-72 border-r border-gray-200 bg-secondary p-4 md:sticky rounded-xl">
        <nav>
          <h2 className="font-bold mb-4">Indice</h2>
          <ul className="list-disc pl-0">
            {headings.map((item, index) => (
              <Button 
              variant="ghost" 
              key={index}
              className={`text-left justify-start ${item.level === 0 ? 'font-semibold' : ''} ${item.level === 1 ? 'text-sm' : ''} ${item.level === 2 ? 'text-xs' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              {item.title}
            </Button>
            ))}
          </ul>
        </nav>
        {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label="Torna all'inizio"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
      </aside>
      <ScrollArea className="ml-10 mr-10 h-screen w-full overflow-auto p-0" id="main-content">
      <h1 className="text-3xl font-bold mb-8 text-center">Iscrizioni</h1>
      <p className="text-center text-muted-foreground">
        Informazioni su come iscriversi al nostro poligono.
      </p>
        <section id="iscrizioni" className="my-8">
<div className="row">
<div className="col-md-9">
    <hr />
    <p className="leading-7 [&:not(:first-child)]:mt-6">Tutti i cittadini appartenenti all'Unione Europea possono iscriversi ad una Sezione del Tiro a Segno Nazionale, sia per lo svolgimento di attività ludica e/o sportiva, sia per gli adempimenti previsti dal relativo DL.</p>
    <p className="leading-7 [&:not(:first-child)]:mt-6">L'iscrizione al corso può essere effettuata esclusivamente recandosi, con la documentazione necessaria, presso lo sportello al pubblico del T.S.N.</p>
    <h3 id="documenti-necessari" className="text-xl font-semibold my-4">Documenti necessari</h3>
    <br />
    <h4 id="iscritti-obbligatori" className="font-bold">Iscritti "d'obbligo"</h4>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        Documenti ed adempimenti richiesti:
    </p>
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
            sottoscrizione della domanda di iscrizione predisposta dalla Sezione;
        </li>
        <li>
            <i>per i soli aspiranti Guardie Particolari Giurate</i>, dichiarazione, con auto-certificazione, ai sensi della legge 28 dicembre 2000, n. 445, in merito alla propria posizione lavorativa ovvero l'esistenza di un pre-contratto di assunzione da parte di un Istituto di Vigilanza privata;
        </li>
        <li>
            dichiarazione, con auto-certificazione, ai sensi della legge 28 dicembre 2000, n. 445, di: <br />
            - essere in possesso della cittadinanza in un Paese dell'Unione europea con domicilio in Italia oppure, per i cittadini non appartenenti all'Unione Europea, la residenza in Italia. In tal caso sarà necessario allegare copia della carta o permesso di soggiorno in corso di validità; <br />
            - di non trovarsi nelle condizioni ostative previste dagli artt. 1 e 43 del Testo Unico delle Leggi di Pubblica Sicurezza, approvato con R.D. 18 giugno 1931, n. 773; <br />
            - non aver riportato condanne per porto abusivo d'armi; non essere sottoposto a misure preventive previste dalla legge 27 dicembre 1956 n. 1423 e successive modifiche (L. 327/88 e D. Lgs159/2011). Si può procedere all'iscrizione del soggetto che abbia ottenuto la riabilitazione ai sensi dell'art. 178 c.p.; <br />
        </li>
        <li>
            allegare alla domanda il certificato medico legale, se già in possesso dell'interessato, di cui la Sezione TSN tratterrà una copia, in alternativa un certificato medico di idoneità all'attività sportiva NON AGONISTICA rilasciato dal medico di fiducia/famiglia attestante che il soggetto richiedente non presenta controindicazioni in atto <b>alla pratica di attività addestrativa di tiro a segno;</b>
            <a title="Facsimile certificato medico" href="https://www.tsnroma.it/downloads/facsimile-certificato-medico.pdf">Scarica un facsimile del certificato medico</a>
        </li>
        <li>
            versamento della prescritta quota di iscrizione;
        </li>
        <li>
            due foto recenti formato tessera;
        </li>
        <li>
            produrre un documento di riconoscimento in corso di validità;
        </li>
        <li>
            produrre il tesserino di codice fiscale o tessera sanitaria.
        </li>
    </ul>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        Sono esentati dalla presentazione dei documenti di cui ai precedenti punti b) c) e d) le Guardie Particolari Giurate in possesso di valido decreto prefettizio di nomina a Guardia Particolare Giurata e/o di valido porto d'armi, nonché gli Agenti in servizio effettivo presso i Corpi e Servizi di Polizia Locale e/o Provinciale, in possesso di tesserino/attestato di servizio rilasciato dall'Amministrazione di appartenenza (<i>rif. Circolare Ministero dell'Interno n. 557/PAS/U/017997/12982.LEG del 20.12.2018</i>) e tutti coloro che sono in possesso di un Porto d'armi in corso di validità.
    </p>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        I richiedenti in possesso di valido decreto prefettizio di nomina a guardia particolare giurata e di valido porto d'armi, ne devono produrre copia all'atto dell'iscrizione e, sono esentati anche dalla presentazione dei documenti di cui al precedente punto g).
    </p>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        Saranno esentati dall'obbligo di presentazione della certificazione medica di cui al punto d) i seguenti casi:
    </p>
    <ol>
        <li>i titolari di una <u>Licenza di porto di arma per difesa personale</u> in corso di validità (dovrà essere acquisita da parte della Sezione TSN copia della Licenza di porto di arma);</li>
        <li>i titolari di una <u>Licenza di porto di arma per uso di caccia o tiro a volo</u> in corso di validità, (dovrà essere acquisita da parte della Sezione TSN copia della Licenza di porto di arma).</li>
    </ol>
    <br />
    <h4 id="iscritti-volontari" className="font-bold">Iscritti "volontari"</h4>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        Documenti ed adempimenti richiesti:
    </p>
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
            sottoscrizione della domanda di iscrizione predisposta dalla Unione (ammissione-iscrizione alla Sezione TSN e tesseramento alla UITS);
        </li>
        <li>
            dichiarazione, con auto-certificazione, ai sensi della legge 28 dicembre 2000, n. 445, di: <br />
            - essere in possesso della cittadinanza in un Paese dell'Unione europea con domicilio in Italia oppure, per i cittadini non appartenenti all'Unione Europea, la residenza in Italia. In tal caso sarà necessario allegare copia della carta o permesso di soggiorno in corso di validità; <br />
            - non aver riportato condanne penali passate in giudicato, per reati non colposi, a pene detentive superiori a un anno, ovvero a pene che comportino l'interdizione dai pubblici uffici per un periodo superiore a un anno; <br />
            - non aver riportato condanne per porto abusivo di armi; non essere sottoposto a misure preventive previste dalla legge 27 dicembre 1956 n. 1423 e successive modifiche (L. 327/88 e D. Lgs 159/2011). Si può procedere all'iscrizione del soggetto che abbia ottenuto la riabilitazione ai sensi dell'art. 178 c.p.;
        </li>
        <li>
            allegare alla domanda le seguenti certificazioni mediche sanitarie:
            <ol>
                <li>
                    Per coloro i quali intendono svolgere attività non agonistica <br />
                    <b>Certificato medico di idoneità all'attività sportiva <u>NON AGONISTICA</u> rilasciato dal medico di fiducia/famiglia attestante che il soggetto richiedente non presenta controindicazioni in atto alla pratica di attività non agonistica di tiro asegno (non è acquisibile il certificato Anamnestico)</b>. Saranno esentati dall'obbligo di presentazione della certificazione medica sopradetta i soggetti che richiedono l'iscrizione alla Sezione e sono in possesso: <br />
                    - di una Licenza di <u>porto d'armi per Difesa Personale</u> in corso di validità poiché già coperti da certificazione sanitaria che per legge è richiesta annualmente dalle autorità (acquisizione da parte della Sezione TSN di copia del porto d'armi); <br />
                    - di <u>porto d'armi uso Tiro a Volo e uso Caccia</u> in corso di validità perché coperti da certificazione sanitaria (ex art. 35 TULPS) con validità di cinque anni (cfr. art. 3, 1° comma lett. e) D.Lgs. n. 204/2010). <br />
                    - di attestato di servizio rilasciato dall'Amministrazione di appartenenza (rif. Decreto Ministero della Sanità 5 aprile 2016) per il personale Militare in servizio permanente effettivo appartenente ai Corpi Armati dello Stato (Polizia di Stato, Arma dei Carabinieri, Guardia di Finanza, Corpo della Polizia Penitenziaria e Corpi Forestali delle Provincie autonome) in servizio effettivo; di tesserino/attestato di servizio rilasciato dall'Amministrazione di appartenenza per gli Agenti con qualifica di Polizia Giudiziaria in servizio effettivo presso i Corpi e Servizi di Polizia Locale e/o Provinciale. <br />
                    - di tesserino di servizio accompagnato da un certificato rilasciato dal Medico competente, contenente l'attestazione di tipo "anamnestico" che attesti lo stato di salute del magistrato per i Magistrati Ordinari, Contabili e Amministrativi in servizio.
                </li>
                <li>
                    <b>Certificato medico di idoneità all'attività sportiva <u>AGONISTICA</u></b> per tutti coloro che intendono svolgere attività agonistica, in base a quanto previsto dalla Circolare Tesseramento 2019 al punto 9.1, rilasciato dal servizio medico delle ASL, dai Centri di Medicina dello Sport e dai medici accreditati dalla FMSI, in base a quanto previsto dal D.M. del 18 febbraio 1982 e successive modifiche ed integrazioni attestante la "idoneità all'attività agonistica per la pratica del tiro a segno". 
                    <ol>
                        <li>
                            per lo svolgimento dell'attività sportiva del "Target Sprint", considerata la peculiare attività con coinvolgimento di rilevante intensità motoria, la certificazione medica di idoneità all'attività agonistica dovrà essere implementata da esame Elettrocardiogramma sotto sforzo.
                        </li>
                    </ol>
                </li>
            </ol>
        </li>
        <li>
            Versamento della prescritta quota d'iscrizione (quota iscrizione Sezione TSN e quota tesseramento UITS) in esito all'ammissione alla Sezione TSN;
        </li>
        <li>
            due foto recenti formato tessera;
        </li>
        <li>
            produrre un documento di riconoscimento in corso di validità;
        </li>
        <li>
            produrre il tesserino di codicefiscale o tessera sanitaria
        </li>
        <li>
            ai fini dell'esenzione dal corso di cui al punto 4 delle linee guida teorico-pratiche, al momento della richiesta, è necessario venga resa copia conforme all'originale o dichiarazione sostitutiva di certificazione, ai sensi della legge 28 dicembre 2000, n. 445, del foglio di congedo illimitato, rilasciato in data antecedente non oltre i dieci anni, o dello stato di militare al momento della richiesta, o della Licenza di porto di arma in corso di validità.
        </li>
    </ul>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        La documentazione prevista per l'iscrizione alla Sezione TSN nei sopracitati punti a), b), c) dovrà essere presentata o autocertificata, ogni anno, anche da coloro che rinnovano annualmente l'iscrizione, al fine di confermare il mantenimento dei requisiti morali e psico-fisici in ottemperanza a quanto previsto all'art. 4 c.1 dello Statuto delle Sezioni TSN.
    </p>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        Per i minorenni (dal 10° anno di età e fino al compimento del 18° anno di età), la dichiarazione di cui al precedente punto b) deve essere sottoscritta, ai sensi della legge 28 dicembre 2000, n. 445, da entrambi i genitori o da chi esercita la rappresentanza genitoriale.
    </p>
    <br />
    <h3 id="corsi-teorico-pratico" className="text-xl font-semibold my-4">Corso obbligatorio per l'iscrizione</h3>
    <p className="leading-7 [&:not(:first-child)]:mt-6">Il corso è svolto sotto la direzione di un Istruttore o di un Direttore di tiro munito della licenza comunale prevista dall'art. 31 della legge 18 aprile 1975, n. 110.</p>
    <h4 id="prenotazione-dei-corsi" className="font-bold">Prenotazione dei corsi</h4>
    <p className="leading-7 [&:not(:first-child)]:mt-6">Dal giorno dell'iscrizione, è possibile prenotare il corso teorico pratico, facendo trascorrere <strong>non meno di una settimana</strong>. Questo intervallo è necessario per consentire di apprendere le nozioni contenute negli opuscoli scaricabili dai seguenti link.</p>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        <a title="MANUALE DIMA UITS PRIMA PARTE" href="https://www.tsnroma.it/downloads/MANUALE DIMA UITS PRIMA PARTE.pdf">MANUALE DIMA UITS PRIMA PARTE</a><br />
        <a title="MANUALE DIMA UITS SECONDA PARTE" href="https://www.tsnroma.it/downloads/MANUALE DIMA UITS SECONDA PARTE.pdf">MANUALE DIMA UITS SECONDA PARTE</a>
    </p>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        La prenotazione può essere effettuata richiedendola direttamente al nostro operatore, contestualmente al momento dell'iscrizione.
    </p>
    <h4 id="orari-dei-corsi" className="font-bold">Orari dei corsi</h4>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
    Giorni dei corsi: mercoledì e sabato (salvo imprevisti e giorni festivi)
    </p>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
    </p><table>
        <tbody><tr>
            <td>Mattina:&nbsp;</td>
            <td>ore 8.45 presentarsi allo sportello al pubblico</td>
        </tr>
        <tr>
            <td></td>
            <td>ore 9.00 inizio corso</td>
        </tr>
    </tbody></table>
    <p className="leading-7 [&:not(:first-child)]:mt-6"></p>
    <table>
        <tbody><tr>
            <td>Pomeriggio:&nbsp;</td>
            <td>ore 12.45 presentarsi allo sportello al pubblico</td>
        </tr>
        <tr>
            <td></td>
            <td>ore 13.00 inizio corso</td>
        </tr>
    </tbody></table>
    <p className="leading-7 [&:not(:first-child)]:mt-6"></p>
    <h4 id="contenuto-del-corso" className="font-bold">Contenuto del corso</h4>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
        Le lezioni inerenti la parte teorica svolte con ampia e articolata trattazione delle materie inerenti il diritto e l'uso delle armi, si concluderanno con un test basato su domande a risposta multipla, verificando così il grado di apprendimento delle nozioni trattate in aula.
Seguirà fase pratica con armi corte e lunghe.
    </p>
</div>

</div>
        </section>
        </ScrollArea>
    </div>
  );
}

export default Iscrizioni;
