import { Trash2 } from "lucide-react";

const DangerZone = ({ onDeleteClick }) => (
  <div className="bg-white rounded-xl border border-red-100 shadow-xs p-3.5 sm:p-4 mb-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-xs sm:text-sm font-bold text-red-500 mb-0.5">
          Danger Zone
        </h2>
        <p className="text-[11px] text-gray-400">
          Actions here are permanent and affect your ability to take new tasks.
        </p>
      </div>
      <button
        onClick={onDeleteClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 active:scale-[0.98] transition-all shadow-xs shrink-0"
      >
        <Trash2 size={12} /> Delete Profile
      </button>
    </div>
  </div>
);

export default DangerZone;
