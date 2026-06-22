import React from 'react';
import { Star, MessageSquareOff } from 'lucide-react';

const ReviewCard = ({ review }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <p className="font-extrabold text-gray-900 text-base mb-4">Your Review</p>

            {review ? (
                <>
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={22}
                                fill={i < Math.round(review.rating) ? '#FBBF24' : 'none'}
                                color={i < Math.round(review.rating) ? '#FBBF24' : '#D1D5DB'}
                            />
                        ))}
                    </div>

                    {/* Review text */}
                    <blockquote className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-green-200 pl-4">
                        "{review.text}"
                    </blockquote>

                    {review.publishedOn && (
                        <p className="text-xs text-gray-400 mt-3">Published on {review.publishedOn}</p>
                    )}
                </>
            ) : (
                /* ── No review state ── */
                <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                        <MessageSquareOff size={20} className="text-gray-300" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">No Review Yet</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            You haven't submitted a review for this task.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;

