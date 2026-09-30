import { Loader2, X, KeyRound } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AvatarUploadField,
  PersonalInfoFields,
  ProfessionalSkillsField,
} from "../../Form/FormComponents/EditProfileFormFields";
import { useEffect, useState } from "react";
import OtpModal from "../../OtpModal/OtpModal";
import { useSendOtpMutation } from "../../../store/services/authApi";
import { SectionHeading } from "../../sharedComponents/SectionHeading";
import UpdatePasswordModal from "../../sharedComponents/UpdatePasswordModal";

const EditWorkerProfileModal = ({ loading, isOpen, onClose, worker, onSave, }) => {

  const [dirty, setDirty] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false); 
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);

  const [sendOtp] = useSendOtpMutation();


  const methods = useForm({
    defaultValues: {
      name: worker?.name || "",
      email: worker?.email || "",
      phone: worker?.phone || "",
      skills: worker?.skills || [],
      languages: worker?.languages || [],
      bio: worker?.bio || ""
    },
  });

  useEffect(() => {
    (() => {
      if (isVerified) {
        setIsVerified(false);
        onSave(pendingData)
      }
    })()
  }, [isVerified, onSave, pendingData])

  if (!isOpen) return null;

  const resendOtp = ({ email }) => {
    sendOtp({ email, phone: worker.phone, resendFlag: true });
  }



  const { formState: { isDirty } } = methods;

  const handleSubmit = methods.handleSubmit((data) => {
    let hasError = false;
    if (!data.skills || data.skills.length === 0) {
      methods.setError("skills", { type: "manual", message: "At least 1 skill is required." });
      hasError = true;
    }
    if (!data.languages || data.languages.length === 0) {
      methods.setError("languages", { type: "manual", message: "At least 1 language is required." });
      hasError = true;
    }
    if (hasError) return;
    if (data.email !== worker?.email) {
      if (isVerified) {
        if (onSave) onSave(data);
      }
      sendOtp({ email: data.email, phone: worker?.phone, resendFlag: true })
      setPendingData(data);
      setShowOtp(true);
      return;
    }

    if (onSave) onSave(data);
  });

  const initials = (worker?.name || "AV")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 overflow-y-auto"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        className="relative w-full max-w-[460px] sm:max-w-[520px] rounded-2xl sm:rounded-[32px] bg-white shadow-2xl overflow-hidden flex flex-col my-auto max-h-[80vh] sm:max-h-[88vh]
                   animate-[editModalIn_0.22s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full shrink-0"
          style={{
            background:
              "linear-gradient(90deg,#0A6E5C 0%,#14b89a 60%,#d1fae5 100%)",
          }}
        />

        <div className="flex items-start justify-between px-5 pt-4 pb-3.5 sm:px-7 sm:pt-6 sm:pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2
              id="edit-profile-title"
              className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight"
            >
              Edit Profile
            </h2>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
              Nexaro User Identity
            </p>
          </div>

          <button
            id="edit-profile-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close edit profile"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-[#0A6E5C] transition-all duration-150 shrink-0"
          >
            <X size={15} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 sm:px-7 sm:py-6 flex flex-col gap-4 sm:gap-6 scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent">

              <AvatarUploadField
                initials={initials}
                currentAvatar={worker?.avatar}
                onDirty={setDirty}
              />

              <div className="h-px bg-gray-100" />

              <section>
                <SectionHeading>Personal Information</SectionHeading>
                <PersonalInfoFields isVerified={worker?.isVerified} />
              </section>

              <div className="h-px bg-gray-100" />

              <section>
                <SectionHeading>Professional Skills</SectionHeading>
                <ProfessionalSkillsField section={"skills"} />
                <p className="text-[10px] text-gray-400 mt-2">
                  Press Enter or comma to add a skill. Backspace to remove last.
                </p>
              </section>

              <section>
                <SectionHeading>Languages</SectionHeading>
                <ProfessionalSkillsField section={"languages"} />
                <p className="text-[10px] text-gray-400 mt-2">
                  Press Enter or comma to add a language. Backspace to remove last.
                </p>
              </section>

              <div className="h-px bg-gray-100" />

              <section>
                <button
                  type="button"
                  onClick={() => setShowUpdatePasswordModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-600 text-xs sm:text-sm font-semibold hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  <KeyRound size={15} className="text-[#0A6E5C]" />
                  <span>Change Password</span>
                </button>
              </section>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-3.5 sm:px-7 sm:py-5 border-t border-gray-100 bg-white shrink-0">
              <button
                id="edit-profile-cancel-btn"
                type="button"
                onClick={onClose}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 disabled:opacity-50 `}
              >
                Cancel
              </button>

              <button
                id="edit-profile-save-btn"
                type="submit"
                disabled={(!isDirty && !dirty) || loading}
                className={`px-5 py-2 sm:px-7 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm
                           transition-all duration-150 active:scale-[0.97]
                            ${(!isDirty && !dirty) || loading
                    ? "cursor-not-allowed hover:opacity-50 hover:bg-green-700 text-gray-400 opacity-50"
                    : "hover:bg-green-700 hover:opacity-90"
                  }`}
                style={{
                  background:
                    "linear-gradient(135deg,#0A6E5C 0%,#14b89a 100%)",
                }}
              >
                {loading ? <span className="flex items-center gap-2" > <Loader2 size={18} className="animate-spin" /> Saving Changes.. </span> : "Save Changes"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>

      <style>{`
        @keyframes editModalIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>

      {showOtp && (<OtpModal show={setShowOtp} email={pendingData?.email} isVerified={setIsVerified} resendOtp={resendOtp} />)}
      {showUpdatePasswordModal && (
        <UpdatePasswordModal onClose={() => setShowUpdatePasswordModal(false)} />
      )}
    </div>
  );
};

export default EditWorkerProfileModal;
