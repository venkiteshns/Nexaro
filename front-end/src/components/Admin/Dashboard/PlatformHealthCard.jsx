import React from "react";
import { Activity } from "lucide-react";

/**
 * PlatformHealthCard Component
 * Displays system health indicators (Online Workers, Tasks Today, Bids Today, Avg Bids / Task)
 * White and Green Nexaro theme
 */
const PlatformHealthCard = ({ health = {}, isLoading = false }) => {
  const {
    onlineWorkers = 0,
    tasksToday = 0,
    bidsToday = 0,
    avgBidsPerTask = "0",
  } = health;

  const rows = [
    { label: "Online Workers", value: onlineWorkers },
    { label: "Tasks Today", value: tasksToday },
    { label: "Bids Today", value: bidsToday },
    { label: "Avg Bids / Task", value: Math.round(avgBidsPerTask) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Platform Health
        </h3>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" title="System Normal" />
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <div className="h-3.5 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-100/90">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 sm:py-3.5 first:pt-0 last:pb-0"
            >
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {row.label}
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlatformHealthCard;
