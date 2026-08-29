import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Plus, X, Calendar, MapPin, Tag, Sparkles, Clock } from 'lucide-react';
import type { RubricCriterion } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { createNewEvent, addToast } = useEvent();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Tech Conference');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Main Convention Hall & Hybrid Online');
  
  // Date & Time fields
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState('18:00');

  const [tracks, setTracks] = useState<string[]>(['Keynotes & Panels', 'Workshops & Labs', 'Startup Expo', 'Research Papers']);
  const [newTrackInput, setNewTrackInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTrack = () => {
    if (newTrackInput.trim() && !tracks.includes(newTrackInput.trim())) {
      setTracks(prev => [...prev, newTrackInput.trim()]);
      setNewTrackInput('');
    }
  };

  const handleRemoveTrack = (trackToRemove: string) => {
    setTracks(prev => prev.filter(t => t !== trackToRemove));
  };

  const handlePresetChange = (type: string) => {
    setEventType(type);
    if (type === 'Tech Conference') {
      setTitle('Global Future Tech Summit 2026');
      setTagline('Next-Generation AI, Cloud & Cybersecurity Symposium');
      setTracks(['AI & Machine Learning', 'Cloud Infrastructure', 'Cybersecurity', 'Developer Tools']);
    } else if (type === 'Startup Pitch Competition') {
      setTitle('Venture Launchpad 2026');
      setTagline('Pitching high-growth startups to angel investors & VCs');
      setTracks(['FinTech', 'HealthTech', 'ClimateTech', 'Enterprise SaaS']);
    } else if (type === 'College / University Fest') {
      setTitle('TechIgnite University Fest 2026');
      setTagline('Annual Inter-College Technology & Innovation Festival');
      setTracks(['Coding Arena', 'Robotics & Hardware', 'Game Dev', 'UI/UX Design']);
    } else if (type === 'Hackathon') {
      setTitle('Global AI & Web3 Hackathon 2026');
      setTagline('Build the Future of Intelligent & Decentralized Systems');
      setTracks(['AI & Intelligent Systems', 'Web3 & DeFi', 'Healthcare & Biotech', 'Open Innovation']);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) {
      addToast('Missing Info', 'Please enter an event title and tagline.', 'warning');
      return;
    }

    const defaultRubrics: RubricCriterion[] = [
      { id: 'innovation', label: 'Innovation & Novelty', weight: 25, max: 25, desc: 'Originality and creativity' },
      { id: 'technical', label: 'Technical Execution', weight: 25, max: 25, desc: 'Architecture quality and viability' },
      { id: 'ui_ux', label: 'Design & User Experience', weight: 20, max: 20, desc: 'Visual clarity and ease of use' },
      { id: 'presentation', label: 'Presentation & Delivery', weight: 15, max: 15, desc: 'Clarity and pitch engagement' },
      { id: 'impact', label: 'Impact & Scalability', weight: 15, max: 15, desc: 'Real-world value and utility' }
    ];

    setIsSubmitting(true);
    try {
      await createNewEvent({
        title,
        tagline,
        description: description || tagline,
        location,
        tracks,
        rubrics: defaultRubrics,
        start_date: `${startDate}T${startTime}:00Z`,
        end_date: `${endDate}T${endTime}:00Z`
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create & Launch New Event</h3>
              <p className="text-xs text-slate-400">Host a Conference, Tech Fest, Hackathon, or Startup Pitch Day</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* Preset Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Event Type Template</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Tech Conference', 'Hackathon', 'Startup Pitch Competition', 'College / University Fest'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePresetChange(type)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    eventType === type
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-[11px] truncate">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Global Tech Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tagline / Short Summary *</label>
            <input
              type="text"
              required
              placeholder="e.g. The premier tech summit bringing together 1000+ industry leaders"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Date & Time Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Start Date & Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> End Date & Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Venue / Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Innovation Expo Center Hall A & Hybrid Virtual"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Event Tracks / Themes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Event Tracks / Focus Areas</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Artificial Intelligence, Cloud, Web3"
                value={newTrackInput}
                onChange={(e) => setNewTrackInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTrack(); } }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTrack}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Add Track
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tracks.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  {t}
                  <button type="button" onClick={() => handleRemoveTrack(t)}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Creating Event...' : 'Create & Launch Event'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
