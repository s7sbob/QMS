import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000', {
const socket = io(process.env.Development_BackEnd_Url, {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
