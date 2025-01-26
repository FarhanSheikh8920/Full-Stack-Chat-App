import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Used to store online users
const userSocketMap = {}; // { userId: socketId }

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  
  // Validate userId
  if (userId) {
    userSocketMap[userId] = socket.id;

    // Notify all clients of the updated online users
    io.emit("getonlineUsers", Object.keys(userSocketMap));
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Find and remove the disconnected user
    const disconnectedUserId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
    }

    // Notify remaining clients of the updated online users
    io.emit("getonlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
