import {
  CheckCircle2,
  UserPlus,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

/**
 * LiveActivityCard Component
 * Real-time activity timeline feed of recent platform actions
 * White and Green Nexaro theme
 */
const LiveActivityCard = ({ activities = [], isLoading = false }) => {
  const getIcon = (type) => {
    switch (type) {
      case "task":
        return {
          icon: <ClipboardList size={15} />,
          bg: "bg-emerald-50 text-[#0A6E5C] border-emerald-200",
        };
      case "worker":
        return {
          icon: <UserPlus size={15} />,
          bg: "bg-sky-50 text-sky-600 border-sky-200",
        };
      case "flag":
        return {
          icon: <AlertTriangle size={15} />,
          bg: "bg-rose-50 text-rose-600 border-rose-200",
        };
      case "payout":
        return {
          icon: <CreditCard size={15} />,
          bg: "bg-teal-50 text-teal-700 border-teal-200",
        };
      case "verification":
        return {
          icon: <ShieldCheck size={15} />,
          bg: "bg-amber-50 text-amber-600 border-amber-200",
        };
      default:
        return {
          icon: <CheckCircle2 size={15} />,
          bg: "bg-emerald-50 text-[#0A6E5C] border-emerald-200",
        };
    }
  };

  const items = activities || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight mb-3">
          Live Activity
        </h3>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          No recent platform activity logged
        </div>
      ) : (
        <div className="space-y-3.5">
          {items.map((activity) => {
            const { icon, bg } = getIcon(activity.type);

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-gray-50/70 transition-colors"
              >
                {/* Status circular icon container */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-2xs mt-0.5 ${bg}`}
                >
                  {icon}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-[13px] font-semibold text-gray-900 leading-snug truncate">
                    {activity.title}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                    {formatTimeAgo(activity.createdAt)}
                    {activity.meta ? ` • ${activity.meta}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};

export default LiveActivityCard;
