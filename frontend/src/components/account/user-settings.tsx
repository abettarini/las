import { ThemeSettings } from '@/components/theme/theme-settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/auth-context';
import { API_URL } from '@/lib/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const UserSettings = () => {
  const { user, token, setAuthInfo } = useAuth();
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(user?.privacyConsent || false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user || !token) {
      setErrorMessage('Sessione non valida. Effettua nuovamente il login.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setErrorMessage(null);
    
    try {
      const response = await fetch(`${API_URL}/user/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          privacyConsent
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Aggiorna i dati dell'utente nel contesto di autenticazione
        setAuthInfo({
          ...user,
          privacyConsent
        }, token);
        
        setSubmitSuccess(true);
      } else {
        setErrorMessage(data.message || 'Si è verificato un errore durante il salvataggio delle impostazioni');
        setSubmitSuccess(false);
      }
    } catch (error) {
      setErrorMessage('Si è verificato un errore di rete. Riprova più tardi.');
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Impostazioni</CardTitle>
        <CardDescription>
          Gestisci le tue preferenze e impostazioni dell'account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sezione Privacy */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy e consensi</h3>
          
          {!privacyConsent && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-800 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Attenzione
              </p>
              <p className="text-sm text-amber-700 mt-1 ml-7">
                Non hai ancora accettato l'informativa sulla privacy. Questo consenso è necessario per effettuare prenotazioni e utilizzare i servizi del poligono.
              </p>
            </div>
          )}
          
          <div className={`flex items-start space-x-3 p-4 ${privacyConsent ? 'bg-green-50 border border-green-100' : 'bg-gray-50'} rounded-md`}>
            <Checkbox 
              id="privacy-consent"
              isSelected={privacyConsent}
              onChange={setPrivacyConsent}
            />
            <div>
              <label 
                htmlFor="privacy-consent" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Accetto l'informativa sulla privacy
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                Acconsento al trattamento dei miei dati personali come descritto nell'
                <Link to="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">informativa sulla privacy</Link>.
              </p>
              {privacyConsent && (
                <p className="text-sm text-green-600 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Hai accettato l'informativa sulla privacy
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Impostazioni del tema */}
        <div className="pt-6 border-t">
          <ThemeSettings />
        </div>
        
        {/* Altre sezioni di impostazioni possono essere aggiunte qui */}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start space-y-4">
        {submitSuccess === true && (
          <div className="w-full p-4 bg-green-50 text-green-700 rounded-md flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Impostazioni salvate con successo</p>
              <p className="text-sm mt-1">Le tue preferenze sulla privacy sono state aggiornate.</p>
              {privacyConsent && (
                <div className="mt-3">
                  <Link to="/prenotazioni" className="text-blue-600 hover:underline inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                    Vai alla pagina delle prenotazioni
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {submitSuccess === false && (
          <div className="w-full p-4 bg-red-50 text-red-700 rounded-md flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Si è verificato un errore</p>
              <p className="text-sm mt-1">{errorMessage || 'Non è stato possibile salvare le impostazioni. Riprova più tardi.'}</p>
            </div>
          </div>
        )}
        
        <div className="w-full flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvataggio...
              </span>
            ) : 'Salva impostazioni'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserSettings;