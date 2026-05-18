import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useFormContext } from "react-hook-form";
import { KERALA_DISTRICTS, DISTRICT_AREAS } from "../../utils/constants";
import { getCoords } from "../../services/getCooords";
import { reverseCoords } from "../../services/reverseCoords";
import { MapPin, Loader2, LocateFixed } from "lucide-react";
import { placeToCoords } from "../../services/placeToCoords";

const Location = ({ worker }) => {
  const {
    register,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext();

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedDistrict = watch("district");

  const [countryCode, setCountryCode] = useState("IN");
  const [district, setDistrict] = useState("Kozhikode");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchCords, setFetchCoords] = useState("idle"); // idle, fetching, success, fail
  const [WFetchCords, setWFetchCords] = useState("idle"); // idle, fetching, success, fail

  const [locationError, setLocationError] = useState("");
  const [afterChangeLocation, setAfterChangeLocation] = useState("idle"); //idle, set, changed
  const [afterChangeWorkPlace, setAfterChangeWorkPlace] = useState("idle");

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(countryCode);

  const isKerala = selectedState === "Kerala";
  const districtAreas =
    district && DISTRICT_AREAS[district] ? DISTRICT_AREAS[district] : [];

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const found = countries.find((c) => c.name === countryName);
    if (found) setCountryCode(found.isoCode);

    setValue("country", countryName, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("state", "", { shouldValidate: true, shouldDirty: true });
    setValue("district", "", { shouldValidate: true, shouldDirty: true });
    setValue("city", "", { shouldValidate: true, shouldDirty: true });
    if (afterChangeLocation === "set") setAfterChangeLocation("changed");
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setValue("state", stateName, { shouldValidate: true, shouldDirty: true });
    setValue("district", "", { shouldValidate: true, shouldDirty: true });
    setValue("city", "", { shouldValidate: true, shouldDirty: true });
    if (afterChangeLocation === "set") setAfterChangeLocation("changed");
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setDistrict(districtName);
    setValue("district", districtName, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("city", "", { shouldValidate: true, shouldDirty: true });
    if (afterChangeLocation === "set") setAfterChangeLocation("changed");
  };

  const handleCityChange = (e) => {
    setValue("city", e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setAfterChangeLocation("changed");
  };

  const handleWorkPlaceChange = (e) => {
    setValue("workPlace", e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setAfterChangeWorkPlace("changed");
  };

  const handleGetLocation = async () => {
    setFetchingLocation(true);
    setLocationError("");

    try {
      const coords = await getCoords();
      const locationData = await reverseCoords(coords);
      const { country, state, district: detectedDistrict, city } = locationData;

      const foundCountry = countries.find((c) => c.name === country);
      if (foundCountry) setCountryCode(foundCountry.isoCode);
      setValue("country", country);
      setValue("state", state);

      await new Promise((resolve) => setTimeout(resolve, 0));

      if (detectedDistrict) setDistrict(detectedDistrict);

      setValue("district", detectedDistrict);
      setAfterChangeLocation("set");
    } catch (err) {
      setLocationError("Could not detect location. Please fill manually.");
      console.error(err.message);
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleLocationCoords = async (type) => {
    type === "city" ? setFetchCoords("fetching") : setWFetchCords("fetching");
    let value = getValues();
    let city = type === "city" ? value.city : value.workPlace;
    let payload = {
      country: value.country,
      city,
      state: value.state,
      district: value.district,
    };
    try {
      let res = await placeToCoords(payload);
      setTimeout(() => {
        type == "city"
          ? setAfterChangeLocation("idle")
          : setAfterChangeWorkPlace("idle");
        type === "city" ? setFetchCoords("idle") : setWFetchCords("idle");
      }, 1500);
      type === "city" ? setFetchCoords("success") : setWFetchCords("success");
    } catch (error) {
      type === "city" ? setFetchCoords("fail") : setWFetchCords("fail");

      setTimeout(() => {
        type === "city" ? setFetchCoords("idle") : setWFetchCords("idle");
        type == "city"
          ? setAfterChangeLocation("changed")
          : setAfterChangeLocation("changed");
      }, 1500);
    }
  };

  useEffect(() => {
    if (selectedDistrict) setDistrict(selectedDistrict);
  }, [selectedDistrict]);

  const fieldClass =
    "w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white outline-none " +
    "focus:ring-1 focus:ring-green-700 focus:border-transparent text-sm text-gray-800";

  const errorFieldClass =
    "w-full rounded-xl border border-red-400 px-4 py-2.5 bg-white outline-none " +
    "focus:ring-1 focus:ring-red-400 focus:border-transparent transition text-sm text-gray-800";

  return (
    <div className="space-y-5">
      {/* Location Button */}
      <div className=" mt-5 w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-4">
          Click the button below to auto-detect and fill your location, or fill
          the fields manually.
        </p>

        <button
          type="button"
          onClick={handleGetLocation}
          disabled={fetchingLocation}
          className="flex items-center gap-2 bg-green-800/80 hover:bg-green-700 disabled:opacity-60 
                     rounded-2xl text-white px-5 py-3 text-sm font-medium transition-all"
        >
          {fetchingLocation ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MapPin size={16} />
          )}
          {fetchingLocation ? "Detecting location..." : "Get My Location"}
        </button>

        {locationError && (
          <p className="italic text-red-400/90 text-xs mt-3">{locationError}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm space-y-5">
        {/* error msg */}
        {(errors.country || errors.state || errors.district || errors.city) && (
          <p className="italic text-red-400/90 text-xs">
            Please fill all the location fields.
          </p>
        )}

        {/* Country & State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Country */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              {...register("country", { required: true })}
              value={selectedCountry || ""}
              onChange={handleCountryChange}
              className={errors.country ? errorFieldClass : fieldClass}
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              State <span className="text-red-500">*</span>
            </label>
            <select
              {...register("state", { required: true })}
              value={selectedState || ""}
              onChange={handleStateChange}
              className={errors.state ? errorFieldClass : fieldClass}
              disabled={!selectedCountry}
            >
              <option value="" disabled>
                {selectedCountry ? "Select State" : "Select a country first"}
              </option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              District <span className="text-red-500">*</span>
            </label>
            <select
              {...register("district", { required: true })}
              value={selectedDistrict || ""}
              onChange={handleDistrictChange}
              className={errors.district ? errorFieldClass : fieldClass}
              disabled={!isKerala}
            >
              <option value="" disabled>
                {!selectedState
                  ? "Select a state first"
                  : !isKerala
                    ? "Not available for this state"
                    : "Select District"}
              </option>
              {isKerala &&
                KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {/* City / Place */}

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              City / Place <span className="text-red-500">*</span>
            </label>

            <select
              {...register("city", { required: true })}
              value={watch("city") || ""}
              onChange={handleCityChange}
              className={errors.city ? errorFieldClass : fieldClass}
              disabled={!selectedDistrict}
            >
              <option value="" disabled>
                {!selectedDistrict
                  ? "Select a district first"
                  : "Select City / Place"}
              </option>
              {districtAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
        {afterChangeLocation === "changed" && (
          <div className="p-1 flex">
            <button
              onClick={() => {
                handleLocationCoords("city");
              }}
              type="button"
              disabled={fetchCords !== "idle"}
              className={`ms-auto text-xs bg-green-800/80 py-2 px-3.5 text-white rounded-xl hover:bg-green-700 ${fetchCords == "fetching" ? "opacity-50 cursor-not-allowed" : fetchCords === "fail" ? "bg-red-600 hover:bg-red-600/50" : ""}`}
            >
              {fetchCords === "idle" ? (
                <span className="flex items-center gap-2">
                  <LocateFixed size={17} strokeWidth={1.5} />
                  Confirm Location
                </span>
              ) : fetchCords === "fetching" ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={17} className="animate-spin" /> Fetching
                  Coordinates...
                </span>
              ) : fetchCords === "success" ? (
                "Coordinates Retrived Succesfully"
              ) : (
                "Cordinates search failed"
              )}
            </button>
          </div>
        )}
        {/* only workers */}
        {worker && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Preferred Work Area <span className="text-red-500">*</span>
              </label>
              <select
                {...register("workPlace", {
                  required: "Please select your preferred work area",
                })}
                onChange={handleWorkPlaceChange}
                defaultValue=""
                className={errors.workPlace ? errorFieldClass : fieldClass}
                disabled={!selectedDistrict}
              >
                <option value="" disabled>
                  {!selectedDistrict
                    ? "Select a district first"
                    : "Select Work Area"}
                </option>
                {districtAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {errors.workPlace && (
                <p className="italic text-red-400/90 text-xs">
                  {errors.workPlace.message}
                </p>
              )}
            </div>
            {afterChangeWorkPlace === "changed" && (
              <div className="p-1 flex">
                <button
                  onClick={() => {
                    handleLocationCoords("workPlace");
                  }}
                  type="button"
                  disabled={WFetchCords !== "idle"}
                  className={`ms-auto text-xs bg-green-800/80 py-2 px-3.5 text-white rounded-xl hover:bg-green-700 ${WFetchCords == "fetching" ? "opacity-50 cursor-not-allowed" : WFetchCords === "fail" ? "bg-red-600 hover:bg-red-600/50" : ""}`}
                >
                  {WFetchCords === "idle" ? (
                    <span className="flex items-center gap-2">
                      <LocateFixed size={17} strokeWidth={1.5} />
                      Confirm Location
                    </span>
                  ) : WFetchCords === "fetching" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={17} className="animate-spin" /> Fetching
                      Coordinates...
                    </span>
                  ) : WFetchCords === "success" ? (
                    "Coordinates Retrived Succesfully"
                  ) : (
                    "Cordinates search failed"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Location;
