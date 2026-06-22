import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Zap,
  Clock,
  Users,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Loader2,
  Wrench,
  Brush,
  Truck,
  BookOpen,
  Hammer,
  IndianRupee,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import { useGetWorkerBidDetailsQuery } from "../../store/services/api";
import WithdrawBidModal from "../../components/Worker/WithdrawBidModal.jsx";
import Map from "../../components/Maps/Map";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryIcon(category) {
  const map = {
    Plumbing: <Wrench size={16} className="text-[#0A6E5C]" />,
    Electrical: <Zap size={16} className="text-[#0A6E5C]" />,
    Cleaning: <Brush size={16} className="text-[#0A6E5C]" />,
    Moving: <Truck size={16} className="text-[#0A6E5C]" />,
    Tutoring: <BookOpen size={16} className="text-[#0A6E5C]" />,
  };
  return map[category] || <Hammer size={16} className="text-[#0A6E5C]" />;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// function formatDistance(metres) {
//   if (!metres && metres !== 0) return null;
//   if (metres < 1000) return `${Math.round(metres)} m from your location`;
//   return `${(metres / 1000).toFixed(1)} km from your location`;
// }

function getBidStatusConfig(status) {
  switch (status) {
    case "accepted":
      return {
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        label: "Accepted",
      };
    case "rejected":
      return {
        dot: "bg-red-500",
        badge: "bg-red-50 text-red-600 border border-red-200",
        label: "Rejected",
      };
    default:
      return {
        dot: "bg-amber-400",
        badge: "bg-amber-50 text-amber-700 border border-amber-200",
        label: "Pending",
      };
  }
}

// ─── Photo Gallery ─────────────────────────────────────────────────────────────
function PhotoGallery({ photos }) {
  const [lightbox, setLightbox] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="h-28 w-32 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300">
        <ImageIcon size={24} />
        <span className="text-xs mt-1">No Photos</span>
      </div>
    );
  }

  const visible = photos.slice(0, 3);
  const extra = photos.length - 3;

  return (
    <>
      <div className="flex gap-3 flex-wrap">
        {visible.map((img, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            className="relative h-28 w-36 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer group border border-gray-200 hover:border-[#0A6E5C] transition-colors"
          >
            <img
              src={img?.url || img}
              alt={`photo-${i}`}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {i === 2 && extra > 0 && (
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  +{extra} Photos
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightbox]?.url || photos[lightbox]}
              alt="lightbox"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
            {lightbox > 0 && (
              <button
                onClick={() => setLightbox((p) => p - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
            )}
            {lightbox < photos.length - 1 && (
              <button
                onClick={() => setLightbox((p) => p + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            )}
            <p className="text-center text-white/70 text-xs mt-3">
              {lightbox + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Sidebar Cards ─────────────────────────────────────────────────────────────

function YourBidCard({ bid, taskTitle, isWithdrawSuccess }) {
  const { dot, badge, label } = getBidStatusConfig(bid?.status);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Green top accent */}
        <div className="h-1 w-full bg-[#0A6E5C]" />

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Your Submitted Bid
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {label}
            </span>
          </div>

          {/* Bid amount + ETA */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                ₹{Number(bid?.amount || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Clock size={13} className="text-[#0A6E5C]" />
              <span className="text-xs font-medium">{bid?.eta || "—"} ETA</span>
            </div>
          </div>

          {/* Pitch */}
          {bid?.pitch && (
            <div className="mb-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Your Pitch
              </p>
              <blockquote className="text-sm text-gray-600 italic leading-relaxed border-l-2 border-[#0A6E5C] pl-3 bg-emerald-50/50 py-2 rounded-r-lg">
                "{bid.pitch}"
              </blockquote>
            </div>
          )}

          {/* Available Date */}
          {bid?.availableDate && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Calendar size={13} className="text-[#0A6E5C]" />
              Available from:{" "}
              <span className="font-semibold text-gray-700">
                {formatDate(bid.availableDate)}
              </span>
            </div>
          )}

          {/* Actions */}
          {bid?.status === "pending" && (
            <button onClick={() => {
              setShowWithdrawModal(true)
            }} className="w-full mt-1 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
              Withdraw Bid
            </button>
          )}

          {bid?.status === "accepted" && (
            <button className="w-full mt-1 py-2.5 rounded-xl text-sm font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-2">
              Go to Active Job <span className="text-base">→</span>
            </button>
          )}

          {bid?.status === "rejected" && (
            <button className="w-full mt-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              Find Similar Tasks
            </button>
          )}
        </div>
      </div>
      {showWithdrawModal &&
        <WithdrawBidModal isWithdrawSuccess={isWithdrawSuccess} bidId={bid._id} isOpen={showWithdrawModal} taskTitle={taskTitle} bidAmount={bid?.amount} onClose={() => setShowWithdrawModal(false)} />
      }
    </>
  );
}

function CompetitionCard({ bidCount, averageBid }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        Competition Insight
      </p>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Users size={16} className="text-[#0A6E5C]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {bidCount > 0
              ? `${bidCount} other worker${bidCount > 1 ? "s" : ""} have bid`
              : "No other bids yet"}
          </p>
          <p className="text-xs text-gray-400">
            {bidCount === 0
              ? "You're the first bidder!"
              : "Stand out with a strong pitch"}
          </p>
        </div>
      </div>

      {averageBid && (
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
            <IndianRupee size={13} />
            Average Bid
          </div>
          <p className="text-lg font-extrabold text-gray-900">
            ₹{Number(averageBid).toLocaleString("en-IN")}
          </p>
        </div>
      )}
    </div>
  );
}

function PostedByCard({ poster }) {
  // console.log(poster);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        Posted By
      </p>
      <div className="flex items-center gap-3">
        {poster?.picture ? (
          <img
            src={poster?.picture}
            alt={poster?.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-[#0A6E5C]/20"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-sm border-2 border-[#0A6E5C]/20">
            {poster?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800 text-sm">
            {poster?.name || "Anonymous"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Task Poster</p>
        </div>
      </div>
    </div>
  );
}

function LocationCard({ address, location }) {
  const cityDistrict = [address?.city, address?.district]
    .filter(Boolean)
    .join(", ");

  const mapPosition = useMemo(() => {
    const coords = location?.coordinates;
    if (coords && coords.length === 2) {
      return { lat: coords[1], lng: coords[0] };
    }
    return null;
  }, [location]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Task Location
        </p>
        {cityDistrict && (
          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <MapPin size={12} className="text-[#0A6E5C]" />
            {cityDistrict}
          </span>
        )}
      </div>

      <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-gray-200">
        {mapPosition ? (
          <Map
            position={mapPosition}
            height="192px"
            showButton={false}
          />
        ) : (
          <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center text-gray-400">
            <MapPin size={28} className="text-[#0A6E5C]/40 mb-1" />
            <span className="text-xs">Location not available</span>
          </div>
        )}
      </div>

      {/* Full address */}
      {address?.landmark && (
        <div className="px-5 pb-5 text-xs text-gray-500 leading-relaxed">
          📍{" "}
          {[address.landmark, address.city, address.district, address.state]
            .filter(Boolean)
            .join(", ")}
        </div>
      )}
    </div>
  );
}

// ─── Bid Withdrawn Success Screen ──────────────────────────────────────────────

function BidWithdrawnSuccess({ navigate }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) return;
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    if (count === 0) {
      navigate("/worker/my-bids", { replace: true });
    }
  }, [count, navigate]);

  return (
    <div className="flex-1 flex items-center justify-center bg-[#F6FAF8] px-4">
      <div className="flex flex-col items-center text-center max-w-xs w-full">

        {/* Animated ring + checkmark */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-[#0A6E5C]/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#0A6E5C]/10 flex items-center justify-center">
              <svg
                className="w-9 h-9 text-[#0A6E5C]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full border-2 border-[#0A6E5C]/30 animate-ping" />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Bid Withdrawn Successfully!</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Your bid has been successfully withdrawn. You won't be considered for this task anymore.
        </p>

        {/* Countdown pill */}
        <p className="text-xs text-gray-400 mb-4">
          Redirecting to My Bids in{" "}
          <span className="font-bold text-[#0A6E5C]">{count}s</span>…
        </p>

        <button
          onClick={() => navigate("/worker/my-bids", { replace: true })}
          className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                     hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-sm"
        >
          Go to My Bids
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const TaskBidDetails = () => {
  const navigate = useNavigate();
  const { bidId } = useParams();

  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  // console.log("withdraw", isWithdrawSuccess);

  // if (isWithdrawSuccess) return <BidWithdrawnSuccess navigate={navigate} />

  const { data, isLoading, isError } = useGetWorkerBidDetailsQuery(bidId, {
    skip: !bidId || isWithdrawSuccess,
  });

  const bid = data?.bid;
  const task = data?.task;
  const poster = data?.poster;
  const competitionData = data?.competition;

  const isUrgent =
    task?.urgencyLevel === "urgent";

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <WorkerNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkerHeader />

        {!isWithdrawSuccess && <div className="flex-1 overflow-y-auto">

          <div className="sticky top-0 z-10 bg-[#F6FAF8]/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate("/worker/my-bids", { replace: true })}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to My Bids</span>
              <span className="sm:hidden">Back</span>
            </button>
            <h1 className="text-base font-bold text-gray-900">Task Details</h1>
            <div className="w-24 hidden sm:block" />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 size={22} className="animate-spin text-[#0A6E5C]" />
              <span className="text-sm">Loading bid details...</span>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
              <AlertCircle size={36} className="text-red-400" />
              <p className="text-sm font-semibold text-gray-700">
                Could not load bid details
              </p>
              <button
                onClick={() => navigate(-1)}
                className="mt-1 px-5 py-2 bg-[#0A6E5C] text-white text-sm font-semibold rounded-xl hover:bg-[#085e4e] transition-colors"
              >
                Go Back
              </button>
            </div>
          )}

          {!isLoading && !isError && (task || bid) && (
            <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
              <div className="flex flex-col lg:flex-row gap-5">

                <div className="flex-1 min-w-0 space-y-4">

                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <div className="flex flex-col md:flex-row items-start justify-between mb-3 gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {task?.category && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0A6E5C] text-xs font-bold border border-emerald-200">
                            {getCategoryIcon(task.category)}
                            {task.category}
                          </span>
                        )}
                      </div>

                      {task?.budget && (
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                            Poster's Budget
                          </p>
                          <p className="text-2xl font-extrabold text-gray-900">
                            ₹{Number(task.budget).toLocaleString("en-IN")}
                          </p>
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug mb-3">
                      {task?.title || "Task Title"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {task?.createdAt && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          Posted {formatDate(task.createdAt)}
                        </span>
                      )}
                      {task?.address?.city && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#0A6E5C]" />
                          {[task.address.landmark, task.address.city]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Full Description Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Full Description
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {task?.description || "No description provided."}
                    </p>

                    {/* Photos */}
                    {task?.images && (
                      <PhotoGallery photos={task.images} />
                    )}

                    {/* Deadline + Urgency row */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                      {task?.deadline && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                            Completion Deadline
                          </p>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                            <Calendar size={14} className="text-[#0A6E5C]" />
                            By {formatDate(task.deadline)}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                          Urgency
                        </p>
                        <div
                          className={`flex items-center gap-1.5 text-sm font-bold ${isUrgent ? "text-red-600" : "text-gray-500"
                            }`}
                        >
                          <Zap size={14} />
                          {isUrgent
                            ? "High Priority"
                            : task?.urgencyLevel === "low"
                              ? "Low Priority"
                              : "Normal"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task Location Card */}
                  <LocationCard
                    address={task?.address}
                    location={task?.location}
                  />
                </div>

                <div className="w-full lg:w-80 xl:w-96 space-y-4 shrink-0">
                  <YourBidCard bid={bid} taskTitle={task?.title} isWithdrawSuccess={setIsWithdrawSuccess} />
                  <CompetitionCard
                    bidCount={competitionData?.otherBidCount ?? task?.bidCount ?? 0}
                    averageBid={competitionData?.averageBid}
                  />
                  {poster && <PostedByCard poster={poster} />}
                </div>
              </div>
            </div>
          )}

          {/* ── Empty / No data ── */}
          {!isLoading && !isError && !task && !bid && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
              <AlertCircle size={36} className="text-gray-300" />
              <p className="text-sm font-semibold text-gray-600">
                Bid not found
              </p>
              <button
                onClick={() => navigate(-1)}
                className="mt-1 px-5 py-2 bg-[#0A6E5C] text-white text-sm font-semibold rounded-xl hover:bg-[#085e4e] transition-colors"
              >
                Go Back
              </button>
            </div>
          )}
        </div>}
        {isWithdrawSuccess && <BidWithdrawnSuccess navigate={navigate} />}
      </div>
    </div>
  );
};

export default TaskBidDetails;
