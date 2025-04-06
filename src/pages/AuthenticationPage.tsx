import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/auth-context';
import { saveUserSession } from '../services/auth-service';
import { verifyToken } from '../services/google-auth-service';

export default function AuthenticationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateWithToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Token mancante. Impossibile autenticare.');
        setVerifying(false);
        return;
      }

      try {
        // Verifica il token
        const response = await verifyToken(token);

        if (response.success && response.user && response.token) {
          // Token valido, salva le informazioni dell'utente
          saveUserSession(response.user, response.token);
          setAuthInfo(response.user, response.token);
          
          toast.success('Autenticazione completata', {
            description: 'Sei stato autenticato con successo',
          });
          
          // Reindirizza alla home page
          navigate('/');
        } else {
          // Errore durante la verifica
          setError(response.message || 'Errore durante l\'autenticazione');
          setVerifying(false);
        }
      } catch (error) {
        console.error('Errore durante l\'autenticazione:', error);
        setError('Si è verificato un errore durante l\'autenticazione');
        setVerifying(false);
      }
    };

    authenticateWithToken();
  }, [searchParams, navigate, setAuthInfo]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Autenticazione</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        {verifying ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700">Autenticazione in corso...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Errore durante l'autenticazione</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Si è verificato un errore durante l\'autenticazione.'}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Torna alla pagina di accesso
            </button>
          </div>
        )}
      </div>
    </div>
  );
}