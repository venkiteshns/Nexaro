import { Star } from "lucide-react";

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 min-w-0">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {review.workerName?.charAt(0).toUpperCase() || "W"}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {review.workerName}
          </p>
          <p className="text-[10px] font-bold tracking-widest text-[#0A6E5C] uppercase">
            {review.category}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={13}
            className={
              s <= review.rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200 fill-gray-200"
            }
          />
        ))}
      </div>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
  </div>
);

export default ReviewCard;
