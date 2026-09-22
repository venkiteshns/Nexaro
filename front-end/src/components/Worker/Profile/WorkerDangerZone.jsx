import { AlertTriangle } from 'lucide-react';

const WorkerDangerZone = ({ onDeleteProfile }) => (
    <div className="bg-red-50/80 border border-red-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={12} className="text-red-500" />
            </div>
            <div>
                <p className="text-xs font-bold text-red-600">Danger Zone</p>
                <p className="text-[10px] text-red-400 mt-0.5 leading-normal max-w-sm">
                    Actions here are permanent and affect your ability to have new tasks.
                </p>
            </div>
        </div>

        <button
            onClick={onDeleteProfile}
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold
                       hover:bg-red-600 active:scale-[0.98] transition-all duration-150 shadow-2xs cursor-pointer"
        >
            Delete Profile
        </button>
    </div>
);

export default WorkerDangerZone;
