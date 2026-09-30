import { TbCurrencyRupee } from "react-icons/tb";
import "./Landing.css";

const Hero = () => {
  return (
    <div className="w-full pt-20 sm:pt-24 flex flex-col md:grid md:grid-cols-3 py-4 sm:py-5"
      style={{ background: "linear-gradient(160deg, #f0fdf8 0%, #ffffff 55%, #ecfdf5 100%)" }}
    >
      <div className="hero p-5 sm:p-8 md:p-10 h-full flex flex-col justify-center animate-fade-up">
        <h1 className="title-text mb-3 sm:mb-6">
          Skills Meet <br /> Needs.
          <br />
          <span className="italic-accent italic">Instantly.</span>
        </h1>
        <p className="mb-4 sm:mb-8 max-w-xs text-xs sm:text-sm md:text-base delay-100 animate-fade-up">
          The world's first editorial-grade marketplace for specialized labor.
          Precision-matched professionals at your doorstep within minutes.
        </p>
        <div
          className="w-12 h-0.5 rounded-full delay-200 animate-fade-up"
          style={{ background: "linear-gradient(90deg, #0a6e5c, #10b981)" }}
        />
      </div>

      <div className="hero-cards col-span-2 flex flex-col px-4 sm:px-8 md:px-10 gap-4 sm:gap-6 md:gap-8 items-center justify-center animate-fade-in delay-200">
        <div className="card-profile card-com p-3.5 sm:p-5 mt-2 rounded-2xl sm:rounded-3xl w-full mx-auto">
          <div className="flex items-center gap-2.5 sm:gap-4 mb-2.5 sm:mb-4">
            <div className="hero-avatar flex items-center justify-center text-white text-sm sm:text-lg font-bold flex-shrink-0">
              JK
            </div>
            <div>
              <div className="hero-name text-sm sm:text-lg font-bold">John Kurian</div>
              <div className="hero-rating font-medium text-xs sm:text-sm">
                <span className="rating-star">★</span> 4.6 (149 Reviews)
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {["Networking", "Security", "Smart Home"].map((kw) => (
              <span key={kw} className="keyWords px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-xl text-[10.5px] sm:text-xs">
                {kw}
              </span>
            ))}
          </div>
          <div className="card-time mt-2 sm:mt-3 text-xs sm:text-sm">
            Response time:{" "}
            <span className="response-time font-semibold">Under 15 min</span>
          </div>
        </div>

        <div className="hero-bid card-com rounded-xl sm:rounded-2xl p-3.5 sm:p-5 w-full mx-auto lg:ms-32">
          <div className="bid-head mb-1 sm:mb-2 text-[10px] sm:text-xs">NEW BID RECEIVED</div>
          <div className="bid-title text-xs sm:text-base font-semibold mb-1">
            Kitchen Rewiring Project
          </div>
          <div className="amt-title text-[10px] sm:text-xs mt-1.5 sm:mt-3">Bid Amount</div>
          <div className="bid-amt flex items-center text-xl sm:text-3xl font-bold mb-2 sm:mb-3 mt-0.5 sm:mt-1">
            <TbCurrencyRupee />
            450.00
          </div>
          <button
            className="w-full text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #0a6e5c, #10b981)",
              boxShadow: "0 4px 14px rgba(10,110,92,0.28)",
            }}
          >
            Accept Bid
          </button>
          <div className="eta w-full text-[10px] sm:text-xs mt-1.5 sm:mt-2.5 flex items-center justify-center gap-1">
            ⏱ Ready to start in 2 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
