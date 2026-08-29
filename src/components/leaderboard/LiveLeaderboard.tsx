import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useEvent } from '../../context/EventContext';
import { 
  Trophy, 
  Medal, 
  Sparkles, 
  Crown, 
  ExternalLink, 
  Search
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export const LiveLeaderboard: React.FC = () => {
  const { submissions, evaluations, teams, event } = useEvent();
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate average scores and rank submissions
  const rankedSubmissions = submissions
    .map(sub => {
      const team = teams.find(t => t.id === sub.team_id);
      const subEvals = evaluations.filter(e => e.submission_id === sub.id);
      
      const avgScore = subEvals.length > 0
        ? subEvals.reduce((acc, curr) => acc + Number(curr.total_score), 0) / subEvals.length
        : 0;

      return {
        ...sub,
        team_name: team ? team.name : 'Squad',
        avg_score: avgScore,
        eval_count: subEvals.length,
        evaluations: subEvals
      };
    })
    .filter(sub => {
      const matchesTrack = selectedTrack === 'all' || sub.track === selectedTrack;
      const matchesSearch = 
        searchQuery === '' || 
        sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.team_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTrack && matchesSearch;
    })
    .sort((a, b) => b.avg_score - a.avg_score);

  const top1 = rankedSubmissions[0];
  const top2 = rankedSubmissions[1];
  const top3 = rankedSubmissions[2];

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Confetti Celebration Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/60 border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-950/50">
            <Trophy className="w-8 h-8 animate-bounce-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Live Stage Arena</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Scores
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Real-Time Innovation Leaderboard</h2>
            <p className="text-xs text-slate-400">Dynamic rankings automatically recomputed from judge evaluation rubrics</p>
          </div>
        </div>

        <button
          onClick={handleTriggerConfetti}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Celebrate Winners (Confetti)
        </button>
      </div>

      {/* Top-3 3D-Style Podium Display */}
      {rankedSubmissions.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 items-end">
          
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 flex flex-col items-center">
            <div className="w-full p-5 rounded-3xl bg-slate-900/90 border-2 border-slate-400/40 shadow-xl text-center space-y-3 relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-300">
                <Medal className="w-5 h-5 text-slate-300" />
              </div>
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-lg text-slate-200">
                #2
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {top2.track}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5 truncate">{top2.title}</h4>
                <p className="text-xs text-slate-400 font-medium">{top2.team_name}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-center items-baseline gap-1">
                <span className="text-2xl font-black text-slate-200">{top2.avg_score.toFixed(1)}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
            </div>
            <div className="w-full h-12 bg-slate-800/80 rounded-b-2xl border-t border-slate-700 flex items-center justify-center text-xs font-black text-slate-400">
              2nd PLACE
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 flex flex-col items-center -mt-4">
            <div className="w-full p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-400/60 shadow-2xl shadow-amber-950/60 text-center space-y-3 relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-amber-500/20 text-amber-400">
                <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center font-black text-xl text-amber-300 shadow-lg shadow-amber-950/50">
                #1
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {top1.track}
                </span>
                <h4 className="text-lg font-black text-white mt-1.5 truncate">{top1.title}</h4>
                <p className="text-xs text-amber-200/80 font-semibold">{top1.team_name}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-center items-baseline gap-1">
                <span className="text-3xl font-black text-amber-300">{top1.avg_score.toFixed(1)}</span>
                <span className="text-xs text-amber-500">/100</span>
              </div>
            </div>
            <div className="w-full h-16 bg-gradient-to-b from-amber-600/30 to-amber-950/40 rounded-b-2xl border-t border-amber-500/40 flex items-center justify-center text-xs font-black text-amber-300">
              🏆 GRAND CHAMPION
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 md:order-3 flex flex-col items-center">
            <div className="w-full p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-700/40 shadow-xl text-center space-y-3 relative overflow-hidden group hover:border-amber-600 transition-all">
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-amber-600">
                <Medal className="w-5 h-5 text-amber-600" />
              </div>
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-950/40 border border-amber-700/40 flex items-center justify-center font-black text-lg text-amber-500">
                #3
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-950 text-amber-400 border border-amber-700/40">
                  {top3.track}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5 truncate">{top3.title}</h4>
                <p className="text-xs text-slate-400 font-medium">{top3.team_name}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-center items-baseline gap-1">
                <span className="text-2xl font-black text-amber-500">{top3.avg_score.toFixed(1)}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
            </div>
            <div className="w-full h-10 bg-slate-800/80 rounded-b-2xl border-t border-slate-700 flex items-center justify-center text-xs font-black text-amber-600">
              3rd PLACE
            </div>
          </div>

        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or team names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedTrack === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Tracks
          </button>
          {event?.tracks.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedTrack === t
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-4 w-16 text-center">Rank</th>
                <th className="px-4 py-4">Project & Team</th>
                <th className="px-4 py-4">Track</th>
                <th className="px-4 py-4">Judges Evaluated</th>
                <th className="px-4 py-4">Average Score</th>
                <th className="px-4 py-4 text-right">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankedSubmissions.map((sub, idx) => {
                const rank = idx + 1;
                let rankBadge = 'text-slate-400 bg-slate-800';
                if (rank === 1) rankBadge = 'text-slate-950 bg-amber-400 font-black shadow-md shadow-amber-400/30';
                if (rank === 2) rankBadge = 'text-slate-950 bg-slate-200 font-bold';
                if (rank === 3) rankBadge = 'text-white bg-amber-700 font-bold';

                return (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Rank */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs ${rankBadge}`}>
                        {rank}
                      </span>
                    </td>

                    {/* Title & Tagline */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-white text-sm">{sub.title}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-sm">{sub.tagline || sub.description}</div>
                      <div className="text-[10px] text-indigo-400 font-semibold mt-0.5">Team: {sub.team_name}</div>
                    </td>

                    {/* Track */}
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                        {sub.track}
                      </span>
                    </td>

                    {/* Evaluated Count */}
                    <td className="px-4 py-4">
                      <span className="text-slate-300">
                        {sub.eval_count} scorecards
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-white">{sub.avg_score > 0 ? sub.avg_score.toFixed(1) : 'Pending'}</span>
                        {sub.avg_score > 0 && <span className="text-[10px] text-slate-500">/ 100</span>}
                      </div>
                    </td>

                    {/* External Links */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.repo_url && (
                          <a
                            href={sub.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:text-indigo-400 transition-colors"
                            title="GitHub"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {sub.live_demo_url && (
                          <a
                            href={sub.live_demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:text-cyan-400 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
