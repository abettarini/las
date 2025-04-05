import { LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { LogoutModal } from './LogoutModal';

export function AuthButton() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    // Il logout effettivo viene gestito nel componente LogoutModal
    logout();
    window.location.href = '/'; // Reindirizza alla home page dopo il logout
  };

  // Funzione per ottenere le iniziali dell'utente
  const getUserInitials = () => {
    if (!user || !user.email) return '?';

    // Se l'email contiene un punto, prendi la prima lettera di ogni parte
    if (user.email.includes('.')) {
      const parts = user.email.split('@')[0].split('.');
      return parts.map(part => part[0].toUpperCase()).join('');
    }

    // Altrimenti prendi le prime due lettere dell'email
    return user.email.substring(0, 2).toUpperCase();
  };

  // Funzione per ottenere il nome visualizzato
  const getDisplayName = () => {
    if (!user) return '';

    // Se c'è un nome utente, usalo
    if (user.name) return user.name;

    // Altrimenti usa l'email, ma tronca il dominio
    if (user.email) {
      const emailParts = user.email.split('@');
      return emailParts[0];
    }

    return 'Utente';
  };

  if (isAuthenticated && user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={user.picture} alt={getDisplayName()} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium">
              {getDisplayName()}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profilo')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profilo</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/impostazioni')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Impostazioni</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Esci</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      </>
    );
  }

  return (
    <Link to="/login" className={navigationMenuTriggerStyle()}>
      Accedi
    </Link>
  );
}