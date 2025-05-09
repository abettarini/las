import { useAuth } from '@/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Turnstile from 'react-turnstile';
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
import EventTypeSelector from './event-type-selector';

// Componenti UI
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Definizione dello schema di validazione con Zod
const createBookingFormSchema = (isAuthenticated: boolean) => {
  // Schema base comune a tutti gli utenti
  const baseSchema = {
    eventType: z.string().min(1, "Seleziona un tipo di evento"),
    date: z.date({
      required_error: "Seleziona una data",
      invalid_type_error: "Data non valida",
    }),
    time: z.string().min(1, "Seleziona un orario"),
    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: "Devi accettare l'informativa sulla privacy per continuare" }),
    }),
    // Campo honey-pot nascosto - dovrebbe rimanere vuoto
    website: z.string().max(0, "Errore di validazione").optional(),
    // Token di Turnstile
    cfTurnstileResponse: z.string().min(1, "Verifica di sicurezza richiesta"),
  };

  // Se l'utente è autenticato, i campi personali sono opzionali
  if (isAuthenticated) {
    return z.object({
      ...baseSchema,
      name: z.string().optional(),
      surname: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().min(6, "Inserisci un numero di telefono valido"),
    });
  }

  // Se l'utente non è autenticato, i campi personali sono obbligatori
  return z.object({
    ...baseSchema,
    name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
    surname: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
    email: z.string().email("Inserisci un indirizzo email valido"),
    phone: z.string().min(6, "Inserisci un numero di telefono valido"),
  });
};

// Tipo derivato dallo schema Zod
export type BookingFormValues = z.infer<ReturnType<typeof createBookingFormSchema>>;

