import React from "react";
import { TbCurrencyRupee } from "react-icons/tb";
import { MapPin, Dot, Wallet, Zap, ShieldUser, ShieldCheck } from "lucide-react";
import "./PosterSignupBanner.css";
import Logo from "../Logo/Logo";

const Taskcard = () => {
  return (
    <div className=" flex flex-col w-[90%] ps-5 mt-5">
      {/* card1 */}
      <div className=" max-w-5/6 grid grid-cols-2 bg-white/80 p-5 rounded-2xl -rotate-6 animate-[bounce_5s_ease-in-out_infinite]">
        <div className="text-green-700/80 bg-green-500/9 text-center pt-1 pb-1 py-2 font-semibold rounded-xl text-sm">
          Active Task
        </div>
        <div className="flex items-center justify-end me-5 text-green-700 font-semibold">
          <TbCurrencyRupee /> 500
        </div>
        <div className="col-span-2 flex flex-col gap-2 mt-3">
          <h2 className="text-xl font-semibold">Fix Bathroom water Leakage</h2>
          <p className="flex items-center text-xs text-gray-900/70">
            <MapPin strokeWidth={1} className="w-3 me-1" />
            Dwarka, Sector 2
          </p>
          <p className="flex text-green-700 items-center text-xs">
            <Dot /> 4 workers bidding
          </p>
        </div>
      </div>

      {/* card2 */}
      <div className=" max-w-5/6 bg-white/80 flex px-3 py-3 rounded-2xl mt-1 w-[85%] self-end rotate-3 animate-[bounce_5s_ease-in-out_infinite] ">
        <div className=" flex items-center justify-center text-green-700/80 bg-green-500/9 text-center py-3 px-3 rounded-3xl me-3">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <p>New bid received - ₹420</p>
          <p className="text-gray-900/50">from RaviKumar</p>
        </div>
      </div>
    </div>
  );
};

const Flow = () => {
  return (
    <div className="mt-5" >
      <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-black/70"><span className=" p-2 rounded-2xl text-green-700/50 bg-white/60 text-center"><Zap strokeWidth={1.6} className="w-4 h-4 "/></span>Get Bids in Minutes</div>
      <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-black/70"><span className=" p-2 rounded-2xl text-green-700/50 bg-white/60 text-center"><ShieldCheck strokeWidth={1.6} className="w-4 h-4 "/></span>Pay Only When Done</div>
      <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-black/70"><span className=" p-2 rounded-2xl text-green-700/50 bg-white/60 text-center"><ShieldUser strokeWidth={1.6} className="w-4 h-4 "/></span>Verified Workers Only</div>
    </div>
  );
};

const PosterSignUpBanner = () => {
  return (
    <div className="hidden bg-green-800/10 min-h-full pt-10 md:flex flex-col ps-10 gap-5 ">
      <Logo />
      <div className="banner-p flex-1 flex flex-col ">
        <h1 className="banner text-4xl mb-10 me-auto">
          Skills Meet <br /> Needs.
          <span className="italic text-[#0A6E5C]"> Instantly.</span>
        </h1>
        <Taskcard />
        <Flow />
        <p className="text-xs mt-auto text-gray-600/70 mb-4">TRUSTED BY 10,000+ PEOPLE</p>
      </div>
    </div>
  );
};

export default PosterSignUpBanner;
