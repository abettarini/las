import { LogoutModal } from '@/components/auth/LogoutModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ClipboardList, FileText, Home, LogOut, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

interface SidebarItem {
  title: string;
  path: string;
  icon: any;
  description: string;
}

export default function AdminLayout() {
  const { hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Reindirizza alla home se l'utente non è un amministratore
  if (!hasRole('ROLE_ADMIN')) {
    navigate('/');
    return null;
  }

  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: Home,
      description: 'Panoramica generale del sistema'
    },
    {
      title: 'Utenti',
      path: '/admin/users',
      icon: Users,
      description: 'Gestione degli utenti registrati'
    },
    {
      title: 'Comunicazioni',
      path: '/admin/news',
      icon: FileText,
      description: 'Gestione delle comunicazioni e news'
    },
    {
      title: 'Prenotazioni',
      path: '/admin/bookings',
      icon: Calendar,
      description: 'Gestione delle prenotazioni'
    },
    {
      title: 'Turni',
      path: '/admin/turni',
      icon: ClipboardList,
      description: 'Gestione dei turni dei direttori'
    }
  ];

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
  };

  // Ottieni il titolo e la descrizione della pagina corrente
  const currentPage = sidebarItems.find(item => item.path === location.pathname) || {
    title: 'Amministrazione',
    description: 'Pannello di amministrazione'
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
              {sidebarItems.map((item) => (
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