import './Home.css'
import CountdownTimer, {type TimerData} from "../components/Timer.tsx";
import {useEffect, useState} from "react";
import SettingModal from "../components/SettingModal.tsx";
import LabelSelector from "../components/LabelSelector.tsx";
import Counter from "../components/Counter.tsx";
import HistoryList from "../components/History.tsx";

const initialSeconds: number = 5

function Home() {
    const [timestamp] = useState<number>(() => Date.now());

    const [options, setOptions] = useState<string[]>(['Active', 'Paused', 'Delayed', 'Canceled'])
    const [label, setLabel] = useState(options[0]);

    const [finishedTimers, setFinishedTimers] = useState<TimerData[]>(() => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem('timerHistory');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

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

    const clearHistory = () => {
        if (confirm("Are you sure you want to delete all history?")) {
            setFinishedTimers([]); // This triggers useEffect to save "[]" to localStorage
        }
    };

    useEffect(() => {
        localStorage.setItem('timerHistory', JSON.stringify(finishedTimers));
    }, [finishedTimers]);

    return (
        <div>
            <CountdownTimer
                timeAmount={initialSeconds}
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
            <HistoryList
                history={finishedTimers}
                onClear={clearHistory}
            />
            <SettingModal/>
        </div>
    );
}

export default Home
