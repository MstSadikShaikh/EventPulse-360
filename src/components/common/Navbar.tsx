import React from 'react';
import { useEvent } from '../../context/EventContext';
import { UserRole } from '../../types';
import { 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Gavel, 
  Trophy, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  HelpCircle, 
  Layers
} from 'lucide-react';

interface NavbarProps {
  onOpenArchitecture: () => void;
  onOpenJudgeGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenArchitecture, onOpenJudgeGuide }) => {
  const { 
    role, 
    setRole, 
    event, 
    resetToSampleData, 
    soundEnabled, 
    setSoundEnabled,
    loading 
  } = useEvent();

  const navItems: { role: UserRole; label: string; icon: React.ReactNode; badge?: string }[] = [
    { role: 'participant', label: 'Participant Hub', icon: <Users className="w-4 h-4" /> },
    { role: 'organizer', label: 'Organizer Desk', icon: <ShieldCheck className="w-4 h-4" /> },
    { role: 'judge', label: 'Judge Portal', icon: <Gavel className="w-4 h-4" /> },
    { role: 'leaderboard', label: 'Live Arena', icon: <Trophy className="w-4 h-4" />, badge: 'LIVE' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Live Status */}
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
                  Supabase Live
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs hidden md:block">
                {event?.title || 'Global AI & Web3 Hackathon'}
              </p>
            </div>
          </div>

          {/* Center: Role Switcher (Multi-Role Mode) */}
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

          {/* Right Action Tools: Architecture Guide, Q&A Cheat Sheet, Audio & Refresh */}
          <div className="flex items-center gap-2">
            
            {/* System Architecture Wireframe Modal Trigger */}
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/60 transition-colors shadow-sm"
              title="View Multi-Role Flow & System Architecture"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="hidden lg:inline">System Flow</span>
            </button>

            {/* Judge Q&A Guide Trigger */}
            <button
              onClick={onOpenJudgeGuide}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors shadow-sm"
              title="Open Hackathon Judge Q&A Cheat Sheet"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Judge Q&A</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              aria-label="Sound toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Sync / Refresh */}
            <button
              onClick={resetToSampleData}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title="Sync Latest Database Records"
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
