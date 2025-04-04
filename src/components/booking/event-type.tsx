// Importazione del tipo di configurazione dal file JSON
import configData from '../../data/calendars.json';

// Definizione dei tipi basati sulla struttura del file JSON
type EventType = keyof typeof configData.eventTypes;

interface EventTypeConfig {
  label: string;
  maxBookings: number;
  recommendations: string;
  minAdvanceBooking: AdvanceBookingTime; // Tempo minimo di anticipo (ore o giorni)
}

interface EventSchedule {
  availableDays: Record<string, string[]>; // Mappa giorno -> orari disponibili
}

interface SeasonConfig {
  startDate: string; // formato 'MM-DD' (mese-giorno)
  endDate: string; // formato 'MM-DD' (mese-giorno)
  eventSchedules: Record<string, EventSchedule>;
  openingHours: Record<string, { start: string; end: string }[]>;
}

interface AdvanceBookingTime {
  value: number;
  unit: 'hours' | 'days';
}

interface ChiusuraFestiva {
  data: string; // formato 'MM-DD' (mese-giorno)
  descrizione: string;
}

interface ChiusuraSpeciale {
  data: string; // formato 'YYYY-MM-DD'
  descrizione: string;
  dataFine?: string; // formato 'YYYY-MM-DD', opzionale per periodi di chiusura
  orarioRidotto?: { start: string; end: string }; // opzionale per orari ridotti
}

interface AperturaEccezionale {
  data: string; // formato 'YYYY-MM-DD'
  descrizione: string;
  orario: { start: string; end: string };
}

// Utilizzo della configurazione dal file JSON
const eventTypes: Record<EventType, EventTypeConfig> = configData.eventTypes as Record<EventType, EventTypeConfig>;
const seasonConfigurations: Record<string, SeasonConfig> = configData.orari as Record<string, SeasonConfig>;
const chiusureFestive: ChiusuraFestiva[] = configData.calendar.chiusureFestive as ChiusuraFestiva[];
const chiusureSpeciali: ChiusuraSpeciale[] = configData.calendar.chiusureSpeciali as ChiusuraSpeciale[];
const apertureEccezionali: AperturaEccezionale[] = configData.calendar.apertureEccezionali as AperturaEccezionale[] || [];

/**
 * Determina se una data è all'interno di un intervallo stagionale
 * @param date - La data da verificare
 * @param startDate - Data di inizio nel formato 'MM-DD'
 * @param endDate - Data di fine nel formato 'MM-DD'
 * @returns true se la data è all'interno dell'intervallo
 */
const isDateInSeason = (date: Date, startDate: string, endDate: string): boolean => {
  const currentYear = date.getFullYear();
  const [startMonth, startDay] = startDate.split('-').map(Number);
  const [endMonth, endDay] = endDate.split('-').map(Number);

  // Crea oggetti Date per le date di inizio e fine nella stagione corrente
  const seasonEnd = new Date(currentYear, endMonth - 1, endDay);
  const seasonStart = new Date(currentYear, startMonth - 1, startDay);

  // Gestisce il caso in cui la stagione attraversa il cambio di anno (es. inverno)
  if (startMonth > endMonth) {
    // Se siamo prima della fine dell'anno
    if (date.getMonth() + 1 >= startMonth) {
      return date >= seasonStart;
    }
    // Se siamo all'inizio dell'anno successivo
    else if (date.getMonth() + 1 <= endMonth) {
      return date <= seasonEnd;
    }
    return false;
  }

  // Caso normale: la stagione è all'interno dello stesso anno
  return date >= seasonStart && date <= seasonEnd;
};

/**
 * Ottiene il tipo di stagione corrente in base alla data
 * @param date - La data per cui determinare la stagione (default: data corrente)
 * @returns Il tipo di stagione ('orarioEstivo' o 'orarioInvernale')
 */
export const getCurrentSeasonId = (date: Date = new Date()): string => {
  for (const season of Object.keys(seasonConfigurations)) {
    // Verifica che la stagione abbia le proprietà startDate e endDate
    if (seasonConfigurations[season] &&
        seasonConfigurations[season].startDate &&
        seasonConfigurations[season].endDate) {

      const startDate = seasonConfigurations[season].startDate;
      const endDate = seasonConfigurations[season].endDate;

      if (isDateInSeason(date, startDate, endDate)) {
        return season;
      }
    }
  }

  // Se non viene trovata nessuna stagione, restituisci la prima stagione valida disponibile
  for (const season of Object.keys(seasonConfigurations)) {
    if (seasonConfigurations[season] &&
        seasonConfigurations[season].startDate &&
        seasonConfigurations[season].endDate) {
      return season;
    }
  }

  // Se non ci sono stagioni valide, restituisci una stringa vuota
  return '';
};

