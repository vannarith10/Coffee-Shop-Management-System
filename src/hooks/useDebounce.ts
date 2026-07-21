import { useEffect, useState } from "react";



export function useDebounce<T>(value: T, delay: number = 500) {

    const [debounceValue, setDebounceValue] = useState(value);

    // When user types something, it will set 500ms before setDebounceValue
    // And if user continue typing before the timer finished, it will reset the timer again
    // Until users stop typing and the 500ms finished, setDebounceValue() will be executed
    // This will prevent sending request every a letter changes to the server
    // It will send a request as long as user stop typing for 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, delay)

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounceValue;
}