import { Trash2 } from "lucide-react";

const DangerZone = ({ onDeleteClick }) => (
  <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 mb-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-sm sm:text-base font-bold text-red-500 mb-1">
          Danger Zone
        </h2>
        <p className="text-xs text-gray-400">
          Actions here are permanent and affect your ability to take new tasks.
        </p>
      </div>
      <button
        onClick={onDeleteClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-xs sm:text-sm font-bold hover:bg-red-600 active:scale-[0.98] transition-all shadow-sm shrink-0"
      >
        <Trash2 size={14} /> Delete Profile
      </button>
    </div>
  </div>
);

export default DangerZone;
