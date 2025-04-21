import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { API_URL } from '@/lib/utils';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarCheck, CalendarDays, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './director-calendar.css';

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

export function DirectorHomeCalendar() {
  const { token } = useAuth();
  
  const [openDays, setOpenDays] = useState<OpenDay[]>([]);
  const [myTurni, setMyTurni] = useState<Turno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextTurni, setNextTurni] = useState<Turno[]>([]);

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
          console.error("Impossibile caricare i giorni di apertura");
        }
      } catch (error) {
        console.error("Errore durante il caricamento dei giorni aperti:", error);
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
          
          // Filtra e ordina i prossimi turni
          const futureTurni = data
            .filter((turno: Turno) => {
              const turnoDate = new Date(turno.date);
              return turnoDate >= new Date(new Date().setHours(0, 0, 0, 0));
            })
            .sort((a: Turno, b: Turno) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            })
            .slice(0, 3); // Prendi solo i prossimi 3 turni
          
          setNextTurni(futureTurni);
        } else {
          console.error("Impossibile caricare i tuoi turni");
        }
      } catch (error) {
        console.error("Errore durante il caricamento dei turni:", error);
      }
    };

    if (token) {
      fetchOpenDays();
      fetchMyTurni();
    }
  }, [token]);

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

  // Funzione per verificare se l'utente è già iscritto a un turno in una data specifica
  const isRegisteredDay = (date: Date) => {
    try {
      if (date && !isNaN(date.getTime())) {
        const dateString = format(date, 'yyyy-MM-dd');
        return myTurni.some(turno => turno.date === dateString);
      }
      return false;
    } catch (error) {
      console.error('Errore nella verifica del giorno registrato:', error);
      return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      {/* Hero / Call to Action */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold leading-tight">
          Gestisci i tuoi <span className="text-primary">Turni</span>
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Come direttore, puoi iscriverti ai turni disponibili per supervisionare le attività del poligono. 
          Consulta il calendario per vedere i giorni disponibili e quelli in cui sei già iscritto.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900"></div>
            <span>Giorni con turni disponibili</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900"></div>
            <span>Giorni in cui sei già iscritto</span>
          </div>
        </div>
        
        <Button size="lg" asChild>
          <Link to="/account/turni">
            Gestisci i tuoi turni
          </Link>
        </Button>
        

      </div>

      {/* Calendario */}
      <Card className="h-full md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Calendario Turni
          </CardTitle>
          <CardDescription>
            Visualizza i giorni disponibili e quelli in cui sei già iscritto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-row gap-4">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={() => {}}
              className="rounded-md border"
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
              }}
              modifiers={{
                registered: (date) => isRegisteredDay(date),
                openDay: (date) => isOpenDay(date) && !isRegisteredDay(date),
              }}
              modifiersStyles={{
                registered: { 
                  backgroundColor: "var(--green-100)",
                  color: "var(--green-800)",
                  fontWeight: "500",
                  borderRadius: "9999px"
                },
                openDay: { 
                  backgroundColor: "var(--blue-100)",
                  color: "var(--blue-800)",
                  fontWeight: "500",
                  borderRadius: "9999px"
                }
              }}
            />
            {nextTurni.length > 0 && (
              <div className="flex-1">
                <div className="space-y-3">
                  {nextTurni.map(turno => {
                    try {
                      const turnoDate = new Date(turno.date);
                      if (!isNaN(turnoDate.getTime())) {
                        return (
                          <div 
                            key={turno.id} 
                            className="flex items-center gap-3 p-3 border rounded-md bg-background"
                          >
                            <CalendarCheck className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium">
                                {format(turnoDate, 'EEEE d MMMM', { locale: it })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {turno.timeSlot === 'MORNING' ? 'Mattina' : 'Pomeriggio'}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    } catch (error) {
                      console.error('Errore nella formattazione della data:', error);
                      return null;
                    }
                  })}
                </div>
              </div>
            )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}