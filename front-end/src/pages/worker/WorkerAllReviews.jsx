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

                <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
                    <div>

                        <div className="mb-3 sm:mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#0A6E5C] transition-colors mb-1.5 sm:mb-2 group"
                            >
                                <ArrowLeft
                                    size={13}
                                    className="group-hover:-translate-x-0.5 transition-transform duration-150"
                                />
                                Back to Profile
                            </button>
                            <h1 className="text-lg sm:text-xl font-extrabold text-[#0A6E5C]">
                                My Reviews
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Feedback from your clients and task history.
                            </p>
                        </div>

                        <div className="sticky top-0 z-10 -mx-3 sm:-mx-5 lg:-mx-6 px-3 sm:px-5 lg:px-6 pt-1 pb-2.5 bg-gray-50">
                            <RatingBreakdown overallRating={overallRating} totalReviews={total} breakdown={ratingBreakdown} />
                        </div>

                        <div className="mb-2 sm:mb-3">
                            <h2 className="text-xs sm:text-sm font-extrabold text-[#0A6E5C]">
                                Recent Feedback
                            </h2>
                        </div>

                        <div className="space-y-2.5 sm:space-y-3">
                            {reviews.map((review, idx) => (
                                <ReviewCard
                                    key={review._id}
                                    review={review}
                                    colorIdx={(page - 1) * PER_PAGE + idx}
                                />
                            ))}
                        </div>

                        <PaginationSections
                            totalPages={totalPages}
                            page={page}
                            onPageChange={handlePageChange}
                        />

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
