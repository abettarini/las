import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getTokenFromSession, getUserFromSession, logout, verifyToken } from '../services/google-auth-service';

// Interfaccia per l'utente
export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  name?: string;
  picture?: string;
  phone?: string;
  portoArmi?: string;
  scadenzaPortoArmi?: string;
  isSocio?: boolean;
  numeroTessera?: string;
  quotaAnnuale?: boolean;
}

// Interfaccia per il contesto di autenticazione
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  setAuthInfo: (user: User, token: string) => void;
}

// Crea il contesto di autenticazione
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contesto di autenticazione
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica lo stato di autenticazione all'avvio
  useEffect(() => {
    const checkAuth = async () => {
      // Verifica se ci sono informazioni di autenticazione nella sessione
      const sessionUser = getUserFromSession();
      const sessionToken = getTokenFromSession();

      if (sessionUser && sessionToken) {
        // Verifica la validità del token
        const response = await verifyToken(sessionToken);

        if (response.success) {
          // Token valido, imposta le informazioni di autenticazione
          setUser(response.user!);
          setToken(response.token!);
        } else {
          // Token non valido, effettua il logout
          logout();
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Funzione per impostare le informazioni di autenticazione
  const setAuthInfo = (user: User, token: string) => {
    setUser(user);
    setToken(token);
  };

  // Valore del contesto
  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    logout: () => {
      logout();
      setUser(null);
      setToken(null);
    },
    setAuthInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook per utilizzare il contesto di autenticazione
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}