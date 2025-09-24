import { useEffect, useState } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        function handler(e: MediaQueryListEvent) { setIsMobile(e.matches) };

        setIsMobile(mq.matches);
        mq.addEventListener("change", handler);

        return () => mq.removeEventListener("change", handler);
    }, []);

    return isMobile;
}

