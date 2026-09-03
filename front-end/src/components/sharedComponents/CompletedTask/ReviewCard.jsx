import { Star, MessageSquareOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewCard = ({
    review,
    title = "Your Review",
    emptyTitle = "No Review Yet",
    emptyText = "You haven't submitted a review for this task.",
    viewAllLink = null,
    viewAllText = "View All Reviews"
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col justify-between">
            <div>
                <p className="font-extrabold text-gray-900 text-base mb-4">{title}</p>

                {review?.rating != null ? (
                    <div className="space-y-3">
                        {/* Stars + Score */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        fill={i < Math.round(review.rating) ? '#FBBF24' : 'none'}
                                        color={i < Math.round(review.rating) ? '#FBBF24' : '#D1D5DB'}
                                    />
                                ))}
                            </div>
                            <span className="text-base font-black text-gray-900">
                                {Number(review.rating).toFixed(1)} <span className="text-xs text-gray-400 font-normal">/ 5.0</span>
                            </span>
                        </div>

                        {/* Review text */}
                        {review.text ? (
                            <blockquote className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-[#0A6E5C] pl-4 py-1 bg-gray-50/80 rounded-r-xl">
                                "{review.text}"
                            </blockquote>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No written comment provided.</p>
                        )}

                        {review.publishedOn && (
                            <p className="text-[11px] text-gray-400 pt-1">Published on {review.publishedOn}</p>
                        )}
                    </div>
                ) : (
                    /* ── No review state ── */
                    <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
                            <MessageSquareOff size={22} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700">{emptyTitle}</p>
                            <p className="text-xs text-gray-400 mt-0.5 max-w-xs">
                                {emptyText}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {viewAllLink && (
                <div className="pt-4 border-t border-gray-100 mt-4">
                    <Link
                        to={viewAllLink}
                        className="w-full py-2.5 rounded-xl border border-gray-200 hover:border-[#0A6E5C] text-gray-700 hover:text-[#0A6E5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-gray-50/60 hover:bg-emerald-50/50"
                    >
                        <Star size={14} />
                        {viewAllText}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
