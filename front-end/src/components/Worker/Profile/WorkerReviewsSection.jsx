import { Star } from 'lucide-react';

export const WorkerReviewItem = ({ review }) => {
    const initials = review?.reviewerName
        ? review.reviewerName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'AN';

    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3 sm:p-3.5">
            <div className="flex items-start justify-between gap-2.5 mb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <span className="text-xs font-extrabold text-[#0A6E5C]">{initials}</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-900">{review?.reviewerName || 'Ananya Sharma'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            size={11}
                            fill={s <= (review?.rating ?? 5) ? '#F59E0B' : 'transparent'}
                            color={s <= (review?.rating ?? 5) ? '#F59E0B' : '#D1D5DB'}
                        />
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
                {review?.text || ' No Review Given'}
            </p>
        </div>
    );
};

const WorkerReviewsSection = ({ reviews, totalCount, onViewAll }) => {

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs sm:text-sm font-bold text-gray-900">
                    Reviews
                    {totalCount && (
                        <span className="ml-1 text-xs font-semibold text-gray-400">({totalCount})</span>
                    )}
                </h2>
            </div>

            {reviews.length > 0 ?
                 <div className="flex flex-col gap-2.5">
                    {reviews.map((review, idx) => (
                        <WorkerReviewItem key={idx} review={review} />
                    ))}
                </div> : 
                <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/70">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50 mb-2">
                        <Star
                            size={16}
                            className="text-[#0A6E5C]"
                        />
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-gray-700">
                        No reviews yet
                    </p>

                    <p className="mt-0.5 max-w-xs text-xs text-gray-400 leading-relaxed">
                        You haven't received any reviews yet.
                    </p>
                </div>
            }

            {totalCount > 0 && <button
                onClick={onViewAll}
                className="w-full mt-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700
                           hover:bg-emerald-50 hover:border-emerald-200 hover:text-[#0A6E5C] transition-all duration-150 cursor-pointer"
            >
                {totalCount > 2 ? `View All ${totalCount} Reviews` : "View All Reviews"}
            </button>}
        </div>
    );
};

export default WorkerReviewsSection;
