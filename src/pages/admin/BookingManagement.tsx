import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, CalendarIcon, Check, Loader2, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DayClickEventHandler } from 'react-day-picker';
import { toast } from 'sonner';
import { getBookings, GetBookingsOptions, updateBookingStatus } from '../../services/admin-service';
import { BookingData, getEventTypeLabel } from '../../services/booking-service';

export function BookingManagement() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [allBookings, setAllBookings] = useState<BookingData[]>([]); // Tutte le prenotazioni per il calendario
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  useEffect(() => {
    loadBookings();
  }, [page, statusFilter, eventTypeFilter, selectedDate]);

  // Carica tutte le prenotazioni per il calendario
  useEffect(() => {
    const loadAllBookings = async () => {
      try {
        // Carica tutte le prenotazioni con un limite alto per avere dati per il calendario
        const response = await getBookings({ limit: 1000 });
        if (response.success) {
          setAllBookings(response.bookings);
          
          // Estrai i tipi di evento unici
          const uniqueEventTypes = Array.from(new Set(response.bookings.map(booking => booking.eventType)));
          setEventTypes(uniqueEventTypes);
        }
      } catch (error) {
        console.error('Errore durante il caricamento di tutte le prenotazioni:', error);
      }
    };
    
    loadAllBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const options: GetBookingsOptions = {
        page,
        limit: 10
      };

      if (statusFilter !== 'all') {
        options.status = statusFilter;
      }

      if (eventTypeFilter !== 'all') {
        options.eventType = eventTypeFilter;
      }

      if (searchTerm) {
        options.search = searchTerm;
      }

      // Se è selezionata una data, aggiungi il filtro per data
      if (selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        options.startDate = formattedDate;
        options.endDate = formattedDate;
      }

      const response = await getBookings(options);
      if (response.success) {
        setBookings(response.bookings);
        setTotalPages(Math.ceil(response.total / response.limit));
      } else {
        toast.error('Errore', {
          description: response.message || 'Impossibile caricare le prenotazioni'
        });
      }
    } catch (error) {
      console.error('Errore durante il caricamento delle prenotazioni:', error);
      toast.error('Errore', {
        description: 'Si è verificato un errore durante il caricamento delle prenotazioni'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadBookings();
  };

  const handleStatusChange = (status: 'all' | 'pending' | 'confirmed' | 'cancelled') => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleEventTypeChange = (eventType: string) => {
    setEventTypeFilter(eventType);
    setPage(1);
  };
  
  // Gestisce la selezione di una data nel calendario
  const handleDateSelect: DayClickEventHandler = (day) => {
    if (selectedDate && isSameDay(day, selectedDate)) {
      // Se la data selezionata è già selezionata, deselezionala
      setSelectedDate(undefined);
    } else {
      setSelectedDate(day);
    }
    setIsCalendarOpen(false);
    setPage(1);
  };
  
  // Resetta il filtro per data
  const handleResetDateFilter = () => {
    setSelectedDate(undefined);
    setPage(1);
  };
  
  // Calcola i giorni in cui ci sono prenotazioni per evidenziarli nel calendario
  const daysWithBookings = useMemo(() => {
    const days = new Set<string>();
    
    allBookings.forEach(booking => {
      days.add(booking.date);
    });
    
    return Array.from(days).map(dateStr => new Date(dateStr));
  }, [allBookings]);

  const handleViewBooking = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsConfirmDialogOpen(true);
  };

  const handleCancelBooking = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedBooking) return;
    
    setActionLoading(true);
    try {
      const response = await updateBookingStatus(selectedBooking.id, 'confirmed');
      if (response.success) {
        toast.success('Prenotazione confermata', {
          description: 'La prenotazione è stata confermata con successo'
        });
        setIsConfirmDialogOpen(false);
        loadBookings();
      } else {
        toast.error('Errore', {
          description: response.message || 'Impossibile confermare la prenotazione'
        });
      }
    } catch (error) {
      console.error('Errore durante la conferma della prenotazione:', error);
      toast.error('Errore', {
        description: 'Si è verificato un errore durante la conferma della prenotazione'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!selectedBooking) return;
    
    setActionLoading(true);
    try {
      const response = await updateBookingStatus(selectedBooking.id, 'cancelled');
      if (response.success) {
        toast.success('Prenotazione annullata', {
          description: 'La prenotazione è stata annullata con successo'
        });
        setIsCancelDialogOpen(false);
        loadBookings();
      } else {
        toast.error('Errore', {
          description: response.message || 'Impossibile annullare la prenotazione'
        });
      }
    } catch (error) {
      console.error('Errore durante l\'annullamento della prenotazione:', error);
      toast.error('Errore', {
        description: 'Si è verificato un errore durante l\'annullamento della prenotazione'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">In attesa</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Confermata</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Annullata</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: it });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: it });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestione Prenotazioni</h1>
        <p className="text-muted-foreground">Visualizza e gestisci le prenotazioni degli utenti.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtri</CardTitle>
          <CardDescription>Filtra le prenotazioni per stato, tipo di evento o cerca per nome, cognome o email.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Cerca</Label>
              <div className="flex">
                <Input
                  id="search"
                  placeholder="Nome, cognome o email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-r-none"
                />
                <Button
                  variant="default"
                  className="rounded-l-none"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Stato</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => handleStatusChange(value as 'all' | 'pending' | 'confirmed' | 'cancelled')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleziona stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="pending">In attesa</SelectItem>
                  <SelectItem value="confirmed">Confermate</SelectItem>
                  <SelectItem value="cancelled">Annullate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Tipo di evento</Label>
              <Select
                value={eventTypeFilter}
                onValueChange={handleEventTypeChange}
              >
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>{getEventTypeLabel(type)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <div className="flex">
                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <DialogTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!selectedDate ? 'text-muted-foreground' : ''}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: it }) : 'Seleziona data'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-0" style={{ maxWidth: 'fit-content' }}>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => handleDateSelect(date as Date)}
                      modifiers={{
                        booked: daysWithBookings
                      }}
                      modifiersStyles={{
                        booked: {
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          color: '#166534'
                        }
                      }}
                      locale={it}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {selectedDate && (
              <div className="space-y-2 flex items-end">
                <Button 
                  variant="ghost" 
                  onClick={handleResetDateFilter}
                  className="h-10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Rimuovi filtro data
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prenotazioni</CardTitle>
          <CardDescription>
            Elenco delle prenotazioni. Puoi visualizzare i dettagli, confermare o annullare le prenotazioni.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ora</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.name} {booking.surname}</div>
                          <div className="text-sm text-muted-foreground">{booking.email}</div>
                        </TableCell>
                        <TableCell>{getEventTypeLabel(booking.eventType)}</TableCell>
                        <TableCell>{formatDate(booking.date)}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewBooking(booking)}
                            >
                              Dettagli
                            </Button>
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleConfirmBooking(booking)}
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Conferma
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking)}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Annulla
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Pagina {page} di {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Precedente
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Successiva
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
              <Calendar className="mb-2 h-10 w-10" />
              <p>Nessuna prenotazione trovata</p>
              <p className="text-sm">Prova a modificare i filtri di ricerca</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog per visualizzare i dettagli della prenotazione */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dettagli Prenotazione</DialogTitle>
            <DialogDescription>
              Informazioni complete sulla prenotazione selezionata.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Prenotazione</Label>
                  <p className="text-sm font-medium">{selectedBooking.id}</p>
                </div>
                <div>
                  <Label>Stato</Label>
                  <p className="text-sm">{getStatusBadge(selectedBooking.status)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Cliente</Label>
                <p className="text-sm font-medium">{selectedBooking.name} {selectedBooking.surname}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.email}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo Evento</Label>
                  <p className="text-sm font-medium">{getEventTypeLabel(selectedBooking.eventType)}</p>
                </div>
                <div>
                  <Label>ID Stagione</Label>
                  <p className="text-sm font-medium">{selectedBooking.seasonId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data</Label>
                  <p className="text-sm font-medium">{formatDate(selectedBooking.date)}</p>
                </div>
                <div>
                  <Label>Ora</Label>
                  <p className="text-sm font-medium">{selectedBooking.time}</p>
                </div>
              </div>
              
              <div>
                <Label>Data Creazione</Label>
                <p className="text-sm font-medium">{formatDateTime(selectedBooking.createdAt)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Chiudi
            </Button>
            {selectedBooking && selectedBooking.status === 'pending' && (
              <>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setIsConfirmDialogOpen(true);
                  }}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Conferma
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setIsCancelDialogOpen(true);
                  }}
                >
                  <X className="mr-1 h-4 w-4" />
                  Annulla
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog per confermare una prenotazione */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conferma Prenotazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler confermare questa prenotazione?
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-2">
              <p><span className="font-medium">Cliente:</span> {selectedBooking.name} {selectedBooking.surname}</p>
              <p><span className="font-medium">Tipo:</span> {selectedBooking.eventType}</p>
              <p><span className="font-medium">Data:</span> {formatDate(selectedBooking.date)}</p>
              <p><span className="font-medium">Ora:</span> {selectedBooking.time}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={actionLoading}>
              Annulla
            </Button>
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmBooking}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conferma in corso...
                </>
              ) : (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  Conferma Prenotazione
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog per annullare una prenotazione */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Annulla Prenotazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler annullare questa prenotazione? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-2">
              <p><span className="font-medium">Cliente:</span> {selectedBooking.name} {selectedBooking.surname}</p>
              <p><span className="font-medium">Tipo:</span> {selectedBooking.eventType}</p>
              <p><span className="font-medium">Data:</span> {formatDate(selectedBooking.date)}</p>
              <p><span className="font-medium">Ora:</span> {selectedBooking.time}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={actionLoading}>
              Indietro
            </Button>
            <Button 
              variant="destructive"
              onClick={cancelBooking}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Annullamento in corso...
                </>
              ) : (
                <>
                  <X className="mr-1 h-4 w-4" />
                  Annulla Prenotazione
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}