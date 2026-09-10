import { useState, useMemo } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserCheck,
  Lock,
  Sparkles,
  ExternalLink,
  Wrench,
  Brush,
  Truck,
  BookOpen,
  Hammer,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Layers,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import { useAddNewBidMutation, useGetTaskForBidQuery } from "../../store/services/workerApi";
import { FormProvider, useForm } from "react-hook-form";
import BidForm from "../../components/Form/Bids/BidForm";
import { showError, showSuccess, showWarning } from "../../utils/toast";
import { api } from "../../store/services/api";
import Map from "../../components/Maps/Map";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryIcon(category) {
  const map = {
    Plumbing: <Wrench size={15} className="text-[#0A6E5C]" />,
    Electrical: <Zap size={15} className="text-[#0A6E5C]" />,
    Cleaning: <Brush size={15} className="text-[#0A6E5C]" />,
    Moving: <Truck size={15} className="text-[#0A6E5C]" />,
    Tutoring: <BookOpen size={15} className="text-[#0A6E5C]" />,
  };
  return map[category] || <Hammer size={15} className="text-[#0A6E5C]" />;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Photo Gallery with Lightbox ──────────────────────────────────────────────

function PhotoGallery({ photos = [] }) {
  const [lightbox, setLightbox] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="py-6 px-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs">
        <ImageIcon size={22} className="text-gray-300 mb-1" />
        No photos attached for this task.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((img, i) => {
          const src = img?.url || img;
          return (
            <div
              key={i}
              onClick={() => setLightbox(i)}
              className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 cursor-pointer group border border-gray-200 hover:border-[#0A6E5C] transition-all shadow-2xs"
            >
              <img
                src={src}
                alt={`task-photo-${i}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2.5 py-1 rounded-md">
                  View
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightbox]?.url || photos[lightbox]}
              alt={`preview-${lightbox}`}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 sm:top-3 sm:right-3 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            {lightbox > 0 && (
              <button
                onClick={() => setLightbox((p) => p - 1)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {lightbox < photos.length - 1 && (
              <button
                onClick={() => setLightbox((p) => p + 1)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            )}
            <p className="text-center text-white/80 text-xs mt-3 font-medium">
              {lightbox + 1} of {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Task Location Card ────────────────────────────────────────────────────────

function TaskLocationCard({ address, location }) {
  const fullAddress = [address?.landmark, address?.city, address?.district, address?.state]
    .filter(Boolean)
    .join(", ");

  const mapPosition = useMemo(() => {
    const coords = location?.coordinates;
    if (coords && Array.isArray(coords) && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      // GeoJSON is [longitude, latitude]
      return { lat: coords[1], lng: coords[0] };
    }
    return null;
  }, [location]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 pb-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
          Task Location
        </p>
        {fullAddress && (
          <p className="text-xs text-gray-600 flex items-start gap-1.5 leading-relaxed">
            <MapPin size={14} className="text-[#0A6E5C] shrink-0 mt-0.5" />
            <span>{fullAddress}</span>
          </p>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-xl overflow-hidden border border-gray-200">
          {mapPosition ? (
            <Map
              position={mapPosition}
              height="200px"
              showButton={false}
            />
          ) : (
            <div className="h-40 bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
              <MapPin size={24} className="text-[#0A6E5C]/50 mb-1" />
              <span className="text-xs font-medium text-gray-500">
                {fullAddress || "Location coordinates not available"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Poster Info Card ──────────────────────────────────────────────────────────

function PosterInfoCard({ poster }) {
  if (!poster) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3.5">
        Posted By Client
      </p>
      <div className="flex items-center gap-3">
        {poster?.avatar?.url || poster?.picture ? (
          <img
            src={poster?.avatar?.url || poster?.picture}
            alt={poster?.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/20 shadow-2xs shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-extrabold text-sm border-2 border-emerald-500/20 shadow-2xs shrink-0">
            {poster?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900 text-sm truncate">
            {poster?.name || "Client"}
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            {poster?.city ? `${poster.city}, ${poster.district || poster.state || ""}` : "Task Creator"}
          </p>
          {poster?.isVerified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
              <CheckCircle2 size={10} /> Verified Client
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Existing Bid Card ─────────────────────────────────────────────────────────

function ExistingBidCard({ bid }) {
  const navigate = useNavigate();
  if (!bid) return null;

  const statusBadge = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  }[bid.status] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="h-1 bg-[#0A6E5C]" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Your Submitted Bid
          </p>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
            {bid.status}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <p className="text-2xl font-black text-gray-900">
            ₹{Number(bid.amount || 0).toLocaleString("en-IN")}
          </p>
          {bid.eta && (
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Clock size={12} className="text-[#0A6E5C]" /> {bid.eta}
            </span>
          )}
        </div>

        {bid.pitch && (
          <p className="text-xs text-gray-600 italic bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4 line-clamp-3">
            "{bid.pitch}"
          </p>
        )}

        <button
          onClick={() => navigate(`/worker/task-bid-details/${bid._id}`)}
          className="w-full py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          View Full Bid Details <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Status Alert Banner ───────────────────────────────────────────────────────

function TaskStatusBanner({ task, canPlaceBid, isCompleted, isCancelled, isAssignedToMe, isAssignedToOther, hasExistingBid }) {
  const navigate = useNavigate();

  if (canPlaceBid) return null;

  if (isCompleted) {
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-[#0A6E5C]">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Task Completed</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Closed
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              {isAssignedToMe
                ? "You have successfully completed this task. You can view your invoice and review."
                : "This task has already been completed by the assigned professional. Bidding is closed."}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2.5 w-full sm:w-auto">
          {isAssignedToMe ? (
            <button
              onClick={() => navigate(`/worker/completed-task/${task._id}`)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              View Completion Summary
            </button>
          ) : (
            <button
              onClick={() => navigate("/worker/nearby-tasks")}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              Browse Nearby Tasks
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
            <XCircle size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Task Cancelled</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                Cancelled
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              This task was cancelled by the client. It is no longer open for placing bids.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={() => navigate("/worker/nearby-tasks")}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            Find Other Tasks
          </button>
        </div>
      </div>
    );
  }

  if (isAssignedToMe) {
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-[#0A6E5C]">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Task Assigned to You!</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                In Progress
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              Congratulations! The client accepted your bid and selected you for this task.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={() => navigate(`/worker/active-job/${task._id}`)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            Go to Active Job →
          </button>
        </div>
      </div>
    );
  }

  if (isAssignedToOther) {
    return (
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Task Assigned to Another Professional</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                Assigned
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              The client has chosen another service provider for this task. Bidding is now closed.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={() => navigate("/worker/nearby-tasks")}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            Explore Nearby Tasks
          </button>
        </div>
      </div>
    );
  }

  if (hasExistingBid) {
    const isRejected = task.existingBid?.status === "rejected";
    const isAccepted = task.existingBid?.status === "accepted";

    return (
      <div className={`${isRejected ? "bg-red-50/90 border-red-200" : isAccepted ? "bg-emerald-50/90 border-emerald-200" : "bg-blue-50/90 border-blue-200"} border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl ${isRejected ? "bg-red-100 text-red-600" : isAccepted ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-600"} flex items-center justify-center shrink-0`}>
            {isRejected ? <AlertCircle size={22} /> : isAccepted ? <CheckCircle2 size={22} /> : <Clock size={22} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                {isRejected ? "Bid Not Selected" : isAccepted ? "Bid Accepted!" : "You Have Already Bid on This Task"}
              </h3>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                isRejected ? "bg-red-100 text-red-800" : isAccepted ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
              }`}>
                {task.existingBid?.status || "Pending"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              You submitted a proposal of <span className="font-semibold text-gray-900">₹{Number(task.existingBid?.amount || 0).toLocaleString("en-IN")}</span>.
              {isAccepted ? " Head to the active job to continue." : isRejected ? " This bid was rejected by the client." : " Awaiting response from the client."}
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto flex items-center gap-2">
          {task.existingBid?._id && (
            <button
              onClick={() => navigate(`/worker/task-bid-details/${task.existingBid._id}`)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              View Your Bid Details
            </button>
          )}
          {isAccepted && (
            <button
              onClick={() => navigate(`/worker/active-job/${task._id}`)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              Active Job →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback banner
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center shrink-0 text-gray-600">
          <Lock size={22} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Bidding is Closed</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            This task is no longer open for placing new bids.
          </p>
        </div>
      </div>
      <div className="shrink-0 w-full sm:w-auto">
        <button
          onClick={() => navigate("/worker/nearby-tasks")}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          Browse Nearby Tasks
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const PlaceBid = () => {
  const navigate = useNavigate();
  const methods = useForm();
  const { taskId } = useParams();

  const { data, isLoading, isError } = useGetTaskForBidQuery(taskId);
  const [addbid, { isSuccess: bidSuccess, isLoading: bidLoading, isError: bidError }] = useAddNewBidMutation();

  const task = data?.task?.[0] || null;

  // Status computation
  const isCompleted = task?.status === "completed";
  const isCancelled = task?.status === "cancelled";
  const isAssigned = task?.status === "assigned" || task?.status === "in_progress";
  const isAssignedToMe = Boolean(task?.isAssignedToMe);
  const isAssignedToOther = Boolean(task?.isAssignedToOther || (isAssigned && !isAssignedToMe));
  const hasExistingBid = Boolean(task?.existingBid);

  // If task is completed, cancelled, assigned to other, assigned to me, or worker already placed bid: DO NOT show bid form!
  const canPlaceBid = Boolean(
    task &&
    task.status === "open" &&
    !hasExistingBid &&
    !isAssignedToOther &&
    !isAssignedToMe
  );

  const isUrgent = task?.urgencyLevel === "urgent";

  const handleBidSubmission = async (formData) => {
    try {
      let res = await addbid(formData).unwrap();
      showSuccess(res.message);
      setTimeout(() => {
        navigate("/worker/my-bids");
      }, 3200);
      methods.reset();
    } catch (error) {
      if (error?.data?.message === "You have already bid on this task") {
        showWarning(error.data.message);
      } else if (
        error?.data?.message === "This task has been cancelled by the poster, Cannot place bid for a cancelled task"
      ) {
        showWarning(error.data.message);
        setTimeout(() => {
          api.util.invalidateTags(["Worker_Tasks"]);
          navigate("/worker/nearby-tasks");
        }, 3200);
      } else {
        showError(error?.data?.message || "Failed to submit bid");
        methods.reset();
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <WorkerNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkerHeader />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Bar */}
          <div className="sticky top-0 z-10 bg-[#F6FAF8]/95 backdrop-blur-xs border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-semibold cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Tasks</span>
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-gray-900">
                {canPlaceBid ? "Place Your Bid" : "Task Details"}
              </h1>

              {task && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isCompleted
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isCancelled
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : isAssignedToOther
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : isAssignedToMe
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : hasExistingBid
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-emerald-50 text-[#0A6E5C] border-emerald-200"
                  }`}
                >
                  {isCompleted
                    ? "Completed"
                    : isCancelled
                    ? "Cancelled"
                    : isAssignedToOther
                    ? "Assigned"
                    : isAssignedToMe
                    ? "In Progress"
                    : hasExistingBid
                    ? "Bid Placed"
                    : "Open"}
                </span>
              )}
            </div>

            <div className="w-20 hidden sm:block" />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-400">
              <Loader2 size={28} className="animate-spin text-[#0A6E5C]" />
              <span className="text-sm font-medium text-gray-600">Loading task details...</span>
            </div>
          )}

          {/* Error / Not Found State */}
          {isError && !task && (
            <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-500 px-4 text-center">
              <AlertCircle size={40} className="text-red-400" />
              <p className="text-base font-bold text-gray-800">Task Details Unavailable</p>
              <p className="text-xs text-gray-500 max-w-sm">
                We couldn't load the details for this task. It may have been removed or you may have lost connection.
              </p>
              <button
                onClick={() => navigate("/worker/nearby-tasks")}
                className="mt-2 px-5 py-2.5 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors cursor-pointer shadow-xs"
              >
                Browse Nearby Tasks
              </button>
            </div>
          )}

          {/* Bid Success Screen */}
          {bidSuccess && (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Bid Placed Successfully!</h2>
              <p className="text-gray-500 text-sm mt-1 max-w-md">
                Your quote and proposal have been submitted to the client. You can track this in My Bids.
              </p>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
                <Loader2 size={14} className="animate-spin text-[#0A6E5C]" />
                Redirecting to your bids page...
              </p>
            </div>
          )}

          {/* Task Content */}
          {!isLoading && !isError && task && !bidSuccess && (
            <div className="p-4 sm:p-6 w-full space-y-5 pb-16">
              {/* Status Alert Banner (Shown when cannot place bid) */}
              <TaskStatusBanner
                task={task}
                canPlaceBid={canPlaceBid}
                isCompleted={isCompleted}
                isCancelled={isCancelled}
                isAssignedToMe={isAssignedToMe}
                isAssignedToOther={isAssignedToOther}
                hasExistingBid={hasExistingBid}
              />

              {/* Responsive Layout */}
              <div className="flex flex-col lg:flex-row gap-5 items-start">
                {/* ── Main Column (Task Details + Bid Form if open) ── */}
                <div className="flex-1 w-full min-w-0 space-y-5">
                  {/* Task Header Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                    {/* Category + Budget Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.category && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0A6E5C] text-xs font-extrabold border border-emerald-100">
                            {getCategoryIcon(task.category)}
                            {task.category}
                          </span>
                        )}
                        {isUrgent && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                            <Zap size={13} />
                            Urgent Task
                          </span>
                        )}
                      </div>

                      <div className="sm:text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Poster's Budget
                        </p>
                        <p className="text-3xl font-black text-[#0A6E5C] leading-tight">
                          ₹{Number(task.amount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug mb-3">
                      {task.title}
                    </h2>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      {task?.address && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-[#0A6E5C]" />
                          {[task.address.landmark, task.address.city, task.address.district].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {task?.deadline && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-[#0A6E5C]" />
                          Deadline: {formatDate(task.deadline)}
                        </span>
                      )}
                      {task?.createdAt && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={13} className="text-[#0A6E5C]" />
                          Posted {formatDate(task.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={16} className="text-[#0A6E5C]" />
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Task Description
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {task.description || "No description provided."}
                    </p>
                  </div>

                  {/* Attached Photos Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={16} className="text-[#0A6E5C]" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Attached Photos
                        </h3>
                      </div>
                      {task.images?.length > 0 && (
                        <span className="text-xs font-semibold text-gray-400">
                          {task.images.length} photo{task.images.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <PhotoGallery photos={task.images} />
                  </div>

                  {/* Location & Map Card */}
                  <TaskLocationCard address={task.address} location={task.location} />

                  {/* ── Place Your Bid Form (ONLY when task is open and eligible) ── */}
                  {canPlaceBid && (
                    <FormProvider {...methods}>
                      <form onSubmit={methods.handleSubmit(handleBidSubmission)}>
                        <BidForm
                          task={task}
                          bidLoading={bidLoading}
                          bidError={bidError}
                          bidSuccess={bidSuccess}
                          deadline={task?.deadline}
                        />
                      </form>
                    </FormProvider>
                  )}
                </div>

                {/* ── Sidebar (Poster Info + Existing Bid + Quick Actions) ── */}
                <div className="w-full lg:w-80 xl:w-96 space-y-5 shrink-0">
                  {/* Poster / Client Card */}
                  <PosterInfoCard poster={task.posterId} />

                  {/* Existing Bid Details (if worker placed bid) */}
                  {hasExistingBid && (
                    <ExistingBidCard bid={task.existingBid} taskId={task._id} />
                  )}

                  {/* Quick Actions & Navigation */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Navigation & Actions
                    </p>

                    <button
                      onClick={() => navigate("/worker/nearby-tasks")}
                      className="w-full py-2.5 px-4 bg-[#0A6E5C] text-white text-xs font-bold rounded-xl hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Layers size={14} /> Browse Nearby Tasks
                    </button>

                    <button
                      onClick={() => navigate("/worker/my-bids")}
                      className="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      View All My Bids
                    </button>

                    {isAssignedToMe && (
                      <button
                        onClick={() => navigate(`/worker/active-job/${task._id}`)}
                        className="w-full py-2.5 px-4 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Sparkles size={14} /> Go to Active Job
                      </button>
                    )}

                    {isCompleted && isAssignedToMe && (
                      <button
                        onClick={() => navigate(`/worker/completed-task/${task._id}`)}
                        className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        View Completion Summary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
