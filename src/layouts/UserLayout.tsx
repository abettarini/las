import { LogoutModal } from '@/components/auth/LogoutModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  {
    title: 'Profilo',
    icon: User,
    path: '/account/profilo',
    description: 'Gestisci le tue informazioni personali'
  },
  {
    title: 'Prenotazioni',
    icon: Calendar,
    path: '/account/prenotazioni',
    description: 'Visualizza e gestisci le tue prenotazioni'
  },
  {
    title: 'Impostazioni',
    icon: Settings,
    path: '/account/impostazioni',
    description: 'Configura le impostazioni del tuo account'
  }
];

export default function UserLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Se l'utente non è autenticato, reindirizza alla pagina di login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
  };

  // Ottieni il titolo e la descrizione della pagina corrente
  const currentPage = menuItems.find(item => item.path === location.pathname) || {
    title: 'Account',
    description: 'Gestisci il tuo account'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4 p-2" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{currentPage.title}</h1>
          <p className="text-muted-foreground">{currentPage.description}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Card className="md:w-64 shrink-0">
          <div className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
              
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Esci
              </button>
            </nav>
          </div>
        </Card>

        {/* Main content */}
        <div className="flex-1">
            <Outlet />
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}