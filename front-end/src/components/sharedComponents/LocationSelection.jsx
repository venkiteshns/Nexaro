import { useEffect, useState } from 'react'
import useDebounce from '../../customHooks/useDebounce'
import { searchPlaces } from '../../services/searchPlaces'
import { MapPin, Search } from 'lucide-react';
import DropDownUnRegister from '../Custom/DropDownUnRegister';
import { reverseCoords } from '../../services/reverseCoords';
import Map from '../Maps/Map';
import { setOptions } from 'leaflet';

const LocationSelection = ({SectionName}) => {

    const [searchText, setSearchText] = useState("");
    const [placeOptions, setPlaceOptions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showResult, setShowResult] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [mapChange, setMapChange] = useState(false);

    const [mapPosition, setMapPosition] = useState({ lat: 10.5276, lng: 76.2144 });


    const debouncedSearch  = useDebounce({ searchText, delay: 800 })

    useEffect(() => {
        setSuggestions([]);
        setPlaceOptions([]);
        setIsOpen(false);

        const getPlaceSuggestions = async () => {
            
            if(mapChange){
                setMapChange(false);
                return;
            }
            
            console.log("called");
            
            try {
                let response = await searchPlaces(debouncedSearch);
                setSuggestions(response);
                console.log(response);
                
                if(response.length>0){
                    response.map((p) => {
                        setPlaceOptions((prev) =>[...prev, p.displayName])
                    })
                    setIsOpen(true);
                    setShowResult(true);

                }
            } catch (error) {
                
            }
        }
        getPlaceSuggestions();
    },[debouncedSearch])

    useEffect(() => {
        console.log("______\n",selectedPlace,"____________\n");
        
        if(!!selectedPlace){
            setSearchText(selectedPlace.displayName);
            setSuggestions([]);
            setPlaceOptions([]);
            let lat = Number(selectedPlace?.lat)
            let lng = Number(selectedPlace?.lon)
            setMapPosition({lat,lng})
            setIsOpen(false);
            setShowResult(false);
        }
    },[selectedPlace])


     const handleMapPositionChange = (pos) => {
        setMapChange(true);
            setMapPosition(pos);
            setIsOpen(false);
            setTimeout(async () => {
                try {
                    const place = await reverseCoords(pos);
                    console.log(place);
                    let payload = {
                        displayName:place.displayName,
                        lat:Number(place.lat),
                        lon:Number(place.lng)
                    }
                    setSelectedPlace(payload);
                    setPlaceOptions([]);
                } catch(err) {
                    setSuggestions([]);
                    setPlaceOptions([]);
                }
            }, 600);
        };

    const onPlaceSelect = (place) => {
       setSelectedPlace(suggestions.find((s) => s.displayName == place ))
    }
   
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="flex items-center gap-2 text-[#111827] font-semibold mb-5">
            <MapPin size={18} className="text-[#0A6E5C]" />
            {SectionName}
        </h2>

    {/* Input Field */}
        <div className="flex flex-col items-center justify-center ">
            <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" name="" id="" className=' w-full max-w-5xl rounded-[18px] border border-[#E5E7EB] bg-[#F9FAFB] px-6 py-2 text-[16px] font-normal text-[#111827] placeholder:text-[#9CA3AF] shadow-sm outline-none transition focus:border-[#0A6E5C] focus:ring-4 focus:ring-[#0A6E5C]/10' />
            {(isOpen && showResult)&&
                <DropDownUnRegister options={placeOptions} onValueSelect={onPlaceSelect}/>
            }{( !!searchText && suggestions.length < 1 && showResult) && 
                <div>No results found</div>
            }
        </div>
    
    {  /* MAP */}
        <div className="relative rounded-xl overflow-hidden border border-gray-200 min-h-[180px] mt-3">
            <Map
                position={mapPosition}
                setPosition={handleMapPositionChange}
                height="180px"
                showButton={false}
            />
        </div>
    </div>
  )
}

export default LocationSelection
