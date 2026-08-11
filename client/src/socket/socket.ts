import { io } from 'socket.io-client';

export const socket = io('http://localhost:9025');

socket.on('connect', () => {
  console.log('SOCKET OK:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('SOCKET ERROR:', error.message);
});