import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { 
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

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'participant' | 'organizer' | 'judge' | 'guest';
  avatarUrl?: string;
  participantData?: Participant;
  judgeData?: Judge;
}

interface EventContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  event: EventItem | null;
  eventsList: EventItem[];
  switchEvent: (eventId: string) => void;
  createNewEvent: (eventData: {
    title: string;
    tagline: string;
    description: string;
    location: string;
    tracks: string[];
    rubrics: RubricCriterion[];
  }) => Promise<EventItem>;
  
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
  
  // Auth simulation
  loginAsParticipant: (emailOrTicket: string) => boolean;
  loginAsJudge: (pin: string) => boolean;
  loginAsOrganizer: (pin: string) => boolean;
  logout: () => void;

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
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
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

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>({
    id: 'user-organizer',
    name: 'Lead Organizer',
    email: 'admin@eventpulse360.io',
    role: 'organizer'
  });

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
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('participants').select('*').order('created_at', { ascending: false }),
        supabase.from('teams').select('*').order('created_at', { ascending: false }),
        supabase.from('submissions').select('*').order('submitted_at', { ascending: false }),
        supabase.from('judges').select('*').order('created_at', { ascending: true }),
        supabase.from('evaluations').select('*'),
        supabase.from('announcements').select('*').order('created_at', { ascending: false })
      ]);

      if (eventsRes.data && eventsRes.data.length > 0) {
        setEventsList(eventsRes.data);
        if (!event) {
          setEvent(eventsRes.data[0]);
        }
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
  }, [activeJudge, activeParticipant, event]);

  useEffect(() => {
    fetchData();

    // Subscribe to Supabase Realtime Channels
    const channel = supabase
      .channel('eventpulse-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluations' }, () => fetchData())
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

  // Switch Active Event
  const switchEvent = (eventId: string) => {
    const target = eventsList.find(e => e.id === eventId);
    if (target) {
      setEvent(target);
      addToast('Event Switched', `Now managing "${target.title}"`, 'info');
    }
  };

  // Create a brand new event
  const createNewEvent = async (eventData: {
    title: string;
    tagline: string;
    description: string;
    location: string;
    tracks: string[];
    rubrics: RubricCriterion[];
  }): Promise<EventItem> => {
    const newEv = {
      title: eventData.title,
      tagline: eventData.tagline,
      description: eventData.description,
      location: eventData.location,
      tracks: eventData.tracks,
      rubrics: eventData.rubrics,
      is_active: true
    };

    const { data: inserted, error } = await supabase
      .from('events')
      .insert([newEv])
      .select()
      .single();

    const createdEvent = inserted || {
      id: 'ev-' + Date.now(),
      ...newEv,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000 * 2).toISOString()
    };

    setEventsList(prev => [createdEvent, ...prev]);
    setEvent(createdEvent);
    sounds.playSuccess();
    addToast('Event Created! 🎉', `"${createdEvent.title}" is now active and ready for registrations.`, 'success');
    return createdEvent;
  };

  // Auth: Participant Login
  const loginAsParticipant = (emailOrTicket: string): boolean => {
    const target = participants.find(p => 
      p.email.toLowerCase() === emailOrTicket.trim().toLowerCase() ||
      p.qr_ticket_id.toLowerCase() === emailOrTicket.trim().toLowerCase()
    );

    if (target) {
      setActiveParticipant(target);
      setCurrentUser({
        id: target.id,
        name: target.name,
        email: target.email,
        role: 'participant',
        participantData: target
      });
      setRole('participant');
      addToast('Logged In', `Welcome back, ${target.name}!`, 'success');
      return true;
    }
    return false;
  };

  // Auth: Judge Login
  const loginAsJudge = (pin: string): boolean => {
    const target = judges.find(j => j.access_pin === pin.trim());
    if (target) {
      setActiveJudge(target);
      setCurrentUser({
        id: target.id,
        name: target.name,
        email: target.email,
        role: 'judge',
        avatarUrl: target.avatar_url,
        judgeData: target
      });
      setRole('judge');
      addToast('Judge Verified', `Welcome, ${target.name}.`, 'success');
      return true;
    }
    return false;
  };

  // Auth: Organizer Login
  const loginAsOrganizer = (pin: string): boolean => {
    if (pin.trim() === 'admin123' || pin.trim() === '1234') {
      setCurrentUser({
        id: 'admin',
        name: 'Event Organizer',
        email: 'organizer@eventpulse.io',
        role: 'organizer'
      });
      setRole('organizer');
      addToast('Organizer Mode', 'Master event controls unlocked.', 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('leaderboard');
    addToast('Signed Out', 'You have been logged out.', 'info');
  };

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
      const localP: Participant = {
        id: 'p-' + Date.now(),
        ...newParticipantData
      };
      setParticipants(prev => [localP, ...prev]);
      setActiveParticipant(localP);
      setCurrentUser({
        id: localP.id,
        name: localP.name,
        email: localP.email,
        role: 'participant',
        participantData: localP
      });
      sounds.playSuccess();
      addToast('Registration Confirmed!', `Welcome, ${localP.name}. Your QR Pass is ready.`, 'success');
      return localP;
    }

    setParticipants(prev => [inserted, ...prev]);
    setActiveParticipant(inserted);
    setCurrentUser({
      id: inserted.id,
      name: inserted.name,
      email: inserted.email,
      role: 'participant',
      participantData: inserted
    });
    sounds.playSuccess();
    addToast('Registration Confirmed!', `Welcome, ${inserted.name}. Your QR Pass is ready.`, 'success');
    return inserted;
  };

  // Action: Check-in Participant
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

    const { data: inserted } = await supabase
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
    await supabase
      .from('participants')
      .update({ team_id: teamId, looking_for_team: false })
      .eq('id', participantId);

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
    await supabase
      .from('participants')
      .update({ team_id: null, looking_for_team: true })
      .eq('id', participantId);

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

    const { data: inserted } = await supabase
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

    const { data: inserted } = await supabase
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

    const { data: inserted } = await supabase
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
    await supabase
      .from('events')
      .update({ rubrics })
      .eq('id', event.id);

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
      currentUser,
      setCurrentUser,
      event,
      eventsList,
      switchEvent,
      createNewEvent,
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
      loginAsParticipant,
      loginAsJudge,
      loginAsOrganizer,
      logout,
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
