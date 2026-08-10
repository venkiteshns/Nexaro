import { Pencil, ArrowLeftRight, Star } from 'lucide-react';

/**
 * WorkerProfileBanner
 * Props: worker { name, category, rating, isLive, avatar }
 *        onEditClick, onSwitchToPoster
 */
const WorkerProfileBanner = ({ worker, onEditClick, onSwitchToPoster }) => {
    
    const initials = worker?.name
        ? worker.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'WK';

    return (
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-5">
            {/* Gradient banner */}
            <div
                className="h-28 sm:h-36 w-full"
                style={{
                    background: 'linear-gradient(135deg, #0A6E5C 0%, #14b89a 50%, #d1fae5 100%)',
                }}
            />

            {/* Profile row */}
            <div className="bg-white px-5 sm:px-7 pb-5">
                <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between gap-4 -mt-10 min-[420px]:-mt-12">

                    {/* Avatar + name */}
                    <div className="flex items-end gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md bg-[#0A6E5C] flex items-center justify-center shrink-0">
                            {worker?.avatar ? (
                                <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white">{initials}</span>
                            )}
                        </div>

                        <div className="mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-sm sm:text-base md:text-xl font-extrabold text-gray-900 leading-tight whitespace-nowrap">
                                    {worker?.name || 'Worker Name'}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Rating + actions */}
                    <div className="flex flex-col items-start min-[420px]:items-end gap-2 pb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">{Number(worker?.rating).toFixed(1) ?? '4.9'}</span>
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={11}
                                        className="sm:w-[13px] sm:h-[13px] md:w-[14px] md:h-[14px]"
                                        fill={s <= Math.round(worker?.rating ?? 3.5) ? '#F59E0B' : 'transparent'}
                                        color={s <= Math.round(worker?.rating ?? 3.5) ? '#F59E0B' : '#D1D5DB'}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">TOP RATED</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onEditClick}
                                className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#0A6E5C] hover:text-[#085e4e] transition-colors"
                            >
                                <Pencil size={10} className="sm:w-3 sm:h-3" />
                                Edit Profile
                            </button>
                            <span className="text-gray-200">|</span>
                            <button
                                onClick={onSwitchToPoster}
                                className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-500 hover:text-[#0A6E5C] transition-colors"
                            >
                                <ArrowLeftRight size={10} className="sm:w-3 sm:h-3" />
                                Switch to Poster
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkerProfileBanner;
