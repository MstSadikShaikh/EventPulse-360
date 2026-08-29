import React from 'react';
import { useEvent } from '../../context/EventContext';
import type { UserRole } from '../../types';
import { 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Gavel, 
  Trophy, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Plus, 
  Calendar,
  LogOut,
  User
} from 'lucide-react';

interface NavbarProps {
  onOpenCreateEvent: () => void;
  onOpenAuth: (role?: 'participant' | 'organizer' | 'judge') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateEvent, onOpenAuth }) => {
  const { 
    role, 
    setRole, 
    event, 
    eventsList, 
    switchEvent, 
    resetToSampleData, 
    soundEnabled, 
    setSoundEnabled,
    currentUser,
    logout,
    loading 
  } = useEvent();

  const navItems: { role: UserRole; label: string; icon: React.ReactNode; badge?: string }[] = [
    { role: 'participant', label: 'Participant Hub', icon: <Users className="w-4 h-4" /> },
    { role: 'organizer', label: 'Organizer Desk', icon: <ShieldCheck className="w-4 h-4" /> },
    { role: 'judge', label: 'Judge Portal', icon: <Gavel className="w-4 h-4" /> },
    { role: 'leaderboard', label: 'Live Arena', icon: <Trophy className="w-4 h-4" />, badge: 'LIVE' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Event Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  EventPulse <span className="text-cyan-400">360</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              
              {/* Event Switcher Dropdown */}
              <div className="flex items-center gap-1 mt-0.5">
                <select
                  value={event?.id || ''}
                  onChange={(e) => switchEvent(e.target.value)}
                  className="bg-transparent text-xs text-slate-300 font-semibold focus:outline-none border-b border-dashed border-slate-700 cursor-pointer max-w-[190px] sm:max-w-[240px] truncate"
                  title="Switch Active Event"
                >
                  {eventsList.map(ev => (
                    <option key={ev.id} value={ev.id} className="bg-slate-900 text-white">
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher / Navigation */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
            {navItems.map((item) => {
              const isActive = role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => setRole(item.role)}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Create Event, Login/Profile, Sound FX & Sync */}
          <div className="flex items-center gap-2">
            
            {/* Create Event Button */}
            <button
              onClick={onOpenCreateEvent}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white shadow-md shadow-indigo-600/20 transition-all"
              title="Organize / Create a New Event"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Create Event</span>
            </button>

            {/* Auth / Role Sign In Modal */}
            {currentUser ? (
              <button
                onClick={() => onOpenAuth()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500 transition-colors"
                title="Current Session Profile"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500 transition-colors"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>Login</span>
              </button>
            )}

            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title={soundEnabled ? 'Mute Audio Alerts' : 'Enable Audio Alerts'}
              aria-label="Sound toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Sync / Refresh */}
            <button
              onClick={resetToSampleData}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title="Sync Latest Supabase Database Records"
              aria-label="Sync data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
