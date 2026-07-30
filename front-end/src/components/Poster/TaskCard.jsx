import { ArrowRight, BookOpen, Brush, CheckCircle, Clock, MapPin, Truck, Users, Wrench, Zap } from "lucide-react";
import { formatDistance } from "../../utils/formatDistance";

export function TaskCard({ task, handleNavigate, handleActiveJob }) {
  const isUrgent = task.urgencyLevel === "urgent";
  const hasBid = task?.myBid;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden">

      {isUrgent && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Urgent
        </span>
      )}

      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ${isUrgent ? "mt-6" : ""}`}>
          {getCategoryIcon(task.category)}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-medium">Budget</p>
          <p className="text-xl font-extrabold text-gray-900">
            ₹{Number(task.amount).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div>
        <p className="font-semibold text-gray-900 text-[15px] leading-snug">
          {task.title}
        </p>
        <p className={`mt-1 text-xs font-medium flex items-center gap-1 ${task.bidCount > 0 ? "text-[#0A6E5C]" : "text-gray-400"}`}>
          <Users size={12} />
          {task.bidCount > 0 ? `${task.bidCount} bids` : "0 bids"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        {task.address && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={12} />
            {task.address.landmark}
          </p>
        )}
        {task.distance != null && (
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
            {formatDistance(task.distance)}
          </span>
        )}
      </div>

      {hasBid ? (
        hasBid.status === "pending" ? (
          <div className="flex items-center gap-2 mt-auto bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
            <Clock size={15} className="text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600">Bid Placed</span>
            <span className="text-xs text-gray-500 ml-auto">
              ₹{Number(task.myBid.amount).toLocaleString("en-IN")} · {task.myBid.status}
            </span>
          </div>
        ) : hasBid.status === "accepted" ? (
          <div className="flex flex-col items-center gap-2 mt-auto bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-[#0A6E5C]" />
              <span className="text-xs font-semibold text-[#0A6E5C]">Bid Accepted</span>
            </div>
            <button
              onClick={() => handleActiveJob(task._id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors"
            >
              Go to Active Job <ArrowRight size={13} />
            </button>
          </div>
        ) : hasBid.status === "rejected" ? (
          <div className="flex items-center gap-2 mt-auto bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            <X size={15} className="text-red-600" />
            <span className="text-xs font-semibold text-red-600">Bid Rejected</span>
            <span className="text-xs text-gray-500 ml-auto">
              Bid: ₹{Number(task.myBid.amount).toLocaleString("en-IN")}
            </span>
          </div>
        ) : ""
      ) : (
        <button
          onClick={() => handleNavigate(task._id)}
          className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors"
        >
          Place Bid →
        </button>
      )}
    </div>
  );
}

function getCategoryIcon(category) {
  const iconMap = {
    Plumbing: <Wrench size={20} className="text-[#0A6E5C]" />,
    Electrical: <Zap size={20} className="text-[#0A6E5C]" />,
    Cleaning: <Brush size={20} className="text-[#0A6E5C]" />,
    Moving: <Truck size={20} className="text-[#0A6E5C]" />,
    Tutoring: <BookOpen size={20} className="text-[#0A6E5C]" />,
  };
  return iconMap[category] || <Hammer size={20} className="text-[#0A6E5C]" />;
}
