import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { verifyEmail } from '../services/auth-service';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Token mancante. Impossibile verificare l\'email.');
        setVerifying(false);
        return;
      }

      try {
        // Verifica il token
        const response = await verifyEmail(token);

        if (response.success) {
          // Email verificata con successo
          setVerified(true);
          toast.success('Email verificata con successo', {
            description: 'Ora puoi accedere al tuo account',
          });
        } else {
          // Errore durante la verifica
          setError(response.message || 'Errore durante la verifica dell\'email');
        }
      } catch (error) {
        console.error('Errore durante la verifica dell\'email:', error);
        setError('Si è verificato un errore durante la verifica dell\'email');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Verifica Email</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        {verifying ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700">Verifica dell'email in corso...</p>
          </div>
        ) : verified ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Email verificata con successo</h2>
            <p className="text-gray-600 mb-4">
              La tua email è stata verificata con successo. Ora puoi accedere al tuo account.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Vai alla pagina di accesso
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Errore durante la verifica</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Si è verificato un errore durante la verifica dell\'email.'}
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