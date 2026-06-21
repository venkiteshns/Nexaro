import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
    if (!token || socket) return; // prevent duplicate connections
    socket = io('http://localhost:8000', {
        auth: { token },
        withCredentials: true,
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;