import { useAuth } from '@/context/auth-context';
import React, { useState } from 'react';
import BookingConfirmation from './booking-confirmation';
import BookingForm, { BookingFormValues } from './booking-form';
import UserBookings from './user-bookings';

const BookingComponent: React.FC = () => {
  // Autenticazione
  const { isAuthenticated, token } = useAuth();

  // Stato per gestire il caricamento e gli errori
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Stato per memorizzare l'URL di cancellazione e la secret key
  const [cancelUrl, setCancelUrl] = useState<string | null>(null);
  const [cancelSecret, setCancelSecret] = useState<string | null>(null);

  // Ottieni l'URL dell'API dall'ambiente
  const apiUrl = import.meta.env.VITE_API_URL;

  // Funzione per gestire l'invio del form
  const onSubmit = async (data: BookingFormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      setCancelUrl(null);
      setCancelSecret(null);

      console.log('Invio della prenotazione...');
      console.log('Dati del form:', data);

      // Invia i dati al service worker di Cloudflare
      const response = await fetch(`${apiUrl}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Si è verificato un errore durante l\'invio della prenotazione');
      }

      // Gestisci la risposta di successo
      setSubmitSuccess(true);
      setBookingId(result.bookingId);

      // Salva l'URL di cancellazione e la secret key
      if (result.cancelUrl) {
        setCancelUrl(result.cancelUrl);
      }

      if (result.cancelSecret) {
        setCancelSecret(result.cancelSecret);
      }

    } catch (error) {
      console.error('Errore durante l\'invio della prenotazione:', error);
      setSubmitError(error instanceof Error ? error.message : 'Si è verificato un errore sconosciuto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {submitSuccess ? (
        <BookingConfirmation
          bookingId={bookingId}
          cancelUrl={cancelUrl}
          cancelSecret={cancelSecret}
          onNewBooking={() => {
            setSubmitSuccess(false);
            setBookingId(null);
            setCancelUrl(null);
            setCancelSecret(null);
          }}
        />
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Componente prenotazioni utente (visibile solo se autenticato e ci sono prenotazioni) */}
          <UserBookings isAuthenticated={isAuthenticated} token={token} />

          {/* Form di prenotazione */}
          <BookingForm
            onSubmit={onSubmit}
            submitError={submitError}
            isSubmitting={isSubmitting}
            apiUrl={apiUrl}
          />
        </div>
      )}
    </div>
  );
};

export default BookingComponent;