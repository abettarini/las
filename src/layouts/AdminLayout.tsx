import { Button } from '@/components/ui/button';
import { FileText, Home, Menu, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

export default function AdminLayout() {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reindirizza alla home se l'utente non è un amministratore
  if (!hasRole('ROLE_ADMIN')) {
    navigate('/');
    return null;
  }

  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <Home className="h-5 w-5" />
    },
    {
      title: 'Utenti',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Comunicazioni',
      path: '/admin/news',
      icon: <FileText className="h-5 w-5" />
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar per dispositivi mobili */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Overlay per dispositivi mobili */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <h2 className="text-xl font-bold">Pannello Admin</h2>
        </div>
        <nav className="mt-5 px-2">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${location.pathname === item.path ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Contenuto principale */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}