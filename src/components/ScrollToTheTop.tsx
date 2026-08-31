import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTheTop () {
    const location = useLocation();
    const path = location.pathname;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [path]);

    return null;
}