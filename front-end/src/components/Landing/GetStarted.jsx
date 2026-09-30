import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Landing.css";

const GetStarted = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="get-start grid grid-cols-1 md:grid-cols-2">
      <div
        className="p-5 py-8 sm:p-8 sm:py-16 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #f0fdf8 0%, #ffffff 60%, #ecfdf5 100%)",
        }}
      >
        <div
          className="absolute -top-16 -right-16 w-32 h-32 sm:w-48 sm:h-48 rounded-full pointer-events-none"
          style={{ background: "rgba(16,185,129,0.07)" }}
        />
        <p className="gs-label text-green-700/50 mb-1.5 sm:mb-4">The Requester</p>
        <h2 className="text-xl sm:text-3xl md:text-4xl text-center mb-2 sm:mb-4" style={{ color: "#0d1f1a" }}>
          I need{" "}
          <span
            className="italic"
            style={{
              background: "linear-gradient(135deg,#0a6e5c,#10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            specialized
          </span>{" "}
          help.
        </h2>
        <p className="gs-desc text-gray-500 px-2 sm:px-8 md:px-16 text-center mb-4 sm:mb-8 text-xs sm:text-sm max-w-sm sm:max-w-md">
          Access a curated network of the top 1% local professionals. Get your
          projects done right, the first time.
        </p>
        <Link to="/signup/poster" onClick={scrollToTop}>
          <span className="gs-btn-light">
            Register as a Poster
            <MoveRight strokeWidth={1.8} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        </Link>
      </div>

      <div
        className="p-5 py-8 sm:p-8 sm:py-16 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0a6e5c 0%, #065f46 50%, #064e3b 100%)",
        }}
      >
        <div
          className="absolute -bottom-16 -left-16 w-32 h-32 sm:w-48 sm:h-48 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <p className="gs-label text-green-300/60 mb-1.5 sm:mb-4">The Professional</p>
        <h2 className="text-xl sm:text-3xl md:text-4xl text-white text-center mb-2 sm:mb-4">
          I have{" "}
          <span
            className="italic"
            style={{ color: "#6ee7b7" }}
          >
            elite
          </span>{" "}
          skills.
        </h2>
        <p className="gs-desc text-green-100/60 px-2 sm:px-8 md:px-16 text-center mb-4 sm:mb-8 text-xs sm:text-sm max-w-sm sm:max-w-md">
          Join the most prestigious network of skilled workers. Earn more, work
          smarter, and build your editorial reputation.
        </p>
        <Link to="/signup/worker" onClick={scrollToTop}>
          <span className="gs-btn-dark">
            Register as a Worker
            <MoveRight strokeWidth={1.8} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default GetStarted;
