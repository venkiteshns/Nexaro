import React from "react";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <div className=" get-start grid grid-cols-1 md:grid-cols-2">
      {/* Poster */}
      <div className="p-5 py-15 flex flex-col items-center justify-center">
        <p className="text-xs text-slate-700/60 mb-5">THE REQUESTER</p>
        <h2 className="text-3xl mb-4">
          I need <span className="italic text-[#0a6e5c]">specialized</span> help.
        </h2>
        <p className="text-sm text-gray-600/90 px-5 md:px-20 text-center">
          Access a curated network of the top 1% local professionals. Get your
          projects done right, the first time.
        </p>
        <Link to='/signup/poster'>
        <span className="flex items-center justify-center bg-black/90 px-5 py-2 mt-8 rounded-xl text-white">
          <button>Post Your First Task </button>
          <MoveRight strokeWidth={1.8} className=" ms-1 w-4" />
        </span>
        </Link>
      </div>

      {/* Worker */}
      <div className="p-5 py-15 bg-black/85 text-white flex flex-col items-center justify-center">
        <p className="text-xs text-slate-400/90 mb-5">THE PROFESSIONAL</p>
        <h2 className="text-3xl mb-4">
          I have <span className="italic text-[#0a6e5c]">elite</span> skills.
        </h2>
        <p className="text-sm text-gray-600/90 px-5 md:px-20 text-center ">
          Join the most prestigious network of skilled workers. Earn more, work
          smarter, and build your editorial reputation.
        </p>
        <Link to='/signup/worker'>
        <span className="flex items-center justify-center bg-[#0a6e5c] px-5 py-2 mt-8 rounded-xl">
          <button>Join the Network </button> <MoveRight strokeWidth={1.8} className=" ms-1 w-4" />
        </span>
        </Link>
      </div>
    </div>
  );
};

export default GetStarted;
