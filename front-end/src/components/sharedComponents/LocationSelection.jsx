import { useEffect, useRef, useState } from 'react'
import useDebounce from '../../customHooks/useDebounce'
import { searchPlaces } from '../../services/searchPlaces'
import { MapPin } from 'lucide-react';
import DropDownUnRegister from '../Custom/DropDownUnRegister';
import { reverseCoords } from '../../services/reverseCoords';
import Map from '../Maps/Map';
import { useFormContext } from 'react-hook-form';

const LocationSelection = ({ SectionName }) => {

    const { setValue, register, formState: { errors } } = useFormContext();

    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showResult, setShowResult] = useState(true);
    const [mapPosition, setMapPosition] = useState({ lat: 10.5276, lng: 76.2144 });

    const skipNextSearch = useRef(false);
    const initialSelectionDone = useRef(false);

    const debouncedSearch = useDebounce({ searchText, delay: 800 });

    const uniqueSuggestions = Object.values(
        suggestions.reduce((acc, p) => {
            acc[p.displayName] = p;
            return acc;
        }, {})
    );
    const placeOptions = uniqueSuggestions.map((p) => p.displayName);

    useEffect(() => {
        if (skipNextSearch.current) {
            skipNextSearch.current = false;
            return;
        }

        if (!debouncedSearch) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const response = await searchPlaces(debouncedSearch);
                if (cancelled) return;
                if (response.length > 0) {
                    setSuggestions(response);
                    setIsOpen(true);
                    setShowResult(true);
                } else {
                    setSuggestions([]);
                    setIsOpen(false);
                }
            } catch {
                if (!cancelled) {
                    setSuggestions([]);
                    setIsOpen(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [debouncedSearch]);

    const applySelectedPlace = (place, { moveMap } = { moveMap: true }) => {
        skipNextSearch.current = true; // programmatic searchText change — don't re-search

        setSearchText(place.displayName);
        setSuggestions([]);
        setIsOpen(false);
        setShowResult(false);

        const lat = Number(place.lat);
        const lng = Number(place.lon);

        setValue('locationLat', lat, { shouldValidate: true });
        setValue('locationlng', lng, { shouldValidate: true });
        setValue('fullAddress', place.displayName, { shouldValidate: true });
        setValue('district', place.district || "", { shouldValidate: true });
        setValue('city', place.city || "", { shouldValidate: true });
        setValue('area', place.area || "", { shouldValidate: true });
        setValue('state', place.state || "", { shouldValidate: true });

        setMapPosition({ lat, lng });
        // handleMapPositionChange({lat, lng})

        if (moveMap && !initialSelectionDone.current) {
            initialSelectionDone.current = true;
        }
    };

    const handleMapPositionChange = (pos) => {
        setIsOpen(false);
        setMapPosition(pos);

        (async () => {
            try {
                const place = await reverseCoords(pos);
                applySelectedPlace({
                    displayName: place.displayName,
                    district: place.district,
                    area: place.area,
                    state: place.state,
                    city: place.city,
                    lat: place.lat,
                    lon: place.lng,
                }, { moveMap: false });
            } catch (err) {
                setSuggestions([]);
            }
        })();
    };

    const onPlaceSelect = (place, index) => {
        const match = uniqueSuggestions.find((p) => p.displayName == place)
        if (match) applySelectedPlace(match);
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="flex items-center gap-2 text-[#111827] font-semibold mb-5">
                <MapPin size={18} className="text-[#0A6E5C]" />
                {SectionName}
            </h2>

            <div className="flex flex-col items-center justify-center">
                <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    type="text"
                    className="w-full max-w-5xl rounded-[18px] border border-[#E5E7EB] bg-[#F9FAFB] px-6 py-2 text-[16px] font-normal text-[#111827] placeholder:text-[#9CA3AF] shadow-sm outline-none transition focus:border-[#0A6E5C] focus:ring-4 focus:ring-[#0A6E5C]/10"
                />
                {(isOpen && showResult) &&
                    <DropDownUnRegister options={placeOptions} onValueSelect={onPlaceSelect} />
                }
                {(!!searchText && suggestions.length < 1 && showResult) &&
                    <div>No results found</div>
                }
            </div>

            <div className="relative rounded-xl overflow-hidden border border-gray-200 min-h-[180px] mt-3">
                <Map position={mapPosition} setPosition={handleMapPositionChange} height="180px" showButton={false} />
            </div>

            {/* Registered so RHF tracks & validates these, even though they're set via setValue */}
            <input type="hidden" {...register('locationLat', { required: true })} />
            <input type="hidden" {...register('locationlng', { required: true })} />

            {(errors.locationLat || errors.locationlng) &&
                <p className="text-sm text-red-500 mt-2">Please select a location on the map or from the search results.</p>
            }
        </div>
    )
}

export default LocationSelection