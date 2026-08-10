import { Star, MapPin, Clock } from 'lucide-react';

/**
 * WorkerReviewItem — single review card
 * Props: review { reviewerName, location, timeAgo, rating, text }
 */
export const WorkerReviewItem = ({ review }) => {
    const initials = review?.reviewerName
        ? review.reviewerName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'AN';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            {/* Reviewer header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <span className="text-xs md:text-sm font-extrabold text-[#0A6E5C]">{initials}</span>
                    </div>
                    <div>
                        <p className="text-xs md:text-sm font-bold text-gray-900">{review?.reviewerName || 'Ananya Sharma'}</p>
                    </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            size={11}
                            className="md:w-[13px] md:h-[13px]"
                            fill={s <= (review?.rating ?? 5) ? '#F59E0B' : 'transparent'}
                            color={s <= (review?.rating ?? 5) ? '#F59E0B' : '#D1D5DB'}
                        />
                    ))}
                </div>
            </div>

            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {review?.text || ' No Review Given'}
            </p>
        </div>
    );
};

/**
 * WorkerReviewsSection
 * Props: reviews: Review[], totalCount: number, onViewAll: fn
 */
const WorkerReviewsSection = ({ reviews, totalCount, onViewAll }) => {

    return (
        <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-extrabold text-gray-900">
                    Reviews
                    {totalCount && (
                        <span className="ml-1.5 text-xs md:text-sm font-semibold text-gray-400">({totalCount})</span>
                    )}
                </h2>
            </div>

            {reviews.length > 0 ?
                 <div className="flex flex-col gap-3">
                    {reviews.map((review, idx) => (
                        <WorkerReviewItem key={idx} review={review} />
                    ))}
                </div> : 
                <div className="flex flex-col items-center justify-center text-center py-8 sm:py-10 px-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 mb-3">
                        <Star
                            size={18}
                            className="text-[#0A6E5C] sm:w-5 sm:h-5"
                        />
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-gray-700">
                        No reviews yet
                    </p>

                    <p className="mt-1 max-w-xs text-xs sm:text-sm text-gray-500 leading-relaxed">
                        You haven't received any reviews yet.
                    </p>
                </div>
            }

            {totalCount > 0 && <button
                onClick={onViewAll}
                className="w-full mt-3 py-2 md:py-2.5 rounded-2xl border border-gray-200 bg-white text-xs md:text-sm font-semibold text-gray-700
                           hover:bg-emerald-50 hover:border-emerald-200 hover:text-[#0A6E5C] transition-all duration-150"
            >
                {totalCount > 2 ? `View All ${totalCount} Reviews` : "View All Reviews"}
            </button>}
        </div>
    );
};

export default WorkerReviewsSection;
