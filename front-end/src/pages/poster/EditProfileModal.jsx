import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useUpdatePosterProfileMutation } from "../../store/services/posterApi";
import { updateUser } from "../../store/Slices/UserSlice";
import OtpModal from '../../components/OtpModal/OtpModal'
import {useSendOtpMutation} from '../../store/services/authApi'

import {
  Lock,
  X,
  Camera,
  KeyRound,
  Mail,
  CheckCircle2,
  Info,
} from "lucide-react";

import { showError, showSuccess } from "../../utils/toast";
import UpdatePasswordModal from "../../components/sharedComponents/UpdatePasswordModal";
import { uploadFileToS3 } from "../../utils/s3Upload";

const EditProfileModal = ({ onClose, posterInfo }) => {
  const dispatch = useDispatch();

  const avatarInputRef = useRef(null);
  const [emailChanged, setEmailChanged] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [updatePosterProfile, { isLoading, isSuccess }] = useUpdatePosterProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      phone: posterInfo?.phone || "",
      city: posterInfo?.city || "",
      email: posterInfo?.email || "",
    },
  });

  const previewUrl = selectedAvatar
    ? URL.createObjectURL(selectedAvatar)
    : null;

  const [sendOtp] = useSendOtpMutation();

  const resendOtp = ({email}) => {
    sendOtp({ email, phone: posterInfo.phone, resendFlag: true });
  }

  const updateProfile = useCallback( async (data) => {
    let avatarObj = null;
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (selectedAvatar instanceof File) {
      try {
        avatarObj = await uploadFileToS3(selectedAvatar, "avatars");
        formData.append("avatarObject", JSON.stringify(avatarObj));
      } catch (err) {
        console.warn("Direct S3 upload failed, sending raw avatar:", err);
        formData.append("avatar", selectedAvatar);
      }
    } else if (selectedAvatar) {
      formData.append("avatar", selectedAvatar);
    }
    if(!isVerified && emailChanged) {
      return;
    }
    try {
      const res = await updatePosterProfile(formData).unwrap();
      const updatedSelfie = res?.data?.selfie || res?.selfie || (avatarObj ? avatarObj.url : null);
      if (updatedSelfie) {
        dispatch(updateUser({ selfie: updatedSelfie, phone: data.phone, email: data.email }));
      } else {
        dispatch(updateUser({ phone: data.phone, email: data.email }));
      }
      showSuccess("Profile updated successfully");
      onClose();
    } catch (error) {
      showError(error?.data?.message || "Failed to update profile");
    } finally {
      setPendingData(null);
      setIsVerified(false);
      setEmailChanged(false);
    }
  },[isVerified, selectedAvatar, updatePosterProfile, onClose, emailChanged, dispatch])

  const onSubmit = async (data) => {
    if(data.email != posterInfo?.email && !isVerified) {
      resendOtp({email: data.email, phone: posterInfo.phone, resendFlag: true });
      setNewEmail(data.email);
      setEmailChanged(true);
      setPendingData(data);
      return;
    }
    await updateProfile(data);
  };


  useEffect(() => {
    if(isVerified && pendingData) {
      updateProfile(pendingData);
    }
  },[isVerified, pendingData, updateProfile])


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md sm:max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-linear-to-r from-[#0A6E5C] via-emerald-500 to-teal-400 shrink-0" />

        <div className="flex items-center justify-between px-5 sm:px-6 pt-3.5 sm:pt-4 pb-2 border-b border-gray-100 shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="overflow-y-auto flex-1 px-5 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col items-center pt-1 pb-3 sm:pb-4">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="relative group cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A6E5C]"
              aria-label="Upload profile picture"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-emerald-200 shadow-md ring-3 ring-emerald-50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    alt="avatar preview"
                  />
                ) : posterInfo?.selfie ? (
                  <img
                    src={posterInfo.selfie}
                    className="w-full h-full object-cover"
                    alt="current avatar"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl"
                    style={{
                      background: "linear-gradient(135deg, #0A6E5C, #10b981)",
                    }}
                  >
                    {posterInfo?.name?.charAt(0).toUpperCase() || "P"}
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5">
                <Camera size={18} className="text-white" />
                <span className="text-white text-[8px] sm:text-[9px] font-bold tracking-wide uppercase">
                  Upload
                </span>
              </div>

              {previewUrl && (
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              )}
            </button>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setSelectedAvatar(e.target.files[0]);
              }}
              ref={(el) => {
                avatarInputRef.current = el;
              }}
            />

            <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#0A6E5C] mt-2 uppercase">
              {previewUrl ? "New Photo Selected" : "Click to upload photo"}
            </p>
            {previewUrl && (
              <p className="text-[9px] text-gray-400 mt-0.5">
                {(selectedAvatar?.size / 1024).toFixed(0)} KB
              </p>
            )}
          </div>

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-3">
              {/* Full Name */}
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
                  Full Name
                </p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200">
                  <Lock size={12} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700 truncate">
                    {posterInfo?.name || "—"}
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
                  Phone Number
                </p>
                <div
                  className={`flex items-center rounded-xl overflow-hidden border transition-all focus-within:ring-2 focus-within:ring-emerald-100 ${
                    errors.phone
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-gray-200 focus-within:border-[#0A6E5C]"
                  }`}
                >
                  <div className="px-2.5 py-2 text-gray-600 text-xs font-semibold border-r border-gray-200 bg-gray-50 shrink-0">
                    +91 ▾
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="flex-1 bg-white px-2.5 py-2 text-gray-900 text-xs sm:text-sm outline-none placeholder-gray-400 min-w-0"
                    {...register("phone", {
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit number",
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="col-span-1 sm:col-span-2">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
                  Email Address
                </p>
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all focus-within:ring-2 focus-within:ring-emerald-100 ${
                    errors.email
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-gray-200 focus-within:border-[#0A6E5C]"
                  }`}
                >
                  <Mail size={13} className="text-[#0A6E5C] shrink-0" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 bg-transparent text-gray-900 text-xs sm:text-sm outline-none placeholder-gray-400 min-w-0"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {errors.email.message}
                  </p>
                )}
                <p className="text-[10px] sm:text-[11px] text-blue-800 bg-blue-50/80 border border-blue-200/70 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5 mt-1.5 leading-normal">
                  <Info size={12} className="shrink-0 mt-0.5 text-[#0070BA]" />
                  <span>
                    Ensure this is a <strong className="font-semibold text-[#003087]">PayPal-linked email ID</strong> for smooth payment transactions.
                  </span>
                </p>
              </div>
            </div>

            <button 
              onClick={() => { setShowUpdatePasswordModal(true) }}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 mb-3.5 sm:mb-4 rounded-xl border border-dashed border-gray-300 text-gray-500 text-xs sm:text-sm font-semibold hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <KeyRound size={13} />
              Change Password
            </button>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={(!isDirty && !selectedAvatar) || isLoading }
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #0A6E5C, #10b981)",
                }}
              >
                {isSuccess ? "Changes Saved" : isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {showUpdatePasswordModal && <UpdatePasswordModal onClose={() => setShowUpdatePasswordModal(false)} />}
        {emailChanged &&  <OtpModal show={setEmailChanged}  email={newEmail} reSendOtp={resendOtp} isVerified={setIsVerified} />}
      </div>
    </div>
  );
};

export default EditProfileModal;
