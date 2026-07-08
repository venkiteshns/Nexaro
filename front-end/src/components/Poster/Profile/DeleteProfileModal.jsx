import { Trash2 } from "lucide-react";

const DeleteProfileModal = ({ onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-1 w-full bg-linear-to-r from-red-400 to-rose-500" />
      <div className="p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mb-5">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
          Delete Profile?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-1 px-2">
          This action is{" "}
          <span className="font-semibold text-gray-700">permanent</span> and
          cannot be undone.
        </p>
        <p className="text-xs text-gray-400 mb-7">
          All your tasks, reviews and data will be erased.
        </p>
        <button className="w-full py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-[0.98] transition-all duration-150 shadow-sm mb-3">
          Yes, Delete My Profile
        </button>
        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default DeleteProfileModal;
