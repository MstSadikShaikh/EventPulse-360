import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { checkPinRateLimit, recordFailedPinAttempt, resetPinRateLimit } from '../../lib/securityUtils';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Gavel, 
  Trophy, 
  X, 
  ArrowRight, 
  KeyRound, 
  Mail, 
  Sparkles,
  QrCode
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'participant' | 'organizer' | 'judge';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'organizer' }) => {
  const { 
    loginAsParticipant, 
    loginAsJudge, 
    loginAsOrganizer, 
    setRole, 
    addToast,
    participants,
    judges
  } = useEvent();

  const [authRole, setAuthRole] = useState<'participant' | 'organizer' | 'judge'>(defaultRole);
  
  // Form Inputs
  const [participantInput, setParticipantInput] = useState('');
  const [organizerPin, setOrganizerPin] = useState('');
  const [judgePin, setJudgePin] = useState('');

  if (!isOpen) return null;

  const handleParticipantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantInput.trim()) return;

    const success = loginAsParticipant(participantInput.trim());
    if (success) {
      onClose();
    } else {
      addToast('Attendee Not Found', 'Please enter a registered email (e.g. alex.r@gmail.com) or Ticket ID.', 'warning');
    }
  };

  const handleOrganizerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate-limit
    const limitCheck = checkPinRateLimit('organizer-pin');
    if (!limitCheck.allowed) {
      addToast('Too Many Attempts', `Rate limit reached. Please wait ${limitCheck.remainingSeconds}s before trying again.`, 'urgent');
      return;
    }

    const success = loginAsOrganizer(organizerPin);
    if (success) {
      resetPinRateLimit('organizer-pin');
      onClose();
    } else {
      const record = recordFailedPinAttempt('organizer-pin');
      if (record.lockoutActive) {
        addToast('Brute-force Lockout', `5 failed attempts. Locked out for ${record.lockoutSeconds} seconds.`, 'urgent');
      } else {
        addToast('Invalid PIN', 'Enter default organizer PIN "admin123" or "1234"', 'warning');
      }
    }
  };

  const handleJudgeLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate-limit
    const limitCheck = checkPinRateLimit('judge-pin');
    if (!limitCheck.allowed) {
      addToast('Too Many Attempts', `Rate limit reached. Please wait ${limitCheck.remainingSeconds}s before trying again.`, 'urgent');
      return;
    }

    const success = loginAsJudge(judgePin);
    if (success) {
      resetPinRateLimit('judge-pin');
      onClose();
    } else {
      const record = recordFailedPinAttempt('judge-pin');
      if (record.lockoutActive) {
        addToast('Brute-force Lockout', `5 failed attempts. Locked out for ${record.lockoutSeconds} seconds.`, 'urgent');
      } else {
        addToast('Invalid Judge PIN', 'Enter a valid judge access PIN (e.g. 1111, 2222, 3333)', 'warning');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">EventPulse Portal Access</h3>
              <p className="text-xs text-slate-400">Sign in to your designated event role</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 p-2 gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setAuthRole('participant')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              authRole === 'participant'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Participant
          </button>

          <button
            onClick={() => setAuthRole('organizer')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              authRole === 'organizer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Organizer
          </button>

          <button
            onClick={() => setAuthRole('judge')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              authRole === 'judge'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            Judge
          </button>
        </div>

        {/* Auth Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Participant Sign In */}
          {authRole === 'participant' && (
            <form onSubmit={handleParticipantLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Attendee Email or Ticket ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. alex.r@gmail.com or EP360-TKT-884192"
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Demo quick selector */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Quick Select Attendee Demo:</span>
                <div className="flex flex-wrap gap-1">
                  {participants.slice(0, 3).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setParticipantInput(p.email)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                Access Participant Pass & Hub
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Organizer Sign In */}
          {authRole === 'organizer' && (
            <form onSubmit={handleOrganizerLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Organizer Master Access PIN</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Master PIN (Default: admin123)"
                    value={organizerPin}
                    onChange={(e) => setOrganizerPin(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Default demo organizer PIN is: <code className="text-indigo-400 font-bold">admin123</code></span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                Unlock Organizer Command Center
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Judge Sign In */}
          {authRole === 'judge' && (
            <form onSubmit={handleJudgeLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judge Confidential PIN</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter 4-digit PIN (e.g. 1111, 2222, 3333)"
                    value={judgePin}
                    onChange={(e) => setJudgePin(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Demo quick judge pins */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Demo Judge Access PINs:</span>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  {judges.map(j => (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setJudgePin(j.access_pin)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 truncate text-left"
                    >
                      <span className="block truncate font-semibold">{j.name.split(' ')[1] || j.name}</span>
                      <span className="text-amber-400 font-mono text-[9px]">PIN: {j.access_pin}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                Access Judge Scorecard
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
