import { Wrench, Star, CalendarCheck, BadgeCheck } from 'lucide-react';

/* ── Stat pill inside the summary card ── */
function StatPill({ label, value, valueClass = 'text-gray-900' }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className={`text-lg font-extrabold ${valueClass}`}>{value}</p>
        </div>
    );
}

const TaskSummaryCard = ({ task, worker }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

            {/* ── Left / Main details ── */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">

                {/* Stats row */}
                <div className="flex flex-wrap gap-6 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <Wrench size={16} className="text-[#0A6E5C]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                            <p className="text-sm font-bold text-gray-900">{task.category}</p>
                        </div>
                    </div>

                    <StatPill label="Budget" value={`₹${task.budget}`} />
                    <StatPill
                        label="Accepted Bid Amount"
                        value={`₹${task.finalPayment}`}
                        valueClass="text-[#0A6E5C]"
                    />
                    {task.ratingGiven != null && (
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating Given</p>
                            <div className="flex items-center gap-1">
                                <Star size={15} fill="#FBBF24" color="#FBBF24" />
                                <span className="text-lg font-extrabold text-gray-900">{task.ratingGiven}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Completed on + View History */}
                <div className="flex items-center gap-2 text-sm text-gray-500 pt-5">
                    <CalendarCheck size={15} className="text-[#0A6E5C]" />
                    <span>
                        Completed on:{' '}
                        <span className="font-semibold text-gray-700">{task.completedOn}</span>
                    </span>
                </div>
            </div>

            {/* ── Right / Worker profile ── */}
            {worker && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col items-center text-center gap-3">

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center">
                        {worker.avatar ? (
                            <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-extrabold text-[#0A6E5C]">
                                {worker.name?.charAt(0)}
                            </span>
                        )}
                    </div>

                    {/* Name + verified */}
                    <div>
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                            <p className="font-bold text-gray-900 text-base">{worker.name}</p>
                            {worker.isVerified && (
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold">
                                    <BadgeCheck size={10} />
                                    VERIFIED
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">Worker Profile</p>
                    </div>

                    {/* Rating stat */}
                    {worker.rating != null && (
                        <div className="flex items-center gap-6 w-full justify-center border-t border-gray-100 pt-3">
                            <div>
                                <p className="text-xl font-extrabold text-gray-900">{worker.rating}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskSummaryCard;
