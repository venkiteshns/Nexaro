
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

  let activeDotClass = config.dotColor;
  if (dotColor === "yellow") activeDotClass = "bg-amber-400 ring-amber-400/30";
  if (dotColor === "blue") activeDotClass = "bg-blue-500 ring-blue-500/30";
  if (dotColor === "amber") activeDotClass = "bg-amber-500 ring-amber-500/30";
  if (dotColor === "emerald") activeDotClass = "bg-emerald-500 ring-emerald-500/30";
  if (dotColor === "rose") activeDotClass = "bg-rose-500 ring-rose-500/30";

  return (
    <div
      onClick={() => !isRead && onMarkRead && onMarkRead(_id)}
      className={`group relative flex items-start sm:items-center justify-between gap-2.5 sm:gap-4 p-2.5 sm:p-3.5 md:p-4 rounded-xl border transition-all duration-200 ${
        isRead
          ? "bg-white border-gray-100 hover:bg-gray-50/70 opacity-80 hover:opacity-100"
          : "bg-emerald-50/20 border-emerald-100/70 hover:bg-emerald-50/40 shadow-2xs"
      } ${!isRead ? "cursor-pointer" : ""}`}
    >
      {!isRead && (
        <span
          className={`absolute left-0 top-2.5 bottom-2.5 sm:top-3 sm:bottom-3 w-1 rounded-r-full ${config.barColor}`}
          aria-hidden="true"
        />
      )}

      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 pl-1">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border ${config.bg} shadow-2xs transition-transform group-hover:scale-105 [&>svg]:w-3.5 [&>svg]:h-3.5 sm:[&>svg]:w-[18px] sm:[&>svg]:h-[18px]`}
        >
          {config.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h4
              className={`text-xs sm:text-sm font-semibold truncate ${
                isRead ? "text-gray-700" : "text-[#111827] font-bold"
              }`}
            >
              {title}
            </h4>

            {priority === "urgent" && !isRead && (
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200/70 uppercase">
                Urgent
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-snug line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 self-start sm:self-center pt-0.5 sm:pt-0">
        <span className="text-[11px] sm:text-xs font-medium text-gray-400 whitespace-nowrap">
          {formatTimeAgo(createdAt)}
        </span>

        {!isRead ? (
          <span
            title="Unread alert"
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ring-2 sm:ring-4 ${activeDotClass}`}
          />
        ) : (
          <span
            title="Read"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-gray-300 group-hover:text-emerald-600 transition-colors"
          >
            <Check size={12} strokeWidth={2.5} />
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
