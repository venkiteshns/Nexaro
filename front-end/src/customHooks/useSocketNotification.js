import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { showInfo } from '../utils/toast';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService';

const useSocketNotification = () => {
    const { user, accessToken } = useSelector((state) => state.auth);
    const { admin, accessToken: adminToken } = useSelector((state) => state.adminAuth);

    const activeUser = user || admin;
    const activeToken = accessToken || adminToken;

    useEffect(() => {
        // Connect for any logged-in user (worker, poster, or admin)
        if (!activeUser || !activeToken) return;

        // Token sent via auth — backend handles room joining (workers only)
        connectSocket(activeToken);

        const socket = getSocket();
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('new-task-nearby', (data) => {
            showInfo(`New task nearby: ${data.taskTitle}`, { autoClose: 6000 });
        });

        return () => {
            disconnectSocket();
        };

    }, [activeUser, activeToken]);
};

export default useSocketNotification;
