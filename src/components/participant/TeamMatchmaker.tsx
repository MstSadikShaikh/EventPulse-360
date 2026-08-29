import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Code2, 
  X,
  Compass
} from 'lucide-react';

export const TeamMatchmaker: React.FC = () => {
  const { 
    teams, 
    participants, 
    activeParticipant, 
    createTeam, 
    joinTeam, 
    leaveTeam, 
    event,
    addToast
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for creating a team
  const [teamName, setTeamName] = useState('');
  const [teamTrack, setTeamTrack] = useState(event?.tracks[0] || 'AI & Intelligent Systems');
  const [teamDesc, setTeamDesc] = useState('');
  const [neededRoles, setNeededRoles] = useState<string[]>(['Frontend Developer', 'AI/ML Engineer']);
  const [newRoleInput, setNewRoleInput] = useState('');

  // Find active participant's current team
  const myTeam = teams.find(t => t.id === activeParticipant?.team_id);
  const myTeamMembers = participants.filter(p => p.team_id === myTeam?.id);

  // Solo participants looking for a team
  const soloParticipants = participants.filter(p => 
    p.looking_for_team && 
    !p.team_id && 
    p.id !== activeParticipant?.id &&
    (searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    (selectedRoleFilter === 'all' || p.role.toLowerCase().includes(selectedRoleFilter.toLowerCase()))
  );

  // Filtered teams
  const filteredTeams = teams.filter(t => 
    t.is_open &&
    (selectedTrackFilter === 'all' || t.track === selectedTrackFilter) &&
    (searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.needed_roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const handleAddNeededRole = () => {
    if (newRoleInput.trim() && !neededRoles.includes(newRoleInput.trim())) {
      setNeededRoles(prev => [...prev, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const handleRemoveNeededRole = (roleToRemove: string) => {
    setNeededRoles(prev => prev.filter(r => r !== roleToRemove));
  };

  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamDesc.trim()) {
      addToast('Missing Info', 'Please enter a team name and description.', 'warning');
      return;
    }

    await createTeam({
      name: teamName,
      track: teamTrack,
      description: teamDesc,
      needed_roles: neededRoles,
      leaderId: activeParticipant?.id
    });

    setShowCreateModal(false);
    setTeamName('');
    setTeamDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Current Team Status Banner */}
      {myTeam ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-900/40 border border-indigo-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                YOUR TEAM
              </span>
              <span className="text-xs text-slate-400 font-medium">• {myTeam.track}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">{myTeam.name}</h3>
            <p className="text-xs text-slate-300 max-w-2xl">{myTeam.description}</p>
            
            {/* Team Roster */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-400">Members ({myTeamMembers.length}):</span>
              <div className="flex flex-wrap gap-1.5">
                {myTeamMembers.map((m) => (
                  <span key={m.id} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                    {m.name} ({m.role})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => activeParticipant && leaveTeam(activeParticipant.id)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 border border-slate-700 transition-colors"
            >
              Leave Team
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Looking for Teammates?</h3>
              <p className="text-xs text-slate-400">Join an existing squad or create your own team to start collaborating.</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create New Team
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by skill, role, or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedTrackFilter}
            onChange={(e) => setSelectedTrackFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tracks</option>
            {event?.tracks.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="frontend">Frontend Dev</option>
            <option value="backend">Backend Dev</option>
            <option value="ai">AI / ML Engineer</option>
            <option value="designer">UI/UX Designer</option>
            <option value="pitch">Product & Pitch</option>
          </select>
        </div>
      </div>

      {/* Grid: Open Teams & Solo Innovators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Open Teams Seeking Teammates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Open Teams Seeking Teammates ({filteredTeams.length})
            </h4>
            <span className="text-[11px] text-slate-400">Match with open slots</span>
          </div>

          <div className="space-y-3">
            {filteredTeams.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No teams matching current criteria.</p>
              </div>
            ) : (
              filteredTeams.map((team) => {
                const teamMembers = participants.filter(p => p.team_id === team.id);
                const isMyTeam = team.id === activeParticipant?.team_id;

                return (
                  <div 
                    key={team.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{team.name}</h5>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {team.track}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">{team.description}</p>
                      </div>

                      {!isMyTeam && activeParticipant && !activeParticipant.team_id && (
                        <button
                          onClick={() => joinTeam(activeParticipant.id, team.id)}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
                        >
                          Join Team
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Open Roles Needed */}
                    {team.needed_roles && team.needed_roles.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mr-1">Needed:</span>
                        {team.needed_roles.map((roleName, rIdx) => (
                          <span 
                            key={rIdx} 
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                          >
                            + {roleName}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Existing Members count */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{teamMembers.length} member(s) enrolled</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Solo Innovators Available for Teaming */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              Solo Innovators Available ({soloParticipants.length})
            </h4>
            <span className="text-[11px] text-slate-400">Looking for a squad</span>
          </div>

          <div className="space-y-3">
            {soloParticipants.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">All registered participants currently have teams!</p>
              </div>
            ) : (
              soloParticipants.map((solo) => (
                <div 
                  key={solo.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h5 className="text-sm font-bold text-white">{solo.name}</h5>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {solo.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{solo.bio || 'Ready to build impactful tech solutions.'}</p>
                    </div>

                    {myTeam && (
                      <button
                        onClick={() => {
                          joinTeam(solo.id, myTeam.id);
                          addToast('Member Added', `Added ${solo.name} to ${myTeam.name}`, 'success');
                        }}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Invite
                      </button>
                    )}
                  </div>

                  {/* Skills tags */}
                  {solo.skills && solo.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {solo.skills.map((s, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modal: Create Team */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Create New Innovation Team
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Neural Squad"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Track *</label>
                <select
                  value={teamTrack}
                  onChange={(e) => setTeamTrack(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {event?.tracks.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Idea & Goal *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Briefly describe what your team is building..."
                  value={teamDesc}
                  onChange={(e) => setTeamDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Roles Needed to Recruit</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. UI/UX Designer, Rust Dev"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNeededRole(); } }}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNeededRole}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {neededRoles.map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      {r}
                      <button type="button" onClick={() => handleRemoveNeededRole(r)}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Create & Launch Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
