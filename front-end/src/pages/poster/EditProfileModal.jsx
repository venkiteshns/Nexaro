import { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Lock,
  X,
  Camera,
  KeyRound,
  Mail,
  CheckCircle2,
} from "lucide-react";

const EditProfileModal = ({ onClose, posterInfo }) => {
  const avatarInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      phone: posterInfo?.phone || "",
      city: posterInfo?.city || "",
      email: posterInfo?.email || "",
    },
  });

  const { ref: avatarRhfRef, ...avatarRest } = register("avatar");
  const avatarFileList = watch("avatar");
  const previewUrl = avatarFileList?.[0]
    ? URL.createObjectURL(avatarFileList[0])
    : null;

  const onSubmit = (data) => {
    console.log("Saving profile:", data);
    // TODO: dispatch RTK mutation here
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-linear-to-r from-[#0A6E5C] via-emerald-500 to-teal-400" />

        <div className="flex items-center justify-between px-7 pt-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col items-center pt-4 pb-5">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="relative group cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A6E5C]"
              aria-label="Upload profile picture"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-200 shadow-md ring-4 ring-emerald-50">
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
                    className="w-full h-full flex items-center justify-center text-white font-extrabold text-3xl"
                    style={{
                      background: "linear-gradient(135deg, #0A6E5C, #10b981)",
                    }}
                  >
                    {posterInfo?.name?.charAt(0).toUpperCase() || "R"}
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <Camera size={20} className="text-white" />
                <span className="text-white text-[9px] font-bold tracking-wide uppercase">
                  Upload
                </span>
              </div>

              {previewUrl && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              )}
            </button>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...avatarRest}
              ref={(el) => {
                avatarRhfRef(el); // RHF internal ref
                avatarInputRef.current = el; // local ref for click trigger
              }}
            />

            <p className="text-[11px] font-bold tracking-widest text-[#0A6E5C] mt-3 uppercase">
              {previewUrl ? "New Photo Selected" : "Click to upload photo"}
            </p>
            {previewUrl && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                {(avatarFileList[0].size / 1024).toFixed(0)} KB
              </p>
            )}
          </div>

          <div className="px-7 pb-7">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                  Full Name
                </p>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-gray-50 border border-gray-200">
                  <Lock size={12} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700">
                    {posterInfo?.name || "—"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                  Email Address
                </p>
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border transition-all focus-within:ring-2 focus-within:ring-emerald-100 ${
                    errors.email
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-gray-200 focus-within:border-[#0A6E5C]"
                  }`}
                >
                  <Mail size={13} className="text-[#0A6E5C] shrink-0" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 bg-transparent text-gray-900 text-sm outline-none placeholder-gray-400 min-w-0"
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
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                  Phone Number
                </p>
                <div
                  className={`flex items-center rounded-xl overflow-hidden border transition-all focus-within:ring-2 focus-within:ring-emerald-100 ${
                    errors.phone
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-gray-200 focus-within:border-[#0A6E5C]"
                  }`}
                >
                  <div className="px-3 py-2.5 text-gray-600 text-xs font-semibold border-r border-gray-200 bg-gray-50 shrink-0">
                    +91 ▾
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="flex-1 bg-white px-3 py-2.5 text-gray-900 text-sm outline-none placeholder-gray-400"
                    {...register("phone", {
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit number",
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                  Location
                </p>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-[#0A6E5C] focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                  <MapPin size={13} className="text-[#0A6E5C] shrink-0" />
                  <input
                    type="text"
                    placeholder="City, State"
                    className="flex-1 bg-transparent text-gray-900 text-sm outline-none placeholder-gray-400"
                    {...register("city")}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 mb-6 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm font-semibold hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all"
            >
              <KeyRound size={14} />
              Change Password
            </button>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty && !previewUrl}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #0A6E5C, #10b981)",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
