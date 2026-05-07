import { useFormContext } from "react-hook-form";
import SectionCard from "../SectionCard/SectionCard.jsx";
import UploadCard from "../UploadCard/UploadCard.jsx";

const ID_TYPES = ["Aadhaar Card","PAN Card","Passport","Voter ID","Driving Licence"];

const IconShield = () => (
  <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function IdentityVerificationSection({ onFilesChange }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <SectionCard icon={<IconShield />} title="Identity Verification">
      {/* ID Type */}
      <div className="ws-field" style={{ marginBottom: 20 }}>
        <label className="ws-label">Government ID Type<span style={{ color:"#EF4444" }}>*</span></label>
        <select
          className={`ws-select${errors.idType ? " error" : ""}`}
          {...register("idType", { required: "Please select an ID type" })}
        >
          <option value="">Select ID type…</option>
          {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.idType && <span className="ws-error">⚠ {errors.idType.message}</span>}
      </div>

      {/* Front + Back */}
      <div className="ws-upload-grid" style={{ marginBottom: 16 }}>
        <UploadCard
          label="Upload Front Side"
          hint="Clear photo of the front — PNG, JPG"
          onFile={f => onFilesChange?.("idFront", f)}
        />
        <UploadCard
          label="Upload Back Side"
          hint="Clear photo of the back — PNG, JPG"
          onFile={f => onFilesChange?.("idBack", f)}
        />
      </div>

      {/* Selfie */}
      <p style={{ fontSize: 13, color: "var(--color-muted)", fontFamily: "var(--font-sans)",
        marginBottom: 12, lineHeight: 1.5 }}>
        📸 Upload a clear selfie for identity matching. Make sure your face is fully visible.
      </p>
      <div className="ws-upload-grid ws-upload-grid--single">
        <UploadCard
          label="Upload Selfie Photo"
          hint="Make sure face is clearly visible"
          onFile={f => onFilesChange?.("selfie", f)}
        />
      </div>
    </SectionCard>
  );
}
