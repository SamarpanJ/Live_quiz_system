import type {
  Participant,
  RoomState,
  LeaderboardRow,
} from "./types";

/** Socket.IO path (kept off Next.js's HMR socket). */
export const SOCKET_PATH = "/realtime";

/** Events the server emits to clients. */
export interface ServerToClientEvents {
  /** Full authoritative room snapshot (on join + every phase transition). */
  state: (state: RoomState) => void;
  /** Per-second countdown for the current phase. Same value for everyone. */
  tick: (payload: { phase: RoomState["phase"]; remainingMs: number; endsAt: number | null }) => void;
  /** Confirmation that a student's answer was locked in. */
  answerAck: (payload: { questionId: string; optionIndex: number }) => void;
  /** Live participant roster (mainly for the admin control room + lobby count). */
  participants: (payload: { count: number; list: Participant[] }) => void;
  /** Live leaderboard pushes (admin control room). */
  leaderboard: (rows: LeaderboardRow[]) => void;
  /** Recoverable error surfaced to the user. */
  errorMsg: (payload: { code: string; message: string }) => void;
  /** Sent right after a successful join so the client can persist its id. */
  joined: (payload: { participantId: string; name: string }) => void;
  /** Admin handshake accepted. */
  adminReady: () => void;
}

/** Events clients send to the server. */
export interface ClientToServerEvents {
  /** Student joins a live room by code (or rejoins with a known id). */
  join: (
    payload: { joinCode: string; name: string; participantId?: string },
    ack: (res: { ok: boolean; participantId?: string; error?: string }) => void,
  ) => void;
  /** Student submits an answer (first one wins; locked thereafter). */
  answer: (
    payload: { questionId: string; optionIndex: number },
    ack: (res: { ok: boolean; error?: string }) => void,
  ) => void;

  /** Admin authenticates onto a quiz's control channel. */
  adminJoin: (
    payload: { quizId: string; token: string },
    ack: (res: { ok: boolean; error?: string }) => void,
  ) => void;
  /** Admin starts the run; the server then auto-drives questions + breaks. */
  adminStart: (ack: (res: { ok: boolean; error?: string }) => void) => void;
  /** Admin force-advances past the current phase. */
  adminSkip: (ack: (res: { ok: boolean; error?: string }) => void) => void;
  /** Admin stops/aborts the run. */
  adminStop: (ack: (res: { ok: boolean; error?: string }) => void) => void;
}
