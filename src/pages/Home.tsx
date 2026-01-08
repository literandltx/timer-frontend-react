import './Home.css'
import {useEffect, useState} from "react";
import {NavLink} from "react-router";

import CountdownTimer, {type TimerData} from "../components/Timer.tsx";
import SettingModal from "../components/SettingModal.tsx";
import LabelSelector from "../components/LabelSelector.tsx";
import Counter from "../components/Counter.tsx";

const SECONDS_PER_MINUTE = 60;
const DEFAULT_DURATION_MINUTES = 40;
const LOCAL_STORAGE_KEY_PREF = 'user_timer_preference';
const LOCAL_STORAGE_KEY_HISTORY = 'timerHistory';

function Home() {
    const [timestamp] = useState<number>((): number => Date.now());

    const [timeAmount, setTimeAmount] = useState<number>((): number => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_PREF);
            return saved ? parseInt(saved, 10) * SECONDS_PER_MINUTE : DEFAULT_DURATION_MINUTES * SECONDS_PER_MINUTE;
        }
        return DEFAULT_DURATION_MINUTES * SECONDS_PER_MINUTE;
    });

    const [options, setOptions] = useState<string[]>(['Active', 'Paused', 'Delayed', 'Canceled'])
    const [label, setLabel] = useState(options[0]);

    const [finishedTimers, setFinishedTimers] = useState<TimerData[]>(() => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const handleTimeChange = (minutes: number): void => {
        setTimeAmount(minutes * SECONDS_PER_MINUTE);
    };

    const handleStatusChange = (selectedValue: string): void => {
        if (selectedValue === 'ADD_NEW') {
            const newLabel: string | null = window.prompt("Enter a new label name:", "Label");

            if (newLabel && newLabel.trim() !== "") {
                setOptions((prev) => [...prev, newLabel]);
                setLabel(newLabel);
            }
            return;
        }

        if (selectedValue === 'DELETE_CURRENT') {
            const confirmDelete: boolean = window.confirm(`Are you sure you want to delete "${label}"?`);

            if (confirmDelete) {
                setOptions((prev) => prev.filter((opt) => opt !== label));
                setLabel("");
            }
            return;
        }

        setLabel(selectedValue);
    };

    const handleTimerFinish = (data: TimerData): void => {
        setFinishedTimers((prev) => [...prev, data]);
    };

    const handleTimerReset = (data: TimerData): void => {
        setFinishedTimers((prev) => [...prev, data]);
    };

    useEffect((): void => {
        localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(finishedTimers));
    }, [finishedTimers]);

    return (
        <div>
            <CountdownTimer
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
                    options={options}
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
