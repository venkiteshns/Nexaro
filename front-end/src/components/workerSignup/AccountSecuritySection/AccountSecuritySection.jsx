import { useState } from "react";
import { useFormContext } from "react-hook-form";
import SectionCard from "../SectionCard/SectionCard.jsx";

const IconLock = () => (
  <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const IconEye = ({ off }) => off ? (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8)  s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Too short",  color: "#EF4444" },
    { label: "Weak",       color: "#F59E0B" },
    { label: "Fair",       color: "#F59E0B" },
    { label: "Good",       color: "#10B981" },
    { label: "Strong",     color: "#0A6E5C" },
  ];
  return { score: s, ...map[s] };
}

export default function AccountSecuritySection() {
  const { register, watch, formState: { errors } } = useFormContext();
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const password = watch("password", "");
  const strength  = getStrength(password);

  return (
    <SectionCard icon={<IconLock />} title="Account Security">
      <div className="ws-grid-2">
        {/* Password */}
        <div className="ws-field">
          <label className="ws-label">Password<span style={{ color:"#EF4444" }}>*</span></label>
          <div className="ws-password-wrap">
            <input
              type={showPw ? "text" : "password"}
              className={`ws-input${errors.password ? " error" : ""}`}
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[0-9])/,
                  message: "Include at least one uppercase letter and one number",
                },
              })}
            />
            <button type="button" className="ws-password-toggle" onClick={() => setShowPw(v => !v)}>
              <IconEye off={showPw} />
            </button>
          </div>
          {/* Strength bar */}
          {password && (
            <>
              <div className="ws-strength-bar">
                <div
                  className="ws-strength-fill"
                  style={{ width: `${strength.score * 25}%`, background: strength.color }}
                />
              </div>
              <span className="ws-strength-label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </>
          )}
          {errors.password && <span className="ws-error">⚠ {errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="ws-field">
          <label className="ws-label">Confirm Password<span style={{ color:"#EF4444" }}>*</span></label>
          <div className="ws-password-wrap">
            <input
              type={showCf ? "text" : "password"}
              className={`ws-input${errors.confirmPassword ? " error" : ""}`}
              placeholder="Repeat your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: v => v === password || "Passwords do not match",
              })}
            />
            <button type="button" className="ws-password-toggle" onClick={() => setShowCf(v => !v)}>
              <IconEye off={showCf} />
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="ws-error">⚠ {errors.confirmPassword.message}</span>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="ws-checkbox-group" style={{ marginTop: 24 }}>
        {[
          { name: "termsAccepted",    label: <>I agree to the <a href="#">Terms & Conditions</a></> },
          { name: "privacyAccepted",  label: <>I agree to the <a href="#">Privacy Policy</a></> },
          { name: "guidelinesAccepted", label: <>I have read the <a href="#">Worker Guidelines</a></> },
        ].map(({ name, label }) => (
          <label key={name} className="ws-checkbox-item">
            <input
              type="checkbox"
              {...register(name, { required: "This is required" })}
            />
            <span className="ws-checkbox-item__text">{label}</span>
          </label>
        ))}
        {(errors.termsAccepted || errors.privacyAccepted || errors.guidelinesAccepted) && (
          <span className="ws-error">⚠ Please accept all required agreements</span>
        )}
      </div>
    </SectionCard>
  );
}
