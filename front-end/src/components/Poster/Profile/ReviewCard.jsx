import { Star } from "lucide-react";

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-3 sm:p-3.5 flex flex-col gap-2 min-w-0">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
          {review.workerName?.charAt(0).toUpperCase() || "W"}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-xs sm:text-sm">
            {review.workerName}
          </p>
          <p className="text-[9px] font-bold tracking-widest text-[#0A6E5C] uppercase">
            {review.category}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={11}
            className={
              s <= review.rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200 fill-gray-200"
            }
          />
        ))}
      </div>
    </div>
    <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
  </div>
);

export default ReviewCard;
