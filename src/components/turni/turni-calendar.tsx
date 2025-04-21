import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/auth-context';
import { API_URL } from '@/lib/utils';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarX2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Definizione dei tipi
interface Turno {
  id: string;
  userId: string;
  userName: string;
  date: string;
  timeSlot: 'MORNING' | 'AFTERNOON';
}

interface OpenDay {
  date: string;
  isMorningOpen: boolean;
  isAfternoonOpen: boolean;
}

export function TurniCalendar() {
  const { user, token } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'MORNING' | 'AFTERNOON' | null>(null);
  const [openDays, setOpenDays] = useState<OpenDay[]>([]);
  const [myTurni, setMyTurni] = useState<Turno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  // Carica i giorni aperti e i turni dell'utente
  useEffect(() => {
    const fetchOpenDays = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/turni/open-days`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOpenDays(data);
        } else {
          toast.error('Errore', {
            description: "Impossibile caricare i giorni di apertura"
          });
        }
      } catch (error) {
        console.error("Errore durante il caricamento dei giorni aperti:", error);
        toast.error('Errore', {
          description: "Si è verificato un errore durante il caricamento dei dati"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMyTurni = async () => {
      try {
        const response = await fetch(`${API_URL}/turni/my-turni`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMyTurni(data);
        } else {
          toast.error('Errore',{
            description: "Impossibile caricare i tuoi turni"
          });
        }
      } catch (error) {
        console.error("Errore durante il caricamento dei turni:", error);
      }
    };

    if (token) {
      fetchOpenDays();
      fetchMyTurni();
    }
  }, [token, toast]);

  // Funzione per verificare se un giorno è aperto
  const isOpenDay = (date: Date) => {
    try {
      // Verifica che la data sia valida
      if (date && !isNaN(date.getTime())) {
        const dateString = format(date, 'yyyy-MM-dd');
        return openDays.some(day => day.date === dateString);
      }
      return false;
    } catch (error) {
      console.error('Errore nella verifica del giorno aperto:', error);
      return false;
    }
  };

  // Funzione per ottenere le informazioni di un giorno aperto
  const getOpenDayInfo = (date: Date): OpenDay | undefined => {
    try {
      // Verifica che la data sia valida
      if (date && !isNaN(date.getTime())) {
        const dateString = format(date, 'yyyy-MM-dd');
        return openDays.find(day => day.date === dateString);
      }
      return undefined;
    } catch (error) {
      console.error('Errore nel recupero delle informazioni del giorno:', error);
      return undefined;
    }
  };

  // Funzione per iscriversi a un turno
  const handleIscriviti = async () => {
    if (!selectedDate || !selectedTimeSlot || !user || !token) return;
    
    // Verifica che la data sia valida
    if (isNaN(selectedDate.getTime())) {
      toast.error('Errore', {
        description: 'La data selezionata non è valida. Seleziona un\'altra data.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/turni/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          timeSlot: selectedTimeSlot
        })
      });

      if (response.ok) {
        const newTurno = await response.json();
        setMyTurni([...myTurni, newTurno]);
        toast.success('Iscrizione completata', {
          description: `Ti sei iscritto al turno di ${selectedTimeSlot === 'MORNING' ? 'mattina' : 'pomeriggio'} del ${
            selectedDate && !isNaN(selectedDate.getTime())
              ? format(selectedDate, 'd MMMM yyyy', { locale: it })
              : 'data selezionata'
          }`
        });
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
      } else {
        const errorData = await response.json();
        toast.error('Errore', {
          description: errorData.message || "Impossibile completare l'iscrizione"
        });
      }
    } catch (error) {
      console.error("Errore durante l'iscrizione al turno:", error);
      toast.error('Error', {
        description: "Si è verificato un errore durante l'iscrizione"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funzione per annullare un turno
  const handleAnnulla = async (turnoId: string) => {
    if (!token) return;

    setIsCancelling(turnoId);
    try {
      const response = await fetch(`${API_URL}/turni/${turnoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMyTurni(myTurni.filter(turno => turno.id !== turnoId));
        toast.info('Turno annullato', {
          description: "Il turno è stato annullato con successo",
        });
      } else {
        const errorData = await response.json();
        toast.error('Errore', {
          description: errorData.message || "Impossibile annullare il turno"
        });
      }
    } catch (error) {
      console.error("Errore durante l'annullamento del turno:", error);
      toast.error('Errore', {
        description: "Si è verificato un errore durante l'annullamento"
      });
    } finally {
      setIsCancelling(null);
    }
  };

  // Renderizza il componente
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendario e selezione turno */}
      <Card>
        <CardHeader>
          <CardTitle>Calendario Turni</CardTitle>
          <CardDescription>
            Seleziona una data disponibile per iscriverti a un turno
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mb-4"
                disabled={(date) => {
                  // Disabilita i giorni passati e quelli non aperti
                  return date < new Date(new Date().setHours(0, 0, 0, 0)) || !isOpenDay(date);
                }}
              />

              {selectedDate && (
                <div className="space-y-4">
                  <h3 className="font-medium">
                    Seleziona fascia oraria per {selectedDate && !isNaN(selectedDate.getTime()) 
                      ? format(selectedDate, 'd MMMM yyyy', { locale: it })
                      : 'data selezionata'}:
                  </h3>
                  
                  <RadioGroup 
                    value={selectedTimeSlot || ''} 
                    onValueChange={(value) => setSelectedTimeSlot(value as 'MORNING' | 'AFTERNOON')}
                    className="grid grid-cols-2 gap-4"
                  >
                    {getOpenDayInfo(selectedDate)?.isMorningOpen && (
                      <div>
                        <RadioGroupItem 
                          value="MORNING" 
                          id="morning" 
                          className="peer sr-only" 
                        />
                        <label
                          htmlFor="morning"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-medium">Mattina</span>
                        </label>
                      </div>
                    )}
                    
                    {getOpenDayInfo(selectedDate)?.isAfternoonOpen && (
                      <div>
                        <RadioGroupItem 
                          value="AFTERNOON" 
                          id="afternoon" 
                          className="peer sr-only" 
                        />
                        <label
                          htmlFor="afternoon"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-medium">Pomeriggio</span>
                        </label>
                      </div>
                    )}
                  </RadioGroup>
                  
                  <Button 
                    onClick={handleIscriviti} 
                    disabled={!selectedTimeSlot || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iscrizione in corso...
                      </>
                    ) : (
                      'Iscriviti'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* I miei turni */}
      <Card>
        <CardHeader>
          <CardTitle>I Miei Turni</CardTitle>
          <CardDescription>
            Elenco dei prossimi turni a cui sei iscritto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myTurni.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <CalendarX2 className="h-12 w-12 mb-2" />
              <p>Non sei iscritto a nessun turno</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Raggruppa i turni per data */}
              {Object.entries(
                myTurni
                  .sort((a, b) => {
                    // Validazione delle date prima del confronto
                    try {
                      const dateA = new Date(a.date);
                      const dateB = new Date(b.date);
                      
                      // Verifica che entrambe le date siano valide
                      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                        return dateA.getTime() - dateB.getTime();
                      }
                      // Se una delle date non è valida, mantieni l'ordine originale
                      return 0;
                    } catch (error) {
                      console.error('Errore durante il confronto delle date:', error);
                      return 0;
                    }
                  })
                  .reduce((acc, turno) => {
                    if (!acc[turno.date]) {
                      acc[turno.date] = [];
                    }
                    acc[turno.date].push(turno);
                    return acc;
                  }, {} as Record<string, Turno[]>)
              ).map(([date, turni]) => {
                // Separa i turni di mattina e pomeriggio
                const morningTurni = turni.filter(t => t.timeSlot === 'MORNING');
                const afternoonTurni = turni.filter(t => t.timeSlot === 'AFTERNOON');
                
                // Assicurati che la data sia valida prima di creare l'oggetto Date
                let formattedDate = date;
                try {
                  // Verifica se la data è in formato ISO (YYYY-MM-DD)
                  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    const turnoDate = new Date(date);
                    // Verifica che la data sia valida
                    if (!isNaN(turnoDate.getTime())) {
                      formattedDate = format(turnoDate, 'EEEE d MMMM yyyy', { locale: it });
                    }
                  }
                } catch (error) {
                  console.error(`Errore nel formato della data: ${date}`, error);
                }
                
                return (
                  <div key={date} className="border rounded-md overflow-hidden">
                    {/* Intestazione con la data */}
                    <div className="bg-muted p-3 border-b">
                      <h3 className="font-medium">
                        {formattedDate}
                      </h3>
                    </div>
                    
                    {/* Layout a due colonne per mattina e pomeriggio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                      {/* Colonna mattina */}
                      <div className="p-3">
                        <h4 className="font-medium text-sm mb-3">
                          Mattina
                        </h4>
                        
                        {morningTurni.length > 0 ? (
                          <div className="space-y-2">
                            {morningTurni.map(turno => (
                              <div 
                                key={turno.id} 
                                className="flex justify-between items-center p-2 border rounded-md bg-background"
                              >
                                <div className="text-sm font-medium">
                                  {turno.userName || 'Tu'}
                                </div>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleAnnulla(turno.id)}
                                  disabled={isCancelling === turno.id}
                                >
                                  {isCancelling === turno.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Annulla'
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground text-center py-2">
                            Nessuna iscrizione
                          </div>
                        )}
                      </div>
                      
                      {/* Colonna pomeriggio */}
                      <div className="p-3">
                        <h4 className="font-medium text-sm mb-3">
                          Pomeriggio
                        </h4>
                        
                        {afternoonTurni.length > 0 ? (
                          <div className="space-y-2">
                            {afternoonTurni.map(turno => (
                              <div 
                                key={turno.id} 
                                className="flex justify-between items-center p-2 border rounded-md bg-background"
                              >
                                <div className="text-sm font-medium">
                                  {turno.userName || 'Tu'}
                                </div>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleAnnulla(turno.id)}
                                  disabled={isCancelling === turno.id}
                                >
                                  {isCancelling === turno.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Annulla'
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground text-center py-2">
                            Nessuna iscrizione
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TurniCalendar;