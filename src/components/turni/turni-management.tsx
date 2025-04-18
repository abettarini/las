import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/auth-context';
import { API_URL } from '@/lib/utils';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Loader2, Plus, Search, Users } from 'lucide-react';
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

interface Director {
  id: string;
  name: string;
}

export function TurniManagementComponent() {
  const { token } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDirector, setSelectedDirector] = useState<string>('all');
  const [directors, setDirectors] = useState<Director[]>([]);
  const [turni, setTurni] = useState<Turno[]>([]);
  const [openDays, setOpenDays] = useState<OpenDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [availableShifts, setAvailableShifts] = useState<{morning: boolean, afternoon: boolean}>({morning: false, afternoon: false});
  const [showShiftsPanel, setShowShiftsPanel] = useState(false);
  
  // Dialog state
  const [dialogSelectedDirector, setDialogSelectedDirector] = useState<string>('');
  const [dialogSelectedTimeSlot, setDialogSelectedTimeSlot] = useState<'MORNING' | 'AFTERNOON' | null>(null);

  // Ottieni i parametri URL
  const [searchParams] = useSearchParams();
  
  // Carica i dati iniziali
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Carica i direttori
        const directorsResponse = await fetch(`${API_URL}/users/directors`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (directorsResponse.ok) {
          const directorsData = await directorsResponse.json();
          setDirectors(directorsData);
        }
        
        // Carica i giorni aperti
        const openDaysResponse = await fetch(`${API_URL}/turni/open-days`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (openDaysResponse.ok) {
          const openDaysData = await openDaysResponse.json();
          setOpenDays(openDaysData);
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
        }
      } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
        toast.error("Errore", {
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
  
  // Sincronizza i filtri con i parametri URL
  useEffect(() => {
    const dateParam = searchParams.get('date');
    const timeSlotParam = searchParams.get('timeSlot') as 'MORNING' | 'AFTERNOON' | null;
    
    if (dateParam) {
      try {
        const date = new Date(dateParam);
        setSelectedDate(date);
      } catch (e) {
        console.error("Errore nel parsing della data:", e);
      }
    }
    
    // Aggiorna il timeSlot nel dialog se necessario
    if (timeSlotParam === 'MORNING' || timeSlotParam === 'AFTERNOON') {
      setDialogSelectedTimeSlot(timeSlotParam);
    }
  }, [searchParams]);

  // Filtra i turni in base ai criteri selezionati
  const filteredTurni = turni.filter(turno => {
    let matchesDate = true;
    let matchesDirector = true;
    
    if (selectedDate) {
      const turnoDate = format(new Date(turno.date), 'yyyy-MM-dd');
      const filterDate = format(selectedDate, 'yyyy-MM-dd');
      matchesDate = turnoDate === filterDate;
    }
    
    if (selectedDirector && selectedDirector !== 'all') {
      matchesDirector = turno.userId === selectedDirector;
    }
    
    return matchesDate && matchesDirector;
  });

  // Funzione per iscrivere un direttore a un turno
  const handleIscriviDirector = async () => {
    if (!selectedDate || !dialogSelectedTimeSlot || !dialogSelectedDirector || !token) {
      toast("Seleziona un direttore e una fascia oraria");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/turni/register-director`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: dialogSelectedDirector,
          date: format(selectedDate, 'yyyy-MM-dd'),
          timeSlot: dialogSelectedTimeSlot
        })
      });

      if (response.ok) {
        const newTurno = await response.json();
        setTurni([...turni, newTurno]);
        
        const directorName = directors.find(d => d.id === dialogSelectedDirector)?.name || 'Direttore';
        toast.info('Turno iscritto', {
          description: `${directorName} è stato iscritto al turno di ${dialogSelectedTimeSlot === 'MORNING' ? 'mattina' : 'pomeriggio'} del ${format(selectedDate, 'd MMMM yyyy', { locale: it })}`,
        });
        
        // Reset dialog state
        setDialogSelectedDirector('');
        setDialogSelectedTimeSlot(null);
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Errore",
          description: errorData.message || "Impossibile completare l'iscrizione",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Errore durante l'iscrizione al turno:", error);
      toast.error('Errore',{
        description: "Si è verificato un errore durante l'iscrizione",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funzione per annullare un turno
  const handleAnnullaTurno = async (turnoId: string) => {
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
        setTurni(turni.filter(turno => turno.id !== turnoId));
        toast({
          title: "Turno annullato",
          description: "Il turno è stato annullato con successo",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Errore",
          description: errorData.message || "Impossibile annullare il turno",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Errore durante l'annullamento del turno:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'annullamento",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(null);
    }
  };

  // Funzione per verificare se un giorno è aperto
  const isOpenDay = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return openDays.some(day => day.date === dateString);
  };

  // Funzione per ottenere le informazioni di un giorno aperto
  const getOpenDayInfo = (date: Date): OpenDay | undefined => {
    const dateString = format(date, 'yyyy-MM-dd');
    return openDays.find(day => day.date === dateString);
  };
  
  // Funzione per contare le iscrizioni per un turno specifico
  const countShiftRegistrations = (date: string, timeSlot: 'MORNING' | 'AFTERNOON'): number => {
    return turni.filter(turno => 
      turno.date === date && 
      turno.timeSlot === timeSlot
    ).length;
  };
  
  // Aggiorna i turni disponibili quando cambia la data selezionata
  useEffect(() => {
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const openDay = getOpenDayInfo(selectedDate);
      
      if (openDay) {
        setAvailableShifts({
          morning: openDay.isMorningOpen,
          afternoon: openDay.isAfternoonOpen
        });
        setShowShiftsPanel(true);
      } else {
        setAvailableShifts({morning: false, afternoon: false});
        setShowShiftsPanel(false);
      }
    } else {
      setShowShiftsPanel(false);
    }
  }, [selectedDate, openDays]);

  // Renderizza il componente
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestione Turni</h1>
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              // Reset dialog state when closing
              setDialogSelectedDirector('');
              setDialogSelectedTimeSlot(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={!selectedDate}>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi al Turno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Iscrivi Direttore al Turno</DialogTitle>
              <DialogDescription>
                {selectedDate ? (
                  `Seleziona un direttore e una fascia oraria per il ${format(selectedDate, 'd MMMM yyyy', { locale: it })}`
                ) : (
                  'Seleziona prima una data dal calendario'
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="director">Direttore</Label>
                <Select 
                  value={dialogSelectedDirector} 
                  onValueChange={setDialogSelectedDirector}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un direttore" />
                  </SelectTrigger>
                  <SelectContent>
                    {directors.map((director) => (
                      <SelectItem key={director.id} value={director.id}>
                        {director.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedDate && (
                <div className="grid gap-2">
                  <Label>Fascia Oraria</Label>
                  <RadioGroup 
                    value={dialogSelectedTimeSlot || ''} 
                    onValueChange={(value) => setDialogSelectedTimeSlot(value as 'MORNING' | 'AFTERNOON')}
                    className="grid grid-cols-2 gap-4"
                  >
                    {getOpenDayInfo(selectedDate)?.isMorningOpen && (
                      <div>
                        <RadioGroupItem 
                          value="MORNING" 
                          id="dialog-morning" 
                          className="peer sr-only" 
                        />
                        <label
                          htmlFor="dialog-morning"
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
                          id="dialog-afternoon" 
                          className="peer sr-only" 
                        />
                        <label
                          htmlFor="dialog-afternoon"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-medium">Pomeriggio</span>
                        </label>
                      </div>
                    )}
                  </RadioGroup>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Annulla
              </Button>
              <Button 
                onClick={handleIscriviDirector} 
                disabled={!dialogSelectedDirector || !dialogSelectedTimeSlot || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iscrizione in corso...
                  </>
                ) : (
                  'Iscrivi'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filtri */}


        {/* Elenco turni */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Elenco Turni</CardTitle>
            <CardDescription>
              {filteredTurni.length} turni trovati
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTurni.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Search className="h-12 w-12 mb-2" />
                <p>Nessun turno trovato con i filtri selezionati</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Raggruppa i turni per data */}
                {Object.entries(
                  filteredTurni
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
                  const turnoDate = new Date(date);
                  
                  return (
                    <div key={date} className="border rounded-md overflow-hidden">
                      {/* Intestazione con la data */}
                      <div className="bg-muted p-3 border-b">
                        <h3 className="font-medium">
                          {format(turnoDate, 'EEEE d MMMM yyyy', { locale: it })}
                        </h3>
                      </div>
                      
                      {/* Layout a due colonne per mattina e pomeriggio */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                        {/* Colonna mattina */}
                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-3 flex items-center justify-between">
                            <span>Mattina</span>
                            <Badge variant="outline" className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {morningTurni.length}
                            </Badge>
                          </h4>
                          
                          {morningTurni.length > 0 ? (
                            <div className="space-y-2">
                              {morningTurni.map(turno => (
                                <div 
                                  key={turno.id} 
                                  className="flex justify-between items-center p-2 border rounded-md bg-background"
                                >
                                  <div className="text-sm font-medium">
                                    {turno.userName}
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleAnnullaTurno(turno.id)}
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
                              Nessun direttore iscritto
                            </div>
                          )}
                        </div>
                        
                        {/* Colonna pomeriggio */}
                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-3 flex items-center justify-between">
                            <span>Pomeriggio</span>
                            <Badge variant="outline" className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {afternoonTurni.length}
                            </Badge>
                          </h4>
                          
                          {afternoonTurni.length > 0 ? (
                            <div className="space-y-2">
                              {afternoonTurni.map(turno => (
                                <div 
                                  key={turno.id} 
                                  className="flex justify-between items-center p-2 border rounded-md bg-background"
                                >
                                  <div className="text-sm font-medium">
                                    {turno.userName}
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleAnnullaTurno(turno.id)}
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
                              Nessun direttore iscritto
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
    </div>
  );
}

export default TurniManagementComponent;