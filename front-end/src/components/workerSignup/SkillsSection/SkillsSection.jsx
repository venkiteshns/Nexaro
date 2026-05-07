import { useState } from "react";
import SectionCard from "../SectionCard/SectionCard.jsx";

const SKILLS = [
  "Electrician","Plumber","Carpenter","Painter","Gardener","Mason",
  "AC Technician","Welder","Tiler","Handyman","Cleaner","Driver",
];

const IconSkills = () => (
  <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

export default function SkillsSection({ onChange }) {
  const [selected, setSelected] = useState([]);

  function toggle(skill) {
    const next = selected.includes(skill)
      ? selected.filter(s => s !== skill)
      : [...selected, skill];
    setSelected(next);
    onChange(next);
  }

  return (
    <SectionCard icon={<IconSkills />} title="Your Skills">
      <div className="ws-chips">
        {SKILLS.map(skill => (
          <button
            key={skill}
            type="button"
            className={`ws-chip${selected.includes(skill) ? " active" : ""}`}
            onClick={() => toggle(skill)}
          >
            {selected.includes(skill) && (
              <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            )}
            {skill}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
