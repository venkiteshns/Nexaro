import { AlertTriangle } from 'lucide-react';

/**
 * WorkerDangerZone
 * Props: onDeleteProfile: fn
 */
const WorkerDangerZone = ({ onDeleteProfile }) => (
    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={13} className="text-red-500 md:w-4 md:h-4" />
            </div>
            <div>
                <p className="text-xs md:text-sm font-bold text-red-600">Danger Zone</p>
                <p className="text-[10px] md:text-xs text-red-400 mt-0.5 leading-relaxed max-w-sm">
                    Actions here are permanent and affect your ability to have new tasks.
                </p>
            </div>
        </div>

        <button
            onClick={onDeleteProfile}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-1.5 md:px-5 md:py-2 rounded-xl bg-red-500 text-white text-xs md:text-sm font-bold
                       hover:bg-red-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
        >
            Delete Profile
        </button>
    </div>
);

export default WorkerDangerZone;
