import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, Star, Award, CheckCircle } from 'lucide-react';

interface JudgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeGuideModal: React.FC<JudgeGuideModalProps> = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const qaList = [
    {
      q: "1. What core problem does EventPulse 360 solve?",
      a: "Event managers usually use 5 different tools (Google Forms for registration, WhatsApp for announcements, Discord for teams, paper/apps for QR check-ins, and Excel for judging). EventPulse 360 combines all 5 workflows into a single real-time dashboard powered by Supabase."
    },
    {
      q: "2. How does the QR check-in work, and what stops duplicate entries?",
      a: "When a participant registers, they receive a unique cryptographic ticket code (e.g. EP360-TKT-XXXXXX). The organizer's camera scanner or manual search checks the Supabase database. If the user is already checked in, the system alerts the organizer and displays the exact time they entered."
    },
    {
      q: "3. How does the Smart Team Matchmaker work?",
      a: "It compares the skills and roles needed by open teams with solo participants looking for teammates. Users can filter by specific skill tags (React, AI/ML, Figma, Solidity) and send instant team invites or join requests."
    },
    {
      q: "4. How is judging scored fairly and transparently?",
      a: "Judges score submissions on a 5-axis weighted rubric (Innovation, Technical Execution, UI/UX, Presentation, Market Impact). Scores and constructive feedback notes are stored with PIN verification, and the Live Leaderboard calculates average aggregates in real time."
    },
    {
      q: "5. What technology stack is used, and how is it secure?",
      a: "Built with React 19, TypeScript, Tailwind CSS, and a real-time PostgreSQL database on Supabase. Security includes Row-Level Security (RLS), input validation, PIN-protected judging, and immutable evaluation logs."
    },
    {
      q: "6. How does real-time sync work without page refresh?",
      a: "We use Supabase Realtime Channels (WebSockets). When an organizer broadcasts an announcement or a judge submits a score, all open devices and the Live Arena screen update instantly without refreshing."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Judge Q&A Cheat Sheet</h2>
              <p className="text-xs text-slate-400">Simple, confident answers for your hackathon pitch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accordion Questions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 mb-4 flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-indigo-200 leading-relaxed">
              <strong>Tip for demoing to judges:</strong> Walk them through the 4 personas using the top navigation bar: Participant Registration → Organizer QR Scanner → Judge Scoring → Live Leaderboard.
            </p>
          </div>

          {qaList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-800 rounded-xl bg-slate-950/50 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    {item.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-800/60 bg-slate-900/40 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Ready for the Prompt War presentation!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
