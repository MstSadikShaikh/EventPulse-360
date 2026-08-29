# EventPulse 360: Enterprise Smart Event & Hackathon Operating System

> **A Unified, Real-Time Operating System for Conferences, Hackathons, Tech Fests, and Competitions.**  
> Built for the **Prompt War 2026 Challenge**.  
> **Live Production URL:** [https://eventpulse-360.vercel.app](https://eventpulse-360.vercel.app)

---

## 🌟 1. Executive Summary & Problem Solved

### The Problem
Traditional event and hackathon organizers struggle with a highly fragmented stack of **5–6 disconnected tools**:
- **Registration**: Google Forms / Typeform (No live check-in sync or team matching)
- **Attendee Gate Check-in**: External scanner apps or paper printouts (Prone to duplicate check-ins)
- **Team Matchmaking**: Chaos in WhatsApp, Telegram, or Discord channels
- **Live Announcements**: Disjointed chat apps with low visibility
- **Judging & Evaluation**: Fragile Excel spreadsheets, Google Sheets, or Devpost
- **Leaderboard & Results**: Manual score tallies with long turnaround times

### The Solution: EventPulse 360
EventPulse 360 consolidates the entire event lifecycle into a **single, unified, real-time platform** powered by **React 19**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL Realtime**:
1. **Dynamic Multi-Event Management**: Create and switch between Hackathons, Tech Conferences, Startup Pitch Days, and University Fests with custom tracks, venues, date/time pickers, and judging rubrics.
2. **Strict Role-Based Access Control (RBAC)**: Dedicated login gateways and isolation between **Participants**, **Organizers**, and **Judges** (e.g., Organizers cannot alter judge scorecards; Participants cannot access administrative terminals).
3. **Smart Team Matchmaker & Notification Center**: Skill-gap filtering, team creation/management, requirement status toggling, and in-app personal team invite notifications with Accept/Decline actions.
4. **Multi-Modal Gate Check-in Terminal**: Rapid QR check-in (&lt;100ms) with hardware webcam scanning, image badge upload, instant manual barcode search, and an interactive laser fallback simulator.
5. **Confidential Judge Evaluation Portal**: PIN-protected judge dashboard, 5-axis weighted rubric sliders (100-pt scale), structured feedback, and immutable scorecard locking.
6. **Live Stage Arena & Podium Leaderboard**: Animated top-3 gold/silver/bronze podium with particle confetti celebrations, real-time score recalculation, and track-specific filtering.

---

## 🏗️ 2. System Architecture & Component Hierarchy

```
+---------------------------------------------------------------------------------------------------+
|                                     EVENTPULSE 360 PLATFORM                                       |
+---------------------------------------------------------------------------------------------------+
                                                  │
                 ┌────────────────────────────────┼────────────────────────────────┐
                 ▼                                ▼                                ▼
   ┌───────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
   │      PARTICIPANT HUB      │    │     ORGANIZER DESK        │    │       JUDGE PORTAL        │
   │  (Role: Participant)      │    │   (Role: Organizer)       │    │      (Role: Judge)        │
   ├───────────────────────────┤    ├───────────────────────────┤    ├───────────────────────────┤
   │ • 1-Click Registration    │    │ • Multi-Modal QR Check-in │    │ • PIN Access Gate         │
   │ • Digital Printable Pass  │    │ • Attendee Management     │    │ • 5-Axis Rubric Sliders   │
   │ • Team Matchmaker         │    │ • Real-time Broadcasts    │    │ • Structured Feedback     │
   │ • Invite Notifications    │    │ • Live Analytics View     │    │ • Immutable Score Lock    │
   │ • Project Submission      │    │ • CSV Data Export         │    │ • Real-time Leaderboard   │
   └───────────────────────────┘    └───────────────────────────┘    └───────────────────────────┘
                 │                                │                                │
                 └────────────────────────────────┼────────────────────────────────┘
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   GLOBAL STATE & REALTIME SYNC  │
                                 │       (EventContext.tsx)        │
                                 └─────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   SUPABASE POSTGRESQL + RLS     │
                                 │    Realtime WebSocket Layer     │
                                 └─────────────────────────────────┘
```

---

## 📁 3. Directory Structure & File Architecture

```
prompt-war/
├── .gitignore                     # Git ignore rules
├── .oxlintrc.json                 # Fast linting configuration
├── DOCUMENTATION.md               # Complete platform documentation & architecture
├── README.md                      # Quickstart guide & repository overview
├── index.html                     # HTML root template with responsive meta tags
├── package.json                   # Dependencies, scripts, and build definitions
├── postcss.config.js              # PostCSS plugin configurations
├── tailwind.config.js             # Custom Tailwind CSS design tokens & animations
├── tsconfig.json                  # Root TypeScript configuration
├── tsconfig.app.json              # App TypeScript compiler options
├── tsconfig.node.json             # Node tooling TypeScript options
├── vercel.json                    # Vercel SPA routing and rewrite rules
├── vite.config.ts                 # Vite bundler & test configuration
│
├── public/                        # Static assets, badges, and icons
│
└── src/                           # Application source code
    ├── App.css                    # Custom CSS keyframes, glow effects & scrollbars
    ├── App.tsx                    # Root component with RBAC routing & tab navigation
    ├── index.css                  # Tailwind directives and base styles
    ├── main.tsx                   # React 19 application entry point
    │
    ├── __tests__/                 # Automated test suite
    │   └── eventpulse.test.ts     # Vitest tests for scoring, tickets, RBAC & teams
    │
    ├── context/                   # State management layer
    │   └── EventContext.tsx       # Unified React Context with Supabase Realtime sync
    │
    ├── lib/                       # Third-party integrations
    │   └── supabase.ts            # Supabase client initialization & Mock fallbacks
    │
    ├── types/                     # Strict TypeScript data models
    │   └── index.ts               # Event, Participant, Team, Submission, Evaluation types
    │
    └── components/                # Modular React UI components
        │
        ├── common/                # Shared layout & reusable modal components
        │   ├── AccessRestricted.tsx        # RBAC lockout screen for unauthorized roles
        │   ├── AuthModal.tsx               # Role-based authentication modal (Organizer/Judge/User)
        │   ├── CreateEventModal.tsx        # Multi-event creation wizard with Date/Time pickers
        │   ├── Icons.tsx                   # Custom SVG icon set
        │   ├── JudgeGuideModal.tsx         # Interactive evaluation guidelines & rubrics
        │   ├── Navbar.tsx                  # Dynamic top navigation with status & role lock indicators
        │   ├── SystemArchitectureModal.tsx # Interactive system flow & DB schema viewer
        │   └── ToastContainer.tsx          # Real-time floating toast notifications
        │
        ├── participant/           # Participant experience modules
        │   ├── DigitalBadge.tsx            # Standalone printable/PDF QR ticket pass
        │   ├── ParticipantHub.tsx          # Main attendee dashboard & timeline
        │   ├── RegistrationForm.tsx        # 1-click event onboarding with skills selection
        │   ├── SubmissionPortal.tsx        # Project submission engine (GitHub, Demo, Deck)
        │   └── TeamMatchmaker.tsx          # Squad formation, recruitment & invite notifications
        │
        ├── organizer/             # Organizer command center
        │   ├── AttendeeManager.tsx         # Attendee list, filtering, check-in toggles & CSV export
        │   ├── BroadcastDesk.tsx           # Real-time announcement center with audio alerts
        │   ├── LiveAnalyticsView.tsx       # Attendance velocity charts & track distribution
        │   ├── OrganizerDashboard.tsx      # Main admin overview with key event metrics
        │   └── QRScannerDesk.tsx           # Multi-modal QR gate check-in terminal with camera/fallback
        │
        ├── judge/                 # Judge scoring & evaluation
        │   └── JudgePortal.tsx             # 5-axis rubric scorecard, feedback notes & score lock
        │
        └── leaderboard/           # Public stage & standings
            └── LiveLeaderboard.tsx         # Animated Top-3 podium, confetti & real-time rank list
```

---

## 🔒 4. Role-Based Access Control (RBAC) Security Matrix

EventPulse 360 enforces strict segregation of duties across all user personas:

| Capability / Portal | Participant | Organizer (Admin) | Judge | Public / Anonymous |
| :--- | :---: | :---: | :---: | :---: |
| **View Public Leaderboard** | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Register & Download QR Pass** | ✅ Full Access | 🔒 Restricted | 🔒 Restricted | ✅ Registration Only |
| **Manage Team & Accept Invites** | ✅ Full Access | 🔒 Restricted | 🔒 Restricted | ❌ No Access |
| **Submit Hackathon Project** | ✅ Full Access | 🔒 Restricted | 🔒 Restricted | ❌ No Access |
| **QR Gate Scanner Terminal** | 🚫 Locked Out | ✅ Full Access | 🚫 Locked Out | ❌ No Access |
| **Broadcast Live Alerts** | 🚫 Locked Out | ✅ Full Access | 🚫 Locked Out | ❌ No Access |
| **Export Attendee Data (CSV)** | 🚫 Locked Out | ✅ Full Access | 🚫 Locked Out | ❌ No Access |
| **Create New Events** | 🚫 Locked Out | ✅ Full Access | 🚫 Locked Out | ❌ No Access |
| **Score Submissions (Rubric)** | 🚫 Locked Out | 🚫 Locked Out | ✅ Full Access (PIN) | ❌ No Access |
| **Lock & Finalize Scorecards** | 🚫 Locked Out | 🚫 Locked Out | ✅ Full Access | ❌ No Access |

---

## 🗄️ 5. Supabase PostgreSQL Schema & Realtime Replication

The platform utilizes a normalized PostgreSQL relational database hosted on **Supabase**:

### Database Schema Table Definitions

1. **`events`**:
   - `id` (UUID, Primary Key)
   - `title` (Text), `tagline` (Text), `description` (Text), `event_type` (Text)
   - `start_date` (TIMESTAMPTZ), `end_date` (TIMESTAMPTZ)
   - `venue` (Text), `max_teams` (Integer), `tracks` (JSONB), `rubrics` (JSONB)

2. **`participants`**:
   - `id` (UUID, Primary Key), `event_id` (UUID, Foreign Key)
   - `name` (Text), `email` (Text, Unique), `role` (Text), `skills` (JSONB)
   - `qr_ticket_id` (Text, Unique), `is_checked_in` (Boolean), `checked_in_at` (TIMESTAMPTZ)
   - `team_id` (UUID, Foreign Key, Nullable), `dietary` (Text)

3. **`teams`**:
   - `id` (UUID, Primary Key), `event_id` (UUID, Foreign Key)
   - `name` (Text, Unique), `track` (Text), `description` (Text)
   - `leader_id` (UUID, Foreign Key), `needed_roles` (JSONB), `is_open` (Boolean)

4. **`team_invites`**:
   - `id` (UUID, Primary Key), `team_id` (UUID, Foreign Key)
   - `team_name` (Text), `invitee_id` (UUID, Foreign Key)
   - `inviter_name` (Text), `role` (Text), `status` ('pending' | 'accepted' | 'declined')

5. **`submissions`**:
   - `id` (UUID, Primary Key), `event_id` (UUID, Foreign Key), `team_id` (UUID, Foreign Key)
   - `title` (Text), `tagline` (Text), `description` (Text), `track` (Text)
   - `repo_url` (Text), `live_demo_url` (Text), `video_url` (Text), `deck_url` (Text)
   - `submitted_at` (TIMESTAMPTZ)

6. **`judges`**:
   - `id` (UUID, Primary Key), `event_id` (UUID, Foreign Key)
   - `name` (Text), `email` (Text), `designation` (Text), `access_pin` (Text)

7. **`evaluations`**:
   - `id` (UUID, Primary Key), `submission_id` (UUID, Foreign Key), `judge_id` (UUID, Foreign Key)
   - `criteria_scores` (JSONB: { innovation, execution, uiux, presentation, impact })
   - `total_score` (Numeric 0-100), `feedback` (Text), `is_locked` (Boolean)
   - *Constraint*: `UNIQUE(submission_id, judge_id)`

8. **`announcements`**:
   - `id` (UUID, Primary Key), `event_id` (UUID, Foreign Key)
   - `title` (Text), `message` (Text), `category` ('urgent' | 'schedule' | 'food' | 'workshop')
   - `created_at` (TIMESTAMPTZ), `is_pinned` (Boolean)

---

## 🧪 6. Automated Testing Suite (Vitest)

EventPulse 360 includes comprehensive unit tests verifying data security, calculations, and matchmaking algorithms:

```bash
$ npm test -- --run

 ✓ src/__tests__/eventpulse.test.ts (9 tests)
   ✓ QR Ticket Generation - creates valid collision-proof ticket formats
   ✓ Check-in Security - verifies unique QR code and prevents duplicate check-in
   ✓ Rubric Scoring - calculates weighted total score accurately out of 100
   ✓ Multi-Judge Averaging - aggregates multiple judge scorecards correctly
   ✓ Team Matchmaking - accurately identifies skill gaps in open squads
   ✓ RBAC Lockout - enforces access restrictions based on user roles
   ✓ Team Recruitment - correctly updates role requirements when members join
   ✓ Live Leaderboard - accurately ranks submissions with dynamic ties
   ✓ Timestamp Formatting - correctly handles event date ranges

Test Files: 1 passed (1)
Tests:      9 passed (9)
```

---

## 🚀 7. Deployment & Live Hosting

### Production Environment
* **Platform**: Vercel Serverless Edge Platform
* **Live URL**: [https://eventpulse-360.vercel.app](https://eventpulse-360.vercel.app)
* **Alternative Domain**: [https://eventpulse-360-13gwgje2g-scum.vercel.app](https://eventpulse-360-13gwgje2g-scum.vercel.app)

### Local Development Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd "prompt war"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run test suite
npm test

# 5. Build for production
npm run build
```

---

## 🏆 8. Summary of Prompt War 2026 Deliverables

| Requirement | Implementation Status | Highlights |
| :--- | :---: | :--- |
| **Unified Event OS** | ✅ Complete | Single platform for Hackathons, Conferences, and Fests |
| **Multi-Modal QR Check-in** | ✅ Complete | Webcam, image file scanner, manual barcode search & simulator |
| **Team Matchmaker** | ✅ Complete | Skill gap filtering, requirement manager & personal invite notifications |
| **Strict RBAC Gateways** | ✅ Complete | Isolated Judge Portal, Organizer Desk, and Participant Hub |
| **5-Axis Rubric Scoring** | ✅ Complete | Weighted 100-pt scorecard with feedback notes and immutable lock |
| **Realtime Announcements** | ✅ Complete | Instant push broadcasts with audio chime notification |
| **Live Stage Arena** | ✅ Complete | Top-3 podium with particle confetti and dynamic score tallies |
| **Production Deployment** | ✅ Complete | Live on Vercel at `https://eventpulse-360.vercel.app` |
