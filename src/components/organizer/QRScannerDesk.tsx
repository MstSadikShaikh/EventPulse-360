import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEvent } from '../../context/EventContext';
import { 
  QrCode, 
  Camera, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Sparkles, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
import { Participant } from '../../types';

export const QRScannerDesk: React.FC = () => {
  const { participants, checkInParticipant, addToast } = useEvent();
  
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<{
    success: boolean;
    participant?: Participant;
    message: string;
    timestamp: Date;
  } | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Initialize Html5QrcodeScanner when scanning is active
  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true
        },
        /* verbose= */ false
      );

      scanner.render(
        async (decodedText) => {
          scanner.pause(true);
          const result = await checkInParticipant(decodedText);
          setLastScannedResult({ ...result, timestamp: new Date() });
          setTimeout(() => {
            try { scanner.resume(); } catch { /* ignore */ }
          }, 2000);
        },
        (error) => {
          // ignore continuous scanning misses
        }
      );

      scannerRef.current = scanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
        }
      };
    }
  }, [isScanning, checkInParticipant]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const result = await checkInParticipant(manualCode.trim());
    setLastScannedResult({ ...result, timestamp: new Date() });
    setManualCode('');
  };

  const handleQuickTestScan = async (p: Participant) => {
    const result = await checkInParticipant(p.qr_ticket_id);
    setLastScannedResult({ ...result, timestamp: new Date() });
  };

  const checkedInCount = participants.filter(p => p.is_checked_in).length;
  const totalCount = participants.length;
  const checkInRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Checked In</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white">{checkedInCount}</span>
              <span className="text-xs text-slate-400">/ {totalCount} attendees</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Attendance Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-emerald-400">{checkInRate}%</span>
              <span className="text-xs text-slate-400">velocity high</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Pending Entry</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-amber-300">{totalCount - checkedInCount}</span>
              <span className="text-xs text-slate-400">waiting</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Scanner / Manual Search */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Interactive QR Check-in Terminal</h3>
                  <p className="text-[11px] text-slate-400">Instant camera scanner & rapid barcode verification</p>
                </div>
              </div>

              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isScanning 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isScanning ? 'Stop Camera' : 'Start Camera Scanner'}
              </button>
            </div>

            {/* Camera View Area */}
            {isScanning ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/40 bg-slate-950 p-2">
                <div id="qr-reader" className="w-full text-slate-100" />
                <div className="text-center text-[11px] text-slate-400 py-1">
                  Point attendee QR pass at camera for instant automatic verification.
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
                <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Camera Scanner Inactive</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
                    Click "Start Camera Scanner" above to use your webcam, or use the fast manual search box below.
                  </p>
                </div>
              </div>
            )}

            {/* Manual Ticket Input */}
            <form onSubmit={handleManualSubmit} className="space-y-2 pt-2">
              <label className="block text-slate-300 text-xs font-semibold">Manual Barcode / Ticket ID Search</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter Ticket ID (e.g. EP360-TKT-884192) or Attendee Email"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition-colors border border-slate-700 shrink-0"
                >
                  Verify & Enter
                </button>
              </div>
            </form>

          </div>

          {/* Quick 1-Click Simulation Buttons for Judges/Demoing */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                1-Click Quick Scan Demo (For Instant Presentation)
              </span>
              <span className="text-[10px] text-slate-500">Simulate physical badge scan</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {participants.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickTestScan(p)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-300 block truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{p.qr_ticket_id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shrink-0 ${
                    p.is_checked_in 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {p.is_checked_in ? 'In' : 'Scan'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Scan Result & Attendee Card */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest Check-in Verification</h4>

          {lastScannedResult ? (
            <div className={`p-5 rounded-3xl border-2 transition-all space-y-4 ${
              lastScannedResult.success 
                ? 'bg-slate-900/90 border-emerald-500/50 shadow-2xl shadow-emerald-950/40' 
                : 'bg-slate-900/90 border-rose-500/50 shadow-2xl shadow-rose-950/40'
            }`}>
              
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  lastScannedResult.success 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {lastScannedResult.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">{lastScannedResult.message}</h5>
                  <span className="text-[10px] text-slate-400">
                    Timestamp: {lastScannedResult.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {lastScannedResult.participant && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Attendee Name</span>
                    <span className="font-bold text-white text-sm">{lastScannedResult.participant.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Role / Track</span>
                    <span className="font-semibold text-indigo-300">{lastScannedResult.participant.role}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Ticket ID</span>
                    <span className="font-mono text-cyan-400 font-bold">{lastScannedResult.participant.qr_ticket_id}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Dietary Spec</span>
                    <span className="text-slate-300">{lastScannedResult.participant.dietary || 'Standard'}</span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
              <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No scans recorded in this session yet.</p>
              <p className="text-[10px] text-slate-500">Scan any participant badge to view verified identity.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
