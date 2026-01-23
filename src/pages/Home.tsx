import './Home.css';
import {useState} from "react";
import Timer from "../components/home/Timer.tsx";
import LabelSelector from "../components/home/LabelSelector.tsx";
import Sidebar from "../components/home/Sidebar.tsx";
import {useLabels} from "../hooks/useLabels";
import {useTimerSettings} from "../hooks/useTimerSettings";
import {useTimerHistory} from "../hooks/useTimerHistory";
import {useTabNotification} from "../hooks/useTabNotification";
import type {TimerData} from "../types/timer.ts";

const SECONDS_PER_MINUTE = 60;

function Home() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [timestamp] = useState<number>((): number => Date.now());
    const {startBlinking, stopBlinking} = useTabNotification("timer");

    const {
        selectedOption,
        availableOptions,
        savePreference,
        addCustomOption,
        removeOption
    } = useTimerSettings();
    const {addTimer} = useTimerHistory();

    const timeAmount: number = selectedOption.value * SECONDS_PER_MINUTE;
    const {labels, activeLabel, handleLabelChange} = useLabels();

    const handleTimerFinish = (data: TimerData): void => {
        addTimer(data);
        startBlinking();
        console.log("Notification!");
    };

    const handleTimerReset = (data: TimerData): void => {
        addTimer(data);
        stopBlinking();
    };

    return (
        <div
            // className="fixed inset-0 w-screen h-screen bg-[#1a1a1a] text-white overflow-hidden"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-6 left-6 z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Open Menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                     strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                selectedOption={selectedOption}
                availableOptions={availableOptions}
                onSelect={savePreference}
                onAddCustom={addCustomOption}
                onRemove={removeOption}
            />

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
            </div>
        </div>
    );
}

export default Home;
