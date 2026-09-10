import React, { useState } from "react";
import { ChevronDown, Megaphone } from "lucide-react";

/**
 * Format relative time for announcements
 */
const formatSentTime = (dateInput) => {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

/**
 * Reusable RecentlySentAnnouncements component
 * Displays list of previously broadcasted announcements with audience badges and message preview.
 */
const RecentlySentAnnouncements = ({ announcements = [], isLoading = false }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
        Recently Sent
      </h3>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center text-gray-400 text-xs shadow-xs">
          No announcements sent recently
        </div>
      ) : (
        <div className="space-y-2.5">
          {announcements.map((announcement) => {
            const id = announcement._id || announcement.id;
            const isExpanded = expandedId === id;

            return (
              <div
                key={id}
                onClick={() => toggleExpand(id)}
                className="group relative bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer overflow-hidden"
              >
                {/* Left accent bar in Nexaro green */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0A6E5C] rounded-l-2xl"
                  aria-hidden="true"
                />

                <div className="pl-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#0A6E5C] transition-colors">
                      {announcement.title}
                    </h4>
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="font-semibold text-[#0A6E5C]">
                      To: {announcement.targetAudience}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>Sent {formatSentTime(announcement.createdAt)}</span>
                  </div>

                  {/* Expandable message content */}
                  {isExpanded && announcement.message && (
                    <div className="mt-2.5 pt-2.5 border-t border-gray-100 text-xs text-gray-600 bg-gray-50/60 p-2.5 rounded-xl leading-relaxed animate-in fade-in duration-150">
                      {announcement.message}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentlySentAnnouncements;