interface BookingFormProps {
  onSubmit: (data: BookingFormValues) => Promise<void>;
  submitError: string | null;
  isSubmitting: boolean;
  apiUrl: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  submitError,
  isSubmitting,
  apiUrl
}) => {
  // Ottieni il primo tipo di evento disponibile dalla configurazione
  const currentSeasonId = getCurrentSeasonId();
  const defaultEventType = Object.keys(eventTypes)[0] as EventType;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentEventTypeConfig, setCurrentEventTypeConfig] = useState<EventTypeConfig | null>(null);
  const [currentEventSchedule, setCurrentEventSchedule] = useState<EventSchedule | null>(null);
  const [seasonId, setSeasonId] = useState<string>(currentSeasonId);

  // Autenticazione
  const { isAuthenticated, user } = useAuth();

  // Riferimento per il componente Turnstile
  const turnstileRef = useRef<any>(null);

  // Inizializzazione di React Hook Form con Zod
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(createBookingFormSchema(isAuthenticated)),
    defaultValues: {
      eventType: defaultEventType,
      name: isAuthenticated && user?.name ? user.name.split(' ')[0] : "",
      surname: isAuthenticated && user?.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : "",
      email: user?.email || "",
      phone: user?.phone || "",
      privacyConsent: false,
      website: "", // Campo honey-pot
      cfTurnstileResponse: "",
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

  // Aggiorna i campi e il resolver quando l'utente è autenticato
  useEffect(() => {
    // Aggiorna il resolver con lo schema appropriato
    form.clearErrors();

    if (isAuthenticated && user) {
      // Aggiorna i campi con i dati dell'utente
      form.setValue("email", user.email);

      if (user.name) {
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        form.setValue("name", firstName);
        form.setValue("surname", lastName);
      }

      if (user.phone) {
        form.setValue("phone", user.phone);
      }
      
      // Imposta il valore del consenso alla privacy se l'utente l'ha già dato
      if (user.privacyConsent) {
        form.setValue("privacyConsent", true);
      }
    }
  }, [isAuthenticated, user, form]);

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
    return format(date, "yyyy-MM-dd", { locale: it })
  };

  // Stato per controllare se Turnstile è stato validato
  const [isTurnstileVerified, setIsTurnstileVerified] = useState<boolean>(false);

  // Funzione per gestire il callback di Turnstile
  const handleTurnstileVerify = (token: string) => {
    form.setValue('cfTurnstileResponse', token);
    setIsTurnstileVerified(true);
  };

  // Funzione per gestire l'errore di Turnstile
  const handleTurnstileError = () => {
    form.setError('cfTurnstileResponse', {
      type: 'manual',
      message: 'Verifica di sicurezza fallita, riprova'
    });
    setIsTurnstileVerified(false);
  };

  // Funzione per verificare la disponibilità dell'orario selezionato
  const checkTimeAvailability = async (date: string, time: string, eventType: string): Promise<boolean> => {
    try {
      const response = await fetch(`${apiUrl}/booking/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time, eventType }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Errore durante la verifica della disponibilità:', result.message);
        return false;
      }

      return result.isAvailable;
    } catch (error) {
      console.error('Errore durante la verifica della disponibilità:', error);
      return false;
    }
  };

  // Funzione per gestire l'invio del form
  const handleSubmit = async (data: BookingFormValues) => {
    // Formatta la data in formato ISO
    console.log('Data selezionata:', data.date);
    console.log('Orario selezionato:', data.time);
    console.log('Tipo di evento selezionato:', data.eventType);
    console.log('Data formattata:', formatDateToISO(data.date));
    const formattedDate = formatDateToISO(data.date);

    // Verifica la disponibilità dell'orario prima di inviare la prenotazione
    const isAvailable = await checkTimeAvailability(formattedDate, data.time, data.eventType);

    if (!isAvailable) {
      form.setError('time', {
        type: 'manual',
        message: 'L\'orario selezionato non è più disponibile. Seleziona un altro orario.'
      });
      return;
    }

    // Prepara i dati da inviare con il seasonId
    let bookingData;

    if (isAuthenticated && user) {
      // Se l'utente è autenticato, utilizza i dati del profilo
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      bookingData = {
        ...data,
        name: firstName,
        surname: lastName,
        email: user.email,
        phone: user.phone || data.phone, // Usa il telefono dal profilo se disponibile, altrimenti dal form
        date: formattedDate,
        seasonId,
        isAuthenticated: true
      };
    } else {
      // Altrimenti utilizza i dati inseriti nel form
      bookingData = {
        ...data,
        date: formattedDate,
        seasonId,
        isAuthenticated: false
      };
    }

    // Chiama la funzione onSubmit passata come prop
    await onSubmit(bookingData);

    // Reset del token Turnstile
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
    setIsTurnstileVerified(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Prenotazione</h2>

        {/* Messaggio di errore */}
        {submitError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Si è verificato un errore</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonna sinistra: Tipo evento e dati personali */}
          <div className="w-full lg:w-1/2 space-y-6">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg">Seleziona tipo evento</FormLabel>
                  <FormControl>
                    <EventTypeSelector 
                      value={field.value}
                      onChange={field.onChange}
                      options={eventTypes}
                    />
                  </FormControl>
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

            {!isAuthenticated ? (
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
            ) : (
              // Per utenti autenticati, mostra i dati personali solo se manca il numero di telefono
              user && !user.phone ? (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Dati personali</h3>
                  <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                    <p className="text-amber-800">
                      <span className="font-medium">Attenzione:</span> Per completare la prenotazione è necessario specificare un numero di telefono.
                    </p>
                    <div className="mt-2">
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
                            <p className="text-xs text-muted-foreground">
                              Puoi anche aggiungere il tuo numero di telefono nel <a href="/account/profilo" className="text-blue-600 hover:underline">tuo profilo</a> per non doverlo inserire ogni volta.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Se l'utente ha tutti i dati, nascondi il riquadro ma mantieni il campo nascosto
                <div className="hidden">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )
            )}
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

        {/* Campo honey-pot nascosto */}
        <div style={{ display: 'none' }}>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (non compilare questo campo)</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Checkbox per la privacy - mostrato solo per utenti non autenticati o autenticati senza consenso privacy */}
        {(!isAuthenticated || (user && !user.privacyConsent)) && (
          <div className="mt-8 border-t pt-6">
            {isAuthenticated && user && !user.privacyConsent ? (
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mb-4">
                <p className="text-amber-800">
                  <span className="font-medium">Attenzione:</span> Per completare la prenotazione è necessario accettare l'informativa sulla privacy.
                </p>
                <p className="text-sm mt-2">
                  Puoi gestire le tue preferenze sulla privacy anche dal <Link to="/account/impostazioni" className="text-blue-600 hover:underline">tuo profilo</Link>.
                </p>
              </div>
            ) : null}
            
            <FormField
              control={form.control}
              name="privacyConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      isSelected={field.value}
                      onChange={(e) => {
                        const isSelected = e;
                        field.onChange(isSelected);
                        // Se la checkbox è selezionata, rimuovi l'errore
                        if (isSelected) {
                          form.clearErrors("privacyConsent");
                        }
                      }}
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
        )}
        
        {/* Messaggio informativo per utenti autenticati che hanno già accettato la privacy */}
        {isAuthenticated && user && user.privacyConsent && (
          <div className="mt-8 border-t pt-6">
            <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-4 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-800 font-medium">
                  Hai già accettato l'informativa sulla privacy
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Puoi gestire le tue preferenze sulla privacy dal <Link to="/account/impostazioni" className="text-blue-600 hover:underline">tuo profilo</Link>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cloudflare Turnstile e bottone di invio */}
        <div className="mt-6">
          <FormField
            control={form.control}
            name="cfTurnstileResponse"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col items-center">
                    {/* Mostra Turnstile solo se il bottone non è ancora visibile */}
                    {!isTurnstileVerified && (
                      <div className="mb-4">
                        <Turnstile
                          ref={turnstileRef}
                          sitekey="0x4AAAAAABDYSKm0qzHLkKyu"
                          onVerify={handleTurnstileVerify}
                          onError={handleTurnstileError}
                          theme="light"
                          language="it"
                        />
                      </div>
                    )}

                    {/* Messaggio di verifica completata */}
                    {isTurnstileVerified && (
                      <div className="mb-4 text-green-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verifica completata
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bottone di invio posizionato dopo entrambe le colonne - visibile solo dopo la verifica */}
        <div className="mt-8">
          {isTurnstileVerified ? (
            <Button
              type="submit"
              className="w-full md:w-1/2 mx-auto block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Invio in corso...
                </div>
              ) : (
                "Prenota"
              )}
            </Button>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              Completa la verifica di sicurezza per procedere
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;