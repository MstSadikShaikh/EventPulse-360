import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Search, 
  Download, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { Participant } from '../../types';

export const AttendeeManager: React.FC = () => {
  const { participants, checkInParticipant, teams, addToast } = useEvent();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'pending'>('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.qr_ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'checked_in' && p.is_checked_in) ||
      (statusFilter === 'pending' && !p.is_checked_in);

    const matchesRole = roleFilter === 'all' || p.role.toLowerCase().includes(roleFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesRole;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Ticket ID', 'Checked In', 'Checked In At', 'Dietary', 'Team Name'];
    const rows = participants.map(p => {
      const team = teams.find(t => t.id === p.team_id);
      return [
        `"${p.name}"`,
        `"${p.email}"`,
        `"${p.role}"`,
        `"${p.qr_ticket_id}"`,
        p.is_checked_in ? 'Yes' : 'No',
        p.checked_in_at ? `"${new Date(p.checked_in_at).toLocaleString()}"` : 'N/A',
        `"${p.dietary || 'Standard'}"`,
        `"${team ? team.name : 'Solo'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `eventpulse_attendees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Complete', 'Downloaded attendee roster as CSV.', 'success');
  };

  const handleToggleCheckIn = async (p: Participant) => {
    await checkInParticipant(p.qr_ticket_id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="checked_in">Checked In Only</option>
            <option value="pending">Pending Entry Only</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="developer">Developers</option>
            <option value="ai">AI / ML</option>
            <option value="designer">Designers</option>
          </select>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          Export Attendees CSV
        </button>

      </div>

      {/* Attendee Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Attendee</th>
                <th className="px-4 py-3.5">Role & Skills</th>
                <th className="px-4 py-3.5">Ticket ID</th>
                <th className="px-4 py-3.5">Team</th>
                <th className="px-4 py-3.5">Dietary</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No attendees match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => {
                  const team = teams.find(t => t.id === p.team_id);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Name & Email */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.email}</div>
                      </td>

                      {/* Role & Skills */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-indigo-300 block mb-1">{p.role}</span>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.skills?.slice(0, 2).map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Ticket ID */}
                      <td className="px-4 py-3.5 font-mono text-cyan-400 font-bold text-[11px]">
                        {p.qr_ticket_id}
                      </td>

                      {/* Team */}
                      <td className="px-4 py-3.5">
                        {team ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                            {team.name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Solo (Looking)</span>
                        )}
                      </td>

                      {/* Dietary */}
                      <td className="px-4 py-3.5 text-[11px] text-slate-300">
                        {p.dietary || 'Standard'}
                      </td>

                      {/* Check-in Status */}
                      <td className="px-4 py-3.5">
                        {p.is_checked_in ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            Pending Entry
                          </span>
                        )}
                      </td>

                      {/* Check in Action */}
                      <td className="px-4 py-3.5 text-right">
                        {!p.is_checked_in ? (
                          <button
                            onClick={() => handleToggleCheckIn(p)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
                          >
                            Check In
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500">Verified</span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
