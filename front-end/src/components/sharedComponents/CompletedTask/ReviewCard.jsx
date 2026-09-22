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
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-3.5 sm:p-4 flex flex-col justify-between">
            <div>
                <p className="font-extrabold text-gray-900 text-sm mb-3">{title}</p>

                {review?.rating != null ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={15}
                                        fill={i < Math.round(review.rating) ? '#FBBF24' : 'none'}
                                        color={i < Math.round(review.rating) ? '#FBBF24' : '#D1D5DB'}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-extrabold text-gray-900">
                                {Number(review.rating).toFixed(1)} <span className="text-[11px] text-gray-400 font-normal">/ 5.0</span>
                            </span>
                        </div>

                        {review.text ? (
                            <blockquote className="text-xs text-gray-700 leading-relaxed italic border-l-2 border-[#0A6E5C] pl-2.5 py-1 bg-gray-50/80 rounded-r-lg">
                                "{review.text}"
                            </blockquote>
                        ) : (
                            <p className="text-[11px] text-gray-400 italic">No written comment provided.</p>
                        )}

                        {review.publishedOn && (
                            <p className="text-[10px] text-gray-400 pt-0.5">Published on {review.publishedOn}</p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 gap-2 text-center">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
                            <MessageSquareOff size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-700">{emptyTitle}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 max-w-xs">
                                {emptyText}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {viewAllLink && (
                <div className="pt-3 border-t border-gray-100 mt-3">
                    <Link
                        to={viewAllLink}
                        className="w-full py-1.5 rounded-lg border border-gray-200 hover:border-[#0A6E5C] text-gray-700 hover:text-[#0A6E5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-gray-50/60 hover:bg-emerald-50/50"
                    >
                        <Star size={13} />
                        {viewAllText}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
