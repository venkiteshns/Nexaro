import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TaskHeaderBanner = ({
    title,
    backUrl = '/poster/my-tasks',
    backText = 'Back to My Tasks',
    tagText = 'Completed Task',
    badgeText = 'COMPLETED'
}) => {
    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => navigate(backUrl)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0A6E5C] transition-colors font-semibold mb-1.5"
            >
                <ArrowLeft size={14} />
                {backText}
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 sm:gap-3">
                <div>
                    <p className="text-[10px] font-bold text-[#0A6E5C] uppercase tracking-widest mb-0.5">
                        {tagText}
                    </p>
                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                        Completed Task Details
                    </h1>
                    {title && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">{title}</p>
                    )}
                </div>

                <span className="self-start flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-[11px] font-bold shrink-0 shadow-xs">
                    <CheckCircle size={12} />
                    {badgeText}
                </span>
            </div>
        </div>
    );
};

export default TaskHeaderBanner;
