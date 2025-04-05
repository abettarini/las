// Interfaccia per i dati della prenotazione
export interface BookingData {
  id: string;
  eventType: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  seasonId: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  cancelSecret?: string;
}

// Interfaccia per la risposta API
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  booking?: T;
  requiresSecret?: boolean;
}

// URL base per le API
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Ottiene i dettagli di una prenotazione
 * @param id - ID della prenotazione
 * @returns Risposta API con i dati della prenotazione
 */
export async function getBooking(id: string): Promise<ApiResponse<BookingData>> {
  try {
    const response = await fetch(`${API_URL}/booking/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore durante il recupero della prenotazione:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante il recupero della prenotazione'
    };
  }
}

/**
 * Verifica la validità di una secret key
 * @param id - ID della prenotazione
 * @param secret - Secret key da verificare
 * @returns Risposta API con l'esito della verifica
 */
export async function verifyBookingSecret(id: string, secret: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_URL}/booking/${id}/verify-secret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secret })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore durante la verifica della secret key:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la verifica della secret key'
    };
  }
}

/**
 * Annulla una prenotazione
 * @param id - ID della prenotazione
 * @param secret - Secret key per l'autorizzazione
 * @returns Risposta API con l'esito dell'annullamento
 */
export async function cancelBooking(id: string, secret: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_URL}/booking/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secret })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore durante l\'annullamento della prenotazione:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'annullamento della prenotazione'
    };
  }
}

/**
 * Interfaccia per la risposta delle prenotazioni utente
 */
interface UserBookingsResponse {
  success: boolean;
  message?: string;
  bookings?: BookingData[];
}

/**
 * Ottiene le prenotazioni dell'utente autenticato
 * @param token - Token di autenticazione
 * @returns Risposta API con le prenotazioni dell'utente
 */
export async function getUserBookings(token: string): Promise<UserBookingsResponse> {
  try {
    const response = await fetch(`${API_URL}/booking/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore durante il recupero delle prenotazioni dell\'utente:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante il recupero delle prenotazioni'
    };
  }
}