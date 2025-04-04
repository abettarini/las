import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Spinner } from '../components/ui/spinner';
import { BookingData, cancelBooking, getBooking } from '../services/booking-service';

// Funzione per formattare la data
const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

// Funzione per ottenere l'etichetta del tipo di evento
const getEventTypeLabel = (eventType: string): string => {
  const eventTypes: Record<string, string> = {
    visita_dottore: 'Visita Dottore',
    corso_dima: 'Corso DIMA',
    taratura_carabina: 'Taratura Carabina',
    cinghialino_corrente: 'Cinghialino Corrente',
  };
  
  return eventTypes[eventType] || eventType;
};

const CancelBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>('');
  const [secretError, setSecretError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);
  
  // Carica i dettagli della prenotazione
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('ID prenotazione mancante nella URL.');
        setLoading(false);
        return;
      }

      try {
        const response = await getBooking(bookingId);

        if (!response.success) {
          setError(response.message || 'Impossibile trovare la prenotazione.');
          setLoading(false);
          return;
        }

        setBooking(response.booking!);
        setLoading(false);
      } catch (error) {
        console.error('Errore durante il caricamento della prenotazione:', error);
        setError('Si è verificato un errore durante il caricamento della prenotazione.');
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);
  
  // Gestisce l'apertura della modale
  const handleCancelClick = () => {
    setShowModal(true);
    setSecret('');
    setSecretError(null);
  };
  
  // Gestisce la chiusura della modale
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  // Gestisce la cancellazione della prenotazione
  const handleConfirmCancel = async () => {
    if (!secret.trim()) {
      setSecretError('Inserisci il codice segreto.');
      return;
    }

    setCancelling(true);
    setSecretError(null);

    try {
      const response = await cancelBooking(bookingId!, secret.trim());

      if (!response.success) {
        if (response.requiresSecret) {
          setSecretError(response.message || 'Il codice segreto non è valido.');
          setCancelling(false);
          return;
        } else {
          setError(response.message || 'Impossibile annullare la prenotazione.');
          setShowModal(false);
          setCancelling(false);
          return;
        }
      }

      // Mostra il messaggio di successo
      setSuccess(true);
      setShowModal(false);
      setCancelling(false);
    } catch (error) {
      console.error('Errore durante l\'annullamento della prenotazione:', error);
      setError('Si è verificato un errore durante l\'annullamento della prenotazione.');
      setShowModal(false);
      setCancelling(false);
    }
  };
  
  // Rendering condizionale in base allo stato
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner className="w-12 h-12 text-primary mb-4" />
        <p className="text-gray-600">Caricamento informazioni prenotazione...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button variant="default" onClick={() => window.location.href = '/'}>
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="default" className="max-w-md mx-auto bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Prenotazione Annullata</AlertTitle>
          <AlertDescription className="text-green-700">
            La tua prenotazione è stata annullata con successo.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button variant="default" onClick={() => window.location.href = '/'}>
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Annulla Prenotazione</h1>
          
          {booking && (
            <>
              <div className="mb-6">
                <Alert variant="info" className="mb-6 bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Per annullare la prenotazione, clicca sul pulsante in basso. Ti verrà richiesto il codice segreto che hai ricevuto al momento della prenotazione.
                  </AlertDescription>
                </Alert>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Dettagli Prenotazione</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="mb-1"><span className="font-medium">Tipo:</span> {getEventTypeLabel(booking.eventType)}</p>
                    <p className="mb-1"><span className="font-medium">Nome:</span> {booking.name} {booking.surname}</p>
                    <p className="mb-1"><span className="font-medium">Data:</span> {formatDate(booking.date)}</p>
                    <p className="mb-1"><span className="font-medium">Ora:</span> {booking.time}</p>
                    <p className="mb-1"><span className="font-medium">Stato:</span> {
                      booking.status === 'confirmed' ? 'Confermata' : 
                      booking.status === 'pending' ? 'In attesa' : 
                      booking.status === 'cancelled' ? 'Annullata' : booking.status
                    }</p>
                  </div>
                </div>
                
                {booking.status === 'cancelled' ? (
                  <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Prenotazione già annullata</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Questa prenotazione è già stata annullata.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button 
                    variant="destructive" 
                    className="w-full py-3" 
                    onClick={handleCancelClick}
                    disabled={booking.status === 'cancelled'}
                  >
                    Annulla Prenotazione
                  </Button>
                )}
              </div>
              
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Conferma Annullamento</DialogTitle>
                    <DialogDescription>
                      Inserisci il codice segreto che hai ricevuto al momento della prenotazione per confermare l'annullamento.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="secret" className="text-right">
                        Codice Segreto
                      </Label>
                      <Input
                        id="secret"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="col-span-3"
                        placeholder="Inserisci il codice segreto"
                      />
                    </div>
                    
                    {secretError && (
                      <p className="text-red-500 text-sm col-span-4 text-right">{secretError}</p>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseModal} disabled={cancelling}>
                      Annulla
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleConfirmCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Annullamento...
                        </>
                      ) : (
                        'Conferma Annullamento'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelBookingPage;