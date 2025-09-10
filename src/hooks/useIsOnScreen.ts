import { useEffect, useState, type RefObject } from 'react';

// The hook now returns boolean OR null
function useIsOnScreen(ref: RefObject<HTMLElement | null>): boolean | null {
    // 1. Initialize state to null. This represents the "unknown" state.
    const [isOnScreen, setIsOnScreen] = useState<boolean | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // 2. Once the observer fires, the state will always be a boolean.
                setIsOnScreen(entry.isIntersecting);
            },
            { threshold: 0 }
        );

        const currentElement = ref.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [ref]);

    return isOnScreen;
}

export default useIsOnScreen;
