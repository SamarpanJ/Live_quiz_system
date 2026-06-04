"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LeaderboardRow, Participant, RoomState } from "@quiz/shared";
import { api, apiError } from "@/lib/axios";
import { createSocket, type AppSocket } from "@/lib/socket";

interface ControlRoom {
  connected: boolean;
  error: string | null;
  state: RoomState | null;
  participants: Participant[];
  leaderboard: LeaderboardRow[];
  start: () => Promise<void>;
  skip: () => Promise<void>;
  stop: () => Promise<void>;
  busy: boolean;
}

export function useControlRoom(quizId: string): ControlRoom {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<RoomState | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [busy, setBusy] = useState(false);
  const socketRef = useRef<AppSocket | null>(null);

  useEffect(() => {
    let active = true;
    const socket = createSocket();
    socketRef.current = socket;

    const handshake = async () => {
      try {
        const { data } = await api.get<{ token: string }>("/admin/socket-token");
        if (!active) return;
        socket.emit("adminJoin", { quizId, token: data.token }, (res) => {
          if (res.ok) {
            setConnected(true);
            setError(null);
          } else {
            setError(res.error ?? "Could not connect to the live room.");
          }
        });
      } catch (err) {
        setError(apiError(err, "Session expired. Please log in again."));
      }
    };

    socket.on("connect", handshake);
    socket.on("disconnect", () => setConnected(false));
    socket.on("state", setState);
    socket.on("participants", ({ list }) => setParticipants(list));
    socket.on("leaderboard", setLeaderboard);
    socket.on("errorMsg", ({ message }) => setError(message));

    return () => {
      active = false;
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [quizId]);

  const command = useCallback(
    (event: "adminStart" | "adminSkip" | "adminStop") =>
      new Promise<void>((resolve) => {
        const socket = socketRef.current;
        if (!socket) return resolve();
        setBusy(true);
        socket.emit(event, (res) => {
          setBusy(false);
          if (!res.ok && res.error) setError(res.error);
          resolve();
        });
      }),
    [],
  );

  return {
    connected,
    error,
    state,
    participants,
    leaderboard,
    start: () => command("adminStart"),
    skip: () => command("adminSkip"),
    stop: () => command("adminStop"),
    busy,
  };
}
