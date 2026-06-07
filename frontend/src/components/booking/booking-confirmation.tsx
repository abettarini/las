import { Button } from "@/components/ui/button";
import React, { useState } from 'react';
import { toast } from 'sonner';

interface BookingConfirmationProps {
  bookingId: string | null;
  cancelUrl: string | null;
  cancelSecret: string | null;
  onNewBooking: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  cancelUrl,
  cancelSecret,
  onNewBooking
}) => {
  // Stato per il feedback di copia
  const [urlCopied, setUrlCopied] = useState<boolean>(false);
  const [secretCopied, setSecretCopied] = useState<boolean>(false);

  // Funzione per copiare il testo negli appunti
  const copyToClipboard = (text: string, type: 'url' | 'secret') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Feedback visivo
        if (type === 'url') {
          setUrlCopied(true);
          setTimeout(() => setUrlCopied(false), 2000);
          toast.success('Link di cancellazione copiato negli appunti', {
            description: 'Puoi utilizzare questo link per accedere alla pagina di cancellazione',
            duration: 3000,
          });
        } else {
          setSecretCopied(true);
          setTimeout(() => setSecretCopied(false), 2000);
          toast.success('Codice segreto copiato negli appunti', {
            description: 'Conserva questo codice, ti servirà per confermare la cancellazione',
            duration: 3000,
          });
        }
        console.log('Testo copiato negli appunti');
      })
      .catch(err => {
        console.error('Errore durante la copia negli appunti:', err);
        toast.error('Impossibile copiare negli appunti', {
          description: 'Prova a selezionare e copiare il testo manualmente',
        });
      });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-green-700">Prenotazione Confermata!</h2>
        <p className="text-lg mb-4">Grazie per aver prenotato con noi.</p>
        {bookingId && (
          <p className="mb-4 text-gray-600">
            Il tuo numero di prenotazione è: <span className="font-semibold">{bookingId}</span>
          </p>
        )}
        <p className="text-gray-600 mb-4">
          Abbiamo inviato una email di conferma all'indirizzo fornito con tutti i dettagli della prenotazione.
        </p>

        {/* Informazioni per la cancellazione */}
        <div className="mt-6 mb-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Informazioni per la cancellazione</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
            {cancelUrl && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Link per annullare la prenotazione:</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={cancelUrl}
                    readOnly
                    className="flex-1 text-sm bg-white border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(cancelUrl, 'url')}
                    className={`${urlCopied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-r-md p-2 transition-colors duration-200`}
                    title={urlCopied ? "Copiato!" : "Copia negli appunti"}
                  >
                    {urlCopied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {cancelSecret && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Codice segreto per la cancellazione:</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={cancelSecret}
                    readOnly
                    className="flex-1 text-sm bg-white border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(cancelSecret, 'secret')}
                    className={`${secretCopied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-r-md p-2 transition-colors duration-200`}
                    title={secretCopied ? "Copiato!" : "Copia negli appunti"}
                  >
                    {secretCopied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">
              Conserva queste informazioni per poter annullare la prenotazione in caso di necessità.
              Il codice segreto ti sarà richiesto al momento della cancellazione.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onNewBooking}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Effettua una nuova prenotazione
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;