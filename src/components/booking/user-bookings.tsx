import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BookingData, getUserBookings } from '@/services/booking-service';
import { format, isAfter, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventType, getEventTypeLabel } from './event-type';

interface UserBookingsProps {
  token: string | null;
  isAuthenticated: boolean;
}

const UserBookings: React.FC<UserBookingsProps> = ({ token, isAuthenticated }) => {
  // Stato per le prenotazioni dell'utente
  const [userBookings, setUserBookings] = useState<BookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Carica le prenotazioni dell'utente quando è autenticato
  useEffect(() => {
    if (isAuthenticated && token) {
      const fetchUserBookings = async () => {
        setLoadingBookings(true);
        setBookingsError(null);

        try {
          const response = await getUserBookings(token);

          if (response.success && response.bookings) {
            setUserBookings(response.bookings);
          } else {
            setBookingsError(response.message || 'Errore durante il recupero delle prenotazioni');
          }
        } catch (error) {
          console.error('Errore durante il recupero delle prenotazioni:', error);
          setBookingsError('Si è verificato un errore durante il recupero delle prenotazioni');
        } finally {
          setLoadingBookings(false);
        }
      };

      fetchUserBookings();
    }
  }, [isAuthenticated, token]);

  // Funzione per filtrare le prenotazioni future
  const getFutureBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return userBookings.filter(booking => {
      const bookingDate = parseISO(`${booking.date}T${booking.time}`);
      return isAfter(bookingDate, today) && booking.status !== 'cancelled';
    }).sort((a, b) => {
      const dateA = parseISO(`${a.date}T${a.time}`);
      const dateB = parseISO(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Funzione per filtrare le prenotazioni passate
  const getPastBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return userBookings.filter(booking => {
      const bookingDate = parseISO(`${booking.date}T${booking.time}`);
      return !isAfter(bookingDate, today) || booking.status === 'cancelled';
    }).sort((a, b) => {
      const dateA = parseISO(`${a.date}T${a.time}`);
      const dateB = parseISO(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime(); // Ordine decrescente per le prenotazioni passate
    });
  };

  // Ottieni le prenotazioni future e passate
  const futureBookings = getFutureBookings();
  const pastBookings = getPastBookings();

  // Non mostrare nulla se l'utente non è autenticato
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Le mie prenotazioni</h2>

      {loadingBookings ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Caricamento prenotazioni...</p>
        </div>
      ) : bookingsError ? (
        <div className="bg-blue-50 border-l-4 border-blue-300 text-blue-700 p-4 rounded mb-6">
          <p>{bookingsError}</p>
        </div>
      ) : futureBookings.length === 0 && pastBookings.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-300 text-blue-700 p-4 rounded mb-6 text-center">
          <p>Non hai prenotazioni</p>
        </div>
      ) : (
        <Tabs defaultValue="future" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="future">Prenotazioni future</TabsTrigger>
            <TabsTrigger value="past">Prenotazioni passate</TabsTrigger>
          </TabsList>

          <TabsContent value="future">
            {futureBookings.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-600">Non hai prenotazioni future.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Le tue prossime prenotazioni</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ora</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {futureBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{getEventTypeLabel(booking.eventType as EventType)}</TableCell>
                        <TableCell>{format(parseISO(booking.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confermata' :
                             booking.status === 'pending' ? 'In attesa' : 'Annullata'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/cancella-prenotazione/${booking.id}`}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Annulla
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-600">Non hai prenotazioni passate.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Le tue prenotazioni passate</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ora</TableHead>
                      <TableHead>Stato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{getEventTypeLabel(booking.eventType as EventType)}</TableCell>
                        <TableCell>{format(parseISO(booking.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'confirmed' ? 'Completata' :
                             booking.status === 'pending' ? 'Non completata' : 'Annullata'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default UserBookings;