import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Camera, X, BadgeCheck, LockKeyhole } from "lucide-react";
import FormError from "./FormError";

export const AvatarUploadField = ({ initials = "AV", currentAvatar, onDirty }) => {
  const { setValue } = useFormContext();
  const [preview, setPreview] = useState(currentAvatar || null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setValue("avatar", file, { shouldDirty: true });

    if (fileRef.current.value) {
      onDirty(true);
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <div className="relative shrink-0">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden border-3 border-[#0A6E5C]/20 shadow-md"
          style={{ background: "linear-gradient(135deg,#0A6E5C 0%,#14b89a 100%)" }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg sm:text-2xl font-extrabold text-white tracking-wider">
              {initials}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0A6E5C] border-2 border-white flex items-center justify-center shadow-sm hover:bg-[#085e4e] transition-colors"
        >
          <Camera size={11} className="text-white sm:w-[13px] sm:h-[13px]" />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs sm:text-sm font-bold text-[#0A6E5C] hover:text-[#085e4e] transition-colors uppercase tracking-wide"
        >
          Change Photo
        </button>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
          JPG, PNG or GIF. Max 5MB.
        </p>
      </div>
    </div>
  );
};

export const PersonalInfoFields = ({isVerified = 'false'}) => {            
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputCls =
    "w-full rounded-xl border border-[rgba(10,110,92,0.2)] bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-all duration-200 focus:border-[#0A6E5C]/60 focus:ring-2 focus:ring-[#0A6E5C]/10";

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Full Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Full Name
          </label>
          <div className="relative flex items-center rounded-xl text-sm bg-gray-200/70 border border-gray-200 disabled:cursor-not-allowed">
            <input
              {...register("name", { required: "Full name is required" })}
              type="text"
              placeholder="Name"
              disabled={true}
              autoComplete="name"
              className="flex items-center text-xs gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm bg-gray-200/70 border border-gray-200 disabled:cursor-not-allowed"
            />
            <LockKeyhole
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black-400 sm:right-4"
              aria-hidden="true"
            />
          </div>
          {errors.name && <FormError error={errors.name} />}
        </div>

        {/* Email */}
        <div className={`flex flex-col gap-1`}>
          <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 justify-start">
            Email Address
            {/* Verified badge */}
            {isVerified && <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-0.5 pointer-events-none">
              <BadgeCheck size={11} className="text-[#0A6E5C]" />
              <span className="text-[9px] sm:text-[10px] font-bold text-[#0A6E5C] uppercase tracking-wide">
                Verified
              </span>
            </span>}
          </label>
          <div className="relative">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              placeholder="arjun.v@nexaro.com"
              autoComplete="email"
              className={`${inputCls} ${isVerified} ?"pr-24 sm:pr-28" : "" `}
            />
            
          </div>
          {errors.email && <FormError error={errors.email} />}
        </div>
      </div>

      {/* Row 2: Phone (full width) */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Phone Number
        </label>
        <input
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[6-9][0-9]{9}$/,
              message: "Phone number must be 10 digits and start with 6, 7, 8, or 9",
            },
          })}
          type="tel"
          placeholder="9876543210"
          autoComplete="tel"
          className={inputCls}
        />
        {errors.phone && <FormError error={errors.phone} />}
      </div>

      {/* Row 2: Phone (full width) */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Bio
        </label>
        <textarea
          {...register("bio", {
            required: "Bio is required",
             pattern: {   
              value: /^[a-zA-Z0-9.,]+( [a-zA-Z0-9.,]+)*$/,
              message: "Only single spaces between words and valid punctuation allowed."
            },
            minLength: {
              value: 10,
              message: "Must be at least 10 characters long"
            },
            maxLength: {
              value: 200,
              message: "Cannot exceed 200 characters"
            }
          })}
          type=""
          placeholder="Something about you"
          autoComplete="tel"
          className={inputCls}
        />
        {errors.bio && <FormError error={errors.bio} />}
      </div>
      
    </div>
  );
};

export const ProfessionalSkillsField = ({section}) => {
  const { watch, setValue, clearErrors, formState: { errors } } = useFormContext();
  const skills = watch(section) || [];
  const [input, setInput] = useState("");
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const addSkill = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setInput("");
      setLocalError("");
      return;
    }

    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(trimmed)) {
      setLocalError("Only alphabets and single spaces allowed.");
      return;
    }

    if (!skills.includes(trimmed)) {
      setValue(section, [...skills, trimmed], { shouldDirty: true });
      if (errors[section]) {
        clearErrors(section);
      }
    }
    setInput("");
    setLocalError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }
    if (e.key === "Backspace" && !input && skills.length) {
      setValue(section, skills.slice(0, -1), { shouldDirty: true });
      setLocalError("");
    }
  };

  const removeSkill = (skill) => {
    setValue(section, skills.filter((s) => s !== skill), { shouldDirty: true });
  };

  const hasError = errors[section] || localError;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex flex-wrap items-center gap-2 rounded-xl border ${
          hasError ? "border-red-300 bg-red-50/50" : "border-[rgba(10,110,92,0.2)] bg-white"
        } px-3 py-2.5 sm:px-4 sm:py-3 min-h-[44px] sm:min-h-[50px] focus-within:border-[#0A6E5C]/60 focus-within:ring-2 focus-within:ring-[#0A6E5C]/10 transition-all duration-200 cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] sm:text-xs font-bold text-[#0A6E5C] uppercase tracking-wide"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="ml-0.5 text-[#0A6E5C]/60 hover:text-red-400 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (localError) setLocalError("");
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addSkill(input)}
          placeholder={section === "skills" ? "Type skill..." : "Type language..."}
          className="flex-1 min-w-[80px] text-xs sm:text-sm text-gray-700 outline-none placeholder:text-gray-400 bg-transparent"
        />
      </div>
      {hasError && <FormError error={errors[section] || { message: localError }} />}
    </div>
  );
};
