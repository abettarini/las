// OpeningHours.tsx

import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';

type OpeningHoursType = {
    [day: string]: { start: string; end: string }[];
}

const openingHours: OpeningHoursType = {
    martedì: [{ start: '09:30', end: '12:45' }, { start: '15:30', end: '18:45' }],
    venerdì: [{ start: '09:30', end: '12:45' }, { start: '15:30', end: '18:45' }],
    sabato: [{ start: '09:30', end: '12:45' }, { start: '15:30', end: '18:45' }],
    domenica: [{ start: '09:30', end: '12:45' }],  
};

const BadgeApertura: React.FC = () => {
  const [status, setStatus] = useState('Siamo chiusi');

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.toLocaleString('it-IT', { weekday: 'long' });
      console.log('Day', now)
      const currentTime = now.getHours() * 60 + now.getMinutes();

      if (openingHours[day]) {
        for (const period of openingHours[day]) {
          const [startHour, startMinute] = period.start.split(':').map(Number);
          const [endHour, endMinute] = period.end.split(':').map(Number);
          const startTime = startHour * 60 + startMinute;
          const endTime = endHour * 60 + endMinute;

          console.log('Start', startTime, 'End', endTime, 'Current', currentTime);
          if (currentTime >= startTime && currentTime < endTime - 30) {
            setStatus('Siamo aperti');
            return;
          } else if (currentTime >= startTime - 30 && currentTime < startTime) {
            setStatus('Apre tra poco');
            return;
          } else if (currentTime >= endTime - 30 && currentTime < endTime) {
            setStatus('Tra poco chiude');
            return;
          }
        }
      }
      setStatus('Siamo chiusi');
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-end">
        <Badge className={`${status === 'Siamo aperti' ? 'bg-green-500' : status === 'Siamo chiusi' ? 'bg-red-500' : 'bg-yellow-500'}`}>{status}</Badge>
    </div>
  );
};

const OrariApertura: React.FC = () => {
    return (
      <div>
        <h3 className="font-bold mb-4">Orari</h3>
        <p className="text-muted-foreground">
            {Object.entries(openingHours).map(([day, periods]) => (
            <div key={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}: {periods.map(period => `${period.start} - ${period.end}`).join(', ')}<br />
            </div>
            ))}
        </p>
      </div>
    );
  };

export { BadgeApertura as BadgeOrariApertura, OrariApertura };
