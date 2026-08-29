import React, { useState } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { CreateEventModal } from './components/common/CreateEventModal';
import { AuthModal } from './components/common/AuthModal';
import { AccessRestricted } from './components/common/AccessRestricted';
import { ParticipantHub } from './components/participant/ParticipantHub';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { JudgePortal } from './components/judge/JudgePortal';
import { LiveLeaderboard } from './components/leaderboard/LiveLeaderboard';
import { Zap } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { role, loading, announcements, event, currentUser } = useEvent();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'participant' | 'organizer' | 'judge'>('organizer');

  const openAuthWithRole = (targetRole: 'participant' | 'organizer' | 'judge' = 'organizer') => {
    setAuthDefaultRole(targetRole);
    setShowAuthModal(true);
  };

  const userRole = currentUser?.role || 'guest';
  const isOrganizer = userRole === 'organizer';
  const isJudge = userRole === 'judge';
  const isParticipant = userRole === 'participant';

  // Permission Checks
  const canViewOrganizer = isOrganizer;
  const canViewJudge = isOrganizer || isJudge;
  const canViewParticipant = isOrganizer || isParticipant || userRole === 'guest';

  // Latest pinned urgent announcement
  const pinnedUrgent = announcements.find(a => a.is_pinned || a.category === 'urgent');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar 
        onOpenCreateEvent={() => setShowCreateEventModal(true)} 
        onOpenAuth={(r) => openAuthWithRole(r || 'organizer')} 
      />

      {/* Pinned Urgent Alert Ribbon */}
      {pinnedUrgent && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-500/40 px-4 py-2 text-xs no-print">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-300 font-semibold truncate">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="font-bold text-white">{pinnedUrgent.title}:</span>
              <span className="text-slate-300 truncate">{pinnedUrgent.message}</span>
            </div>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider hidden sm:inline shrink-0">
              Live Broadcast
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 no-print">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center animate-spin">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-white">Connecting to EventPulse Realtime Database...</h3>
              <p className="text-xs text-slate-500 mt-1">Syncing attendees, teams, and live rubric states</p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            
            {/* Participant View */}
            {role === 'participant' && (
              canViewParticipant ? (
                <ParticipantHub />
              ) : (
                <AccessRestricted 
                  requiredRole="participant" 
                  onAuthenticate={() => openAuthWithRole('participant')} 
                />
              )
            )}

            {/* Organizer View */}
            {role === 'organizer' && (
              canViewOrganizer ? (
                <OrganizerDashboard />
              ) : (
                <AccessRestricted 
                  requiredRole="organizer" 
                  onAuthenticate={() => openAuthWithRole('organizer')} 
                />
              )
            )}

            {/* Judge View */}
            {role === 'judge' && (
              canViewJudge ? (
                <JudgePortal />
              ) : (
                <AccessRestricted 
                  requiredRole="judge" 
                  onAuthenticate={() => openAuthWithRole('judge')} 
                />
              )
            )}

            {/* Live Arena Leaderboard (Always Public) */}
            {role === 'leaderboard' && <LiveLeaderboard />}

          </div>
        )}

      </main>

      {/* Global Modals & Toasts */}
      <ToastContainer />
      <CreateEventModal isOpen={showCreateEventModal} onClose={() => setShowCreateEventModal(false)} />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultRole={authDefaultRole} 
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">EventPulse 360</span>
            <span>• Managing "{event?.title || 'Global Tech Summit'}"</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              Powered by <span className="text-emerald-400 font-semibold">Supabase PostgreSQL</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <EventProvider>
      <MainDashboard />
    </EventProvider>
  );
}

export default App;
