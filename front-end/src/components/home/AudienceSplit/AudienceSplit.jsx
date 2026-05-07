import "./AudienceSplit.css";

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M2 6.5H11M7.5 3L11 6.5L7.5 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AudienceSplit() {
  return (
    <section className="audience">
      <div className="audience__grid audience-grid">
        {/* Requester panel */}
        <div className="audience__panel audience__panel--requester audience-panel">
          <p className="audience__eyebrow">The Requester</p>
          <h2 className="audience__title">
            I need{" "}
            <span className="audience__title-italic">specialized</span>
            {" "}help.
          </h2>
          <p className="audience__desc">
            Access a curated network of the top 1% local professionals. Get
            your projects done right, the first time.
          </p>
          <a href="#" className="audience__btn-dark">
            Post Your First Task
            <ArrowIcon />
          </a>
        </div>

        {/* Professional panel */}
        <div className="audience__panel audience__panel--professional audience-panel">
          <div className="audience__dot-pattern" aria-hidden="true" />
          <div className="audience__panel-inner">
            <p className="audience__eyebrow">The Professional</p>
            <h2 className="audience__title">
              I have{" "}
              <span className="audience__title-accent">elite</span>
              {" "}skills.
            </h2>
            <p className="audience__desc">
              Join the most prestigious network of skilled workers. Earn more,
              work smarter, and build your editorial reputation.
            </p>
            <a href="#" className="audience__btn-accent">
              Join the Network
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
