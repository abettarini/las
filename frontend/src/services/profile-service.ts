import { User } from '../context/auth-context';
import { API_URL } from '../lib/utils';
import { getTokenFromSession } from './google-auth-service';

// Interfaccia per la risposta API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: User;
  [key: string]: any;
}

// Interfaccia per i dati del profilo utente
export interface ProfileData {
  name?: string;
  picture?: string;
  phone?: string;
  portoArmi?: string;
  scadenzaPortoArmi?: string;
  isSocio?: boolean;
  numeroTessera?: string;
  quotaAnnuale?: boolean;
}

/**
 * Aggiorna il profilo dell'utente
 * @param profileData - Dati del profilo da aggiornare
 * @returns Risposta API con i dati dell'utente aggiornati
 */
export async function updateProfile(profileData: ProfileData): Promise<ApiResponse> {
  try {
    // Ottieni il token di autenticazione
    const token = getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: 'Utente non autenticato'
      };
    }

    // Invia la richiesta di aggiornamento
    const response = await fetch(`${API_URL}/me/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento del profilo'
    };
  }
}

/**
 * Aggiorna la sessione utente con i nuovi dati del profilo
 * @param user - Dati dell'utente aggiornati
 */
export function updateUserSession(user: User): void {
  // Ottieni l'utente corrente dalla sessione
  const userStr = sessionStorage.getItem('user');
  if (!userStr) return;

  try {
    // Aggiorna i dati dell'utente nella sessione
    const currentUser = JSON.parse(userStr);
    const updatedUser = { ...currentUser, ...user };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della sessione utente:', error);
  }
}