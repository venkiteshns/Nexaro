import { Pencil, ArrowLeftRight, Star, ShieldCheck, Clock } from 'lucide-react';

const WorkerProfileBanner = ({ worker, isLoading = false, onEditClick, onSwitchToPoster }) => {
    if (isLoading) {
        return (
            <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs animate-pulse">
                <div
                    className="h-11 sm:h-13 w-full"
                    style={{
                        background: 'linear-gradient(135deg, #0A6E5C 0%, #14b89a 50%, #d1fae5 100%)',
                    }}
                />
                <div className="bg-white px-4 sm:px-5 pb-3.5 sm:pb-4">
                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between gap-3 sm:gap-4">
                        <div className="flex items-end gap-3 sm:gap-3.5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-3 border-white shadow-sm bg-gray-200 shrink-0 relative z-10 -mt-8 min-[420px]:-mt-10" />
                            <div className="mb-1 space-y-1.5 pb-0.5">
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                <div className="h-5 w-36 bg-gray-200 rounded" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="h-7 w-24 bg-gray-200 rounded-lg" />
                            <div className="h-7 w-28 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const initials = worker?.name
        ? worker.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs">
            <div
                className="h-11 sm:h-13 w-full"
                style={{
                    background: 'linear-gradient(135deg, #0A6E5C 0%, #14b89a 50%, #d1fae5 100%)',
                }}
            />

            <div className="bg-white px-4 sm:px-5 pb-3.5 sm:pb-4">
                <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between gap-3 sm:gap-4">

                    <div className="flex items-end gap-3 sm:gap-3.5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-3 border-white shadow-sm bg-[#0A6E5C] flex items-center justify-center shrink-0 relative z-10 -mt-8 min-[420px]:-mt-10">
                            {worker?.avatar ? (
                                <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <span className="text-base sm:text-xl font-extrabold text-white">{initials}</span>
                            )}
                        </div>

                        <div className="mb-1">
                            <div className="mb-0.5 sm:mb-1 flex items-center">
                                {worker?.isVerified ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-[#0A6E5C] border border-emerald-200/60 shadow-2xs">
                                        <ShieldCheck size={11} />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100/80 text-amber-700 border border-amber-200 shadow-2xs">
                                        <Clock size={11} />
                                        Verification Pending
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 leading-tight whitespace-nowrap">
                                    {worker?.name || ''}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start min-[420px]:items-end gap-1.5 pb-0.5">
                        <div className="flex items-center gap-1.5">
                            <span className="text-base sm:text-lg font-extrabold text-gray-900">{Number(worker?.rating) > 0.01 ? Number(worker?.rating).toFixed(1) : '0'}</span>
                            {Number(worker?.rating) > 0.01 && <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={11}
                                        fill={s <= Math.round(worker?.rating) ? '#F59E0B' : 'transparent'}
                                        color={s <= Math.round(worker?.rating) ? '#F59E0B' : '#D1D5DB'}
                                    />
                                ))}
                            </div>}
                            <span className="text-[10px] text-gray-400 font-medium">{worker?.rating < 1 ? "No Ratings Yet" : "TOP RATED"}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                            <button
                                onClick={onEditClick}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs hover:opacity-95 transition-all duration-200 active:scale-95 cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #3fb172ff 0%, #41a593ff 100%)' }}
                            >
                                <Pencil size={11} />
                                Edit Profile
                            </button>
                            <button
                                onClick={onSwitchToPoster}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-[#0A6E5C] transition-all duration-200 active:scale-95 cursor-pointer"
                            >
                                <ArrowLeftRight size={11} />
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
