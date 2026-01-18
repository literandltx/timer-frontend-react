import {useRef, useEffect, useCallback} from "react";

export const useTabNotification = (defaultTitle: string = "timer") => {
    const blinkIntervalRef = useRef<number | null>(null);

    const stopBlinking = useCallback((): void => {
        if (blinkIntervalRef.current) {
            clearInterval(blinkIntervalRef.current);
            blinkIntervalRef.current = null;
        }
        document.title = defaultTitle;
    }, [defaultTitle]);

    const startBlinking = useCallback((alertTitle: string = "⚠️ TIMER! ⚠️"): void => {
        stopBlinking(); // Ensure no existing interval
        let isAlert: boolean = true;

        blinkIntervalRef.current = window.setInterval(() => {
            document.title = isAlert ? alertTitle : defaultTitle;
            isAlert = !isAlert;
        }, 1000);
    }, [stopBlinking, defaultTitle]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopBlinking();
    }, [stopBlinking]);

    // Handle visibility change (stop blinking when user comes back to tab)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                stopBlinking();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [stopBlinking]);

    return {startBlinking, stopBlinking};
};