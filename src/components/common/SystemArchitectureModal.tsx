import React, { useState } from 'react';
import { X, Layers, Database, Shield, Zap, CheckCircle2 } from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'database' | 'security'>('flow');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">System Architecture & Multi-Role Flow</h2>
              <p className="text-xs text-slate-400">Complete end-to-end design specification for EventPulse 360</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('flow')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'flow'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            Multi-Role UX Flow
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'database'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Database & Schema (Supabase)
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security & Real-Time Integrity
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Lifecycle Diagram: 4 Core Personas in 1 Unified System
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-xs">
                  
                  {/* Persona 1 */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-indigo-500/20">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">1. Participant</span>
                    <h4 className="font-bold text-white text-sm">Register & QR Badge</h4>
                    <p className="text-slate-400 mt-1">Instant registration, skill tags, dynamic QR pass generation, team matchmaking & project submission.</p>
                  </div>

                  {/* Persona 2 */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-cyan-500/20">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">2. Organizer</span>
                    <h4 className="font-bold text-white text-sm">Scan & Broadcast</h4>
                    <p className="text-slate-400 mt-1">Live camera QR check-in, real-time attendance velocity, emergency broadcasts with sound alerts.</p>
                  </div>

                  {/* Persona 3 */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-amber-500/20">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">3. Judge</span>
                    <h4 className="font-bold text-white text-sm">Rubric Evaluation</h4>
                    <p className="text-slate-400 mt-1">Weighted scoring sliders (Innovation, Feasibility, UI/UX, Pitch), structured feedback, tamper-proof lock.</p>
                  </div>

                  {/* Persona 4 */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">4. Live Arena</span>
                    <h4 className="font-bold text-white text-sm">Leaderboard & Podium</h4>
                    <p className="text-slate-400 mt-1">Animated top-3 podium, track filtering, real-time score updates via Supabase WebSocket channels.</p>
                  </div>

                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-200">How Data Flows in Real-Time:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="flex gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">QR Scanning Velocity:</strong> Check-ins are scanned in &lt;100ms and immediately sync to the Organizer Analytics dashboard.
                    </div>
                  </div>
                  <div className="flex gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Live Leaderboard Recalculation:</strong> As soon as a judge submits a score, weighted aggregates recompute instantly.
                    </div>
                  </div>
                  <div className="flex gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Smart Matchmaker Engine:</strong> Filters solo participants with open teams based on complementary role gaps.
                    </div>
                  </div>
                  <div className="flex gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Push Alert Broadcast:</strong> Audio chimes and visual toast banners reach all active participants simultaneously.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300">
                EventPulse 360 is powered by a PostgreSQL relational database on <strong className="text-indigo-400">Supabase</strong> with full Row-Level Security (RLS) and Realtime WebSocket replication.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-mono text-cyan-400 font-bold block mb-1">TABLE: participants</span>
                  <p className="text-slate-400 leading-relaxed">
                    Stores attendee profile, skills array, unique cryptographic ticket ID (<code className="text-amber-300">EP360-TKT-XXXXXX</code>), check-in boolean flag, and team linkage.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-mono text-cyan-400 font-bold block mb-1">TABLE: submissions</span>
                  <p className="text-slate-400 leading-relaxed">
                    Stores project title, tagline, problem track, GitHub repository link, live demo URL, video demo, and presentation pitch deck.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-mono text-cyan-400 font-bold block mb-1">TABLE: evaluations</span>
                  <p className="text-slate-400 leading-relaxed">
                    Holds judge rubric scores across 5 criteria (Innovation, Feasibility, UI/UX, Presentation, Impact), total score, feedback notes, and lock state.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-mono text-cyan-400 font-bold block mb-1">TABLE: announcements</span>
                  <p className="text-slate-400 leading-relaxed">
                    Real-time broadcast messages categorized by severity (Urgent, Schedule, Food, Workshop) with automatic WebSocket broadcast to all connected devices.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security & Data Integrity Guarantees
                </h4>
                <ul className="space-y-2.5 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Unique QR Ticket Verification:</strong> Each ticket ID is generated with collision-proof random entropy and verified against database state to prevent duplicate check-ins.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Judge Access PIN Protection:</strong> Judges authenticate with secure PINs preventing unauthorized tampering of project evaluations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Evaluation Lock Integrity:</strong> Once scores are locked, duplicate entries are prevented with composite unique constraints on (submission_id, judge_id).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Sanitized Link Validations:</strong> All external GitHub, demo, and video links are sanitized and validated to prevent XSS.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
