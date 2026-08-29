# EventPulse 360: Smart Event & Hackathon Management Platform

[![Deploy with Vercel](https://vercel.com/button)](https://eventpulse-360.vercel.app)
[![Live Production URL](https://img.shields.io/badge/Live-eventpulse--360.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://eventpulse-360.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-9%2F9%20Passing-10b981?style=for-the-badge&logo=vitest)](https://eventpulse-360.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

> **A Unified, Real-Time Operating System for Conferences, Hackathons, Tech Fests, and Competitions.**  
> Built for the **Prompt War 2026 Challenge**.

---

## 🌐 Live Demo & Deployment

* 🚀 **Production URL:** [https://eventpulse-360.vercel.app](https://eventpulse-360.vercel.app)
* 📋 **Complete System Documentation & Architecture:** [DOCUMENTATION.md](./DOCUMENTATION.md)

---

## ✨ Key Features

1. **Multi-Event Dynamic Creation Engine**: Launch Tech Conferences, Hackathons, or Pitch Days with custom tracks, date/time pickers, and judging rubrics.
2. **Strict Role-Based Access Control (RBAC)**: Isolated dashboards and permission gates for **Participants**, **Organizers**, and **Judges**.
3. **Smart Team Matchmaker & Recruitment Hub**: Skill gap filtering, squad creation, requirement updates, and personal in-app team invite notifications with Accept/Decline actions.
4. **Multi-Modal Gate Check-in Terminal**: Fast (<100ms) QR check-in supporting live camera scanning, ticket image upload, manual barcode search, and interactive laser fallback simulation.
5. **Confidential Judge Evaluation Portal**: PIN-protected judge dashboard, 5-axis weighted rubric scoring (100-pt scale), qualitative feedback notes, and immutable score locks.
6. **Live Stage Arena & Dynamic Leaderboard**: Animated Top-3 gold/silver/bronze podium with particle confetti celebrations and real-time score recalculation.
7. **Real-Time Push Broadcast Center**: Instant organizer announcement broadcast with audio alerts and category filtering.

---

## 🏗️ System Architecture Overview

```
                        ┌─────────────────────────────────────┐
                        │      EVENTPULSE 360 APPLICATION     │
                        └──────────────────┬──────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐              ┌──────────────────┐
│ PARTICIPANT HUB  │             │  ORGANIZER DESK  │              │   JUDGE PORTAL   │
│  (Registration,  │             │ (Gate Scanner,   │              │ (5-Axis Rubric,  │
│ QR Pass, Teams,  │             │  Broadcasts,     │              │  Score Locking,  │
│  Submissions)    │             │   Analytics)     │              │   Evaluations)   │
└────────┬─────────┘             └────────┬─────────┘              └────────┬─────────┘
         │                                │                                 │
         └────────────────────────────────┼─────────────────────────────────┘
                                          ▼
                         ┌──────────────────────────────────┐
                         │   GLOBAL STATE & REALTIME SYNC   │
                         │       (EventContext.tsx)         │
                         └────────────────┬─────────────────┘
                                          │
                                          ▼
                         ┌──────────────────────────────────┐
                         │    SUPABASE POSTGRESQL + RLS     │
                         │     Realtime WebSocket Feed      │
                         └──────────────────────────────────┘
```

---

## 📁 Repository Directory Structure

```
├── DOCUMENTATION.md               # In-depth architectural & technical documentation
├── README.md                      # Quickstart guide & repository overview
├── vercel.json                    # Vercel SPA routing configuration
├── package.json                   # Project scripts and dependencies
│
└── src/
    ├── App.tsx                    # Root routing, role management, and tab views
    ├── __tests__/                 # Vitest automated test suite (9 passing tests)
    ├── context/                   # Global React context with Supabase realtime sync
    ├── lib/                       # Supabase client & fallback configurations
    ├── types/                     # TypeScript type definitions
    │
    └── components/
        ├── common/                # Navbar, AuthModal, CreateEventModal, Toasts
        ├── participant/           # DigitalBadge, TeamMatchmaker, SubmissionPortal
        ├── organizer/             # QRScannerDesk, BroadcastDesk, AttendeeManager
        ├── judge/                 # JudgePortal, 5-axis rubric scorecard
        └── leaderboard/           # LiveLeaderboard, Top-3 animated podium
```

---

## 🚀 Quickstart & Local Development

```bash
# 1. Clone repository
git clone <your-repo-url>
cd "prompt war"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Build production bundle
npm run build
```

---

## 🧪 Testing

```bash
npm test -- --run
```
EventPulse 360 includes 9 unit tests verifying ticket generation, check-in security, rubric scoring, RBAC lockout, and team matchmaking algorithms.

---

## 📄 License
MIT License. Built for the Prompt War 2026 Challenge.
