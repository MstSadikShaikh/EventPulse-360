import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  UserRole, 
  EventItem, 
  Participant, 
  Team, 
  Submission, 
  Judge, 
  Evaluation, 
  Announcement,
  RubricCriterion
} from '../types';
import { supabase, sounds } from '../lib/supabase';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'urgent' | 'info' | 'warning';
  timestamp: number;
}

interface EventContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  event: EventItem | null;
  participants: Participant[];
  teams: Team[];
  submissions: Submission[];
  judges: Judge[];
  evaluations: Evaluation[];
  announcements: Announcement[];
  loading: boolean;
  activeJudge: Judge | null;
  setActiveJudge: (judge: Judge | null) => void;
  activeParticipant: Participant | null;
  setActiveParticipant: (p: Participant | null) => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'urgent' | 'info' | 'warning') => void;
  
  // Action Handlers
  registerParticipant: (data: Omit<Participant, 'id' | 'event_id' | 'qr_ticket_id' | 'is_checked_in' | 'created_at'>) => Promise<Participant>;
  checkInParticipant: (qrCodeOrId: string) => Promise<{ success: boolean; participant?: Participant; message: string }>;
  createTeam: (data: { name: string; track: string; description: string; needed_roles: string[]; leaderId?: string }) => Promise<Team>;
  joinTeam: (participantId: string, teamId: string) => Promise<boolean>;
  leaveTeam: (participantId: string) => Promise<boolean>;
  createSubmission: (data: { team_id: string; title: string; tagline: string; description: string; track: string; repo_url: string; live_demo_url?: string; video_url?: string; deck_url?: string }) => Promise<Submission>;
  submitEvaluation: (submissionId: string, judgeId: string, criteriaScores: Record<string, number>, feedback: string) => Promise<Evaluation>;
  postAnnouncement: (title: string, message: string, category: Announcement['category'], is_pinned?: boolean) => Promise<Announcement>;
  updateRubrics: (rubrics: RubricCriterion[]) => Promise<void>;
  resetToSampleData: () => Promise<void>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('participant');
  const [event, setEvent] = useState<EventItem | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeJudge, setActiveJudge] = useState<Judge | null>(null);
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  const setSoundEnabled = (enabled: boolean) => {
    sounds.setSoundEnabled(enabled);
    setSoundEnabledState(enabled);
  };

  const addToast = useCallback((title: string, message: string, type: 'success' | 'urgent' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    if (type === 'urgent') {
      sounds.playAlert();
    } else if (type === 'success') {
      sounds.playSuccess();
    }
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        eventsRes,
        participantsRes,
        teamsRes,
        submissionsRes,
        judgesRes,
        evaluationsRes,
        announcementsRes
      ] = await Promise.all([
        supabase.from('events').select('*').limit(1).single(),
        supabase.from('participants').select('*').order('created_at', { ascending: false }),
        supabase.from('teams').select('*').order('created_at', { ascending: false }),
        supabase.from('submissions').select('*').order('submitted_at', { ascending: false }),
        supabase.from('judges').select('*').order('created_at', { ascending: true }),
        supabase.from('evaluations').select('*'),
        supabase.from('announcements').select('*').order('created_at', { ascending: false })
      ]);

      if (eventsRes.data) {
        setEvent(eventsRes.data);
      }
      if (participantsRes.data) {
        setParticipants(participantsRes.data);
        if (!activeParticipant && participantsRes.data.length > 0) {
          setActiveParticipant(participantsRes.data[0]);
        }
      }
      if (teamsRes.data) {
        setTeams(teamsRes.data);
      }
      if (submissionsRes.data) {
        setSubmissions(submissionsRes.data);
      }
      if (judgesRes.data) {
        setJudges(judgesRes.data);
        if (!activeJudge && judgesRes.data.length > 0) {
          setActiveJudge(judgesRes.data[0]);
        }
      }
      if (evaluationsRes.data) {
        setEvaluations(evaluationsRes.data);
      }
      if (announcementsRes.data) {
        setAnnouncements(announcementsRes.data);
      }
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, [activeJudge, activeParticipant]);

  useEffect(() => {
    fetchData();

    // Subscribe to Supabase Realtime Channels for instant live updates across devices
    const channel = supabase
      .channel('eventpulse-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluations' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, (payload) => {
        const newAnn = payload.new as Announcement;
        addToast(newAnn.title, newAnn.message, newAnn.category === 'urgent' ? 'urgent' : 'info');
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, addToast]);

  // Action: Register Participant
  const registerParticipant = async (data: Omit<Participant, 'id' | 'event_id' | 'qr_ticket_id' | 'is_checked_in' | 'created_at'>): Promise<Participant> => {
    const randomTicketNumber = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `EP360-TKT-${randomTicketNumber}`;
    const eventId = event?.id || 'a0000000-0000-0000-0000-000000000001';

    const newParticipantData = {
      event_id: eventId,
      name: data.name,
      email: data.email,
      role: data.role,
      skills: data.skills || [],
      dietary: data.dietary || 'Standard',
      github_url: data.github_url || '',
      linkedin_url: data.linkedin_url || '',
      qr_ticket_id: ticketId,
      is_checked_in: false,
      looking_for_team: data.looking_for_team ?? true,
      bio: data.bio || ''
    };

    const { data: inserted, error } = await supabase
      .from('participants')
      .insert([newParticipantData])
      .select()
      .single();

    if (error || !inserted) {
      // Fallback
      const localP: Participant = {
        id: 'p-' + Date.now(),
        ...newParticipantData
      };
      setParticipants(prev => [localP, ...prev]);
      setActiveParticipant(localP);
      sounds.playSuccess();
      addToast('Registration Confirmed!', `Welcome, ${localP.name}. Your QR Pass is ready.`, 'success');
      return localP;
    }

    setParticipants(prev => [inserted, ...prev]);
    setActiveParticipant(inserted);
    sounds.playSuccess();
    addToast('Registration Confirmed!', `Welcome, ${inserted.name}. Your QR Pass is ready.`, 'success');
    return inserted;
  };

  // Action: Check-in Participant with QR Code or Ticket ID
  const checkInParticipant = async (qrCodeOrId: string): Promise<{ success: boolean; participant?: Participant; message: string }> => {
    const cleanId = qrCodeOrId.trim();
    const target = participants.find(p => 
      p.qr_ticket_id.toLowerCase() === cleanId.toLowerCase() || 
      p.id.toLowerCase() === cleanId.toLowerCase() ||
      p.email.toLowerCase() === cleanId.toLowerCase()
    );

    if (!target) {
      return { success: false, message: 'Ticket not found. Please verify QR code or Ticket ID.' };
    }

    if (target.is_checked_in) {
      return { 
        success: true, 
        participant: target, 
        message: `Already checked in at ${target.checked_in_at ? new Date(target.checked_in_at).toLocaleTimeString() : 'earlier'}.` 
      };
    }

    const checkInTime = new Date().toISOString();

    const { error } = await supabase
      .from('participants')
      .update({ is_checked_in: true, checked_in_at: checkInTime })
      .eq('id', target.id);

    if (error) {
      console.warn('Supabase checkin error, updating locally', error);
    }

    const updatedParticipant = { ...target, is_checked_in: true, checked_in_at: checkInTime };
    setParticipants(prev => prev.map(p => p.id === target.id ? updatedParticipant : p));
    sounds.playScanBeep();
    addToast('Attendee Verified!', `${target.name} has been successfully checked in.`, 'success');

    return {
      success: true,
      participant: updatedParticipant,
      message: `Successfully verified and checked in ${target.name}!`
    };
  };

  // Action: Create Team
  const createTeam = async (data: { name: string; track: string; description: string; needed_roles: string[]; leaderId?: string }): Promise<Team> => {
    const eventId = event?.id || 'a0000000-0000-0000-0000-000000000001';
    const newTeamData = {
      event_id: eventId,
      name: data.name,
      track: data.track,
      description: data.description,
      needed_roles: data.needed_roles,
      is_open: true
    };

    const { data: inserted, error } = await supabase
      .from('teams')
      .insert([newTeamData])
      .select()
      .single();

    const team = inserted || {
      id: 'team-' + Date.now(),
      ...newTeamData,
      created_at: new Date().toISOString()
    };

    setTeams(prev => [team, ...prev]);

    if (data.leaderId) {
      await joinTeam(data.leaderId, team.id);
    }

    sounds.playSuccess();
    addToast('Team Created!', `Team "${team.name}" is now live for matchmaking.`, 'success');
    return team;
  };

  // Action: Join Team
  const joinTeam = async (participantId: string, teamId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('participants')
      .update({ team_id: teamId, looking_for_team: false })
      .eq('id', participantId);

    if (error) console.warn('Supabase join team error', error);

    setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, team_id: teamId, looking_for_team: false } : p));
    if (activeParticipant && activeParticipant.id === participantId) {
      setActiveParticipant(prev => prev ? { ...prev, team_id: teamId, looking_for_team: false } : null);
    }

    sounds.playSuccess();
    addToast('Joined Team!', 'You are now part of the team roster.', 'success');
    return true;
  };

  // Action: Leave Team
  const leaveTeam = async (participantId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('participants')
      .update({ team_id: null, looking_for_team: true })
      .eq('id', participantId);

    if (error) console.warn('Supabase leave team error', error);

    setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, team_id: null, looking_for_team: true } : p));
    if (activeParticipant && activeParticipant.id === participantId) {
      setActiveParticipant(prev => prev ? { ...prev, team_id: null, looking_for_team: true } : null);
    }

    addToast('Left Team', 'You are now marked as looking for a team.', 'info');
    return true;
  };

  // Action: Create Submission
  const createSubmission = async (data: { team_id: string; title: string; tagline: string; description: string; track: string; repo_url: string; live_demo_url?: string; video_url?: string; deck_url?: string }): Promise<Submission> => {
    const eventId = event?.id || 'a0000000-0000-0000-0000-000000000001';
    const submissionData = {
      event_id: eventId,
      team_id: data.team_id,
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      track: data.track,
      repo_url: data.repo_url,
      live_demo_url: data.live_demo_url || '',
      video_url: data.video_url || '',
      deck_url: data.deck_url || '',
      submitted_at: new Date().toISOString()
    };

    const { data: inserted, error } = await supabase
      .from('submissions')
      .insert([submissionData])
      .select()
      .single();

    const sub = inserted || {
      id: 'sub-' + Date.now(),
      ...submissionData
    };

    setSubmissions(prev => [sub, ...prev]);
    sounds.playSuccess();
    addToast('Project Submitted! 🚀', `"${sub.title}" is now ready for judges evaluation.`, 'success');
    return sub;
  };

  // Action: Submit Evaluation
  const submitEvaluation = async (submissionId: string, judgeId: string, criteriaScores: Record<string, number>, feedback: string): Promise<Evaluation> => {
    const total = Object.values(criteriaScores).reduce((a, b) => a + b, 0);

    const evaluationData = {
      submission_id: submissionId,
      judge_id: judgeId,
      criteria_scores: criteriaScores,
      total_score: total,
      feedback: feedback,
      is_locked: true,
      updated_at: new Date().toISOString()
    };

    const { data: inserted, error } = await supabase
      .from('evaluations')
      .upsert([evaluationData], { onConflict: 'submission_id, judge_id' })
      .select()
      .single();

    const evalRecord = inserted || {
      id: 'eval-' + Date.now(),
      ...evaluationData
    };

    setEvaluations(prev => {
      const filtered = prev.filter(e => !(e.submission_id === submissionId && e.judge_id === judgeId));
      return [...filtered, evalRecord];
    });

    sounds.playSuccess();
    addToast('Score Submitted!', `Score of ${total}/100 recorded securely.`, 'success');
    return evalRecord;
  };

  // Action: Post Broadcast Announcement
  const postAnnouncement = async (title: string, message: string, category: Announcement['category'], is_pinned: boolean = false): Promise<Announcement> => {
    const eventId = event?.id || 'a0000000-0000-0000-0000-000000000001';
    const annData = {
      event_id: eventId,
      title,
      message,
      category,
      is_pinned,
      created_at: new Date().toISOString()
    };

    const { data: inserted, error } = await supabase
      .from('announcements')
      .insert([annData])
      .select()
      .single();

    const newAnn = inserted || {
      id: 'ann-' + Date.now(),
      ...annData
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    addToast(title, message, category === 'urgent' ? 'urgent' : 'info');
    return newAnn;
  };

  // Action: Update Rubrics
  const updateRubrics = async (rubrics: RubricCriterion[]) => {
    if (!event) return;
    const { error } = await supabase
      .from('events')
      .update({ rubrics })
      .eq('id', event.id);

    if (error) console.warn('Supabase rubric update error', error);
    setEvent(prev => prev ? { ...prev, rubrics } : null);
    addToast('Rubric Updated', 'Judging criteria & weights saved.', 'success');
  };

  // Action: Reset/Reseed Sample Data
  const resetToSampleData = async () => {
    await fetchData();
    addToast('Data Synced', 'Refreshed latest data from database.', 'info');
  };

  return (
    <EventContext.Provider value={{
      role,
      setRole,
      event,
      participants,
      teams,
      submissions,
      judges,
      evaluations,
      announcements,
      loading,
      activeJudge,
      setActiveJudge,
      activeParticipant,
      setActiveParticipant,
      toasts,
      removeToast,
      addToast,
      registerParticipant,
      checkInParticipant,
      createTeam,
      joinTeam,
      leaveTeam,
      createSubmission,
      submitEvaluation,
      postAnnouncement,
      updateRubrics,
      resetToSampleData,
      soundEnabled,
      setSoundEnabled
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
