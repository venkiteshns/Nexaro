import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { showInfo, showWarning } from '../utils/toast';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService';
import { useDispatch } from 'react-redux';
import { api } from '../store/services/api';

const useSocketNotification = () => {
    const dispatch = useDispatch();

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
            console.log(data.urgencyLevel);

            if (data.urgencyLevel === 'urgent') {
                showWarning(`NEW URGENT task nearby: ${data.taskTitle} at ${data.city} for ${data.amount} rupees`, { autoClose: 6000 });
            } else {
                showInfo(`New task nearby: ${data.taskTitle} at ${data.city} for ${data.amount} rupees`, { autoClose: 6000 });
            }
            dispatch(api.util.invalidateTags(['Worker_Tasks']));
        });


        socket.on('new-bid-added', (data) => {

            showInfo(`New bid added for : ${data.taskTitle}  for ${data.bidAmount} rupees`, { autoClose: 6000 });

            dispatch(api.util.invalidateTags(['Poster_Tasks']));

        });

        // io.to(`user:${posterId}`).emit('new-bid-added', {
        //     taskId,
        //     taksTitle: isTask[0].title,
        //     bidAmount,
        //     status: "pending"
        // })

        return () => {
            disconnectSocket();
        };

    }, [activeUser, activeToken]);
};

export default useSocketNotification;
