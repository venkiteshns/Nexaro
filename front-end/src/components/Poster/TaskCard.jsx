import { ArrowRight, BookOpen, Brush, CheckCircle, Clock, Hammer, MapPin, Truck, Users, Wrench, X, Zap } from "lucide-react";
import { formatDistance } from "../../utils/formatDistance";

export function TaskCard({ task, handleNavigate, handleActiveJob }) {
  const isUrgent = task.urgencyLevel === "urgent";
  const hasBid = task?.myBid;

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-4 shadow-xs hover:border-emerald-200 transition-all flex flex-col gap-2.5 relative overflow-hidden">

      {isUrgent && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
          Urgent
        </span>
      )}

      <div className="flex justify-between items-start">
        <div className={`w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center ${isUrgent ? "mt-4" : ""}`}>
          {getCategoryIcon(task.category)}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-medium">Budget</p>
          <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">
            ₹{Number(task.amount).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div>
        <p className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-2">
          {task.title}
        </p>
        <p className={`mt-0.5 text-[11px] font-medium flex items-center gap-1 ${task.bidCount > 0 ? "text-[#0A6E5C]" : "text-gray-400"}`}>
          <Users size={11} />
          {task.bidCount > 0 ? `${task.bidCount} bids` : "0 bids"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {task.address && (
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <MapPin size={11} />
            {task.address.landmark}
          </p>
        )}
        {task.distance != null && (
          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {formatDistance(task.distance)}
          </span>
        )}
      </div>

      {hasBid ? (
        hasBid.status === "pending" ? (
          <div className="flex items-center gap-1.5 mt-auto bg-yellow-50 border border-yellow-200/80 rounded-lg px-3 py-1.5">
            <Clock size={13} className="text-yellow-600 shrink-0" />
            <span className="text-xs font-semibold text-yellow-700">Bid Placed</span>
            <span className="text-[11px] text-gray-500 ml-auto">
              ₹{Number(task.myBid.amount).toLocaleString("en-IN")}
            </span>
          </div>
        ) : hasBid.status === "accepted" ? (
          <div className="flex flex-col items-center gap-1.5 mt-auto bg-emerald-50 border border-emerald-200/80 rounded-lg p-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-[#0A6E5C]" />
              <span className="text-xs font-bold text-[#0A6E5C]">Bid Accepted</span>
            </div>
            <button
              onClick={() => handleActiveJob(task._id)}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors cursor-pointer"
            >
              Go to Active Job <ArrowRight size={11} />
            </button>
          </div>
        ) : hasBid.status === "rejected" ? (
          <div className="flex items-center gap-1.5 mt-auto bg-red-50 border border-red-200/80 rounded-lg px-3 py-1.5">
            <X size={13} className="text-red-600 shrink-0" />
            <span className="text-xs font-semibold text-red-600">Bid Rejected</span>
            <span className="text-[11px] text-gray-500 ml-auto">
              ₹{Number(task.myBid.amount).toLocaleString("en-IN")}
            </span>
          </div>
        ) : ""
      ) : (
        <button
          onClick={() => handleNavigate(task._id)}
          className="mt-auto w-full py-1.5 rounded-lg text-xs font-bold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors cursor-pointer shadow-2xs"
        >
          Place Bid →
        </button>
      )}
    </div>
  );
}

function getCategoryIcon(category) {
  const iconMap = {
    Plumbing: <Wrench size={16} className="text-[#0A6E5C]" />,
    Electrical: <Zap size={16} className="text-[#0A6E5C]" />,
    Cleaning: <Brush size={16} className="text-[#0A6E5C]" />,
    Moving: <Truck size={16} className="text-[#0A6E5C]" />,
    Tutoring: <BookOpen size={16} className="text-[#0A6E5C]" />,
  };
  return iconMap[category] || <Hammer size={16} className="text-[#0A6E5C]" />;
}