/**
 * Verifica se una data corrisponde a una chiusura festiva annuale
 * @param date - La data da verificare
 * @returns Oggetto chiusura festiva se la data è una festività, altrimenti null
 */
export const isHolidayClosure = (date: Date): ChiusuraFestiva | null => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateString = `${month}-${day}`;

  const holiday = chiusureFestive.find(h => h.data === dateString);
  return holiday || null;
};

/**
 * Verifica se una data corrisponde a una chiusura speciale
 * @param date - La data da verificare
 * @returns Oggetto chiusura speciale se la data è una chiusura speciale, altrimenti null
 */
export const isSpecialClosure = (date: Date): ChiusuraSpeciale | null => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // Cerca chiusure per data singola
  const closure = chiusureSpeciali.find(c => c.data === dateString);
  if (closure) return closure;

  // Cerca chiusure per intervallo di date
  const rangeClosures = chiusureSpeciali.filter(c => c.dataFine);
  for (const rangeClosure of rangeClosures) {
    if (!rangeClosure.dataFine) continue;

    const startDate = new Date(rangeClosure.data);
    const endDate = new Date(rangeClosure.dataFine);

    if (date >= startDate && date <= endDate) {
      return rangeClosure;
    }
  }

  return null;
};

/**
 * Verifica se una data corrisponde a un'apertura eccezionale
 * @param date - La data da verificare
 * @returns Oggetto apertura eccezionale se la data è un'apertura eccezionale, altrimenti null
 */
export const isExceptionalOpening = (date: Date): AperturaEccezionale | null => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // Cerca aperture eccezionali per la data specificata
  const opening = apertureEccezionali.find(a => a.data === dateString);
  return opening || null;
};

/**
 * Verifica se il poligono è aperto in una data e ora specifiche
 * @param date - La data e ora da verificare
 * @returns true se il poligono è aperto, false altrimenti
 */
export const isPoligonoOpen = (date: Date = new Date()): boolean => {
  // Verifica se è un'apertura eccezionale
  const exceptionalOpening = isExceptionalOpening(date);
  if (exceptionalOpening) {
    // Verifica se l'ora corrente è all'interno dell'orario di apertura eccezionale
    const currentTime = date.getHours() * 60 + date.getMinutes();
    const { start, end } = exceptionalOpening.orario;
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime < endTime;
  }

  // Verifica se è un giorno di chiusura festiva
  if (isHolidayClosure(date)) {
    return false;
  }

  // Verifica se è un giorno di chiusura speciale
  const specialClosure = isSpecialClosure(date);
  if (specialClosure && !specialClosure.orarioRidotto) {
    return false;
  }

  // Ottieni il giorno della settimana in italiano
  const day = date.toLocaleString('it-IT', { weekday: 'long' }).toLowerCase();

  // Ottieni gli orari di apertura per la stagione corrente
  try {
    const openingHours = getOpeningHours(date);

    // Se non ci sono orari per questo giorno, il poligono è chiuso
    if (!openingHours[day]) {
      return false;
    }

    // Verifica se l'ora corrente è all'interno degli orari di apertura
    const currentTime = date.getHours() * 60 + date.getMinutes();

    // Se è un giorno con orario ridotto, usa quell'orario
    if (specialClosure && specialClosure.orarioRidotto) {
      const { start, end } = specialClosure.orarioRidotto;
      const [startHour, startMinute] = start.split(':').map(Number);
      const [endHour, endMinute] = end.split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      return currentTime >= startTime && currentTime < endTime;
    }

    // Altrimenti usa gli orari normali
    for (const period of openingHours[day]) {
      const [startHour, startMinute] = period.start.split(':').map(Number);
      const [endHour, endMinute] = period.end.split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      if (currentTime >= startTime && currentTime < endTime) {
        return true;
      }
    }
  } catch (error) {
    console.error('Errore nel controllo degli orari di apertura:', error);
    return false;
  }

  return false;
};

