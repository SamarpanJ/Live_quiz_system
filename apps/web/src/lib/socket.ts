import { io, type Socket } from "socket.io-client";
import {
  SOCKET_PATH,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@quiz/shared";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocket(): AppSocket {
  // Default transports ("polling" then auto-upgrade to "websocket") are the
  // most reliable behind dev servers / proxies and never stall on connect.
  return io({
    path: SOCKET_PATH,
    autoConnect: true,
  });
}

const PID_PREFIX = "pulse:pid:";

export function getStoredParticipantId(joinCode: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(PID_PREFIX + joinCode.toUpperCase()) ?? undefined;
}

export function storeParticipantId(joinCode: string, id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PID_PREFIX + joinCode.toUpperCase(), id);
}
