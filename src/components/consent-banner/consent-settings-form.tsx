import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ConsentType } from './context/consent-banner-context';
import { useConsentBannerContext } from './hooks/use-consent-banner-context';

type ConsentSettingsFormProps = {
    showAs?: 'button' | 'link';
};

const ConsentSettingsForm: React.FC<ConsentSettingsFormProps> = ({showAs = 'button'}: ConsentSettingsFormProps) => {
  const { consentSettings, setConsentSettings, saveConsentSettings, showSettings, setShowSettings } = useConsentBannerContext();

  const handleToggle = (type: ConsentType) => {
    setConsentSettings({
      ...consentSettings,
      [type]: !consentSettings[type],
    });
  };

  const handleSave = () => {
    saveConsentSettings();
    setShowSettings(false);
  };

  return (
    <>
    {showAs === 'button' && (<Button onClick={() => setShowSettings(!showSettings)} className="fixed bottom-4 right-4 z-50">
        Apri Impostazioni Consenso
    </Button>)}
    {showAs === 'link' && (<button onClick={() => setShowSettings(!showSettings)} className="text-primary underline">Impostazioni Consenso</button>)}
    <Dialog open={showSettings} onOpenChange={() => setShowSettings(false)}>
        <DialogTrigger asChild>
                <button className="hidden">Open Results</button>
              </DialogTrigger>
              <DialogContent className={`p-6`}>
                <DialogHeader>
                    <DialogTitle>Impostazioni Consenso</DialogTitle>
                    <DialogDescription>Utilizziamo cookie e tecnologie simili per fornire determinate funzionalità, migliorare l’esperienza utente e offrire contenuti rilevanti per i tuoi interessi. A seconda dello scopo, possono essere utilizzati cookie di analisi e marketing, oltre ai cookie tecnicamente necessari. Cliccando su “Accetta e continua”, dichiari il tuo consenso all’uso dei suddetti cookie.</DialogDescription>
                </DialogHeader>
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Impostazioni Consenso</h3>
      <div className="flex flex-col space-y-2">
        {Object.keys(consentSettings).map((type) => (
          <div key={type} className="flex items-center justify-between">
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <input
              type="checkbox"
              checked={consentSettings[type]}
              onChange={() => handleToggle(type as ConsentType)}
            />
          </div>
        ))}
      </div>
    </div>
    <DialogFooter className="flex-col gap-2 text-lg">
        <Button onClick={handleSave} className="mt-4">
            Salva Impostazioni
        </Button>
    </DialogFooter>
    </DialogContent>
    </Dialog>
    </>
  );
};

export default ConsentSettingsForm;
