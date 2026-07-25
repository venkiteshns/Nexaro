import { TbCurrencyRupee } from "react-icons/tb";
import "./Landing.css";

const Hero = () => {
  return (
    <div className="w-full pt-20 flex flex-col md:grid md:grid-cols-3 py-5"
      style={{ background: "linear-gradient(160deg, #f0fdf8 0%, #ffffff 55%, #ecfdf5 100%)" }}
    >
      {/* left hero */}
      <div className="hero p-10 h-full flex flex-col justify-center animate-fade-up">
        <h1 className="title-text mb-6">
          Skills Meet <br /> Needs.
          <br />
          <span className="italic-accent italic">Instantly.</span>
        </h1>
        <p className="mb-8 max-w-xs delay-100 animate-fade-up">
          The world's first editorial-grade marketplace for specialized labor.
          Precision-matched professionals at your doorstep within minutes.
        </p>
        {/* subtle decorative line */}
        <div
          className="w-12 h-0.5 rounded-full delay-200 animate-fade-up"
          style={{ background: "linear-gradient(90deg, #0a6e5c, #10b981)" }}
        />
      </div>

      {/* right hero cards */}
      <div className="hero-cards col-span-2 flex flex-col ps-10 pe-10 gap-8 items-center justify-center animate-fade-in delay-200">
        {/* Profile Card */}
        <div className="card-profile card-com p-6 mt-2 rounded-3xl w-full max-w-sm lg:w-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="hero-avatar flex items-center justify-center text-white text-lg font-bold">
              JK
            </div>
            <div>
              <div className="hero-name text-lg font-bold">John Kurian</div>
              <div className="hero-rating font-medium">
                <span className="rating-star">★</span> 4.6 (149 Reviews)
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Networking", "Security", "Smart Home"].map((kw) => (
              <span key={kw} className="keyWords px-3 py-1 rounded-xl">
                {kw}
              </span>
            ))}
          </div>
          <div className="card-time mt-3">
            Response time:{" "}
            <span className="response-time font-semibold">Under 15 min</span>
          </div>
        </div>

        {/* Bid Card */}
        <div className="hero-bid rounded-2xl p-5 card-com w-full max-w-sm lg:ms-32">
          <div className="bid-head mb-2">NEW BID RECEIVED</div>
          <div className="bid-title text-base font-semibold mb-1">
            Kitchen Rewiring Project
          </div>
          <div className="amt-title text-xs mt-3">Bid Amount</div>
          <div className="bid-amt flex items-center text-3xl font-bold mb-3 mt-1">
            <TbCurrencyRupee />
            450.00
          </div>
          <button
            className="w-full text-white p-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #0a6e5c, #10b981)",
              boxShadow: "0 4px 14px rgba(10,110,92,0.28)",
            }}
          >
            Accept Bid
          </button>
          <div className="eta w-full text-xs mt-2.5 flex items-center justify-center gap-1">
            ⏱ Ready to start in 2 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
