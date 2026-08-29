import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Announcement } from '../../types';
import { 
  Radio, 
  Send, 
  AlertTriangle, 
  Clock, 
  Utensils, 
  GraduationCap, 
  Pin, 
  Volume2, 
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const BroadcastDesk: React.FC = () => {
  const { announcements, postAnnouncement, addToast } = useEvent();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('urgent');
  const [isPinned, setIsPinned] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      addToast('Missing Info', 'Please enter a title and announcement message.', 'warning');
      return;
    }

    setIsBroadcasting(true);
    try {
      await postAnnouncement(title, message, category, isPinned);
      setTitle('');
      setMessage('');
      setIsPinned(false);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const quickTemplates = [
    {
      title: '⚡ Submissions Close in 1 Hour!',
      msg: 'Ensure your GitHub repository is public and presentation slides are uploaded.',
      cat: 'urgent' as const
    },
    {
      title: '🍕 Midnight Pizza & Coffee Ready!',
      msg: 'Fresh hot pizza and energy drinks are now being served in Hall C.',
      cat: 'food' as const
    },
    {
      title: '🎤 Pitch Mentorship Sprint in 15 Mins',
      msg: 'VC investors are offering 1-on-1 pitch reviews in Workshop Room 202.',
      cat: 'workshop' as const
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Broadcast Composer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Live Broadcast & Push Center</h3>
                <p className="text-xs text-slate-400">Push real-time alerts and audio chime notifications to all attendees</p>
              </div>
            </div>

            {/* Template Quick Fills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Quick Announcement Presets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quickTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitle(tmpl.title);
                      setMessage(tmpl.msg);
                      setCategory(tmpl.cat);
                    }}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 text-left text-xs transition-colors"
                  >
                    <span className="font-semibold text-white truncate block">{tmpl.title}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{tmpl.cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Update: Keynote moved to Main Stage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Alert Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Announcement['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">🚨 Urgent / Critical Alert</option>
                    <option value="schedule">⏰ Schedule Change</option>
                    <option value="food">🍕 Food & Logistics</option>
                    <option value="workshop">🎓 Workshop & Mentorship</option>
                    <option value="general">📢 General Announcement</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-300 font-semibold flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5 text-indigo-400" />
                      Pin to Top Banner
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Broadcast Message Body *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the full message to be delivered instantly to all user screens..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  {isBroadcasting ? 'Broadcasting to all nodes...' : 'Send Live Broadcast Alert'}
                </button>
              </div>

            </form>

          </div>
        </div>

        {/* Right Column: Live Feed of Recent Broadcasts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Active Broadcast Stream ({announcements.length})
            </h4>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live WebSocket Sync
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {announcements.map((ann) => {
              let border = 'border-slate-800 bg-slate-900/90';
              let badge = 'bg-slate-800 text-slate-300';
              let icon = <Radio className="w-4 h-4 text-indigo-400" />;

              if (ann.category === 'urgent') {
                border = 'border-rose-500/50 bg-slate-900/95';
                badge = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
                icon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
              } else if (ann.category === 'food') {
                badge = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                icon = <Utensils className="w-4 h-4 text-amber-400" />;
              } else if (ann.category === 'workshop') {
                badge = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
                icon = <GraduationCap className="w-4 h-4 text-cyan-400" />;
              }

              return (
                <div key={ann.id} className={`p-4 rounded-2xl border transition-all ${border}`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {icon}
                      <h5 className="text-xs font-bold text-white">{ann.title}</h5>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badge}`}>
                      {ann.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">{ann.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pl-6 mt-2 pt-2 border-t border-slate-800/60">
                    <span>{new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {ann.is_pinned && (
                      <span className="text-indigo-400 flex items-center gap-1 font-semibold">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
