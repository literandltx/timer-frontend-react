import './Home.css'
import {useEffect, useState, useRef} from "react";
import {NavLink} from "react-router";

import Timer, {type TimerData} from "../components/home/Timer.tsx";
import SettingModal from "../components/home/SettingModal.tsx";
import LabelSelector from "../components/home/LabelSelector.tsx";
import Counter from "../components/home/Counter.tsx";

const SECONDS_PER_MINUTE = 60;
const DEFAULT_DURATION_MINUTES = 40;
const LOCAL_STORAGE_KEY_PREF = 'user_timer_preference';
const LOCAL_STORAGE_KEY_HISTORY = 'timerHistory';
const LOCAL_STORAGE_KEY_OPTIONS = 'timer_label_options';

function Home() {
    const [timestamp] = useState<number>((): number => Date.now());
    const blinkIntervalRef = useRef<number | null>(null);

    const [timeAmount, setTimeAmount] = useState<number>((): number => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_PREF);
            return saved ? parseInt(saved, 10) * SECONDS_PER_MINUTE : DEFAULT_DURATION_MINUTES * SECONDS_PER_MINUTE;
        }
        return DEFAULT_DURATION_MINUTES * SECONDS_PER_MINUTE;
    });

    const [labels, setLabels] = useState<string[]>(() => {
        const defaultOptions: string[] = ['Focus', 'Learn', 'Recharge']
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_OPTIONS);
            return saved ? JSON.parse(saved) : defaultOptions;
        }
        return defaultOptions;
    });
    const [label, setLabel] = useState(labels[0]);

    const [finishedTimers, setFinishedTimers] = useState<TimerData[]>(() => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

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

    const handleTimeChange = (minutes: number): void => {
        setTimeAmount(minutes * SECONDS_PER_MINUTE);
    };

    const handleStatusChange = (selectedValue: string): void => {
        if (selectedValue === 'ADD_NEW') {
            const newLabel: string | null = window.prompt("Enter a new label name:", "Label");

            if (newLabel && newLabel.trim() !== "") {
                setLabels((prev) => [...prev, newLabel]);
                setLabel(newLabel);
            }
            return;
        }

        if (selectedValue === 'DELETE_CURRENT') {
            const confirmDelete: boolean = window.confirm(`Are you sure you want to delete "${label}"?`);

            if (confirmDelete) {
                setLabels((prev) => prev.filter((opt) => opt !== label));
                setLabel("");
            }
            return;
        }

        setLabel(selectedValue);
    };

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

    useEffect((): void => {
        localStorage.setItem(LOCAL_STORAGE_KEY_OPTIONS, JSON.stringify(labels));
    }, [labels]);

    return (
        <div>
            <Timer
                key={timeAmount}
                timeAmount={timeAmount}
                label={label}
                timestamp={timestamp}
                onFinish={handleTimerFinish}
                onReset={handleTimerReset}
            />
            <div className="absolute bottom-[2%] right-[2%] flex items-center gap-2">
                <LabelSelector
                    value={label}
                    onChange={handleStatusChange}
                    options={labels}
                />
                <Counter count={finishedTimers.length}/>
            </div>
            <div className="absolute bottom-[2%] left-[2%] flex items-center gap-2">
                <SettingModal onTimeChange={handleTimeChange}/>
                <NavLink to={"/history"}>History</NavLink>
            </div>
        </div>
    );
}

export default Home
