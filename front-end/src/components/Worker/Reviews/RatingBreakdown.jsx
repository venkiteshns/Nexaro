import StarRow from './StarRow';

const RATING_BREAKDOWN = [
    { stars: 5, percent: 0 },
    { stars: 4, percent: 0 },
    { stars: 3, percent: 0 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
];

/**
 * RatingBreakdown — displays the overall rating score with a star breakdown bar chart.
 * Props:
 *   overallRating  {number}  — e.g. 4.9
 *   totalReviews   {number}  — e.g. 87
 *   breakdown      {Array}   — [{ stars, percent }] (optional, falls back to static mock)
 */
const RatingBreakdown = ({ overallRating = 0, totalReviews = 0, breakdown }) => {

    const getBreakDown = (data) => {
        return [1, 2, 3, 4, 5].map((stars) => {
            const rating = data.find((item) => item._id == stars);

            const count = rating?.count || 0;
            return {
                stars,
                count,
                percent: ((Number(count) / Number(totalReviews)) * 100).toFixed(1)
            }
        })
    }
    const ratingBreakdown = getBreakDown(breakdown) || RATING_BREAKDOWN;
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-5 md:p-6">
            <div className="flex flex-row gap-4 sm:gap-10 items-center">

                {/* ── Overall score ── */}
                <div className="flex flex-col items-center shrink-0 text-center">
                    <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#0A6E5C] leading-none">
                        {overallRating}
                    </span>
                    <StarRow rating={5} size={14} />
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Based on {totalReviews} reviews</p>
                </div>

                {/* ── Star bars ── */}
                <div className="flex-1 w-full space-y-1.5 sm:space-y-2.5">
                    {ratingBreakdown.map(({ stars, percent }) => (
                        <div key={stars} className="flex items-center gap-1.5 sm:gap-3">
                            <span className="text-[9px] sm:text-[11px] font-semibold text-gray-500 w-8 sm:w-12 shrink-0 text-right">
                                {stars}★
                            </span>
                            <div className="flex-1 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${percent}%`,
                                        background:
                                            percent > 50
                                                ? '#0A6E5C'
                                                : percent > 5
                                                    ? '#34D399'
                                                    : percent > 0
                                                        ? '#6EE7B7'
                                                        : 'transparent',
                                    }}
                                />
                            </div>
                            <span className="text-[9px] sm:text-[11px] font-semibold text-gray-400 w-6 sm:w-7 shrink-0">
                                {percent}%
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default RatingBreakdown;
