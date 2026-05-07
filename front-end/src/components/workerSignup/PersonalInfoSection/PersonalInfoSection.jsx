import { useFormContext } from "react-hook-form";
import SectionCard from "../SectionCard/SectionCard.jsx";

const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

export default function PersonalInfoSection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <SectionCard icon={<IconUser />} title="Personal Information">
      <div className="ws-grid-2">
        {/* Full Name */}
        <div className="ws-field">
          <label className="ws-label">Full Name<span>*</span></label>
          <input
            className={`ws-input${errors.fullName ? " error" : ""}`}
            placeholder="Enter your full name"
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && <span className="ws-error">⚠ {errors.fullName.message}</span>}
        </div>

        {/* Email */}
        <div className="ws-field">
          <label className="ws-label">Email Address<span>*</span></label>
          <input
            type="email"
            className={`ws-input${errors.email ? " error" : ""}`}
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
            })}
          />
          {errors.email && <span className="ws-error">⚠ {errors.email.message}</span>}
        </div>

        {/* Phone */}
        <div className="ws-field">
          <label className="ws-label">Phone Number<span>*</span></label>
          <div className="ws-phone-row">
            <input className="ws-phone-prefix ws-input" defaultValue="+91" readOnly style={{ width: 70 }} />
            <input
              type="tel"
              className={`ws-input${errors.phone ? " error" : ""}`}
              placeholder="98765 43210"
              style={{ flex: 1 }}
              {...register("phone", {
                required: "Phone is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit number" },
              })}
            />
          </div>
          {errors.phone && <span className="ws-error">⚠ {errors.phone.message}</span>}
        </div>

        {/* Bio */}
        <div className="ws-field ws-grid-full">
          <label className="ws-label">Bio</label>
          <textarea
            className="ws-textarea"
            placeholder="Describe your experience, expertise, and what makes you stand out…"
            {...register("bio")}
          />
        </div>
      </div>
    </SectionCard>
  );
}
