import UserBookings from '@/components/booking/user-bookings';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import React from 'react';

const UserBookingPage: React.FC = () => {
  const { isAuthenticated, token } = useAuth();

  // Il controllo di autenticazione è gestito dal layout
  return (
    <Card>
      <CardContent className="pt-6">
        <UserBookings isAuthenticated={isAuthenticated} token={token} />
      </CardContent>
    </Card>
  );
};

export default UserBookingPage;