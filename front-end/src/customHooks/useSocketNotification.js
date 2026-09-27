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

    const activeUser = isAdminRoute
        ? (admin || (user?.activeRole === 'admin' || user?.role === 'admin' ? user : null))
        : user;

    const activeToken = isAdminRoute
        ? (adminToken || (user?.activeRole === 'admin' || user?.role === 'admin' ? accessToken : null))
        : accessToken;

    const isCurrentAdmin = isAdminRoute && Boolean(
        admin || activeUser?.activeRole === 'admin' || activeUser?.role === 'admin'
    );

    useEffect(() => {
        if (!activeUser || !activeToken) {
            disconnectSocket();
            return;
        }

        connectSocket(activeToken);

        const socket = getSocket();
        if (!socket) return;


        socket.on('new-task-nearby', (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'worker' && activeUser?.role !== 'worker')) return;

            if (data.urgencyLevel === 'urgent') {
                showWarning(`NEW URGENT task nearby: ${data.taskTitle} at ${data.city} for ${data.amount} rupees`, { autoClose: 6000 });
            } else {
                showInfo(`New task nearby: ${data.taskTitle} at ${data.city} for ${data.amount} rupees`, { autoClose: 6000 });
            }
            dispatch(api.util.invalidateTags(['Worker_Tasks']));
        });


        socket.on('new-bid-added', (data) => {
            if (isCurrentAdmin || (activeUser?.activeRole !== 'poster' && activeUser?.role !== 'poster')) return;
            showInfo(`New bid added for "${data.taskTitle}" for amount : ${data.bidAmount} rupees`, { autoClose: 6000 });
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
            dispatch(api.util.invalidateTags(['Active_Job', 'Earning_Hero_Data', 'Transaction_History', 'Worker_Earnings_Chart', 'Worker_Wallet', 'Worker_Bids', 'Worker_Notifications']));
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
                if (data.notification?.type !== 'referral_reward') {
                    showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                }
                dispatch(api.util.invalidateTags(['Worker_Notifications']));
            }
        });

        socket.on('poster-notification', (data) => {
            if (isCurrentAdmin) return;
            if (activeUser?.activeRole === 'poster' || activeUser?.role === 'poster') {
                if (data.notification?.type !== 'referral_reward') {
                    showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                }
                dispatch(api.util.invalidateTags(['Poster_Notifications', 'Poster_Unread_Count']));
            }
        });

        socket.on('admin-notification', (data) => {
            if (isCurrentAdmin) {
                const type = data.notification?.type;
                const title = (data.notification?.title || data.message || '').toLowerCase();

                // Only show toast notifications for new user registrations and newly posted tasks
                const isNewUser = type === 'signup' || title.includes('user sign up') || title.includes('joined');
                const isNewTask = type === 'new_task' || title.includes('task posted') || title.includes('new task');

                if (isNewUser || isNewTask) {
                    showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                }

                // Invalidate admin queries to update dashboard and table data in real time without toasts
                dispatch(api.util.invalidateTags([
                    'Admin_Notifications',
                    'Admin_Dashboard',
                    'Admin_Tasks',
                    'Admin_Finance_Stats',
                    'Admin_Finance_Transactions',
                    'Users',
                ]));
            }
        });

        socket.on('admin-announcement', (data) => {
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

        socket.on("referral-reward-earned", () => {
            dispatch(api.util.invalidateTags([
                'Referral_Stats',
                'Earning_Hero_Data',
                'Transaction_History',
                'Worker_Notifications',
                'Poster_Notifications',
                'Worker_Wallet',
            ]));
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
