import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import PersonalInfoSection        from "../components/workerSignup/PersonalInfoSection/PersonalInfoSection.jsx";
import SkillsSection              from "../components/workerSignup/SkillsSection/SkillsSection.jsx";
import LanguageSection            from "../components/workerSignup/LanguageSection/LanguageSection.jsx";
import ServiceLocationSection     from "../components/workerSignup/ServiceLocationSection/ServiceLocationSection.jsx";
import IdentityVerificationSection from "../components/workerSignup/IdentityVerificationSection/IdentityVerificationSection.jsx";
import AccountSecuritySection     from "../components/workerSignup/AccountSecuritySection/AccountSecuritySection.jsx";
import "../styles/worker-signup.css";
import "../styles/worker-signup-responsive.css";

// ── Navbar logo mark
const LogoMark = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Section icon helpers used inline
const IconSend = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export default function WorkerSignupPage() {
  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit, formState: { isSubmitting } } = methods;

  // Skill / language state collected outside RHF (chip components manage their own state)
  let selectedSkills    = [];
  let selectedLanguages = ["English"];
  const uploadedFiles   = {};

  function onSubmit(data) {
    const payload = {
      ...data,
      skills:    selectedSkills,
      languages: selectedLanguages,
      uploads:   uploadedFiles,
    };
    console.log("Worker signup payload →", payload);
    // TODO: POST to backend
    alert("Registration submitted! Check console for payload.");
  }

  return (
    <div className="ws-page">

      {/* ── Navbar ── */}
      <nav className="ws-nav">
        <div className="ws-nav__inner">
          <Link to="/" className="ws-nav__logo">
            <div className="ws-nav__logo-icon"><LogoMark /></div>
            <span className="ws-nav__logo-text">NEXARO</span>
          </Link>
          <Link to="/login" className="ws-nav__login">Log In</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
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

      {/* ── Form ── */}
      <FormProvider {...methods}>
        <form className="ws-body" onSubmit={handleSubmit(onSubmit)} noValidate>

          <PersonalInfoSection />

          <SkillsSection onChange={v => { selectedSkills = v; }} />

          <LanguageSection onChange={v => { selectedLanguages = v; }} />

          <ServiceLocationSection />

          <IdentityVerificationSection
            onFilesChange={(key, file) => { uploadedFiles[key] = file; }}
          />

          <AccountSecuritySection />

          {/* ── Submit ── */}
          <div className="ws-section" style={{ background: "transparent", border: "none",
            boxShadow: "none", padding: "8px 0 0" }}>
            <button type="submit" className="ws-submit" disabled={isSubmitting}>
              <IconSend />
              {isSubmitting ? "Submitting…" : "Complete Registration"}
            </button>
            <p className="ws-login-link">
              Already have an account? <Link to="/login">Log in here</Link>
            </p>
          </div>

        </form>
      </FormProvider>

      {/* ── Footer ── */}
      <footer className="ws-footer">
        © 2026 NEXARO Editorial Premium. All rights reserved.
      </footer>
    </div>
  );
}
