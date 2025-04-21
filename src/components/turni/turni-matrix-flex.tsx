import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { API_URL, cn } from '@/lib/utils';
import { format, getDaysInMonth, getMonth, getYear, parse } from 'date-fns';
import { it } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

export function TurniMatrixFlex() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    // Recupera il mese dai parametri URL o usa il mese corrente
    const monthParam = searchParams.get('month');
    if (monthParam) {
      try {
        return parse(monthParam, 'yyyy-MM', new Date());
      } catch (e) {
        return new Date();
      }
    }
    return new Date();
  });
  
  const [turni, setTurni] = useState<Turno[]>([]);
  const [openDays, setOpenDays] = useState<OpenDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Recupera il giorno e il turno selezionati dai parametri URL
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      try {
        const date = new Date(dateParam);
        return date.getDate();
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'MORNING' | 'AFTERNOON' | null>(() => {
    const timeSlotParam = searchParams.get('timeSlot');
    return (timeSlotParam === 'MORNING' || timeSlotParam === 'AFTERNOON') ? timeSlotParam : null;
  });

  // Carica i dati iniziali
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Carica i giorni aperti
        const openDaysResponse = await fetch(`${API_URL}/turni/open-days`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (openDaysResponse.ok) {
          const openDaysData = await openDaysResponse.json();
          setOpenDays(openDaysData);
        } else {
          toast.error('Errore', {
            description: "Impossibile caricare i giorni di apertura"
          });
        }
        
        // Carica tutti i turni
        const turniResponse = await fetch(`${API_URL}/turni`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (turniResponse.ok) {
          const turniData = await turniResponse.json();
          setTurni(turniData);
        } else {
          toast.error('Errore', {
            description: "Impossibile caricare i turni"
          });
        }
      } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
        toast.error('Errore', {
          description: "Si è verificato un errore durante il caricamento dei dati"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Aggiorna i parametri URL quando cambia il mese
  useEffect(() => {
    const monthString = format(currentMonth, 'yyyy-MM');
    
    // Mantieni gli altri parametri e aggiorna solo il mese
    const newParams = new URLSearchParams(searchParams);
    newParams.set('month', monthString);
    setSearchParams(newParams, { replace: true });
  }, [currentMonth, setSearchParams]);

  // Funzione per verificare se un giorno è aperto
  const isOpenDay = (date: string): boolean => {
    return openDays.some(day => day.date === date);
  };

  // Funzione per ottenere le informazioni di un giorno aperto
  const getOpenDayInfo = (date: string): OpenDay | undefined => {
    return openDays.find(day => day.date === date);
  };
  
  // Funzione per contare le iscrizioni per un turno specifico
  const countShiftRegistrations = (date: string, timeSlot: 'MORNING' | 'AFTERNOON'): number => {
    return turni.filter(turno => 
      turno.date === date && 
      turno.timeSlot === timeSlot
    ).length;
  };

  // Funzione per ottenere il colore della cella in base al numero di iscritti
  const getCellColor = (count: number): string => {
    if (count === 0) return 'bg-red-100 dark:bg-red-900';
    if (count >= 1 && count <= 2) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-green-100 dark:bg-green-900';
  };

  // Funzione per gestire il click su una cella
  const handleCellClick = (day: number, timeSlot: 'MORNING' | 'AFTERNOON') => {
    const selectedDate = new Date(getYear(currentMonth), getMonth(currentMonth), day);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Se la cella è già selezionata, deselezionala
    if (selectedDay === day && selectedTimeSlot === timeSlot) {
      setSelectedDay(null);
      setSelectedTimeSlot(null);
      
      // Rimuovi i parametri date e timeSlot dall'URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('date');
      newParams.delete('timeSlot');
      setSearchParams(newParams, { replace: true });
      
      toast.info('Filtro rimosso');
      return;
    }
    
    setSelectedDay(day);
    setSelectedTimeSlot(timeSlot);
    
    // Aggiorna i parametri URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('date', formattedDate);
    newParams.set('timeSlot', timeSlot);
    setSearchParams(newParams, { replace: true });
    
    toast.info('Filtro applicato', {
      description: `Selezionato ${format(selectedDate, 'd MMMM yyyy', { locale: it })} - ${timeSlot === 'MORNING' ? 'Mattina' : 'Pomeriggio'}`
    });
  };

  // Genera le celle della matrice usando Flexbox
  const generateFlexMatrix = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const year = getYear(currentMonth);
    const month = getMonth(currentMonth);
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return (
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-col min-w-full">
          {/* Header row */}
          <div className="flex border-b border-border">
            <div className="flex-shrink-0 w-24 p-1 bg-muted font-medium">Turno / Giorno</div>
            <div className="flex flex-1">
              {days.map(day => (
                <div 
                  key={day} 
                  className="flex-1 min-w-[40px] p-1 bg-muted font-medium text-center border-l border-border"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          {/* Morning row */}
          <div className="flex border-b border-border">
            <div className="flex-shrink-0 w-24 p-1 bg-muted font-medium">Mattina</div>
            <div className="flex flex-1">
              {days.map(day => {
                const date = new Date(year, month, day);
                const dateString = format(date, 'yyyy-MM-dd');
                const openDay = getOpenDayInfo(dateString);
                const isOpen = openDay?.isMorningOpen;
                const count = isOpen ? countShiftRegistrations(dateString, 'MORNING') : 0;
                
                return (
                  <div 
                    key={`morning-${day}`} 
                    className={cn(
                      "flex-1 min-w-[40px] p-1 text-center cursor-pointer shadow-sm hover:shadow-md transition-shadow flex items-center justify-center border-l border-border",
                      isOpen ? getCellColor(count) : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600",
                      selectedDay === day && selectedTimeSlot === 'MORNING' && "ring-2 ring-primary"
                    )}
                    onClick={() => isOpen && handleCellClick(day, 'MORNING')}
                  >
                    {isOpen ? count : ''}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Afternoon row */}
          <div className="flex">
            <div className="flex-shrink-0 w-24 p-1 bg-muted font-medium">Pomeriggio</div>
            <div className="flex flex-1">
              {days.map(day => {
                const date = new Date(year, month, day);
                const dateString = format(date, 'yyyy-MM-dd');
                const openDay = getOpenDayInfo(dateString);
                const isOpen = openDay?.isAfternoonOpen;
                const count = isOpen ? countShiftRegistrations(dateString, 'AFTERNOON') : 0;
                
                return (
                  <div 
                    key={`afternoon-${day}`} 
                    className={cn(
                      "flex-1 min-w-[40px] p-1 text-center cursor-pointer shadow-sm hover:shadow-md transition-shadow flex items-center justify-center border-l border-border",
                      isOpen ? getCellColor(count) : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600",
                      selectedDay === day && selectedTimeSlot === 'AFTERNOON' && "ring-2 ring-primary"
                    )}
                    onClick={() => isOpen && handleCellClick(day, 'AFTERNOON')}
                  >
                    {isOpen ? count : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizza il componente
  return (
    <Card>
      <CardHeader>
        <CardTitle>Turni - {format(currentMonth, 'MMMM yyyy', { locale: it })}</CardTitle>
        <CardDescription>
          Visualizza il numero di iscrizioni per ogni turno del mese. Clicca su una cella per filtrare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                <div><span className="inline-block w-3 h-3 bg-red-100 dark:bg-red-900 mr-1 rounded-sm"></span> 0 iscritti</div>
                <div><span className="inline-block w-3 h-3 bg-yellow-100 dark:bg-yellow-900 mr-1 rounded-sm"></span> 1-2 iscritti</div>
                <div><span className="inline-block w-3 h-3 bg-green-100 dark:bg-green-900 mr-1 rounded-sm"></span> 3+ iscritti</div>
                <div><span className="inline-block w-3 h-3 bg-gray-100 dark:bg-gray-800 mr-1 rounded-sm"></span> Chiuso</div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-2 py-1 text-sm border rounded hover:bg-muted"
                  onClick={() => {
                    const prevMonth = new Date(currentMonth);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setCurrentMonth(prevMonth);
                  }}
                >
                  Mese precedente
                </button>
                <button
                  className="px-2 py-1 text-sm border rounded hover:bg-muted"
                  onClick={() => {
                    const nextMonth = new Date(currentMonth);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setCurrentMonth(nextMonth);
                  }}
                >
                  Mese successivo
                </button>
              </div>
            </div>
            {generateFlexMatrix()}
            {selectedDay && selectedTimeSlot && (
              <div className="mt-4 p-3 border rounded-md bg-muted/30">
                <h3 className="font-medium">
                  Filtro attivo: {format(new Date(getYear(currentMonth), getMonth(currentMonth), selectedDay), 'd MMMM', { locale: it })} - {selectedTimeSlot === 'MORNING' ? 'Mattina' : 'Pomeriggio'}
                </h3>
                <button
                  className="mt-2 px-2 py-1 text-sm border rounded hover:bg-muted"
                  onClick={() => {
                    setSelectedDay(null);
                    setSelectedTimeSlot(null);
                    
                    // Rimuovi i parametri date e timeSlot dall'URL
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('date');
                    newParams.delete('timeSlot');
                    setSearchParams(newParams, { replace: true });
                    
                    toast.info('Filtro rimosso');
                  }}
                >
                  Rimuovi filtro
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TurniMatrixFlex;