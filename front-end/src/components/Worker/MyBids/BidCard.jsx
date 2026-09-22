import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Clock,
    ArrowRight,
    IndianRupee,
    Lightbulb,
} from 'lucide-react';
import WithdrawBidModal from '../WithdrawBidModal';

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

function getBidStatusConfig(status, task) {
    if (status === "accepted") {
        if (task?.status === "completed" && task?.update === "payment") {
            return {
                badge: "bg-emerald-100 text-[#0A6E5C] border border-emerald-300 font-extrabold",
                border: "border-l-[#0A6E5C]",
                label: "COMPLETED",
            };
        }
        return {
            badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
            border: "border-l-emerald-500",
            label: "ACCEPTED",
        };
    }
    switch (status) {
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

export default function BidCard({ bid }) {
    const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
    const navigate = useNavigate();

    const task = bid.taskDetails;
    const { badge, border, label } = getBidStatusConfig(bid.status, task);
    const taskTitle = task?.title || "Title not found";
    const taskBudget = task?.amount ?? "—";
    const taskBidCount = task?.bidCount ?? 0;

    return (
        <div className={`bg-white rounded-xl border border-gray-200/80 border-l-4 ${border} shadow-xs overflow-hidden`}>
            {isWithdrawSuccess && (
                <WithdrawBidModal
                    taskTitle={taskTitle}
                    bidAmount={bid.amount}
                    isOpen={isWithdrawSuccess}
                    onClose={() => setIsWithdrawSuccess(false)}
                    bidId={bid._id}
                />
            )}
            <div className="flex justify-between items-start px-3.5 sm:px-4 pt-3 pb-2.5">
                <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <Briefcase size={15} className="text-[#0A6E5C]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide ${badge}`}>
                                {label}
                            </span>
                            <span className="text-[11px] text-gray-400">{timeAgo(bid.createdAt)}</span>
                        </div>
                        <p className="font-bold text-xs sm:text-sm text-gray-900 mt-0.5">{taskTitle}</p>
                        <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                <IndianRupee size={10} />
                                Budget: ₹{taskBudget}
                            </span>
                            {taskBidCount > 0 && (
                                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                    <Clock size={10} />
                                    {taskBidCount} bid{taskBidCount !== 1 ? "s" : ""} competition
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Your Bid</p>
                    <p className="text-base sm:text-lg font-extrabold text-gray-900">
                        ₹ {bid.amount}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                        5% platform fee
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center px-3.5 sm:px-4 pb-2.5 pt-2 border-t border-gray-100 gap-2">
                <div className="text-[11px] text-gray-400">
                    ETA: <span className="font-medium text-gray-600">{bid.eta}</span>
                </div>
                <div className="flex gap-1.5">
                    {bid.status === "accepted" && (
                        task?.status === 'completed' && task?.update === 'payment' ? (
                            <button
                                onClick={() => navigate(`/worker/completed-task/${task._id}`)}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border border-[#0A6E5C] text-[#0A6E5C] bg-emerald-50/60 hover:bg-emerald-100/80 transition-all shadow-xs cursor-pointer"
                            >
                                View Task Details <ArrowRight size={12} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate(`/worker/active-job/${task._id}`)}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors cursor-pointer"
                            >
                                Go to Active Job <ArrowRight size={12} />
                            </button>
                        )
                    )}
                    {bid.status === "pending" && (
                        <>
                            <button
                                onClick={() => setIsWithdrawSuccess(true)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Withdraw Bid
                            </button>
                            <button
                                onClick={() => bid._id && navigate(`/worker/task-bid-details/${bid._id}`)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors cursor-pointer"
                            >
                                View Task
                            </button>
                        </>
                    )}
                    {bid.status === "rejected" && (
                        <button
                            onClick={() => navigate("/worker/nearby-tasks")}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
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
