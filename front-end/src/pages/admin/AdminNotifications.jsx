import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/Slices/AdminSlice";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import SystemAlertsCard from "../../components/Admin/Notifications/SystemAlertsCard";
import SendAnnouncementCard from "../../components/Admin/Notifications/SendAnnouncementCard";
import RecentlySentAnnouncements from "../../components/Admin/Notifications/RecentlySentAnnouncements";
import {
  useAdminGetNotificationsQuery,
  useAdminMarkAllNotificationsReadMutation,
  useAdminMarkNotificationReadMutation,
  useAdminSendAnnouncementMutation,
  useAdminGetRecentAnnouncementsQuery,
} from "../../store/services/adminApi";
import { api } from "../../store/services/api";
import { getSocket } from "../../services/socketService";
import { showSuccess, showError, showInfo } from "../../utils/toast";

/**
 * AdminNotifications Page
 * Route: /admin/notifications
 * Theme: Green and White aesthetic for Nexaro Admin Portal (#0A6E5C)
 */
export default function AdminNotifications() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  // Sync active sidebar state
  useEffect(() => {
    dispatch(setActivePage("Notifications"));
  }, [dispatch]);

  // Real-time socket listener for incoming platform alerts
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewAlert = (data) => {
      showInfo(data?.message || "New system notification received", { autoClose: 6000 });
      dispatch(api.util.invalidateTags(["Admin_Notifications"]));
    };

    socket.on("admin-notification", handleNewAlert);
    return () => {
      socket.off("admin-notification", handleNewAlert);
    };
  }, [dispatch]);

  // Queries and mutations
  const {
    data: notifResponse,
    isLoading: notifLoading,
  } = useAdminGetNotificationsQuery({
    page: currentPage,
    limit: 6,
  });

  const {
    data: recentResponse,
    isLoading: recentLoading,
  } = useAdminGetRecentAnnouncementsQuery(5);

  const [markAllReadApi, { isLoading: isMarkingAll }] = useAdminMarkAllNotificationsReadMutation();
  const [markOneReadApi] = useAdminMarkNotificationReadMutation();
  const [sendAnnouncementApi, { isLoading: isSending }] = useAdminSendAnnouncementMutation();

  const notifications = notifResponse?.notifications || [];
  const totalPages = notifResponse?.totalPages || 1;
  const unreadCount = notifResponse?.unreadCount || 0;
  const announcements = recentResponse?.announcements || [];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllReadApi().unwrap();
      showSuccess("All system alerts marked as read");
    } catch (err) {
      showError(err?.data?.message || "Failed to mark alerts as read");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markOneReadApi(id).unwrap();
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  const handleSendAnnouncement = async (payload) => {
    try {
      await sendAnnouncementApi(payload).unwrap();
      showSuccess(`Broadcast sent to ${payload.targetAudience}!`);
      return true;
    } catch (err) {
      showError(err?.data?.message || "Failed to send announcement");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* SIDEBAR NAVIGATION */}
      <AdminNavBar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-5">
          {/* Top Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Notifications & Announcements
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage system alerts and user broadcasts
              </p>
            </div>
          </div>

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
            {/* Left Column: System Alerts (7 cols) */}
            <section
              aria-label="System Alerts"
              className="lg:col-span-7 xl:col-span-7"
            >
              <SystemAlertsCard
                notifications={notifications}
                isLoading={notifLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                unreadCount={unreadCount}
                onPageChange={handlePageChange}
                onMarkAllAsRead={handleMarkAllAsRead}
                onMarkRead={handleMarkRead}
                isMarkingAll={isMarkingAll}
              />
            </section>

            {/* Right Column: Send Announcement + Recently Sent (5 cols) */}
            <section
              aria-label="Broadcast Announcements"
              className="lg:col-span-5 xl:col-span-5 space-y-4"
            >
              <SendAnnouncementCard
                onSend={handleSendAnnouncement}
                isSending={isSending}
              />

              <RecentlySentAnnouncements
                announcements={announcements}
                isLoading={recentLoading}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
