import React from 'react';
import { ShieldAlert, Lock, ArrowRight, KeyRound } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

interface AccessRestrictedProps {
  requiredRole: 'organizer' | 'judge' | 'participant';
  onAuthenticate: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({ requiredRole, onAuthenticate }) => {
  const { currentUser } = useEvent();

  const roleTitles = {
    organizer: 'Organizer Master Desk',
    judge: 'Official Judge Scorecard Portal',
    participant: 'Participant Hub & Badge'
  };

  const roleDescriptions = {
    organizer: 'Only event organizers with master credentials can access QR gate check-ins, broadcast alerts, and attendee records.',
    judge: 'Only designated judges with confidential access PINs can evaluate submissions and submit rubrics.',
    participant: 'Please sign in with your registered attendee email or ticket ID to access your digital badge and team matchmaker.'
  };

  return (
    <div className="min-h-[55vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border-2 border-rose-500/40 shadow-2xl text-center space-y-5 animate-in fade-in">
        
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/50">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" /> Access Restricted
          </span>
          <h3 className="text-lg font-bold text-white tracking-wide">{roleTitles[requiredRole]}</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            {roleDescriptions[requiredRole]}
          </p>
        </div>

        {currentUser && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
            Current Active Session: <span className="font-semibold text-indigo-300 capitalize">{currentUser.role} ({currentUser.name})</span>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onAuthenticate}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <KeyRound className="w-4 h-4" />
            Unlock with {requiredRole.toUpperCase()} Credentials
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
