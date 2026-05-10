import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./HomePage.css";

import Navbar from "../../components/shared/Navbar/Navbar.jsx";



function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__grid hero-grid">
        {/* Left column */}
        <div>
          <div className="hero__badge">
            <div className="hero__badge-dot" />
            <span className="hero__badge-text">The Editorial Marketplace</span>
          </div>
          <h1 className="hero__title">
            Skills Meet<br />Needs.{" "}
            <span className="hero__title-accent">Instantly.</span>
          </h1>
          <p className="hero__subtitle">
            The world's first editorial-grade marketplace for specialized labor.
            Precision-matched professionals at your doorstep within minutes.
          </p>
          <div className="hero__cta-row">
            <Link
              to="/signup/poster"
              className="hero__btn-primary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Post a Task
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M8 3L12 7L8 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              to="/signup/worker"
              className="hero__btn-secondary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Find Workers
            </Link>
          </div>
        </div>

        {/* Right column — floating cards */}
        <div className="hero__cards">
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

          <div className="hero__card-bid">
            <div className="hero__card-bid-label">NEW BID RECEIVED</div>
            <div className="hero__card-bid-title">Kitchen Rewiring Project</div>
            <div className="hero__card-bid-sublabel">Bid Amount</div>
            <div className="hero__card-bid-amount">₹450.00</div>
            <Link
              to="/#getStart"
              className="hero__card-bid-btn"
              style={{ display: "block", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('getStart')?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '/#getStart');
                }
              }}
            >
              Accept Bid
            </Link>
            <div className="hero__card-bid-eta">⏱ Ready to start in 2 hours</div>
          </div>

          <div className="hero__dot-grid" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────
const STATS = [
  { value: "24,800+", label: "Active Experts" },
  { value: "98.2%", label: "Satisfaction Rate" },
  { value: "₹12.4M", label: "Worker Earnings" },
  { value: "15 Min", label: "Avg. Response" },
];

function Stats() {
  return (
    <section className="stats">
      <div className="stats__grid stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stats__item stat-item">
            <div className="stats__value">{s.value}</div>
            <div className="stats__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Workflow
// ─────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Define Your Mission",
    desc: "Tell us what you need with precision. We help you find the highest-rated experts.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 4h12v12H4zM8 8h4M8 11h4M8 14h2" stroke="#0A6E5C" strokeWidth="1.5" strokeLinecap="round" />
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
        <path d="M10 2L4 5v5c0 4.418 2.686 7.74 6 8.944C14.314 17.74 17 14.418 17 10V5L10 2z" stroke="#0A6E5C" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 10l2 2 4-4" stroke="#0A6E5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    detail: "Escrow Payment Released",
  },
];

function Workflow() {
  return (
    <section className="workflow">
      <div className="workflow__inner">
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

        <div className="workflow__steps steps-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="workflow__step">
              <div className="workflow__step-watermark" aria-hidden="true">{step.num}</div>
              <div className="workflow__step-icon">{step.icon}</div>
              <h3 className="workflow__step-title">{step.title}</h3>
              <p className="workflow__step-desc">{step.desc}</p>
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

// ─────────────────────────────────────────────
// Audience Split
// ─────────────────────────────────────────────
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5H11M7.5 3L11 6.5L7.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function AudienceSplit() {
  return (
    <section className="audience" id="getStart">
      <div className="audience__grid audience-grid">
        {/* Requester panel */}
        <div className="audience__panel audience__panel--requester audience-panel">
          <p className="audience__eyebrow">The Requester</p>
          <h2 className="audience__title">
            I need{" "}<span className="audience__title-italic">specialized</span>{" "}help.
          </h2>
          <p className="audience__desc">
            Access a curated network of the top 1% local professionals. Get
            your projects done right, the first time.
          </p>
          <Link
            to="/signup/poster"
            className="audience__btn-dark"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Post Your First Task <ArrowIcon />
          </Link>
        </div>

        {/* Professional panel */}
        <div className="audience__panel audience__panel--professional audience-panel">
          <div className="audience__dot-pattern" aria-hidden="true" />
          <div className="audience__panel-inner">
            <p className="audience__eyebrow">The Professional</p>
            <h2 className="audience__title">
              I have{" "}<span className="audience__title-accent">elite</span>{" "}skills.
            </h2>
            <p className="audience__desc">
              Join the most prestigious network of skilled workers. Earn more,
              work smarter, and build your editorial reputation.
            </p>
            <Link
              to="/signup/worker"
              className="audience__btn-accent"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Join the Network <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">
          <img src="/Logo_Nex.png" alt="NEXARO" style={{ height: "32px", width: "auto" }} />
          <span className="footer__logo-text">NEXARO</span>
        </div>
        <p className="footer__tagline">
          The editorial platform for professional marketplaces. Connecting
          verified talent with high-impact needs.
        </p>
        <p className="footer__copy">© 2026 NEXARO Editorial Premium. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Workflow />
        <AudienceSplit />
      </main>
      <Footer />
    </>
  );
}
