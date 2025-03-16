// src/socket.ts
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// إنشاء الاتصال مع السيرفر
const socket: Socket = io(SOCKET_URL, {
  query: {
    token: Cookies.get("token") || ""
  },
  transports: ["websocket"],
  reconnectionAttempts: 5,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Socket connected, id:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;
