import { Star } from 'lucide-react';

/**
 * StarRow — renders a row of 5 stars filled up to `rating`.
 * Props:
 *   rating  {number}  — active star count (1–5)
 *   size    {number}  — icon size in px (default 14)
 */
const StarRow = ({ rating, size = 14 }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    style={{ width: size, height: size }}
                    fill={s <= rating ? '#F59E0B' : 'transparent'}
                    color={s <= rating ? '#F59E0B' : '#D1D5DB'}
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
};

export default StarRow;
