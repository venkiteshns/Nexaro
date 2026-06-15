import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    CheckCircle,
    Clock,
    XCircle,
    ArrowRight,
    Loader2,
    AlertCircle,
    IndianRupee,
    ChevronLeft,
    ChevronRight,
    Lightbulb,
} from "lucide-react";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import WithdrawBidModal from "../../components/Worker/WithdrawBidModal.jsx";
import { useGetWorkerBidsQuery } from "../../store/services/api";

const LIMIT = 5;


function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
}

function getBidStatusConfig(status) {
    switch (status) {
        case "accepted":
            return {
                badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                border: "border-l-emerald-500",
                label: "ACCEPTED",
            };
        case "rejected":
            return {
                badge: "bg-red-50 text-red-600 border border-red-200",
                border: "border-l-red-400",
                label: "REJECTED",
            };
        default:
            return {
                badge: "bg-amber-50 text-amber-700 border border-amber-200",
                border: "border-l-amber-400",
                label: "PENDING",
            };
    }
}

function StatCard({ icon, count, label, topColor, extra }) {
    return (
        <div
            className="flex-1 min-w-[120px] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
            style={{ borderTop: `3px solid ${topColor}` }}
        >
            <div style={{ color: topColor }}>{icon}</div>
            <div className="min-w-0">
                <p className="text-2xl font-extrabold text-gray-900 leading-none">
                    {String(count).padStart(2, "0")}
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5 truncate">{label}</p>
                {extra && (
                    <p className="text-[10px] font-semibold mt-0.5" style={{ color: topColor }}>
                        {extra}
                    </p>
                )}
            </div>
        </div>
    );
}

function BidCard({ bid }) {
    console.log("ghafvs", bid)
    const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);


    const navigate = useNavigate();
    const { badge, border, label } = getBidStatusConfig(bid.status);
    const task = bid.taskDetails;
    const taskTitle = task?.title || "Title not found";
    const taskBudget = task?.amount ?? "—";
    const taskBidCount = task?.bidCount ?? 0;


    return (
        <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${border} shadow-sm overflow-hidden`}>
            {isWithdrawSuccess && <WithdrawBidModal taskTitle={taskTitle} bidAmount={bid.amount} isOpen={isWithdrawSuccess} onClose={() => setIsWithdrawSuccess(false)} bidId={bid._id} />}
            <div className="flex justify-between items-start px-5 pt-4 pb-3">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <Briefcase size={18} className="text-[#0A6E5C]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${badge}`}>
                                {label}
                            </span>
                            <span className="text-xs text-gray-400">{timeAgo(bid.createdAt)}</span>
                        </div>
                        <p className="font-semibold text-[15px] text-gray-900 mt-1">{taskTitle}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <IndianRupee size={11} />
                                Budget: ₹{taskBudget}
                            </span>
                            {taskBidCount > 0 && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock size={11} />
                                    {taskBidCount} bid{taskBidCount !== 1 ? "s" : ""} competition
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Your Bid</p>
                    <p className="text-2xl font-extrabold text-gray-900">
                        ₹ {bid.amount}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center px-5 pb-4 pt-2 border-t border-gray-100 gap-2">
                <div className="text-xs text-gray-400">
                    ETA: <span className="font-medium text-gray-600">{bid.eta}</span>
                </div>
                <div className="flex gap-2">
                    {bid.status === "accepted" && (
                        <button
                            onClick={() => navigate(`/worker/active-job/${task._id}`)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors"
                        >
                            Go to Active Job <ArrowRight size={13} />
                        </button>
                    )}
                    {bid.status === "pending" && (
                        <>
                            <button onClick={() => {
                                setIsWithdrawSuccess(true)
                            }} className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                                Withdraw Bid
                            </button>
                            <button
                                onClick={() => bid._id && navigate(`/worker/task-bid-details/${bid._id}`)}
                                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors"
                            >
                                View Task
                            </button>
                        </>
                    )}
                    {bid.status === "rejected" && (
                        <button
                            onClick={() => navigate("/worker/nearby-tasks")}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Find Similar Tasks
                        </button>
                    )}
                </div>
            </div>

            {bid.status === "rejected" && (
                <div className="mx-5 mb-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                        <span className="font-semibold">Tip:</span> Try bidding 10–15% lower
                        than the budget for higher conversion.
                    </p>
                </div>
            )}
        </div>
    );
}


