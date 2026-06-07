import {
  getCurrentSeasonId,
  getExceptionalOpenings,
  getHolidayClosures,
  getSpecialClosures,
  seasonConfigurations
} from '@/components/booking/event-type';

import React from 'react';
import configurations from '../data/calendars.json';

const OrariPage: React.FC = () => {
  const { shootingHours } = configurations;
  const holidayClosures = getHolidayClosures();
  const specialClosures = getSpecialClosures();
  const exceptionalOpenings = getExceptionalOpenings();

  // Ottieni l'ID della stagione corrente
  const currentSeasonId = getCurrentSeasonId(new Date());

  // Funzione per calcolare gli orari di sparo in base agli orari di apertura e chiusura
  const calculateShootingHours = (openingTime: string, closingTime: string) => {
    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);

    const openingDate = new Date(0, 0, 0, openHour, openMinute);
    const closingDate = new Date(0, 0, 0, closeHour, closeMinute);

    const shootingStart = new Date(openingDate.getTime() + shootingHours.startAfterOpeningMinutes * 60000);
    const shootingEnd = new Date(closingDate.getTime() - shootingHours.endBeforeClosingMinutes * 60000);

    const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

    return {
      shootingStart: formatTime(shootingStart),
      shootingEnd: formatTime(shootingEnd),
    };
  };

  // Funzione per formattare la data in formato italiano (giorno/mese)
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Data non specificata';
    const [month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  // Funzione per formattare la data completa in formato italiano (giorno/mese/anno)
  const formatFullDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Data non specificata';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Funzione per capitalizzare la prima lettera
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="orari-container">
      <h1 className="orari-heading">Orari del Poligono</h1>

      <div className="mb-8">
        <div className="orari-info-box">
          <h2 className="orari-info-heading">Informazioni Generali</h2>
          <p className="mb-2">
            <span className="font-medium">Inizio attività di tiro:</span> {shootingHours.startAfterOpeningMinutes} minuti dopo l'apertura
          </p>
          <p>
            <span className="font-medium">Fine attività di tiro:</span> {shootingHours.endBeforeClosingMinutes} minuti prima della chiusura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sezione chiusure festive */}
          <div className="orari-closures-box">
            <h2 className="orari-closures-heading">Chiusure per Festività</h2>
            <ul className="space-y-2">
              {holidayClosures.map((closure, index) => (
                <li key={index} className="flex items-start">
                  <span className="orari-bullet orari-bullet-red"></span>
                  <div>
                    <span className="font-medium">{formatDate(closure.data)}:</span> {closure.descrizione}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sezione chiusure speciali */}
          <div className="orari-special-box">
            <h2 className="orari-special-heading">Chiusure Speciali {new Date().getFullYear()}</h2>
            <ul className="space-y-2">
              {specialClosures.map((closure, index) => (
                <li key={index} className="flex items-start">
                  <span className="orari-bullet orari-bullet-amber"></span>
                  <div>
                    {closure.dataFine ? (
                      <span>
                        <span className="font-medium">{formatFullDate(closure.data)} - {formatFullDate(closure.dataFine)}:</span> {closure.descrizione}
                      </span>
                    ) : closure.orarioRidotto ? (
                      <span>
                        <span className="font-medium">{formatFullDate(closure.data)}:</span> {closure.descrizione}
                        <div className="text-sm mt-1 italic">Orario ridotto: {closure.orarioRidotto.start} - {closure.orarioRidotto.end}</div>
                      </span>
                    ) : (
                      <span>
                        <span className="font-medium">{formatFullDate(closure.data)}:</span> {closure.descrizione}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sezione aperture eccezionali */}
        {exceptionalOpenings.length > 0 && (
          <div className="orari-openings-box">
            <h2 className="orari-openings-heading">Aperture Straordinarie {new Date().getFullYear()}</h2>
            <ul className="space-y-2">
              {exceptionalOpenings.map((opening, index) => (
                <li key={index} className="flex items-start">
                  <span className="orari-bullet orari-bullet-purple"></span>
                  <div>
                    <span className="font-medium">{formatFullDate(opening.data)}:</span> {opening.descrizione}
                    <div className="orari-openings-time">
                      Orario: {opening.orario.start} - {opening.orario.end}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {Object.keys(seasonConfigurations)
        .map((seasonId, index) => {
          const season = seasonConfigurations[seasonId];
          const seasonName = seasonId === 'orarioEstivo' ? 'Orario Estivo' : 'Orario Invernale';

          return (
            <div key={index} className={`orari-season-box ${seasonId === currentSeasonId ? 'orari-season-active' : ''}`}>
              {seasonId === currentSeasonId && (
                <div className="orari-season-active-banner">
                  Attualmente in vigore
                </div>
              )}
              <h2 className="orari-season-heading">
                {seasonName} <span className="text-lg font-normal">({formatDate(season.startDate)} - {formatDate(season.endDate)})</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="orari-table">
                  <thead>
                    <tr className="orari-table-header">
                      <th className="orari-table-cell text-left">Giorno</th>
                      <th className="orari-table-cell text-center" colSpan={2}>Segreteria</th>
                      <th className="orari-table-cell text-center" colSpan={2}>Orari Spari</th>
                    </tr>
                    <tr className="orari-table-subheader">
                      <th className="orari-table-cell"></th>
                      <th className="orari-table-cell text-center">Apertura</th>
                      <th className="orari-table-cell text-center">Chiusura</th>
                      <th className="orari-table-cell text-center">Inizio</th>
                      <th className="orari-table-cell text-center">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(season.openingHours).map(([day, periods], dayIndex) => {
                      return periods.map((period, periodIndex) => {
                        const { shootingStart, shootingEnd } = calculateShootingHours(period.start, period.end);

                        return (
                          <tr key={`${dayIndex}-${periodIndex}`} className={periodIndex % 2 === 0 ? 'orari-table-row-even' : 'orari-table-row-odd'}>
                            {periodIndex === 0 && (
                              <td className="orari-table-cell font-medium capitalize" rowSpan={periods.length}>
                                {capitalize(day)}
                              </td>
                            )}
                            <td className="orari-table-cell text-center">{period.start}</td>
                            <td className="orari-table-cell text-center">{period.end}</td>
                            <td className="orari-table-cell text-center">{shootingStart}</td>
                            <td className="orari-table-cell text-center">{shootingEnd}</td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div className="orari-notes-box">
                <h3 className="orari-notes-heading">Note Importanti:</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li className="mb-1">Gli orari possono subire variazioni in occasione di gare o eventi speciali.</li>
                  <li className="mb-1">La domenica pomeriggio e il lunedì mattina sono riservati alla manutenzione.</li>
                  <li>Per informazioni aggiornate, contattare la segreteria.</li>
                </ul>
              </div>
            </div>
          );
        })}


    </div>
  );
};

export default OrariPage;