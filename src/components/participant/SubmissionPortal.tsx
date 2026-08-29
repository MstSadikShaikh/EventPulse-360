import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Rocket, 
  ExternalLink, 
  Video, 
  Presentation, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export const SubmissionPortal: React.FC = () => {
  const { 
    teams, 
    submissions, 
    activeParticipant, 
    createSubmission, 
    event,
    evaluations,
    addToast
  } = useEvent();

  const myTeam = teams.find(t => t.id === activeParticipant?.team_id);
  const mySubmission = submissions.find(s => s.team_id === myTeam?.id);

  // Form States
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [track, setTrack] = useState(myTeam?.track || event?.tracks[0] || 'AI & Intelligent Systems');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [deckUrl, setDeckUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluations received for this submission
  const myEvals = mySubmission ? evaluations.filter(e => e.submission_id === mySubmission.id) : [];
  const avgScore = myEvals.length > 0 
    ? (myEvals.reduce((acc, curr) => acc + Number(curr.total_score), 0) / myEvals.length).toFixed(1)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myTeam) {
      addToast('No Team', 'You must be part of a team to submit a project.', 'warning');
      return;
    }
    if (!title.trim() || !repoUrl.trim() || !description.trim()) {
      addToast('Missing Info', 'Title, Description, and GitHub Repo are required.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSubmission({
        team_id: myTeam.id,
        title,
        tagline,
        description,
        track,
        repo_url: repoUrl,
        live_demo_url: liveDemoUrl,
        video_url: videoUrl,
        deck_url: deckUrl
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!myTeam) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Join a Team to Submit</h3>
        <p className="text-xs text-slate-400">
          Projects must be submitted on behalf of a registered squad. Head to the Team Matchmaker tab to join or form a team.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Existing Submission Preview */}
      {mySubmission ? (
        <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Project Submitted & Locked</span>
                <h3 className="text-xl font-bold text-white">{mySubmission.title}</h3>
                <p className="text-xs text-slate-400">{mySubmission.tagline}</p>
              </div>
            </div>

            {/* Score & Evaluation status */}
            <div className="flex items-center gap-3">
              {avgScore ? (
                <div className="px-4 py-2 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-center">
                  <span className="text-[10px] text-indigo-300 uppercase font-semibold block">Avg Score</span>
                  <span className="text-xl font-extrabold text-white">{avgScore}<span className="text-xs text-indigo-400">/100</span></span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  Judging in Progress
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Summary</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {mySubmission.description}
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {mySubmission.repo_url && (
              <a
                href={mySubmission.repo_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs font-semibold text-slate-200 transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">GitHub Repo</span>
              </a>
            )}
            {mySubmission.live_demo_url && (
              <a
                href={mySubmission.live_demo_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-xs font-semibold text-slate-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Live Demo</span>
              </a>
            )}
            {mySubmission.video_url && (
              <a
                href={mySubmission.video_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Video className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">Video Pitch</span>
              </a>
            )}
            {mySubmission.deck_url && (
              <a
                href={mySubmission.deck_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Presentation className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Pitch Deck</span>
              </a>
            )}
          </div>

          {/* Judge Feedback preview */}
          {myEvals.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Judge Feedback & Notes</h4>
              <div className="space-y-2">
                {myEvals.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-indigo-300 font-semibold mb-1">
                      <span>Evaluator Score: {ev.total_score}/100</span>
                      <span className="text-[10px] text-slate-500">{new Date(ev.updated_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300 italic">"{ev.feedback || 'Great project and technical execution.'}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Submission Form */
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Project Submission Portal</h3>
              <p className="text-xs text-slate-400">Submitting for Team: <span className="font-semibold text-indigo-300">{myTeam.name}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeuralShield AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Track *</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {event?.tracks.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">One-line Tagline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Autonomous AI agent detecting fraud in 12ms"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Description & Problem Solved *</label>
              <textarea
                required
                rows={4}
                placeholder="Explain the problem, your architecture, tech stack used, challenges overcome, and future roadmap..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">GitHub Repository Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/team/project"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://yourproject.live"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Demo Video Link (YouTube / Loom)</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pitch Deck (Slides Link)</label>
                <input
                  type="url"
                  placeholder="https://pitch.com/deck/..."
                  value={deckUrl}
                  onChange={(e) => setDeckUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? 'Publishing Submission...' : 'Submit Project for Evaluation'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
