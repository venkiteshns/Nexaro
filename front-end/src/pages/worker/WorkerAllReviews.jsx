import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import WorkerNavBar from '../../layouts/Worker/WorkerNavBar';
import WorkerHeader from '../../layouts/Worker/WorkerHeader';
import PaginationSections from '../../components/sharedComponents/PaginationSections';
import RatingBreakdown from '../../components/Worker/Reviews/RatingBreakdown';
import ReviewCard from '../../components/Worker/Reviews/ReviewCard';
import { useGetReviewsWorkerQuery } from '../../store/services/workerApi';

const PER_PAGE = 5;

// ─── WorkerAllReviews Page ───────────────────────────────────────────────────
const WorkerAllReviews = () => {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { data } = useGetReviewsWorkerQuery({ page, limit: PER_PAGE });

    const reviews = data?.data?.reviews || [];
    const total = data?.data?.totalReviews || 0;
    const totalPages = data?.data?.totalPages || 0;
    const overallRating = data?.data?.overallRating || 0;
    const ratingBreakdown = data?.data?.ratingCount || [];

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                {/* scroll container — no top-padding so sticky top-0 covers cleanly */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6">
                    <div>

                        {/* ── Page Header — carries the top padding ── */}
                        <div className="mb-4 sm:mb-6 pt-3 sm:pt-4 md:pt-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#0A6E5C] transition-colors mb-2 sm:mb-3 group"
                            >
                                <ArrowLeft
                                    size={13}
                                    className="group-hover:-translate-x-0.5 transition-transform duration-150"
                                />
                                Back to Profile
                            </button>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0A6E5C]">
                                My Reviews
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                Feedback from your clients and task history.
                            </p>
                        </div>

                        {/* ── Rating Summary Card — sticks flush to top on scroll ── */}
                        <div className="sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 pt-2 pb-3 bg-gray-50">
                            <RatingBreakdown overallRating={overallRating} totalReviews={total} breakdown={ratingBreakdown} />
                        </div>

                        {/* ── Recent Feedback heading ── */}
                        <div className="mb-2 sm:mb-4">
                            <h2 className="text-sm sm:text-base font-extrabold text-[#0A6E5C]">
                                Recent Feedback
                            </h2>
                        </div>

                        {/* ── Review Cards ── */}
                        <div className="space-y-2 sm:space-y-4">
                            {reviews.map((review, idx) => (
                                <ReviewCard
                                    key={review._id}
                                    review={review}
                                    colorIdx={(page - 1) * PER_PAGE + idx}
                                />
                            ))}
                        </div>

                        {/* ── Pagination ── */}
                        <PaginationSections
                            totalPages={totalPages}
                            page={page}
                            onPageChange={handlePageChange}
                        />

                        {/* ── Result count ── */}
                        <p className="text-center text-[11px] text-gray-400 mt-2 pb-6 uppercase tracking-wide">
                            Showing {(page - 1) * PER_PAGE + 1}–
                            {Math.min(page * PER_PAGE, total)} of {total} Reviews
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerAllReviews;
