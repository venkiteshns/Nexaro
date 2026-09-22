import { Wrench } from 'lucide-react';
import StarRow from './StarRow';

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

const ReviewCard = ({ review, colorIdx = 0 }) => {
    const color = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-xs p-3 sm:p-3.5 hover:shadow-sm hover:border-emerald-100 transition-all duration-200">

            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 sm:gap-2.5">

                    <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${color.bg} flex items-center justify-center shrink-0 border border-gray-100`}
                    >
                        <span className={`text-[10px] sm:text-xs font-extrabold ${color.text}`}>
                            {getInitials(review?.reviewerName)}
                        </span>
                    </div>

                    <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">{review?.reviewerName}</p>
                        <StarRow rating={review?.rating} size={9} />
                    </div>

                </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-2 sm:mb-2.5">{review?.review}</p>

            <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-full px-2 py-0.5">
                    <Wrench size={8} className="text-[#0A6E5C] shrink-0" />
                    <span className="text-[10px] font-semibold">{review?.taskTitle}</span>
                </div>
            </div>

        </div>
    );
};

export default ReviewCard;
