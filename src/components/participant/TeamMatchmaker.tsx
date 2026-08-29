import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  X,
  Compass,
  Mail,
  Check,
  Ban,
  Settings2,
  Lock,
  Unlock,
  Sliders
} from 'lucide-react';

export const TeamMatchmaker: React.FC = () => {
  const { 
    teams, 
    participants, 
    activeParticipant, 
    createTeam, 
    updateTeam,
    joinTeam, 
    leaveTeam, 
    sendTeamInvite,
    acceptTeamInvite,
    declineTeamInvite,
    teamInvites,
    event,
    addToast
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  // Form State for creating a team
  const [teamName, setTeamName] = useState('');
  const [teamTrack, setTeamTrack] = useState(event?.tracks[0] || 'AI & Intelligent Systems');
  const [teamDesc, setTeamDesc] = useState('');
  const [neededRoles, setNeededRoles] = useState<string[]>(['Frontend Developer', 'AI/ML Engineer']);
  const [newRoleInput, setNewRoleInput] = useState('');

  // Team Management State
  const myTeam = teams.find(t => t.id === activeParticipant?.team_id);
  const myTeamMembers = participants.filter(p => p.team_id === myTeam?.id);
  const isTeamLeader = myTeam && myTeamMembers.length > 0 && myTeamMembers[0].id === activeParticipant?.id;

  // Invites received by active participant
  const myPendingInvites = teamInvites.filter(inv => 
    inv.participant_id === activeParticipant?.id && inv.status === 'pending'
  );

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

  // Update existing team role requirements
  const handleRemoveRoleFromMyTeam = async (roleToRemove: string) => {
    if (!myTeam) return;
    const updated = myTeam.needed_roles.filter(r => r !== roleToRemove);
    await updateTeam(myTeam.id, { needed_roles: updated });
  };

  const handleAddRoleToMyTeam = async (roleToAdd: string) => {
    if (!myTeam || !roleToAdd.trim()) return;
    if (myTeam.needed_roles.includes(roleToAdd.trim())) return;
    const updated = [...myTeam.needed_roles, roleToAdd.trim()];
    await updateTeam(myTeam.id, { needed_roles: updated });
  };

  const handleToggleTeamOpen = async () => {
    if (!myTeam) return;
    await updateTeam(myTeam.id, { is_open: !myTeam.is_open });
  };

  return (
    <div className="space-y-6">
      
      {/* Personal Team Invites Banner */}
      {myPendingInvites.length > 0 && !myTeam && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 border-2 border-indigo-500/60 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 uppercase tracking-wider">
            <Mail className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Personal Team Invites ({myPendingInvites.length})</span>
          </div>

          <div className="space-y-2">
            {myPendingInvites.map(inv => (
              <div key={inv.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30">
                <div>
                  <h4 className="text-sm font-bold text-white">Invitation to join <span className="text-cyan-400">"{inv.team_name}"</span></h4>
                  <p className="text-xs text-slate-400">The team leader invited you to collaborate in their squad.</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => activeParticipant && acceptTeamInvite(inv.id, inv.team_id, activeParticipant.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Invite
                  </button>
                  <button
                    onClick={() => declineTeamInvite(inv.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Team Status Banner with Manage Team Options */}
      {myTeam ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-900/40 border border-indigo-500/40 shadow-xl space-y-4">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  YOUR SQUAD
                </span>
                <span className="text-xs text-slate-400 font-medium">• {myTeam.track}</span>
                
                {/* Recruitment Status Pill */}
                {myTeam.is_open ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Unlock className="w-3 h-3" /> Recruiting Open
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    <Lock className="w-3 h-3" /> Squad Full / Closed
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white tracking-wide">{myTeam.name}</h3>
              <p className="text-xs text-slate-300 max-w-2xl">{myTeam.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggleTeamOpen}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Toggle open recruitment"
              >
                {myTeam.is_open ? 'Close Recruitment' : 'Re-open Recruitment'}
              </button>

              <button
                onClick={() => activeParticipant && leaveTeam(activeParticipant.id)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 transition-colors"
              >
                Leave Team
              </button>
            </div>
          </div>

          {/* Members Roster & Live Needed Roles Management */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Left: Squad Members */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Active Squad Members ({myTeamMembers.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {myTeamMembers.map((m) => (
                  <span key={m.id} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {m.name} <span className="text-indigo-400 text-[10px]">({m.role})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Manage Needed Roles */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Recruitment Needs (Click X to remove when filled):
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                {myTeam.needed_roles && myTeam.needed_roles.map((roleName) => (
                  <span 
                    key={roleName} 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  >
                    + {roleName}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveRoleFromMyTeam(roleName)}
                      className="text-amber-400 hover:text-white"
                      title="Role filled? Remove requirement"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Quick Add Role */}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Add needed role..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val.trim()) {
                          handleAddRoleToMyTeam(val);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-200 focus:outline-none focus:border-indigo-500 w-28"
                  />
                </div>
              </div>
            </div>

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
              Open Squads Seeking Teammates ({filteredTeams.length})
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
                          Join Squad
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
            <span className="text-[11px] text-slate-400">Invite directly to your squad</span>
          </div>

          <div className="space-y-3">
            {soloParticipants.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">All registered participants currently have squads!</p>
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
                      <p className="text-xs text-slate-400">{solo.bio || 'Ready to collaborate and build impactful technology.'}</p>
                    </div>

                    {myTeam && (
                      <button
                        onClick={() => sendTeamInvite(myTeam.id, myTeam.name, solo.id)}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Send Invite
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
                Create New Squad
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Squad Name *</label>
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
                <label className="block text-slate-300 font-semibold mb-1">Focus Track *</label>
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
                <label className="block text-slate-300 font-semibold mb-1">Squad Mission / Project Goal *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Briefly describe what your squad is building..."
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
