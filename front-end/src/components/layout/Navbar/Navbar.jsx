import { useState, useEffect } from "react";
import "./Navbar.css";

const NAV_LINKS = ["How it Works", "Find Workers", "Post a Task", "Pricing"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <div className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8L7 12L13 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="navbar__logo-text">NEXARO</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar__links nav-links-desktop">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="navbar__link">
              {link}
            </a>
          ))}
        </div>

        {/* CTA Group */}
        <div className="navbar__cta">
          <a href="#" className="navbar__login">Login</a>
          <a href="#" className="navbar__get-started">Get Started</a>
        </div>
      </div>
    </nav>
  );
}
