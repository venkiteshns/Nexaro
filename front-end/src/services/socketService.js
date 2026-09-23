import { io } from 'socket.io-client';

let socket = null;
let connectedToken = null;

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/');

export const connectSocket = (token) => {
    if (!token) return;
    if (socket && connectedToken === token && socket.connected) return;

    if (socket) {
        socket.disconnect();
        socket = null;
    }

    connectedToken = token;
    socket = io(SOCKET_URL, {
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