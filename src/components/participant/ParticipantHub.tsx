import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { DigitalBadge } from './DigitalBadge';
import { TeamMatchmaker } from './TeamMatchmaker';
import { SubmissionPortal } from './SubmissionPortal';
import { RegistrationForm } from './RegistrationForm';
import { 
  QrCode, 
  Users, 
  Rocket, 
  Bell, 
  UserCheck, 
  UserPlus, 
  Calendar, 
  Clock, 
  Pin, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const ParticipantHub: React.FC = () => {
  const { 
    participants, 
    activeParticipant, 
    setActiveParticipant, 
    announcements, 
    event 
  } = useEvent();

  const [activeTab, setActiveTab] = useState<'pass' | 'teams' | 'submission' | 'announcements' | 'register'>('pass');

  const scheduleEvents = [
    { time: '09:00 AM', title: 'Opening Keynote & Track Reveal', desc: 'Kickoff and problem statement briefing', status: 'completed' },
    { time: '11:00 AM', title: 'Smart Team Formation Closes', desc: 'Finalize squads and lock track selections', status: 'completed' },
    { time: '01:00 PM', title: 'Healthy Lunch & Energy Drinks', desc: 'Main Dining Hall B', status: 'completed' },
    { time: '03:30 PM', title: 'Mentorship Sprint & Pitch Workshop', desc: 'VC feedback sessions in Room 104', status: 'current' },
    { time: '05:00 PM', title: 'Final Code Freeze & Submissions Due', desc: 'All repos and video links must be submitted', status: 'upcoming' },
    { time: '06:00 PM', title: 'Live Judging & Pitch Demos', desc: 'Top teams present on main stage', status: 'upcoming' },
    { time: '07:30 PM', title: 'Closing Ceremony & Winner Awards', desc: 'Podium awards and swag distribution', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Participant Switcher & Quick Registration */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        
        {/* Left Active Profile Selector */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xs text-white">
              {activeParticipant ? activeParticipant.name.charAt(0) : 'P'}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Active Participant Profile</span>
            <div className="flex items-center gap-2">
              <select
                value={activeParticipant?.id || ''}
                onChange={(e) => {
                  const target = participants.find(p => p.id === e.target.value);
                  if (target) {
                    setActiveParticipant(target);
                    if (activeTab === 'register') setActiveTab('pass');
                  }
                }}
                className="bg-transparent font-bold text-sm text-white focus:outline-none border-b border-dashed border-slate-700 pb-0.5 cursor-pointer"
              >
                {participants.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} — {p.role} {p.is_checked_in ? '✅' : '⏳'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Register New Attendee Button */}
        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'register'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/20'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          + Register New Participant
        </button>

      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-800/80 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pass')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'pass'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4 text-indigo-400" />
          Digital Pass & QR Badge
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'teams'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          Smart Team Matchmaker
        </button>

        <button
          onClick={() => setActiveTab('submission')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'submission'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Rocket className="w-4 h-4 text-emerald-400" />
          Project Submission
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          Live Schedule & Feed
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'pass' && activeParticipant && (
        <DigitalBadge participant={activeParticipant} />
      )}

      {activeTab === 'teams' && (
        <TeamMatchmaker />
      )}

      {activeTab === 'submission' && (
        <SubmissionPortal />
      )}

      {activeTab === 'register' && (
        <RegistrationForm onComplete={() => setActiveTab('pass')} />
      )}

      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Live Announcements Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              Live Broadcast Center Updates ({announcements.length})
            </h4>

            <div className="space-y-3">
              {announcements.map((ann) => {
                let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
                if (ann.category === 'urgent') badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                if (ann.category === 'food') badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                if (ann.category === 'workshop') badgeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

                return (
                  <div 
                    key={ann.id}
                    className={`p-4 rounded-2xl bg-slate-900/90 border transition-all ${
                      ann.is_pinned ? 'border-indigo-500/50 shadow-lg shadow-indigo-950/40' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        {ann.is_pinned && <Pin className="w-3.5 h-3.5 text-indigo-400" />}
                        <h5 className="text-sm font-bold text-white">{ann.title}</h5>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${badgeStyle}`}>
                        {ann.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{ann.message}</p>
                    <div className="text-[10px] text-slate-500 mt-2">
                      {new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Schedule Timeline */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Event Timeline
            </h4>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
              {scheduleEvents.map((item, idx) => (
                <div key={idx} className="flex gap-3 relative">
                  {idx !== scheduleEvents.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-800" />
                  )}
                  
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'current'
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  </div>

                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono text-indigo-400">{item.time}</span>
                    </div>
                    <p className="text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
