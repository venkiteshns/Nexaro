import {
  Zap,
  Wrench,
  Paintbrush,
  GraduationCap,
  Sparkles,
  Briefcase,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const getCategoryIcon = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("electr") || cat.includes("light") || cat.includes("wiring")) {
    return <Zap size={18} className="text-[#0A6E5C]" />;
  }
  if (cat.includes("plumb") || cat.includes("pipe") || cat.includes("leak") || cat.includes("drain")) {
    return <Wrench size={18} className="text-[#0A6E5C]" />;
  }
  if (cat.includes("paint") || cat.includes("wall") || cat.includes("texture")) {
    return <Paintbrush size={18} className="text-[#0A6E5C]" />;
  }
  if (cat.includes("tutor") || cat.includes("teach") || cat.includes("class")) {
    return <GraduationCap size={18} className="text-[#0A6E5C]" />;
  }
  if (cat.includes("clean") || cat.includes("maid") || cat.includes("wash")) {
    return <Sparkles size={18} className="text-[#0A6E5C]" />;
  }
  return <Briefcase size={18} className="text-[#0A6E5C]" />;
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Recently";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const formatDeadline = (dateStr) => {
  if (!dateStr) return null;
  const deadline = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  if (deadline.toDateString() === tomorrow.toDateString()) {
    return "TOMORROW";
  }
  return deadline.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).toUpperCase();
};

const WorkerJobCard = ({ job }) => {
  const navigate = useNavigate();

  if (!job) return null;

  const deadlineLabel = formatDeadline(job.deadline);
  const locationLabel = job.address?.landmark || job.address?.district || job.address?.state;

  return (
    <div
      onClick={() => navigate(`/worker/place-bid/${job._id}`)}
      className="group relative bg-white border border-gray-200/80 hover:border-emerald-300 rounded-xl p-3.5 sm:p-4 mb-2.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
      {/* Left colored border highlight on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0A6E5C] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Main Left: Icon + Content */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Category Circular Icon Container */}
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/90 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-100/60 transition-all">
          {getCategoryIcon(job.category)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#0A6E5C] transition-colors truncate">
              {job.title}
            </h3>
            {job.isNew && (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200/60 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                NEW
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 leading-relaxed">
            {job.description}
          </p>

          {/* Meta Row: Time ago, location, deadline badge */}
          <div className="flex items-center flex-wrap gap-2.5 text-[11px] text-gray-400 mt-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-gray-400" />
              {formatTimeAgo(job.createdAt)}
            </span>

            {locationLabel && (
              <span className="flex items-center gap-1 text-gray-500">
                <MapPin size={12} className="text-gray-400" />
                <span className="truncate max-w-[120px]">{locationLabel}</span>
              </span>
            )}

            {deadlineLabel && (
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded text-[9px] tracking-wide uppercase">
                <Calendar size={10} className="text-gray-500" />
                {deadlineLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Price & Place Bid Button */}
      <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
        <div className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
          ₹{Number(job.amount || 0).toLocaleString("en-IN")}
        </div>

        {job.hasBid ? (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-[#0A6E5C] border border-emerald-200 rounded-lg text-[11px] font-bold shadow-2xs">
            <CheckCircle2 size={13} />
            <span>Bid Placed (₹{Number(job.myBidAmount || 0).toLocaleString("en-IN")})</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/worker/place-bid/${job._id}`);
            }}
            className="bg-[#0A6E5C] hover:bg-[#085a4b] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            Place Bid
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkerJobCard;
