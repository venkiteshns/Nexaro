import { useState } from "react";
import SectionCard from "../SectionCard/SectionCard.jsx";

const LANGUAGES = ["English","Hindi","Malayalam","Tamil","Telugu","Kannada","Bengali","Marathi"];

const IconLang = () => (
  <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M5 8h14M5 12h14M5 16h8"/><circle cx="18" cy="16" r="3"/>
  </svg>
);

export default function LanguageSection({ onChange }) {
  const [selected, setSelected] = useState(["English"]);

  function toggle(lang) {
    const next = selected.includes(lang)
      ? selected.filter(l => l !== lang)
      : [...selected, lang];
    setSelected(next);
    onChange(next);
  }

  return (
    <SectionCard icon={<IconLang />} title="Languages">
      <div className="ws-chips">
        {LANGUAGES.map(lang => (
          <button
            key={lang}
            type="button"
            className={`ws-chip${selected.includes(lang) ? " active" : ""}`}
            onClick={() => toggle(lang)}
          >
            {lang}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
