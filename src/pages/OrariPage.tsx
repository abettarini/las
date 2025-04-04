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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Orari del Poligono</h1>

      <div className="mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Informazioni Generali</h2>
          <p className="mb-2">
            <span className="font-medium">Inizio attività di tiro:</span> {shootingHours.startAfterOpeningMinutes} minuti dopo l'apertura
          </p>
          <p>
            <span className="font-medium">Fine attività di tiro:</span> {shootingHours.endBeforeClosingMinutes} minuti prima della chiusura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sezione chiusure festive */}
          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Chiusure per Festività</h2>
            <ul className="space-y-2">
              {holidayClosures.map((closure, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-red-200 rounded-full mr-2 mt-0.5 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium">{formatDate(closure.data)}:</span> {closure.descrizione}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sezione chiusure speciali */}
          <div className="bg-amber-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">Chiusure Speciali {new Date().getFullYear()}</h2>
            <ul className="space-y-2">
              {specialClosures.map((closure, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-amber-200 rounded-full mr-2 mt-0.5 flex-shrink-0"></span>
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
          <div className="mt-6 bg-purple-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Aperture Straordinarie {new Date().getFullYear()}</h2>
            <ul className="space-y-2">
              {exceptionalOpenings.map((opening, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-purple-200 rounded-full mr-2 mt-0.5 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium">{formatFullDate(opening.data)}:</span> {opening.descrizione}
                    <div className="text-sm mt-1 italic text-purple-700">
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
            <div key={index} className={`mb-12 ${seasonId === currentSeasonId ? 'bg-green-50 border-2 border-green-300' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              {seasonId === currentSeasonId && (
                <div className="bg-green-500 text-white text-center py-2 px-4 rounded-t-lg mb-4 -mt-6 -mx-6 font-semibold">
                  Attualmente in vigore
                </div>
              )}
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                {seasonName} <span className="text-lg font-normal">({formatDate(season.startDate)} - {formatDate(season.endDate)})</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Giorno</th>
                      <th className="border px-4 py-2 text-center" colSpan={2}>Segreteria</th>
                      <th className="border px-4 py-2 text-center" colSpan={2}>Orari Spari</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2"></th>
                      <th className="border px-4 py-2 text-center">Apertura</th>
                      <th className="border px-4 py-2 text-center">Chiusura</th>
                      <th className="border px-4 py-2 text-center">Inizio</th>
                      <th className="border px-4 py-2 text-center">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(season.openingHours).map(([day, periods], dayIndex) => {
                      return periods.map((period, periodIndex) => {
                        const { shootingStart, shootingEnd } = calculateShootingHours(period.start, period.end);

                        return (
                          <tr key={`${dayIndex}-${periodIndex}`} className={periodIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {periodIndex === 0 && (
                              <td className="border px-4 py-2 font-medium capitalize" rowSpan={periods.length}>
                                {capitalize(day)}
                              </td>
                            )}
                            <td className="border px-4 py-2 text-center">{period.start}</td>
                            <td className="border px-4 py-2 text-center">{period.end}</td>
                            <td className="border px-4 py-2 text-center">{shootingStart}</td>
                            <td className="border px-4 py-2 text-center">{shootingEnd}</td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                <h3 className="font-semibold text-yellow-800 mb-2">Note Importanti:</h3>
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