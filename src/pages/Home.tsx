import './Home.css'
import {useEffect, useState} from "react";
import CountdownTimer, {type TimerData} from "../components/Timer.tsx";
import SettingModal from "../components/SettingModal.tsx";
import LabelSelector from "../components/LabelSelector.tsx";
import Counter from "../components/Counter.tsx";
import {NavLink} from "react-router";

const SECONDS_PER_MINUTE = 60;
const DEFAULT_DURATION_MINUTES = 40;
const LOCAL_STORAGE_KEY_PREF = 'user_timer_preference';
const LOCAL_STORAGE_KEY_HISTORY = 'timerHistory';

function Home() {
    const [timestamp] = useState<number>(() => Date.now());

    const [timeAmount, setTimeAmount] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREF);
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

    const handleTimeChange = (minutes: number) => {
        setTimeAmount(minutes * SECONDS_PER_MINUTE);
    };

    const handleStatusChange = (selectedValue: string) => {
        if (selectedValue === 'ADD_NEW') {
            const newLabel: string | null = window.prompt("Enter a new label name:", "Label");

            if (newLabel && newLabel.trim() !== "") {
                setOptions((prev) => [...prev, newLabel]);
                setLabel(newLabel);
            }
        } else {
            setLabel(selectedValue);
        }
    };

    const handleTimerFinish = (data: TimerData) => {
        setFinishedTimers((prev) => [...prev, data]);
    };

    const handleTimerReset = (data: TimerData) => {
        setFinishedTimers((prev) => [...prev, data]);
    };

    useEffect(() => {
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