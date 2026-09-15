import { Star } from 'lucide-react';

const RatingInput = ({ value, onChange, error }) => {
    return (
        <div>
            <div className="flex items-center gap-2" role="group" aria-label="Star rating">
                {Array.from({ length: 5 }, (_, i) => {
                    const starValue = i + 1;
                    const isFilled = starValue <= value;
                    return (
                        <button
                            key={starValue}
                            type="button"
                            aria-label={`Rate ${starValue} out of 5`}
                            onClick={() => onChange(starValue)}
                            className="transition-transform duration-100 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A6E5C] rounded"
                        >
                            <Star
                                size={36}
                                fill={isFilled ? '#FBBF24' : 'none'}
                                color={isFilled ? '#FBBF24' : '#D1D5DB'}
                                className="transition-colors duration-150"
                            />
                        </button>
                    );
                })}
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>
            )}
        </div>
    );
};

export default RatingInput;
