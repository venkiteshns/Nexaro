import "./Workflow.css";

const STEPS = [
  {
    num: "01",
    title: "Define Your Mission",
    desc: "Tell us what you need with precision. We help you find the highest-rated experts.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 4h12v12H4zM8 8h4M8 11h4M8 14h2"
          stroke="#0A6E5C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    detail: "Step 1 of 3 · Drafting Requirement",
  },
  {
    num: "02",
    title: "Instant Match-Making",
    desc: "Your request is broadcast to verified professionals within a 10-KM radius. Watch bids arrive in real-time with comprehensive profiles.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#0A6E5C" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="#0A6E5C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    detail: "Category: Electrical · Finding workers nearby…",
  },
  {
    num: "03",
    title: "Execute & Secure",
    desc: "Choose your expert and lock in the rate. Payment is held in escrow and only released when you are 100% satisfied with the craftsmanship.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L4 5v5c0 4.418 2.686 7.74 6 8.944C14.314 17.74 17 14.418 17 10V5L10 2z"
          stroke="#0A6E5C"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M7 10l2 2 4-4"
          stroke="#0A6E5C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    detail: "Escrow Payment Released",
  },
];

export default function Workflow() {
  return (
    <section className="workflow">
      <div className="workflow__inner">
        {/* Header */}
        <div className="workflow__header">
          <div className="workflow__header-left">
            <p className="workflow__eyebrow">System Workflow</p>
            <h2 className="workflow__title">
              Built for those who value{" "}
              <span className="workflow__title-accent">time</span>
              {" "}over everything.
            </h2>
          </div>
          <p className="workflow__header-desc">
            We've re-engineered the marketplace experience. No endless searching,
            no ghosting, just results.
          </p>
        </div>

        {/* Steps */}
        <div className="workflow__steps steps-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="workflow__step">
              {/* Watermark */}
              <div className="workflow__step-watermark" aria-hidden="true">
                {step.num}
              </div>

              {/* Icon */}
              <div className="workflow__step-icon">{step.icon}</div>

              <h3 className="workflow__step-title">{step.title}</h3>
              <p className="workflow__step-desc">{step.desc}</p>

              {/* Detail chip */}
              <div className="workflow__step-chip">
                <div className="workflow__step-chip-dot" />
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
