import './Home.css';
import {useEffect, useState, useRef} from "react";
import {NavLink} from "react-router";

import Timer, {type TimerData} from "../components/home/Timer.tsx";
import SettingModal from "../components/home/SettingModal.tsx";
import LabelSelector from "../components/home/LabelSelector.tsx";
import Counter from "../components/home/Counter.tsx";
import {useLabels} from "../hooks/useLabels";
import {useTimerSettings} from "../hooks/useTimerSettings";

const SECONDS_PER_MINUTE = 60;
const LOCAL_STORAGE_KEY_HISTORY = 'timerHistory';

function Home() {
    const [timestamp] = useState<number>((): number => Date.now());
    const blinkIntervalRef = useRef<number | null>(null);

    const {
        selectedOption,
        availableOptions,
        savePreference,
        addCustomOption,
        removeOption
    } = useTimerSettings();

    const timeAmount: number = selectedOption.value * SECONDS_PER_MINUTE;
    const [finishedTimers, setFinishedTimers] = useState<TimerData[]>(() => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const {labels, activeLabel, handleLabelChange} = useLabels();

    const stopBlinking = (): void => {
        if (blinkIntervalRef.current) {
            clearInterval(blinkIntervalRef.current);
            blinkIntervalRef.current = null;
        }
        document.title = "timer";
    };

    const startBlinking = (): void => {
        stopBlinking();
        let isAlert: boolean = true;
        blinkIntervalRef.current = window.setInterval(() => {
            document.title = isAlert ? "⚠️ TIMER! ⚠️" : "timer";
            isAlert = !isAlert;
        }, 1000);
    };

    useEffect(() => {
        return () => stopBlinking();
    }, []);

    const handleTimerFinish = (data: TimerData): void => {
        setFinishedTimers((prev) => [...prev, data]);
        startBlinking();

        console.log("Notification!");
    };

    const handleTimerReset = (data: TimerData): void => {
        setFinishedTimers((prev) => [...prev, data]);
        stopBlinking();
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                stopBlinking();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect((): void => {
        localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(finishedTimers));
    }, [finishedTimers]);

    return (
        <div>
            <Timer
                key={timeAmount}
                timeAmount={timeAmount}
                label={activeLabel}
                timestamp={timestamp}
                onFinish={handleTimerFinish}
                onReset={handleTimerReset}
            />
            <div className="absolute bottom-[2%] right-[2%] flex items-center gap-2">
                <LabelSelector
                    value={activeLabel}
                    onChange={handleLabelChange}
                    options={labels}
                />
                <Counter count={finishedTimers.length}/>
            </div>
            <div className="absolute bottom-[2%] left-[2%] flex items-center gap-2">
                <SettingModal
                    selectedOption={selectedOption}
                    availableOptions={availableOptions}
                    onSelect={savePreference}
                    onAddCustom={addCustomOption}
                    onRemove={removeOption}
                />
                <NavLink to={"/history"}>History</NavLink>
            </div>
        </div>
    );
}

export default Home
