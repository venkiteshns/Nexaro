import { ClipboardList, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';

function getStatusConfig(status) {
    switch (status) {
        case 'open':
            return { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-600 border-blue-200', label: 'OPEN', Icon: ClipboardList };
        case 'assigned':
            return { dot: 'bg-yellow-500', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'ASSIGNED', Icon: Loader2 };
        case 'in_progress':
            return { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-600 border-purple-200', label: 'IN PROGRESS', Icon: Loader2 };
        case 'completed':
            return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'COMPLETED', Icon: CheckCircle2 };
        case 'cancelled':
            return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-600 border-red-200', label: 'CANCELLED', Icon: XCircle };
        default:
            return { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500 border-gray-200', label: 'UNKNOWN', Icon: Clock };
    }
}

const TaskHeaderBanner = ({ task }) => {
    const config = getStatusConfig(task.status);

    const isActive = ['assigned', 'in_progress', 'completed'].includes(task.status);

    return (
        <div className={`relative shrink-0 w-full rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 pb-5 sm:pb-6 ${isActive ? 'bg-[#0A6E5C]' : task.status === 'cancelled' ? 'bg-red-800/90' : 'bg-gray-800'}`}>

            <div className="relative flex flex-col items-start">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold border mb-2 sm:mb-3 ${config.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                </span>

                <h1 className="text-base sm:text-xl md:text-2xl font-bold sm:font-extrabold text-white leading-snug mb-0.5 sm:mb-1 break-words w-full">
                    {task.title}
                </h1>
                <p className="text-xs sm:text-sm text-white/70">{task.category}</p>

                <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20">
                    <ClipboardList size={12} className="sm:w-3.5 sm:h-3.5 text-white/70" />
                    <span className="text-[11px] sm:text-xs font-semibold text-white/80">
                        {task.bidCount ?? 0} bid{task.bidCount !== 1 ? 's' : ''} placed
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TaskHeaderBanner;
