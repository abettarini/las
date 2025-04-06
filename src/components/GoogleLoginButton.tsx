import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { initiateGoogleLogin } from '../services/google-auth-service';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

interface GoogleLoginButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function GoogleLoginButton({ className, variant = 'outline', size = 'default' }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Inizia il processo di autenticazione con Google
      const response = await initiateGoogleLogin();

      if (!response.success) {
        setError(response.message || 'Errore durante l\'inizializzazione del login');
        return;
      }

      // Verifica se siamo in modalità mock (sviluppo locale)
      if (response.authUrl?.includes('localhost:8787')) {
        toast.info('Modalità sviluppo rilevata', {
          description: 'Utilizzo dell\'implementazione mock di Google per lo sviluppo locale',
        });

        // Simula il flusso di autenticazione Google in modalità sviluppo
        setTimeout(() => {
          // Reindirizza direttamente alla pagina di callback con parametri fittizi
          navigate('/auth/google/callback?code=mock-code&state=' + (response.state || 'mock-state'));
        }, 1500);

        return;
      }

      // Reindirizza all'URL di autenticazione Google in produzione
      if (response.authUrl) {
        window.location.href = response.authUrl;
      } else {
        setError('URL di autenticazione mancante nella risposta');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setError('Si è verificato un errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        className={className}
        variant={variant}
        size={size}
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" size="sm" />
            Caricamento...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Accedi con Google
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}