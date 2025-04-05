import { User } from '../context/auth-context';
import { API_URL } from '../lib/utils';

// Interfaccia per la risposta API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    isVerified: boolean;
  };
  token?: string;
  authUrl?: string;
  state?: string;
  requiresVerification?: boolean;
  [key: string]: any;
}

/**
 * Inizia il processo di autenticazione con Auth0
 * @returns Risposta API con l'URL di autenticazione Auth0
 */
export async function initiateAuth0Login(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth0/auth/login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Salva lo stato nella sessione per verificarlo in seguito
    if (data.success && data.state) {
      sessionStorage.setItem('auth0_state', data.state);
    }

    return data;
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del login Auth0:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'inizializzazione del login Auth0'
    };
  }
}

/**
 * Gestisce il callback di Auth0
 * @param code - Codice di autorizzazione
 * @param state - Stato per protezione CSRF
 * @returns Risposta API
 */
export async function handleAuth0Callback(code: string, state: string): Promise<ApiResponse> {
  try {
    // Verifica lo stato per protezione CSRF
    const savedState = sessionStorage.getItem('auth0_state');
    if (state !== savedState) {
      return {
        success: false,
        message: 'Stato non valido'
      };
    }

    // Rimuovi lo stato dalla sessione
    sessionStorage.removeItem('auth0_state');

    // Scambia il codice con i token
    const response = await fetch(`${API_URL}/auth0/auth/callback?code=${code}&state=${state}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante la gestione del callback Auth0:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la gestione del callback Auth0'
    };
  }
}

/**
 * Verifica un token JWT
 * @param token - Token JWT
 * @returns Risposta API
 */
export async function verifyToken(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth0/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante la verifica del token:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la verifica del token'
    };
  }
}

/**
 * Aggiorna un token Auth0
 * @param token - Token JWT
 * @returns Risposta API con il nuovo token
 */
export async function refreshToken(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth0/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del token:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento del token'
    };
  }
}

/**
 * Salva le informazioni dell'utente nella sessione
 * @param user - Informazioni dell'utente
 * @param token - Token JWT
 */
export function saveUserSession(user: User, token: string): void {
  sessionStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('token', token);
}

/**
 * Ottiene le informazioni dell'utente dalla sessione
 * @returns Informazioni dell'utente o null se non autenticato
 */
export function getUserFromSession(): User | null {
  const userStr = sessionStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Errore durante il parsing delle informazioni dell\'utente:', error);
    return null;
  }
}

/**
 * Ottiene il token JWT dalla sessione
 * @returns Token JWT o null se non autenticato
 */
export function getTokenFromSession(): string | null {
  return sessionStorage.getItem('token');
}

/**
 * Verifica se l'utente è autenticato
 * @returns true se l'utente è autenticato
 */
export function isAuthenticated(): boolean {
  return !!getUserFromSession() && !!getTokenFromSession();
}

/**
 * Effettua il logout
 */
export function logout(): void {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
}

/**
 * Ottiene l'header di autorizzazione per le richieste API
 * @returns Header di autorizzazione o oggetto vuoto se non autenticato
 */
export function getAuthHeader(): { Authorization?: string } {
  const token = getTokenFromSession();
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`
  };
}

/**
 * Verifica l'email dell'utente utilizzando il token di verifica
 * @param token - Token di verifica dell'email
 * @returns Risposta API
 */
export async function verifyEmail(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante la verifica dell\'email:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la verifica dell\'email'
    };
  }
}

/**
 * Interfaccia per i dati di registrazione
 */
export interface RegistrationData {
  email: string;
  emailConfirmation: string;
  birthDate: string;
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  cfTurnstileResponse: string;
}

/**
 * Registra un nuovo utente
 * @param data - Dati di registrazione
 * @returns Risposta API
 */
export async function registerUser(data: RegistrationData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la registrazione'
    };
  }
}

/**
 * Richiede un link di accesso via email
 * @param email - Indirizzo email dell'utente
 * @returns Risposta API
 * @deprecated Utilizzare Auth0 per l'autenticazione
 */
export async function requestLogin(email: string): Promise<ApiResponse> {
  try {
    // Questa funzione è deprecata e restituisce sempre un errore
    // per incoraggiare l'uso di Auth0
    return {
      success: false,
      message: 'Il sistema di autenticazione via email è stato disabilitato. Utilizza Auth0 per accedere.'
    };

    // Codice originale commentato
    /*
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    return await response.json();
    */
  } catch (error) {
    console.error('Errore durante la richiesta di login:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la richiesta di accesso'
    };
  }
}