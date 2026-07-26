import React, { useEffect, useState } from 'react'
import useDebounce from '../../customHooks/useDebounce'
import { searchPlaces } from '../../services/searchPlaces'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const LocationSelection = () => {

    const [searchText, setSearchText] = useState("");
    const [placeOptions, setPlaceOptions] = useState([])
    const [selectedPlace, setSelectedPlace] = useState(null)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const debouncedSearch  = useDebounce({ searchText, delay: 500 })

    // useEffect(() => {

    //     const getPlaces = async () => {
    //          const places = await searchPlaces(debouncedSearch);
    //         console.log("Places fetched:", places);
    //         setPlaceOptions([]); 
    //         setPlaceOptions(places);
    //     }
    //     getPlaces()
    // }, [debouncedSearch ])

    // useEffect(() => {

    //     const place = placeOptions.find(
    //         p => p.displayName === selectedValue
    //     );

    //     if (!place) return;

    //     handleSelect(place);

    // }, [selectedValue]);

    // const handleSelect  = (place) => {
    //     setSelectedPlace(place);
    //     setSearchText(place.displayName);
    //     console.log("Selected place:", place);
    // }

    useEffect(() => {

        if (debouncedSearch.length < 3) {
            setPlaceOptions([]);
            return;
        }

        const getPlaces = async () => {
            setOpen(true);
            setLoading(true);
            const places = await searchPlaces(debouncedSearch);
            setPlaceOptions(places);
            setLoading(false);
        };

        getPlaces();

    }, [debouncedSearch]);

    const handleSelect = (place) => {
       
        setSelectedPlace(place);
        setSearchText(place.displayName);
        setOpen(false);
        console.log(place);

    }

  return (
    <div className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <Input
                        type="text"
                        value={searchText}
                        placeholder="Search for a location..."
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                        className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            pl-11
                            pr-4
                            text-sm
                            shadow-sm
                            outline-none
                            transition-all
                            focus:border-emerald-500
                            focus:ring-2
                            focus:ring-emerald-200
                        "
                    />
                </div>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={6}
                className="w-[var(--radix-popover-trigger-width)] rounded-xl p-2 shadow-xl"
            >
                <Command>
                    <CommandList>
                        <CommandEmpty>
                            No locations found
                        </CommandEmpty>

                        <CommandGroup>
                            {placeOptions.map((place) => (
                                <CommandItem
                                    key={place.id}
                                    value={place.displayName}
                                    onSelect={() => handleSelect(place)}
                                    className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3"
                                >

                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                            {place.address.city ||
                                                place.address.town ||
                                                place.address.village ||
                                                place.address.suburb ||
                                                place.displayName.split(",")[0]}
                                        </span>

                                        <span className="text-xs text-gray-500 line-clamp-2">
                                            {place.displayName}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    </div>
  )
}

export default LocationSelection