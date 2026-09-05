import { useNavigate, useParams } from 'react-router-dom';

import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';

import PageLoader from '../../components/sharedComponents/CompletedTask/PageLoader';
import PageError from '../../components/sharedComponents/CompletedTask/PageError';
import CompletedTaskContent from '../../components/sharedComponents/CompletedTask/CompletedTaskContent';
import { useGetCompletedTaskPosterSideQuery } from '../../store/services/posterApi';

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
                        <CompletedTaskContent
                            task={task}
                            worker={worker}
                            review={review}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompletedTaskDetails;
