import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';

import TaskHeaderBanner from '../../components/Poster/CompletedTask/TaskHeaderBanner';
import TaskSummaryCard from '../../components/Poster/CompletedTask/TaskSummaryCard';
import FinalInvoiceCard from '../../components/Poster/CompletedTask/FinalInvoiceCard';
import ReviewCard from '../../components/Poster/CompletedTask/ReviewCard';
import { useGetCompletedTaskPosterSideQuery } from '../../store/services/posterApi';

// ─── Loader ────────────────────────────────────────────────────────────────────
function PageLoader() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
            <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0A6E5C] animate-spin" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Loading task details…</p>
        </div>
    );
}

// ─── Error ─────────────────────────────────────────────────────────────────────
function PageError({ onBack }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-base font-extrabold text-gray-900">Failed to load</p>
            <p className="text-sm text-gray-400 max-w-xs">
                We couldn't fetch the task details. Please check your connection and try again.
            </p>
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] transition-all"
            >
                <ArrowLeft size={15} />
                Back to My Tasks
            </button>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
const CompletedTaskDetails = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();

    const { data, isLoading, isError } = useGetCompletedTaskPosterSideQuery(taskId);

    // The service returns an array; pick the first element
    const raw = data?.data?.[0];

    // ── Derived data objects passed to sub-components ──────────────────────────
    const task = raw ? {
        title: raw.title,
        category: raw.category,
        budget: raw.amount,
        finalPayment: raw.bid?.amount ?? raw.amount,
        ratingGiven: raw.review?.rating ?? null,
        completedOn: raw.completedOn
            ? new Date(raw.completedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—',
    } : null;

    const worker = raw?.worker ? {
        name: raw.worker.name,
        avatar: raw.worker.selfie || null,
        rating: raw.worker.rating,
        phone: raw.worker.phone,
        isVerified: raw.worker.isVerified,
    } : null;

    const platformFee = raw?.platformFee ?? 0;
    const acceptedBid = raw?.bid?.amount ?? 0;

    const invoice = raw ? {
        acceptedBid,
        platformFee: platformFee,
        totalPaid: parseFloat((acceptedBid + platformFee).toFixed(2)),
    } : null;

    // review is null when no review document exists in the DB
    const review = raw?.review?._id ? {
        rating: raw.review.rating,
        text: raw.review.review,
        publishedOn: raw.review.createdAt
            ? new Date(raw.review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : null,
    } : null;
    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            {/* ── Sidebar ── */}
            <PosterNavBar />

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <PosterHeader />

                {/* ── Scrollable Body ── */}
                <div className="flex-1 overflow-y-auto">

                    {isLoading && <PageLoader />}
                    {isError && <PageError onBack={() => navigate('/poster/my-tasks')} />}

                    {!isLoading && !isError && task && (
                        <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">

                            {/* Header — passes task title as the subtitle line */}
                            <TaskHeaderBanner title={task.title} />

                            {/* Task overview + Worker profile */}
                            <TaskSummaryCard
                                task={task}
                                worker={worker}
                            />

                            {/* Invoice + Review side by side on md+ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FinalInvoiceCard invoice={invoice} />
                                <ReviewCard review={review} />
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CompletedTaskDetails;
