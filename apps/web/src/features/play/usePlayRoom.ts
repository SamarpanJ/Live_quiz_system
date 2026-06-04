"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RoomState } from "@quiz/shared";
import {
  createSocket,
  getStoredParticipantId,
  storeParticipantId,
  type AppSocket,
} from "@/lib/socket";

export type JoinStatus = "connecting" | "joining" | "joined" | "error";

interface PlayRoom {
  status: JoinStatus;
  error: string | null;
  state: RoomState | null;
  submit: (optionIndex: number) => void;
  pendingOption: number | null;
  participantId: string | null;
}

export function usePlayRoom(joinCode: string, name: string): PlayRoom {
  const [status, setStatus] = useState<JoinStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<RoomState | null>(null);
  const [pendingOption, setPendingOption] = useState<number | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const socketRef = useRef<AppSocket | null>(null);
  const stateRef = useRef<RoomState | null>(null);

  useEffect(() => {
    if (!joinCode || !name) return;
    const socket = createSocket();
    socketRef.current = socket;

    const doJoin = () => {
      setStatus("joining");
      socket.emit(
        "join",
        { joinCode, name, participantId: getStoredParticipantId(joinCode) },
        (res) => {
          if (res.ok && res.participantId) {
            storeParticipantId(joinCode, res.participantId);
            setParticipantId(res.participantId);
            setStatus("joined");
            setError(null);
          } else {
            setStatus("error");
            setError(res.error ?? "Could not join the quiz.");
          }
        },
      );
    };

    socket.on("connect", doJoin);
    socket.on("state", (s) => {
      stateRef.current = s;
      setState(s);
      // Reset the pending highlight once a new question opens.
      setPendingOption((prev) => (s.question && !s.mySubmission ? prev : null));
    });
    socket.on("errorMsg", ({ message }) => setError(message));
    socket.on("disconnect", () => {
      if (status === "joined") setStatus("connecting");
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinCode, name]);

  const submit = useCallback((optionIndex: number) => {
    const socket = socketRef.current;
    const current = stateRef.current;
    if (!socket || !current?.question) return;
    setPendingOption(optionIndex);
    socket.emit("answer", { questionId: current.question.id, optionIndex }, (res) => {
      if (!res.ok) {
        setPendingOption(null);
        if (res.error) setError(res.error);
      }
    });
  }, []);

  return { status, error, state, submit, pendingOption, participantId };
}
