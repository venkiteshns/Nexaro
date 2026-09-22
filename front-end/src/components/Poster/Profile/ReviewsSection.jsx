import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "./ReviewCard";

const REVIEWS_PER_PAGE = 2;

const ReviewsSection = ({ reviews = [], isLoading = false, reviewPage, setReviewPage }) => {
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const visibleReviews = reviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-3.5 sm:p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-900">Reviews Given</h2>
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
              disabled={reviewPage === 0}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0A6E5C] hover:text-[#0A6E5C] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() =>
                setReviewPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={reviewPage >= totalPages - 1}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0A6E5C] hover:text-[#0A6E5C] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-xs p-3 sm:p-3.5 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="h-2 bg-gray-100 rounded w-16" />
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded w-full mt-1" />
              <div className="h-2.5 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : visibleReviews.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">No reviews given yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleReviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setReviewPage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === reviewPage ? "w-5 bg-[#0A6E5C]" : "w-1.5 bg-gray-200"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
