import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import { getCurrentPosition } from "../../services/geolocationService.js";
import { reverseGeocode } from "../../services/reverseGeocodeService.js";
import { geocode } from "../../services/geocodeService.js";
import "./WorkerSignupPage.css";
import { api } from "../../services/api.js";

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

function CustomSelect({ name, options, placeholder, rules }) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
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
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <input type="hidden" {...register(name, rules)} />
      <div 
        className={`ws-custom-select ${errors[name] ? 'error' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: selectedValue ? 'var(--color-heading)' : 'var(--color-muted)' }}>
          {selectedValue || placeholder}
        </span>
        <svg className="ws-custom-select-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div className={`ws-custom-dropdown ${isOpen ? 'open' : ''}`}>
        {options.map(option => (
          <div 
            key={option} 
            className={`ws-custom-option ${selectedValue === option ? 'selected' : ''}`}
            onClick={() => {
              setValue(name, option, { shouldValidate: true });
              setIsOpen(false);
            }}
          >
            {option}
            {selectedValue === option && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
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

function UploadCard({ label, hint, onFile }) {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);

  function handleChange(e) {
    const f = e.target.files[0];
    if (f) { setFile(f); onFile && onFile(f); }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); onFile && onFile(f); }
  }

  return (
    <div
      className={`ws-upload-card${drag ? " dragover" : ""}${file ? " has-file" : ""}`}
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
          <div className="ws-upload-card__label">{label}</div>
          <div className="ws-upload-card__hint">{hint || "PNG, JPG up to 5MB"}</div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Form Sections
// ─────────────────────────────────────────────

// --- Personal Info ---
function PersonalInfoSection() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>} title="Personal Information">
      <div className="ws-grid-2">
        <div className="ws-field">
          <label className="ws-label">Full Name<span>*</span></label>
          <input className={`ws-input${errors.fullName ? " error" : ""}`} placeholder="Enter your full name" {...register("fullName", { required: "Full name is required", pattern: { value: /^(?=.*[A-Za-z]{2,})[A-Za-z]+(?: [A-Za-z]+)*$/, message: "Please enter a valid name, No Numbers or Special Characters Allowed" } })} />
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
  );
}

// --- Skills ---
const SKILLS = ["Electrician", "Plumber", "Carpenter", "Painter", "Gardener", "Mason", "AC Technician", "Welder", "Tiler", "Handyman", "Cleaner", "Driver"];
function SkillsSection({ onChange }) {
  const [selected, setSelected] = useState([]);
  function toggle(skill) {
    const next = selected.includes(skill) ? selected.filter(s => s !== skill) : [...selected, skill];
    setSelected(next);
    onChange(next);
  }
  return (
    <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>} title="Your Skills">
      <div className="ws-chips">
        {SKILLS.map(skill => (
          <button key={skill} type="button" className={`ws-chip${selected.includes(skill) ? " active" : ""}`} onClick={() => toggle(skill)}>
            {selected.includes(skill) && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
            {skill}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

// --- Languages ---
const LANGUAGES = ["English", "Hindi", "Malayalam", "Tamil", "Telugu", "Kannada", "Bengali", "Marathi"];
function LanguageSection({ onChange }) {
  const [selected, setSelected] = useState(["English"]);
  function toggle(lang) {
    const next = selected.includes(lang) ? selected.filter(l => l !== lang) : [...selected, lang];
    setSelected(next);
    onChange(next);
  }
  return (
    <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h8" /><circle cx="18" cy="16" r="3" /></svg>} title="Languages">
      <div className="ws-chips">
        {LANGUAGES.map(lang => (
          <button key={lang} type="button" className={`ws-chip${selected.includes(lang) ? " active" : ""}`} onClick={() => toggle(lang)}>
            {lang}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

// --- Service Location ---
function isInsecureNetworkOrigin() {
  return window.location.protocol === "http:" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function LocationFields({ register, banner }) {
  return (
    <div className="ws-loc-fields">
      {banner}
      <div className="ws-grid-2">
        {[
          { name: "country", label: "Country" },
          { name: "state", label: "State" },
          { name: "district", label: "District" },
          { name: "city", label: "City / Place" },
        ].map(({ name, label }) => (
          <div key={name} className="ws-field">
            <label className="ws-label">{label}</label>
            <input className="ws-input" placeholder={`Enter ${label.toLowerCase()}`} {...register(name)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceLocationSection() {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [geoState, setGeoState] = useState("idle");
  const [coords, setCoords] = useState(null);
  
  const district = watch("district");
  
  const DISTRICT_AREAS = {
    "Thiruvananthapuram": ["Kazhakootam", "Kowdiar", "Pattom", "Vattiyoorkavu", "Nemom", "Attingal"],
    "Ernakulam": ["Kochi", "Kakkanad", "Edappally", "Fort Kochi", "Aluva", "Vyttila", "Palarivattom"],
    "Kozhikode": ["Nadakkavu", "Mavoor Road", "Meenchanda", "Elathur", "Beypore"],
    "Thrissur": ["Poonkunnam", "Ollur", "Chalakudy", "Guruvayur", "Irinjalakuda"],
    "Malappuram": ["Manjeri", "Tirur", "Perinthalmanna", "Ponnani", "Kottakkal"],
    "Kannur": ["Thalassery", "Taliparamba", "Payyanur", "Mattannur", "Koothuparamba"],
    "Kollam": ["Karunagappally", "Punalur", "Kottarakkara", "Paravur", "Kundara"],
    "Palakkad": ["Ottapalam", "Shornur", "Chittur", "Pattambi", "Mannarkkad"],
    "Alappuzha": ["Cherthala", "Kayamkulam", "Chengannur", "Mavelikkara", "Harippad"],
    "Kottayam": ["Changanassery", "Pala", "Ettumanoor", "Vaikom", "Erattupetta"],
    "Kasaragod": ["Kanhangad", "Nileshwaram", "Uppala", "Kumbla", "Manjeshwar"],
    "Pathanamthitta": ["Thiruvalla", "Adoor", "Pandalam", "Ranni", "Konni"],
    "Idukki": ["Thodupuzha", "Munnar", "Kumily", "Adimali", "Nedumkandam"],
    "Wayanad": ["Kalpetta", "Sulthan Bathery", "Mananthavady", "Meenangadi", "Vythiri"]
  };
  
  const areas = DISTRICT_AREAS[district] || ["City Center", "North Zone", "South Zone", "East Zone", "West Zone"];

  async function requestLocation() {
    if (isInsecureNetworkOrigin()) {
      setGeoState("manual");
      return;
    }
    setGeoState("loading");
    try {
      const pos = await getCurrentPosition();
      setCoords(pos);
      const addr = await reverseGeocode(pos);
      setValue("country", addr.country, { shouldValidate: true });
      setValue("state", addr.state, { shouldValidate: true });
      setValue("district", addr.district, { shouldValidate: true });
      setValue("city", addr.city, { shouldValidate: true });
      setGeoState("granted");
    } catch {
      setGeoState("denied");
    }
  }


  const SuccessBanner = (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 14px", background: "var(--color-accent2)", borderRadius: 10, border: "1px solid #A7F3D0" }}>
      <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
      <span style={{ fontSize: 13, color: "var(--color-accent)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
        Location detected — fields auto-filled. You may edit them.
      </span>
    </div>
  );

  const ManualBanner = (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20, padding: "10px 14px", background: "#FFF7ED", borderRadius: 10, border: "1px solid #FCD34D" }}>
      <span style={{ fontSize: 14, marginTop: 1 }}>✏️</span>
      <span style={{ fontSize: 13, color: "#92400E", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
        Location access isn't available here — please enter your location manually.
      </span>
    </div>
  );

  return (
    <>
      <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>} title="Service Location">
        {geoState === "idle" && (
          <div className="ws-loc-card">
            <div className="ws-loc-icon">
              <svg width="26" height="26" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
            </div>
            <div className="ws-loc-card__title">Enable Location Access</div>
            <div className="ws-loc-card__sub">Allow Nexaro to detect your location for precise hyperlocal matching.<br />Your coordinates are never shared publicly.</div>
            <button type="button" className="ws-loc-btn" onClick={requestLocation}>
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" strokeDasharray="2 2" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
              Allow Location Access
            </button>
            <p style={{ marginTop: 14, fontSize: 12, color: "var(--color-subtle)", fontFamily: "var(--font-sans)" }}>
              Can't share location?{" "}
              <button type="button" onClick={() => setGeoState("manual")} style={{ background: "none", border: "none", color: "var(--color-accent)", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                Enter manually
              </button>
            </p>
          </div>
        )}
        {geoState === "loading" && (
          <div className="ws-loc-card" style={{ opacity: 0.75 }}>
            <div className="ws-loc-icon"><svg width="26" height="26" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeDasharray="4 2" /></svg></div>
            <div className="ws-loc-card__title">Detecting your location…</div>
            <div className="ws-loc-card__sub">Please allow the browser permission popup.</div>
          </div>
        )}
        {geoState === "denied" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🚫</span><span style={{ fontSize: 13, color: "#DC2626", fontFamily: "var(--font-sans)", fontWeight: 500 }}>Location access was denied.</span>
              </div>
              <button type="button" onClick={requestLocation} style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontFamily: "var(--font-sans)", color: "var(--color-body)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" strokeDasharray="2 2" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
                Retry
              </button>
            </div>
            <LocationFields register={register} banner={ManualBanner} />
          </>
        )}
        {geoState === "manual" && <LocationFields register={register} banner={ManualBanner} />}
        {geoState === "granted" && <LocationFields register={register} banner={SuccessBanner} />}

        {(geoState === "granted" || geoState === "denied" || geoState === "manual") && (
          <div style={{ marginTop: 24 }}>
            <label className="ws-label" style={{ marginBottom: 10, display: "block" }}>Preferred Service Area</label>
            <CustomSelect 
              name="serviceArea" 
              options={areas} 
              placeholder={`Select a major city/area in ${district || "your district"}`} 
              rules={{ required: "Please select a service area" }} 
            />
            {errors.serviceArea && <span className="ws-error" style={{ marginTop: '6px' }}>{errors.serviceArea.message}</span>}
          </div>
        )}
      </SectionCard>
    </>
  );
}

// --- Identity Verification ---
const ID_TYPES = ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving Licence"];
function IdentityVerificationSection({ onFilesChange }) {
  const { register, formState: { errors } } = useFormContext();
  return (
    <SectionCard icon={<svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} title="Identity Verification">
      <div className="ws-field" style={{ marginBottom: 20 }}>
        <label className="ws-label">Government ID Type<span style={{ color: "#EF4444" }}>*</span></label>
        <CustomSelect 
          name="idType" 
          options={ID_TYPES} 
          placeholder="Select ID type…" 
          rules={{ required: "Please select an ID type" }} 
        />
        {errors.idType && <span className="ws-error" style={{ marginTop: '6px' }}>⚠ {errors.idType.message}</span>}
      </div>
      <div className="ws-upload-grid" style={{ marginBottom: 16 }}>
        <UploadCard label="Upload Front Side" hint="Clear photo of the front — PNG, JPG" onFile={f => onFilesChange?.("idFront", f)} />
        <UploadCard label="Upload Back Side" hint="Clear photo of the back — PNG, JPG" onFile={f => onFilesChange?.("idBack", f)} />
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", fontFamily: "var(--font-sans)", marginBottom: 12, lineHeight: 1.5 }}>
        Upload a clear selfie for identity matching. Make sure your face is fully visible.
      </p>
      <div className="ws-upload-grid ws-upload-grid--single">
        <UploadCard label="Upload Selfie Photo" hint="Make sure face is clearly visible" onFile={f => onFilesChange?.("selfie", f)} />
      </div>
    </SectionCard>
  );
}

// --- Account Security ---
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

function AccountSecuritySection() {
  const { register, watch, formState: { errors } } = useFormContext();
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const password = watch("password", "");
  const strength = getStrength(password);

  return (
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
        {[
          { name: "termsAccepted", label: <>I agree to the <a href="#">Terms & Conditions</a></> }
        ].map(({ name, label }) => (
          <label key={name} className="ws-checkbox-item">
            <input type="checkbox" {...register(name, { required: "This is required" })} />
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

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function WorkerSignupPage() {
  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit, formState: { isSubmitting } } = methods;

  const selectedSkillsRef = useRef([]);
  const selectedLanguagesRef = useRef(["English"]);
  const uploadedFilesRef = useRef({});

  async function onSubmit(data) {
    const formData = new FormData();

    // 1. Append standard text fields
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    // 2. Append arrays (sending as JSON strings)
    formData.append("skills", JSON.stringify(selectedSkillsRef.current));
    formData.append("languages", JSON.stringify(selectedLanguagesRef.current));

    // 3. Append actual File objects
    if (uploadedFilesRef.current.idFront) formData.append("idFront", uploadedFilesRef.current.idFront);
    if (uploadedFilesRef.current.idBack) formData.append("idBack", uploadedFilesRef.current.idBack);
    if (uploadedFilesRef.current.selfie) formData.append("selfie", uploadedFilesRef.current.selfie);

    // 4. Geocode location and service area into coordinates
    try {
      const locationAddress = `${data.city}, ${data.district}, ${data.state}, ${data.country}`;
      const locationCoords = await geocode(locationAddress);
      if (locationCoords) {
        formData.append("locationLat", locationCoords.lat);
        formData.append("locationLng", locationCoords.lng);
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
      console.warn("Geocoding failed, submitting without coordinates:", geoErr);
    }

    try {
      const res = await api.post("/auth/signup/worker", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Worker signup response →", res.data);
      alert("Registration successful!");
    } catch (err) {
      console.error("Worker signup error →", err);
      alert("Registration failed!");
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

      <FormProvider {...methods}>
        <form className="ws-body" onSubmit={handleSubmit(onSubmit)} noValidate>
          <PersonalInfoSection />
          <SkillsSection onChange={v => { selectedSkillsRef.current = v; }} />
          <LanguageSection onChange={v => { selectedLanguagesRef.current = v; }} />
          <ServiceLocationSection />
          <IdentityVerificationSection onFilesChange={(key, file) => { uploadedFilesRef.current[key] = file; }} />
          <AccountSecuritySection />

          <div className="ws-section" style={{ background: "transparent", border: "none", boxShadow: "none", padding: "8px 0 0" }}>
            <button type="submit" className="ws-submit" disabled={isSubmitting}>
              <IconSend />
              {isSubmitting ? "Submitting…" : "Complete Registration"}
            </button>
            <p className="ws-login-link">
              Already have an account? <Link to="/login" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Log in here</Link>
            </p>
          </div>
        </form>
      </FormProvider>

      <footer className="ws-footer">
        © 2026 NEXARO Editorial Premium. All rights reserved.
      </footer>
    </div>
  );
}
