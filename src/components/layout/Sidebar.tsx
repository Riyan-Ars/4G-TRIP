import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, LayoutDashboard, CalendarDays, PiggyBank, Receipt, 
  PieChart, MapPin, Users, CheckSquare, Settings, LogOut, ChevronDown, 
  Layers, Check, ArrowRight 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onCloseMobile }) => {
  const { trip, otherTrips, members } = useTrip();
  const { currentUser, currentRole, switchDemoUser, availableDemoUsers, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showTripDropdown, setShowTripDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Trip Planner', path: '/trip-planner', icon: CalendarDays },
    { name: 'Shared Savings', path: '/savings', icon: PiggyBank },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budget Planner', path: '/budget', icon: PieChart },
    { name: 'Destinations', path: '/destinations', icon: MapPin },
    { name: 'Members', path: '/members', icon: Users, badge: members.length },
    { name: 'Packing Checklist', path: '/packing-list', icon: CheckSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleUserSelect = (userId: string) => {
    if (userId === 'user-riyan' && currentUser.id !== 'user-riyan') {
      const enteredPass = window.prompt('Masukkan password Admin untuk RIYAN ARYA SYAHPUTRA:');
      if (enteredPass !== '123456') {
        alert('Password Admin salah! (Gunakan: 123456)');
        return;
      }
    }
    switchDemoUser(userId);
    setShowUserDropdown(false);
  };

  return (
    <aside 
      className={`w-64 bg-sidebar border-r border-border/80 flex flex-col h-screen shrink-0 text-text-primary select-none ${className}`}
    >
      {/* 1. Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-white/10 flex items-center justify-center text-brand-blue shadow-subtle">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-text-primary">4G TRIP</span>
            <span className="block text-[10px] text-text-muted tracking-wider font-medium uppercase">Travel & Treasury</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/settings')}
          className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-secondary transition-colors"
          title="Trip Settings"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Active Trip Workspace Pill */}
      <div className="px-3 pt-3">
        <div className="relative">
          <button 
            onClick={() => setShowTripDropdown(!showTripDropdown)}
            className="w-full bg-surface hover:bg-surface-secondary border border-border rounded-xl p-2.5 flex items-center gap-3 transition-colors text-left"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10">
              <img 
                src={trip.cover_image_url || '/images/malaysia-hero.jpg'} 
                alt={trip.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-text-primary truncate block leading-tight">{trip.name}</span>
              <span className="text-[11px] text-text-secondary block truncate mt-0.5">
                {members.length} members • {trip.destination}
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showTripDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Trip Selector Dropdown */}
          {showTripDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-surface-elevated border border-border/90 rounded-xl shadow-elevated p-1.5 z-50 animate-slide-up">
              <div className="text-[10px] font-semibold text-text-muted px-2.5 py-1 uppercase tracking-wider">
                Select Workspace Trip
              </div>
              <button 
                onClick={() => setShowTripDropdown(false)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-surface-secondary text-xs text-text-primary"
              >
                <span className="font-medium truncate">{trip.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
              </button>
              {otherTrips.map((ot) => (
                <div 
                  key={ot.id}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-secondary/70 text-xs text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                  onClick={() => setShowTripDropdown(false)}
                >
                  <span className="truncate">{ot.name}</span>
                  <span className="text-[10px] text-text-muted">Draft</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Navigation Items */}
      <div className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-text-muted px-3 py-1.5 uppercase tracking-wider">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`
                flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group
                ${isActive 
                  ? 'bg-surface-secondary text-text-primary font-semibold border border-border shadow-subtle' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'}
              `}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-blue' : 'text-text-muted group-hover:text-text-secondary'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-brand-blue/15 text-brand-blue' : 'bg-surface-secondary text-text-muted'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* 4. Saved Plans Quick Thumbnails */}
        <div className="pt-4 mt-2 border-t border-border/50">
          <div className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Curated Inspiration
          </div>

          <div className="mt-2 space-y-2">
            <div 
              onClick={() => navigate('/destinations')}
              className="group relative rounded-xl overflow-hidden border border-border hover:border-brand-blue/40 transition-all cursor-pointer h-14 bg-surface"
            >
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?w=400&auto=format&fit=crop&q=80" 
                alt="Penang Food Trip" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent flex items-end p-2 justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-text-primary block leading-tight">Penang Food Tour</span>
                  <span className="text-[9px] text-brand-teal font-medium">Culinary Route</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-surface-elevated/80 flex items-center justify-center text-text-secondary group-hover:text-white">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/destinations')}
              className="group relative rounded-xl overflow-hidden border border-border hover:border-brand-blue/40 transition-all cursor-pointer h-14 bg-surface"
            >
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80" 
                alt="Langkawi Getaway" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent flex items-end p-2 justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-text-primary block leading-tight">Langkawi Getaway</span>
                  <span className="text-[9px] text-brand-blue font-medium">Island & SkyCab</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-surface-elevated/80 flex items-center justify-center text-text-secondary group-hover:text-white">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. User Profile & Role Persona Switcher */}
      <div className="p-3 border-t border-border/80 bg-sidebar">
        <div className="relative">
          <button 
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-full p-2 rounded-xl bg-surface hover:bg-surface-secondary border border-border flex items-center gap-2.5 transition-colors text-left"
          >
            <div className="relative">
              <img 
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt={currentUser.display_name} 
                className="w-8 h-8 rounded-full object-cover border border-white/10" 
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-brand-teal rounded-full ring-2 ring-surface" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-text-primary truncate block leading-tight">{currentUser.display_name}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider block mt-0.5 ${
                currentRole === 'owner' ? 'text-brand-orange' : currentRole === 'admin' ? 'text-brand-blue' : 'text-brand-teal'
              }`}>
                {currentRole}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </button>

          {/* Persona Switcher Dropdown */}
          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface-elevated border border-border rounded-xl shadow-elevated p-2 z-50 animate-slide-up">
              <div className="text-[10px] font-semibold text-text-muted px-2 py-1 uppercase tracking-wider">
                Switch Test Role
              </div>
              <div className="space-y-1">
                {availableDemoUsers.map((user) => {
                  const roleName = user.id === 'user-riyan' ? 'owner' : 'member';
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user.id)}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors ${
                        isSelected ? 'bg-surface-secondary text-text-primary font-medium' : 'hover:bg-surface-secondary/60 text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div className="text-left">
                          <span className="font-medium block text-xs">{user.display_name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-text-muted">{roleName}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-teal" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-border/80 flex items-center justify-between px-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserDropdown(false);
                  }}
                  className="text-[11px] text-text-secondary hover:text-text-primary flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="text-[11px] text-brand-rose hover:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

