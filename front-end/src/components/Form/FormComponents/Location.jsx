import { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useFormContext } from "react-hook-form";
import { KERALA_DISTRICTS, DISTRICT_AREAS } from "../../../utils/constants";
import { getCoords } from "../../../services/getCooords";
import { reverseCoords } from "../../../services/reverseCoords";
import { MapPin, Loader2, LocateFixed, CheckCircle2, AlertCircle, ChevronDown, Navigation, PencilLine, Info } from "lucide-react";
import { placeToCoords } from "../../../services/placeToCoords";

// ─── Confirm Location Button ─────────────────────────────────────────────────
const ConfirmLocationButton = ({ status, onConfirm, label = "Confirm Location" }) => {
  const isIdle = status === "idle";
  const isFetching = status === "fetching";
  const isSuccess = status === "success";
  const isFail = status === "fail";

  return (
    <div className="flex justify-end mt-2 sm:mt-3">
      <button
        type="button"
        onClick={onConfirm}
        disabled={!isIdle}
        className={[
          "inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold",
          "transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
          isFetching ? "bg-[#0a6e5c]/70 text-white cursor-wait" : "",
          isIdle ? "bg-[#0a6e5c] hover:bg-[#085a4a] active:scale-95 text-white focus:ring-[#0a6e5c] cursor-pointer hover:shadow-md" : "",
          isSuccess ? "bg-emerald-500/10 text-emerald-700 border border-emerald-200 cursor-default" : "",
          isFail ? "bg-red-500/10 text-red-600 border border-red-200 cursor-default" : "",
        ].join(" ")}
      >
        {isFetching && (<><Loader2 size={14} className="animate-spin" /><span>Fetching coordinates…</span></>)}
        {isIdle && (<><LocateFixed size={14} /><span>{label}</span></>)}
        {isSuccess && (<><CheckCircle2 size={14} /><span>Location confirmed!</span></>)}
        {isFail && (<><AlertCircle size={14} /><span>Could not fetch — try again</span></>)}
      </button>
    </div>
  );
};

