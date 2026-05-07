import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      {/* Subtle background texture */}
      <div className="hero__bg" aria-hidden="true" />

      <div className="hero__grid hero-grid">
        {/* ── Left column ── */}
        <div>
          {/* Badge */}
          <div className="hero__badge">
            <div className="hero__badge-dot" />
            <span className="hero__badge-text">The Editorial Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="hero__title">
            Skills Meet
            <br />
            Needs.{" "}
            <span className="hero__title-accent">Instantly.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero__subtitle">
            The world's first editorial-grade marketplace for specialized labor.
            Precision-matched professionals at your doorstep within minutes.
          </p>

          {/* CTAs */}
          <div className="hero__cta-row">
            <a href="#" className="hero__btn-primary">
              Post a Task
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7H12M8 3L12 7L8 11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#" className="hero__btn-secondary">
              Find Workers
            </a>
          </div>
        </div>

        {/* ── Right column — floating cards ── */}
        <div className="hero__cards">
          {/* Profile card */}
          <div className="hero__card-profile">
            <div className="hero__card-profile-header">
              <div className="hero__card-avatar">MT</div>
              <div>
                <div className="hero__card-name">Marcus Thorne</div>
                <div className="hero__card-rating">
                  <span className="hero__card-rating-star">★</span>
                  4.9 (126 Reviews)
                </div>
              </div>
            </div>
            <div className="hero__card-tags">
              {["Networking", "Security", "Smart Home"].map((tag) => (
                <span key={tag} className="hero__card-tag">{tag}</span>
              ))}
            </div>
            <div className="hero__card-response">
              Response time:{" "}
              <span className="hero__card-response-time">Under 15 min</span>
            </div>
          </div>

          {/* Bid card */}
          <div className="hero__card-bid">
            <div className="hero__card-bid-label">NEW BID RECEIVED</div>
            <div className="hero__card-bid-title">Kitchen Rewiring Project</div>
            <div className="hero__card-bid-sublabel">Bid Amount</div>
            <div className="hero__card-bid-amount">₹450.00</div>
            <button className="hero__card-bid-btn">Accept Bid</button>
            <div className="hero__card-bid-eta">⏱ Ready to start in 2 hours</div>
          </div>

          {/* Decorative dot grid */}
          <div className="hero__dot-grid" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
