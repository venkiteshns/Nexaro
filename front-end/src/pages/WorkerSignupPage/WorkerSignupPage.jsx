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

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formDataCache, setFormDataCache] = useState(null);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));

  // ── OTP State Machine ──────────────────────────────────────────────────────
  // States: idle | verifying | invalid | success | registering | completed | failed
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [otpErrorMsg, setOtpErrorMsg] = useState('');
  const isSubmittingForm = verificationStatus === 'registering' || verificationStatus === 'completed';

  // ── Resend Timer ───────────────────────────────────────────────────────────
  const [timer, setTimer] = useState(60);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const MAX_RESEND = 3;


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

  const { 
    locationState, 
    setLocationState, 
    attempts, 
    requestLocation, 
    maxRetries,
    resolveManualCoords,
    retryManual
  } = useLocationAccess(setValue);
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

  // ── Main form submit → trigger OTP send 
  const [isFormSending, setIsFormSending] = useState(false);
  async function onFormSubmit(data) {
    setIsFormSending(true);
    try {
      const res = await api.post('/auth/get-otp', { email: data.email });
      if (res.data.success) {
        setFormDataCache(data);
        setTimer(60);
        setResendAttempts(0);
        setVerificationStatus('idle');
        setOtpDigits(Array(6).fill(''));
        setShowOtpModal(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setIsFormSending(false);
    }
  }

  // ── Resend timer tick ──────────────────────────────────────────────────────
  useEffect(() => {
    let interval = null;
    if (showOtpModal && timer > 0 && resendAttempts < MAX_RESEND) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer, resendAttempts]);

  // ── Handle digit change ────────────────────────────────────────────────────
  const handleDigitChange = useCallback((index, digit) => {
    if (!/^\d*$/.test(digit)) return;
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    // Typing clears an invalid state so user can retry
    if (verificationStatus === 'invalid') {
      setVerificationStatus('idle');
      setOtpErrorMsg('');
    }
  }, [verificationStatus]);

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  async function handleResendOtp() {
    if (resendAttempts >= MAX_RESEND || timer > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await api.post('/auth/get-otp', { email: formDataCache.email });
      if (res.data.success) {
        setTimer(60);
        setResendAttempts(prev => prev + 1);
        setOtpDigits(Array(6).fill(''));
        setVerificationStatus('idle');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  }


  // ── Send registration data to backend ─────────────────────────────────────
  async function sendDataToBackend(data) {
    setVerificationStatus('registering');
    const formData = new FormData();

    const skipKeys = ["skills", "languages", "idFront", "idBack", "selfie", "exactLat", "exactLng"];
    Object.keys(data).forEach(key => {
      if (!skipKeys.includes(key)) formData.append(key, data[key]);
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
      setVerificationStatus('completed');
      // Brief celebratory pause before navigating away
      await new Promise(r => setTimeout(r, 900));
      navigate("/worker/dashboard");
    } catch (err) {
      console.error("Worker signup error →", err);
      setVerificationStatus('failed');
      toast.error("Registration failed! " + (err?.response?.data?.message || err?.message));
      // Let user see the failure then return to idle so they can retry
      setTimeout(() => {
        setVerificationStatus('idle');
        setShowOtpModal(false);
      }, 2500);
    }
  }

  // ── OTP Verification (state-machine driven) ────────────────────────────────
  async function handleVerifyOtp(e) {
    e?.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) return;
    // Guard: only fire from idle state
    if (!['idle', 'invalid'].includes(verificationStatus)) return;

    setVerificationStatus('verifying');
    setOtpErrorMsg('');

    try {
      const res = await api.post('/auth/verify-otp', { email: formDataCache.email, otp: code });
      if (res.data.success) {
        // Stay in 'success' until registration finishes — do NOT reset digits
        setVerificationStatus('success');
        await sendDataToBackend(formDataCache);
      } else {
        handleOtpError(res.data.message || "Incorrect verification code. Please try again.");
      }
    } catch (err) {
      handleOtpError(err?.response?.data?.message || "Verification could not be completed right now. Please retry.");
    }
  }

  function handleOtpError(msg) {
    setVerificationStatus('invalid');
    setOtpErrorMsg(msg);
    setTimeout(() => {
      setVerificationStatus(prev => {
        if (prev === 'invalid') {
          setOtpDigits(Array(6).fill(''));
          setTimeout(() => document.getElementById('otp-0')?.focus(), 10);
        }
        return prev;
      });
    }, 800);
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
            locationState={locationState}
            attempts={attempts}
            maxRetries={maxRetries}
            requestLocation={requestLocation}
            setLocationState={setLocationState}
            resolveManualCoords={resolveManualCoords}
            retryManual={retryManual}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            requireServiceArea={true}
          />
          <input
            type="hidden"
            {...register("location_check", {
              validate: () =>
                ["granted", "autoDetected", "resolved"].includes(locationState) ||
                "Location is compulsory. Please allow access or confirm coordinates.",
            })}
          />
          {errors.location_check && (
            <span className="ws-error" style={{ marginTop: 8, display: 'block' }}>⚠ {errors.location_check.message}</span>
          )}
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
          <button type="submit" className="ws-submit" disabled={isFormSending}>
            <IconSend />
            {isFormSending ? "Sending OTP…" : "Complete Registration"}
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

      {/* OTP Verification Modal — State Machine UI */}
      {showOtpModal && (
        <div className="ws-modal-overlay">
          <div className={`ws-modal-content votp-card${verificationStatus === 'invalid' ? ' votp-card--shake' : ''}${verificationStatus === 'completed' ? ' votp-card--success-flash' : ''}`}>

            {/* Close — locked during processing */}
            <div
              className="ws-modal-close"
              onClick={() => {
                if (['idle', 'invalid', 'failed'].includes(verificationStatus)) {
                  setShowOtpModal(false);
                  setOtpDigits(Array(6).fill(''));
                  setVerificationStatus('idle');
                  setOtpErrorMsg('');
                  setTimer(60);
                  setResendAttempts(0);
                  setIsResending(false);
                }
              }}
              style={{
                opacity: ['idle', 'invalid', 'failed'].includes(verificationStatus) ? 1 : 0.3,
                pointerEvents: ['idle', 'invalid', 'failed'].includes(verificationStatus) ? 'auto' : 'none',
              }}
            >✕</div>

            {/* Status icon */}
            <div className={`votp-status-icon votp-status-icon--${
              verificationStatus === 'invalid' || verificationStatus === 'failed' ? 'error' :
              ['success','registering','completed'].includes(verificationStatus) ? 'success' :
              verificationStatus === 'verifying' ? 'loading' : 'default'
            }`}>
              {['success','registering','completed'].includes(verificationStatus) ? (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
              ) : verificationStatus === 'invalid' || verificationStatus === 'failed' ? (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : verificationStatus === 'verifying' ? (
                <svg className="votp-spinner" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8h10M7 12h6"/></svg>
              )}
            </div>

            {/* Header */}
            <header className="votp-card__header">
              <h2 className="votp-card__title">
                {verificationStatus === 'completed' ? 'Account Created!' :
                 verificationStatus === 'failed' ? 'Registration Failed' :
                 verificationStatus === 'registering' ? 'Creating Account…' :
                 verificationStatus === 'success' ? 'Code Verified!' :
                 'Verify Your Email'}
              </h2>
              <p className="votp-card__subtitle">
                {verificationStatus === 'completed' ? 'Welcome to NEXARO. Redirecting you now…' :
                 verificationStatus === 'failed' ? 'Something went wrong. Please try again.' :
                 verificationStatus === 'registering' ? 'Creating your account securely. Please wait…' :
                 verificationStatus === 'success' ? 'OTP verified. Submitting your registration…' :
                 <><span>We sent a 6-digit code to </span><b>{formDataCache?.email}</b></>}
              </p>
            </header>

            <form onSubmit={handleVerifyOtp} className="votp-form">

              {/* OTP digit inputs */}
              <div className={`votp-input-group${
                verificationStatus === 'invalid' ? ' votp-input-group--error-glow' :
                ['success','registering','completed'].includes(verificationStatus) ? ' votp-input-group--success-glow' : ''
              }`}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    value={digit}
                    disabled={!['idle', 'invalid'].includes(verificationStatus)}
                    className={`votp-input ${
                      verificationStatus === 'invalid' ? 'error' :
                      ['success','registering','completed'].includes(verificationStatus) ? 'success' : ''
                    }`}
                    onFocus={(e) => e.target.select()}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
                      if (pastedData.length > 0) {
                        setOtpDigits(prev => {
                          const next = [...prev];
                          pastedData.forEach((d, i) => { if (i < 6) next[i] = d; });
                          return next;
                        });
                        if (verificationStatus === 'invalid') {
                          setVerificationStatus('idle');
                          setOtpErrorMsg('');
                        }
                        setTimeout(() => document.getElementById(`otp-${Math.min(pastedData.length, 5)}`)?.focus(), 10);
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      handleDigitChange(idx, val.slice(-1));
                      if (val && idx < 5) setTimeout(() => document.getElementById(`otp-${idx + 1}`)?.focus(), 10);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        e.preventDefault();
                        handleDigitChange(idx - 1, '');
                        setTimeout(() => document.getElementById(`otp-${idx - 1}`)?.focus(), 10);
                      } else if (e.key === 'ArrowLeft' && idx > 0) {
                        e.preventDefault();
                        setTimeout(() => document.getElementById(`otp-${idx - 1}`)?.focus(), 10);
                      } else if (e.key === 'ArrowRight' && idx < 5) {
                        e.preventDefault();
                        setTimeout(() => document.getElementById(`otp-${idx + 1}`)?.focus(), 10);
                      }
                    }}
                  />
                ))}
              </div>

              {/* State feedback banner */}
              {verificationStatus === 'invalid' && (
                <div className="votp-feedback votp-feedback--error">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  {otpErrorMsg || "Invalid verification code. Please try again."}
                </div>
              )}
              {verificationStatus === 'verifying' && (
                <div className="votp-feedback votp-feedback--loading">
                  <svg className="votp-spinner-sm" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                  Verifying your code…
                </div>
              )}
              {(verificationStatus === 'success' || verificationStatus === 'registering') && (
                <div className="votp-feedback votp-feedback--success">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  {verificationStatus === 'registering' ? 'Creating your account securely…' : 'Verification successful! Setting up your profile…'}
                </div>
              )}
              {verificationStatus === 'completed' && (
                <div className="votp-feedback votp-feedback--success">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  Account created successfully. Welcome to NEXARO!
                </div>
              )}
              {verificationStatus === 'failed' && (
                <div className="votp-feedback votp-feedback--error">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  Registration failed. Please check your details and retry.
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`ws-submit votp-btn${
                  ['success','registering','completed'].includes(verificationStatus) ? ' votp-btn--success' :
                  verificationStatus === 'invalid' ? ' votp-btn--error' :
                  verificationStatus === 'verifying' ? ' votp-btn--loading' : ''
                }`}
                disabled={otpDigits.join('').length < 6 || !['idle', 'invalid'].includes(verificationStatus)}
              >
                {verificationStatus === 'verifying' && (
                  <svg className="votp-spinner-sm" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                )}
                {verificationStatus === 'completed' ? 'Registration Complete ✓' :
                 verificationStatus === 'registering' ? 'Creating Account…' :
                 verificationStatus === 'success' ? 'Verified! Setting up…' :
                 verificationStatus === 'verifying' ? 'Verifying OTP…' :
                 'Verify & Register'}
              </button>

              {/* Resend row */}
              {['idle', 'invalid'].includes(verificationStatus) && (
                <p className="votp-resend">
                  {resendAttempts >= MAX_RESEND ? (
                    <span className="votp-resend__limit">Resend limit reached. Please start over.</span>
                  ) : timer > 0 ? (
                    <span className="votp-resend__timer">Resend code in <b>{timer}s</b></span>
                  ) : (
                    <button
                      type="button"
                      className="votp-resend__btn"
                      onClick={handleResendOtp}
                      disabled={isResending}
                    >
                      {isResending ? 'Sending…' : 'Resend verification code'}
                    </button>
                  )}
                  {resendAttempts > 0 && resendAttempts < MAX_RESEND && (
                    <span className="votp-resend__count"> ({MAX_RESEND - resendAttempts} left)</span>
                  )}
                </p>
              )}

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
