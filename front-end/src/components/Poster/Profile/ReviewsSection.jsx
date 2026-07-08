import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "./ReviewCard";

const REVIEWS_PER_PAGE = 2;

const ReviewsSection = ({ reviews, reviewPage, setReviewPage }) => {
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const visibleReviews = reviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">Reviews Given</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
            disabled={reviewPage === 0}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0A6E5C] hover:text-[#0A6E5C] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() =>
              setReviewPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={reviewPage >= totalPages - 1}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0A6E5C] hover:text-[#0A6E5C] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleReviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setReviewPage(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === reviewPage ? "w-6 bg-[#0A6E5C]" : "w-1.5 bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
