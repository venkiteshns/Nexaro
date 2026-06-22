import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TaskHeaderBanner = ({ title }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            {/* Back button */}
            <button
                onClick={() => navigate('/poster/my-tasks')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium mb-5"
            >
                <ArrowLeft size={16} />
                Back to My Tasks
            </button>

            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <p className="text-xs font-bold text-[#0A6E5C] uppercase tracking-widest mb-1">
                        Completed Task
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                        Completed Task Details
                    </h1>
                    {title && (
                        <p className="text-sm text-gray-500 mt-1">{title}</p>
                    )}
                </div>

                <span className="self-start flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold shrink-0">
                    <CheckCircle size={14} />
                    COMPLETED
                </span>
            </div>
        </div>
    );
};

export default TaskHeaderBanner;
