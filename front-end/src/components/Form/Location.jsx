import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { KERALA_DISTRICTS, DISTRICT_AREAS } from "../../utils/constants";
import { getCoords } from "../../services/getCooords";
import { reverseCoords } from "../../services/reverseCoords";

const Location = (props) => {
  const worker = props?.worker;

  const [location, setLocation] = useState({})
  const [countryCode, setCountryCode] = useState("IN");
  const [district, setDistrict] = useState(location?.district || "Kozhikode");
  const [coords, setCoords] = useState('')
  console.log(coords);
  
  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(countryCode);

  const getLocationDetails = async () => {
    try {
      const coords = await getCoords()
      const locationData = await reverseCoords(coords)
      console.log(locationData);
      setDistrict(locationData?.district || "Kannur")
      setLocation(locationData)
      
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <div className="mt-5 w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm">
        <button className="bg-green-600 rounded-3xl text-white px-3 py-4 text-sm " onClick={getLocationDetails} >GET LOCATION</button>
      </div>
      <div className="mt-5 w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm">
        {/* Country / State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-gray-700/80">
              Country <span className="text-red-500">*</span>
            </label>

            <select
              onChange={(e) => {
                setCountryCode(e.target.value);
              }}
              defaultValue={location?.country ? location?.country : ""}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white"
            >
              <option value="" disabled className="text-gray-400">
                {location?.country ? location?.country : "Select Country"}
              </option>
              {countries.map((c) => (
                <option value={c.isoCode} key={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-700/80">
              State <span className="text-red-500">*</span>
            </label>

            <select
              defaultValue={location?.state ? location.state : ""} 
              className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white"
            >
              <option value="" disabled className="text-gray-400">
                {location?.state ? location.state : "Select State"} 
              </option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District / City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          <div>
            <label className="text-xs text-gray-700/80">
              District <span className="text-red-500">*</span>
            </label>

            <select
              onChange={(e) => {
                setDistrict(e.target.value);
              }}
              defaultValue= {location?.district ? location.district : ""}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white"
            >
              <option value="" disabled className="text-gray-400">
               {location?.district ? location.district : " Select District"}
              </option>
              {KERALA_DISTRICTS.map((d) => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-700/80">
              City / Place <span className="text-red-500">*</span>
            </label>

            <select
              onChange={() => {
                setDistrict(e.target.value);
              }}
              defaultValue={location?.city ? location.city : ""}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white"
            >
              <option value="" disabled className="text-gray-400">
                {location?.city ? location.city : "Select City"}
              </option>
              {DISTRICT_AREAS[district].map((a) => (
                <option value={a} key={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {worker && (
            <div>
              <label className="text-xs text-gray-700/80">
                Work Area <span className="text-red-500">*</span>
              </label>

              <select
                onChange={() => {
                  setDistrict(e.target.value);
                }}
                defaultValue=""
                className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800 bg-white"
              >
                <option value="" disabled className="text-gray-400">
                  Select Work Area
                </option>
                {DISTRICT_AREAS[district].map((a) => (
                  <option value={a} key={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;
