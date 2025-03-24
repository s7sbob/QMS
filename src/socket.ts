import { io } from 'socket.io-client';

const socket = io("http://localhost:3000", {
// const socket = io('https://qualitylead-qms.duckdns.org', {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
