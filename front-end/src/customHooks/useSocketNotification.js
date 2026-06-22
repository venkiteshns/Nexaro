import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { showError, showInfo, showSuccess, showWarning } from '../utils/toast';
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

        socket.on("bid-accepted", (data) => {
            showInfo(`Your bid has been accepted for task : ${data.taskTitle} for amount : ${data.bidAmount} rupees`)
            dispatch(api.util.invalidateTags(['Worker_Bids', 'Active_Job']));
        })

        socket.on("bid-rejected", (data) => {
            showError(`Your bid has been rejected for task : ${data.taskTitle} for amount : ${data.bidAmount} rupees`)
            dispatch(api.util.invalidateTags(['Worker_Bids', 'Active_Job']));
        })

        socket.on("task-update", (data) => {
            if (data.update === "completed") {
                showSuccess(`Task : ${data.taskTitle} has been completed`)
            }
            else {
                showInfo(`Task : ${data.taskTitle} has been updated with progress ${data.update}`)
            }
            dispatch(api.util.invalidateTags(["Poster_Task_Progress"]));
        })

        return () => {
            disconnectSocket();
        };

    }, [activeUser, activeToken]);
};

export default useSocketNotification;
