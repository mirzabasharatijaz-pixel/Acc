import { NextRequest } from "next/server";
import { Server } from "socket.io";

const ioHandler = (req: NextRequest) => {
  // This route establishes a singleton Socket.IO server for chat notifications.
  // In production deploy, mount once per server process.
  if (!(global as any).io) {
    const io = new Server(3001, { cors: { origin: "*" } });
    (global as any).io = io;
    io.on("connection", (socket) => {
      socket.on("join", (room) => socket.join(room));
      socket.on("message", (payload) => {
        io.to(payload.room).emit("message", payload);
      });
    });
  }
  return new Response("Socket initialized", { status: 200 });
};

export { ioHandler as GET, ioHandler as POST };
