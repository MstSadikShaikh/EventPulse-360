import React, { useState } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { SystemArchitectureModal } from './components/common/SystemArchitectureModal';
import { JudgeGuideModal } from './components/common/JudgeGuideModal';
import { ParticipantHub } from './components/participant/ParticipantHub';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { JudgePortal } from './components/judge/JudgePortal';
import { LiveLeaderboard } from './components/leaderboard/LiveLeaderboard';
import { Zap } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { role, loading, announcements } = useEvent();
  const [showArchModal, setShowArchModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Latest pinned urgent announcement
  const pinnedUrgent = announcements.find(a => a.is_pinned || a.category === 'urgent');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar 
        onOpenArchitecture={() => setShowArchModal(true)} 
        onOpenJudgeGuide={() => setShowGuideModal(true)} 
      />

      {/* Pinned Urgent Alert Ribbon */}
      {pinnedUrgent && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-500/40 px-4 py-2 text-xs">
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
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
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
            {role === 'participant' && <ParticipantHub />}
            {role === 'organizer' && <OrganizerDashboard />}
            {role === 'judge' && <JudgePortal />}
            {role === 'leaderboard' && <LiveLeaderboard />}
          </div>
        )}

      </main>

      {/* Global Modals & Toasts */}
      <ToastContainer />
      <SystemArchitectureModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />
      <JudgeGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">EventPulse 360</span>
            <span>• Built for Prompt War Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setShowArchModal(true)} className="hover:text-indigo-400 transition-colors">
              System Architecture
            </button>
            <button onClick={() => setShowGuideModal(true)} className="hover:text-cyan-400 transition-colors">
              Judge Q&A Sheet
            </button>
            <span className="text-slate-600">|</span>
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
