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
  };
  token?: string;
  authUrl?: string;
  state?: string;
  requiresVerification?: boolean;
  [key: string]: any;
}

/**
 * Inizia il processo di autenticazione con Keycloak
 * @returns Risposta API con l'URL di autenticazione Keycloak
 */
export async function initiateKeycloakLogin(): Promise<ApiResponse> {
  try {
    // Costruisci l'URL di callback
    const callbackUrl = `${window.location.origin}/auth/callback`;
    
    // Richiedi l'URL di autenticazione Keycloak
    const response = await fetch(`${API_URL}/auth/login?redirect_uri=${encodeURIComponent(callbackUrl)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Salva lo stato nella sessione per verificarlo in seguito
    if (data.success && data.state) {
      sessionStorage.setItem('keycloak_state', data.state);
    }

    return data;
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del login Keycloak:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'inizializzazione del login Keycloak'
    };
  }
}

/**
 * Gestisce il callback di Keycloak
 * @param code - Codice di autorizzazione
 * @param state - Stato per protezione CSRF
 * @returns Risposta API
 */
export async function handleKeycloakCallback(code: string, state: string): Promise<ApiResponse> {
  try {
    // Verifica lo stato per protezione CSRF
    const savedState = sessionStorage.getItem('keycloak_state');
    if (state !== savedState) {
      return {
        success: false,
        message: 'Stato non valido'
      };
    }

    // Rimuovi lo stato dalla sessione
    sessionStorage.removeItem('keycloak_state');

    // Scambia il codice con i token
    const response = await fetch(`${API_URL}/auth/callback?code=${code}&state=${state}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Errore durante la gestione del callback Keycloak:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la gestione del callback Keycloak'
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
    const response = await fetch(`${API_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    // Adatta la risposta al formato atteso
    if (response.ok) {
      return {
        success: true,
        message: 'Token valido',
        user: {
          id: data.sub,
          email: data.email,
          isVerified: true,
          name: data.name
        },
        token: token
      };
    } else {
      return {
        success: false,
        message: data.error_description || 'Token non valido'
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
 * Aggiorna un token Keycloak
 * @param refreshToken - Refresh token
 * @returns Risposta API con il nuovo token
 */
export async function refreshToken(refreshToken: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: 'Token aggiornato con successo',
        token: data.jwt_token,
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token
      };
    } else {
      return {
        success: false,
        message: data.error_description || 'Errore durante l\'aggiornamento del token'
      };
    }
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
 * @param accessToken - Access token di Keycloak
 * @param idToken - ID token di Keycloak
 * @param refreshToken - Refresh token di Keycloak
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
    sessionStorage.setItem('access_token', accessToken);
  }
  
  if (idToken) {
    sessionStorage.setItem('id_token', idToken);
  }
  
  if (refreshToken) {
    sessionStorage.setItem('refresh_token', refreshToken);
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
 * Ottiene il refresh token dalla sessione
 * @returns Refresh token o null se non disponibile
 */
export function getRefreshTokenFromSession(): string | null {
  return sessionStorage.getItem('refresh_token');
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
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('id_token');
  sessionStorage.removeItem('refresh_token');
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