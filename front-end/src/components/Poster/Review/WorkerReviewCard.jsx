import { Star, MapPin, Calendar, ShieldCheck } from 'lucide-react';

const WorkerReviewCard = ({ worker, task }) => {
    return (
        <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-3.5 sm:p-4 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-100 mb-2.5 shrink-0">
                    {worker?.avatar ? (
                        <img
                            src={worker.avatar}
                            alt={worker?.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                            <span className="text-xl font-extrabold text-[#0A6E5C]">
                                {worker?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-gray-900 font-bold text-sm sm:text-base leading-tight">{worker?.name}</p>

                {worker?.category && (
                    <span className="mt-1.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck size={10} />
                        {worker.category}
                    </span>
                )}

                <div className="w-full mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-around">
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            Total Earned
                        </p>
                        <p className="text-gray-900 font-extrabold text-sm sm:text-base">
                            ₹{task?.amount ?? 0}
                        </p>
                    </div>
                    <div className="w-px h-6 bg-gray-100" />
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            Task Status
                        </p>
                        <span className="flex items-center gap-1 text-[#0A6E5C] font-bold text-xs sm:text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Completed
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-3.5 sm:p-4">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Task Details
                </p>
                <div className="space-y-2">
                    {task?.completedOn && (
                        <div className="flex items-start gap-2">
                            <Calendar size={13} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                    Date Completed
                                </p>
                                <p className="text-xs text-gray-900 font-semibold">{task.completedOn}</p>
                            </div>
                        </div>
                    )}
                    {task?.location && (
                        <div className="flex items-start gap-2">
                            <MapPin size={13} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                    Location
                                </p>
                                <p className="text-xs text-gray-900 font-semibold">{task.location}</p>
                            </div>
                        </div>
                    )}
                    {worker?.rating != null && (
                        <div className="flex items-start gap-2">
                            <Star size={13} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                    Worker Rating
                                </p>
                                <p className="text-xs text-gray-900 font-semibold">{worker.rating} / 5</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default WorkerReviewCard;
