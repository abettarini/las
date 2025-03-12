import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ConsentSettingsForm from './consent-settings-form';
import { ConsentBannerProvider } from './context/consent-banner-context';
import { useConsentBannerContext } from './hooks/use-consent-banner-context';

interface ConsentBannerProps {
  position?: 'left' | 'right';
  showAs?: 'button' | 'link';
}

const ConsentBannerComponent = ({ position = 'left', showAs = 'button' }: ConsentBannerProps) => {
  const { showBanner, consentDuration, setConsentDuration, handleAccept, handleReject, showSettings, setShowSettings } = useConsentBannerContext();

  return (
    <>
      {showBanner && (
        <Card className={`fixed bottom-4 ${position === 'left' ? 'left-4' : 'right-4'} max-w-3xl z-50`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Cookie className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Consensi</h3>
            </div>
            <p className="text-sm mb-4">
            Noi e terze parti selezionate utilizziamo cookie o tecnologie simili per finalità tecniche e, con il tuo consenso, anche per altre finalità come specificato nella cookie policy.
            Usa il pulsante “Accetta” per acconsentire. Usa il pulsante “Rifiuta” o chiudi questa informativa per continuare senza accettare.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="consent-duration" className="text-sm">Ricorda la mia scelta per:</label>
                <Select value={consentDuration} onValueChange={(value: ConsentDuration) => setConsentDuration(value)}>
                  <SelectTrigger id="consent-duration" aria-label="Durata del consenso" className="w-[140px]">
                    <SelectValue placeholder="Seleziona durata" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Ore</SelectItem>
                    <SelectItem value="1w">1 Settimana</SelectItem>
                    <SelectItem value="1m">1 Mese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between space-x-2">
                <Button onClick={() => setShowSettings(!showSettings)} variant="outline" className="flex flex-start">
                  Personalizza
                </Button>
                <div className="flex flex-row flex-end space-x-2">
                <Button onClick={handleAccept} className="flex flex-end" asChild>
                  <span role="button" aria-label="Rifiuta">Accetta</span>
                </Button>
                <Button onClick={handleAccept} className="flex flex-end" asChild>
                  <span role="button" aria-label="Rifiuta">Rifiuta</span>
                </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
              Puoi effettuare impostazioni dettagliate o revocare il tuo consenso (parzialmente, se necessario) con effetto per il futuro. Per ulteriori informazioni, ti invitiamo a consultare le nostre policy:
              </p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <Link to="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
                <Link to="/consent-policy" className="hover:underline">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <ConsentSettingsForm showAs={showAs} />
    </>
  );
};

const ConsentBanner = ({ position = 'left', showAs = 'button' }: ConsentBannerProps) => {
  return (
    <ConsentBannerProvider>
      <ConsentBannerComponent position={position} showAs={showAs} />
    </ConsentBannerProvider>
  );
}

export default ConsentBanner;
