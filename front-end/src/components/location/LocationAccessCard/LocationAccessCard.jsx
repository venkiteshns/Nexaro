import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "../../shared/CustomSelect/CustomSelect";
import { KERALA_DISTRICTS, DISTRICT_AREAS } from "../../../utils/constants";
import "./LocationAccessCard.css";

export default function LocationAccessCard({ 
  locationState, // Use new state property
  attempts, 
  maxRetries, 
  requestLocation, 
  setLocationState, 
  resolveManualCoords,
  retryManual,
  register, 
  setValue, 
  watch, 
  errors,
  requireServiceArea = false,
  // Fallback aliases for components that still pass geoState
  geoState,
  setGeoState
}) {
  const currentState = locationState || geoState;
  const setState = setLocationState || setGeoState;

  const district = watch("district");
  const city = watch("city");
  const stateVal = watch("state") || "Kerala";
  const country = watch("country") || "India";

  const areas = district ? (DISTRICT_AREAS[district] || []) : [];

  // When in manual mode and fields change, we don't auto-resolve immediately.
  // Instead, wait for a button click to "Confirm Location".

  const handleResolveCoords = async () => {
    if (resolveManualCoords) {
      await resolveManualCoords({ district, city, state: stateVal, country });
    }
  };

  const isResolving = currentState === "resolvingCoords";
  const isResolved = currentState === "resolved" || currentState === "autoDetected" || currentState === "granted";
  const isCoordFailed = currentState === "coordFailed";

  return (
    <div className="nx-loc-container">
      <AnimatePresence mode="wait">
        {["idle", "autoDetecting", "loading", "failed"].includes(currentState) && (
          <motion.div
            key="loc-request"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`nx-loc-card ${currentState === "failed" ? "nx-loc-card--error" : ""}`}
          >
            <div className={`nx-loc-icon ${currentState === "failed" ? "nx-loc-icon--error" : ""}`}>
              {currentState === "failed" ? (
                <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              ) : (
                <svg width="26" height="26" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              )}
            </div>

            <div className={`nx-loc-card__title ${currentState === "failed" ? "nx-loc-card__title--error" : ""}`}>
              {["autoDetecting", "loading"].includes(currentState) ? "Detecting Location..." :
                currentState === "failed" ? "Location Access Failed" :
                  "Enable Location Access"}
            </div>

            <div className={`nx-loc-card__sub ${currentState === "failed" ? "nx-loc-card__sub--error" : ""}`}>
              {["autoDetecting", "loading"].includes(currentState) ? "Please wait while we securely determine your location." :
                currentState === "failed" ? `Unable to detect your location. ${maxRetries - attempts} attempts remaining.` :
                  "Allow Nexaro to detect your location for precise hyperlocal matching."}
            </div>

            <button
              type="button"
              className={`nx-loc-btn ${currentState === "failed" ? "nx-loc-btn--error" : ""}`}
              onClick={requestLocation}
              disabled={["autoDetecting", "loading"].includes(currentState)}
              style={{
                opacity: ["autoDetecting", "loading"].includes(currentState) ? 0.7 : 1,
                cursor: ["autoDetecting", "loading"].includes(currentState) ? "wait" : "pointer"
              }}
            >
              {["autoDetecting", "loading"].includes(currentState) ? "Detecting..." : currentState === "failed" ? "Retry Access" : "Allow Location Access"}
            </button>

            <p style={{ marginTop: 14, fontSize: 12 }}>
              <button
                type="button"
                onClick={() => setState("manualMode")}
                disabled={["autoDetecting", "loading"].includes(currentState)}
                className="nx-loc-skip-btn"
                style={{ cursor: ["autoDetecting", "loading"].includes(currentState) ? "wait" : "pointer" }}
              >
                Skip and enter manually
              </button>
            </p>
          </motion.div>
        )}

        {["manualMode", "resolvingCoords", "resolved", "coordFailed", "autoDetected", "granted"].includes(currentState) && (
          <motion.div
            key="loc-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
            className="nx-loc-fields"
            style={{ overflow: 'hidden' }}
          >
            {(currentState === "autoDetected" || currentState === "granted") && (
              <div className="nx-loc-status nx-loc-status--success">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                Location detected successfully. Fields auto-filled.
              </div>
            )}
            {currentState === "resolved" && (
              <div className="nx-loc-status nx-loc-status--success">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                Location verified. Coordinates attached for matching.
              </div>
            )}
            {isCoordFailed && (
              <div className="nx-loc-status nx-loc-status--error">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                We couldn't validate the selected area. Please choose another nearby location.
              </div>
            )}
            {isResolving && (
              <div className="nx-loc-status nx-loc-status--loading">
                <svg className="nx-spinner-sm" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>
                Resolving service location...
              </div>
            )}

            <div className="nx-loc-grid">
              <div className="nx-field">
                <label className="nx-label">Country<span className="nx-required">*</span></label>
                <div className={isResolving || isResolved ? "nx-field-disabled" : ""}>
                  <input className={`nx-input${errors.country ? " error" : ""}`} placeholder="Enter country" defaultValue="India" {...register("country", { required: "Country is required" })} />
                </div>
                {errors.country && <span className="nx-error" style={{ marginTop: 4 }}>⚠ {errors.country.message}</span>}
              </div>
              <div className="nx-field">
                <label className="nx-label">State<span className="nx-required">*</span></label>
                <div className={isResolving || isResolved ? "nx-field-disabled" : ""}>
                  <input className={`nx-input${errors.state ? " error" : ""}`} placeholder="Enter state" defaultValue="Kerala" {...register("state", { required: "State is required" })} />
                </div>
                {errors.state && <span className="nx-error" style={{ marginTop: 4 }}>⚠ {errors.state.message}</span>}
              </div>
              <div className="nx-field">
                <label className="nx-label">District<span className="nx-required">*</span></label>
                <div className={isResolving || isResolved ? "nx-field-disabled" : ""}>
                  <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="district" options={KERALA_DISTRICTS} placeholder="Select district…" rules={{ required: "Please select a district" }} />
                </div>
                {errors.district && <span className="nx-error" style={{ marginTop: 4 }}>⚠ {errors.district.message}</span>}
              </div>
              <div className="nx-field">
                <label className="nx-label">City / Place<span className="nx-required">*</span></label>
                <div className={isResolving || isResolved || !district ? "nx-field-disabled" : ""}>
                  <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="city" options={areas} placeholder={district ? `Select city in ${district}` : "Select district first"} rules={{ required: "City / Place is required" }} />
                </div>
                {errors.city && <span className="nx-error" style={{ marginTop: 4 }}>⚠ {errors.city.message}</span>}
              </div>
            </div>

            {requireServiceArea && district && (
              <div style={{ marginTop: 20 }}>
                <label className="nx-label" style={{ marginBottom: 10, display: "block" }}>Preferred Service Area<span className="nx-required">*</span></label>
                <div className={isResolving || isResolved ? "nx-field-disabled" : ""}>
                  <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="serviceArea" options={areas} placeholder={`Select a major city/area in ${district}`} rules={{ required: "Please select a service area" }} />
                </div>
                {errors.serviceArea && <span className="nx-error" style={{ marginTop: 6, display: 'block' }}>⚠ {errors.serviceArea.message}</span>}
              </div>
            )}

            {/* Action buttons for manual mode */}
            {["manualMode", "coordFailed"].includes(currentState) && district && city && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="nx-loc-actions"
                style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}
              >
                <button
                  type="button"
                  className="nx-loc-btn"
                  onClick={handleResolveCoords}
                >
                  Verify Location
                </button>
              </motion.div>
            )}

            {isResolved && currentState === "resolved" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="nx-loc-actions"
                style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}
              >
                <button
                  type="button"
                  className="nx-loc-skip-btn"
                  onClick={() => {
                    if (retryManual) retryManual();
                    else setState("manualMode");
                  }}
                  style={{ textDecoration: 'none', color: 'var(--color-accent)' }}
                >
                  Change Location
                </button>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
