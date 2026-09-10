import React from "react";
import { Calendar } from "lucide-react";

/**
 * DashboardHeader Component
 * Displays "Platform overview" with a formatted current date & time pill badge
 * White and Green Nexaro theme
 */
const DashboardHeader = ({ subtitle = "Platform overview" }) => {
  const now = new Date();

  // Format: "Sep 9 • 2026"
  const month = now.toLocaleDateString("en-US", { month: "short" });
  const day = now.getDate();
  const year = now.getFullYear();

  const formattedDate = `${month} ${day} • ${year}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500">
          {subtitle}
        </p>
      </div>

      <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-gray-200/90 text-gray-700 text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-2xs">
        <Calendar size={13} className="text-[#0A6E5C]" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
