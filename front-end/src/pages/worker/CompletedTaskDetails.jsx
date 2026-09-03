import { useNavigate, useParams } from 'react-router-dom';

import WorkerNavBar from '../../layouts/Worker/WorkerNavBar';
import WorkerHeader from '../../layouts/Worker/WorkerHeader';

import TaskHeaderBanner from '../../components/sharedComponents/CompletedTask/TaskHeaderBanner';
import TaskSummaryCard from '../../components/sharedComponents/CompletedTask/TaskSummaryCard';
import FinalInvoiceCard from '../../components/sharedComponents/CompletedTask/FinalInvoiceCard';
import ReviewCard from '../../components/sharedComponents/CompletedTask/ReviewCard';
import { useGetCompletedTaskWorkerSideQuery } from '../../store/services/workerApi';

import PageLoader from '../../components/sharedComponents/CompletedTask/PageLoader';
import PageError from '../../components/sharedComponents/CompletedTask/PageError';

// ─── Main Worker Completed Task Page ──────────────────────────────────────────
const WorkerCompletedTaskDetails = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();

    const { data: response, isLoading, isError } = useGetCompletedTaskWorkerSideQuery(taskId);

    const raw = response?.data;

    // Derived values
    const address = raw?.address;
    const fullAddress = typeof address === 'string'
        ? address
        : address && typeof address === 'object'
            ? [address.houseNumber, address.landmark, address.area, address.city, address.district, address.state]
                .filter(Boolean)
                .join(", ")
            : null;

    const task = raw ? {
        title: raw.title,
        category: raw.category,
        budget: raw.amount,
        finalPayment: raw.bid?.amount ?? raw.amount,
        ratingGiven: raw.review?.rating ?? null,
        description: raw.description,
        address: fullAddress,
        photos: raw.photos || [],
        completedOn: raw.completedOn
            ? new Date(raw.completedOn).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
            : raw.createdAt
                ? new Date(raw.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })
                : 'Recently',
    } : null;

    const poster = raw?.poster ? {
        name: raw.poster.name,
        email: raw.poster.email,
        phone: raw.poster.phone,
        avatar: raw.poster.avatar,
    } : null;

    const acceptedBid = Number(raw?.bid?.amount) || Number(raw?.amount) || 0;
    const platformFee = raw?.platformFee != null ? Number(raw.platformFee) : Number((acceptedBid * 0.05).toFixed(2));
    const creditedAmount = Number((acceptedBid - platformFee).toFixed(2));

    const invoice = raw ? {
        acceptedBid,
        platformFee,
        creditedAmount,
    } : null;

    const review = raw?.review?._id ? {
        rating: raw.review.rating,
        text: raw.review.review,
        publishedOn: raw.review.createdAt
            ? new Date(raw.review.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })
            : null,
    } : null;

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                <div className="flex-1 overflow-y-auto">
                    {isLoading && <PageLoader />}
                    {isError && (
                        <PageError
                            onBack={() => navigate('/worker/my-bids')}
                            buttonText="Back to My Bids"
                            title="Task Details Unavailable"
                            message="We couldn't fetch the details for this completed task. Please check your connection or return to your bids."
                        />
                    )}

                    {!isLoading && !isError && task && (
                        <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4 pb-16">
                            <TaskHeaderBanner
                                title={task.title}
                                backUrl="/worker/my-bids"
                                backText="Back to My Bids"
                                tagText="Completed Task"
                                badgeText="COMPLETED & PAID"
                            />

                            <TaskSummaryCard
                                task={task}
                                poster={poster}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FinalInvoiceCard
                                    invoice={invoice}
                                    isWorker={true}
                                />
                                <ReviewCard
                                    review={review}
                                    title="Poster Rating & Review"
                                    emptyTitle="No Review Yet"
                                    emptyText="The poster has not submitted a review for this completed task yet."
                                    viewAllLink="/worker/all-reviews"
                                    viewAllText="View All My Reviews"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerCompletedTaskDetails;
