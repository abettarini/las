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
  morning: boolean;
  afternoon: boolean;
}

export function TurniMatrix() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Recupera il mese dai parametri URL o usa il mese corrente
    const monthParam = searchParams.get('month');
    const yearParam = searchParams.get('year');
    if (yearParam && monthParam) {
      try {
        return parse(`${yearParam}-${monthParam}`, 'yyyy-MM', new Date());
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
        const openDaysResponse = await fetch(`${API_URL}/turni/open-days?${searchParams}`, {
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
        const turniResponse = await fetch(`${API_URL}/turni?${searchParams}`, {
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
  }, [token, setSearchParams]);

  // Aggiorna i parametri URL quando cambia il mese
  useEffect(() => {
    const monthString = format(currentDate, 'MM');
    const yearString = format(currentDate, 'yyyy');
    
    // Mantieni gli altri parametri e aggiorna solo il mese
    const newParams = new URLSearchParams(searchParams);
    newParams.set('month', monthString);
    newParams.set('year', yearString);
    setSearchParams(newParams, { replace: true });
  }, [currentDate, setSearchParams]);
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
  const handleCellClick = (day: number) => {
    const selectedDate = new Date(getYear(currentDate), getMonth(currentDate), day);
    
    // Se la cella è già selezionata, deselezionala
    if (selectedDay === day) {
      setSelectedDay(null);
      
      // Rimuovi i parametri date e timeSlot dall'URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('day');
      setSearchParams(newParams, { replace: true });
      
      toast.info('Filtro rimosso');
      return;
    }
    
    setSelectedDay(day);
    
    // Aggiorna i parametri URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('day', day.toString());
    setSearchParams(newParams, { replace: true });
    
    toast.info('Filtro applicato', {
      description: `Selezionato ${format(selectedDate, 'd MMMM yyyy', { locale: it })}`
    });
  };

  // Genera le celle della matrice usando CSS Grid
  const generateMatrix = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const year = getYear(currentDate);
    const month = getMonth(currentDate);
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return (
      <div className="overflow-x-auto pb-2">
        <div 
          className="grid gap-[1px] bg-border" 
          style={{ 
            gridTemplateColumns: `minmax(120px, auto) repeat(${daysInMonth}, minmax(24px, 1fr))`,
            width: 'max-content',
            minWidth: '100%'
          }}
        >
          {/* Header row - labels */}
          <div className="p-1 bg-muted font-medium text-left">Turno / Giorno 1</div>
          
          {/* Header row - days */}
          {days.map(day => {
            const date = new Date(year, month, day);
            const dateString = format(date, 'yyyy-MM-dd');
            const openDay = getOpenDayInfo(dateString);
            const isOpen = openDay?.morning;
            
            return (<div 
              key={day}
              className={cn(
                "p-1 bg-muted font-medium text-center shadow-sm hover:shadow-md transition-shadow flex items-center justify-center",
                isOpen ? "cursor-pointer" : "cursor-not-allowed",
                selectedDay === day && "bg-primary text-white",
              )}
              onClick={() => isOpen && handleCellClick(day)}
            >
              {day}
            </div>)
          })}
          
          {/* Morning row - label */}
          <div className="p-1 bg-muted font-medium">Mattina</div>
          
          {/* Morning row - cells */}
          {days.map(day => {
            const date = new Date(year, month, day);
            const dateString = format(date, 'yyyy-MM-dd');
            const openDay = getOpenDayInfo(dateString);
            const isOpen = openDay?.morning;
            const count = isOpen ? countShiftRegistrations(dateString, 'MORNING') : 0;
            
            return (
              <div 
                key={`morning-${day}`} 
                className={cn(
                  "p-1 text-center shadow-sm hover:shadow-md transition-shadow flex items-center justify-center",
                  isOpen ? getCellColor(count) : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600",
                  selectedDay === day && selectedTimeSlot === 'MORNING' && "ring-2 ring-primary"
                )}
              >
                {isOpen ? count : ''}
              </div>
            );
          })}
          
          {/* Afternoon row - label */}
          <div className="p-1 bg-muted font-medium">Pomeriggio</div>
          
          {/* Afternoon row - cells */}
          {days.map(day => {
            const date = new Date(year, month, day);
            const dateString = format(date, 'yyyy-MM-dd');
            const openDay = getOpenDayInfo(dateString);
            const isOpen = openDay?.afternoon;
            const count = isOpen ? countShiftRegistrations(dateString, 'AFTERNOON') : 0;
            
            return (
              <div 
                key={`afternoon-${day}`} 
                className={cn(
                  "p-1 text-center shadow-sm hover:shadow-md transition-shadow flex items-center justify-center",
                  isOpen ? getCellColor(count) : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600",
                  selectedDay === day && selectedTimeSlot === 'AFTERNOON' && "ring-2 ring-primary"
                )}
              >
                {isOpen ? count : ''}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizza il componente
  return (
    <Card>
      <CardHeader>
        <CardTitle>Turni Matrix - {format(currentDate, 'MMMM yyyy', { locale: it })}</CardTitle>
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
                    const prevMonth = new Date(currentDate);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setCurrentDate(prevMonth);
                  }}
                >
                  Mese precedente
                </button>
                <button
                  className="px-2 py-1 text-sm border rounded hover:bg-muted"
                  onClick={() => {
                    const nextMonth = new Date(currentDate);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setCurrentDate(nextMonth);
                  }}
                >
                  Mese successivo
                </button>
              </div>
            </div>
            {generateMatrix()}
            {selectedDay && (
              <div className="mt-4 p-3 border rounded-md bg-muted/30">
                <h3 className="font-medium">
                  Filtro attivo: {format(new Date(getYear(currentDate), getMonth(currentDate), selectedDay), 'd MMMM', { locale: it })} - {selectedTimeSlot === 'MORNING' ? 'Mattina' : 'Pomeriggio'}
                </h3>
                <button
                  className="mt-2 px-2 py-1 text-sm border rounded hover:bg-muted"
                  onClick={() => {
                    setSelectedDay(null);
                    setSelectedTimeSlot(null);
                    
                    // Rimuovi i parametri date e timeSlot dall'URL
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('day');
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

export default TurniMatrix;