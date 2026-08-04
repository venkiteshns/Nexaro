import {Loader2, Trash2 } from "lucide-react";
import { useDeleteProfileMutation } from "../../../store/services/sharedApi";
import { useUserLogoutMutation } from "../../../store/services/authApi";
import { useDispatch } from "react-redux";
import { logOut } from "../../../store/Slices/UserSlice";
import { showWarning } from "../../../utils/toast";

const DeleteProfileModal = ({ onClose, userId }) => {

  const [deleteUserProfile,{isLoading}] = useDeleteProfileMutation();
  const [userLogout] = useUserLogoutMutation();
  const dispatch = useDispatch();

   const handleLogout = async () => {
      try {
        await userLogout().unwrap();
        onClose();
        showWarning("Your profile has been deleted. You will be logged out.");
      } catch {
        // log out locally even if API fails
      } finally {
        setTimeout(() => {
          dispatch(logOut());
        }, 3000);
      }
    };

  const deleteProfile = async (userId) => {
    try {
      let res = await deleteUserProfile(userId).unwrap();
      if(!res.success){
        throw new Error(res.message || "Failed to delete profile");
      }
      handleLogout();
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  }

  return (
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
          <button 
            onClick={() => deleteProfile(userId)} 
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-[0.98] transition-all duration-150 shadow-sm mb-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-red-300 disabled:active:scale-100" >
            {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Deleting Profile...</span> : "Yes, Delete My Profile"}
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
  )
};

export default DeleteProfileModal;
