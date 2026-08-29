import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Participant } from '../../types';
import { ShieldCheck, Clock, Download, Share2, Sparkles, CheckCircle2, User, Mail, Tag } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

interface DigitalBadgeProps {
  participant: Participant;
}

export const DigitalBadge: React.FC<DigitalBadgeProps> = ({ participant }) => {
  const { event, addToast } = useEvent();
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(participant.qr_ticket_id);
    addToast('Ticket Copied', `Copied ${participant.qr_ticket_id} to clipboard!`, 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      
      {/* 3D-like Glowing Digital Pass Card */}
      <div 
        ref={badgeRef}
        className="relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/80 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/60 overflow-hidden transform transition-all duration-300 hover:scale-[1.01]"
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Pass Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-400">Official Pass</span>
              <h3 className="text-xs font-bold text-white truncate max-w-[180px]">{event?.title || 'Global Hackathon 2026'}</h3>
            </div>
          </div>
          
          {/* Status Badge */}
          {participant.is_checked_in ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              Verified In
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Clock className="w-3 h-3" />
              Scan Ready
            </span>
          )}
        </div>

        {/* QR Code Section */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-white shadow-xl shadow-indigo-950/50 border-4 border-indigo-500/20">
            <QRCodeSVG 
              value={participant.qr_ticket_id} 
              size={170}
              level="H"
              includeMargin={false}
            />
          </div>
          
          {/* Ticket ID with Click-to-Copy */}
          <button
            onClick={handleCopyTicket}
            className="mt-3.5 group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-colors text-xs font-mono text-indigo-300"
            title="Click to copy Ticket ID"
          >
            <span>{participant.qr_ticket_id}</span>
            <Share2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
          </button>
        </div>

        {/* Participant Details */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Attendee</span>
            </div>
            <h4 className="text-base font-bold text-white tracking-wide">{participant.name}</h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Role</span>
              <span className="font-semibold text-indigo-300">{participant.role}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Email</span>
              <span className="text-slate-300 truncate block">{participant.email}</span>
            </div>
          </div>

          {/* Skills List */}
          {participant.skills && participant.skills.length > 0 && (
            <div className="pt-2">
              <span className="text-slate-400 text-[11px] block mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-400" />
                Skills & Tech
              </span>
              <div className="flex flex-wrap gap-1.5">
                {participant.skills.slice(0, 4).map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-950/80 text-indigo-200 border border-indigo-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {participant.checked_in_at && (
            <div className="text-[10px] text-emerald-400/80 text-center pt-2">
              Checked in at {new Date(participant.checked_in_at).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Barcode graphic footer */}
        <div className="mt-5 pt-3 border-t border-dashed border-slate-800 flex justify-between items-center text-[9px] text-slate-500 font-mono">
          <span>EVENTPULSE-360-SECURE-ENTRY</span>
          <span>GATE PASS #1</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          Print / Save Pass
        </button>
        <button
          onClick={handleCopyTicket}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-colors"
        >
          <Share2 className="w-4 h-4 text-cyan-400" />
          Copy Ticket Code
        </button>
      </div>

    </div>
  );
};
