import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import {
  EventSchedule,
  EventType,
  EventTypeConfig,
  eventTypes,
  formatAdvanceBookingTime,
  getCurrentSeasonId,
  getEventSchedule,
  getEventTypeConfig,
  getMinBookingDate,
  isExceptionalOpening,
  isHolidayClosure,
  isSpecialClosure
} from './event-type';

// Componenti UI
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definizione dello schema di validazione con Zod
const bookingFormSchema = z.object({
  eventType: z.string().min(1, "Seleziona un tipo di evento"),
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  surname: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  phone: z.string().min(6, "Inserisci un numero di telefono valido"),
  date: z.date({
    required_error: "Seleziona una data",
    invalid_type_error: "Data non valida",
  }),
  time: z.string().min(1, "Seleziona un orario"),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Devi accettare l'informativa sulla privacy per continuare" }),
  }),
});

// Tipo derivato dallo schema Zod
type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingComponent: React.FC = () => {
  // Ottieni il primo tipo di evento disponibile dalla configurazione
  const currentSeasonId = getCurrentSeasonId();
  const defaultEventType = Object.keys(eventTypes)[0] as EventType;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentEventTypeConfig, setCurrentEventTypeConfig] = useState<EventTypeConfig | null>(null);
  const [currentEventSchedule, setCurrentEventSchedule] = useState<EventSchedule | null>(null);
  const [seasonId, setSeasonId] = useState<string>(currentSeasonId);

  // Inizializzazione di React Hook Form con Zod
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      eventType: defaultEventType,
      name: "",
      surname: "",
      email: "",
      phone: "",
      privacyConsent: false,
    },
  });

  // Estrai i valori correnti dal form
  const watchEventType = form.watch("eventType") as EventType;

  // Aggiorna la configurazione quando cambia il tipo di evento
  useEffect(() => {
    const currentSeasonId = getCurrentSeasonId();
    setSeasonId(currentSeasonId);

    const typeConfig = getEventTypeConfig(watchEventType);
    setCurrentEventTypeConfig(typeConfig);

    const schedule = getEventSchedule(watchEventType, new Date());
    setCurrentEventSchedule(schedule);

    // Resetta data e ora selezionate quando cambia il tipo di evento
    setSelectedDate(undefined);
    setSelectedTime('');
    form.setValue("date", undefined as any);
    form.setValue("time", "");
  }, [watchEventType, form]);

  // Funzione per verificare se una data è disponibile per la prenotazione
  const isDateAvailable = (date: Date): boolean => {
    if (!currentEventTypeConfig || !currentEventSchedule) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verifica se la data è nel passato
    if (date < today) return false;

    // Verifica il tempo minimo di anticipo
    const minDate = getMinBookingDate(currentEventTypeConfig.minAdvanceBooking);
    minDate.setHours(0, 0, 0, 0);

    if (date < minDate) return false;

    // Verifica se è un'apertura eccezionale (sempre disponibile per prenotazioni)
    if (isExceptionalOpening(date)) return true;

    // Verifica se è un giorno di chiusura festiva
    if (isHolidayClosure(date)) return false;

    // Verifica se è un giorno di chiusura speciale (senza orario ridotto)
    const specialClosure = isSpecialClosure(date);
    if (specialClosure && !specialClosure.orarioRidotto) return false;

    // Verifica se il giorno della settimana è disponibile
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    return Object.keys(currentEventSchedule.availableDays).includes(weekday);
  };

  // Funzione per formattare la data in formato ISO (YYYY-MM-DD)
  const formatDateToISO = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Funzione per gestire l'invio del form
  const onSubmit = (data: BookingFormValues) => {
    // Logica per inviare i dati al service worker di Cloudflare
    console.log({
      ...data,
      date: formatDateToISO(data.date),
      seasonId
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Prenotazione</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonna sinistra: Tipo evento e dati personali */}
          <div className="w-full lg:w-1/2 space-y-6">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-lg">Tipo evento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo evento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(eventTypes).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentEventTypeConfig && (
              <div className="mt-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="font-medium">Orario {seasonId === 'orarioEstivo' ? 'Estivo' : 'Invernale'}</p>
                <p>{currentEventTypeConfig.recommendations}</p>
                <p className="mt-1 font-medium text-blue-700">
                  Prenotazione con almeno {formatAdvanceBookingTime(currentEventTypeConfig.minAdvanceBooking)} di anticipo
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Dati personali</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Cognome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Indirizzo Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Numero di telefono</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Colonna destra: Calendario e selezione orari */}
          <div className="w-full lg:w-1/2 space-y-6 lg:border-l lg:pl-8">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-lg">Seleziona data</FormLabel>
                  <div className="border rounded-md p-1 bg-gray-50">
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date: Date | undefined) => {
                          if (date && isDateAvailable(date)) {
                            field.onChange(date);
                            setSelectedDate(date);
                            setSelectedTime('');
                            form.setValue("time", "");
                          }
                        }}
                        disabled={(date) => !isDateAvailable(date)}
                        locale={it}
                        className="mx-auto"
                      />
                    </FormControl>
                  </div>
                  {selectedDate && (
                    <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <p className="text-sm font-medium text-green-800">
                        Data selezionata: {format(selectedDate, "EEEE d MMMM yyyy", { locale: it })}
                      </p>
                      {isExceptionalOpening(selectedDate) && (
                        <p className="text-sm font-medium text-purple-600 mt-1">
                          Apertura straordinaria: {isExceptionalOpening(selectedDate)?.descrizione}
                        </p>
                      )}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedDate && currentEventSchedule && (
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-lg">Seleziona orario</FormLabel>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-gray-50 p-4 rounded-md border">
                      {(() => {
                        // Verifica se è un'apertura eccezionale
                        const exceptionalOpening = isExceptionalOpening(selectedDate);
                        if (exceptionalOpening) {
                          // Per le aperture eccezionali, generiamo orari ogni ora dall'inizio alla fine
                          const { start, end } = exceptionalOpening.orario;
                          const [startHour, startMinute] = start.split(':').map(Number);
                          const [endHour, endMinute] = end.split(':').map(Number);

                          const availableTimes = [];
                          let currentHour = startHour;

                          while (currentHour < endHour || (currentHour === endHour && 0 < endMinute)) {
                            availableTimes.push(`${currentHour.toString().padStart(2, '0')}:00`);
                            if (currentHour < endHour) {
                              availableTimes.push(`${currentHour.toString().padStart(2, '0')}:30`);
                            }
                            currentHour++;
                          }

                          return availableTimes.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={field.value === time ? "default" : "outline"}
                              onClick={() => {
                                field.onChange(time);
                                setSelectedTime(time);
                              }}
                              className="h-10"
                            >
                              {time}
                            </Button>
                          ));
                        } else {
                          // Ottieni il giorno della settimana dalla data selezionata
                          const weekday = selectedDate.toLocaleString('en-US', { weekday: 'long' });
                          // Ottieni gli orari disponibili per quel giorno
                          const availableTimes = currentEventSchedule.availableDays[weekday] || [];

                          return availableTimes.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={field.value === time ? "default" : "outline"}
                              onClick={() => {
                                field.onChange(time);
                                setSelectedTime(time);
                              }}
                              className="h-10"
                            >
                              {time}
                            </Button>
                          ));
                        }
                      })()}
                    </div>
                    {selectedTime && (
                      <p className="text-sm font-medium text-blue-700 mt-2">
                        Orario selezionato: {selectedTime}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Checkbox per la privacy */}
        <div className="mt-8 border-t pt-6">
          <FormField
            control={form.control}
            name="privacyConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Accetto l'<Link to="/privacy" className="text-blue-600 hover:underline">informativa sulla privacy</Link> e il trattamento dei miei dati personali
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Bottone di invio posizionato dopo entrambe le colonne */}
        <div className="mt-8">
          <Button
            type="submit"
            className="w-full md:w-1/2 mx-auto block"
          >
            Prenota
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingComponent;
