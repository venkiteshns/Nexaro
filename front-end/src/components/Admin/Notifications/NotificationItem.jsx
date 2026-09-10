
import {
  Star,
  UserPlus,
  ShieldCheck,
  Banknote,
  ClipboardList,
  AlertCircle,
  Megaphone,
  Bell,
  Check,
  CheckCircle2,
  Award,
  XCircle,
  Coins,
  ArrowUpRight,
} from "lucide-react";

import { formatTimeAgo } from "../../../utils/formatTimeAgo";

/**
 * Returns icon config based on notification type
 */
const getNotificationTypeConfig = (type) => {
  switch (type) {
    case "review":
      return {
        icon: <Star size={18} className="text-amber-500 fill-amber-500/20" />,
        bg: "bg-amber-50/80 border-amber-200/60",
        dotColor: "bg-amber-400 ring-amber-400/20",
        barColor: "bg-amber-400",
      };
    case "signup":
      return {
        icon: <UserPlus size={18} className="text-blue-600" />,
        bg: "bg-blue-50/80 border-blue-200/60",
        dotColor: "bg-blue-500 ring-blue-500/20",
        barColor: "bg-blue-500",
      };
    case "verification":
      return {
        icon: <ShieldCheck size={18} className="text-amber-600" />,
        bg: "bg-amber-50/80 border-amber-200/60",
        dotColor: "bg-amber-500 ring-amber-500/20",
        barColor: "bg-amber-500",
      };
    case "payout_requested":
      return {
        icon: <Banknote size={18} className="text-[#0A6E5C]" />,
        bg: "bg-emerald-50/80 border-emerald-200/60",
        dotColor: "bg-emerald-500 ring-emerald-500/20",
        barColor: "bg-[#0A6E5C]",
      };
    case "payout_initiated":
      return {
        icon: <ArrowUpRight size={18} className="text-[#0A6E5C]" />,
        bg: "bg-emerald-50/80 border-emerald-200/60",
        dotColor: "bg-emerald-500 ring-emerald-500/20",
        barColor: "bg-[#0A6E5C]",
      };
    case "new_task":
      return {
        icon: <ClipboardList size={18} className="text-teal-600" />,
        bg: "bg-teal-50/80 border-teal-200/60",
        dotColor: "bg-teal-500 ring-teal-500/20",
        barColor: "bg-teal-500",
      };
    case "bid_accepted":
      return {
        icon: <CheckCircle2 size={18} className="text-[#0A6E5C]" />,
        bg: "bg-emerald-50/80 border-emerald-200/60",
        dotColor: "bg-emerald-500 ring-emerald-500/20",
        barColor: "bg-[#0A6E5C]",
      };
    case "task_completed":
      return {
        icon: <Award size={18} className="text-[#0A6E5C]" />,
        bg: "bg-emerald-50/80 border-emerald-200/60",
        dotColor: "bg-emerald-500 ring-emerald-500/20",
        barColor: "bg-[#0A6E5C]",
      };
    case "task_cancelled":
      return {
        icon: <XCircle size={18} className="text-rose-500" />,
        bg: "bg-rose-50/80 border-rose-200/60",
        dotColor: "bg-rose-400 ring-rose-400/20",
        barColor: "bg-rose-400",
      };
    case "platform_fee":
      return {
        icon: <Coins size={18} className="text-[#0A6E5C]" />,
        bg: "bg-emerald-50/80 border-emerald-200/60",
        dotColor: "bg-emerald-500 ring-emerald-500/20",
        barColor: "bg-[#0A6E5C]",
      };
    case "payout_failed":
      return {
        icon: <AlertCircle size={18} className="text-rose-600" />,
        bg: "bg-rose-50/80 border-rose-200/60",
        dotColor: "bg-rose-500 ring-rose-500/20",
        barColor: "bg-rose-500",
      };
    case "announcement":
      return {
        icon: <Megaphone size={18} className="text-purple-600" />,
        bg: "bg-purple-50/80 border-purple-200/60",
        dotColor: "bg-purple-500 ring-purple-500/20",
        barColor: "bg-purple-500",
      };
    default:
      return {
        icon: <Bell size={18} className="text-[#0A6E5C]" />,
        bg: "bg-emerald-50/80 border-emerald-200/60",
        dotColor: "bg-emerald-500 ring-emerald-500/20",
        barColor: "bg-[#0A6E5C]",
      };
  }
};

/**
 * Reusable NotificationItem component for rendering single alert entries
 */
const NotificationItem = ({ notification, onMarkRead }) => {
  const {
    _id,
    type,
    title,
    description,
    isRead,
    createdAt,
    priority,
    dotColor,
  } = notification;

  const config = getNotificationTypeConfig(type);

  // Custom dot color override if specified in document
  let activeDotClass = config.dotColor;
  if (dotColor === "yellow") activeDotClass = "bg-amber-400 ring-amber-400/30";
  if (dotColor === "blue") activeDotClass = "bg-blue-500 ring-blue-500/30";
  if (dotColor === "amber") activeDotClass = "bg-amber-500 ring-amber-500/30";
  if (dotColor === "emerald") activeDotClass = "bg-emerald-500 ring-emerald-500/30";
  if (dotColor === "rose") activeDotClass = "bg-rose-500 ring-rose-500/30";

  return (
    <div
      onClick={() => !isRead && onMarkRead && onMarkRead(_id)}
      className={`group relative flex items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
        isRead
          ? "bg-white border-gray-100 hover:bg-gray-50/70 opacity-80 hover:opacity-100"
          : "bg-emerald-50/20 border-emerald-100/70 hover:bg-emerald-50/40 shadow-2xs"
      } ${!isRead ? "cursor-pointer" : ""}`}
    >
      {/* Active unread accent bar on left */}
      {!isRead && (
        <span
          className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${config.barColor}`}
          aria-hidden="true"
        />
      )}

      {/* Left Icon + Text details */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1 pl-1">
        {/* Icon container */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border ${config.bg} shadow-2xs transition-transform group-hover:scale-105`}
        >
          {config.icon}
        </div>

        {/* Content info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-semibold truncate ${
                isRead ? "text-gray-700" : "text-[#111827] font-bold"
              }`}
            >
              {title}
            </h4>

            {priority === "urgent" && !isRead && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200/70 uppercase">
                Urgent
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-snug line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Right meta info: relative time + status dot / mark read button */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center pt-0.5 sm:pt-0">
        <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
          {formatTimeAgo(createdAt)}
        </span>

        {!isRead ? (
          <span
            title="Unread alert"
            className={`w-2.5 h-2.5 rounded-full ring-4 ${activeDotClass}`}
          />
        ) : (
          <span
            title="Read"
            className="w-4 h-4 rounded-full flex items-center justify-center text-gray-300 group-hover:text-emerald-600 transition-colors"
          >
            <Check size={13} strokeWidth={2.5} />
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
