import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Submission } from '../../types';
import { 
  Gavel, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Video, 
  Presentation, 
  ShieldCheck, 
  Sliders, 
  X,
  MessageSquare
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export const JudgePortal: React.FC = () => {
  const { 
    judges, 
    activeJudge, 
    setActiveJudge, 
    submissions, 
    evaluations, 
    submitEvaluation, 
    teams,
    event
  } = useEvent();

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [trackFilter, setTrackFilter] = useState('all');

  // Scoring Modal States
  const [scores, setScores] = useState<Record<string, number>>({
    innovation: 22,
    technical: 23,
    ui_ux: 18,
    presentation: 14,
    impact: 14
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenScoring = (sub: Submission) => {
    setSelectedSubmission(sub);
    const existingEval = evaluations.find(e => e.submission_id === sub.id && e.judge_id === activeJudge?.id);
    if (existingEval) {
      setScores(existingEval.criteria_scores || {
        innovation: 20,
        technical: 20,
        ui_ux: 18,
        presentation: 14,
        impact: 14
      });
      setFeedback(existingEval.feedback || '');
    } else {
      setScores({
        innovation: 22,
        technical: 23,
        ui_ux: 18,
        presentation: 14,
        impact: 14
      });
      setFeedback('');
    }
  };

  const handleSliderChange = (criterionId: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: val
    }));
  };

  const totalScoreCalculated = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !activeJudge) return;

    setIsSubmitting(true);
    try {
      await submitEvaluation(
        selectedSubmission.id,
        activeJudge.id,
        scores,
        feedback || 'Solid project execution and great presentation.'
      );
      setSelectedSubmission(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    trackFilter === 'all' || s.track === trackFilter
  );

  return (
    <div className="space-y-6">
      
      {/* Top Judge Profile & Authentication Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={activeJudge?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={activeJudge?.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white">
              <Gavel className="w-3 h-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Authenticated Judge</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> Secure Session
              </span>
            </div>
            
            {/* Judge Switcher */}
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={activeJudge?.id || ''}
                onChange={(e) => {
                  const target = judges.find(j => j.id === e.target.value);
                  if (target) setActiveJudge(target);
                }}
                className="bg-transparent font-bold text-base text-white focus:outline-none border-b border-dashed border-slate-700 cursor-pointer"
              >
                {judges.map(j => (
                  <option key={j.id} value={j.id} className="bg-slate-900 text-white">
                    {j.name} ({j.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Track:</span>
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tracks</option>
            {event?.tracks.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions Evaluation Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              Assigned Submissions Queue ({filteredSubmissions.length})
            </h3>
            <p className="text-xs text-slate-400">Score each team against the 5 defined rubric criteria</p>
          </div>

          <span className="text-xs text-indigo-300 font-semibold bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-500/30">
            {evaluations.filter(e => e.judge_id === activeJudge?.id).length} of {submissions.length} Completed
          </span>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubmissions.map((sub) => {
            const team = teams.find(t => t.id === sub.team_id);
            const myEval = evaluations.find(e => e.submission_id === sub.id && e.judge_id === activeJudge?.id);

            return (
              <div
                key={sub.id}
                className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-4 ${
                  myEval
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {sub.track}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{sub.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">Team: {team ? team.name : 'Independent'}</p>
                    </div>

                    {/* Status Pill */}
                    {myEval ? (
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Scored: {myEval.total_score}/100
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                    )}
                  </div>

                  {/* Tagline & Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {sub.tagline || sub.description}
                  </p>

                  {/* Submission External Links */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    {sub.repo_url && (
                      <a
                        href={sub.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-indigo-400 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {sub.live_demo_url && (
                      <a
                        href={sub.live_demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Demo</span>
                      </a>
                    )}
                    {sub.video_url && (
                      <a
                        href={sub.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Video</span>
                      </a>
                    )}
                    {sub.deck_url && (
                      <a
                        href={sub.deck_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        <Presentation className="w-3.5 h-3.5" />
                        <span>Deck</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Score Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Submitted: {new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <button
                    onClick={() => handleOpenScoring(sub)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      myEval
                        ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    }`}
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    {myEval ? 'Edit Evaluation' : 'Evaluate & Score'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Rubric Scoring Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Scorecard Evaluation</span>
                  <h3 className="text-base font-bold text-white">{selectedSubmission.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Total Real-time Score Counter */}
                <div className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-500/40 text-center">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase block">Total</span>
                  <span className="text-base font-black text-white">{totalScoreCalculated}<span className="text-[10px] text-indigo-400">/100</span></span>
                </div>

                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleScoreSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Project Quick Overview */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <p className="text-slate-300 leading-relaxed">{selectedSubmission.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedSubmission.repo_url && (
                    <a href={selectedSubmission.repo_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                      <GithubIcon className="w-3 h-3" /> Repo
                    </a>
                  )}
                  {selectedSubmission.live_demo_url && (
                    <a href={selectedSubmission.live_demo_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* 5-Axis Rubric Sliders */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Rubric Scoring Criteria (100 Point Scale)
                </h4>

                {event?.rubrics.map((r) => {
                  const currentVal = scores[r.id] ?? r.weight;

                  return (
                    <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-sm">{r.label}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{r.desc}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-indigo-300">{currentVal}</span>
                          <span className="text-[10px] text-slate-500"> / {r.max} pts</span>
                        </div>
                      </div>

                      {/* Slider Control */}
                      <input
                        type="range"
                        min={0}
                        max={r.max}
                        step={1}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(r.id, Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Structured Feedback */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Judge Feedback & Constructive Comments *
                </label>
                <textarea
                  rows={3}
                  placeholder="Share key strengths, potential areas for improvement, and technical observations..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit & Lock Score Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isSubmitting ? 'Locking Evaluation...' : `Confirm & Lock Scorecard (${totalScoreCalculated}/100)`}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
