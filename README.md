# Pulse — Live Synchronized Quiz System

A real-time quiz platform where an admin authors timed questions and runs them
live. Every student sees the **exact same countdown** because the server owns
the clock. Built as an npm-workspaces monorepo.

## How it works

- The **server** is the single source of truth for timing. On each phase
  (question → break → next question) it sets an authoritative `endsAt` timestamp
  and ticks every second over **Socket.IO**, so all players stay in sync.
- Students **can't skip ahead**, **can't change a submitted answer**, and only
  learn whether they were right/wrong **after the question's timer ends**.
- The admin sets, per question: the text, options, correct answer, marks, the
  answer time, and the break time before the next question.

## Tech stack

| Area      | Choice |
|-----------|--------|
| Monorepo  | npm workspaces (`apps/*`, `packages/*`) |
| Frontend  | Next.js (App Router) + React 19 + Tailwind CSS + Framer Motion |
| Realtime  | Socket.IO, mounted on a custom Next.js server (one process) |
| Database  | SQLite via Prisma (a single local file — no Docker) |
| Data fetch| Axios |

## Project layout

```
quiz-system/
├── apps/web/
│   ├── server/            # custom Node server: Next.js + Socket.IO engine
│   │   ├── index.ts       # boots http + next + socket.io
│   │   ├── io.ts          # socket event handlers
│   │   └── room.ts        # authoritative quiz state machine + clock
│   ├── prisma/            # schema, sqlite db, seed
│   └── src/
│       ├── app/           # routes (landing, join, play, admin/*) + API
│       ├── components/    # design system (Button, Modal, TimerRing, ...)
│       ├── features/      # play / admin / control feature modules
│       ├── hooks/         # useCountdown (clock-skew-safe sync)
│       └── lib/           # prisma, auth, axios, validation
└── packages/shared/       # shared types + socket event contracts
```

## Getting started

```bash
npm install              # install all workspaces
npm run db:push          # create the SQLite database
npm run db:seed          # (optional) add a sample quiz — join code: DEMO5
npm run dev              # start everything on http://localhost:3000
```

Open http://localhost:3000

- **Admin:** go to `/admin`, sign in with the password in `apps/web/.env`
  (`ADMIN_PASSWORD`, default `admin123`). Create a quiz, add questions, then
  **Run quiz** to open the control room and hit **Start**.
- **Student:** open `/join` (in another tab/device), enter the join code shown
  in the control room and a name.

## Configuration

Edit `apps/web/.env`:

```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="admin123"     # change me
SESSION_SECRET="..."          # change me (signs the admin cookie)
```

## Production

```bash
npm run build
npm run start                 # serves on PORT (default 3000)
```
