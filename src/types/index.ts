export type UserRole = 'participant' | 'organizer' | 'judge' | 'leaderboard';

export interface RubricCriterion {
  id: string;
  label: string;
  weight: number; // percentage e.g. 25
  max: number; // max points e.g. 25
  desc: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  tracks: string[];
  rubrics: RubricCriterion[];
  is_active: boolean;
  created_at?: string;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  email: string;
  role: string; // e.g. "Frontend Dev", "AI/ML Engineer", "UI/UX Designer"
  skills: string[];
  dietary?: string;
  github_url?: string;
  linkedin_url?: string;
  qr_ticket_id: string;
  is_checked_in: boolean;
  checked_in_at?: string | null;
  team_id?: string | null;
  looking_for_team: boolean;
  bio?: string;
  created_at?: string;
}

export interface Team {
  id: string;
  event_id: string;
  name: string;
  track: string;
  description: string;
  needed_roles: string[];
  is_open: boolean;
  created_at?: string;
  members?: Participant[];
}

export interface Submission {
  id: string;
  event_id: string;
  team_id: string;
  team_name?: string;
  title: string;
  tagline: string;
  description: string;
  track: string;
  repo_url: string;
  live_demo_url?: string;
  video_url?: string;
  deck_url?: string;
  submitted_at: string;
  evaluations?: Evaluation[];
  average_score?: number;
}

export interface Judge {
  id: string;
  event_id: string;
  name: string;
  email: string;
  designation: string;
  avatar_url: string;
  access_pin: string;
}

export interface Evaluation {
  id: string;
  submission_id: string;
  judge_id: string;
  judge_name?: string;
  criteria_scores: Record<string, number>;
  total_score: number;
  feedback?: string;
  is_locked: boolean;
  updated_at: string;
}

export interface Announcement {
  id: string;
  event_id: string;
  title: string;
  message: string;
  category: 'urgent' | 'schedule' | 'food' | 'general' | 'workshop';
  is_pinned: boolean;
  created_at: string;
}

export interface TeamInvite {
  id: string;
  team_id: string;
  team_name: string;
  participant_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}
