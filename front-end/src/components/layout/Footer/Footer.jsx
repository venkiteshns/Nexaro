import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Logo */}
        <div className="footer__logo">
          <div className="footer__logo-icon">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7L6 11L12 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="footer__logo-text">NEXARO</span>
        </div>

        {/* Tagline */}
        <p className="footer__tagline">
          The editorial platform for professional marketplaces. Connecting
          verified talent with high-impact needs.
        </p>

        {/* Copyright */}
        <p className="footer__copy">
          © 2026 NEXARO Editorial Premium. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
