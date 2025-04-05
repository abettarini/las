import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { LogoutModal } from './LogoutModal';

export function AuthButton() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    // Il logout effettivo viene gestito nel componente LogoutModal
    window.location.href = '/'; // Reindirizza alla home page dopo il logout
  };

  if (isAuthenticated && user) {
    return (
      <>
        <a 
          href="#" 
          onClick={handleLogoutClick}
          className={navigationMenuTriggerStyle()}
        >
          Esci
        </a>
        
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