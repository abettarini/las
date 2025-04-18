import { TurniCalendar } from '@/components/turni/turni-calendar';
import { TurniMatrix } from '@/components/turni/turni-matrix';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { Navigate } from 'react-router-dom';

export default function TurniPage() {
  const { hasRole } = useAuth();

  // Reindirizza se l'utente non è un direttore
  if (!hasRole('ROLE_DIRECTOR')) {
    return <Navigate to="/account/profilo" replace />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestione Turni</CardTitle>
          <CardDescription>
            Gestisci i tuoi turni di presenza al poligono
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TurniCalendar />
        </CardContent>
      </Card>
      
      {/* Nuova card con la matrice dei turni */}
      <TurniMatrix />
    </div>
  );
}