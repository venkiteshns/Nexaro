import { useState } from "react";

const IconUpload = () => (
  <svg width="20" height="20" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" fill="none" stroke="#0A6E5C" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7"/>
  </svg>
);

export default function UploadCard({ label, hint, onFile }) {
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
            <img
              className="ws-upload-card__preview"
              src={URL.createObjectURL(file)}
              alt="preview"
            />
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
