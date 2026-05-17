import React from "react";

const Location = (props) => {
  const worker = props?.worker;
  console.log(worker);
  
  return (
    <div className="mt-2" >
      {/* Country / State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs text-gray-700/80">
            Country
          </label>

          <select defaultValue="" className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white">
            <option value="" disabled className="text-gray-400" >Select Country</option>
            <option>India</option>
            <option>USA</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-700/80">
            State
          </label>

          <select defaultValue="" className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white">
            <option value="" disabled className="text-gray-400" >Select State</option>
            <option>Kerala</option>
          </select>
        </div>
      </div>

      {/* District / City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <div>
          <label className="text-xs text-gray-700/80">
            District
          </label>

          <select defaultValue="" className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white">
            <option value="" disabled className="text-gray-400" >Select District</option>
            <option>Ernakulam</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-700/80">
            City / Place
          </label>

          <input
            type="text"
            placeholder="Enter city or place"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
        </div>
        {worker && <div>
          <label className="text-xs text-gray-700/80">
            Work Place
          </label>

          <input
            type="text"
            placeholder="Enter city your Work Place"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
        </div>}
      </div>
    </div>
  );
};

export default Location;
