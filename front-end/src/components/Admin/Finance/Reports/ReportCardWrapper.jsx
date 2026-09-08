import React from "react";

/**
 * Reusable ReportCardWrapper Component
 * Consistent white card with green accents, rounded corners, subtle border and hover elevation.
 */
export default function ReportCardWrapper({
  icon: Icon,
  title,
  description,
  badge,
  children,
  actionButton,
  className = "",
}) {
  return (
    <div
      className={`group relative bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Subtle top indicator bar with Nexaro emerald gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A6E5C] via-emerald-500 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Card Header */}
      <div className="space-y-4">
        {/* Top row: Icon Badge + optional badge */}
        <div className="flex items-center justify-between gap-3">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0A6E5C] border border-emerald-100/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
              <Icon size={22} className="text-[#0A6E5C]" />
            </div>
          )}

          {badge && <div>{badge}</div>}
        </div>

        {/* Title and Description */}
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg">
              {description}
            </p>
          )}
        </div>

        {/* Middle Custom Content slot */}
        {children && <div className="pt-2">{children}</div>}
      </div>

      {/* Action Footer */}
      {actionButton && <div className="mt-6 pt-4 border-t border-gray-50">{actionButton}</div>}
    </div>
  );
}
