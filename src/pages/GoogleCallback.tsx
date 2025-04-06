import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '../components/ui/spinner';
import { useAuth } from '../context/auth-context';
import { handleGoogleCallback, saveUserSession } from '../services/google-auth-service';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function processCallback() {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          setError('Parametri mancanti nella risposta di Google');
          setIsProcessing(false);
          return;
        }

        // Verifica se siamo in modalità mock (sviluppo locale)
        const isMockMode = code === 'mock-code' || state.includes('mock');

        if (isMockMode) {
          toast.info('Modalità sviluppo rilevata', {
            description: 'Utilizzo dell\'implementazione mock di Google per lo sviluppo locale',
          });

          // Simula un breve ritardo per l'autenticazione
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Simula un utente autenticato
          const mockUser = {
            id: 'mock-user-id',
            email: 'abettarini@gmail.com',
            isVerified: true,
            name: 'Andrea Bettarini',
            picture: 'https://lh3.googleusercontent.com/a/mock-picture'
          };

          // Salva le informazioni dell'utente e i token nella sessione
          saveUserSession(
            mockUser, 
            'mock-jwt-token',
            'mock-access-token',
            'mock-id-token',
            'mock-refresh-token'
          );

          // Aggiorna il contesto di autenticazione
          setAuthInfo(mockUser, 'mock-jwt-token');

          // Reindirizza alla home page
          toast.success('Autenticazione completata', {
            description: 'Sei stato autenticato con successo (modalità sviluppo)',
          });

          navigate('/');
          return;
        }

        // Gestisci il callback di Google in produzione
        const response = await handleGoogleCallback(code, state);

        // Log della risposta per debug
        console.log('Risposta dal server dopo callback Google:', response);

        if (!response.success) {
          setError(response.message || 'Errore durante l\'autenticazione');
          setIsProcessing(false);
          return;
        }

        // Salva le informazioni dell'utente e i token nella sessione
        if (response.user && response.token) {
          // Assicurati che l'utente abbia un nome, anche se il backend non lo fornisce
          const user = {
            ...response.user,
            // Se il nome non è fornito dal backend, estrai il nome dall'email
            name: response.user.name || response.user.email.split('@')[0]
          };

          saveUserSession(
            user,
            response.token,
            response.accessToken,
            response.idToken,
            response.refreshToken
          );

          // Aggiorna il contesto di autenticazione
          setAuthInfo(user, response.token);

          toast.success('Autenticazione completata', {
            description: 'Sei stato autenticato con successo',
          });

          // Reindirizza alla home page
          navigate('/');
        } else {
          setError('Informazioni utente o token mancanti nella risposta');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Errore durante la gestione del callback:', error);
        setError('Si è verificato un errore durante l\'autenticazione');
        setIsProcessing(false);
      }
    }

    processCallback();
  }, [searchParams, navigate, setAuthInfo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md w-full">
          <strong className="font-bold">Errore!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('/login')}
          >
            Torna al login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg">Autenticazione in corso...</p>
          <p className="mt-2 text-sm text-gray-500">Verifica delle credenziali Google...</p>
        </div>
      )}
    </div>
  );
}