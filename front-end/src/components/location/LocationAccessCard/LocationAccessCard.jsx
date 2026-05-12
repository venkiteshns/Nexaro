import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "../../shared/CustomSelect/CustomSelect";
import { KERALA_DISTRICTS, DISTRICT_AREAS } from "../../../utils/constants";
import "./LocationAccessCard.css";

export default function LocationAccessCard({ 
  geoState, 
  attempts, 
  maxRetries, 
  requestLocation, 
  setGeoState, 
  register, 
  setValue, 
  watch, 
  errors,
  requireServiceArea = false
}) {
  const district = watch("district");
  const areas = district ? (DISTRICT_AREAS[district] || []) : [];

  return (
    <div className="nx-loc-container">
      <AnimatePresence mode="wait">
        {["idle", "loading", "failed"].includes(geoState) && (
          <motion.div
            key="loc-request"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`nx-loc-card ${geoState === "failed" ? "nx-loc-card--error" : ""}`}
          >
            <div className={`nx-loc-icon ${geoState === "failed" ? "nx-loc-icon--error" : ""}`}>
              {geoState === "failed" ? (
                <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              ) : (
                <svg width="26" height="26" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              )}
            </div>

            <div className={`nx-loc-card__title ${geoState === "failed" ? "nx-loc-card__title--error" : ""}`}>
              {geoState === "loading" ? "Detecting Location..." :
                geoState === "failed" ? "Location Access Failed" :
                  "Enable Location Access"}
            </div>

            <div className={`nx-loc-card__sub ${geoState === "failed" ? "nx-loc-card__sub--error" : ""}`}>
              {geoState === "loading" ? "Please wait while we securely determine your location." :
                geoState === "failed" ? `Unable to detect your location. ${maxRetries - attempts} attempts remaining.` :
                  "Allow Nexaro to detect your location for precise hyperlocal matching."}
            </div>

            <button
              type="button"
              className={`nx-loc-btn ${geoState === "failed" ? "nx-loc-btn--error" : ""}`}
              onClick={requestLocation}
              disabled={geoState === "loading"}
              style={{
                opacity: geoState === "loading" ? 0.7 : 1,
                cursor: geoState === "loading" ? "wait" : "pointer"
              }}
            >
              {geoState === "loading" ? "Detecting..." : geoState === "failed" ? "Retry Access" : "Allow Location Access"}
            </button>

            <p style={{ marginTop: 14, fontSize: 12 }}>
              <button
                type="button"
                onClick={() => setGeoState("manual")}
                disabled={geoState === "loading"}
                className="nx-loc-skip-btn"
                style={{ cursor: geoState === "loading" ? "wait" : "pointer" }}
              >
                Skip and enter manually
              </button>
            </p>
          </motion.div>
        )}

        {["exhausted", "manual", "granted"].includes(geoState) && (
          <motion.div
            key="loc-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
            className="nx-loc-fields"
            style={{ overflow: 'hidden' }}
          >
            {geoState === "granted" && (
              <div className="nx-loc-status nx-loc-status--success">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                Location detected successfully. Fields auto-filled.
              </div>
            )}
            {geoState === "exhausted" && (
              <div className="nx-loc-status nx-loc-status--error">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                Location access failed after multiple attempts. Please enter manually.
              </div>
            )}
            <div className="nx-loc-grid">
              <div className="nx-field">
                <label className="nx-label">Country<span className="nx-required">*</span></label>
                <input className={`nx-input${errors.country ? " error" : ""}`} placeholder="Enter country" defaultValue="India" {...register("country", { required: "Country is required" })} />
                {errors.country && <span className="nx-error">⚠ {errors.country.message}</span>}
              </div>
              <div className="nx-field">
                <label className="nx-label">State<span className="nx-required">*</span></label>
                <input className={`nx-input${errors.state ? " error" : ""}`} placeholder="Enter state" defaultValue="Kerala" {...register("state", { required: "State is required" })} />
                {errors.state && <span className="nx-error">⚠ {errors.state.message}</span>}
              </div>
              <div className="nx-field">
                <label className="nx-label">District<span className="nx-required">*</span></label>
                <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="district" options={KERALA_DISTRICTS} placeholder="Select district…" rules={{ required: "Please select a district" }} />
                {errors.district && <span className="nx-error" style={{ marginTop: 4 }}>⚠ {errors.district.message}</span>}
              </div>
              <div className="nx-field">
                <label className="nx-label">City / Place<span className="nx-required">*</span></label>
                <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="city" options={areas} placeholder={district ? `Select city in ${district}` : "Select district first"} rules={{ required: "City / Place is required" }} />
                {errors.city && <span className="nx-error" style={{ marginTop: 4 }}>⚠ {errors.city.message}</span>}
              </div>
            </div>
            {requireServiceArea && district && (
              <div style={{ marginTop: 20 }}>
                <label className="nx-label" style={{ marginBottom: 10, display: "block" }}>Preferred Service Area<span className="nx-required">*</span></label>
                <CustomSelect register={register} setValue={setValue} watch={watch} errors={errors} name="serviceArea" options={areas} placeholder={`Select a major city/area in ${district}`} rules={{ required: "Please select a service area" }} />
                {errors.serviceArea && <span className="nx-error" style={{ marginTop: 6, display: 'block' }}>⚠ {errors.serviceArea.message}</span>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
