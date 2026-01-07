import { Outlet, NavLink } from 'react-router-dom';
import { Home, User, Mail } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Accueil' },
  { to: '/account', icon: User, label: 'Mon Compte' },
  { to: '/contact', icon: Mail, label: 'Contact' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col max-w-mobile mx-auto">
      <div className="h-2 bg-green-600 w-full flex-shrink-0" />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-green-600 safe-bottom z-40">
        <div className="max-w-mobile mx-auto flex items-center justify-around py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-green-200 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
