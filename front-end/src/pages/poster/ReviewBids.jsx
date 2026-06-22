import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Star,
    CheckCircle,
    ChevronDown,
    Wrench,
    Loader2,
    AlertTriangle,
    ArrowRight,
} from 'lucide-react';
import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';
import { useAcceptBidMutation, useGetPosterBidsQuery } from '../../store/services/api';
import { showError, showSuccess } from '../../utils/toast';


const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'lowest', label: 'Lowest Bid' },
    { value: 'highest', label: 'Highest Bid' },
    { value: 'rating', label: 'Highest Rated' },
];


function AcceptModal({ bid, onConfirm, onCancel }) {
    if (!bid) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-1 w-full bg-gradient-to-r from-[#0A6E5C] to-emerald-400" />

                <div className="p-7 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-5">
                        <CheckCircle size={30} className="text-[#0A6E5C]" />
                    </div>

                    <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                        Accept {bid.worker.name.split(' ')[0]}'s Bid?
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                        Accepting this bid will notify{' '}
                        <span className="font-semibold text-gray-700">{bid.name}</span> to proceed.
                        Secure payment of{' '}
                        <span className="font-semibold text-[#0A6E5C]">₹{bid.amount}</span> will be
                        held.
                    </p>

                    <button
                        onClick={onConfirm}
                        className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                                   hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-sm mb-3"
                    >
                        Confirm Acceptance
                    </button>
                    <button
                        onClick={onCancel}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function BidCard({ bid, onAccept }) {
    const { worker } = bid;
    return (
        <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md border-gray-200">

            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 border bg-gray-100 border-gray-200">
                            {worker?.selfie ? (
                                <img src={worker.selfie} alt="" className='w-12 h-12 rounded-full object-cover' />
                            ) : (
                                <span className="text-sm font-bold text-gray-600">
                                    {worker?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
            ${worker.status ? 'bg-emerald-500' : 'bg-gray-400'}`}
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-[15px]">{worker.name}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <Star size={13} fill="#FBBF24" color="#FBBF24" />
                        <span className="text-sm font-bold text-gray-800">{worker.rating}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                        { label: 'Active Status', value: worker.status ? 'Online' : 'Offline' },
                        { label: 'ETA', value: bid.eta },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-emerald-50/60 rounded-xl px-3 py-2 text-center border border-emerald-100">
                            <p className="text-[9px] font-bold text-[#0A6E5C]/70 uppercase tracking-wide mb-0.5">{label}</p>
                            <p className="text-xs font-bold text-gray-800">{value}</p>
                        </div>
                    ))}
                </div>

                {bid.pitch && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 italic border-l-2 border-[#0A6E5C]/30 pl-3">
                        {bid.pitch}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <div className='flex flex-col '>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Bid Amount</p>
                        <p className="text-2xl font-extrabold text-gray-900">
                            ₹{bid.amount}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => onAccept(bid)}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-[#0A6E5C] text-white
                                       hover:bg-[#085e4e] active:scale-[0.97] transition-all flex items-center gap-1.5 shadow-sm"
                        >
                            Accept Bid
                            <CheckCircle size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingState({ bid }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    {bid?.worker?.selfie ? (
                        <img src={bid.worker.selfie} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="text-3xl font-extrabold text-[#0A6E5C]">
                            {bid?.worker?.name?.charAt(0) ?? '?'}
                        </span>
                    )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-emerald-200 flex items-center justify-center">
                    <Loader2 size={16} className="text-[#0A6E5C] animate-spin" />
                </span>
            </div>

            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Accepting bid…</p>
                <p className="text-sm text-gray-500">
                    Notifying{' '}
                    <span className="font-semibold text-gray-700">{bid?.worker?.name ?? 'worker'}</span>
                    {' '}· Securing{' '}
                    <span className="font-semibold text-[#0A6E5C]">₹{bid?.amount}</span>
                </p>
            </div>

            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#0A6E5C] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

function ErrorState({ onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-500" />
            </div>

            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Something went wrong</p>
                <p className="text-sm text-gray-500 max-w-xs">
                    We couldn't process the bid acceptance. Please try again.
                </p>
            </div>

            <button
                onClick={onRetry}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]"
            >
                Try Again
            </button>
        </div>
    );
}

function SuccessState({ bid, countdown, taskId, navigate }) {

    return (
        <div className="flex flex-col items-center justify-center py-16 gap-6">

            <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">Bid Accepted!</p>
                <p className="text-sm text-gray-500 mt-1">
                    Redirecting to Work Progress in{' '}
                    <span className="font-bold text-[#0A6E5C]">{countdown}s</span>
                </p>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm w-full max-w-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#0A6E5C] to-emerald-400" />
                <div className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {bid?.worker?.selfie ? (
                            <img src={bid.worker.selfie} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-extrabold text-[#0A6E5C]">
                                {bid?.worker?.name?.charAt(0)}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{bid?.worker?.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star size={11} fill="#FBBF24" color="#FBBF24" />
                            <span className="text-xs font-semibold text-gray-700">{bid?.worker?.rating}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                            ETA · <span className="font-semibold text-gray-600">{bid?.eta ?? '—'}</span>
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Agreed Bid</p>
                        <p className="text-xl font-extrabold text-gray-900">₹{bid?.amount}</p>
                    </div>
                </div>

                {bid?.pitch && (
                    <p className="mx-5 mb-4 px-3 py-2 text-xs text-gray-500 italic bg-emerald-50 border-l-2 border-[#0A6E5C]/40 rounded-r-lg leading-relaxed">
                        “{bid.pitch}”
                    </p>
                )}
            </div>

            {/* Manual redirect */}
            <button
                onClick={() => navigate(`/poster/work-progress/${taskId}`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]"
            >
                Go to Work Progress
                <ArrowRight size={15} />
            </button>
        </div>
    );
}


const ReviewBids = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();

    const [pendingAccept, setPendingAccept] = useState(null);
    const [acceptedBidDetails, setAcceptedBidDetails] = useState(null);
    const [sort, setSort] = useState(SORT_OPTIONS[0].label);
    const [showSort, setShowSort] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const countdownRef = useRef(null);


    function formatDate(dateStr) {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    const { data } = useGetPosterBidsQuery({ taskId, sort });

    console.log("taskId", taskId);
    console.log("data : ", data);
    const taskData = data?.data?.task;
    console.log("taskData : ", taskData);
    const bidsData = data?.data?.bids;
    console.log("bidsData : ", bidsData);

    const [acceptBid, { data: acceptBidData, isLoading: isLoadingAcceptBid, isSuccess: isSuccessAcceptBid, isError: isErrorAcceptBid, error: acceptBidError, reset: resetAcceptBid }] = useAcceptBidMutation();

    const handleConfirmAccept = async () => {
        try {
            setAcceptedBidDetails(pendingAccept);
            const response = await acceptBid(pendingAccept._id).unwrap();
            showSuccess("Bid accepted successfully");
            console.log('response : ', response);
        } catch (error) {
            console.log(error);
            showError("Failed to accept bid, Please retry after some time");
        } finally {
            setPendingAccept(null);
        }
    };

    useEffect(() => {
        if (isSuccessAcceptBid) {
            setCountdown(5);
            countdownRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownRef.current);
                        navigate(`/poster/work-progress/${taskData?._id}`, { replace: true });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(countdownRef.current);
    }, [isSuccessAcceptBid]);

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <PosterNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <PosterHeader />

                <div className="flex-1 overflow-y-auto">

                    {/* ── Sticky top bar ── */}
                    <div className="sticky top-0 z-10 bg-[#F6FAF8]/95 backdrop-blur-sm border-b border-gray-200
                                    px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => navigate('/poster/my-tasks', { replace: true })}
                                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium shrink-0"
                            >
                                <ArrowLeft size={16} />
                                <span className="hidden sm:inline">Back to My Tasks</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                            <span className="text-gray-300 hidden sm:inline">·</span>
                            <p className="text-sm text-gray-500 truncate hidden sm:block">
                                For:{' '}
                                <span className="font-semibold text-gray-800">{data ? taskData.title : "Loading..."}</span>
                            </p>
                        </div>

                        <span className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                         bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {bidsData?.length} {bidsData?.length == 1 ? "Bid" : "Bids"} Received
                        </span>
                    </div>

                    <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full">

                        {/* ── Task Summary Banner ── */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 mb-6
                                        grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project</p>
                                <p className="font-bold text-gray-900 text-sm">{taskData?.category}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Budget</p>
                                <p className="font-extrabold text-[#0A6E5C] text-base">₹{taskData?.amount}.00</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                                <p className=" text-xs text-gray-700 font-semibold flex items-center gap-1">
                                    <MapPin size={12} className="text-[#0A6E5C]" />
                                    {taskData?.address?.landmark},{taskData?.address?.city}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Deadline</p>
                                <p className="font-semibold text-gray-700 text-sm flex items-center gap-1">
                                    <Calendar size={12} className="text-[#0A6E5C]" />
                                    {/* {MOCK_TASK.deadline} */}
                                    {formatDate(taskData?.deadline)}
                                </p>
                            </div>
                        </div>

                        {/* ── Compare Bids header + Sort ── */}
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-sm md:text-base font-extrabold text-gray-900">Compare Bids</h1>

                            <div className="relative">
                                <button
                                    onClick={() => setShowSort((v) => !v)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white
                                               text-xs sm:text-sm font-semibold text-gray-700 hover:border-[#0A6E5C]/40 transition-colors shadow-sm"
                                >
                                    Sort by:{' '}
                                    <span className="text-[#0A6E5C] text-xs sm:text-sm font-bold">{sort}</span>
                                    <ChevronDown size={14} className={`transition - transform text - [#0A6E5C] ${showSort ? 'rotate-180' : ''} `} />
                                </button>

                                {showSort && (
                                    <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                        {SORT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSort(opt.label); setShowSort(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors rounded-md
                                                    ${sort === opt.label
                                                        ? 'bg-[#0A6E5C] text-white font-bold'
                                                        : 'text-gray-700 hover:bg-emerald-50 font-medium'
                                                    } `}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                        {isLoadingAcceptBid ? (
                            <LoadingState bid={acceptedBidDetails} />
                        ) : isErrorAcceptBid ? (
                            <ErrorState onRetry={() => { resetAcceptBid?.(); setAcceptedBidDetails(null); }} />
                        ) : isSuccessAcceptBid ? (
                            <SuccessState
                                bid={acceptedBidDetails}
                                countdown={countdown}
                                taskId={taskData?._id}
                                navigate={navigate}
                            />
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {bidsData?.map((bid) => (
                                    <BidCard
                                        key={bid._id}
                                        bid={bid}
                                        onAccept={(b) => setPendingAccept(b)}
                                    />
                                ))}
                            </div>
                        )}

                        {bidsData?.length === 0 && (
                            <div className="text-center py-20 text-gray-400 text-sm">
                                No bids received yet for this task.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {pendingAccept && (
                <AcceptModal
                    bid={pendingAccept}
                    onConfirm={handleConfirmAccept}
                    onCancel={() => setPendingAccept(null)}
                />
            )}
        </div>
    );
};

export default ReviewBids;
