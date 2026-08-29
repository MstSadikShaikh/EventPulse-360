import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { UserCheck, Sparkles, Plus, X, ArrowRight } from 'lucide-react';

interface RegistrationFormProps {
  onComplete?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onComplete }) => {
  const { registerParticipant, event } = useEvent();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Fullstack Developer');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [dietary, setDietary] = useState('Standard');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (toRemove: string) => {
    setSkills(prev => prev.filter(s => s !== toRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await registerParticipant({
        name,
        email,
        role,
        skills,
        dietary,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        looking_for_team: true,
        bio
      });
      if (onComplete) onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Event Registration & Digital Pass</h3>
          <p className="text-xs text-slate-400">Fill in your details to get your instant QR event ticket.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Sterling"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="maya.s@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Primary Role & Dietary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Fullstack Developer">Fullstack Developer</option>
              <option value="AI/ML Engineer">AI / ML Engineer</option>
              <option value="Product Designer">UI/UX Product Designer</option>
              <option value="Smart Contract Dev">Smart Contract Dev</option>
              <option value="Pitch & Business">Pitch & Business Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Dietary Preference</label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Standard">Standard (Omnivore)</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Halal">Halal</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Key Skills & Tools</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g. Next.js, PyTorch, Figma, Solidity"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                {s}
                <button type="button" onClick={() => handleRemoveSkill(s)}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Social / Portfolio links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">GitHub Profile Link</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">LinkedIn Profile</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Short Bio */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Short Bio</label>
          <textarea
            rows={2}
            placeholder="Tell teammates a bit about yourself and what you love building..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? 'Generating Digital QR Pass...' : 'Complete Registration & Get QR Pass'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
