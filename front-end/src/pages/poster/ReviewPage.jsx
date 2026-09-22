import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowLeft, Wrench } from 'lucide-react';
import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';
import ReviewForm from '../../components/Poster/Review/ReviewForm';
import WorkerReviewCard from '../../components/Poster/Review/WorkerReviewCard';
import { useGetCompletedTaskPosterSideQuery } from '../../store/services/posterApi';

function PageLoader() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
            <div className="relative w-20 h-20">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0A6E5C] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Wrench size={22} className="text-[#0A6E5C]" />
                </div>
            </div>
            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Loading Review Page</p>
                <p className="text-sm text-gray-400">Fetching task and worker details…</p>
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

function PageError({ onBack }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-500" />
            </div>
            <div>
                <p className="text-base font-extrabold text-gray-900 mb-1">Failed to Load</p>
                <p className="text-sm text-gray-400 max-w-xs">
                    We couldn&#39;t fetch the task details. Please check your connection and try again.
                </p>
            </div>
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white
                           text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]"
            >
                <ArrowLeft size={15} />
                Back to My Tasks
            </button>
        </div>
    );
}

const ReviewPage = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();

    const { data, isLoading, isError } = useGetCompletedTaskPosterSideQuery(taskId);
    const raw = data?.data?.[0];

    const workerProps = raw?.worker
        ? {
            name: raw.worker.name,
            avatar: raw.worker.selfie || null,
            category: raw.category || null,
            rating: raw.worker.rating,
        }
        : null;

    const taskProps = raw
        ? {
            amount: raw.bid?.amount ?? raw.amount ?? 0,
            status: raw.status,
            completedOn: raw.completedOn
                ? new Date(raw.completedOn).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })
                : null,
            location: raw.address?.landmark
                ? `${raw.address.landmark}${raw.address.district ? `, ${raw.address.district}` : ''}`
                : raw.address?.district || null,
        }
        : null;

    const revieweeId = raw?.workerId?.toString() ?? null;
    const alreadyReviewed = Boolean(raw?.review?._id);

    const handleReviewSuccess = (tid) => {
        setTimeout(() => {
            navigate(`/poster/completed-task/${tid}`, { replace: true });
        }, 1500);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <PosterNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <PosterHeader />

                <div className="flex-1 overflow-y-auto">

                    {isLoading && <PageLoader />}
                    {isError && (
                        <PageError onBack={() => navigate('/poster/my-tasks')} />
                    )}

                    {!isLoading && !isError && raw && (
                        <div className="p-3 sm:p-5 lg:p-6 max-w-5xl mx-auto w-full">

                            <div className="mb-3 sm:mb-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium mb-2"
                                >
                                    <ArrowLeft size={14} />
                                    Back
                                </button>
                                <p className="text-[10px] font-bold text-[#0A6E5C] uppercase tracking-widest mb-0.5">
                                    Review Worker
                                </p>
                                <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">
                                    Rate Your Experience
                                </h1>
                                <p className="text-xs text-gray-500 mt-0.5">{raw.title}</p>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2.5 mb-3.5">
                                <div className="w-8 h-8 rounded-full bg-[#0A6E5C] flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#0A6E5C] text-xs sm:text-sm">Payment Released Successfully!</p>
                                    <p className="text-xs text-emerald-700">
                                        ₹{taskProps?.amount ?? 0} has been sent to {workerProps?.name ?? 'the worker'}.
                                    </p>
                                </div>
                            </div>

                            {alreadyReviewed ? (
                                <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6 text-center">
                                    <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle2 size={22} className="text-[#0A6E5C]" />
                                    </div>
                                    <p className="text-base font-extrabold text-gray-900 mb-1">
                                        Already Reviewed
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        You have already submitted a review for this task.
                                    </p>
                                    <button
                                        onClick={() => navigate(`/poster/completed-task/${taskId}`)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A6E5C] text-white text-xs font-bold hover:bg-[#085e4e] transition-all"
                                    >
                                        View Task Details
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-3.5">
                                    <div className="lg:col-span-2 space-y-3">
                                        {revieweeId && (
                                            <ReviewForm
                                                taskId={taskId}
                                                revieweeId={revieweeId}
                                                workerName={workerProps?.name ?? 'the worker'}
                                                onSuccess={handleReviewSuccess}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <WorkerReviewCard
                                            worker={workerProps}
                                            task={taskProps}
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