/**
 * Ottiene la configurazione globale dell'evento
 * @param eventType - Il tipo di evento
 * @returns La configurazione globale dell'evento
 */
export const getEventTypeConfig = (eventType: EventType): EventTypeConfig => {
  return eventTypes[eventType];
};

/**
 * Ottiene la label dell'evento per la visualizzazione
 * @param eventType - Il tipo di evento
 * @returns La label dell'evento
 */
export const getEventTypeLabel = (eventType: EventType): string => {
  return eventTypes[eventType]?.label || eventType;
};

/**
 * Ottiene la configurazione dell'evento per la stagione corrente
 * @param eventType - Il tipo di evento
 * @param date - La data per cui determinare la configurazione (default: data corrente)
 * @returns La configurazione dell'evento per la stagione appropriata
 */
export const getEventSchedule = (eventType: EventType, date: Date = new Date()): EventSchedule => {
  const seasonId = getCurrentSeasonId(date);
  return seasonConfigurations[seasonId].eventSchedules[eventType];
};

/**
 * Calcola la data minima di prenotazione in base al tempo di anticipo richiesto
 * @param advanceBooking - Configurazione del tempo di anticipo
 * @returns La data minima per la prenotazione
 */
export const getMinBookingDate = (advanceBooking: AdvanceBookingTime): Date => {
  const now = new Date();

  if (advanceBooking.unit === 'hours') {
    return new Date(now.getTime() + advanceBooking.value * 60 * 60 * 1000);
  } else {
    const minDate = new Date(now);
    minDate.setDate(now.getDate() + advanceBooking.value);
    return minDate;
  }
};

/**
 * Formatta il tempo di anticipo in un formato leggibile
 * @param advanceBooking - Configurazione del tempo di anticipo
 * @returns Stringa formattata (es. "24 ore" o "3 giorni")
 */
export const formatAdvanceBookingTime = (advanceBooking: AdvanceBookingTime): string => {
  if (advanceBooking.unit === 'hours') {
    return `${advanceBooking.value} ${advanceBooking.value === 1 ? 'ora' : 'ore'}`;
  } else {
    return `${advanceBooking.value} ${advanceBooking.value === 1 ? 'giorno' : 'giorni'}`;
  }
};

/**
 * Ottiene gli orari di apertura per la stagione corrente
 * @param date - La data per cui determinare gli orari (default: data corrente)
 * @returns Gli orari di apertura per la stagione appropriata
 */
export const getOpeningHours = (date: Date = new Date()): Record<string, { start: string; end: string }[]> => {
  // Verifica se è un'apertura eccezionale
  const exceptionalOpening = isExceptionalOpening(date);
  if (exceptionalOpening) {
    const day = date.toLocaleString('it-IT', { weekday: 'long' }).toLowerCase();
    const result: Record<string, { start: string; end: string }[]> = {};
    result[day] = [exceptionalOpening.orario];
    return result;
  }

  const seasonId = getCurrentSeasonId(date);
  if (!seasonId) {
    throw new Error('Non è stata trovata alcuna configurazione di stagione.');
  }

  // Verifica se è un giorno con orario ridotto
  const specialClosure = isSpecialClosure(date);
  if (specialClosure && specialClosure.orarioRidotto) {
    const day = date.toLocaleString('it-IT', { weekday: 'long' }).toLowerCase();
    const result: Record<string, { start: string; end: string }[]> = {};
    result[day] = [specialClosure.orarioRidotto];
    return result;
  }

  return seasonConfigurations[seasonId].openingHours;
};

/**
 * Ottiene tutte le chiusure festive
 * @returns Array di chiusure festive
 */
export const getHolidayClosures = (): ChiusuraFestiva[] => {
  return chiusureFestive;
};

/**
 * Ottiene tutte le chiusure speciali
 * @returns Array di chiusure speciali
 */
export const getSpecialClosures = (): ChiusuraSpeciale[] => {
  return chiusureSpeciali;
};

/**
 * Ottiene tutte le aperture eccezionali
 * @returns Array di aperture eccezionali
 */
export const getExceptionalOpenings = (): AperturaEccezionale[] => {
  return apertureEccezionali;
};

export { apertureEccezionali, chiusureFestive, chiusureSpeciali, eventTypes, seasonConfigurations };
export type { AdvanceBookingTime, AperturaEccezionale, ChiusuraFestiva, ChiusuraSpeciale, EventSchedule, EventType, EventTypeConfig, SeasonConfig };

