import { io } from 'socket.io-client';

let socket = null;
let connectedToken = null;

export const connectSocket = (token) => {
    if (!token) return;
    if (socket && connectedToken === token && socket.connected) return;

    if (socket) {
        socket.disconnect();
        socket = null;
    }

    connectedToken = token;
    socket = io('http://localhost:8000', {
        auth: { token },
        withCredentials: true,
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        connectedToken = null;
    }
};

export const getSocket = () => socket;