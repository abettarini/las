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
  requiresVerification?: boolean;
  [key: string]: any;
}

// Interfaccia per i dati di registrazione
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
 * Verifica l'email di un utente
 * @param token - Token di verifica
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
 * Richiede l'autenticazione (login)
 * @param email - Email dell'utente
 * @returns Risposta API
 */
export async function requestLogin(email: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Errore durante la richiesta di login:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante la richiesta di login'
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
    const response = await fetch(`${API_URL}/auth/verify-token`, {
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
 * Salva le informazioni dell'utente nella sessione
 * @param user - Informazioni dell'utente
 * @param token - Token JWT
 */
export function saveUserSession(user: { id: string; email: string; isVerified: boolean }, token: string): void {
  sessionStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('token', token);
}

/**
 * Ottiene le informazioni dell'utente dalla sessione
 * @returns Informazioni dell'utente o null se non autenticato
 */
export function getUserFromSession(): { id: string; email: string; isVerified: boolean } | null {
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