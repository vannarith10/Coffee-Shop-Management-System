import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTheTop () {
    const location = useLocation();
    // const path = location.pathname;

    useEffect(() => {
        if (location.state?.preserveScroll) return;

        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location]);

    return null;
}