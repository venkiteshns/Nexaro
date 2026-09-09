import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { showError, showInfo, showSuccess, showWarning } from '../utils/toast';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService';
import { useDispatch } from 'react-redux';
import { api } from '../store/services/api';

const useSocketNotification = () => {
    const dispatch = useDispatch();
    const [paymentModalData, setPaymentModalData] = useState(null);

    const { user, accessToken } = useSelector((state) => state.auth);
    const { admin, accessToken: adminToken } = useSelector((state) => state.adminAuth);

    const activeUser = user || admin;
    const activeToken = accessToken || adminToken;

    useEffect(() => {
        if (!activeUser || !activeToken) return;

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
            dispatch(api.util.invalidateTags(['Worker_Tasks', 'Worker_Notifications']));
        });


        socket.on('new-bid-added', (data) => {
            showInfo(`New bid added for : ${data.taskTitle}  for ${data.bidAmount} rupees`, { autoClose: 6000 });
            dispatch(api.util.invalidateTags(['Poster_Tasks', 'Poster_Bids', 'Poster_Notifications', 'Poster_Unread_Count']));
        });

        socket.on("bid-accepted", (data) => {
            showInfo(`Your bid has been accepted for task : ${data.taskTitle} for amount : ${data.bidAmount} rupees`)
            dispatch(api.util.invalidateTags(['Worker_Bids', 'Active_Job', 'Worker_Tasks', 'Worker_Notifications']));
        })

        socket.on("bid-rejected", (data) => {
            showError(`Your bid has been rejected for task : ${data.taskTitle} for amount : ${data.bidAmount} rupees`)
            dispatch(api.util.invalidateTags(['Worker_Bids', 'Active_Job', 'Worker_Tasks', 'Worker_Notifications']));
        })

        socket.on('task_updated', () => {
            dispatch(api.util.invalidateTags(['Worker_Tasks', "Task_for_bid"]));
        })

        socket.on("task-update", (data) => {
            if (data.update === "completed") {
                showSuccess(`Task : ${data.taskTitle} has been completed`)
            }
            else {
                showInfo(`Task : ${data.taskTitle} has been updated with progress ${data.update}`)
            }
            dispatch(api.util.invalidateTags(["Poster_Task_Progress", "Poster_Notifications", "Poster_Unread_Count"]));
        })

        socket.on('payment-received', (data) => {
            setPaymentModalData(data);
            dispatch(api.util.invalidateTags(['Active_Job', 'Worker_Earnings', 'Worker_Wallet', "Worker_Bids", 'Worker_Notifications']));
        });

        socket.on('withdrawal-initiated', (data) => {
            showSuccess(data.message || "Your payment has been initiated and will reflect in your account within 48 hours.", { autoClose: 7000 });
            dispatch(api.util.invalidateTags(['Earning_Hero_Data', 'Transaction_History', 'Worker_Earnings_Chart']));
        });

        socket.on('withdrawal-status-updated', (data) => {
            if (data.status === 'completed') {
                showSuccess(data.message || "Your withdrawal has been completed by PayPal!");
            } else if (data.status === 'failed') {
                showError(data.message || "Your withdrawal failed and the balance was refunded.");
            }
            dispatch(api.util.invalidateTags(['Earning_Hero_Data', 'Transaction_History', 'Worker_Earnings_Chart']));
        });

        socket.on('worker-notification', (data) => {
            if (user?.activeRole === 'worker' || user?.role === 'worker') {
                showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                dispatch(api.util.invalidateTags(['Worker_Notifications']));
            }
        });

        socket.on('poster-notification', (data) => {
            if (user?.activeRole === 'poster' || user?.role === 'poster') {
                showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                dispatch(api.util.invalidateTags(['Poster_Notifications', 'Poster_Unread_Count']));
            }
        });

        socket.on('admin-notification', (data) => {
            if (admin) {
                showInfo(data.message || `${data.notification?.title}: ${data.notification?.description}`, { autoClose: 6000 });
                dispatch(api.util.invalidateTags(['Admin_Notifications']));
            }
        });

        socket.on('admin-announcement', (data) => {
            showInfo(`📢 ${data.title}: ${data.message}`, { autoClose: 9000 });
            dispatch(api.util.invalidateTags(['Worker_Notifications', 'Poster_Notifications', 'Poster_Unread_Count']));
        });

        return () => {
            disconnectSocket();
        };

    }, [activeUser, activeToken, dispatch]);

    return {
        paymentModalData,
        closePaymentModal: () => setPaymentModalData(null),
    };
};

export default useSocketNotification;
