import { useState } from 'react'
import { useEffect } from 'react'

const useDebounce = ({ searchText = "", delay = 500 }) => {
    const [debounceText, setDebounceText] = useState("")
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceText(searchText)
        }, delay);

        return () => clearTimeout(timer)

    }, [searchText, delay])

    // console.log("debounce : ", debounceText)
    return debounceText
}

export default useDebounce