import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { initiateAuth0Login } from '../services/auth-service';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

interface Auth0LoginButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Auth0LoginButton({ className, variant = 'default', size = 'default' }: Auth0LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Inizia il processo di autenticazione con Auth0
      const response = await initiateAuth0Login();

      if (!response.success) {
        setError(response.message || 'Errore durante l\'inizializzazione del login');
        return;
      }

      // Verifica se siamo in modalità mock (sviluppo locale)
      if (response.authUrl?.includes('example.auth0.com')) {
        toast.info('Modalità sviluppo rilevata', {
          description: 'Utilizzo dell\'implementazione mock di Auth0 per lo sviluppo locale',
        });

        // Simula il flusso di autenticazione Auth0 in modalità sviluppo
        setTimeout(() => {
          // Reindirizza direttamente alla pagina di callback con parametri fittizi
          navigate('/auth/callback?code=mock-code&state=' + (response.state || 'mock-state'));
        }, 1500);

        return;
      }

      // Reindirizza all'URL di autenticazione Auth0 in produzione
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
          'Accedi con Auth0'
        )}
      </Button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}