// ─── Main Location Component ─────────────────────────────────────────────────
const Location = ({ worker }) => {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormContext();

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedCity = watch("city");
  const selectedLocationLat = watch("locationLat");
  const selectedLocationLng = watch("locationlng");
  const selectedWorkPlace = watch("workPlace");
  const selectedWorkLat = watch("workPlacelat");
  const selectedWorkLng = watch("workPlacelng");

  const [countryCode, setCountryCode] = useState("IN");
  const district = selectedDistrict || "Kozhikode";

  // "idle" | "fetching" | "success" | "failed" | "manual"
  const [locationFetchState, setLocationFetchState] = useState("idle");
  const [locationError, setLocationError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [fetchCords, setFetchCoords] = useState("idle");
  const [WFetchCords, setWFetchCords] = useState("idle");
  const [afterChangeLocation, setAfterChangeLocation] = useState("idle");
  const [afterChangeWorkPlace, setAfterChangeWorkPlace] = useState("idle");
  const [locationConfirmNeeded, setLocationConfirmNeeded] = useState(false);
  const [workConfirmNeeded, setWorkConfirmNeeded] = useState(false);

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(countryCode);
  const isKerala = selectedState === "Kerala";
  const districtAreas = district && DISTRICT_AREAS[district] ? DISTRICT_AREAS[district] : [];

  useEffect(() => {
    register("locationLat", { required: "Please confirm the location" });
    register("locationlng", { required: "Please confirm the location" });
    if (worker) {
      register("workPlacelat", { required: "Please confirm the service location" });
      register("workPlacelng", { required: "Please confirm the service location" });
    }
  }, [register, worker]);
  const isFormVisible = showForm;

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const found = countries.find((c) => c.name === countryName);
    if (found) setCountryCode(found.isoCode);
    setValue("country", countryName, { shouldValidate: true, shouldDirty: true });
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
    setValue("district", districtName, { shouldValidate: true, shouldDirty: true });
    setValue("city", "", { shouldValidate: true, shouldDirty: true });
    if (afterChangeLocation === "set") setAfterChangeLocation("changed");
  };

  const handleCityChange = (e) => {
    setValue("city", e.target.value, { shouldValidate: true, shouldDirty: true });
    setValue("locationLat", "", { shouldDirty: true });
    setValue("locationlng", "", { shouldDirty: true });
    setLocationConfirmNeeded(false);
    setAfterChangeLocation("changed");
  };

  const handleWorkPlaceChange = (e) => {
    setValue("workPlace", e.target.value, { shouldValidate: true, shouldDirty: true });
    setValue("workPlacelat", "", { shouldDirty: true });
    setValue("workPlacelng", "", { shouldDirty: true });
    setWorkConfirmNeeded(false);
    setAfterChangeWorkPlace("changed");
  };

  const handleGetLocation = async () => {
    setLocationFetchState("fetching");
    setLocationError("");
    try {
      const coords = await getCoords();
      const locationData = await reverseCoords(coords);
      const { country, state, district: detectedDistrict } = locationData;
      const foundCountry = countries.find((c) => c.name === country);
      if (foundCountry) setCountryCode(foundCountry.isoCode);
      setValue("country", country, { shouldValidate: true });
      setValue("state", state, { shouldValidate: true });
      setValue("district", detectedDistrict, { shouldValidate: true });
      setAfterChangeLocation("set");
      setLocationFetchState("success");
      setShowForm(true);
    } catch (err) {
      setLocationError(
        "Could not detect your location automatically. Please allow location access in your browser, or fill in your details manually."
      );
      setLocationFetchState("failed");
      console.error(err.message);
    }
  };

  const handleLocationCoords = async (type) => {
    type === "city" ? setFetchCoords("fetching") : setWFetchCords("fetching");
    const value = getValues();
    const cityValue = type === "city" ? value.city : value.workPlace;
    const payload = { country: value.country, city: cityValue, state: value.state, district: value.district };
    try {
      const res = await placeToCoords(payload);
      setValue(type === "city" ? "locationLat" : "workPlacelat", res.lat, { shouldValidate: true });
      setValue(type === "city" ? "locationlng" : "workPlacelng", res.lng, { shouldValidate: true });
      type === "city" ? setLocationConfirmNeeded(false) : setWorkConfirmNeeded(false);
      type === "city" ? setFetchCoords("success") : setWFetchCords("success");
      setTimeout(() => {
        type === "city" ? setAfterChangeLocation("idle") : setAfterChangeWorkPlace("idle");
        type === "city" ? setFetchCoords("idle") : setWFetchCords("idle");
      }, 1800);
    } catch {
      type === "city" ? setFetchCoords("fail") : setWFetchCords("fail");
      type === "city" ? setLocationConfirmNeeded(true) : setWorkConfirmNeeded(true);
      setTimeout(() => {
        type === "city" ? setFetchCoords("idle") : setWFetchCords("idle");
        type === "city" ? setAfterChangeLocation("changed") : setAfterChangeWorkPlace("changed");
      }, 1800);
    }
  };

  const fieldClass =
    "w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 bg-white outline-none " +
    "focus:ring-1 focus:ring-green-700 focus:border-transparent text-xs sm:text-sm text-gray-800 appearance-none";

  const errorFieldClass =
    "w-full rounded-lg sm:rounded-xl border border-red-400 px-3 py-2 sm:px-4 sm:py-2.5 bg-white outline-none " +
    "focus:ring-1 focus:ring-red-400 focus:border-transparent transition text-xs sm:text-sm text-gray-800 appearance-none";

  const isFetchingGPS = locationFetchState === "fetching";

  return (
    <div id="location-section" data-field="location" className="space-y-3 sm:space-y-5 scroll-mt-24">

      {/* Auto-detect card */}
      {!isFormVisible && (
        <div className="mt-3 sm:mt-5 w-full flex flex-col items-center text-center rounded-2xl sm:rounded-[28px] border border-[rgba(10,110,92,0.15)] bg-white p-4 sm:p-7 md:p-9 shadow-sm">
          <div className={"w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2.5 sm:mb-3.5 transition-colors duration-300 " + (isFetchingGPS ? "bg-[#0a6e5c]/20" : "bg-[#0A6E5C]/10")}>
            {isFetchingGPS
              ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A6E5C] animate-spin" />
              : <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A6E5C]" strokeWidth={1.75} />
            }
          </div>

          <h3 className="text-gray-800 font-bold text-sm sm:text-base md:text-lg mb-1">
            {isFetchingGPS ? "Detecting your location…" : "Auto-Detect Location"}
          </h3>
          <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 mb-3.5 sm:mb-5 max-w-xs sm:max-w-sm leading-relaxed">
            {isFetchingGPS
              ? "Please wait while we fetch your current location."
              : worker
                ? "We'll auto-fill your location, then you can select your city and service area."
                : "We'll auto-fill your location, then you can select your city."
            }
          </p>

          {/* GPS Button — initially show only Get Current Location */}
          {!isFetchingGPS && locationFetchState !== "failed" && (
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleGetLocation}
                className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl sm:rounded-2xl text-white text-xs sm:text-sm font-semibold transition-all duration-300 bg-[#0A6E5C] hover:bg-[#085a4a] hover:shadow-lg hover:shadow-[#0a6e5c]/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0a6e5c] focus:ring-offset-2 cursor-pointer"
              >
                <LocateFixed size={16} className="text-white/90 group-hover:rotate-12 transition-transform duration-300" />
                <span>Get Current Location</span>
              </button>
              {isSubmitted && !showForm && (
                <p className="italic text-red-500 text-xs mt-2.5">
                  Please click Get Current Location to continue
                </p>
              )}
            </div>
          )}

          {/* Failed feedback — tell them to enter manually */}
          {locationFetchState === "failed" && (
            <div className="w-full max-w-sm">
              <div className="flex items-start gap-2.5 p-3 sm:p-3.5 bg-red-50 border border-red-200 rounded-xl text-left mb-3 sm:mb-4">
                <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-[11px] sm:text-xs text-red-700 leading-relaxed">
                  {locationError || "Could not detect your location automatically. Please enter your location details manually."}
                </p>
              </div>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center w-full">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-[#0a6e5c] text-[#0a6e5c] hover:bg-[#0a6e5c]/5 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <LocateFixed size={14} />
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(true); setLocationFetchState("manual"); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#0a6e5c] text-white hover:bg-[#085a4a] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                >
                  <PencilLine size={14} />
                  Enter Manually
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Location Form */}
      {isFormVisible && (
        <div
          className="w-full rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-3.5 sm:p-6 md:p-8 shadow-sm space-y-3 sm:space-y-4 md:space-y-5"
          style={{ animation: "locationFadeIn 0.3s ease both" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 pb-1.5 sm:pb-2 border-b border-gray-100">
            <MapPin size={16} className="text-[#0a6e5c]" strokeWidth={1.75} />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              {locationFetchState === "success" ? "Location Detected" : "Enter Location"}
            </span>
          </div>

          {/* Info notice after location is fetched */}
          {locationFetchState === "success" && (
            <div className="p-2.5 sm:p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl sm:rounded-2xl flex items-start gap-2 text-[11px] sm:text-xs text-emerald-900 leading-relaxed">
              <Info size={14} className="text-[#0a6e5c] shrink-0 mt-0.5" />
              <span>
                {worker
                  ? "Location detected successfully! Please select your City / Place and Preferred Work Area below."
                  : "Location detected successfully! Please select your City / Place below."}
              </span>
            </div>
          )}

          {(errors.country || errors.state || errors.district) && (
            <p className="italic text-red-400/90 text-xs">Please fill all the location fields.</p>
          )}

          {/* Country + State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-medium text-gray-600">Country <span className="text-red-500">*</span></label>
              <div className="relative">
                <select {...register("country", { required: true })} value={selectedCountry || ""} onChange={handleCountryChange} className={errors.country ? errorFieldClass : fieldClass}>
                  <option value="" disabled>Select Country</option>
                  {countries.map((c) => (<option key={c.isoCode} value={c.name}>{c.name}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-medium text-gray-600">State <span className="text-red-500">*</span></label>
              <div className="relative">
                <select {...register("state", { required: true })} value={selectedState || ""} onChange={handleStateChange} className={errors.state ? errorFieldClass : fieldClass} disabled={!selectedCountry}>
                  <option value="" disabled>{selectedCountry ? "Select State" : "Select a country first"}</option>
                  {states.map((s) => (<option key={s.isoCode} value={s.name}>{s.name}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* District + City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-medium text-gray-600">District <span className="text-red-500">*</span></label>
              <div className="relative">
                <select {...register("district", { required: true })} value={selectedDistrict || ""} onChange={handleDistrictChange} className={errors.district ? errorFieldClass : fieldClass} disabled={!isKerala}>
                  <option value="" disabled>{!selectedState ? "Select a state first" : !isKerala ? "Not available for this state" : "Select District"}</option>
                  {isKerala && KERALA_DISTRICTS.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-medium text-gray-600">City / Place <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  {...register("city", { required: "Please select your city / place" })}
                  value={selectedCity || ""}
                  onChange={handleCityChange}
                  className={errors.city ? errorFieldClass : fieldClass}
                  disabled={!selectedDistrict}
                >
                  <option value="" disabled>{!selectedDistrict ? "Select a district first" : "Select City / Place"}</option>
                  {districtAreas.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.city && (
                <p className="italic text-red-400/90 text-[11px] sm:text-xs mt-1">
                  {errors.city.message || "Please select your city / place"}
                </p>
              )}
              {!errors.city && selectedCity && (locationConfirmNeeded || afterChangeLocation === "changed" || (isSubmitted && (!selectedLocationLat || !selectedLocationLng || errors.locationLat || errors.locationlng))) && (
                <p className="italic text-red-400/90 text-[11px] sm:text-xs mt-1">
                  Please confirm the location
                </p>
              )}
            </div>
          </div>

          {afterChangeLocation === "changed" && (
            <ConfirmLocationButton status={fetchCords} onConfirm={() => handleLocationCoords("city")} label="Confirm Location" />
          )}

          {/* Worker: Service Area */}
          {worker && (
            <div className="pt-2.5 sm:pt-3 border-t border-gray-100 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin size={14} className="text-[#0a6e5c]" strokeWidth={1.75} />
                <span className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Service Area</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] sm:text-xs font-medium text-gray-600">Preferred Service Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    {...register("workPlace", { required: "Please select your preferred service location" })}
                    onChange={handleWorkPlaceChange}
                    defaultValue=""
                    className={errors.workPlace ? errorFieldClass : fieldClass}
                    disabled={!selectedDistrict}
                  >
                    <option value="" disabled>{!selectedDistrict ? "Select a district first" : "Select Preferred Service Location"}</option>
                    {districtAreas.map((a) => (<option key={a} value={a}>{a}</option>))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.workPlace && (
                  <p className="italic text-red-400/90 text-[11px] sm:text-xs mt-1">
                    {errors.workPlace.message || "Please select your preferred service location"}
                  </p>
                )}
                {!errors.workPlace && selectedWorkPlace && (workConfirmNeeded || afterChangeWorkPlace === "changed" || (isSubmitted && (!selectedWorkLat || !selectedWorkLng || errors.workPlacelat || errors.workPlacelng))) && (
                  <p className="italic text-red-400/90 text-[11px] sm:text-xs mt-1">
                    Please confirm the service location
                  </p>
                )}
              </div>

              {afterChangeWorkPlace === "changed" && (
                <ConfirmLocationButton status={WFetchCords} onConfirm={() => handleLocationCoords("workPlace")} label="Confirm Service Location" />
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes locationFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Location;