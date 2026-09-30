import { useState, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { X, ArrowLeftRight, Loader2, Eye, EyeOff, ChevronDown, LocateFixed, CheckCircle2, AlertCircle } from "lucide-react";
import { ProfessionalSkillsField } from "../../Form/FormComponents/EditProfileFormFields";
import IdentityVerification from "../../Form/FormComponents/IdentityVerification";
import FormError from "../../Form/FormComponents/FormError";
import { SectionHeading } from "../../sharedComponents/SectionHeading";
import { KERALA_DISTRICTS, DISTRICT_AREAS } from "../../../utils/constants";
import { placeToCoords } from "../../../services/placeToCoords";

const Divider = () => <div className="border-t border-gray-100 my-3 sm:my-5" />;

const inputCls =
  "w-full rounded-lg sm:rounded-xl border border-[rgba(10,110,92,0.2)] bg-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-[#0A6E5C]/60 focus:ring-2 focus:ring-[#0A6E5C]/10";

const FIELD_ORDER = [
  "skills",
  "languages",
  "workPlace",
  "workPlacelat",
  "workPlacelng",
  "id_type",
  "id_front",
  "id_back",
  "selfie",
  "password",
];

const ServiceLocationPicker = ({ defaultDistrict, defaultState, defaultCountry }) => {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormContext();

  const selectedDistrict = watch("district") || defaultDistrict || "Ernakulam";
  const selectedWorkPlace = watch("workPlace") || "";
  const selectedWorkLat = watch("workPlacelat");
  const selectedWorkLng = watch("workPlacelng");

  const [fetchStatus, setFetchStatus] = useState("idle"); // idle | fetching | success | fail
  const [afterChange, setAfterChange] = useState("idle");

  const districtAreas =
    selectedDistrict && DISTRICT_AREAS[selectedDistrict]
      ? DISTRICT_AREAS[selectedDistrict]
      : [];

  useEffect(() => {
    register("workPlacelat", { required: "Please confirm the service location" });
    register("workPlacelng", { required: "Please confirm the service location" });
  }, [register]);

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setValue("district", newDistrict, { shouldValidate: true, shouldDirty: true });
    setValue("workPlace", "", { shouldValidate: true, shouldDirty: true });
    setValue("workPlacelat", "", { shouldDirty: true });
    setValue("workPlacelng", "", { shouldDirty: true });
    setAfterChange("idle");
  };

  const handleWorkPlaceChange = (e) => {
    const val = e.target.value;
    setValue("workPlace", val, { shouldValidate: true, shouldDirty: true });
    setValue("workPlacelat", "", { shouldDirty: true });
    setValue("workPlacelng", "", { shouldDirty: true });
    setAfterChange("changed");
  };

  const handleConfirmCoords = async () => {
    const val = getValues();
    if (!val.workPlace) return;

    setFetchStatus("fetching");
    try {
      const payload = {
        city: val.workPlace,
        district: selectedDistrict,
        state: val.state || defaultState || "Kerala",
        country: val.country || defaultCountry || "India",
      };
      const res = await placeToCoords(payload);
      setValue("workPlacelat", res.lat, { shouldValidate: true, shouldDirty: true });
      setValue("workPlacelng", res.lng, { shouldValidate: true, shouldDirty: true });
      setFetchStatus("success");
      setTimeout(() => {
        setAfterChange("idle");
        setFetchStatus("idle");
      }, 1800);
    } catch {
      setFetchStatus("fail");
      setAfterChange("changed");
      setTimeout(() => {
        setFetchStatus("idle");
      }, 2000);
    }
  };

  const isConfirmed = Boolean(selectedWorkLat && selectedWorkLng);
  const showConfirmButton = afterChange === "changed" || (selectedWorkPlace && !isConfirmed);

  const selectCls =
    "w-full rounded-lg sm:rounded-xl border px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-gray-800 bg-white outline-none appearance-none transition-all duration-200 cursor-pointer";

  return (
    <div data-field="workPlace" className="space-y-2.5 sm:space-y-3.5 scroll-mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
        <div className="space-y-1">
          <label className="text-[9.5px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
            District <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className={`${selectCls} border-[rgba(10,110,92,0.2)] focus:border-[#0A6E5C]/60 focus:ring-2 focus:ring-[#0A6E5C]/10`}
            >
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9.5px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Preferred Service Location <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              {...register("workPlace", { required: "Please select your preferred service location" })}
              value={selectedWorkPlace}
              onChange={handleWorkPlaceChange}
              className={`${selectCls} ${
                errors.workPlace ? "border-red-400 ring-1 ring-red-400" : "border-[rgba(10,110,92,0.2)] focus:border-[#0A6E5C]/60 focus:ring-2 focus:ring-[#0A6E5C]/10"
              }`}
            >
              <option value="" disabled>
                Select Preferred Service Location
              </option>
              {districtAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {errors.workPlace && (
        <p className="italic text-red-500 text-[11px] sm:text-xs">
          {errors.workPlace.message || "Please select your preferred service location"}
        </p>
      )}
      {!errors.workPlace && selectedWorkPlace && (!isConfirmed || afterChange === "changed" || (isSubmitted && (errors.workPlacelat || errors.workPlacelng))) && (
        <p className="italic text-red-500 text-[11px] sm:text-xs">
          Please confirm the service location
        </p>
      )}

      {showConfirmButton && (
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={handleConfirmCoords}
            disabled={fetchStatus === "fetching"}
            className={[
              "inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer",
              fetchStatus === "fetching" ? "bg-[#0a6e5c]/70 text-white cursor-wait" : "",
              fetchStatus === "idle" ? "bg-[#0a6e5c] hover:bg-[#085a4a] text-white active:scale-95" : "",
              fetchStatus === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "",
              fetchStatus === "fail" ? "bg-red-50 text-red-600 border border-red-200" : "",
            ].join(" ")}
          >
            {fetchStatus === "fetching" && (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Confirming…</span>
              </>
            )}
            {fetchStatus === "idle" && (
              <>
                <LocateFixed size={13} />
                <span>Confirm Service Location</span>
              </>
            )}
            {fetchStatus === "success" && (
              <>
                <CheckCircle2 size={13} />
                <span>Location confirmed!</span>
              </>
            )}
            {fetchStatus === "fail" && (
              <>
                <AlertCircle size={13} />
                <span>Could not confirm — try again</span>
              </>
            )}
          </button>
        </div>
      )}
      {isConfirmed && !showConfirmButton && (
        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-600 font-medium pt-0.5">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>Service location coordinates confirmed</span>
        </div>
      )}
    </div>
  );
};

const SwitchToWorkerModal = ({ isOpen, onClose, onSwitch, isSubmitting, submissionStatus, posterInfo }) => {
  const defaultDistrict = posterInfo?.district || "Ernakulam";
  const defaultState = posterInfo?.state || "Kerala";
  const defaultCountry = posterInfo?.country || "India";
  const defaultCity = posterInfo?.city || "";

  const methods = useForm({
    defaultValues: {
      skills: [],
      languages: [],
      id_type: "",
      id_front: null,
      id_back: null,
      selfie: null,
      password: "",
      country: defaultCountry,
      state: defaultState,
      district: defaultDistrict,
      city: defaultCity,
      workPlace: "",
      workPlacelat: "",
      workPlacelng: "",
    },
    mode: "onSubmit",
  });

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const scrollToError = (errorObj) => {
    const errs = errorObj || methods.formState.errors;
    const firstErrorField =
      FIELD_ORDER.find((field) => errs[field]) || Object.keys(errs)[0];

    if (!firstErrorField) return;

    setTimeout(() => {
      const form = document.getElementById("switch-to-worker-form");
      if (!form) return;

      let targetElement = form.querySelector(`[data-field="${firstErrorField}"]`);

      if (!targetElement) {
        targetElement = form.querySelector(`[name="${firstErrorField}"]`);
      }

      if (
        !targetElement &&
        (firstErrorField === "workPlace" ||
          firstErrorField === "workPlacelat" ||
          firstErrorField === "workPlacelng")
      ) {
        targetElement =
          form.querySelector(`[name="workPlace"]`) ||
          form.querySelector(`[data-field="workPlace"]`);
      }

      if (
        !targetElement &&
        (firstErrorField === "id_type" ||
          firstErrorField === "id_front" ||
          firstErrorField === "id_back" ||
          firstErrorField === "selfie")
      ) {
        targetElement =
          form.querySelector(`[name="${firstErrorField}"]`) ||
          form.querySelector(`[name="id_type"]`) ||
          form.querySelector(`[data-field="identity"]`);
      }

      if (!targetElement) {
        targetElement = form.querySelector(
          ".italic.text-red-400, .italic.text-red-500, .italic.text-red-600, .text-red-500, .text-red-400"
        );
      }

      if (targetElement) {
        const scrollTarget =
          targetElement.offsetParent === null && targetElement.parentElement
            ? targetElement.closest("div") || targetElement.parentElement
            : targetElement;

        scrollTarget.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        const focusable =
          targetElement.querySelector("input:not([type='hidden']), select, textarea, button") ||
          targetElement;
        if (
          typeof focusable.focus === "function" &&
          !focusable.classList.contains("hidden") &&
          focusable.offsetParent !== null
        ) {
          focusable.focus({ preventScroll: true });
        }
      }
    }, 50);
  };

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    let hasError = false;
    const newErrors = {};

    if (!data.skills || data.skills.length === 0) {
      methods.setError("skills", { type: "manual", message: "At least 1 skill is required." });
      newErrors.skills = true;
      hasError = true;
    }
    if (!data.languages || data.languages.length === 0) {
      methods.setError("languages", { type: "manual", message: "At least 1 language is required." });
      newErrors.languages = true;
      hasError = true;
    }

    if (!data.workPlace) {
      methods.setError("workPlace", { type: "manual", message: "Please select your preferred service location." });
      newErrors.workPlace = true;
      hasError = true;
    } else if (!data.workPlacelat || !data.workPlacelng) {
      methods.setError("workPlace", { type: "manual", message: "Please confirm the service location." });
      newErrors.workPlace = true;
      hasError = true;
    }

    if (hasError) {
      scrollToError({ ...methods.formState.errors, ...newErrors });
      return;
    }

    data.country = data.country || defaultCountry;
    data.state = data.state || defaultState;
    data.district = data.district || defaultDistrict;
    data.city = data.city || defaultCity || data.workPlace;

    if (onSwitch) return onSwitch(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-[580px] rounded-2xl sm:rounded-[32px] bg-white shadow-2xl overflow-hidden flex flex-col my-auto"
        style={{ maxHeight: "90dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-4 sm:px-7 pt-4 pb-3 sm:pt-5 sm:pb-4 relative overflow-hidden shrink-0"
          style={{ background: "linear-gradient(135deg,#0A6E5C 0%,#14b89a 100%)" }}
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-8 w-20 h-20 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3 sm:gap-4 pb-2 sm:pb-3">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <ArrowLeftRight size={13} className="text-white/80" />
                <span className="text-[9.5px] sm:text-xs font-bold text-white/70 uppercase tracking-widest">
                  Role Transition
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                Switch to Worker Profile
              </h2>
              <p className="text-[11px] sm:text-xs text-white/85 mt-0.5 leading-snug">
                Provide your skills, service location & credentials to start accepting tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Close modal"
              className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X size={14} className="text-white" />
            </button>
          </div>

          <div className="relative z-10 mt-1.5 sm:mt-2.5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {["Skills", "Location", "Identity", "Authorize"].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/30 border-1.5 sm:border-2 border-white/60 flex items-center justify-center">
                    <span className="text-[8.5px] sm:text-[9px] font-extrabold text-white">{i + 1}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-white/80 hidden min-[360px]:block">{step}</span>
                </div>
                {i < 3 && <div className="w-2.5 sm:w-4 h-px bg-white/30" />}
              </div>
            ))}
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            id="switch-to-worker-form"
            onSubmit={handleSubmit(onSubmit, (errs) => scrollToError(errs))}
            className="px-4 sm:px-8 py-3.5 sm:py-5 overflow-y-auto flex-1 min-h-0"
            noValidate
          >
            <SectionHeading>Professional Skills</SectionHeading>
            <div className="flex flex-col gap-2.5 sm:gap-4">
              <div data-field="skills" className="flex flex-col gap-1 sm:gap-1.5 scroll-mt-6">
                <label className="text-[9.5px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Skills <span className="text-red-400">*</span>
                </label>
                <ProfessionalSkillsField section="skills" />
              </div>
              <div data-field="languages" className="flex flex-col gap-1 sm:gap-1.5 scroll-mt-6">
                <label className="text-[9.5px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Languages <span className="text-red-400">*</span>
                </label>
                <ProfessionalSkillsField section="languages" />
              </div>
            </div>

            <Divider />

            <SectionHeading>Service Location</SectionHeading>
            <ServiceLocationPicker
              defaultDistrict={defaultDistrict}
              defaultState={defaultState}
              defaultCountry={defaultCountry}
            />

            <Divider />

            <SectionHeading>Identity Verification</SectionHeading>
            <div data-field="identity" className="scroll-mt-6 [&>div]:mt-0 [&>div]:p-0 [&>div]:shadow-none [&>div]:bg-transparent [&>div]:border-0 [&>div]:rounded-none">
              <IdentityVerification />
            </div>

            <Divider />

            <SectionHeading>Authorize Role Change</SectionHeading>
            <div data-field="password" className="flex flex-col gap-1 sm:gap-1.5 scroll-mt-6">
              <label className="text-[9.5px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
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
                  className={`${inputCls} pr-9 sm:pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={15} className="sm:w-4 sm:h-4" /> : <EyeOff size={15} className="sm:w-4 sm:h-4" />}
                </button>
              </div>
              {errors.password && <FormError error={errors.password} />}
            </div>
          </form>
        </FormProvider>

        {isSubmitting && (
          <div className="px-4 sm:px-8 py-2.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6E5C]">
              <Loader2 size={14} className="animate-spin shrink-0 text-[#0A6E5C]" />
              <span>
                {submissionStatus === "uploading" && "Uploading verification documents…"}
                {submissionStatus === "submitting" && "Submitting details & verifying credentials…"}
                {submissionStatus === "switching" && "Profile updated! Transitioning to Worker Mode…"}
                {(!submissionStatus || submissionStatus === "loading") && "Processing role switch…"}
              </span>
            </div>
            <span className="text-[9.5px] uppercase tracking-wider font-bold text-[#0A6E5C] bg-[#0A6E5C]/10 px-2 py-0.5 rounded-full shrink-0">
              {submissionStatus === "uploading" ? "Step 1 of 2" : submissionStatus === "submitting" ? "Step 2 of 2" : "Switching"}
            </span>
          </div>
        )}

        <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Cancel
          </button>
          <button
            id="switch-to-worker-submit-btn"
            type="submit"
            form="switch-to-worker-form"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: "linear-gradient(135deg,#0A6E5C 0%,#14b89a 100%)" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>
                  {submissionStatus === "uploading" && "Uploading Documents…"}
                  {submissionStatus === "submitting" && "Submitting Details…"}
                  {submissionStatus === "switching" && "Switching to Worker…"}
                  {(!submissionStatus || submissionStatus === "loading") && "Switching Profile…"}
                </span>
              </>
            ) : (
              <>
                <ArrowLeftRight size={14} />
                <span>Switch to Worker Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwitchToWorkerModal;
