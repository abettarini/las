import React from 'react';
import configurations from '../data/configurations.json';

interface EventTypeProps {
  eventType: string;
}

const EventType: React.FC<EventTypeProps> = ({ eventType }) => {
  const { eventTypes } = configurations;
  const eventDetails = eventTypes[eventType];

  if (!eventDetails) {
    return <p>Tipo di evento non trovato.</p>;
  }

  return (
    <div>
      <h2>{eventType}</h2>
      <p>Massimo prenotazioni: {eventDetails.maxBookings}</p>
      <p>Raccomandazioni: {eventDetails.recommendations}</p>
      <p>
        Prenotazione minima richiesta: {eventDetails.minAdvanceBooking.value}{' '}
        {eventDetails.minAdvanceBooking.unit}
      </p>
    </div>
  );
};

export default EventType;
