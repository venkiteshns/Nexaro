import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    ChevronDown,
} from 'lucide-react';
import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';
import { useAcceptBidMutation, useGetPosterBidsQuery } from '../../store/services/posterApi';
import { showError, showSuccess } from '../../utils/toast';
import AcceptModal from '../../components/Poster/ReviewBids/BidAcceptModal';
import BidCard from '../../components/Poster/ReviewBids/BidCard';
import LoadingState from '../../components/Poster/ReviewBids/LoadingState';
import SuccessState from '../../components/Poster/ReviewBids/SuccessState';
import ErrorState from '../../components/Poster/ReviewBids/ErrorState';


const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'lowest', label: 'Lowest Bid' },
    { value: 'highest', label: 'Highest Bid' },
    { value: 'rating', label: 'Highest Rated' },
];

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

    const taskData = data?.data?.task;
    const bidsData = data?.data?.bids;

    const [acceptBid, { isLoading: isLoadingAcceptBid, isSuccess: isSuccessAcceptBid, isError: isErrorAcceptBid, reset: resetAcceptBid }] = useAcceptBidMutation();

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
    }, [isSuccessAcceptBid, navigate, taskData?._id]);

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
