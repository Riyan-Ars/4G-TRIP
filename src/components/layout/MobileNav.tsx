import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, PiggyBank, Receipt, Menu } from 'lucide-react';

interface MobileNavProps {
  onOpenSidebar: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSidebar }) => {
  const location = useLocation();

  const items = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', path: '/trip-planner', icon: CalendarDays },
    { name: 'Savings', path: '/savings', icon: PiggyBank },
    { name: 'Ledger', path: '/transactions', icon: Receipt },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-sidebar/95 backdrop-blur-xl border-t border-border/80 flex items-center justify-around px-2 z-40">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-brand-blue font-semibold' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 transition-colors ${isActive ? 'text-brand-blue' : 'text-text-muted'}`} />
            <span className="text-[10px] tracking-tight">{item.name}</span>
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-blue" />
            )}
          </NavLink>
        );
      })}

      <button
        onClick={onOpenSidebar}
        className="flex flex-col items-center justify-center py-1.5 px-3 text-text-muted hover:text-text-secondary rounded-xl transition-colors"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>
    </nav>
  );
};