function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-5">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page
                        ? "bg-[#0A6E5C] text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

// ─── MyBids ───────────────────────────────────────────────────────────────────

const TABS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
];

const MyBids = () => {
    const [activeTab, setActiveTab] = useState("all");

    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, isError } = useGetWorkerBidsQuery({
        status: activeTab,
        page,
        limit: LIMIT,
    });

    // console.log("tetsee : ", data);


    const bids = data?.bids || [];
    const pagination = data?.pagination || {};
    const counts = data?.counts || { all: 0, pending: 0, accepted: 0, rejected: 0 };
    const total = pagination.total ?? 0;
    const totalPages = pagination.totalPages ?? 1;

    const winRate = counts.all > 0
        ? Math.round((counts.accepted / counts.all) * 100)
        : 0;

    const handleTabChange = (key) => {
        setActiveTab(key);
        setPage(1);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                <div className="flex-1 overflow-y-auto p-6">

                    {/* ── Page heading ── */}
                    <div className="mb-5">
                        <h1 className="text-[22px] font-extrabold text-gray-900">My Bids</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Track all your placed bids and their current status.
                        </p>
                    </div>

                    {/* ── Stat cards ── */}
                    <div className="flex gap-3 mb-5 flex-wrap">
                        <StatCard
                            icon={<Briefcase size={20} />}
                            count={counts.all}
                            label="TOTAL BIDS"
                            topColor="#0A6E5C"
                        />
                        <StatCard
                            icon={<CheckCircle size={20} />}
                            count={counts.accepted}
                            label="ACCEPTED"
                            topColor="#16A34A"
                            extra={counts.all > 0 ? `${winRate}% Win Rate` : null}
                        />
                        <StatCard
                            icon={<Clock size={20} />}
                            count={counts.pending}
                            label="PENDING"
                            topColor="#D97706"
                        />
                        <StatCard
                            icon={<XCircle size={20} />}
                            count={counts.rejected}
                            label="REJECTED"
                            topColor="#DC2626"
                        />
                    </div>

                    {/* ── Filter tabs ── */}
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-5">
                        <div className="flex gap-2 flex-wrap">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === tab.key
                                        ? "bg-[#0A6E5C] text-white"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.key && total > 0 && (
                                        <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-white/25 text-white">
                                            {total}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Loading ── */}
                    {(isLoading || isFetching) && (
                        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                            <Loader2 size={20} className="animate-spin" />
                            <span className="text-sm">Loading your bids...</span>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {isError && !isFetching && (
                        <div className="flex items-center justify-center py-16 gap-2 text-red-500 text-sm">
                            <AlertCircle size={18} />
                            Could not load bids. Please try again.
                        </div>
                    )}

                    {/* ── Empty ── */}
                    {!isLoading && !isFetching && !isError && bids.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <Briefcase size={36} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-sm font-semibold text-gray-700 mb-1">No bids found</p>
                            <p className="text-xs text-gray-400">
                                {activeTab === "all"
                                    ? "You haven't placed any bids yet."
                                    : `No ${activeTab} bids at the moment.`}
                            </p>
                        </div>
                    )}

                    {!isLoading && !isFetching && !isError && bids.length > 0 && (
                        <>
                            <div className="space-y-3">
                                {bids.map((bid) => (
                                    <BidCard key={bid._id} bid={bid} />
                                ))}
                            </div>

                            <div className="mt-4 text-center text-xs text-gray-400">
                                Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} bids
                            </div>
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBids;
