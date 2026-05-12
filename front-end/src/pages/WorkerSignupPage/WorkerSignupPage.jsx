import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { geocode } from "../../services/geocodeService.js";
import "./WorkerSignupPage.css";
import { api } from "../../services/api.js";
import { useToast } from "../../hooks/useToast.js";
import CustomSelect from "../../components/shared/CustomSelect/CustomSelect.jsx";
import PasswordInput from "../../components/shared/PasswordInput/PasswordInput.jsx";
import LocationAccessCard from "../../components/location/LocationAccessCard/LocationAccessCard.jsx";
import { useLocationAccess } from "../../hooks/useLocationAccess.js";
import { SKILLS, LANGUAGES, ID_TYPES, DISTRICT_AREAS } from "../../utils/constants.js";

// ─────────────────────────────────────────────
// Shared UI Elements
// ─────────────────────────────────────────────

const IconSend = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

function SectionCard({ icon, title, children }) {
  return (
    <div className="ws-section">
      <div className="ws-section__header">
        <div className="ws-section__icon">{icon}</div>
        <h3 className="ws-section__title">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// CustomSelect moved to shared components

const IconUpload = () => (
  <svg width="20" height="20" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" fill="none" stroke="#0A6E5C" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

function UploadCard({ name, label, hint, rules, register, setValue, watch, errors, onFile }) {
  const file = watch(name);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    register(name, rules);
  }, [name, register, rules]);

  function handleFile(f) {
    if (f) {
      setValue(name, f, { shouldValidate: true });
      onFile && onFile(f);
    }
  }

  function handleChange(e) {
    const f = e.target.files[0];
    handleFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  }

  const hasError = errors && errors[name];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        className={`ws-upload-card${drag ? " dragover" : ""}${file ? " has-file" : ""}`}
        style={hasError ? { borderColor: "#EF4444", background: "#FEF2F2" } : {}}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept="image/png,image/jpeg" onChange={handleChange} />
        {file ? (
          <>
            {file.type.startsWith("image/") && (
              <img className="ws-upload-card__preview" src={URL.createObjectURL(file)} alt="preview" />
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <IconCheck />
              <span className="ws-upload-card__filename">{file.name}</span>
            </div>
          </>
        ) : (
          <>
            <div className="ws-upload-card__icon"><IconUpload /></div>
            <div className="ws-upload-card__label">{label} <span style={{ color: "#EF4444" }}>*</span></div>
            <div className="ws-upload-card__hint">{hint || "PNG, JPG up to 5MB"}</div>
          </>
        )}
      </div>
      {hasError && <span className="ws-error" style={{ justifyContent: "center" }}>⚠ {errors[name].message}</span>}
    </div>
  );
}

// Helpers and constants moved to utils


// Main Page Component

export default function WorkerSignupPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    mode: "onTouched",
    defaultValues: { languages: ["English"] }
  });

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formDataCache, setFormDataCache] = useState(null);

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [otpStatus, setOtpStatus] = useState('idle');


  const [selectedSkills, setSelectedSkills] = useState([]);
  function toggleSkill(skill) {
    const next = selectedSkills.includes(skill) ? selectedSkills.filter(s => s !== skill) : [...selectedSkills, skill];
    setSelectedSkills(next);
    setValue("skills", next, { shouldValidate: true });
  }

  const [selectedLangs, setSelectedLangs] = useState(["English"]);
  function toggleLang(lang) {
    const next = selectedLangs.includes(lang) ? selectedLangs.filter(l => l !== lang) : [...selectedLangs, lang];
    setSelectedLangs(next);
    setValue("languages", next, { shouldValidate: true });
  }

  const district = watch("district");
  const areas = DISTRICT_AREAS[district] || [];
  const prevDistrictRef = useRef(district);
  useEffect(() => {
    if (prevDistrictRef.current !== district) {
      setValue("serviceArea", "", { shouldValidate: false });
      setValue("city", "", { shouldValidate: false });
      prevDistrictRef.current = district;
    }
  }, [district, setValue]);

  const { geoState, setGeoState, attempts, requestLocation, maxRetries } = useLocationAccess(setValue);

  const password = watch("password", "");

  useEffect(() => {
    let timeoutId;
    if (showOtpModal) {
      timeoutId = setTimeout(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }, 600);
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => {
      clearTimeout(timeoutId);
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [showOtpModal]);

  // Otp Modal Handler
  async function onFormSubmit(data) {
    console.log(data);
    setIsSubmittingForm(true);
    try {
      const res = await api.post('/auth/get-otp', { email: data.email });
      if (res.data.success) {
        setIsSubmittingForm(false);
        setFormDataCache(data);
        setShowOtpModal(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setIsSubmittingForm(false);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to send OTP";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }

  // handle digit change in otp modal
  const handleDigitChange = useCallback((index, digit) => {
    if (!/^\d*$/.test(digit)) return;
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (otpStatus === 'error') setOtpStatus('idle');
  }, [otpStatus]);


  // send data to backend
  async function sendDataToBackend(data) {
    setIsSubmittingForm(true);
    const formData = new FormData();

    const skipKeys = ["skills", "languages", "idFront", "idBack", "selfie", "exactLat", "exactLng"];
    Object.keys(data).forEach(key => {
      if (!skipKeys.includes(key)) {
        formData.append(key, data[key]);
      }
    });

    if (data.skills) formData.append("skills", JSON.stringify(data.skills));
    if (data.languages) formData.append("languages", JSON.stringify(data.languages));

    if (data.idFront) formData.append("idFront", data.idFront);
    if (data.idBack) formData.append("idBack", data.idBack);
    if (data.selfie) formData.append("selfie", data.selfie);

    try {
      if (data.exactLat && data.exactLng) {
        formData.append("locationLat", data.exactLat);
        formData.append("locationLng", data.exactLng);
      } else {
        const locationAddress = `${data.city}, ${data.district}, ${data.state}, ${data.country}`;
        const locationCoords = await geocode(locationAddress);
        if (locationCoords) {
          formData.append("locationLat", locationCoords.lat);
          formData.append("locationLng", locationCoords.lng);
        }
      }
      if (data.serviceArea && data.district) {
        const serviceAreaAddress = `${data.serviceArea}, ${data.district}, ${data.state}, ${data.country}`;
        const serviceAreaCoords = await geocode(serviceAreaAddress);
        if (serviceAreaCoords) {
          formData.append("serviceAreaLat", serviceAreaCoords.lat);
          formData.append("serviceAreaLng", serviceAreaCoords.lng);
        }
      }
    } catch (geoErr) {
      console.warn("Geocoding failed:", geoErr);
    }

    try {
      const res = await api.post("/auth/signup/worker", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (!res.data.success) throw new Error(res.data.message);
      navigate("/worker/dashboard");
    } catch (err) {
      console.error("Worker signup error →", err);
      toast.error("Registration failed! " + (err?.response?.data?.message || err?.message));
    } finally {
      setIsSubmittingForm(false);
      setShowOtpModal(false);
    }
  }

  // Otp Verfication Handle
  async function handleVerifyOtp(e) {
    e?.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) return;

    setOtpStatus('submitting');
    await new Promise(r => setTimeout(r, 900));

    try {
      const res = await api.post('/auth/verify-otp', { email: formDataCache.email, otp: code });
      if (res.data.success) {
        setOtpStatus('success');
        sendDataToBackend(formDataCache);
      }
    } catch (err) {
      setOtpStatus('error');
      setTimeout(() => {
        setOtpStatus('idle');
        setOtpDigits(Array(6).fill(''));
      }, 1800);
    }
  }

  return (
    <div className="ws-page">
      <nav className="ws-nav">
        <div className="ws-nav__inner">
          <Link to="/" className="ws-nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/Logo_Nex.png" alt="NEXARO" style={{ height: "32px", width: "auto" }} />
            <span className="ws-nav__logo-text">NEXARO</span>
          </Link>
          <Link to="/login" className="ws-nav__login" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Log In</Link>
        </div>
      </nav>

      <header className="ws-hero">
        <div className="ws-hero__badge">
          <span className="ws-hero__badge-dot" />
          <span className="ws-hero__badge-text">Worker Registration</span>
        </div>
        <h1 className="ws-hero__title">Create Your Worker Profile</h1>
        <p className="ws-hero__subtitle">
          Join the premium network of skilled professionals and start receiving
          high-quality hyperlocal job requests.
        </p>
      </header>

      <form className="ws-body" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        {/* Personal Info Section */}
        <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>} title="Personal Information">
          <div className="ws-grid-2">
            <div className="ws-field">
              <label className="ws-label">Full Name<span>*</span></label>
              <input className={`ws-input${errors.fullName ? " error" : ""}`} placeholder="Enter your full name" {...register("fullName", { required: "Full name is required", pattern: { value: /^(?=.*[A-Za-z]{2,})[A-Za-z]+(?: [A-Za-z]+)*$/, message: "Please enter a valid name" } })} />
              {errors.fullName && <span className="ws-error">⚠ {errors.fullName.message}</span>}
            </div>
            <div className="ws-field">
              <label className="ws-label">Email Address<span>*</span></label>
              <input type="email" className={`ws-input${errors.email ? " error" : ""}`} placeholder="you@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })} />
              {errors.email && <span className="ws-error">⚠ {errors.email.message}</span>}
            </div>
            <div className="ws-field">
              <label className="ws-label">Phone Number<span>*</span></label>
              <div className="ws-phone-row">
                <input className="ws-phone-prefix ws-input" defaultValue="+91" readOnly style={{ width: 70 }} />
                <input type="tel" className={`ws-input${errors.phone ? " error" : ""}`} placeholder="98765 43210" style={{ flex: 1 }} {...register("phone", { required: "Phone is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit number" } })} />
              </div>
              {errors.phone && <span className="ws-error">⚠ {errors.phone.message}</span>}
            </div>
            <div className="ws-field ws-grid-full">
              <label className="ws-label">Bio</label>
              <textarea className="ws-textarea" placeholder="Describe your experience, expertise, and what makes you stand out…" {...register("bio")} />
            </div>
          </div>
        </SectionCard>

        {/* Skills Section */}
        <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>} title="Your Skills">
          <input type="hidden" {...register("skills", { validate: v => (Array.isArray(v) && v.length > 0) || "Please select at least one skill" })} />
          <div className="ws-chips">
            {SKILLS.map(skill => (
              <button key={skill} type="button" className={`ws-chip${selectedSkills.includes(skill) ? " active" : ""}`} onClick={() => toggleSkill(skill)}>
                {selectedSkills.includes(skill) && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                {skill}
              </button>
            ))}
          </div>
          {errors.skills && <span className="ws-error" style={{ marginTop: 8, display: 'block' }}>⚠ {errors.skills.message}</span>}
        </SectionCard>

        {/* Language Section */}
        <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h8" /><circle cx="18" cy="16" r="3" /></svg>} title="Languages">
          <input type="hidden" {...register("languages", { validate: v => (Array.isArray(v) && v.length > 0) || "Please select at least one language" })} />
          <div className="ws-chips">
            {LANGUAGES.map(lang => (
              <button key={lang} type="button" className={`ws-chip${selectedLangs.includes(lang) ? " active" : ""}`} onClick={() => toggleLang(lang)}>
                {lang}
              </button>
            ))}
          </div>
          {errors.languages && <span className="ws-error" style={{ marginTop: 8, display: 'block' }}>⚠ {errors.languages.message}</span>}
        </SectionCard>

        {/* Location Section */}
        <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>} title="Service Location">
          <LocationAccessCard
            geoState={geoState}
            attempts={attempts}
            maxRetries={maxRetries}
            requestLocation={requestLocation}
            setGeoState={setGeoState}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            requireServiceArea={true}
          />
        </SectionCard>

        {/* Identity Section */}
        <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} title="Identity Verification">
          <div className="ws-field" style={{ marginBottom: 20 }}>
            <label className="ws-label">Government ID Type<span style={{ color: "#EF4444" }}>*</span></label>
            <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="idType" options={ID_TYPES} placeholder="Select ID type…" rules={{ required: "Please select an ID type" }} />
            {errors.idType && <span className="ws-error" style={{ marginTop: '6px' }}>⚠ {errors.idType.message}</span>}
          </div>
          <div className="ws-upload-grid" style={{ marginBottom: 16 }}>
            <UploadCard register={register} setValue={setValue} watch={watch} errors={errors} name="idFront" label="Upload Front Side" hint="Clear photo of the front — PNG, JPG" rules={{ required: "Front side is required" }} />
            <UploadCard register={register} setValue={setValue} watch={watch} errors={errors} name="idBack" label="Upload Back Side" hint="Clear photo of the back — PNG, JPG" rules={{ required: "Back side is required" }} />
          </div>
          <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 12 }}>Upload a clear selfie for identity matching.</p>
          <div className="ws-upload-grid ws-upload-grid--single">
            <UploadCard register={register} setValue={setValue} watch={watch} errors={errors} name="selfie" label="Upload Selfie Photo" hint="Make sure face is clearly visible" rules={{ required: "Selfie is required" }} />
          </div>
        </SectionCard>

        {/* Security Section */}
        <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>} title="Account Security">
          <div className="ws-grid-2">
            <div className="ws-field">
              <label className="ws-label">Password<span style={{ color: "#EF4444" }}>*</span></label>
              <PasswordInput
                name="password"
                register={register}
                rules={{ required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" }, pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])/, message: "Include at least one uppercase letter and one number" } }}
                error={errors.password}
                placeholder="Create a password"
                watch={watch}
                showStrength={true}
              />
            </div>
            <div className="ws-field">
              <label className="ws-label">Confirm Password<span style={{ color: "#EF4444" }}>*</span></label>
              <PasswordInput
                name="confirmPassword"
                register={register}
                rules={{ required: "Please confirm your password", validate: v => v === password || "Passwords do not match" }}
                error={errors.confirmPassword}
                placeholder="Repeat your password"
                watch={watch}
              />
            </div>
          </div>
          <div className="ws-checkbox-group" style={{ marginTop: 24 }}>
            <label className="ws-checkbox-item">
              <input type="checkbox" {...register("termsAccepted", { required: "This is required" })} />
              <span className="ws-checkbox-item__text">I agree to the <a href="#">Terms & Conditions</a></span>
            </label>
            {errors.termsAccepted && <span className="ws-error">⚠ Please accept all required agreements</span>}
          </div>
        </SectionCard>

        <div className="ws-section" style={{ background: "transparent", border: "none", boxShadow: "none", padding: "8px 0 0" }}>
          <button type="submit" className="ws-submit" disabled={isSubmittingForm} >
            <IconSend />
            {isSubmittingForm ? "Submitting…" : "Complete Registration"}
          </button>
          <div className="auth-cta-container" style={{ marginTop: 24 }}>
            <Link to="/login" className="auth-cta-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="auth-cta-icon-wrapper">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
              </div>
              <div className="auth-cta-content">
                <span className="auth-cta-subtitle">Already have an account?</span>
                <h3 className="auth-cta-title">
                  Log in to Nexaro
                  <svg className="auth-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </h3>
              </div>
            </Link>

            <Link to="/signup/poster" className="auth-cta-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="auth-cta-icon-wrapper">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <div className="auth-cta-content">
                <span className="auth-cta-subtitle">Need to hire someone?</span>
                <h3 className="auth-cta-title">
                  Register as a Poster
                  <svg className="auth-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </form>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="ws-modal-overlay">
          <div className="ws-modal-content votp-card">
            <div className="ws-modal-close" onClick={() => !isSubmittingForm && setShowOtpModal(false)}>✕</div>

            <header className="votp-card__header">
              <h2 className="votp-card__title">Verify Your Email</h2>
              <p className="votp-card__subtitle">
                We sent a 6-digit verification code to <b>{formDataCache?.email}</b>
              </p>
            </header>

            <form onSubmit={handleVerifyOtp} className="votp-form" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      handleDigitChange(idx, e.target.value);
                      if (e.target.value && idx < 5) {
                        document.getElementById(`otp-${idx + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        document.getElementById(`otp-${idx - 1}`)?.focus();
                      }
                    }}
                    style={{
                      width: 46, height: 52, fontSize: 22, textAlign: 'center', padding: 0, boxSizing: 'border-box',
                      border: otpStatus === 'error' ? '1px solid #EF4444' : '1px solid var(--color-border)',
                      borderRadius: 8, outline: 'none'
                    }}
                  />
                ))}
              </div>

              {otpStatus === 'error' && (
                <p style={{ color: '#EF4444', textAlign: 'center', fontSize: 13, marginBottom: 15 }}>
                  Invalid code. Please try again.
                </p>
              )}

              {otpStatus === 'success' && (
                <p style={{ color: '#036947ff', textAlign: 'center', fontSize: 13, marginBottom: 15 }}>
                  Verified successfully! Submitting registration...
                </p>
              )}

              <button
                type="submit"
                className="ws-submit"
                disabled={otpDigits.join('').length < 6 || otpStatus === 'submitting' || isSubmittingForm}
                style={{ background: (otpStatus === 'success' || isSubmittingForm) ? '#10B981' : 'var(--color-accent)' }}
              >
                {(otpStatus === 'submitting' || isSubmittingForm && otpStatus != 'success') ? 'Verifying...' : otpStatus === 'success' ? 'Verified! Registering...' : 'Verify & Register'}
              </button>

              <p style={{ textAlign: 'center', marginTop: 15, fontSize: 12, color: 'var(--color-muted)' }}>
              </p>
            </form>
          </div>
        </div>
      )}

      <footer className="ws-footer">
        © 2026 NEXARO Editorial Premium. All rights reserved.
      </footer>
    </div>
  );
}
