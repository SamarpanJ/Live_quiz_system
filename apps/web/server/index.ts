import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import {
  SOCKET_PATH,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@quiz/shared";
import { registerSocketHandlers } from "./io";
import type { SocketData } from "./room";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "localhost";
const port = Number(process.env.PORT || 3000);

async function main() {
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  await app.prepare();

  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
  >(httpServer, {
    path: SOCKET_PATH,
    // Same-origin in this single-app setup; permissive CORS is harmless locally.
    cors: { origin: true, credentials: true },
  });

  registerSocketHandlers(io);

  httpServer.listen(port, () => {
    console.log(`\n  ▸ Quiz system ready on http://${hostname}:${port}`);
    console.log(`  ▸ Realtime socket mounted at ${SOCKET_PATH}\n`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
