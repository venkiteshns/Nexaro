import { Pencil, ArrowLeftRight, Star, ShieldCheck, Clock } from 'lucide-react';

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
                className="h-15 sm:h-18 w-full"
                style={{
                    background: 'linear-gradient(135deg, #0A6E5C 0%, #14b89a 50%, #d1fae5 100%)',
                }}
            />

            {/* Profile row */}
            <div className="bg-white px-5 sm:px-7 pb-5">
                <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between gap-4">

                    {/* Avatar + name */}
                    <div className="flex items-end gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md bg-[#0A6E5C] flex items-center justify-center shrink-0 relative z-10 -mt-10 min-[420px]:-mt-12">
                            {worker?.avatar ? (
                                <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white">{initials}</span>
                            )}
                        </div>

                        <div className="mb-2">
                            {/* Verification Badge */}
                            <div className="mb-1 sm:mb-1.5 flex items-center">
                                {worker?.isVerified ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-[#0A6E5C] border border-emerald-200/60 shadow-sm">
                                        <ShieldCheck size={12} className="sm:w-[14px] sm:h-[14px]" />
                                        Verified
                                    </span>
                                ) : (
                                    <span className=" mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-amber-100/80 text-amber-700 border border-amber-200 shadow-sm">
                                        <Clock size={12} className="sm:w-[14px] sm:h-[14px]" />
                                        Verification Pending
                                    </span>
                                )}
                            </div>

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
                            <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">{Number(worker?.rating) > 0.01 ? Number(worker?.rating).toFixed(1) : '0'}</span>
                            {Number(worker?.rating) > 0.01 && <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={11}
                                        className="sm:w-[13px] sm:h-[13px] md:w-[14px] md:h-[14px]"
                                        fill={s <= Math.round(worker?.rating) ? '#F59E0B' : 'transparent'}
                                        color={s <= Math.round(worker?.rating) ? '#F59E0B' : '#D1D5DB'}
                                    />
                                ))}
                            </div>}
                            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{worker?.rating < 1 ? "No Ratings Yet" : "TOP RATED "}</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-0">
                            <button
                                onClick={onEditClick}
                                className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold text-white shadow-md shadow-emerald-900/10 hover:shadow-lg hover:opacity-95 transition-all duration-200 active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #3fb172ff 0%, #41a593ff 100%)' }}
                            >
                                <Pencil size={12} className="sm:w-3.5 sm:h-3.5" />
                                Edit Profile
                            </button>
                            <button
                                onClick={onSwitchToPoster}
                                className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-[#0A6E5C] transition-all duration-200 active:scale-95"
                            >
                                <ArrowLeftRight size={12} className="sm:w-3.5 sm:h-3.5" />
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
