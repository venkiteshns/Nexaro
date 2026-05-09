import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

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
          <img src="/Logo_Nex.png" alt="NEXARO" style={{ height: "32px", width: "auto" }} />
          <span className="navbar__logo-text">NEXARO</span>
        </div>

        {/* CTA Group */}
        <div className="navbar__cta">
          <Link to="/login" className="navbar__login" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Login</Link>
          <Link 
            to="/#getStart" 
            className="navbar__get-started"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('getStart')?.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', '/#getStart');
              }
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
