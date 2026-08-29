# EventPulse 360: Smart Event & Hackathon Management Platform

> **A Unified, Real-Time Platform for Conferences, Tech Fests, Competitions, and Hackathons.**  
> Built for the Prompt War 2026 Challenge.

---

## 🌟 1. Executive Summary & Problem Solved

### The Problem
Organizing large-scale tech events currently requires juggling **5–6 disconnected tools**:
- **Registration**: Google Forms / Typeform
- **Attendee Check-in**: Separate scanner apps or paper lists
- **Team Formation**: WhatsApp / Discord chaos
- **Announcements**: Telegram / WhatsApp broadcasts
- **Judging & Evaluation**: Excel sheets / Devpost
- **Leaderboard & Analytics**: Manual calculations & static tables

This fragmentation causes delays, double check-ins, delayed score tallies, and frustration for organizers, participants, and judges.

### The Solution: EventPulse 360
EventPulse 360 consolidates the entire event lifecycle into a **single, interactive, real-time platform** powered by **Supabase PostgreSQL** and **React 19**:
1. **Multi-Event Creation & Management**: Organizers can launch any event type (Tech Conference, Hackathon, Startup Pitch Day, University Fest) with custom tracks, venues, and judging rubrics.
2. **Role-Based Authentication**: Secure authentication gateways for Participants (Email/Ticket ID), Organizers (Master PIN), and Judges (Confidential PIN).
3. **Participant Hub**: Instant 1-click registration, standalone printable/PDF QR ticket pass, smart team matchmaker with skill gap filtering, project submission portal, and live timeline.
4. **Organizer Command Center**: Multi-modal QR check-in terminal (Webcam scanner + Image QR file uploader + rapid manual barcode entry) with &lt;100ms verification and duplicate-entry prevention, real-time push broadcast center with audio alerts, and 1-click CSV export.
5. **Judge Evaluation Portal**: PIN-protected judge dashboard, 5-axis weighted rubric sliders (Innovation, Technical Execution, UI/UX, Presentation, Market Impact), structured feedback notes, and tamper-proof evaluation locking.
6. **Live Stage Arena & Leaderboard**: Animated top-3 podium (Gold/Silver/Bronze) with particle confetti celebrations, track filters, and real-time score recalculation via WebSockets.

---

## 🗄️ 2. Database Schema (Supabase PostgreSQL)

The platform is backed by a relational PostgreSQL database on **Supabase** with Row-Level Security (RLS) and Realtime WebSocket replication:

| Table | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `events` | Global event configuration & tracks | `id`, `title`, `tracks (JSONB)`, `rubrics (JSONB)`, `start_date`, `end_date` |
| `participants` | Attendee profiles & check-in state | `id`, `name`, `email`, `role`, `skills (JSONB)`, `qr_ticket_id`, `is_checked_in`, `checked_in_at`, `team_id` |
| `teams` | Formed squads & recruitment needs | `id`, `name`, `track`, `description`, `needed_roles (JSONB)`, `is_open` |
| `submissions` | Final hackathon / project submissions | `id`, `team_id`, `title`, `tagline`, `description`, `track`, `repo_url`, `live_demo_url`, `video_url`, `deck_url` |
| `judges` | Registered event evaluators | `id`, `name`, `email`, `designation`, `avatar_url`, `access_pin` |
| `evaluations` | Weighted rubric scorecards | `id`, `submission_id`, `judge_id`, `criteria_scores (JSONB)`, `total_score`, `feedback`, `is_locked` |
| `announcements` | Real-time broadcast alerts | `id`, `title`, `message`, `category ('urgent'\|'schedule'\|'food'\|'workshop')`, `is_pinned` |

---

## 🛡️ 3. Security & Data Integrity Guarantees

1. **Unique Collision-Proof QR Tokens**:
   - Each participant is assigned a unique cryptographic ticket code (`EP360-TKT-XXXXXX`).
   - The scanner checks state in Supabase and blocks duplicate entries with exact timestamp tracking.
2. **Judge Authentication & PIN Protection**:
   - Dedicated access PIN verification for judges to prevent unauthorized tampering with evaluations.
3. **Organizer Master PIN Protection**:
   - Organizer dashboard protected with administrative authentication (`admin123`).
4. **Immutable Score Locks**:
   - Once a scorecard is locked, composite unique constraints on `(submission_id, judge_id)` prevent duplicate or corrupted scorecards.
5. **Sanitized Links & XSS Prevention**:
   - All submitted GitHub repos, live demos, and video links are sanitized and strictly validated.
6. **Row Level Security (RLS)**:
   - Supabase RLS policies are enabled across all tables ensuring access governance.

---

## ⚡ 4. Real-Time Synchronization Engine

- **Supabase Realtime Channels (WebSockets)**:
  - When an organizer broadcasts an announcement, all connected participants and judges receive instant toast alerts and audio chimes.
  - When a judge submits or edits a score, the Live Leaderboard updates immediately without requiring a manual page refresh.
  - When an attendee checks in via camera, image file, or manual search, the organizer velocity analytics chart updates dynamically.

---

## 🧪 5. Automated Testing Suite (Vitest)

EventPulse 360 includes 9 unit tests verifying business logic & security:
- **QR Ticket Generation**: Collision-proof entropy & format verification (`EP360-TKT-XXXXXX`).
- **Check-in Security**: Successful entry & duplicate entry blocking.
- **Rubric Scoring**: 100-point 5-axis weight aggregation & multi-judge average computation.
- **Team Matchmaking**: Skill-gap filtering & recommendation accuracy.
- **Leaderboard Accuracy**: Dynamic podium ranking calculations.

```bash
# Run test suite
npm run test
```

---

## 🚀 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```
