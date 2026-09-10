import React from "react";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

/**
 * RecentSignupsCard Component
 * Displays latest 5 platform signups with user initials, role badges, and relative join time
 * White and Green Nexaro theme
 */
const RecentSignupsCard = ({ signups = [], isLoading = false }) => {
  // Get 2-letter uppercase initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Curated harmonious avatar bubble colors
  const avatarColors = [
    "bg-emerald-100 text-[#0A6E5C] border-emerald-200",
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-sky-100 text-sky-700 border-sky-200",
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
  ];

  const items = signups || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Recent Signups
        </h3>
        <Link
          to="/admin/users"
          className="text-xs font-semibold text-[#0A6E5C] hover:underline"
        >
          View all users
        </Link>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-gray-400 pb-2.5 border-b border-gray-100">
        <div className="col-span-6 sm:col-span-5">User</div>
        <div className="col-span-3 sm:col-span-4 text-center">Role</div>
        <div className="col-span-3 text-right">Join Time</div>
      </div>

      {/* Rows */}
      {isLoading ? (
        <div className="divide-y divide-gray-50 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          No recent user signups found
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {items.map((user, index) => {
            const isWorker = (user.role || "").toUpperCase() === "WORKER";
            const colorClass = avatarColors[index % avatarColors.length];

            return (
              <div
                key={user._id || index}
                className="grid grid-cols-12 items-center py-3 sm:py-3.5 group hover:bg-gray-50/60 rounded-xl px-1 -mx-1 transition-colors"
              >
                {/* User column: Initials bubble + Full name */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border shadow-2xs ${colorClass}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </span>
                </div>

                {/* Role badge */}
                <div className="col-span-3 sm:col-span-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isWorker
                        ? "bg-emerald-50 text-[#0A6E5C] border border-emerald-200/80"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Join Time */}
                <div className="col-span-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">
                  {formatTimeAgo(user.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentSignupsCard;
