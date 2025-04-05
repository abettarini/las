import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/auth-context';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Reindirizza alla pagina di login se l'utente non è autenticato
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Accesso richiesto</CardTitle>
            <CardDescription>Devi accedere per visualizzare questa pagina</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Vai alla pagina di accesso
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Funzione per ottenere le iniziali dell'utente
  const getUserInitials = () => {
    if (!user.email) return '?';
    
    // Se l'email contiene un punto, prendi la prima lettera di ogni parte
    if (user.email.includes('.')) {
      const parts = user.email.split('@')[0].split('.');
      return parts.map(part => part[0].toUpperCase()).join('');
    }
    
    // Altrimenti prendi le prime due lettere dell'email
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 flex items-center" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Indietro
      </Button>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Il mio profilo</CardTitle>
          <CardDescription>
            Gestisci le tue informazioni personali
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border border-gray-200">
                <AvatarImage src={user.picture} alt={user.name || user.email} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" className="mt-4 text-sm">
                Cambia immagine
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                <p className="mt-1 text-lg">{user.name || 'Non specificato'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg">{user.email}</p>
                {user.isVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Verificata
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                    Non verificata
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">ID Utente</h3>
                <p className="mt-1 text-sm text-gray-600">{user.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}