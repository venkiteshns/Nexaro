import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { showError, showInfo, showSuccess, showWarning } from '../utils/toast';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService';
import { api } from '../store/services/api';

const useSocketNotification = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [paymentModalData, setPaymentModalData] = useState(null);

    const { user, accessToken } = useSelector((state) => state.auth);
    const { admin, accessToken: adminToken } = useSelector((state) => state.adminAuth);

    const isAdminRoute = location.pathname.startsWith('/admin');
    const isDedicatedAdmin = !user && Boolean(admin);
    const isCurrentAdmin = isAdminRoute || isDedicatedAdmin || user?.activeRole === 'admin' || user?.role === 'admin';

    // If currently on an admin route or logged in as dedicated admin, use admin credentials; otherwise user credentials
    const activeUser = (isAdminRoute && admin) ? admin : (user || admin);
    const activeToken = (isAdminRoute && adminToken) ? adminToken : (accessToken || adminToken);

    useEffect(() => {
        if (!activeUser || !activeToken) return;

        connectSocket(activeToken);

        const socket = getSocket();
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('new-task-nearby', (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'worker' && activeUser?.role !== 'worker')) return;

            if (data.urgencyLevel === 'urgent') {
                showWarning(`NEW URGENT task nearby: ${data.taskTitle} at ${data.city} for ${data.amount} rupees`, { autoClose: 6000 });
            } else {
                showInfo(`New task nearby: ${data.taskTitle} at ${data.city} for ${data.amount} rupees`, { autoClose: 6000 });
            }
            dispatch(api.util.invalidateTags(['Worker_Tasks']));
        });


        socket.on('new-bid-added', () => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'poster' && activeUser?.role !== 'poster')) return;

            // Silently invalidate data so task & bid lists refresh without showing duplicate toast
            dispatch(api.util.invalidateTags(['Poster_Tasks', 'Poster_Bids']));
        });

        socket.on("bid-accepted", (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'worker' && activeUser?.role !== 'worker')) return;

            showInfo(`Your bid has been accepted for task : ${data.taskTitle} for amount : ${data.bidAmount} rupees`);
            dispatch(api.util.invalidateTags(['Worker_Bids', 'Active_Job', 'Worker_Tasks']));
        });

        socket.on("bid-rejected", (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'worker' && activeUser?.role !== 'worker')) return;

            showError(`Your bid has been rejected for task : ${data.taskTitle} for amount : ${data.bidAmount} rupees`);
            dispatch(api.util.invalidateTags(['Worker_Bids', 'Active_Job', 'Worker_Tasks']));
        });

        socket.on('task_updated', () => {
            if (isCurrentAdmin) return;
            dispatch(api.util.invalidateTags(['Worker_Tasks', "Task_for_bid"]));
        });

        socket.on("task-update", (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'poster' && activeUser?.role !== 'poster')) return;

            if (data.update === "completed") {
                showSuccess(`Task : ${data.taskTitle} has been completed`);
            } else {
                showInfo(`Task : ${data.taskTitle} has been updated with progress ${data.update}`);
            }
            dispatch(api.util.invalidateTags(["Poster_Task_Progress"]));
        });

        socket.on('payment-received', (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'worker' && activeUser?.role !== 'worker')) return;

            setPaymentModalData(data);
            dispatch(api.util.invalidateTags(['Active_Job', 'Worker_Earnings', 'Worker_Wallet', "Worker_Bids", 'Worker_Notifications']));
        });

        socket.on('withdrawal-initiated', (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'worker' && activeUser?.role !== 'worker')) return;

            showSuccess(data.message || "Your payment has been initiated and will reflect in your account within 48 hours.", { autoClose: 7000 });
            dispatch(api.util.invalidateTags(['Earning_Hero_Data', 'Transaction_History', 'Worker_Earnings_Chart']));
        });

        socket.on('withdrawal-status-updated', (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'worker' && activeUser?.role !== 'worker')) return;

            if (data.status === 'completed') {
                showSuccess(data.message || "Your withdrawal has been completed by PayPal!");
            } else if (data.status === 'failed') {
                showError(data.message || "Your withdrawal failed and the balance was refunded.");
            }
            dispatch(api.util.invalidateTags(['Earning_Hero_Data', 'Transaction_History', 'Worker_Earnings_Chart']));
        });

        socket.on('worker-notification', (data) => {
            if (isCurrentAdmin) return;
            if (activeUser?.activeRole === 'worker' || activeUser?.role === 'worker') {
                showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                dispatch(api.util.invalidateTags(['Worker_Notifications']));
            }
        });

        socket.on('poster-notification', (data) => {
            if (isCurrentAdmin) return;
            if (activeUser?.activeRole === 'poster' || activeUser?.role === 'poster') {
                showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                dispatch(api.util.invalidateTags(['Poster_Notifications', 'Poster_Unread_Count']));
            }
        });

        socket.on('admin-notification', (data) => {
            if (isCurrentAdmin) {
                showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                dispatch(api.util.invalidateTags(['Admin_Notifications']));
            }
        });

        socket.on('admin-announcement', (data) => {
            // NEVER notify admin users of announcements (announcements are for users, not admin)
            if (isCurrentAdmin) return;

            const audience = (data?.targetAudience || 'ALL USERS').trim().toUpperCase();
            const currentRole = activeUser?.activeRole || activeUser?.role;

            const isForPoster = audience === 'POSTERS' || audience === 'POSTER' || audience === 'ALL USERS' || audience === 'ALL';
            const isForWorker = audience === 'WORKERS' || audience === 'WORKER' || audience === 'ALL USERS' || audience === 'ALL';

            if (currentRole === 'poster' && isForPoster) {
                showInfo(`📢 ${data.title}: ${data.message}`, { autoClose: 9000 });
                dispatch(api.util.invalidateTags(['Poster_Notifications', 'Poster_Unread_Count']));
            } else if (currentRole === 'worker' && isForWorker) {
                showInfo(`📢 ${data.title}: ${data.message}`, { autoClose: 9000 });
                dispatch(api.util.invalidateTags(['Worker_Notifications']));
            }
        });

        return () => {
            disconnectSocket();
        };

    }, [activeUser, activeToken, isCurrentAdmin, dispatch]);

    return {
        paymentModalData,
        closePaymentModal: () => setPaymentModalData(null),
    };
};

export default useSocketNotification;
