import { TbCurrencyRupee } from "react-icons/tb";
import { MapPin, Dot, Wallet, Zap, ShieldUser, ShieldCheck } from "lucide-react";
import "./PosterSignupBanner.css";
import Logo from "../Logo/Logo";

const Taskcard = () => {
  return (
    <div className="flex flex-col w-[90%] max-w-xs ps-5 mt-5">
      {/* card1 — Task card */}
      <div
        className="-rotate-6 animate-[bounce_5s_ease-in-out_infinite] p-5 rounded-3xl"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(10,110,92,0.10)",
          boxShadow:
            "0 4px 24px rgba(10,110,92,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top row: badge + price */}
        <div className="flex items-center justify-between mb-4">
          {/* Active Task pill */}
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: "#ecfdf5",
              color: "#0a6e5c",
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: "0.01em",
            }}
          >
            Active Task
          </span>
          {/* Price */}
          <span
            className="flex items-center text-sm font-semibold"
            style={{ color: "#0a6e5c", fontFamily: '"DM Sans", sans-serif' }}
          >
            <TbCurrencyRupee /> 500
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-base font-bold leading-snug mb-2"
          style={{ color: "#0d1f1a", fontFamily: '"DM Sans", sans-serif', fontWeight: 700 }}
        >
          Fix Bathroom water Leakage
        </h2>

        {/* Location */}
        <p
          className="flex items-center gap-1 text-xs mb-1"
          style={{ color: "#9ca3af", fontFamily: '"DM Sans", sans-serif' }}
        >
          <MapPin strokeWidth={1.5} className="w-3 h-3 flex-shrink-0" />
          Dwarka, Sector 2
        </p>

        {/* Bidding count */}
        <p
          className="flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: "#0a6e5c", fontFamily: '"DM Sans", sans-serif' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0a6e5c] inline-block" />
          4 workers bidding
        </p>
      </div>

      {/* card2 — Bid notification */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mt-3 w-[82%] self-end rotate-3 animate-[bounce_5s_ease-in-out_infinite]"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(10,110,92,0.10)",
          boxShadow:
            "0 4px 20px rgba(10,110,92,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #0a6e5c, #10b981)",
          }}
        >
          <Wallet className="w-4 h-4 text-white" />
        </div>

        {/* Text */}
        <div style={{ fontFamily: '"DM Sans", sans-serif' }}>
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: "#0d1f1a" }}
          >
            New bid received — ₹420
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
            from RaviKumar
          </p>
        </div>
      </div>
    </div>
  );
};

const Flow = () => {
  return (
    <div className="mt-6">
      {[
        { icon: <Zap strokeWidth={1.6} className="w-4 h-4" />, label: "Get Bids in Minutes" },
        { icon: <ShieldCheck strokeWidth={1.6} className="w-4 h-4" />, label: "Pay Only When Done" },
        { icon: <ShieldUser strokeWidth={1.6} className="w-4 h-4" />, label: "Verified Workers Only" },
      ].map(({ icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-3 mt-3 text-sm font-semibold"
          style={{ color: "#374151", fontFamily: '"DM Sans", sans-serif' }}
        >
          <span
            className="p-2 rounded-xl flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(10,110,92,0.14)",
              color: "#0a6e5c",
              boxShadow: "0 2px 8px rgba(10,110,92,0.07)",
            }}
          >
            {icon}
          </span>
          {label}
        </div>
      ))}
    </div>
  );
};

const PosterSignUpBanner = () => {
  return (
    <div
      className="hidden min-h-full pt-10 md:flex flex-col ps-10 gap-5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #ecfdf5 0%, #f0fdf8 50%, #d1fae5 100%)",
        borderRight: "1px solid rgba(10,110,92,0.10)",
      }}
    >
      {/* Decorative faint circles */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "rgba(16,185,129,0.08)" }}
      />
      <div
        className="absolute bottom-10 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(10,110,92,0.06)" }}
      />

      <Logo />
      <div className="banner-p flex-1 flex flex-col relative z-10">
        <h1
          className="banner text-4xl mb-10 me-auto leading-tight tracking-tight"
          style={{ color: "#0d1f1a" }}
        >
          Skills Meet <br /> Needs.
          <span
            className="italic"
            style={{
              background: "linear-gradient(135deg,#0a6e5c,#10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {" "}
            Instantly.
          </span>
        </h1>
        <Taskcard />
        <Flow />
        <p
          className="text-xs mt-auto mb-6 font-medium tracking-widest"
          style={{ color: "#9ca3af", fontFamily: '"DM Sans", sans-serif' }}
        >
          TRUSTED BY 10,000+ PEOPLE
        </p>
      </div>
    </div>
  );
};

export default PosterSignUpBanner;
