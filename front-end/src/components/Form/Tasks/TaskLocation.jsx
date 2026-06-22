import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, ChevronDown, MapPin, Loader2, LocateFixed } from 'lucide-react';
import { State, City } from "country-state-city";
import { useFormContext } from 'react-hook-form';
import { KERALA_DISTRICTS, DISTRICT_AREAS } from "../../../utils/constants";
import { placeToCoords } from "../../../services/placeToCoords";
import { reverseCoords } from "../../../services/reverseCoords";
import Map from '../../Maps/Map';

const FieldError = ({ name, errors }) =>
    errors[name] ? (
        <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>
    ) : null;

const TaskLocation = () => {
    const { register, watch, setValue, clearErrors, getValues, formState: { errors } } = useFormContext();
    const [fetchCords, setFetchCords] = useState("idle");
    const selectedState = watch('state');
    const selectedDistrict = watch('district');
    const city = watch('city');
    const area = watch('area');
    const locationLat = watch('locationLat');
    const locationLng = watch('locationlng');

    const [mapPosition, setMapPosition] = useState({ lat: 10.5276, lng: 76.2144 });
    const [pendingDistrict, setPendingDistrict] = useState(null);
    const reverseDebounceRef = useRef(null);


    const indiaStates = State.getStatesOfCountry("IN");
    const isKerala = selectedState === "KL" || selectedState === "Kerala";

    const districts = useMemo(() => (
        isKerala
            ? KERALA_DISTRICTS
            : (selectedState ? City.getCitiesOfState("IN", selectedState).map(c => c.name) : [])
    ), [isKerala, selectedState]);

    useEffect(() => {
        if (fetchCords !== 'idle') {
            setFetchCords('idle');
        }
    }, [selectedState, selectedDistrict, city, area, locationLat, locationLng, fetchCords])

    const handleMapPositionChange = (pos) => {
        setMapPosition(pos);
        setValue('locationLat', pos.lat, { shouldValidate: true });
        setValue('locationlng', pos.lng, { shouldValidate: true });

        clearTimeout(reverseDebounceRef.current);
        reverseDebounceRef.current = setTimeout(async () => {
            try {
                const place = await reverseCoords(pos);

                if (place.state) {
                    const matched = indiaStates.find(
                        (s) => s.name.toLowerCase() === place.state.toLowerCase()
                    );
                    if (matched) {
                        setValue('state', matched.isoCode, { shouldValidate: true });
                        setValue('district', '');
                    }
                }

                if (place.city) setValue('city', place.city);
                if (place.district) setPendingDistrict(place.district);
                clearErrors("city");

                if (place.area) setValue('area', place.area, { shouldValidate: true });
                if (place.displayName) setValue('fullAddress', place.displayName, { shouldValidate: true });
            } catch {
            }
        }, 600);
    };


    useEffect(() => {
        if (!pendingDistrict || districts.length === 0) return;
        const match = districts.find(
            (d) => d.toLowerCase() === pendingDistrict.toLowerCase()
        );
        if (match) {
            setValue('district', match, { shouldValidate: true });
        }
        if (pendingDistrict !== null) {
            setPendingDistrict(null);
        }
    }, [districts, pendingDistrict, setValue]);

    const districtAreas = selectedDistrict && DISTRICT_AREAS[selectedDistrict]
        ? DISTRICT_AREAS[selectedDistrict]
        : [];

    useEffect(() => {
        if (locationLat && locationLng) {
            if (mapPosition.lat !== locationLat || mapPosition.lng !== locationLng) {
                setMapPosition({ lat: locationLat, lng: locationLng });
            }
        }
    }, [locationLat, locationLng, mapPosition.lat, mapPosition.lng]);

    const handleLocationCoords = async () => {
        setFetchCords("fetching");
        let value = getValues();

        const stateObj = indiaStates.find((s) => s.isoCode === value.state);
        const stateName = stateObj ? stateObj.name : value.state;

        let payload = {
            country: "India",
            city: value.city || "",
            area: value.area || "",
            state: stateName,
            district: value.district || "",
        };
        try {
            let res = await placeToCoords(payload);
            setValue("locationLat", res.lat, { shouldValidate: true });
            setValue("locationlng", res.lng, { shouldValidate: true });
            let place = await reverseCoords({ lat: res.lat, lng: res.lng });
            setValue("fullAddress", place.displayName, { shouldValidate: true });
            setValue("district", place.district || "", { shouldValidate: true });
            setValue("city", place.city || "", { shouldValidate: true });
            clearErrors("city");
            console.log("place : ", place);

            // setTimeout(() => {
            //     setFetchCords("idle");
            // }, 1500);
            setFetchCords("success");
        } catch {
            setFetchCords("fail");
            setTimeout(() => {
                setFetchCords("idle");
            }, 1500);
        }
    };


    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="flex items-center gap-2 text-[#111827] font-semibold mb-5">
                <MapPin size={18} className="text-[#0A6E5C]" />
                Task Location
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4">
                <div className="space-y-3">

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="relative">
                                <select
                                    {...register('state', {
                                        required: 'State is required',
                                        onChange: () => setValue('district', ''),
                                    })}
                                    className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 text-sm text-[#111827] outline-none focus:bg-white transition-colors cursor-pointer pr-8 ${errors.state
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-200 focus:border-[#0A6E5C]'
                                        }`}
                                >
                                    <option value="">State</option>
                                    {indiaStates.map((s) => (
                                        <option key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                            <FieldError name="state" errors={errors} />
                        </div>

                        <div>
                            <div className="relative">
                                <select
                                    {...register('district', {
                                        required: 'District is required',
                                    })}
                                    disabled={!selectedState}
                                    className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 text-sm text-[#111827] outline-none focus:bg-white transition-colors cursor-pointer pr-8 disabled:opacity-50 disabled:cursor-not-allowed ${errors.district
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-200 focus:border-[#0A6E5C]'
                                        }`}
                                >
                                    <option value="">District</option>
                                    {districts.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                            <FieldError name="district" errors={errors} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            {districtAreas.length > 0 ? (
                                <div className="relative">
                                    <select
                                        {...register('city', {
                                            required: 'City is required',
                                        })}
                                        className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 text-sm text-[#111827] outline-none focus:bg-white transition-colors cursor-pointer pr-8 ${errors.city
                                            ? 'border-red-400 focus:border-red-400'
                                            : 'border-gray-200 focus:border-[#0A6E5C]'
                                            }`}
                                    >
                                        <option value="">City</option>
                                        {districtAreas.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={14}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="City"
                                    {...register('city', {
                                        required: 'City is required',
                                    })}
                                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-[#111827] placeholder-gray-400 text-sm outline-none focus:bg-white transition-colors ${errors.city
                                        ? 'border-red-400 focus:border-red-400'
                                        : 'border-gray-200 focus:border-[#0A6E5C]'
                                        }`}
                                />
                            )}
                            <FieldError name="city" errors={errors} />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Area / Place"
                                {...register('area', {
                                    required: 'Area is required',
                                })}
                                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-[#111827] placeholder-gray-400 text-sm outline-none focus:bg-white transition-colors ${errors.area
                                    ? 'border-red-400 focus:border-red-400'
                                    : 'border-gray-200 focus:border-[#0A6E5C]'
                                    }`}
                            />
                            <FieldError name="area" errors={errors} />
                        </div>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="House Number"
                            {...register('houseNumber', {
                                required: 'House number is required',
                            })}
                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-[#111827] placeholder-gray-400 text-sm outline-none focus:bg-white transition-colors ${errors.houseNumber
                                ? 'border-red-400 focus:border-red-400'
                                : 'border-gray-200 focus:border-[#0A6E5C]'
                                }`}
                        />
                        <FieldError name="houseNumber" errors={errors} />
                    </div>

                    {/* Full Address */}
                    <div>
                        <textarea
                            placeholder="Full Address (House No, Street, Landmark)"
                            rows={2}
                            {...register('fullAddress', {
                                required: 'Full address is required',
                            })}
                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-[#111827] placeholder-gray-400 text-sm outline-none focus:bg-white transition-colors resize-none ${errors.fullAddress
                                ? 'border-red-400 focus:border-red-400'
                                : 'border-gray-200 focus:border-[#0A6E5C]'
                                }`}
                        />
                        <FieldError name="fullAddress" errors={errors} />
                    </div>

                    {selectedState && selectedDistrict && city && area && (
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleLocationCoords}
                                type="button"
                                disabled={fetchCords !== "idle"}
                                className={`text-xs bg-[#0A6E5C]/90 py-2.5 px-4 text-white rounded-xl hover:bg-[#0A6E5C] transition-colors ${fetchCords === "fetching" ? "opacity-50 cursor-not-allowed" : fetchCords === "fail" ? "bg-red-600 hover:bg-red-700" : ""}`}
                            >
                                {fetchCords === "idle" ? (
                                    <span className="flex items-center gap-2">
                                        <LocateFixed size={16} />
                                        Confirm Location
                                    </span>
                                ) : fetchCords === "fetching" ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        Fetching Coordinates...
                                    </span>
                                ) : fetchCords === "success" ? (
                                    "Coordinates Retrieved Successfully"
                                ) : (
                                    "Coordinate Search Failed"
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative rounded-xl overflow-hidden border border-gray-200 min-h-[180px]">
                    <Map
                        position={mapPosition}
                        setPosition={handleMapPositionChange}
                        height="180px"
                        showButton={false}
                    />
                </div>
            </div>

            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0A6E5C] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-[#0A6E5C]">
                        Estimated Reach
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                        ~24 skilled workers will be notified instantly in your
                        local area.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TaskLocation