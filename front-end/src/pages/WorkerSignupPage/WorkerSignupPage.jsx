import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentPosition } from "../../services/geolocationService.js";
import { reverseGeocode } from "../../services/reverseGeocodeService.js";
import { geocode } from "../../services/geocodeService.js";
import "./WorkerSignupPage.css";
import { api } from "../../services/api.js";
import { useToast } from "../../hooks/useToast.js";
import { motion, AnimatePresence } from "framer-motion";
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

function CustomSelect({ name, options, placeholder, rules, register, setValue, watch, errors }) {
  const selectedValue = watch(name);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`ws-custom-select-wrap${isOpen ? ' ws-custom-select-wrap--open' : ''}`}
    >
      <input type="hidden" {...register(name, rules)} />
      <div
        className={`ws-custom-select ${errors[name] ? 'error' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(o => !o); } if (e.key === 'Escape') setIsOpen(false); }}
      >
        <span style={{ color: selectedValue ? 'var(--color-heading)' : 'var(--color-muted)' }}>
          {selectedValue || placeholder}
        </span>
        <svg
          className={`ws-custom-select-icon${isOpen ? ' ws-custom-select-icon--open' : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div className={`ws-custom-dropdown${isOpen ? ' open' : ''}`} role="listbox">
        {options.map(option => (
          <div
            key={option}
            className={`ws-custom-option${selectedValue === option ? ' selected' : ''}`}
            role="option"
            aria-selected={selectedValue === option}
            onClick={() => {
              setValue(name, option, { shouldValidate: true });
              setIsOpen(false);
            }}
          >
            {option}
            {selectedValue === option && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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

const IconEye = ({ off }) => off ? (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
) : (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Too short", color: "#EF4444" },
    { label: "Weak", color: "#F59E0B" },
    { label: "Fair", color: "#F59E0B" },
    { label: "Good", color: "#10B981" },
    { label: "Strong", color: "#0A6E5C" },
  ];
  return { score: s, ...map[s] };
}

function isInsecureNetworkOrigin() {
  return window.location.protocol === "http:" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
}

const SKILLS = ["Electrician", "Plumber", "Carpenter", "Painter", "Gardener", "Mason", "AC Technician", "Welder", "Tiler", "Handyman", "Cleaner", "Driver"];
const LANGUAGES = ["English", "Hindi", "Malayalam", "Tamil", "Telugu", "Kannada", "Bengali", "Marathi"];
const ID_TYPES = ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving Licence"];
const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
  "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
  "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];
const DISTRICT_AREAS = {
  "Thiruvananthapuram": ["Kazhakootam", "Kowdiar", "Pattom", "Vattiyoorkavu", "Nemom", "Attingal", "Neyyattinkara"],
  "Ernakulam": ["Kochi", "Kakkanad", "Edappally", "Fort Kochi", "Aluva", "Vyttila", "Palarivattom", "Angamaly"],
  "Kozhikode": ["Nadakkavu", "Mavoor Road", "Meenchanda", "Elathur", "Beypore", "Feroke"],
  "Thrissur": ["Poonkunnam", "Ollur", "Chalakudy", "Guruvayur", "Irinjalakuda", "Kunnamkulam"],
  "Malappuram": ["Manjeri", "Tirur", "Perinthalmanna", "Ponnani", "Kottakkal", "Tirurrangadi"],
  "Kannur": ["Thalassery", "Taliparamba", "Payyanur", "Mattannur", "Koothuparamba", "Iritty"],
  "Kollam": ["Karunagappally", "Punalur", "Kottarakkara", "Paravur", "Kundara", "Chavara"],
  "Palakkad": ["Ottapalam", "Shornur", "Chittur", "Pattambi", "Mannarkkad", "Alathur"],
  "Alappuzha": ["Cherthala", "Kayamkulam", "Chengannur", "Mavelikkara", "Harippad", "Haripad"],
  "Kottayam": ["Changanassery", "Pala", "Ettumanoor", "Vaikom", "Erattupetta", "Kanjirappally"],
  "Kasaragod": ["Kanhangad", "Nileshwaram", "Uppala", "Kumbla", "Manjeshwar", "Cheruvathur"],
  "Pathanamthitta": ["Thiruvalla", "Adoor", "Pandalam", "Ranni", "Konni", "Kozhencherry"],
  "Idukki": ["Thodupuzha", "Munnar", "Kumily", "Adimali", "Nedumkandam", "Painavu"],
  "Wayanad": ["Kalpetta", "Sulthan Bathery", "Mananthavady", "Meenangadi", "Vythiri", "Ambalavayal"]
};
const MAX_GEO_RETRIES = 3;


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

  const [geoState, setGeoState] = useState("idle");
  const [attempts, setAttempts] = useState(0);

  async function requestLocation() {
    if (isInsecureNetworkOrigin()) {
      setGeoState("manual");
      return;
    }
    setGeoState("loading");
    try {
      const pos = await getCurrentPosition();
      const addr = await reverseGeocode(pos);
      setValue("exactLat", pos.lat);
      setValue("exactLng", pos.lng);
      setValue("country", addr.country, { shouldValidate: true });
      setValue("state", addr.state, { shouldValidate: true });
      const matched = KERALA_DISTRICTS.find(d => d.toLowerCase() === (addr.district || "").toLowerCase());
      setValue("district", matched || addr.district, { shouldValidate: true });
      setValue("city", addr.city, { shouldValidate: true });
      setGeoState("granted");
    } catch (err) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_GEO_RETRIES) {
        setGeoState("exhausted");
      } else {
        setGeoState("failed");
      }
    }
  }

  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const password = watch("password", "");
  const strength = getStrength(password);

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
          <AnimatePresence mode="wait">
            {["idle", "loading", "failed"].includes(geoState) && (
              <motion.div
                key="loc-request"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="ws-loc-card"
              >
                <div className="ws-loc-icon" style={{ borderColor: geoState === "failed" ? "#EF4444" : "#E5E7EB", background: geoState === "failed" ? "#FEF2F2" : "#FFFFFF" }}>
                  {geoState === "failed" ? (
                    <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  ) : (
                    <svg width="26" height="26" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  )}
                </div>
                
                <div className="ws-loc-card__title" style={{ color: geoState === "failed" ? "#EF4444" : "var(--color-text)" }}>
                  {geoState === "loading" ? "Detecting Location..." : 
                   geoState === "failed" ? "Location Access Failed" : 
                   "Enable Location Access"}
                </div>
                
                <div className="ws-loc-card__sub" style={{ color: geoState === "failed" ? "#EF4444" : "var(--color-muted)" }}>
                  {geoState === "loading" ? "Please wait while we securely determine your location." : 
                   geoState === "failed" ? `Unable to detect your location. ${MAX_GEO_RETRIES - attempts} attempts remaining.` : 
                   "Allow Nexaro to detect your location for precise hyperlocal matching."}
                </div>
                
                <button 
                  type="button" 
                  className="ws-loc-btn" 
                  onClick={requestLocation}
                  disabled={geoState === "loading"}
                  style={{
                    background: geoState === "failed" ? "#EF4444" : "var(--color-accent)",
                    opacity: geoState === "loading" ? 0.7 : 1,
                    cursor: geoState === "loading" ? "wait" : "pointer"
                  }}
                >
                  {geoState === "loading" ? "Detecting..." : geoState === "failed" ? "Retry Access" : "Allow Location Access"}
                </button>
                
                <p style={{ marginTop: 14, fontSize: 12 }}>
                  <button 
                    type="button" 
                    onClick={() => setGeoState("manual")} 
                    disabled={geoState === "loading"}
                    style={{ background: "none", border: "none", color: "var(--color-muted)", cursor: geoState === "loading" ? "wait" : "pointer", textDecoration: "underline" }}
                  >
                    Skip and enter manually
                  </button>
                </p>
              </motion.div>
            )}

            {["exhausted", "manual", "granted"].includes(geoState) && (
              <motion.div
                key="loc-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
                className="ws-loc-fields"
                style={{ overflow: 'hidden' }}
              >
                {geoState === "granted" && (
                  <div style={{ marginBottom: 20, padding: 12, background: "#ECFDF5", color: "#065F46", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                    Location detected successfully. Fields auto-filled.
                  </div>
                )}
                {geoState === "exhausted" && (
                  <div style={{ marginBottom: 20, padding: 12, background: "#FEF2F2", color: "#991B1B", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Location access failed after multiple attempts. Please enter manually.
                  </div>
                )}
                <div className="ws-grid-2">
                  <div className="ws-field">
                    <label className="ws-label">Country<span style={{ color: "#EF4444" }}>*</span></label>
                    <input className={`ws-input${errors.country ? " error" : ""}`} placeholder="Enter country" defaultValue="India" {...register("country", { required: "Country is required" })} />
                    {errors.country && <span className="ws-error">⚠ {errors.country.message}</span>}
                  </div>
                  <div className="ws-field">
                    <label className="ws-label">State<span style={{ color: "#EF4444" }}>*</span></label>
                    <input className={`ws-input${errors.state ? " error" : ""}`} placeholder="Enter state" defaultValue="Kerala" {...register("state", { required: "State is required" })} />
                    {errors.state && <span className="ws-error">⚠ {errors.state.message}</span>}
                  </div>
                  <div className="ws-field">
                    <label className="ws-label">District<span style={{ color: "#EF4444" }}>*</span></label>
                    <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="district" options={KERALA_DISTRICTS} placeholder="Select district…" rules={{ required: "Please select a district" }} />
                    {errors.district && <span className="ws-error" style={{ marginTop: 4 }}>⚠ {errors.district.message}</span>}
                  </div>
                  <div className="ws-field">
                    <label className="ws-label">City / Place<span style={{ color: "#EF4444" }}>*</span></label>
                    <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="city" options={areas} placeholder={district ? `Select city in ${district}` : "Select district first"} rules={{ required: "City / Place is required" }} />
                    {errors.city && <span className="ws-error" style={{ marginTop: 4 }}>⚠ {errors.city.message}</span>}
                  </div>
                </div>
                {district && (
                  <div style={{ marginTop: 20 }}>
                    <label className="ws-label" style={{ marginBottom: 10, display: "block" }}>Preferred Service Area<span style={{ color: "#EF4444" }}>*</span></label>
                    <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="serviceArea" options={areas} placeholder={`Select a major city/area in ${district}`} rules={{ required: "Please select a service area" }} />
                    {errors.serviceArea && <span className="ws-error" style={{ marginTop: 6, display: 'block' }}>⚠ {errors.serviceArea.message}</span>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
              <div className="ws-password-wrap">
                <input type={showPw ? "text" : "password"} className={`ws-input${errors.password ? " error" : ""}`} placeholder="Create a password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" }, pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])/, message: "Include at least one uppercase letter and one number" } })} />
                <button type="button" className="ws-password-toggle" onClick={() => setShowPw(v => !v)}><IconEye off={showPw} /></button>
              </div>
              {password && (
                <>
                  <div className="ws-strength-bar">
                    <div className="ws-strength-fill" style={{ width: `${strength.score * 25}%`, background: strength.color }} />
                  </div>
                  <span className="ws-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                </>
              )}
              {errors.password && <span className="ws-error">⚠ {errors.password.message}</span>}
            </div>
            <div className="ws-field">
              <label className="ws-label">Confirm Password<span style={{ color: "#EF4444" }}>*</span></label>
              <div className="ws-password-wrap">
                <input type={showCf ? "text" : "password"} className={`ws-input${errors.confirmPassword ? " error" : ""}`} placeholder="Repeat your password" {...register("confirmPassword", { required: "Please confirm your password", validate: v => v === password || "Passwords do not match" })} />
                <button type="button" className="ws-password-toggle" onClick={() => setShowCf(v => !v)}><IconEye off={showCf} /></button>
              </div>
              {errors.confirmPassword && <span className="ws-error">⚠ {errors.confirmPassword.message}</span>}
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
          <p className="ws-login-link">
            Already have an account? <Link to="/login" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Log in here</Link>
          </p>
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
