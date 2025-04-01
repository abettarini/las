// OpeningHours.tsx

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import configData from '../data/configurations.json';
import {
  getCurrentSeasonId,
  getOpeningHours,
  isExceptionalOpening,
  isHolidayClosure,
  isSpecialClosure,
  seasonConfigurations
} from './booking/event-type';

type OpeningHoursType = {
    [day: string]: { start: string; end: string }[];
}

const BadgeApertura: React.FC = () => {
  const [status, setStatus] = useState('Siamo chiusi');
  const [openingHours, setOpeningHours] = useState<OpeningHoursType>({});
  const [isClosed, setIsClosed] = useState(false);
  const [closureReason, setClosureReason] = useState<string | null>(null);
  const [isExceptional, setIsExceptional] = useState(false);
  const [exceptionalReason, setExceptionalReason] = useState<string | null>(null);

  useEffect(() => {
    // Aggiorniamo gli orari di apertura in tempo reale
    const updateOpeningHours = () => {
      try {
        const now = new Date();

        // Verifica se è un'apertura eccezionale
        const exceptionalOpening = isExceptionalOpening(now);
        if (exceptionalOpening) {
          setIsClosed(false);
          setClosureReason(null);
          setIsExceptional(true);
          setExceptionalReason(`Apertura straordinaria: ${exceptionalOpening.descrizione}`);
          const hours = getOpeningHours(now);
          setOpeningHours(hours);
          return;
        }

        // Resetta lo stato di apertura eccezionale
        setIsExceptional(false);
        setExceptionalReason(null);

        // Verifica se è un giorno di chiusura festiva
        const holidayClosure = isHolidayClosure(now);
        if (holidayClosure) {
          setIsClosed(true);
          setClosureReason(`Chiuso per ${holidayClosure.descrizione}`);
          return;
        }

        // Verifica se è un giorno di chiusura speciale
        const specialClosure = isSpecialClosure(now);
        if (specialClosure && !specialClosure.orarioRidotto) {
          setIsClosed(true);
          setClosureReason(`Chiuso per ${specialClosure.descrizione}`);
          return;
        }

        // Se non è un giorno di chiusura, ottieni gli orari normali
        setIsClosed(false);
        setClosureReason(null);
        const hours = getOpeningHours(now);
        setOpeningHours(hours);
      } catch (error) {
        console.error('Errore nel recupero degli orari di apertura:', error);
      }
    };

    updateOpeningHours();
    // Aggiorniamo gli orari ogni ora per gestire eventuali cambi di stagione
    const hourlyUpdate = setInterval(updateOpeningHours, 3600000);

    return () => clearInterval(hourlyUpdate);
  }, []);

  useEffect(() => {
    const checkStatus = () => {
      // Se è un giorno di chiusura, non fare ulteriori controlli
      if (isClosed) {
        setStatus('Siamo chiusi');
        return;
      }

      const now = new Date();
      const day = now.toLocaleString('it-IT', { weekday: 'long' }).toLowerCase();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Otteniamo il tempo di notifica dalla configurazione
      const notificationTime = configData.shootingHours?.endBeforeClosingMinutes || 30;

      if (openingHours[day]) {
        for (const period of openingHours[day]) {
          const [startHour, startMinute] = period.start.split(':').map(Number);
          const [endHour, endMinute] = period.end.split(':').map(Number);
          const startTime = startHour * 60 + startMinute;
          const endTime = endHour * 60 + endMinute;

          if (currentTime >= startTime && currentTime < endTime - notificationTime) {
            setStatus('Siamo aperti');
            return;
          } else if (currentTime >= startTime - notificationTime && currentTime < startTime) {
            setStatus('Apre tra poco');
            return;
          } else if (currentTime >= endTime - notificationTime && currentTime < endTime) {
            setStatus('Tra poco chiude');
            return;
          }
        }
      }
      setStatus('Siamo chiusi');
    };

    // Verifichiamo lo stato solo se abbiamo gli orari di apertura e non siamo in un giorno di chiusura
    if (!isClosed && Object.keys(openingHours).length > 0) {
      checkStatus();
      const interval = setInterval(checkStatus, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [openingHours, isClosed]);

  return (
    <div className="flex justify-end">
      {closureReason ? (
        <div className="relative group">
          <Badge className="bg-red-500">Siamo chiusi</Badge>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg p-2 text-sm hidden group-hover:block z-10">
            {closureReason}
          </div>
        </div>
      ) : isExceptional ? (
        <div className="relative group">
          <Badge className="bg-purple-500">Apertura straordinaria</Badge>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg p-2 text-sm hidden group-hover:block z-10">
            {exceptionalReason}
          </div>
        </div>
      ) : (
        <Badge className={`${status === 'Siamo aperti' ? 'bg-green-500' : status === 'Siamo chiusi' ? 'bg-red-500' : 'bg-yellow-500'}`}>
          {status}
        </Badge>
      )}
    </div>
  );
};

const OrariApertura: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<string>('');
  const [seasonData, setSeasonData] = useState<any>(null);

  useEffect(() => {
    const updateSeason = () => {
      const seasonId = getCurrentSeasonId(new Date());
      setCurrentSeason(seasonId);
      if (seasonId && seasonConfigurations[seasonId]) {
        setSeasonData(seasonConfigurations[seasonId]);
      }
    };

    updateSeason();
    // Aggiorniamo la stagione ogni giorno
    const dailyUpdate = setInterval(updateSeason, 86400000);

    return () => clearInterval(dailyUpdate);
  }, []);

  if (!seasonData) {
    return <div>Caricamento orari...</div>;
  }

  // Formatta la data in formato italiano (giorno/mese)
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Data non specificata';
    const [month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  return (
    <div>
      <h3 className="font-bold mb-4">Orari</h3>
      <p>
        Periodo: {formatDate(seasonData.startDate)} - {formatDate(seasonData.endDate)}
      </p>
      <ul className="mt-2 mb-6">
        {Object.entries(seasonData.openingHours).map(([day, hours]: [string, any]) => (
          <li key={day} className="mb-1">
            <strong className="capitalize">{day}:</strong>{' '}
            {hours.map(
              (hour: { start: string; end: string }, index: number) => (
                <span key={index}>
                  {hour.start} - {hour.end}
                  {index < hours.length - 1 ? ', ' : ''}
                </span>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { BadgeApertura as BadgeOrariApertura, OrariApertura };
