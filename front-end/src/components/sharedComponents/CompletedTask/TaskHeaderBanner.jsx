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
        <div className="mb-6">
            {/* Back button */}
            <button
                onClick={() => navigate(backUrl)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-semibold mb-4"
            >
                <ArrowLeft size={16} />
                {backText}
            </button>

            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-[#0A6E5C] uppercase tracking-widest mb-1">
                        {tagText}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                        Completed Task Details
                    </h1>
                    {title && (
                        <p className="text-sm text-gray-500 mt-1 font-medium">{title}</p>
                    )}
                </div>

                <span className="self-start flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-xs font-bold shrink-0 shadow-xs">
                    <CheckCircle size={14} />
                    {badgeText}
                </span>
            </div>
        </div>
    );
};

export default TaskHeaderBanner;
