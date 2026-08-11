import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { X, ArrowLeftRight, Loader2, Eye, EyeOff } from "lucide-react";
import { ProfessionalSkillsField } from "../../Form/FormComponents/EditProfileFormFields";
import IdentityVerification from "../../Form/FormComponents/IdentityVerification";
import FormError from "../../Form/FormComponents/FormError";
import { SectionHeading } from "../../sharedComponents/SectionHeading";
import Location from "../../Form/FormComponents/Location";


/* ─── Divider ─────────────────────────────────────────────────────────────── */
const Divider = () => <div className="border-t border-gray-100 my-6" />;

/* ─── Input style ─────────────────────────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl border border-[rgba(10,110,92,0.2)] bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-[#0A6E5C]/60 focus:ring-2 focus:ring-[#0A6E5C]/10";

/*  MAIN MODAL                                                                 */
const SwitchToWorkerModal = ({ isOpen, onClose, onSwitch, isSubmitting }) => {

  const methods = useForm({
    defaultValues: {
      skills: [],
      languages: [],
      id_type: "",
      id_front: null,
      id_back: null,
      selfie: null,
      password: "",
      city: "",
      district: "",
      state: "",
    },
    mode: "onSubmit",
  });

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  if (!isOpen) return null;

  const onSubmit = async (data) => {
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

    if (onSwitch) return onSwitch(data);
    
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-3 sm:px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* ── Modal Card ── */}
      <div
        className="relative w-full max-w-[580px] rounded-[28px] sm:rounded-[32px] bg-white shadow-2xl overflow-hidden flex flex-col animate-[switchModalIn_0.22s_ease-out]"
        style={{ maxHeight: "78dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="px-5 sm:px-8 pt-7 pb-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0A6E5C 0%,#14b89a 100%)" }}
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-8 w-20 h-20 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ArrowLeftRight size={14} className="text-white/80" />
                <span className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-widest">
                  Role Transition
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors mt-0.5"
            >
              <X size={15} className="text-white" />
            </button>
          </div>

          {/* Step pills */}
          <div className="relative z-10 mt-5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {["Skills", "Location", "Identity", "Authorize"].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center">
                    <span className="text-[9px] font-extrabold text-white">{i + 1}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-white/80 hidden min-[360px]:block">{step}</span>
                </div>
                {i < 3 && <div className="w-3 sm:w-5 h-px bg-white/30" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <FormProvider {...methods}>
          <form
            id="switch-to-worker-form"
            onSubmit={handleSubmit(onSubmit)}
            className="px-5 sm:px-8 py-6 overflow-y-auto flex-1 min-h-0"
            noValidate
          >
            {/* 1. Professional Skills */}
            <SectionHeading>Professional Skills</SectionHeading>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Skills <span className="text-red-400">*</span>
                </label>
                <ProfessionalSkillsField section="skills" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Languages <span className="text-red-400">*</span>
                </label>
                <ProfessionalSkillsField section="languages" />
              </div>
            </div>

            <Divider />

            {/* 2. Service Location */}
            <SectionHeading>Service Location</SectionHeading>
            <Location />
            <Divider />

            {/* 3. Identity Verification */}
            <SectionHeading>Identity Verification</SectionHeading>
            {/* Strip outer card styling from IdentityVerification */}
            <div className="[&>div]:mt-0 [&>div]:p-0 [&>div]:shadow-none [&>div]:bg-transparent [&>div]:border-0 [&>div]:rounded-none">
              <IdentityVerification />
            </div>

            <Divider />

            {/* 4. Authorize Role Change */}
            <SectionHeading>Authorize Role Change</SectionHeading>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Current Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required to authorize this action",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && <FormError error={errors.password} />}
            </div>
          </form>
        </FormProvider>

        {/* ── Footer / Submit ── */}
        <div className="px-5 sm:px-8 py-4 border-t border-gray-100 bg-white">
          <button
            id="switch-to-worker-submit-btn"
            type="submit"
            form="switch-to-worker-form"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-extrabold text-white shadow-lg shadow-emerald-900/20 hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#0A6E5C 0%,#14b89a 100%)" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Switching Profile…
              </>
            ) : (
              <>
                <ArrowLeftRight size={16} />
                Switch to Worker Profile
              </>
            )}
          </button>
        </div>

        <style>{`
          @keyframes switchModalIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to   { opacity: 1; transform: scale(1)   translateY(0); }
          }
        `}</style>
      </div>
    </div >
  );
};

export default SwitchToWorkerModal;
