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
    name?: string;
    picture?: string;
    phone?: string;
  };
  token?: string;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  authUrl?: string;
  state?: string;
  [key: string]: any;
}

/**
 * Inizia il processo di autenticazione con Google
 * @returns Risposta API con l'URL di autenticazione Google
 */
export async function initiateGoogleLogin(): Promise<ApiResponse> {
  try {
    // Costruisci l'URL di callback
    const callbackUrl = `${window.location.origin}/auth/google/callback`;
    
    // Richiedi l'URL di autenticazione Google
    const response = await fetch(`${API_URL}/auth/google/login?redirect_uri=${encodeURIComponent(callbackUrl)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Salva lo stato nella sessione per verificarlo in seguito
    if (data.success && data.state) {
      sessionStorage.setItem('google_state', data.state);
    }

    return data;
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del login Google:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'inizializzazione del login Google'
    };
  }
}

/**
 * Gestisce il callback di Google
 * @param code - Codice di autorizzazione
 * @param state - Stato per protezione CSRF
 * @returns Risposta API
 */
export async function handleGoogleCallback(code: string, state: string): Promise<ApiResponse> {
  try {
    // Verifica lo stato per protezione CSRF
    const savedState = sessionStorage.getItem('google_state');
    if (state !== savedState) {
      return {
        success: false,
        message: 'Stato non valido'
      };
    }

    // Rimuovi lo stato dalla sessione
    sessionStorage.removeItem('google_state');

    // Scambia il codice con i token
    const response = await fetch(`${API_URL}/auth/google/callback?code=${code}&state=${state}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante la gestione del callback Google:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la gestione del callback Google'
    };
  }
}

/**
 * Salva le informazioni dell'utente nella sessione
 * @param user - Informazioni dell'utente
 * @param token - Token JWT
 * @param accessToken - Access token di Google
 * @param idToken - ID token di Google
 * @param refreshToken - Refresh token di Google
 */
export function saveUserSession(
  user: User, 
  token: string, 
  accessToken?: string, 
  idToken?: string, 
  refreshToken?: string
): void {
  sessionStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('token', token);
  
  if (accessToken) {
    sessionStorage.setItem('google_access_token', accessToken);
  }
  
  if (idToken) {
    sessionStorage.setItem('google_id_token', idToken);
  }
  
  if (refreshToken) {
    sessionStorage.setItem('google_refresh_token', refreshToken);
  }
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
 * Verifica un token JWT
 * @param token - Token JWT
 * @returns Risposta API
 */
export async function verifyToken(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    // Adatta la risposta al formato atteso
    if (response.ok) {
      // Assicurati che l'utente abbia un nome
      const user = data.user ? {
        ...data.user,
        // Se il nome non è fornito dal backend, estrai il nome dall'email
        name: data.user.name || (data.user.email ? data.user.email.split('@')[0] : undefined)
      } : undefined;

      return {
        success: true,
        message: 'Token valido',
        user: user,
        token: token
      };
    } else {
      return {
        success: false,
        message: data.message || 'Token non valido'
      };
    }
  } catch (error) {
    console.error('Errore durante la verifica del token:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la verifica del token'
    };
  }
}

/**
 * Effettua il logout
 */
export function logout(): void {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('google_access_token');
  sessionStorage.removeItem('google_id_token');
  sessionStorage.removeItem('google_refresh_token');
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