import type { Server } from "socket.io";
import {
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@quiz/shared";
import { verifySessionToken } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";
import { RoomManager, type SocketData } from "./room";

type IO = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

export function registerSocketHandlers(io: IO) {
  const manager = new RoomManager(io);

  io.on("connection", (socket) => {
    // ---- student join --------------------------------------------------
    socket.on("join", async ({ joinCode, name, participantId }, ack) => {
      try {
        const code = (joinCode || "").trim().toUpperCase();
        const cleanName = (name || "").trim().slice(0, 40);
        if (!code) return ack({ ok: false, error: "Enter a join code." });
        if (!cleanName) return ack({ ok: false, error: "Enter your name." });

        const room = await manager.findByJoinCode(code);
        if (!room) return ack({ ok: false, error: "No quiz found for that code." });

        // Reuse an existing participant id (rejoin) when valid, else create.
        let pid = participantId;
        if (pid) {
          const existing = await prisma.participant.findFirst({
            where: { id: pid, quizId: room.quizId },
          });
          if (!existing) pid = undefined;
        }
        if (!pid) {
          const created = await prisma.participant.create({
            data: { quizId: room.quizId, name: cleanName },
          });
          pid = created.id;
        } else {
          await prisma.participant.update({ where: { id: pid }, data: { name: cleanName } });
        }

        socket.data.participantId = pid;
        socket.data.quizId = room.quizId;
        socket.data.name = cleanName;
        socket.join(room.quizId);

        await room.addParticipant(pid, cleanName);
        ack({ ok: true, participantId: pid });
        socket.emit("joined", { participantId: pid, name: cleanName });
        await room.emitStateTo(socket.id, pid);
        await room.emitParticipants();
      } catch (err) {
        console.error("join error", err);
        ack({ ok: false, error: "Could not join. Try again." });
      }
    });

    // ---- student answer ------------------------------------------------
    socket.on("answer", async ({ questionId, optionIndex }, ack) => {
      const pid = socket.data.participantId;
      const quizId = socket.data.quizId;
      if (!pid || !quizId) return ack({ ok: false, error: "You are not in a quiz." });
      const room = manager.get(quizId);
      if (!room) return ack({ ok: false, error: "Quiz is not active." });

      const res = await room.submitAnswer(pid, questionId, optionIndex);
      if (res.ok) socket.emit("answerAck", { questionId, optionIndex });
      ack(res);
    });

    // ---- admin handshake -----------------------------------------------
    socket.on("adminJoin", async ({ quizId, token }, ack) => {
      if (!verifySessionToken(token)) return ack({ ok: false, error: "Not authorized." });
      const room = await manager.getOrLoad(quizId);
      if (!room) return ack({ ok: false, error: "Quiz not found." });

      socket.data.isAdmin = true;
      socket.data.quizId = quizId;
      socket.join(quizId);
      ack({ ok: true });
      socket.emit("adminReady");
      await room.emitStateTo(socket.id);
      await room.emitParticipants();
    });

    const requireAdmin = () => {
      const quizId = socket.data.quizId;
      if (!socket.data.isAdmin || !quizId) return null;
      return manager.get(quizId) ?? null;
    };

    socket.on("adminStart", async (ack) => {
      const room = requireAdmin();
      if (!room) return ack({ ok: false, error: "Not authorized." });
      ack(await room.start());
    });

    socket.on("adminSkip", async (ack) => {
      const room = requireAdmin();
      if (!room) return ack({ ok: false, error: "Not authorized." });
      ack(await room.skip());
    });

    socket.on("adminStop", async (ack) => {
      const room = requireAdmin();
      if (!room) return ack({ ok: false, error: "Not authorized." });
      ack(await room.stop());
    });

    // ---- disconnect ----------------------------------------------------
    socket.on("disconnect", async () => {
      const pid = socket.data.participantId;
      const quizId = socket.data.quizId;
      if (!pid || !quizId) return;
      const room = manager.get(quizId);
      if (!room) return;
      // Only drop from roster if this was their last open socket.
      const sockets = await io.in(quizId).fetchSockets();
      const stillHere = sockets.some((s) => s.data.participantId === pid);
      if (!stillHere) {
        room.removeParticipant(pid);
        await room.emitParticipants();
      }
    });
  });
}
