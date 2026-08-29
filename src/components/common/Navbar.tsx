import React, { useState } from 'react';
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
  LogOut,
  User,
  Lock,
  ChevronDown
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Determine permissions for current user
  const userRole = currentUser?.role || 'guest';
  const isOrganizer = userRole === 'organizer';
  const isJudge = userRole === 'judge';
  const isParticipant = userRole === 'participant';

  const canAccessParticipant = isOrganizer || isParticipant || userRole === 'guest';
  const canAccessOrganizer = isOrganizer;
  const canAccessJudge = isOrganizer || isJudge;
  const canAccessLeaderboard = true;

  const handleNavClick = (targetRole: UserRole) => {
    if (targetRole === 'organizer' && !canAccessOrganizer) {
      onOpenAuth('organizer');
      return;
    }
    if (targetRole === 'judge' && !canAccessJudge) {
      onOpenAuth('judge');
      return;
    }
    if (targetRole === 'participant' && !canAccessParticipant) {
      onOpenAuth('participant');
      return;
    }
    setRole(targetRole);
  };

  const navItems: { role: UserRole; label: string; icon: React.ReactNode; isLocked: boolean; badge?: string }[] = [
    { 
      role: 'participant', 
      label: 'Participant Hub', 
      icon: <Users className="w-4 h-4" />, 
      isLocked: isJudge 
    },
    { 
      role: 'organizer', 
      label: 'Organizer Desk', 
      icon: <ShieldCheck className="w-4 h-4" />, 
      isLocked: !isOrganizer 
    },
    { 
      role: 'judge', 
      label: 'Judge Portal', 
      icon: <Gavel className="w-4 h-4" />, 
      isLocked: !isOrganizer && !isJudge 
    },
    { 
      role: 'leaderboard', 
      label: 'Live Arena', 
      icon: <Trophy className="w-4 h-4" />, 
      isLocked: false, 
      badge: 'LIVE' 
    },
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

          {/* Center: Role Switcher with Lock Badges */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
            {navItems.map((item) => {
              const isActive = role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => handleNavClick(item.role)}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : item.isLocked
                      ? 'text-slate-500 hover:text-slate-400 hover:bg-slate-900'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                  
                  {/* Lock Indicator */}
                  {item.isLocked && (
                    <Lock className="w-3 h-3 text-amber-500/70 ml-0.5" />
                  )}

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
            
            {/* Create Event (Organizer only or guest) */}
            {isOrganizer && (
              <button
                onClick={onOpenCreateEvent}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white shadow-md shadow-indigo-600/20 transition-all"
                title="Create a New Event"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">Create Event</span>
              </button>
            )}

            {/* User Profile & Role Switch Menu */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left hidden xl:block leading-tight">
                      <span className="block truncate max-w-[90px] text-white">{currentUser.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-indigo-400 uppercase font-bold tracking-wider block">{currentUser.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 w-52 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-slate-800 text-xs">
                        <span className="font-bold text-white block">{currentUser.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{currentUser.email}</span>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                          {currentUser.role} Account
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenAuth();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        Switch Role / Account
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Portal Login</span>
                </button>
              )}
            </div>

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
              title="Sync Latest Supabase Records"
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
