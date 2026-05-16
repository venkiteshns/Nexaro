import React from "react";
import { TbCurrencyRupee } from "react-icons/tb";
import "./Landing.css";

const Hero = () => {
  return (
    <div className="w-full pt-20 flex flex-col md:grid md:grid-cols-3 py-5 bg-green-700/10">
      {/* left hero */}
      <div className="hero p-10 h-full flex flex-col justify-center">
        <h1 className="title-text -tracking-[0.00em] mb-6">
          Skills Meet <br /> Needs.
          <span className="italic text-[#0A6E5C]">Instantly</span>
        </h1>
        <p>
          The world’s first editorial-grade marketplace for <br /> specialized
          labor. Precision-matched professionals at <br />
          your doorstep within minutes.
        </p>
      </div>

      {/* right hero cards */}
      <div className="hero-cards col-span-2 flex flex-col ps-10 pe-10 gap-8 items-center justify-center">
        <div className="card-profile card-com p-6 mt-2 rounded-3xl w-full max-w-sm lg:w-auto">
          <div className="flex items-center gap-8 mb-5">
            <div className="hero-avatar flex items-center justify-center text-white text-lg font-bold">
              JK
            </div>
            <div>
              <div className="hero-name text-lg font-bold">John Kurian</div>
              <div className="hero-rating font-medium">
                <span className="rating-star">★</span>
                4.6 (149 Reviews)
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Networking", "Security", "Smart Home"].map((keyWords) => (
              <span
                key={keyWords}
                className="keyWords text-sm px-2 py-1 rounded-xl"
              >
                {keyWords}
              </span>
            ))}
          </div>
          <div className="card-time mt-2 text-sm">
            Response time: <span className="response-time">Under 15 min</span>
          </div>
        </div>

        <div className="hero-bid rounded-2xl p-5 card-com w-full max-w-sm lg:ms-32">
          <div className="bid-head text-md font-bold mb-2 tracking-[0.09em]">
            NEW BID RECEIVED
          </div>
          <div className="bid-title text-md font-semibold mb-1">
            Kitchen Rewiring Project
          </div>
          <div className="amt-title">Bid Amount</div>
          <div className="bid-amt flex items-center text-3xl font-bold mb-1 mt-2 tracking-[0.05em] ">
            <TbCurrencyRupee />
            450.00
          </div>
          <button className="bid-btn w-full text-white p-1 rounded-xl font-semibold cursor-pointer bg-[#0a6e5c] hover:bg-[#308e7d]">
            Accept Bid
          </button>
          <div className="eta w-full text-xs mt-2 flex item-center justify-center">
            ⏱ Ready to start in 2 hours
          </div>
        </div>

      </div>

    </div>
  );
};

export default Hero;
