import React from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  PieChart as PieIcon, 
  CheckCircle2, 
  Layers, 
  Award,
  Download
} from 'lucide-react';

export const LiveAnalyticsView: React.FC = () => {
  const { participants, teams, submissions, evaluations, judges, event } = useEvent();

  // 1. Role Distribution Data
  const roleCounts: Record<string, number> = {};
  participants.forEach(p => {
    roleCounts[p.role] = (roleCounts[p.role] || 0) + 1;
  });
  const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));

  // 2. Track Distribution Data
  const trackCounts: Record<string, number> = {};
  teams.forEach(t => {
    trackCounts[t.track] = (trackCounts[t.track] || 0) + 1;
  });
  const trackData = Object.entries(trackCounts).map(([name, value]) => ({ name, value }));

  // 3. Check-in Timeline Simulation Data
  const timelineData = [
    { time: '08:00 AM', checkins: 12, cumulative: 12 },
    { time: '09:00 AM', checkins: 45, cumulative: 57 },
    { time: '10:00 AM', checkins: 98, cumulative: 155 },
    { time: '11:00 AM', checkins: 160, cumulative: 315 },
    { time: '12:00 PM', checkins: 85, cumulative: 400 },
    { time: '01:00 PM', checkins: 42, cumulative: 442 },
    { time: '02:00 PM', checkins: participants.filter(p => p.is_checked_in).length, cumulative: 450 + participants.filter(p => p.is_checked_in).length },
  ];

  // 4. Judging Completion Metric
  const totalSubmissions = submissions.length;
  const totalJudges = judges.length;
  const totalExpectedEvaluations = totalSubmissions * totalJudges;
  const actualEvaluations = evaluations.length;
  const judgingProgress = totalExpectedEvaluations > 0 
    ? Math.min(100, Math.round((actualEvaluations / totalExpectedEvaluations) * 100))
    : 0;

  const COLORS = ['#6366f1', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

  const exportAnalyticsReport = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Participants Registered', participants.length],
      ['Total Checked In', participants.filter(p => p.is_checked_in).length],
      ['Total Active Teams', teams.length],
      ['Total Submissions', submissions.length],
      ['Total Judges', judges.length],
      ['Evaluations Completed', evaluations.length],
      ['Judging Progress %', `${judgingProgress}%`]
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `eventpulse_analytics_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header with CSV Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Live Event Intelligence & Metrics
          </h3>
          <p className="text-xs text-slate-400">Real-time attendance velocity, talent distribution, and evaluation telemetry</p>
        </div>

        <button
          onClick={exportAnalyticsReport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Export Analytics CSV
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Check-in Velocity</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {participants.length > 0 ? Math.round((participants.filter(p => p.is_checked_in).length / participants.length) * 100) : 0}%
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">on track</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{participants.filter(p => p.is_checked_in).length} verified of {participants.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Squad Formation</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-cyan-400">{teams.length}</span>
            <span className="text-[10px] text-slate-400">teams formed</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Avg 3.8 devs per team</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Submissions In</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-400">{submissions.length}</span>
            <span className="text-[10px] text-slate-400">/ {teams.length} teams</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {teams.length > 0 ? Math.round((submissions.length / teams.length) * 100) : 0}% submission rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Judging Progress</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">{judgingProgress}%</span>
            <span className="text-[10px] text-slate-400">rubrics locked</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{evaluations.length} total scorecards recorded</p>
        </div>

      </div>

      {/* Visual Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: Check-in Velocity Timeline */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Attendee Check-in Velocity
          </h4>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCheckin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="cumulative" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorCheckin)" name="Total Checked In" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Participant Role Distribution */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Talent & Role Distribution
          </h4>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={110} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[0, 6, 6, 0]} name="Attendees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Track Breakdown */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-pink-400" />
            Project Tracks Breakdown
          </h4>
          <div className="h-56 w-full flex items-center justify-center">
            {trackData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trackData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {trackData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500">No teams formed yet.</p>
            )}
          </div>
        </div>

        {/* Graph 4: Judging Rubric Breakdown */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Judging Rubric Weights
          </h4>
          
          <div className="space-y-3 pt-2">
            {event?.rubrics.map((r, idx) => (
              <div key={r.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-200">
                  <span>{r.label}</span>
                  <span className="text-indigo-400 font-mono">{r.weight}% Weight</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" 
                    style={{ width: `${r.weight * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
