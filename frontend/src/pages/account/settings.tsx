import UserSettings from '@/components/account/user-settings';
import { useAuth } from '@/context/auth-context';
import { Navigate } from 'react-router-dom';

const SettingsPage = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra un messaggio di caricamento mentre verifichiamo l'autenticazione
  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Reindirizza alla pagina di login se l'utente non è autenticato
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Impostazioni Account</h1>
      <UserSettings />
    </div>
  );
};

export default SettingsPage;