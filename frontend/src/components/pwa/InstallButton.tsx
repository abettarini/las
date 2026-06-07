import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

// Definizione dell'interfaccia per l'evento beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già chiuso il banner in questa sessione
    const checkDismissed = localStorage.getItem('pwa-install-dismissed');
    if (checkDismissed) {
      const dismissedTime = parseInt(checkDismissed, 10);
      // Se è stato chiuso nelle ultime 24 ore, non mostrarlo di nuovo
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
        return;
      }
    }

    // Controlla se è un dispositivo mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return; // Non mostrare su desktop

    // Controlla se è un dispositivo iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Controlla se l'app è già installata (per iOS è difficile determinarlo)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Intercetta l'evento beforeinstallprompt (solo per Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previeni il comportamento predefinito del browser
      e.preventDefault();
      // Salva l'evento per poterlo attivare più tardi
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Mostra il pulsante di installazione
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Se è iOS, mostra comunque il banner
    if (isIOSDevice) {
      setIsInstallable(true);
    }

    // Controlla se l'app è già installata
    window.addEventListener('appinstalled', () => {
      // Nascondi il pulsante di installazione
      setIsInstallable(false);
      // Pulisci l'evento salvato
      setInstallPrompt(null);
      console.log('App installata con successo!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Mostra il prompt di installazione
    await installPrompt.prompt();

    // Attendi la scelta dell'utente
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('Utente ha accettato l\'installazione');
    } else {
      console.log('Utente ha rifiutato l\'installazione');
      // Salva che l'utente ha rifiutato, per non mostrare di nuovo il banner subito
      handleDismiss();
    }

    // Pulisci l'evento salvato
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsInstallable(false);
    // Salva il timestamp di quando è stato chiuso
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Non mostrare nulla se l'app non è installabile o è stata dismessa
  if (!isInstallable || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mx-4 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isIOS ? 'Installa questa app sul tuo dispositivo' : 'Installa l\'app'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isIOS 
                ? 'Tocca l\'icona di condivisione e poi "Aggiungi a Home"' 
                : 'Installa l\'app per un accesso più rapido'}
            </p>
          </div>
          {!isIOS && (
            <Button 
              onClick={handleInstallClick}
              className="ml-3"
              size="sm"
            >
              Installa
            </Button>
          )}
          <button 
            onClick={handleDismiss} 
            className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label="Chiudi"
          >
            <span className="sr-only">Chiudi</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}