import { Star, MapPin, Calendar, ShieldCheck } from 'lucide-react';

/**
 * WorkerReviewCard — sidebar card showing worker info and task context.
 *
 * Props:
 *   worker  { name, avatar, category, rating }
 *   task    { amount, status, completedOn, location }
 */
const WorkerReviewCard = ({ worker, task }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* ── Worker profile card ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-100 mb-4 shrink-0">
                    {worker?.avatar ? (
                        <img
                            src={worker.avatar}
                            alt={worker?.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                            <span className="text-3xl font-extrabold text-[#0A6E5C]">
                                {worker?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Name */}
                <p className="text-gray-900 font-bold text-lg leading-tight">{worker?.name}</p>

                {/* Category badge */}
                {worker?.category && (
                    <span className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck size={11} />
                        {worker.category}
                    </span>
                )}

                {/* Stats row */}
                <div className="w-full mt-5 pt-4 border-t border-gray-100 flex items-center justify-around">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            Total Earned
                        </p>
                        <p className="text-gray-900 font-extrabold text-base">
                            ₹{task?.amount ?? 0}
                        </p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            Task Status
                        </p>
                        <span className="flex items-center gap-1 text-[#0A6E5C] font-bold text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Completed
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Task details card ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Task Details
                </p>
                <div className="space-y-3">
                    {task?.completedOn && (
                        <div className="flex items-start gap-3">
                            <Calendar size={15} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Date Completed
                                </p>
                                <p className="text-sm text-gray-900 font-semibold">{task.completedOn}</p>
                            </div>
                        </div>
                    )}
                    {task?.location && (
                        <div className="flex items-start gap-3">
                            <MapPin size={15} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Location
                                </p>
                                <p className="text-sm text-gray-900 font-semibold">{task.location}</p>
                            </div>
                        </div>
                    )}
                    {worker?.rating != null && (
                        <div className="flex items-start gap-3">
                            <Star size={15} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Worker Rating
                                </p>
                                <p className="text-sm text-gray-900 font-semibold">{worker.rating} / 5</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default WorkerReviewCard;
