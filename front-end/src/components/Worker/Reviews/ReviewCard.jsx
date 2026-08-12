import { Wrench } from 'lucide-react';
import StarRow from './StarRow';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
    { bg: 'bg-sky-100', text: 'text-sky-700' },
    { bg: 'bg-rose-100', text: 'text-rose-700' },
    { bg: 'bg-violet-100', text: 'text-violet-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
];

function getInitials(name = '') {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * ReviewCard — displays a single review with avatar, rating, date, text, and task badge.
 * Props:
 *   review    { reviewerName, rating, date, text, taskTitle }
 *   colorIdx  {number} — index to cycle through avatar colour palette
 */
const ReviewCard = ({ review, colorIdx = 0 }) => {
    const color = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-5 hover:shadow-md hover:border-emerald-100 transition-all duration-200">

            {/* ── Top row: avatar + name + stars ── */}
            <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Avatar initials */}
                    <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${color.bg} flex items-center justify-center shrink-0 border border-gray-100`}
                    >
                        <span className={`text-[10px] sm:text-xs font-extrabold ${color.text}`}>
                            {getInitials(review?.reviewerName)}
                        </span>
                    </div>

                    {/* Name + Stars */}
                    <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">{review?.reviewerName}</p>
                        <StarRow rating={review?.rating} size={10} />
                    </div>

                </div>
            </div>

            {/* ── Review text ── */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-2 sm:mb-3">{review?.review}</p>

            {/* ── Task badge ── */}
            <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
                    <Wrench size={9} className="text-[#0A6E5C] shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-semibold">{review?.taskTitle}</span>
                </div>
            </div>

        </div>
    );
};

export default ReviewCard;
